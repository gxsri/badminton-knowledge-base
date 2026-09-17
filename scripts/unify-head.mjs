#!/usr/bin/env node
/* 全站 <head> 统一 pass（幂等，可重复执行）：
 *   1. <meta name="description">（docs 页取登记表 desc；首页用站点简介）
 *   2. 内联 SVG favicon（🏸）
 *   3. color-scheme / theme-color（浏览器 UI 与表单控件配色）
 *   4. Open Graph（og:title/description/type/locale/url，便于分享）
 *   5. Google Fonts preconnect（仅当页面引用字体时）
 *   6. 每个 <style> 末尾追加 @media print 打印配色
 * 用法: node scripts/unify-head.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');
const SITE = 'https://gxsri.github.io/badminton-knowledge-base/';
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='88'%3E🏸%3C/text%3E%3C/svg%3E";
const PRINT_CSS = `        @media print {
            :root { --bg:#ffffff; --surface:#f4f4f5; --surface-2:#e4e4e7; --border:#d4d4d8; --text:#18181b; --text-2:#3f3f46; --accent:#be123c; --accent-2:#9f1239; --green:#15803d; --blue:#1d4ed8; --purple:#6d28d9; --orange:#c2410c; --yellow:#a16207; --indigo:#4338ca; }
            .back, .next, .cta, .search-hints, .search-box, .fitness-actions, nav { display: none !important; }
            body { background: #fff; }
            .content, .section, .hero-content { max-width: 100%; }
            a { color: inherit; text-decoration: none; }
        }`;

/* 登记表：文件名 → { title, desc } */
const data = readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8');
const meta = {};
for (const m of data.matchAll(/num:\s*'([^']+)',\s*file:\s*'([^']+)',\s*group:\s*'([^']+)',\s*title:\s*'([^']*)',\s*desc:\s*'([^']*)'/g)) {
    meta[m[2]] = { title: m[4], desc: m[5] };
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function patchFile(path, description, ogUrl, isDocs) {
    let t = readFileSync(path, 'utf8');
    const orig = t;
    const title = (t.match(/<title>(.*?)<\/title>/) || [])[1] || '羽毛球职业训练系统';

    if (!/<meta name="description"/.test(t)) {
        t = t.replace(/<meta charset="UTF-8">\n/, `<meta charset="UTF-8">\n    <meta name="description" content="${esc(description)}">\n`);
    }
    if (!/rel="icon"/.test(t)) {
        t = t.replace(/<meta name="description"[\s\S]*?>\n/, `$&\n    <link rel="icon" href="${FAVICON}">`);
    }
    if (!/name="color-scheme"/.test(t) && /<meta name="viewport"[^>]*>\n/.test(t)) {
        t = t.replace(/<meta name="viewport"[^>]*>\n/,
            `$&\n    <meta name="color-scheme" content="dark light">\n` +
            `    <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)">\n` +
            `    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">\n`);
    }
    if (!/property="og:title"/.test(t)) {
        const og = `    <meta property="og:title" content="${esc(title)}">\n` +
            `    <meta property="og:description" content="${esc(description)}">\n` +
            `    <meta property="og:type" content="${isDocs ? 'article' : 'website'}">\n` +
            `    <meta property="og:locale" content="zh_CN">\n` +
            `    <meta property="og:url" content="${ogUrl}">\n`;
        t = t.replace(/<meta name="description"[\s\S]*?>\n/, `$&${og}`);
    }
    if (/fonts\.googleapis\.com/.test(t) && !/rel="preconnect"/.test(t)) {
        t = t.replace(/(\s*)<link href="https:\/\/fonts\.googleapis\.com/,
            `\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n` +
            `    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>$1<link href="https://fonts.googleapis.com`);
    }
    if (!/@media print/.test(t)) {
        const i = t.lastIndexOf('</style>');
        if (i > -1) t = t.slice(0, i) + PRINT_CSS + '\n    ' + t.slice(i);
    }
    if (t !== orig) { writeFileSync(path, t); return true; }
    return false;
}

let n = 0;
for (const f of readdirSync(DOCS).filter(f => f.endsWith('.html'))) {
    const m = meta[f];
    if (!m) { console.log('skip(未登记):', f); continue; }
    if (patchFile(resolve(DOCS, f), m.desc, SITE + 'docs/' + f, true)) { console.log('patched head:', f); n++; }
}
const idxDesc = '羽毛球职业训练系统 — 基于NSCA CSCS体系的8级渐进式羽毛球训练系统：技术、体能、健身、战术、心理、营养与康复，51篇文档全流程覆盖。';
if (patchFile(resolve(ROOT, 'index.html'), idxDesc, SITE, false)) { console.log('patched head: index.html'); n++; }
console.log('done:', n, '个文件');
