# 项目结构

> **注意**：本文档为项目归档说明。最新目录结构请参阅根目录 [`README.md`](../README.md)。

本文档记录《从零到一：羽毛球系统教学与训练体系》项目 v2.1 的最终结构。

---

## v2.1 目录结构（2026-06-14）

```
├── README.md                    # 项目主说明文档
├── LICENSE.md                   # 许可证（CC BY-NC-ND 4.0）
├── CHANGELOG.md                 # 更新日志
├── TERMINOLOGY.md               # 中英术语对照表
├── .gitignore                   # Git忽略配置
├── .gitattributes               # Git属性配置
│
├── zh/                          # 17篇中文教学文档
│   ├── 01-core-content.md
│   ├── 02-summary.md
│   ├── 03-full-version.md
│   ├── 04-image-requirements.md
│   ├── 05-level1-technique.md
│   ├── 06-four-week-plan.md
│   ├── 07-psychological-training.md
│   ├── 08-nutrition-recovery.md
│   ├── 09-strength-conditioning.md
│   ├── 10-training-log.md
│   ├── 11-footwork-training.md
│   ├── 12-shot-patterns.md
│   ├── 13-match-training.md
│   ├── 14-match-strategy.md
│   ├── 15-technical-training.md
│   ├── 16-match-reading.md
│   └── 17-sports-anatomy-rehab.md
│
├── en/                          # 17篇英文教学文档（1:1对应中文）
│   └── ...（同上17个编号）
│
├── images/17/                   # 第17章配套解剖图册
│   ├── motor-control-chain.svg  # 运动控制链条
│   ├── trigger-point-cycle.svg  # 激痛点循环
│   ├── referred-pain.svg        # 牵涉痛机制
│   ├── upper-cross-syndrome.svg # 上交叉综合征
│   ├── lower-cross-syndrome.svg # 下交叉综合征
│   ├── rotator-cuff.svg         # 肩袖四肌
│   ├── muscle_front.svg         # 全身肌肉正面(自制)
│   ├── muscle_back.svg          # 全身肌肉背面(自制)
│   ├── muscle_map_front.png     # 全身肌肉正面(网络)
│   ├── muscle_map_back.png      # 全身肌肉背面(网络)
│   ├── skeleton_front.svg       # 全身骨骼正面
│   ├── trigger_points_front.svg # 激痛点分布(正面)
│   ├── trigger_points_back.svg  # 激痛点分布(背面)
│   ├── fascial_lines.svg        # 五大筋膜经线
│   ├── knee_anatomy.svg         # 膝关节解剖
│   ├── ankle_anatomy.svg        # 踝关节解剖
│   └── README.md                # 图册说明
│
├── Levels/                      # 旧版8级体系文档（已归档）
│   ├── 预备级_羽毛球训练预备指南.md
│   ├── Level0_零基础入门阶段.md
│   ├── Level1_预备阶段.md
│   ├── Level1_正手高远球技术详解.md
│   ├── Level1_Chinese.md        ← v2.1 不再引用，保留为历史参考
│   ├── Level1_Forehand_Clear_Technique.md
│   ├── Level2_基础建立阶段.md
│   ├── Level3_技术入门阶段.md
│   ├── Level4_技术精进阶段.md
│   ├── Level5_技术成熟阶段.md
│   ├── Level6_战术应用阶段.md
│   ├── Level7_比赛准备阶段.md
│   └── Level8_专业水平阶段.md
│
├── raw/                         # 原始源文件（初始版本，未修改）
│   ├── 羽毛球教学项目_核心内容.txt
│   ├── 羽毛球教学项目_项目总结.txt
│   ├── 羽毛球系统教学项目_完整版.md
│   ├── 羽毛球系统教学项目_专业版.docx
│   ├── 羽毛球项目_图像需求说明.md
│   └── Level1_Badminton_Forehand_Clear_Technique.md
│
├── tools/                       # 辅助脚本
│   ├── append_en_17.py          # 追加英文版第17章内容
│   ├── gen_17_images.py         # 生成第17章解剖图（第一部分）
│   ├── gen_17_images_p2.py      # 生成第17章解剖图（第二部分）
│   └── README.md                # 脚本说明
│
└── archive/                     # 项目说明文档（归档）
    ├── LICENSE.md               # → 指向根目录 LICENSE.md
    ├── CONTRIBUTING.md          # 贡献指南
    ├── CONTRIBUTORS.md          # 贡献者列表
    └── PROJECT_STRUCTURE.md     # 本文件
```

---

## 文档状态（v2.1）

| 状态 | 内容 |
|:----:|:-----|
| ✅ | 17篇中文文档 — 全部完成 |
| ✅ | 17篇英文文档 — 全部完成 |
| ✅ | 配套图册 — 16张解剖示意图（SVG/PNG） |
| 🔄 | Levels/ — 旧版归档，不再主动更新 |
| 📋 | raw/ — 原始底稿，保留未修改 |
| ⏳ | Website — 待需求确认后启动 |

---

## 设计原则

### 语言风格
- **口语化讲解**：像教练现场教学一样亲切易懂
- **专业术语**：使用准确的专业术语，但要有解释
- **自适应框架**：不教"做3组×15次"，教公式+自检
- **双角色视角**：同时面向教练（怎么教）和学员（怎么练）

### 内容要求
- **科学性**：基于 NSCA CSCS 标准
- **实用性**：可执行、可自检、可评估
- **系统性**：从零到一的完整闭环
- **渐进性**：每个模块都有基线→公式→进阶→自诊

---

*最后更新：2026-06-14 (v2.1)*
