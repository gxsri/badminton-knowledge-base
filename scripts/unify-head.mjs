#!/usr/bin/env node
/* 全站 <head> 统一 pass（幂等，可重复执行）：
 *   1. 每页补充 <meta name="description">（docs 页取登记表 desc；首页用站点简介）
 *   2. 每页补充内联 SVG favicon（🏸）
 *   3. 每个 <style> 末尾追加 @media print 打印配色（深色主题 → 白底黑字）
 * 用法: node scripts/unify-head.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='88'%3E🏸%3C/text%3E%3C/svg%3E";
const PRINT_CSS = `        @media print {
            :root { --bg:#ffffff; --surface:#f4f4f5; --surface-2:#e4e4e7; --border:#d4d4d8; --text:#18181b; --text-2:#3f3f46; --accent:#be123c; --accent-2:#9f1239; --green:#15803d; --blue:#1d4ed8; --purple:#6d28d9; --orange:#c2410c; --yellow:#a16207; --indigo:#4338ca; }
            .back, .next, .cta, .search-hints, .search-box, .fitness-actions, nav { display: none !important; }
            body { background: #fff; }
            .content, .section, .hero-content { max-width: 100%; }
            a { color: inherit; text-decoration: none; }
        }`;

const data = readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8');
const descByFile = {};
for (const m of data.matchAll(/file:\s*'([^']+)',\s*group:\s*'([^']+)',\s*title:\s*'([^']*)',\s*desc:\s*'([^']*)'/g)) {
    descByFile[m[1]] = m[4].replace(/"/g, '');
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function patchFile(path, description) {
    let t = readFileSync(path, 'utf8');
    let changed = false;
    if (!/<meta name="description"/.test(t)) {
        const meta = `    <meta name="description" content="${esc(description)}">\n`;
        t = t.replace(/<meta charset="UTF-8">\n/, '<meta charset="UTF-8">\n' + meta);
        changed = true;
    }
    if (!/rel="icon"/.test(t)) {
        t = t.replace(/<meta name="description"[\s\S]*?>\n/, '$&\n    <link rel="icon" href="' + FAVICON + '">');
        changed = true;
    }
    if (!/@media print/.test(t)) {
        const i = t.lastIndexOf('</style>');
        if (i > -1) { t = t.slice(0, i) + PRINT_CSS + '\n    ' + t.slice(i); changed = true; }
    }
    if (changed) { writeFileSync(path, t); console.log('patched head:', path); }
}

const files = readdirSync(DOCS).filter(f => f.endsWith('.html'));
for (const f of files) {
    const desc = descByFile[f];
    if (!desc) { console.log('skip(no registry desc):', f); continue; }
    patchFile(resolve(DOCS, f), desc);
}
patchFile(resolve(ROOT, 'index.html'), '羽毛球职业训练系统 — 基于NSCA CSCS体系的8级渐进式羽毛球训练系统：技术、体能、健身、战术、心理、营养与康复，42篇文档全流程覆盖。');
console.log('done');
