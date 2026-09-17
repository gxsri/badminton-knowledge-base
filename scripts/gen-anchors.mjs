#!/usr/bin/env node
/* 给所有 <h2> 补稳定 id（现有 id 不动），并给分层处方的 .rx-grid / 三档卡片补 id。
 * 目的：可分享深链、TOC 复用稳定锚点、搜索页能跳到小节、SEO 更友好。
 * 幂等，可反复运行；只改 <script> 之外的静态标签。用法: node scripts/gen-anchors.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const TXT = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
/* 标题里常有 emoji / 箭头做装饰（🧩 分层处方、错误 → 原因），匹配与生成 id 前先剥掉，避免 id 变成「分层处方」而不是约定的 rx */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{2600}-\u{26FF}]/gu;
const DECOR = (s) => TXT(s).replace(EMOJI, '').replace(/^[\s·•\-—–_|]+|[\s·•\-—–_|]+$/g, '').trim();

/* 章节名 → 固定拉丁 id（与站内既有的 #rx/#selftest/#errors/#elite/#boundary 风格统一）
 * 只给「跨页都会出现、需要被别的页面引用」的标准区块固定 id；其余章节用可读的中文章节名做 id。 */
const CURATED = [
    [/^分层处方/, 'rx'],
    [/^自测与进阶标准|^自测标准/, 'selftest'],
    [/^错误\s*(→|->)[\s\S]*纠正|^常见错误/, 'errors'],
    [/^精英细节/, 'elite'],
    [/^安全(边界|与适用边界)/, 'boundary'],
    [/^依据说明|^参数依据/, 'sources'],
    [/^常见问题|^FAQ/i, 'faq'],
    [/^相关(阅读|文档|页面)/, 'related'],
    [/^(一句话|先看)结论|^速览/, 'tldr'],
    [/^本页(目录|导航)|^目录/, 'toc'],
];

function slugify(text, used) {
    for (const [re, id] of CURATED) if (re.test(text) && !used.has(id)) return id;
    /* 中文标题通常很长，取第一个分隔符之前的短名（“8 级体系总览：每级练多久…” → “8-级体系总览”） */
    const short = text.split(/[：:（(，,。；;·—–]|\s-\s/)[0].trim() || text;
    const base = short
        .replace(/[\s\u3000]+/g, '-')
        .replace(/[^\w\u4e00-\u9fff-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24) || 'sec';
    let id = base, n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    return id;
}

/* 把文件切成 [静态片段, <script> 片段, …]，只对静态片段做改写 */
function segments(html) {
    const parts = [];
    const re = /<script\b[\s\S]*?<\/script>/gi;
    let last = 0, m;
    while ((m = re.exec(html))) {
        parts.push([html.slice(last, m.index), true]);
        parts.push([m[0], false]);
        last = m.index + m[0].length;
    }
    parts.push([html.slice(last), true]);
    return parts;
}

const files = ['index.html', ...readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html')).map(f => 'docs/' + f)];
let touched = 0, added = 0;

for (const rel of files) {
    const path = resolve(ROOT, rel);
    const src = readFileSync(path, 'utf8');
    const used = new Set([...src.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
    const notes = [];
    let changed = false;

    const out = segments(src).map(([chunk, isStatic]) => {
        if (!isStatic) return chunk;
        let c = chunk;
        /* 1) <h2> 补 id */
        c = c.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g, (full, attrs, inner) => {
            if (/\bid=/.test(attrs)) return full;
            const text = DECOR(inner);
            const id = slugify(text, used);
            used.add(id); added++; changed = true;
            notes.push(`#${id}`);
            return `<h2 id="${id}"${attrs}>${inner}</h2>`;
        });
        /* 2) 分层处方区块 + 三档卡片补 id */
        c = c.replace(/<div class="rx-grid">/g, (full) => {
            if (used.has('rx-grid')) return full;
            used.add('rx-grid'); added++; changed = true;
            return '<div class="rx-grid" id="rx-grid">';
        });
        c = c.replace(/<div class="rx rx-(base|mid|elite)">/g, (full, tier) => {
            let id = `rx-${tier}`, n = 2;
            while (used.has(id)) id = `rx-${tier}-${n++}`;
            used.add(id); added++; changed = true;
            return `<div class="rx rx-${tier}" id="${id}">`;
        });
        return c;
    }).join('');

    if (changed) {
        touched++;
        if (DRY) console.log(`[${rel}] +${notes.length} → ${notes.slice(0, 6).join(' ')}${notes.length > 6 ? ' …' : ''}`);
        else writeFileSync(path, out, 'utf8');
    }
}

console.log(`\n${DRY ? '（试运行）' : ''}扫描 ${files.length} 个页面 · 改动 ${touched} 页 · 新增 id ${added} 个`);
