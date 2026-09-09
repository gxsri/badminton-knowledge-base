#!/usr/bin/env node
/* index.html 文档库区重构：移除静态幽灵卡/孤儿片段，替换为 docs-data.js 渲染容器。
 * 幂等：已替换过则跳过。用法: node scripts/refactor-index.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const idx = resolve(ROOT, 'index.html');
let t = readFileSync(idx, 'utf8');

const marker = '<!-- LIBRARY ROOT (rendered from docs-data.js) -->';
if (!t.includes(marker)) {
    const re = /<div class="doc-grid">[\s\S]*?(<\/div>\n    <\/section>)/;
    const m = re.exec(t);
    if (!m) { console.error('doc-grid 区块未找到，中止'); process.exit(1); }
    const noscript = `<noscript>
            <p style="color:var(--text-2);font-size:0.9rem">文档库列表由 JavaScript 渲染。未启用 JS 时可从下方入口进入：</p>
            <ul class="module-items">
                <li><a href="docs/00-quickstart.html" style="color:var(--accent)">00 快速开始</a> · <a href="docs/01-philosophy.html" style="color:var(--accent)">01 训练哲学</a> · <a href="docs/02-assessment.html" style="color:var(--accent)">02 基线评估</a> · <a href="docs/03-core-content.html" style="color:var(--accent)">03 核心内容</a></li>
                <li><a href="docs/40-search.html" style="color:var(--accent)">全文搜索</a> · <a href="docs/41-glossary.html" style="color:var(--accent)">术语表</a> · <a href="docs/39-achievements.html" style="color:var(--accent)">成就系统</a></li>
            </ul>
        </noscript>`;
    const lib = `        <div id="library-root"></div>
        ${marker}`;
    t = t.replace(re, (full, close) => lib + '\n' + noscript + '\n    ' + close);
    writeFileSync(idx, t);
    console.log('index.html 文档库容器已就位');
} else {
    console.log('已是最新，跳过');
}
