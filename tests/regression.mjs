#!/usr/bin/env node
/*
 * badminton-learning 静态回归测试（零外部依赖）
 * 运行：node tests/regression.mjs
 * 覆盖：
 *   1. 文档登记表 docs-data.js 完整性（编号唯一、文件存在、分组合法）
 *   2. 全站页面结构（编码、标题规范、标签配平、id 不重复、脚本配平）
 *   3. 事件处理器与脚本函数匹配
 *   4. 全部相对链接/锚点可达（含 JS 字面量链接）
 *   5. 目录页与登记表一致性（index / 40-search / 00-quickstart）
 *   6. localStorage 键白名单
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { GIFS } from '../scripts/exercise-gifs.data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS_DIR = resolve(ROOT, 'docs');
const html = (p) => readFileSync(resolve(ROOT, p), 'utf8');

let failures = 0, warnings = 0, checks = 0;
const report = [];

function ok(name, detail = '') { checks++; if (detail) report.push(`  ✔ ${name} — ${detail}`); else report.push(`  ✔ ${name}`); }
function bad(name, detail = '') { checks++; failures++; report.push(`  ✘ ${name}${detail ? ` — ${detail}` : ''}`); }
function warn(name, detail = '') { warnings++; report.push(`  ⚠ ${name}${detail ? ` — ${detail}` : ''}`); }

/* ---------- 1. 登记表 ---------- */
let DATA = null;
try {
    const src = html('docs-data.js');
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(src, sandbox);
    DATA = sandbox.window.DOCS_DATA;
    ok('docs-data.js 可解析并导出 DOCS_DATA', `${DATA.docs.length} 篇文档 / ${DATA.groups.length} 个分组`);
} catch (e) {
    bad('docs-data.js 解析', e.message);
}
if (DATA) {
    const groupKeys = new Set(DATA.groups.map(g => g.key));
    if (groupKeys.size !== DATA.groups.length) bad('登记表分组 key 重复');
    const nums = new Set(), files = new Set();
    DATA.docs.forEach((d, i) => {
        const tag = `登记表 #${i} (${d.num}/${d.file})`;
        if (!d.num || !d.file || !d.title) return bad(tag, '缺少 num/file/title');
        if (nums.has(d.num)) return bad(tag, `编号重复: ${d.num}`);
        nums.add(d.num);
        if (files.has(d.file)) return bad(tag, `文件重复: ${d.file}`);
        files.add(d.file);
        if (!groupKeys.has(d.group)) return bad(tag, `未知分组: ${d.group}`);
        if (!/^\d{2}$|^L[0-7]$/.test(d.num)) return bad(tag, `非法编号格式: ${d.num}`);
        // 编号-文件前缀一致性
        if (/^\d{2}$/.test(d.num) && !d.file.startsWith(d.num + '-'))
            return bad(tag, `文件前缀与编号不符: ${d.file}`);
        if (/^L[0-7]$/.test(d.num)) {
            const lv = +d.num[1];
            const expect = `${String(4 + lv).padStart(2, '0')}-level-${lv}.html`;
            if (d.file !== expect) return bad(tag, `Level 文件应为 ${expect}, 实际 ${d.file}`);
        }
        if (!Array.isArray(d.tags) || d.tags.length === 0) return warn(tag, '缺少标签');
        try { statSync(resolve(DOCS_DIR, d.file)); }
        catch { bad(tag, `文档文件不存在: docs/${d.file}`); }
    });
    ok('登记表编号/文件唯一且分组合法（缺失文件已单独列出）');
    // docs 目录中的孤儿文件
    const docFiles = new Set(readdirSync(DOCS_DIR).filter(f => f.endsWith('.html')));
    for (const f of docFiles) if (!files.has(f)) warn(`docs/ 中存在未登记文件: ${f}`);
}

