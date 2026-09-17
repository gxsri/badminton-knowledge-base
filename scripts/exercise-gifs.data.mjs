/* 动作示范 GIF 台账（唯一数据源）
 * 供 scripts/update-assets-readme.mjs 生成 images/exercises/README.md，
 * 以及 tests/regression.mjs 校验"素材文件 ↔ 台账 ↔ README"一致。
 * 素材来源：hasaneyldrm/exercises-dataset（videos/），媒体 © Gym visual（180×180，须保留署名）。
 */
export const GIFS = [
    /* ===== 第一批：力量与健身基础动作 ===== */
    { file: '0043-qXTaZnJ.gif', zh: '杠铃深蹲', en: 'barbell full squat', eq: '杠铃', pages: '16 力量体能 / 17 健身与体能' },
    { file: '0336-RRWFUcw.gif', zh: '哑铃弓步', en: 'dumbbell lunge', eq: '哑铃', pages: '17 健身与体能' },
    { file: '1460-IZVHb27.gif', zh: '行走弓步（徒手）', en: 'walking lunge', eq: '徒手', pages: '17 健身与体能' },
    { file: '1459-rR0LJzx.gif', zh: '哑铃罗马尼亚硬拉', en: 'dumbbell romanian deadlift', eq: '哑铃', pages: '17 健身与体能' },
    { file: '0549-UHJlbu3.gif', zh: '壶铃摆荡', en: 'kettlebell swing', eq: '壶铃', pages: '17 健身与体能' },
    { file: '3013-u0cNiij.gif', zh: '地面臀桥', en: 'low glute bridge on floor', eq: '徒手', pages: '16 力量体能 / 17 健身与体能' },
    { file: '0025-EIeI8Vf.gif', zh: '杠铃卧推', en: 'barbell bench press', eq: '杠铃', pages: '17 健身与体能' },
    { file: '0662-I4hDWkc.gif', zh: '俯卧撑', en: 'push-up', eq: '徒手', pages: '16 力量体能 / 17 健身与体能' },
    { file: '0027-eZyBC3j.gif', zh: '杠铃俯身划船', en: 'barbell bent over row', eq: '杠铃', pages: '16 力量体能 / 17 健身与体能' },
    { file: '0652-lBDjFxJ.gif', zh: '引体向上', en: 'pull-up', eq: '徒手', pages: '17 健身与体能' },
    { file: '0235-FWdVhcW.gif', zh: '绳索肩外旋', en: 'cable standing shoulder external rotation', eq: '绳索', pages: '16 力量体能 / 17 健身与体能' },
    { file: '0276-iny3m5y.gif', zh: '死虫式', en: 'dead bug', eq: '徒手', pages: '16 力量体能 / 17 健身与体能' },
    { file: '0979-9pa4H5m.gif', zh: '弹力带帕洛夫推', en: 'band horizontal pallof press', eq: '弹力带', pages: '17 健身与体能' },

    /* ===== 第二批：泡沫轴（筋膜放松） ===== */
    { file: '2202-oMypNrz.gif', zh: '泡沫轴臀部拉伸', en: 'roller hip stretch', eq: '泡沫轴', pages: '44 泡沫轴使用指南' },
    { file: '2205-0L2KwtI.gif', zh: '泡沫轴臀+背阔肌拉伸', en: 'roller hip lat stretch', eq: '泡沫轴', pages: '44 泡沫轴使用指南' },
    { file: '2207-c3Pfhti.gif', zh: '泡沫轴侧背阔肌拉伸', en: 'roller side lat stretch', eq: '泡沫轴', pages: '44 泡沫轴使用指南' },
    { file: '2208-isofgzg.gif', zh: '泡沫轴胸椎伸展', en: 'roller back stretch', eq: '泡沫轴', pages: '44 泡沫轴使用指南' },
    { file: '2204-XeMvLgE.gif', zh: '泡沫轴上体前滑（核心）', en: 'roller body saw', eq: '泡沫轴', pages: '44 泡沫轴使用指南' },
    { file: '2206-SKXQAx3.gif', zh: '泡沫轴反向卷腹', en: 'roller reverse crunch', eq: '泡沫轴', pages: '44 泡沫轴使用指南' },

    /* ===== 第二批：动态热身与灵活性 ===== */
    { file: '1368-uL9CsKm.gif', zh: '踝关节绕环', en: 'ankle circles', eq: '徒手', pages: '43 详细热身指南 / 30 热身与整理 / 17 健身与体能' },
    { file: '3636-ealLwvX.gif', zh: '扶墙高抬腿', en: 'high knee against wall', eq: '徒手', pages: '30 热身与整理' },
    { file: '1471-ZgsNQ6d.gif', zh: '毛毛虫爬行', en: 'inchworm', eq: '徒手', pages: '43 详细热身指南 / 30 热身与整理 / 17 健身与体能' },
    { file: '3655-J9zIWig.gif', zh: '行进高抬腿弓步', en: 'walking high knees lunge', eq: '徒手', pages: '43 详细热身指南' },
    { file: '1604-DFGXwZr.gif', zh: '世界最伟大拉伸', en: 'world greatest stretch', eq: '徒手', pages: '43 详细热身指南 / 30 热身与整理 / 17 健身与体能' },
    { file: '1403-x2chWLO.gif', zh: '颈侧拉伸', en: 'neck side stretch', eq: '徒手', pages: '素材库（备用）' },
    { file: '2143-RSOsp5d.gif', zh: '哑铃肩绕环', en: 'dumbbell standing around world', eq: '哑铃', pages: '素材库（备用）' },

    /* ===== 第二批：激活与预康复 ===== */
    { file: '0628-O95afRA.gif', zh: '弹力带侧向行走', en: 'monster walk', eq: '弹力带', pages: '29 女性训练专项 / 43 详细热身指南 / 16 力量体能' },
    { file: '0710-7WaDzyL.gif', zh: '侧卧髋外展', en: 'side hip abduction', eq: '徒手', pages: '29 女性训练专项 / 43 详细热身指南' },
    { file: '3011-GdMa1ET.gif', zh: '上斜肩胛俯卧撑', en: 'incline scapula push up', eq: '徒手', pages: '43 详细热身指南' },
    { file: '0688-uTBt1HV.gif', zh: '肩胛引体（下沉激活）', en: 'scapular pull-up', eq: '徒手', pages: '素材库（备用）' },
    { file: '0864-x306lCW.gif', zh: '哑铃肩外旋', en: 'dumbbell upright shoulder external rotation', eq: '哑铃', pages: '素材库（备用）' },

    /* ===== 第二批：发力链与爆发 ===== */
    { file: '1302-aDoFKrE.gif', zh: '药球胸前传球', en: 'medicine ball chest pass', eq: '药球', pages: '23 技术全解析 / 12 正手高远球' },
    { file: '1354-oHg8eop.gif', zh: '药球过顶砸球', en: 'medicine ball overhead slam', eq: '药球', pages: '23 技术全解析' },
    { file: '0243-aVs3BR3.gif', zh: '绳索转体', en: 'cable twist', eq: '绳索', pages: '23 技术全解析 / 12 正手高远球' },
    { file: '0514-LIlE5Tn.gif', zh: '跳跃深蹲', en: 'jump squat', eq: '徒手', pages: '16 力量体能 / 17 健身与体能 / 19 步法训练 / 29 女性训练专项' },
    { file: '3361-zfNHMN9.gif', zh: '滑冰跳（侧向弹跳）', en: 'skater hops', eq: '徒手', pages: '16 力量体能 / 17 健身与体能 / 19 步法训练' }
];
