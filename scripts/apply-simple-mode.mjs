#!/usr/bin/env node
/* 为根 index.html 与 docs/*.html 注入「傻瓜化模式」资源（幂等）。
 * 注入：模式引导内联脚本（防闪烁 + 支持 ?mode=simple）+ simple-mode.css + docs-simple.js + simple-mode.js
 * 用法: node scripts/apply-simple-mode.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function block(base) {
    return `    <!-- simple-mode: 小白/专业双模式（?mode=simple 可直接进入） -->
    <script>try{var q=new URLSearchParams(location.search).get('mode');var m=q||localStorage.getItem('bl-mode');if(q==='simple'||q==='pro')localStorage.setItem('bl-mode',q);if(m==='simple')document.documentElement.setAttribute('data-mode','simple');}catch(e){}</script>
    <link rel="stylesheet" href="${base}assets/simple-mode.css">
    <script src="${base}docs-simple.js" defer></script>
    <script src="${base}assets/simple-mode.js" defer></script>
`;
}

function patch(path, base) {
    let t = readFileSync(path, 'utf8');
    if (t.includes('simple-mode.css')) return false;
    const i = t.lastIndexOf('</head>');
    if (i < 0) return false;
    writeFileSync(path, t.slice(0, i) + block(base) + t.slice(i));
    return true;
}

let n = 0;
if (patch(resolve(ROOT, 'index.html'), '')) { console.log('patched index.html'); n++; }
for (const f of readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html'))) {
    if (patch(resolve(ROOT, 'docs', f), '../')) { console.log('patched docs/' + f); n++; }
}
console.log(`done: ${n} 个页面已注入双模式资源`);
