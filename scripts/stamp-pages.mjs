#!/usr/bin/env node
/* 为每篇文档页注入「最后更新 + 内容标准版本 + 反馈入口」（幂等，可复跑）。
 * 日期取自 git 对该文件的最后一次提交日期（无 git 时退化为今天）。
 * 用法: node scripts/stamp-pages.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ISSUE = 'https://github.com/gxsri/badminton-knowledge-base/issues/new';

function lastCommitDate(relPath) {
    try {
        const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], { cwd: ROOT, encoding: 'utf8' }).trim();
        return out || new Date().toISOString().slice(0, 10);
    } catch (e) {
        return new Date().toISOString().slice(0, 10);
    }
}

function stamp(date, file) {
    return `        <p class="page-stamp" data-bl-stamp="1">最后更新：${date} · 内容标准 v2 · 发现错误或有更好的练法？<a href="${ISSUE}">在 GitHub 提 Issue</a> · 文件：<span class="mono">${file}</span></p>\n`;
}

let n = 0;
for (const f of readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html'))) {
    const path = resolve(ROOT, 'docs', f);
    let t = readFileSync(path, 'utf8');
    const date = lastCommitDate('docs/' + f);
    const next = stamp(date, f);
    const existing = /[ \t]*<p class="page-stamp"[\s\S]*?<\/p>\n/;
    let out;
    if (existing.test(t)) {
        if (t.match(existing)[0] === next) continue;
        out = t.replace(existing, next);
    } else {
        const i = t.lastIndexOf('<div class="next">');
        if (i >= 0) {
            out = t.slice(0, i) + next + '\n' + t.slice(i);
        } else {
            /* 没有 .next 的页面（如快速开始）：插在 .content 结束前 */
            const m = t.match(/\n {4}<\/div>\n\n {4}<script/);
            if (!m) continue;
            out = t.slice(0, m.index) + '\n' + next + t.slice(m.index);
        }
    }
    writeFileSync(path, out);
    console.log('stamped:', f, date);
    n++;
}
console.log('done:', n, '个页面');
