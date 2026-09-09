#!/usr/bin/env node
/* 在力量体能(16)与健身与体能(17)页嵌入 Gym visual 动作示范 GIF 画廊。
 * 素材: images/exercises/*.gif（来源与许可见该目录 README.md）。
 * 用法: node scripts/embed-demo-gifs.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = 'images/exercises/';

const DEMO_CSS = `        /* 动作示范画廊（素材 © Gym visual — gymvisual.com，180×180） */
        .demo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin:1.5rem 0}
        .demo-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden}
        .demo-media{background:#000;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center}
        .demo-media img{max-width:100%;max-height:100%;display:block}
        .demo-name{padding:.65rem .9rem;font-size:.9rem;font-weight:600;line-height:1.4}
        .demo-name small{display:block;color:var(--text-2);font-weight:400;font-size:.72rem;margin-top:.1rem}
        .demo-credit{font-size:.8rem;color:var(--text-2);margin-top:.5rem}
`;

// file -> [中文名, 数据集英文名, 器材]
const LIB = {
    '0043-qXTaZnJ.gif': ['杠铃深蹲', 'barbell full squat', '杠铃'],
    '0336-RRWFUcw.gif': ['哑铃弓步', 'dumbbell lunge', '哑铃'],
    '1460-IZVHb27.gif': ['行走弓步（徒手）', 'walking lunge', '徒手'],
    '1459-rR0LJzx.gif': ['哑铃罗马尼亚硬拉', 'dumbbell romanian deadlift', '哑铃'],
    '0549-UHJlbu3.gif': ['壶铃摆荡', 'kettlebell swing', '壶铃'],
    '3013-u0cNiij.gif': ['地面臀桥', 'low glute bridge on floor', '徒手'],
    '0025-EIeI8Vf.gif': ['杠铃卧推', 'barbell bench press', '杠铃'],
    '0662-I4hDWkc.gif': ['俯卧撑', 'push-up', '徒手'],
    '0027-eZyBC3j.gif': ['杠铃俯身划船', 'barbell bent over row', '杠铃'],
    '0652-lBDjFxJ.gif': ['引体向上', 'pull-up', '徒手'],
    '0235-FWdVhcW.gif': ['绳索肩外旋', 'cable standing shoulder external rotation', '绳索'],
    '0276-iny3m5y.gif': ['死虫式', 'dead bug', '徒手'],
    '0979-9pa4H5m.gif': ['弹力带帕洛夫推', 'band horizontal pallof press', '弹力带']
};

function card(file) {
    const [zh, en, eq] = LIB[file];
    return `            <div class="demo-card">
                <div class="demo-media"><img loading="lazy" src="../${SRC}${file}" alt="${zh}动图示范（${en}）"></div>
                <div class="demo-name">${zh}<small>${en} · ${eq}</small></div>
            </div>`;
}
function gallery(files) { return `        <div class="demo-grid">\n${files.map(card).join('\n')}\n        </div>`; }

const CREDIT = `        <div class="callout info">
            <p><strong>动图说明：</strong>示范动图素材 © Gym visual — gymvisual.com（180×180，经 hasaneyldrm/exercises-dataset 数据集再分发，按数据集 NOTICE 要求保留署名）。动图用于快速看懂动作轨迹，<strong>细节标准以本页文字要点与动作库说明为准</strong>；来源与逐文件对照见 <span class="mono">images/exercises/README.md</span>。</p>
        </div>`;

function patch(path, fn) {
    let t = readFileSync(path, 'utf8');
    const next = fn(t);
    if (next === t) { console.log('no change:', path); return; }
    writeFileSync(path, next);
    console.log('patched:', path);
}

/* ============ 17-fitness-plan.html ============ */
const fit = resolve(ROOT, 'docs/17-fitness-plan.html');
patch(fit, t => {
    const i = t.lastIndexOf('</style>');
    t = t.slice(0, i) + DEMO_CSS + '    ' + t.slice(i);
    // 下肢（表尾 → 下一个 h3 前）
    let a = '</tbody>\n        </table>\n\n        <h3>上肢推拉与肩（平衡挥拍肌）</h3>';
    if (!t.includes(a)) throw new Error('17 下肢锚点缺失');
    t = t.replace(a, '</tbody>\n        </table>\n\n' + gallery(['0043-qXTaZnJ.gif', '0336-RRWFUcw.gif', '1460-IZVHb27.gif', '1459-rR0LJzx.gif', '0549-UHJlbu3.gif', '3013-u0cNiij.gif']) + '\n\n        <h3>上肢推拉与肩（平衡挥拍肌）</h3>');
    // 上肢（表尾 → 核心 h3）
    a = '</tbody>\n        </table>\n\n        <h3>核心（不是仰卧起坐）</h3>';
    if (!t.includes(a)) throw new Error('17 上肢锚点缺失');
    t = t.replace(a, '</tbody>\n        </table>\n\n' + gallery(['0025-EIeI8Vf.gif', '0662-I4hDWkc.gif', '0027-eZyBC3j.gif', '0652-lBDjFxJ.gif', '0235-FWdVhcW.gif']) + '\n\n        <h3>核心（不是仰卧起坐）</h3>');
    // 核心（表尾 → 周安排 h2）
    a = '</tbody>\n        </table>\n\n        <h2>周安排：健身×羽毛球怎么排</h2>';
    if (!t.includes(a)) throw new Error('17 核心锚点缺失');
    t = t.replace(a, '</tbody>\n        </table>\n\n' + gallery(['0276-iny3m5y.gif', '0979-9pa4H5m.gif']) + '\n\n        <h2>周安排：健身×羽毛球怎么排</h2>');
    // 署名块（页尾 .next 前）
    a = '<div class="next">\n            <a href="16-strength-conditioning.html">← 力量体能</a>';
    if (!t.includes(a)) throw new Error('17 next 锚点缺失');
    t = t.replace(a, CREDIT + '\n\n        ' + a);
    return t;
});

/* ============ 16-strength-conditioning.html ============ */
const str = resolve(ROOT, 'docs/16-strength-conditioning.html');
patch(str, t => {
    const i = t.lastIndexOf('</style>');
    t = t.slice(0, i) + DEMO_CSS + '    ' + t.slice(i);
    const sec = `        <h2>💪 基础动作示范（动图）</h2>
        <p>以下为场外训练最常用的基础动作动图示范（素材 © Gym visual — gymvisual.com，180×180）。动图用于确认动作轨迹，<strong>组次参数与进阶判定见上方各模块</strong>；完整动作库与周安排见 17 健身与体能。</p>
${gallery(['0043-qXTaZnJ.gif', '0662-I4hDWkc.gif', '0027-eZyBC3j.gif', '0235-FWdVhcW.gif', '3013-u0cNiij.gif', '0276-iny3m5y.gif'])}

`;
    const a = '<div class="next">\n            <a href="15-nutrition-recovery.html">← 营养与恢复</a>';
    if (!t.includes(a)) throw new Error('16 next 锚点缺失');
    t = t.replace(a, sec + '        ' + a);
    return t;
});

console.log('done');
