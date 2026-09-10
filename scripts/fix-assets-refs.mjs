#!/usr/bin/env node
/* 把 assets/app.js 中的旧文档文件名映射改写为规范编号名。用法: node scripts/fix-assets-refs.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.argv[2] || '.');
const p = resolve(ROOT, 'assets/app.js');
let t = readFileSync(p, 'utf8');

const map = {
    '01-core-content.html': '03-core-content.html',
    '03-bsfs-screening.html': '37-bsfs-screening.html',
    '03-level-0.html': '04-level-0.html', '04-level-1.html': '05-level-1.html',
    '05-level-2.html': '06-level-2.html', '06-level-3.html': '07-level-3.html',
    '07-level-4.html': '08-level-4.html', '08-level-5.html': '09-level-5.html',
    '09-level-6.html': '10-level-6.html', '10-level-7.html': '11-level-7.html',
    '05-clear-shot.html': '12-clear-shot.html',
    '06-four-week-plan.html': '13-four-week-plan.html',
    '07-psychological-training.html': '14-psychological-training.html',
    '08-nutrition-recovery.html': '15-nutrition-recovery.html',
    '09-strength-conditioning.html': '16-strength-conditioning.html',
    '11-footwork.html': '19-footwork.html',
    '15-technique-analysis.html': '23-technique-analysis.html',
    '17-anatomy-rehabilitation.html': '25-anatomy-rehabilitation.html',
    '20-error-correction.html': '33-error-correction.html',
    '22-warmup-cooldown.html': '30-warmup-cooldown.html',
    '24-safety-guide.html': '32-safety-guide.html',
    '25-safety-checklist.html': '34-safety-checklist.html',
    '26-sleep-optimization.html': '35-sleep-optimization.html',
    '27-competition-prep.html': '36-competition-prep.html',
    '29-level-locator.html': '38-level-locator.html',
    '30-achievements.html': '39-achievements.html',
    '31-search.html': '40-search.html',
    '32-strength-exercises.html': '42-strength-exercises.html',
    '33-warmup-detailed.html': '43-warmup-detailed.html',
    '34-foam-rolling.html': '44-foam-rolling.html',
    '35-training-calendar.html': '45-training-calendar.html',
    '36-match-records.html': '46-match-records.html',
    '37-body-status.html': '47-body-status.html',
    '38-diet-tracking.html': '48-diet-tracking.html',
    '39-skill-radar.html': '49-skill-radar.html',
    '40-learning-path.html': '50-learning-path.html'
};
let n = t;
for (const [o, v] of Object.entries(map)) {
    n = n.split('docs/' + o).join('docs/' + v);
    n = n.split(o).join(v);
}
if (n !== t) { writeFileSync(p, n); console.log('patched assets/app.js'); } else console.log('assets/app.js 无变化');
