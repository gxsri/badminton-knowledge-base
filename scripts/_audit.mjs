#!/usr/bin/env node
/* 临时：站点体检（当前门禁未覆盖的维度） */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');
const pages = ['index.html', ...readdirSync(DOCS).filter(f => f.endsWith('.html')).map(f => 'docs/' + f)];

const agg = {};
const bump = (k, v = 1) => { agg[k] = (agg[k] || 0) + v; };
const samples = {};
const add = (k, s) => { (samples[k] = samples[k] || []).push(s); };

const sizes = [];
for (const rel of pages) {
    const t = readFileSync(resolve(ROOT, rel), 'utf8');
    sizes.push([rel, Buffer.byteLength(t)]);
    const name = rel.replace('docs/', '');

    /* 图片可访问性与 CLS */
    for (const m of t.matchAll(/<img\b[^>]*>/g)) {
        const tag = m[0];
        if (!/\balt=/.test(tag)) { bump('img 缺 alt'); add('img 缺 alt', name); }
        if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) { bump('img 缺 width/height（CLS）'); add('img 缺 width/height', name); }
        if (!/loading="lazy"/.test(tag)) { bump('img 非懒加载'); add('img 非懒加载', name); }
    }
    /* 重复 id */
    const ids = [...t.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) { bump('重复 id', dup.length); add('重复 id', `${name}: ${[...new Set(dup)].slice(0, 4).join(',')}`); }
    /* h2 锚点 */
    const h2s = [...t.matchAll(/<h2(?![^>]*\bid=)[^>]*>/g)];
    if (h2s.length) { bump('h2 无 id', h2s.length); add('h2 无 id', `${name}: ${h2s.length} 个`); }
    /* 标题层级：h1 后直接 h3 等 */
    const heads = [...t.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
    let prev = 0, jumps = 0;
    for (const h of heads) { if (prev && h - prev > 1) jumps++; prev = h; }
    if (jumps) { bump('标题层级跳跃', jumps); add('标题层级跳跃', `${name}: ${jumps} 处`); }
    /* 表格语义 */
    const tables = [...t.matchAll(/<table\b[\s\S]*?<\/table>/g)].map(m => m[0]);
    for (const tb of tables) {
        if (!/<thead\b/.test(tb)) { bump('table 缺 thead'); add('table 缺 thead', name); break; }
    }
    if (tables.length && !/<th\b/.test(t)) { bump('table 缺 th'); add('table 缺 th', name); }
    /* SEO 元数据 */
    if (!/<html[^>]*\blang=/.test(t)) { bump('html 缺 lang'); add('html 缺 lang', name); }
    const desc = (t.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    if (!desc) { bump('缺 meta description'); add('缺 meta description', name); }
    else if (desc.length < 50 || desc.length > 160) { bump('description 长度异常'); add('description 长度异常', `${name}: ${desc.length}`); }
    if (!/rel="canonical"/.test(t)) { bump('缺 canonical'); add('缺 canonical', name); }
    if (!/property="og:image"/.test(t)) { bump('缺 og:image'); add('缺 og:image', name); }
    /* 可访问性：交互控件的可读名称 */
    for (const m of t.matchAll(/<button\b[^>]*>/g)) {
        if (!/aria-label=/.test(m[0]) && !/aria-expanded=/.test(m[0])) { bump('button 缺 aria-label'); add('button 缺 aria-label', name); break; }
    }
}

console.log('=== 站点体检（' + pages.length + ' 个页面）===');
for (const [k, v] of Object.entries(agg).sort((a, b) => b[1] - a[1])) console.log(`${String(v).padStart(5)}  ${k}`);
console.log('\n--- 明细（每类最多 6 条）---');
for (const [k, list] of Object.entries(samples)) console.log(`\n[${k}] ${[...new Set(list)].slice(0, 6).join(' | ')}`);

sizes.sort((a, b) => b[1] - a[1]);
console.log('\n=== 最重的 8 个页面 ===');
for (const [rel, b] of sizes.slice(0, 8)) console.log(`${(b / 1024).toFixed(0).padStart(5)} KB  ${rel}`);
console.log(`合计 ${(sizes.reduce((a, s) => a + s[1], 0) / 1024 / 1024).toFixed(2)} MB`);

/* 站点资源体积 */
let gifBytes = 0, gifN = 0;
for (const f of readdirSync(resolve(ROOT, 'images/exercises'))) {
    if (!f.endsWith('.gif')) continue;
    gifBytes += statSync(resolve(ROOT, 'images/exercises', f)).size; gifN++;
}
console.log(`\n动图 ${gifN} 个 · 合计 ${(gifBytes / 1024 / 1024).toFixed(2)} MB · 平均 ${(gifBytes / gifN / 1024).toFixed(0)} KB`);
for (const f of ['assets/site-ui.js', 'assets/site-ui.css', 'assets/simple-mode.js', 'assets/simple-mode.css', 'docs-data.js', 'docs-simple.js']) {
    console.log(`${(statSync(resolve(ROOT, f)).size / 1024).toFixed(0).padStart(5)} KB  ${f}`);
}

/* 搜索页是否索引正文小节 */
const search = readFileSync(resolve(DOCS, '40-search.html'), 'utf8');
console.log('\n=== 搜索页索引来源 ===');
console.log('引用 docs-data.js: ' + /docs-data\.js/.test(search));
console.log('扫描 docs 目录/h2 标题: ' + /(<h2|fetch\(|index\.json)/.test(search));
console.log('索引字段: ' + ((search.match(/d\.(title|desc|tags|num|file)/g) || []).join(' ') || '—'));