/* ---------- 2/3/4/5. 页面扫描 ---------- */
const ALLOWED_TAGS = new Set(['div','section','table','tbody','thead','tr','td','th','ul','ol','li','a','button','form','select','span','p','h1','h2','h3','h4','nav','footer','header','main','figure','figcaption','blockquote','details','summary','iframe','canvas','svg','option']);
const VOID_TAGS = new Set(['br','hr','img','input','meta','link','source','wbr','area','base','col','embed','track','param']);
const LS_ALLOWED = new Set(['badminton-baseline','badminton-history','badminton-stats','badminton-level-locator','safety-check-log','bsfs-history',
    'level0-progress','level1-progress','level2-progress','level3-progress','level4-progress','level5-progress','level6-progress','level7-progress',
    'training-calendar','match-records','body-status','diet-records','skill-radar','bl-theme']);

function stripBlocks(text) {
    return text
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');
}
function collectIds(text) {
    const m = text.match(/id="([^"]+)"/g) || [];
    return m.map(s => s.slice(4, -1));
}
function scriptsOf(text) {
    return [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
}
function definedFunctions(script) {
    const names = new Set();
    for (const m of script.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) names.add(m[1]);
    for (const m of script.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/g)) names.add(m[1]);
    for (const m of script.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function\b/g)) names.add(m[1]);
    // window.onload / window.addEventListener 引用的顶级函数已在 function 声明中
    for (const m of script.matchAll(/addEventListener\(['"](?:click|load|input|change|keyup|submit)['"],\s*([A-Za-z_$][\w$]*)\s*\)/g)) names.add(m[1]);
    return names;
}
function parseLinks(text, fileBase) {
    const out = [];
    for (const m of text.matchAll(/\shref="([^"]*)"/g)) out.push({ raw: m[1], base: fileBase });
    return out;
}

const htmlFiles = ['index.html', ...readdirSync(DOCS_DIR).filter(f => f.endsWith('.html')).sort().map(f => 'docs/' + f)];
const allIdsCache = new Map();
function idsOf(path) {
    if (!allIdsCache.has(path)) allIdsCache.set(path, new Set(collectIds(html(path))));
    return allIdsCache.get(path);
}

for (const rel of htmlFiles) {
    const base = rel.startsWith('docs/') ? 'docs/' : '';
    let text;
    try { text = html(rel); } catch (e) { bad(`读取失败 ${rel}`, e.message); continue; }
    const tag = rel.replace('docs/', '');

    // 基础标签
    if (!/<meta charset="UTF-8">|<meta charset='UTF-8'>/i.test(text)) bad(tag, '缺少 UTF-8 meta');
    if (!/lang="zh-CN"/.test(text)) bad(tag, '缺少 lang="zh-CN"');
    if (rel.startsWith('docs/') && !/fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+SC/.test(text)) bad(tag, '缺少 Noto Sans SC 字体加载');
    if (rel.startsWith('docs/')) {
        if (!/<title>.*? — 羽毛球职业训练系统<\/title>/.test(text)) bad(tag, '标题未按规范收尾（— 羽毛球职业训练系统）');
        if (!/<a href="\.\.\/index\.html"/.test(text)) bad(tag, '缺少返回首页链接');
        // 标题前缀与登记表一致 + meta description 与登记表 desc 一致
        if (DATA) {
            const reg = DATA.docs.find(d => d.file === tag);
            if (reg) {
                const titlePrefix = (text.match(/<title>(.*?) — 羽毛球职业训练系统<\/title>/) || [])[1];
                if (titlePrefix !== reg.title) bad(tag, `标题与登记表不一致: 页面"${titlePrefix}" vs 登记表"${reg.title}"`);
                const metaDesc = (text.match(/<meta name="description" content="([^"]*)"/) || [])[1];
                if (metaDesc !== reg.desc) bad(tag, 'meta description 与登记表 desc 不一致');
            }
        }
        if (!/<link rel="icon"/.test(text)) bad(tag, '缺少 favicon');
        if (!/@media print/.test(text)) bad(tag, '缺少 @media print 打印样式');
    } else {
        if (!/<title>[^<]*羽毛球职业训练系统[^<]*<\/title>/.test(text)) bad(tag, '标题缺少品牌名');
        if (!/<meta name="description"/.test(text)) bad(tag, '缺少 meta description');
        if (!/<link rel="icon"/.test(text)) bad(tag, '缺少 favicon');
        if (!/@media print/.test(text)) bad(tag, '缺少 @media print 打印样式');
    }
    if (/(?:href="glossary\.html")|(?:['"]glossary\.html['"])/.test(text)) bad(tag, '引用不存在的 glossary.html（应指向 41-glossary.html）');

    // id 重复
    const ids = collectIds(text);
    const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
    if (dup.length) bad(tag, `重复 id: ${[...new Set(dup)].join(', ')}`);

    // 标签配平（剥掉 script/style/注释）
    const clean = stripBlocks(text);
    const stackCounts = {};
    const errors = [];
    for (const m of clean.matchAll(/<\/?([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g)) {
        const full = m[0], t = m[1].toLowerCase();
        if (t.startsWith('!')) continue;
        if (!ALLOWED_TAGS.has(t) && !VOID_TAGS.has(t)) continue;
        if (full.startsWith('</')) {
            if (!VOID_TAGS.has(t)) stackCounts[t] = (stackCounts[t] || 0) - 1;
        } else if (!full.endsWith('/>') && !VOID_TAGS.has(t)) {
            stackCounts[t] = (stackCounts[t] || 0) + 1;
        }
    }
    for (const [t, c] of Object.entries(stackCounts)) if (c !== 0) errors.push(`${t}(${c > 0 ? '缺闭合 ×' + c : '多闭合 ×' + -c})`);
    if (errors.length) bad(tag, `标签不平衡: ${errors.join(' ')}`);

    // script/style 配平
    const sc = (text.match(/<script[\s>]/gi) || []).length, scE = (text.match(/<\/script>/gi) || []).length;
    if (sc !== scE) bad(tag, `<script> ${sc} 处 vs </script> ${scE} 处`);
    const st = (text.match(/<style[\s>]/gi) || []).length, stE = (text.match(/<\/style>/gi) || []).length;
    if (st !== stE) bad(tag, `<style> ${st} 处 vs </style> ${stE} 处`);

    // 内联脚本语法编译检查（不执行）
    for (const m of text.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)) {
        try { new vm.Script(m[1], { filename: rel }); }
        catch (e) { bad(tag, `内联脚本语法错误: ${e.message}`); }
    }

    // 事件处理器
    const script = scriptsOf(text);
    const defined = definedFunctions(script);
    const handlerCalls = new Set();
    for (const m of text.matchAll(/\son(?:click|input|change|submit|load|keyup|keydown|blur|focus|mouseover|mouseout)="([A-Za-z_$][\w$]*)\s*\(/g)) handlerCalls.add(m[1]);
    for (const fn of handlerCalls) if (!defined.has(fn)) bad(tag, `事件调用未定义函数: ${fn}()`);

    // 链接：只扫 HTML（剥掉 script/style），另对 script 内的 .html 字面量做存在性检查
    const cleanHtml = stripBlocks(text);
    const frag = new Set([...cleanHtml.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
    for (const { raw } of parseLinks(cleanHtml, base)) {
        if (!raw || raw === '#' || raw.includes('${') || raw.startsWith('http') || raw.startsWith('//') || raw.startsWith('mailto:') ||
            raw.startsWith('javascript:') || raw.startsWith('data:') || raw.startsWith('tel:') || raw.startsWith('file:')) continue;
        const [pathPart, fragPart] = raw.split('#');
        if (!pathPart) { if (fragPart && !frag.has(fragPart)) bad(tag, `站内锚点缺失: #${fragPart}`); continue; }
        const target = resolve(ROOT, base + decodeURIComponent(pathPart));
        try {
            if (!statSync(target).isFile()) { bad(tag, `链接目标不存在: ${raw}`); continue; }
            const relTarget = pathPart.startsWith('docs/') ? pathPart : base + pathPart;
            if (fragPart && !idsOf(relTarget).has(fragPart))
                bad(tag, `链接锚点缺失: ${raw}`);
        } catch { bad(tag, `链接目标不存在: ${raw}`); }
    }

    // script 内的 html 文件名面量（如 link = 'xx.html'）必须指向存在的文件
    const htmlLiterals = new Set();
    for (const m of script.matchAll(/['"]([A-Za-z0-9][A-Za-z0-9_-]*\.html)['"]/g)) htmlLiterals.add(m[1]);
    for (const lit of htmlLiterals) {
        if (lit.startsWith('http')) continue;
        const target = resolve(ROOT, base + lit);
        try { if (!statSync(target).isFile()) bad(tag, `JS 字面量链接目标不存在: ${lit}`); }
        catch { bad(tag, `JS 字面量链接目标不存在: ${lit}`); }
    }

    // JS 字面量 html 链接（单双引号内）
    const scriptSrc = text.match(/<script[^>]*src="([^"]*)"/g) || [];
    const srcFiles = scriptSrc.map(s => s.match(/src="([^"]*)"/)[1]).filter(s => !/^https?:/.test(s));
    for (const s of srcFiles) {
        const target = resolve(ROOT, base + s);
        try { if (!statSync(target).isFile()) bad(tag, `script 引用缺失: ${s}`); }
        catch { bad(tag, `script 引用缺失: ${s}`); }
    }
    if (rel.startsWith('docs/') && rel !== 'docs/40-search.html' && rel !== 'docs/00-quickstart.html') {
        // 引用 docs-data.js 的页面（搜索页）必须已加载登记表；其他页面不必
    }

    // localStorage 键白名单
    const lsKeys = new Set();
    for (const m of script.matchAll(/localStorage\.(?:setItem|getItem|removeItem)\(\s*['"]([^'"]+)['"]/g)) lsKeys.add(m[1]);
    for (const k of lsKeys) if (!LS_ALLOWED.has(k)) bad(tag, `localStorage 键不在白名单: ${k}`);

    // 相对 <img src> 必须存在且带 alt（剥掉 script 后扫描）
    for (const m of cleanHtml.matchAll(/<img\s[^>]*src="([^"]+)"[^>]*>/g)) {
        const raw = m[1];
        if (!raw || raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('//')) continue;
        const target = resolve(ROOT, base + decodeURIComponent(raw));
        try { if (!statSync(target).isFile()) bad(tag, `图片引用缺失: ${raw}`); }
        catch { bad(tag, `图片引用缺失: ${raw}`); }
    }
    for (const m of cleanHtml.matchAll(/<img\b(?![^>]*\salt=)[^>]*>/g)) bad(tag, '存在缺少 alt 的 <img>');

    // 共享视觉增强层（主题切换/进度条/目录）必须注入且资源可达
    if (!/assets\/site-ui\.css/.test(text)) bad(tag, '缺少 site-ui.css 引用');
    if (!/assets\/site-ui\.js/.test(text)) bad(tag, '缺少 site-ui.js 引用');
    for (const m of cleanHtml.matchAll(/<link\s[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)) {
        const raw = m[1];
        if (!raw || raw.startsWith('http') || raw.startsWith('//')) continue;
        const target = resolve(ROOT, base + decodeURIComponent(raw));
        try { if (!statSync(target).isFile()) bad(tag, `样式表引用缺失: ${raw}`); }
        catch { bad(tag, `样式表引用缺失: ${raw}`); }
    }

    // 防回归：多个 <nav> 时不得存在"裸 nav 选择器"（曾导致页脚导航被固定到页面顶部）
    const navCount = (cleanHtml.match(/<nav[\s>]/g) || []).length;
    const styleText = (text.match(/<style[\s\S]*?<\/style>/gi) || []).join('\n');
    if (navCount > 1 && /(^|\})\s*nav\s*\{/m.test(styleText))
        bad(tag, `存在 ${navCount} 个 <nav> 且样式含裸 nav 选择器（会把页脚导航也固定到顶部）`);

    // 元数据：色彩方案 / 浏览器主题色 / Open Graph（分享卡片与浏览器 UI 配色）
    if (!/name="color-scheme"/.test(text)) bad(tag, '缺少 meta color-scheme');
    if (!/name="theme-color"/.test(text)) bad(tag, '缺少 meta theme-color');
    if (!/property="og:title"/.test(text)) bad(tag, '缺少 og:title');
    if (!/property="og:description"/.test(text)) bad(tag, '缺少 og:description');
    if (/fonts\.googleapis\.com/.test(text) && !/rel="preconnect"/.test(text)) bad(tag, '引用 Google Fonts 但缺少 preconnect');

    // 性能：外链脚本必须 defer/async，不得阻塞渲染
    for (const m of cleanHtml.matchAll(/<script[^>]*src="https?:[^"]+"[^>]*>/g)) {
        if (!/\s(?:defer|async)\b/.test(m[0])) bad(tag, '外链脚本未 defer/async（阻塞渲染）');
    }

    // 去重：site-ui.css 已提供 .demo-* 样式，页内不得重复定义
    if (/assets\/site-ui\.css/.test(text) && /\.demo-grid\s*\{/.test(styleText))
        bad(tag, '页内重复定义 .demo-grid（应统一使用 site-ui.css）');

    // h1 与登记表标题一致（Level 页允许省略 "Level N：" 前缀）
    if (DATA && rel.startsWith('docs/')) {
        const reg = DATA.docs.find(d => d.file === tag);
        const h1 = (text.match(/<h1>(.*?)<\/h1>/) || [])[1];
        if (reg && h1) {
            const expect = [reg.title, reg.title.replace(/^Level \d：/, '')];
            if (!expect.includes(h1.trim())) bad(tag, `h1 与登记表标题不一致: h1="${h1.trim()}" vs "${reg.title}"`);
        }
    }

    // 本页零问题则记一次通过（让"全绿"直观可见）
    if (failures === 0 && warnings === 0) ok(tag, '全部结构/脚本/链接检查通过');
}

/* ---------- 5. 目录页与登记表一致性 ---------- */
if (DATA) {
    const idx = html('index.html');
    if (!idx.includes('src="docs-data.js"')) bad('index.html', '未加载 docs-data.js');
    if (!/id="library-grid"/.test(idx) && !/id="libraryRoot"/.test(idx) && !/id="docs-grid"/.test(idx) && !/id="library-root"/.test(idx)) bad('index.html', '缺少文档库渲染容器');

    const search = html('docs/40-search.html');
    if (!search.includes('src="../docs-data.js"')) bad('docs/40-search.html', '未加载 ../docs-data.js');
    if (/\bconst\s+docs\s*=\s*\[/.test(search)) bad('docs/40-search.html', '仍内嵌独立 docs 数组（应使用登记表）');
    if (DATA.docs.length < 40) bad('登记表', `文档数量偏少: ${DATA.docs.length}（应为 42）`);

    const quick = html('docs/00-quickstart.html');
    for (const d of DATA.docs) {
        if (/^L[0-3]$/.test(d.num) && !quick.includes(d.file)) bad('docs/00-quickstart.html', `基线测试缺少 Level 链接字面量: ${d.file}`);
    }
    if (!quick.includes('docs-data.js') && !quick.includes('17-fitness-plan.html')) warn('docs/00-quickstart.html', '未提及健身模块（17-fitness-plan.html）');

    // index 每篇文档都有一个卡片锚点（渲染由 JS 完成，静态下检查登记表条目数被引用至少一次）
    const countRefs = idx.match(/docs\/[a-z0-9-]+\.html/g) || [];
    if (!countRefs.length) bad('index.html', '没有任何 docs/ 链接');

    // 主页 Hero 徽章数字必须与登记表 / 素材台账一致（防止数量漂移）
    const chips = [...idx.matchAll(/<span class="hero-chip">([^<]*)<\/span>/g)].map(m => m[1]);
    const docChip = chips.find(c => /篇文档/.test(c));
    const gifChip = chips.find(c => /个动作动图/.test(c));
    if (!docChip) bad('index.html', 'Hero 缺少"篇文档"徽章');
    else if (parseInt(docChip.replace(/\D/g, ''), 10) !== DATA.docs.length)
        bad('index.html', `Hero 文档数(${docChip}) 与登记表(${DATA.docs.length}) 不一致`);
    const gifCount = readdirSync(resolve(ROOT, 'images/exercises')).filter(f => f.endsWith('.gif')).length;
    if (!gifChip) bad('index.html', 'Hero 缺少"个动作动图"徽章');
    else if (parseInt(gifChip.replace(/\D/g, ''), 10) !== gifCount)
        bad('index.html', `Hero 动图数(${gifChip}) 与实际(${gifCount}) 不一致`);
    ok('主页 Hero 徽章', `文档 ${DATA.docs.length} 篇 · 动图 ${gifCount} 个（与登记表/台账一致）`);

    // 线性脊柱前后篇导航对称性（03 core + 专项 12-32）
    const spine = DATA.docs.filter(d => d.num === '03' || (d.group === 'topic' && /^\d+$/.test(d.num)))
        .sort((a, b) => (+a.num) - (+b.num));
    spine.forEach((d, i) => {
        const c = html('docs/' + d.file);
        const last = [...c.matchAll(/<div class="next">([\s\S]*?)<\/div>/g)].pop();
        if (!last) return bad('docs/' + d.file, '缺少 .next 前后篇导航');
        const hrefs = [...last[1].matchAll(/href="([^"]+)"/g)].map(m => m[1]);
        const expectPrev = i > 0 ? spine[i - 1].file : '../index.html';
        const expectNext = i < spine.length - 1 ? spine[i + 1].file : '../index.html';
        if (hrefs[0] !== expectPrev || hrefs[1] !== expectNext)
            bad('docs/' + d.file, `前后篇导航不符: 实际 [${hrefs[0]}, ${hrefs[1]}] 期望 [${expectPrev}, ${expectNext}]`);
    });
    ok('前后篇导航对称性', `脊柱 ${spine.length} 页（03 + 专项 12-32）首尾相接`);

    // 动作示范素材（images/exercises）：磁盘 ↔ 台账 ↔ README 三方一致
    const exDir = resolve(ROOT, 'images/exercises');
    try {
        const gifs = readdirSync(exDir).filter(f => f.endsWith('.gif')).sort();
        if (gifs.length < 5) bad('images/exercises', `GIF 数量异常: ${gifs.length}`);
        const exReadme = readFileSync(resolve(exDir, 'README.md'), 'utf8');
        if (!exReadme.includes('Gym visual') || !exReadme.includes('gymvisual.com')) bad('images/exercises/README.md', '缺少 Gym visual 署名与来源');
        for (const g of GIFS) {
            if (!gifs.includes(g.file)) bad('素材台账', `台账有、磁盘缺: ${g.file}`);
            if (!g.zh || !g.en || !g.eq) bad('素材台账', `${g.file} 缺少中文名/英文名/器材`);
            if (!exReadme.includes(g.file)) bad('images/exercises/README.md', `README 未登记: ${g.file}`);
        }
        for (const f of gifs) if (!GIFS.some(g => g.file === f)) bad('素材台账', `磁盘有、台账缺: ${f}`);
        ok('动作示范素材', `${gifs.length} 个 GIF · 台账/README/磁盘三方一致 · 署名齐全`);
    } catch (e) {
        bad('images/exercises', `素材目录异常: ${e.message}`);
    }
}

/* ---------- 摘要 ---------- */
console.log('badminton-learning 静态回归\n' + report.join('\n'));
console.log(`\n结果: ${checks} 项检查, ${failures} 项失败, ${warnings} 项警告`);
process.exitCode = failures > 0 ? 1 : 0;
