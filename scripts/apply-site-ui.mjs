#!/usr/bin/env node
/* 为根 index.html 与 docs/*.html 注入共享视觉增强层（幂等）。
 * 注入内容：主题引导内联脚本（防闪烁）+ site-ui.css + site-ui.js
 * 用法: node scripts/apply-site-ui.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function block(base) {
    return `    <!-- site-ui: 主题引导（防止浅色主题闪烁） -->
    <script>try{var t=localStorage.getItem('bl-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
    <link rel="stylesheet" href="${base}assets/site-ui.css">
    <script src="${base}assets/site-ui.js" defer></script>
`;
}

function patch(path, base) {
    let t = readFileSync(path, 'utf8');
    if (t.includes('site-ui.css')) return false;
    const i = t.lastIndexOf('</head>');
    if (i < 0) return false;
    t = t.slice(0, i) + block(base) + t.slice(i);
    writeFileSync(path, t);
    return true;
}

let n = 0;
if (patch(resolve(ROOT, 'index.html'), '')) { console.log('patched index.html'); n++; }
for (const f of readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html'))) {
    if (patch(resolve(ROOT, 'docs', f), '../')) { console.log('patched docs/' + f); n++; }
}
console.log(`done: ${n} 个页面已注入视觉增强层`);
