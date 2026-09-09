#!/usr/bin/env node
/* 统一 docs 线性章节页（03 core + 专项 12-32）的底部 .next 前后篇导航，
 * 前后篇取自 docs-data.js 登记顺序；首/尾篇缺失侧指向首页。
 * 幂等：仅改写与目标不一致的 .next 区块（最后一个 <div class="next">）。
 * 用法: node scripts/normalize-next.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');
const data = readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8');
const docs = [];
for (const m of data.matchAll(/\{\s*num:\s*'([^']+)',\s*file:\s*'([^']+)',\s*group:\s*'([^']+)',\s*title:\s*'([^']+)'/g)) {
    docs.push({ num: m[1], file: m[2], group: m[3], title: m[4] });
}
// 线性脊柱：03 核心内容 + 专项 12-32
const spine = docs.filter(d => d.num === '03' || (d.group === 'topic' && /^\d+$/.test(d.num)))
    .sort((a, b) => (+a.num) - (+b.num));
const idx = {};
spine.forEach((d, i) => idx[d.num] = i);

function nextBlock(prev, next) {
    const L = prev ? `<a href="${prev.file}">← ${prev.title}</a>` : `<a href="../index.html">← 返回首页</a>`;
    const R = next ? `<a href="${next.file}">${next.title} →</a>` : `<a href="../index.html">返回首页 →</a>`;
    return `        <div class="next">\n            ${L}\n            ${R}\n        </div>`;
}

let patched = 0;
for (const d of spine) {
    const i = idx[d.num];
    const prev = i > 0 ? spine[i - 1] : null;
    const next = i < spine.length - 1 ? spine[i + 1] : null;
    const path = resolve(DOCS, d.file);
    let t = readFileSync(path, 'utf8');
    const target = nextBlock(prev, next);
    // 找最后一个 .next 区块
    const m = [...t.matchAll(/<div class="next">[\s\S]*?<\/div>/g)].pop();
    if (!m) { console.log(`跳过（无 .next）: ${d.file}`); continue; }
    if (t.slice(m.index, m.index + m[0].length) === target) continue;
    t = t.slice(0, m.index) + target + t.slice(m.index + m[0].length);
    writeFileSync(path, t);
    console.log(`normalized: ${d.file}  ← ${prev ? prev.title : '首页'} / ${next ? next.title : '首页'} →`);
    patched++;
}
console.log(`done: ${patched} 页已规范化`);
