#!/usr/bin/env node
/* 内容自动审稿（配合 scripts/prompts/REVIEW-PROMPT.md 使用）
 * 对标记 <!-- quality:v2 --> 的页面做机器可判定的检查：
 *   1. 分层处方三档齐全，且每档含 动作/强度/频率/恢复/时长上限/进阶触发
 *   2. 徽章里的"每周 N 次"与正文"频率"是否自相矛盾
 *   3. 档位之间参数是否雷同（同动作同组次 = 没拉开差距）
 *   4. 占位词/未完成标记（TODO、待补充、因人而异…）
 *   5. 量化参数密度
 * 用法: node scripts/review-content.mjs [页面路径...]（省略则扫描全部 quality:v2 页面）
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = process.argv.slice(2).length
    ? process.argv.slice(2).map(p => resolve(ROOT, p))
    : readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html')).map(f => resolve(ROOT, 'docs', f));

const PLACEHOLDER = [/TODO/i, /待补充/, /待完善/, /因人而异/, /视情况而定/, /等等等/];
const TXT = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

let pages = 0, issues = 0;
for (const path of targets) {
    let t;
    try { t = readFileSync(path, 'utf8'); } catch { continue; }
    if (!t.includes('<!-- quality:v2 -->')) continue;
    pages++;
    const name = path.split(/[\\/]/).pop();
    const problems = [];

    /* 分层处方三档 */
    const cards = [...t.matchAll(/<div class="rx rx-(base|mid|elite)">([\s\S]*?)<\/div>\s*(?=<div class="rx|<\/div>)/g)];
    if (cards.length < 3) problems.push(`分层处方档位不足（${cards.length}/3）`);
    /* 语义完整性：不苛求字段名，但每档必须各自写明量化信息 */
    const needKeys = [
        ['动作/剂量', /(组\s*×|×\s*\d+|动作[：:]|测试[：:]|练习[：:]|多球|回合)/],
        ['强度', /(%\s*1RM|1RM|RPE\s*\d|RIR\s*\d|心率\s*[2-5]\s*区|HRmax|发力\s*\d|速度\s*\d|负重)/],
        ['频率', /(每周\s*\d|每\s*\d+\s*周|每天\s*\d|每日\s*\d|每周≥\d|频次[：:])/],
        ['恢复', /(间隔|休息|≥\s*\d+\s*小时|≥\s*\d+\s*天)/],
        ['时长上限', /(≤\s*\d+\s*分钟|上限|不超过\s*\d+\s*分钟|单次\s*≤)/],
        ['进阶触发', /(触发|进阶|达标|通过标准)/]
    ];
    const seen = new Map();
    for (const c of cards) {
        const tier = c[1];
        const body = c[2];
        const plain = TXT(body);
        for (const [label, re] of needKeys) if (!re.test(plain)) problems.push(`${tier} 档缺少「${label}」`);

        const badge = TXT((body.match(/rx-badge">([^<]*)</) || [])[1] || '');
        const freqLine = (plain.match(/(?:频率|周频次|频次)[：:]\s*([^。;；]*)/) || [])[1] || '';
        const freqNums = (freqLine.match(/\d+/g) || []).map(Number);
        /* 仅当徽章写了每周频次、且频率行也是"每周"口径时才比对（评估类页面按周/月计频，不算冲突） */
        if (/(每周|\/周)/.test(badge) && /每周/.test(freqLine)) {
            const badgeNums = (badge.match(/\d+/g) || []).map(Number);
            const freq = freqNums[0];
            const okNum = badgeNums.some(n => Math.abs(n - freq) <= 1 || n === freq + 1);
            if (badgeNums.length && !okNum) {
                problems.push(`${tier} 档徽章「${badge}」与频率「${freqLine.trim()}」不一致`);
            }
        }
        const acts = (plain.match(/(?:动作|训练结构|训练内容)[：:]\s*([^。]+)/) || [])[1] || '';
        seen.set(tier, acts.replace(/\s/g, ''));
    }
    /* 档位雷同 */
    const pairs = [['base', 'mid'], ['mid', 'elite'], ['base', 'elite']];
    for (const [a, b] of pairs) {
        const A = seen.get(a), B = seen.get(b);
        if (A && B && A === B) problems.push(`${a} 与 ${b} 档动作完全相同（应拉开强度/密度/复杂度）`);
    }

    /* 占位词 */
    const text = TXT(t);
    for (const re of PLACEHOLDER) if (re.test(text)) problems.push(`存在占位表述：${re}`);

    /* 参数密度 */
    const params = (t.match(/\d+\s*(?:组|次|%|RM|RPE|RIR|分钟|秒|小时|天|周|米|kg|磅)/g) || []).length;
    if (params < 8) problems.push(`量化参数不足（${params} < 8）`);

    if (problems.length) {
        issues += problems.length;
        console.log(`\n【${name}】${problems.length} 处待处理`);
        for (const p of problems) console.log('  - ' + p);
    }
}
console.log(`\n扫描 ${pages} 个 quality:v2 页面，发现 ${issues} 处问题`);
process.exitCode = issues ? 1 : 0;
