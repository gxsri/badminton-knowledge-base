#!/usr/bin/env node
/* 第二轮动图嵌入：泡沫轴 / 热身激活 / 爆发链条 + 自绘发力链动画图
 * 素材: images/exercises/*.gif（© Gym visual，180×180，来源见该目录 README.md）
 * 幂等：按 data-bl-gallery 标记跳过已插入的区块。
 * 用法: node scripts/embed-more-gifs.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = '../images/exercises/';

const LIB = {
    /* 泡沫轴（roller） */
    '2202-oMypNrz.gif': ['泡沫轴臀部拉伸', 'roller hip stretch', '泡沫轴'],
    '2205-0L2KwtI.gif': ['泡沫轴臀+背阔肌拉伸', 'roller hip lat stretch', '泡沫轴'],
    '2207-c3Pfhti.gif': ['泡沫轴侧背阔肌拉伸', 'roller side lat stretch', '泡沫轴'],
    '2208-isofgzg.gif': ['泡沫轴胸椎伸展', 'roller back stretch', '泡沫轴'],
    '2204-XeMvLgE.gif': ['泡沫轴上体前滑（核心）', 'roller body saw', '泡沫轴'],
    '2206-SKXQAx3.gif': ['泡沫轴反向卷腹', 'roller reverse crunch', '泡沫轴'],
    /* 动态热身 / 灵活性 */
    '1368-uL9CsKm.gif': ['踝关节绕环', 'ankle circles', '徒手'],
    '3636-ealLwvX.gif': ['扶墙高抬腿', 'high knee against wall', '徒手'],
    '1471-ZgsNQ6d.gif': ['毛毛虫爬行', 'inchworm', '徒手'],
    '3655-J9zIWig.gif': ['行进高抬腿弓步', 'walking high knees lunge', '徒手'],
    '1604-DFGXwZr.gif': ['世界最伟大拉伸', 'world greatest stretch', '徒手'],
    '1403-x2chWLO.gif': ['颈侧拉伸', 'neck side stretch', '徒手'],
    '2143-RSOsp5d.gif': ['哑铃肩绕环', 'dumbbell standing around world', '哑铃'],
    /* 激活 / 预康复 */
    '0628-O95afRA.gif': ['弹力带侧向行走', 'monster walk', '弹力带'],
    '0710-7WaDzyL.gif': ['侧卧髋外展', 'side hip abduction', '徒手'],
    '3011-GdMa1ET.gif': ['上斜肩胛俯卧撑', 'incline scapula push up', '徒手'],
    '0688-uTBt1HV.gif': ['肩胛引体（下沉激活）', 'scapular pull-up', '徒手'],
    '0864-x306lCW.gif': ['哑铃肩外旋', 'dumbbell upright shoulder external rotation', '哑铃'],
    /* 发力链 / 爆发 */
    '1302-aDoFKrE.gif': ['药球胸前传球', 'medicine ball chest pass', '药球'],
    '1354-oHg8eop.gif': ['药球过顶砸球', 'medicine ball overhead slam', '药球'],
    '0243-aVs3BR3.gif': ['绳索转体', 'cable twist', '绳索'],
    '0514-LIlE5Tn.gif': ['跳跃深蹲', 'jump squat', '徒手'],
    '3361-zfNHMN9.gif': ['滑冰跳（侧向弹跳）', 'skater hops', '徒手']
};

function card(file) {
    const [zh, en, eq] = LIB[file];
    return `            <div class="demo-card">
                <div class="demo-media"><img loading="lazy" src="${SRC}${file}" alt="${zh}动图示范（${en}）"></div>
                <div class="demo-name">${zh}<small>${en} · ${eq}</small></div>
            </div>`;
}
function gallery(key, files) {
    return `        <div class="demo-grid" data-bl-gallery="${key}">\n${files.map(card).join('\n')}\n        </div>`;
}
const CREDIT = `        <p class="demo-credit">动图素材 © Gym visual — gymvisual.com（180×180，经 hasaneyldrm/exercises-dataset 再分发，保留署名）；来源与逐文件对照见 <span class="mono">images/exercises/README.md</span>。</p>`;

