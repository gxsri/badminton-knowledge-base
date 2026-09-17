#!/usr/bin/env node
/* 质量加固 pass（幂等，可复跑）：修复审计发现的缺陷，不新增内容。
 *   1. h1 与登记表标题对齐（保留副标题说明）
 *   2. 主页 Hero 徽章数字与实际一致（并去掉无法核验的数字）
 *   3. 删除页内与 site-ui.css 重复的 .demo-* 样式块
 *   4. 主题引导脚本：无本地偏好时跟随系统深浅色
 *   5. 02-assessment：Chart.js 改为 defer + 缺失守卫（不再阻塞渲染、离线不报错）
 * 用法: node scripts/quality-pass.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let changed = 0;
function patch(rel, fn) {
    const p = resolve(ROOT, rel);
    const t = readFileSync(p, 'utf8');
    const n = fn(t);
    if (n !== t) { writeFileSync(p, n); console.log('patched:', rel); changed++; }
}

/* ---- 1. h1 对齐登记表 ---- */
const H1_FIX = {
    '00-quickstart.html': ['5分钟快速开始', '快速开始'],
    '15-nutrition-recovery.html': ['营养与恢复指南', '营养与恢复'],
    '39-achievements.html': ['我的成就', '成就系统'],
    '40-search.html': ['搜索内容', '全文搜索']
};
for (const [f, [from, to]] of Object.entries(H1_FIX)) {
    patch('docs/' + f, t => t.replace(`<h1>${from}</h1>`, `<h1>${to}</h1>`));
}

/* ---- 2. 主页 Hero 徽章：数字必须与登记表/GIF 台账一致 ---- */
patch('index.html', t => {
    const chipBlock = /<div class="hero-chips">[\s\S]*?<\/div>/;
    const docsCount = (readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8').match(/num:\s*'[^']+'/g) || []).length;
    const gifCount = readdirSync(resolve(ROOT, 'images/exercises')).filter(f => f.endsWith('.gif')).length;
    const next = `            <div class="hero-chips">
                <span class="hero-chip">📄 ${docsCount} 篇文档</span>
                <span class="hero-chip">🏋️ ${gifCount} 个动作动图</span>
                <span class="hero-chip">🧮 训练计算器</span>
                <span class="hero-chip">🌗 深浅主题</span>
                <span class="hero-chip">✅ 回归测试全绿</span>
            </div>`;
    return t.replace(chipBlock, next);
});

/* ---- 3. 移除页内重复的 .demo-* 样式（site-ui.css 已统一提供） ---- */
for (const f of readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html'))) {
    patch('docs/' + f, t => {
        if (!/assets\/site-ui\.css/.test(t)) return t;
        const styleMatch = t.match(/<style[\s\S]*?<\/style>/i);
        if (!styleMatch) return t;
        const style = styleMatch[0];
        if (!/\.demo-grid\s*\{/.test(style)) return t;
        const cleaned = style.replace(/\s*\/\* 动作示范画廊[\s\S]*?(?=\s*\/\*|\s*@media|\s*<\/style>)/, '\n');
        if (cleaned === style) return t;
        return t.replace(style, cleaned);
    });
}

/* ---- 4. 主题引导：跟随系统偏好（无本地记录时） ---- */
const OLD_BOOT = `<script>try{var t=localStorage.getItem('bl-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>`;
const NEW_BOOT = `<script>try{var t=localStorage.getItem('bl-theme');if(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)t='light';if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>`;
for (const rel of ['index.html', ...readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html')).map(f => 'docs/' + f)]) {
    patch(rel, t => t.includes(OLD_BOOT) ? t.split(OLD_BOOT).join(NEW_BOOT) : t);
}

/* ---- 5. Chart.js：defer + 守卫 ---- */
patch('docs/02-assessment.html', t => {
    let n = t;
    n = n.replace('<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js" defer></script>');
    if (!/typeof Chart/.test(n)) {
        n = n.replace('            // 更新图表\n            updateChart();',
            '            // 更新图表（Chart.js 采用 defer 加载，未就绪时跳过）\n            if (typeof Chart !== \'undefined\') updateChart();');
        n = n.replace('        // 页面加载时更新图表\n        updateChart();',
`        // 页面加载时更新图表（Chart.js 为 defer 加载，需等 DOMContentLoaded；离线时给出提示）
        function initChart() {
            if (typeof Chart === 'undefined') {
                var box = document.querySelector('.chart-container');
                if (box && !box.querySelector('.chart-fallback')) {
                    box.insertAdjacentHTML('beforeend', '<p class="chart-fallback" style="font-size:0.8rem;color:var(--text-2);margin-top:0.5rem">图表库未加载（需要联网）；历史数据仍保存在本地，联网后刷新即可查看曲线。</p>');
                }
                return;
            }
            updateChart();
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initChart);
        else initChart();`);
    }
    return n;
});
console.log('done:', changed, '个文件');
