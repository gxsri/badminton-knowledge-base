#!/usr/bin/env node
/* 把规范版应用(badminton-learning 子树快照)整合进仓库根目录部署版(origin/main 布局)。
 * 1) 复制 docs-data.js / docs(规范42篇) / tests / scripts / images/exercises 到根
 * 2) 删除被规范编号取代的旧版 docs 文件
 * 3) 远端新增的 9 个工具页重命名为 42-50 前缀并改写内部引用
 * 4) 根 index.html 替换为规范版主页并移除 Google Fonts(尊重 611415b 的 GFW 决策)
 * 用法: node scripts/integrate-root.mjs  <repoRoot>  <snapshotDir/badminton-learning>
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, renameSync, rmSync, cpSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const [ROOT, SNAP] = [process.argv[2], process.argv[3]].map(p => resolve(p));
if (!existsSync(ROOT) || !existsSync(SNAP)) { console.error('bad args'); process.exit(1); }
const S = p => resolve(SNAP, p);
const R = p => resolve(ROOT, p);

/* 1) 复制规范文件 */
const docFiles = readdirSync(S('docs')).filter(f => f.endsWith('.html'));
console.log('canonical docs:', docFiles.length);
for (const f of docFiles) cpSync(S('docs/' + f), R('docs/' + f));
for (const f of ['docs-data.js']) cpSync(S(f), R(f));
if (!existsSync(R('tests'))) cpSync(S('tests'), R('tests'), { recursive: true });
else for (const f of readdirSync(S('tests'))) cpSync(S('tests/' + f), R('tests/' + f), { force: true });
if (!existsSync(R('scripts'))) cpSync(S('scripts'), R('scripts'), { recursive: true });
else for (const f of readdirSync(S('scripts'))) cpSync(S('scripts/' + f), R('scripts/' + f), { force: true });
mkdirSync(R('images/exercises'), { recursive: true });
for (const f of readdirSync(S('images/exercises'))) cpSync(S('images/exercises/' + f), R('images/exercises/' + f));

/* 2) 删除旧版被取代文件 */
const keepNew = ['32-strength-exercises.html', '33-warmup-detailed.html', '34-foam-rolling.html',
    '35-training-calendar.html', '36-match-records.html', '37-body-status.html',
    '38-diet-tracking.html', '39-skill-radar.html', '40-learning-path.html'];
const canonical = new Set(docFiles);
let removed = 0;
for (const f of readdirSync(R('docs'))) {
    if (!f.endsWith('.html')) continue;
    if (canonical.has(f) || keepNew.includes(f)) continue;
    rmSync(R('docs/' + f)); console.log('removed legacy:', f); removed++;
}
console.log('removed:', removed);

/* 3) 重命名 9 页 → 42-50 并全局改写其引用 */
const renames = Object.fromEntries(keepNew.map((f, i) => [f, `${42 + i}-${f.slice(3)}`]));
const legacy2canon = {}; // 旧编号 -> 规范编号(供替换其内部引用)
const canonByOld = {
    '03-level-0.html': '04-level-0.html', '04-level-1.html': '05-level-1.html',
    '05-level-2.html': '06-level-2.html', '06-level-3.html': '07-level-3.html',
    '07-level-4.html': '08-level-4.html', '08-level-5.html': '09-level-5.html',
    '09-level-6.html': '10-level-6.html', '10-level-7.html': '11-level-7.html',
    '01-core-content.html': '03-core-content.html', '03-bsfs-screening.html': '37-bsfs-screening.html',
    '05-clear-shot.html': '12-clear-shot.html', '06-four-week-plan.html': '13-four-week-plan.html',
    '07-psychological-training.html': '14-psychological-training.html',
    '08-nutrition-recovery.html': '15-nutrition-recovery.html',
    '09-strength-conditioning.html': '16-strength-conditioning.html',
    '11-footwork.html': '19-footwork.html', '15-technique-analysis.html': '23-technique-analysis.html',
    '17-anatomy-rehabilitation.html': '25-anatomy-rehabilitation.html',
    '22-warmup-cooldown.html': '30-warmup-cooldown.html', '24-safety-guide.html': '32-safety-guide.html',
    '20-error-correction.html': '33-error-correction.html', '25-safety-checklist.html': '34-safety-checklist.html',
    '26-sleep-optimization.html': '35-sleep-optimization.html',
    '27-competition-prep.html': '36-competition-prep.html', '29-level-locator.html': '38-level-locator.html',
    '30-achievements.html': '39-achievements.html', '31-search.html': '40-search.html'
};
for (const [oldF, newF] of Object.entries(renames)) {
    if (!existsSync(R('docs/' + oldF))) { console.log('missing expected:', oldF); continue; }
    renameSync(R('docs/' + oldF), R('docs/' + newF));
    console.log('renamed:', oldF, '->', newF);
}
const targets = readdirSync(R('docs')).filter(f => f.endsWith('.html'));
for (const f of targets) {
    const p = R('docs/' + f);
    let t = readFileSync(p, 'utf8'); let n = t;
    for (const [o, v] of Object.entries(renames)) n = n.split(o).join(v);
    for (const [o, v] of Object.entries(canonByOld)) n = n.split(o).join(v);
    if (n !== t) { writeFileSync(p, n); console.log('rewired refs:', f); }
}

/* 4) 主页替换 + 去除 Google Fonts(尊重远端 GFW 决策) */
if (existsSync(R('index.html'))) rmSync(R('index.html'));
cpSync(S('index.html'), R('index.html'));
let idx = readFileSync(R('index.html'), 'utf8');
idx = idx.replace(/^\s*<link rel="preconnect"[\s\S]*?>\s*$/gm, '').trimStart();
idx = idx.replace(/^\s*<link href="https:\/\/fonts\.googleapis\.com[\s\S]*?>\s*$/gm, '');
writeFileSync(R('index.html'), idx);
console.log('index.html replaced (Google Fonts stripped)');
console.log('done');