/* 自绘「发力链时序」动画图（纯 CSS 动画，无外部素材） */
const KINETIC = `        <div class="kinetic" data-bl-gallery="kinetic" role="img" aria-label="羽毛球发力链时序：脚蹬地、髋转动、核心传递、肩内旋、肘伸展、腕闪动，约40到60毫秒传至拍面">
            <div class="kinetic-title">发力链时序：力量从地面传到拍面</div>
            <div class="kinetic-track">
                <span class="k-node">脚蹬地</span><span class="k-arrow">→</span>
                <span class="k-node">髋转动</span><span class="k-arrow">→</span>
                <span class="k-node">核心传递</span><span class="k-arrow">→</span>
                <span class="k-node">肩内旋</span><span class="k-arrow">→</span>
                <span class="k-node">肘伸展</span><span class="k-arrow">→</span>
                <span class="k-node">腕闪动</span>
            </div>
            <div class="kinetic-bar"><i></i></div>
            <div class="kinetic-legend">
                <span>0ms：地面反作用力</span>
                <span>约 40–60ms：传递到拍面</span>
                <span>任一环断裂 → 力量泄漏</span>
            </div>
        </div>`;

function patch(rel, fn) {
    const path = resolve(ROOT, rel);
    let t = readFileSync(path, 'utf8');
    const next = fn(t);
    if (next === t) { console.log('skip (已是最新):', rel); return; }
    writeFileSync(path, next);
    console.log('patched:', rel);
}
function insertBefore(t, anchor, block, label) {
    if (t.includes(label)) return t;                 // 幂等
    const i = t.indexOf(anchor);
    if (i < 0) throw new Error('锚点未找到: ' + anchor);
    return t.slice(0, i) + block + '\n\n' + t.slice(i);
}
function section(title, note, key, files, credit = false) {
    return `        <h2>${title}</h2>\n        <p>${note}</p>\n${gallery(key, files)}\n` + (credit ? CREDIT + '\n' : '');
}

/* ---- 44 泡沫轴：分部位示范 ---- */
patch('docs/44-foam-rolling.html', t => {
    t = insertBefore(t, '<h2>💪 上肢放松</h2>',
        section('🦵 下肢放松动图', '前后缓慢滚动，遇到明显痛点停 20–30 秒，呼吸放松；每部位 1–2 分钟。', 'foam-lower', ['2202-oMypNrz.gif', '2205-0L2KwtI.gif']),
        'data-bl-gallery="foam-lower"');
    t = insertBefore(t, '<h2>🎯 羽毛球专项放松</h2>',
        section('💪 上肢放松动图', '侧躺滚动背阔肌与胸椎，避免压到腰椎；肩前侧疼痛者减小压力。', 'foam-upper', ['2207-c3Pfhti.gif', '2208-isofgzg.gif']),
        'data-bl-gallery="foam-upper"');
    t = insertBefore(t, '<div class="next">',
        section('🎯 羽毛球专项放松动图', '核心与胸椎是挥拍发力链的关键环节，建议放在训练后或休息日。', 'foam-sport', ['2204-XeMvLgE.gif', '2206-SKXQAx3.gif'], true),
        'data-bl-gallery="foam-sport"');
    return t;
});

/* ---- 43 详细热身 ---- */
patch('docs/43-warmup-detailed.html', t => {
    t = insertBefore(t, '<h2>⚡ 阶段3：激活训练（3分钟）</h2>',
        section('🌊 动态拉伸动图', '每个动作 8–10 次，幅度从小到大，不要弹震。', 'mob-dyn', ['1604-DFGXwZr.gif', '1471-ZgsNQ6d.gif', '1368-uL9CsKm.gif', '3655-J9zIWig.gif']),
        'data-bl-gallery="mob-dyn"');
    t = insertBefore(t, '<h2>🏸 阶段4：专项热身（2-3分钟）</h2>',
        section('⚡ 激活训练动图', '臀中肌、肩胛与肩袖是羽毛球最容易"睡着"的三处，上场前务必唤醒。', 'act-basic', ['0628-O95afRA.gif', '0710-7WaDzyL.gif', '3011-GdMa1ET.gif'], true),
        'data-bl-gallery="act-basic"');
    return t;
});

