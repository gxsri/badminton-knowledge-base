#!/usr/bin/env node
/* 统一站点级 SEO / 社交分享元数据（幂等，可反复运行）：
 *   1. <link rel="canonical">（消掉 ?mode=simple 这类查询串的重复内容问题）
 *   2. og:image / og:image:width|height / og:site_name / twitter:*（此前完全没有分享图）
 *   3. meta description 与 og:description 过短（<50 字）或过长（>160 字）时按登记表重写，两者保持一致
 * 用法: node scripts/gen-meta.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const SITE = 'https://gxsri.github.io/badminton-knowledge-base/';
const OG_IMAGE = SITE + 'images/og-cover.png';
const SUFFIX = '｜含基础/进阶/精英三档处方、自测达标线、错误纠正与安全边界；羽毛球职业训练系统（NSCA CSCS 体系）';
const SHORT_SUFFIX = '｜羽毛球职业训练系统：三档处方、自测达标线与安全边界';

/* 读登记表（唯一数据源） */
const reg = {};
const dataSrc = readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8');
for (const m of dataSrc.matchAll(/file:\s*'([^']+)'[\s\S]{0,400}?title:\s*'([^']*)'[\s\S]{0,80}?desc:\s*'([^']*)'/g)) {
    reg[m[1]] = { title: m[2], desc: m[3] };
}

function buildDesc(title, desc) {
    const base = `${title}｜${desc}`.replace(/。$/, '');
    if (base.length + SUFFIX.length <= 158) return base + SUFFIX;
    if (base.length >= 50) return base.slice(0, 158);
    return base + SHORT_SUFFIX;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const files = ['index.html', ...readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html')).map(f => 'docs/' + f)];
let touched = 0;
const report = [];

for (const rel of files) {
    const path = resolve(ROOT, rel);
    const src = readFileSync(path, 'utf8');
    const lines = src.split('\n');
    const headEnd = lines.findIndex(l => /<\/head>/.test(l));
    if (headEnd < 0) continue;

    const url = rel === 'index.html' ? SITE : SITE + rel;
    const entry = reg[rel.replace('docs/', '')];

    /* 目标描述文本 */
    let desc = null;
    if (entry) {
        desc = buildDesc(entry.title, entry.desc);
    } else {
        const cur = (src.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
        if (cur.length < 50 || cur.length > 160) desc = buildDesc('羽毛球职业训练系统', cur);
    }

    const setLine = (re, make) => {
        const i = lines.findIndex((l, idx) => idx < headEnd && re.test(l));
        if (i < 0) return false;
        const next = make();
        if (lines[i] !== next) lines[i] = next;
        return true;
    };

    /* 1) 先清掉旧的 canonical / 分享图 / twitter 行，避免重复与顺序混乱 */
    const DROP = /(<link rel="canonical")|(property="og:image)|(property="og:site_name")|(name="twitter:)/;
    for (let i = headEnd - 1; i >= 0; i--) if (DROP.test(lines[i])) lines.splice(i, 1);

    /* 2) canonical 紧跟 charset */
    const canonical = `    <link rel="canonical" href="${url}">`;
    const csAt = lines.findIndex((l, idx) => idx < headEnd && /<meta charset/.test(l));
    if (csAt >= 0) lines.splice(csAt + 1, 0, canonical);

    /* 3) og:url 规范化，并同步描述 */
    setLine(/property="og:url"/, () => `    <meta property="og:url" content="${url}">`);
    if (desc) {
        setLine(/<meta name="description"/, () => `    <meta name="description" content="${esc(desc)}">`);
        setLine(/property="og:description"/, () => `    <meta property="og:description" content="${esc(desc)}">`);
    }

    /* 4) 分享元数据统一成一块，插在 og 组之后（顺序固定，便于人工检查） */
    const title = (src.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const share = [
        '    <meta property="og:site_name" content="羽毛球职业训练系统">',
        `    <meta property="og:image" content="${OG_IMAGE}">`,
        '    <meta property="og:image:width" content="1200">',
        '    <meta property="og:image:height" content="630">',
        '    <meta name="twitter:card" content="summary_large_image">',
        title ? `    <meta name="twitter:title" content="${esc(title)}">` : null,
        desc ? `    <meta name="twitter:description" content="${esc(desc)}">` : null,
        `    <meta name="twitter:image" content="${OG_IMAGE}">`,
    ].filter(Boolean);
    let anchorAt = -1;
    lines.forEach((l, idx) => { if (idx < headEnd && /property="og:(url|locale|type|description|title)"/.test(l)) anchorAt = idx; });
    if (anchorAt >= 0) lines.splice(anchorAt + 1, 0, ...share);

    const out = lines.join('\n');
    if (out !== src) {
        touched++;
        if (DRY) report.push(`${rel}: desc=${desc ? desc.length + '字' : '保持'} canonical=${url}`);
        else writeFileSync(path, out, 'utf8');
    }
}

if (DRY) report.slice(0, 8).forEach(r => console.log(r));
console.log(`${DRY ? '（试运行）' : ''}扫描 ${files.length} 页 · 更新 ${touched} 页`);
