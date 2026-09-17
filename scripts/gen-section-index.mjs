#!/usr/bin/env node
/* 生成 docs-sections.js：每页的「小节索引」（h2 及其下属 h3），供搜索页做小节级深链。
 * 依赖 scripts/gen-anchors.mjs 先给 h2 补好 id。幂等，可反复运行。
 * 用法: node scripts/gen-section-index.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const OUT = resolve(ROOT, 'docs-sections.js');

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{2600}-\u{26FF}]/gu;
const TXT = (s) => s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(EMOJI, '')
    .replace(/\s+/g, ' ')
    .trim();
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

const files = readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html')).sort();
const index = {};
let sections = 0, subs = 0;

for (const f of files) {
    const html = readFileSync(resolve(ROOT, 'docs', f), 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
    const heads = [...html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g)];
    const list = [];
    heads.forEach((m, i) => {
        const id = (m[1].match(/\bid="([^"]+)"/) || [])[1];
        if (!id) return;
        const title = TXT(m[2]);
        if (!title) return;
        const segEnd = i + 1 < heads.length ? heads[i + 1].index : html.length;
        const seg = html.slice(m.index + m[0].length, segEnd);
        const sub = [...seg.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)]
            .map(x => TXT(x[1])).filter(Boolean).slice(0, 5).map(t => clip(t, 28));
        /* 关键词：小节内加粗的字段名（强度/恢复/进阶触发…）+ 前两段正文，让「深蹲」「泡沫轴」这类词也能被搜到 */
        const strongs = [...seg.matchAll(/<strong>([\s\S]*?)<\/strong>/g)].map(x => TXT(x[1])).filter(Boolean);
        const paras = [...seg.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(x => TXT(x[1])).filter(x => x.length > 8);
        const kws = [];
        for (const src2 of [strongs, paras]) {
            for (const raw of src2) {
                const piece = clip(raw.replace(/[：:]\s*$/, ''), 22);
                if (piece.length < 3) continue;
                if (kws.some(x => x.includes(piece) || piece.includes(x))) continue;
                kws.push(piece);
                if (kws.length >= 8) break;
            }
            if (kws.length >= 8) break;
        }
        subs += sub.length; sections++;
        const entry = { i: id, t: clip(title, 40) };
        if (sub.length) entry.s = sub;
        if (kws.length) entry.k = kws;
        list.push(entry);
    });
    if (list.length) index[f] = list;
}

const banner = `/*
 * 羽毛球职业训练系统 — 小节索引（自动生成，请勿手改）
 * 生成：node scripts/gen-section-index.mjs（改完页面后重跑；tests/regression.mjs 会校验是否同步）
 * 用途：搜索页把关键词直接命中到「某页的某一节」，并深链到 #锚点。
 */
`;
const body = `(function (g) {\n    g.DOC_SECTIONS = ${JSON.stringify(index, null, 0).replace(/\},\{/g, '},\n            {')};\n})(window);\n`;

const out = banner + body;
const prev = (() => { try { return readFileSync(OUT, 'utf8'); } catch { return ''; } })();
const changed = prev !== out;
if (!DRY && changed) writeFileSync(OUT, out, 'utf8');
console.log(`${DRY ? '（试运行）' : ''}${Object.keys(index).length} 页 · ${sections} 个小节 · ${subs} 条子标题 · ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB${changed ? '' : '（无变化）'}`);