/* ---- 30 热身与整理 ---- */
patch('docs/30-warmup-cooldown.html', t => {
    return insertBefore(t, '<div class="next">',
        section('🔄 动态热身动作示范', '赛前热身建议按「一般热身 → 动态拉伸 → 激活 → 专项」顺序执行，以下为动态拉伸与激活常用动作。', 'warm-demo', ['1604-DFGXwZr.gif', '1471-ZgsNQ6d.gif', '1368-uL9CsKm.gif', '3636-ealLwvX.gif'], true),
        'data-bl-gallery="warm-demo"');
});

/* ---- 29 女性训练：ACL 预防 ---- */
patch('docs/29-women-training.html', t => {
    return insertBefore(t, '<div class="next">',
        section('🛡️ 髋部激活与落地控制动图', '臀中肌控制与落地缓冲是 ACL 预防的核心，建议训练前做 2 组、每组 10–15 次。', 'acl-demo', ['0628-O95afRA.gif', '0710-7WaDzyL.gif', '0514-LIlE5Tn.gif'], true),
        'data-bl-gallery="acl-demo"');
});

/* ---- 23 技术全解析：发力链 ---- */
patch('docs/23-technique-analysis.html', t => {
    if (t.includes('data-bl-gallery="kinetic"')) return t;
    const anchor = '<h2>握拍技术</h2>';
    const i = t.indexOf(anchor);
    if (i < 0) throw new Error('23 页锚点未找到');
    const block = KINETIC + '\n\n' +
        section('⚡ 发力链辅助练习（动图）', '药球与绳索是练习"由下至上"传导最直观的工具：先慢速感受顺序，再逐步加速。', 'chain-demo', ['1302-aDoFKrE.gif', '1354-oHg8eop.gif', '0243-aVs3BR3.gif'], true);
    return t.slice(0, i) + block + '\n\n        ' + t.slice(i);
});

/* ---- 12 高远球：发力链辅助 ---- */
patch('docs/12-clear-shot.html', t => {
    return insertBefore(t, '<div class="next">',
        section('⚡ 发力链辅助练习动图', '高远球"打不远"多数不是手臂问题，而是力量没从地面传上来——用这两个动作找传导顺序。', 'clear-chain', ['1302-aDoFKrE.gif', '0243-aVs3BR3.gif'], true),
        'data-bl-gallery="clear-chain"');
});

/* ---- 16 力量体能：爆发与激活 ---- */
patch('docs/16-strength-conditioning.html', t => {
    return insertBefore(t, '<div class="next">',
        section('⚡ 爆发与激活动图', '爆发力训练安排在体能充沛时（训练前段），每次 3–5 组、每组 5–8 次，注重落地控制。', 'power-demo', ['0514-LIlE5Tn.gif', '3361-zfNHMN9.gif', '0628-O95afRA.gif'], true),
        'data-bl-gallery="power-demo"');
});

/* ---- 17 健身与体能：灵活性 + 弹跳 ---- */
patch('docs/17-fitness-plan.html', t => {
    t = insertBefore(t, '<h2>热身与关节养护</h2>',
        section('🧘 灵活性与热身动图（5 分钟激活流程配套）', '训练前用这套动作打开髋、踝与胸椎，动作幅度以"有牵拉感但不痛"为准。', 'mob-demo', ['1604-DFGXwZr.gif', '1471-ZgsNQ6d.gif', '1368-uL9CsKm.gif'], true),
        'data-bl-gallery="mob-demo"');
    t = insertBefore(t, '<h2>五个最常见的坑</h2>',
        section('🦶 弹跳与反应动图（有氧日的弹性补充）', '每个动作 3 组 × 6–10 次，落地要"轻"，膝踝保持弹性；疲劳时不做。', 'plyo-demo', ['3361-zfNHMN9.gif', '0514-LIlE5Tn.gif']),
        'data-bl-gallery="plyo-demo"');
    return t;
});

/* ---- 19 步法：脚踝弹性与侧向反应 ---- */
patch('docs/19-footwork.html', t => {
    return insertBefore(t, '<div class="next">',
        section('🦶 脚踝弹性与侧向反应（辅助练习）', '步法的快与稳，一半来自踝、膝的弹性与侧向控制；每周 2 次、每次 3 组即可。', 'foot-plyo', ['3361-zfNHMN9.gif', '0514-LIlE5Tn.gif'], true),
        'data-bl-gallery="foot-plyo"');
});

console.log('done');
