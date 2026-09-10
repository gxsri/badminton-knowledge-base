#!/usr/bin/env node
/* 品牌与编号统一 pass（幂等，可重复执行）
 * 依据 docs-data.js：修正每页 <title> 品牌后缀、.doc-badge 编号，
 * 统一术语（步伐->步法），修正 index.html 品牌名。
 * 用法: node scripts/unify-branding.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');

const data = readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8');
const numByFile = {};
for (const m of data.matchAll(/num:\s*'([^']+)',\s*file:\s*'([^']+)'/g)) numByFile[m[2]] = m[1];

function patch(path, fn) {
    const text = readFileSync(path, 'utf8');
    const next = fn(text);
    if (next !== text) { writeFileSync(path, next); console.log('patched:', path); }
}

for (const f of readdirSync(DOCS).filter(f => f.endsWith('.html'))) {
    const num = numByFile[f];
    if (!num) continue;
    const path = resolve(DOCS, f);
    patch(path, t => {
        let n = t.replace(/ — 羽毛球系统训练<\/title>/, ' — 羽毛球职业训练系统</title>');
        n = n.replace(/<div class="doc-badge">\d+<\/div>/, `<div class="doc-badge">${num}</div>`);
        n = n.split('步伐').join('步法');
        return n;
    });
}

const idx = resolve(ROOT, 'index.html');
patch(idx, t => {
    let n = t.replace('<title>羽毛球系统训练 - NSCA CSCS认证体系</title>', '<title>羽毛球职业训练系统 — NSCA CSCS认证体系</title>');
    n = n.replace('<em>羽毛球系统训练</em>', '<em>羽毛球职业训练系统</em>');
    n = n.replace('© 2026 羽毛球系统训练 — NSCA CSCS认证体系', '© 2026 羽毛球职业训练系统 — NSCA CSCS认证体系');
    n = n.split('步伐').join('步法');
    return n;
});
console.log('done');
