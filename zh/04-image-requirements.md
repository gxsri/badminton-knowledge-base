# 图像需求与制作指南——设计原理版

> **写给谁**：设计师、AI绘图使用者、教练（需要自己出图的人）
> **目标**：不是给你32张图直接去生成。是教你怎么设计运动科学插图，让你以后需要任何图都能自己设计、自己写prompt
> **核心理念**：好的运动科学插图不是"好看"，是"一个图说清楚一个原理"

---

## 第一章：运动科学插图的四个设计原则

在开始做任何图之前，先理解这四个原则。违反任何一条，图就失去了教学价值。

| 原则 | 解释 | 常见错误 |
|:-----|:------|:---------|
| **单图单原理** | 一张图只说一件事。不要说"这个图展示发力顺序和击球点和重心转移" | 一张图上塞了太多信息，读者不知道看哪 |
| **视觉层次** | 最重要的信息放在视觉中心，用颜色/粗细/大小区分优先级 | 标注线和主要元素一样粗，分不清主次 |
| **标注引导** | 引线从标注点出发到文字，不要交叉，不要穿过人体 | 引线交错成蜘蛛网，读不懂 |
| **背景干净** | 白色或浅灰背景，不需要装饰性元素 | 加了阴影/渐变/装饰性背景，分散注意力 |

**检查你的图是否合格的方法：**
```
拿给一个不懂这个技术的人看——
3秒内，他能说出"这张图在讲什么" → 合格
看了10秒还说不出来 → 违反了一条或多条原则
```

---

## 第二章：三种图的设计逻辑不同

### 2.1 技术动作图（展示"怎么做"）

**设计逻辑：**
```
Step 1：确定要展示的动作阶段
  - 是一个静态姿势？→ 选最重要的一个瞬间
  - 是一个动作序列？→ 选3-5个关键帧，不多于5个
  
Step 2：确定观察角度
  - 侧面 → 适合展示矢状面动作（分腿蹲、弓步、步法）
  - 正面 → 适合展示冠状面动作（滑步、侧向移动）
  - 45度 → 适合展示旋转动作（转体击球）
  
Step 3：标注什么
  - 运动的关节 → 画箭头/弧线
  - 关键角度 → 标注度数
  - 重心 → 一个点+箭头
  - 力的方向 → 箭头
```

**标注优先级的四层规则：**
```
第一层（必须标）：动作方向和关键关节角度
第二层（应该标）：重心位置和力的方向
第三层（可以标）：肌肉激活区域
第四层（可选标）：参考线（垂直/水平基准线）
```

### 2.2 解剖结构图（展示"是什么"）

**设计逻辑：**
```
Step 1：确定展示哪个层次
  - 表层 → 只展示最外层肌肉
  - 深层 → 去掉表层肌肉，展示深层
  - 剖面 → 纵切或横切
  
Step 2：颜色编码规则
  - 主动肌（发力的肌肉）：红色/暖色
  - 拮抗肌（被拉长的肌肉）：蓝色/冷色
  - 稳定肌（保持稳定的肌肉）：黄色/中性色
  - 骨骼：灰色/米色
  - 韧带/肌腱：白色/浅色
  
Step 3：标注逻辑
  - 引线从结构中心点出发
  - 引线末端对齐排列（左侧引线靠左对齐，右侧靠右）
  - 文字大小按重要性：主要>次要>细节
```

### 2.3 训练计划图（展示"怎么安排"）

**设计逻辑：**
```
Step 1：确定时间轴方向
  - 水平（从左到右）→ 适合展示时间线
  - 垂直（从上到下）→ 适合展示层级关系
  
Step 2：颜色编码
  - 不同模块用不同色系
  - 同一模块内的不同强度用同一色系的深浅
  
Step 3：信息密度
  - 不要在一张计划图上写每天的训练内容
  - 计划图只展示"结构和节奏"
  - 具体内容在文字部分
```

---

## 第三章：AI绘图prompt的构造公式

### 3.1 通用prompt公式（适用于所有类型）

```
[构图描述] + [主体描述] + [动作/姿势描述] + 
[标注要求] + [风格要求] + [技术参数]
```

每个部分的写法规则：

| 部分 | 规则 | 例子（好） | 例子（差） |
|:-----|:-----|:-----------|:-----------|
| 构图描述 | 说明是单图还是多格 | "4-panel medical illustration" | "a picture of" |
| 主体描述 | 性别、视角、位置 | "human figure in side view" | "a person" |
| 动作描述 | 具体动作、阶段、关键点 | "performing single-leg squat at 90 degree knee bend" | "doing exercise" |
| 标注要求 | 箭头、文字、引线 | "arrows showing motion direction, Chinese labels" | 不提 |
| 风格要求 | 医学/运动/专业/干净 | "clean medical illustration style, white background" | "realistic" |
| 技术参数 | 分辨率、比例 | "300dpi, anatomical accuracy" | 不提 |

### 3.2 不同图类型的prompt参数优先级

| 图类型 | 最重要参数 | 次重要 | 可以用默认的 |
|:-------|:-----------|:-------|:-------------|
| 技术动作图 | 动作描述的准确性 | 观察角度 | 背景细节 |
| 解剖结构图 | 颜色编码和层次 | 标注清晰度 | 动作动态 |
| 训练计划图 | 颜色编码和时间轴方向 | 信息密度控制 | 材质细节 |

### 3.3 不同AI工具的prompt写法差异

| 工具 | prompt写法差异 | 加的参数 |
|:-----|:---------------|:---------|
| **Midjourney** | 描述越简洁越好，风格词放前面 | `--ar 4:3 --style raw` |
| **DALL-E 3** | 可以写长prompt，分段描述 | 不需要特殊参数 |
| **Stable Diffusion** | 需要正面prompt+负面prompt | 负面：`deformed, distorted, bad anatomy` |

---

## 第四章：常见图像需求的prompt模板

> 以下不是32张独立的prompt。是每类图的**模板**，你按第二章的公式自己组合。

### 4.1 单姿势技术动作图（对应图1-1, 1-3, 1-5, 2-3等）

**模板：**
```
Sports medicine illustration, [观察角度] of [主体] [具体动作].
[关键标注要求]. [风格描述]. [技术参数].
Chinese labels: [要标注的中文文字].
```

**应用示例——图1-1 单足站立：**
```
Medical illustration style, human figure in side view performing single-leg stance on right leg, left leg bent behind. Green arrow pointing to center of mass over standing foot, green shaded stability zone on floor. Clean white background, professional sports medicine diagram style, anatomical accuracy. Chinese labels: "重心" next to arrow, "稳定区域" on floor zone.
```

**你的练习：用模板写出图3-4（臀中肌激活动作图）**
```
取模板 → 填内容：
观察角度 = side view
主体 = athlete lying on side
动作 = top leg straight, lifting upward
标注 = gluteus medius highlighted in red, upward arrow
风格 = medical fitness illustration
技术参数 = white background, clean professional style
标签 = 臀中肌, 侧卧抬腿

→ 组合成完整的prompt
```

### 4.2 多格动作分解图（对应图1-4, 2-5, 3-3等）

**模板：**
```
[格数]-panel sports illustration showing [动作名称] progression.
Panel 1: [阶段1描述].
Panel 2: [阶段2描述].
Panel 3: [阶段3描述].
[额外要求]. [风格]. [技术参数].
Chinese labels: [各阶段标签].
```

**应用示例——图3-3 单腿下蹲离心控制：**
```
3-panel sports medicine diagram, single-leg squat eccentric phase. 
Panel 1: standing start, knee slightly bent.
Panel 2: 45 degree knee bend, red arrow showing controlled descent.
Panel 3: full 90 degree squat position, knee alignment line over second toe.
Clean medical style, white background, anatomical accuracy.
Chinese labels: "起始位" (panel 1), "离心控制" (panel 2), "最低位" (panel 3).
```

### 4.3 解剖结构图（对应图1-7, 1-8, 3-5, 3-6等）

**模板：**
```
Anatomical illustration of [部位], [观察角度].
[层次说明]: [结构1] (颜色1), [结构2] (颜色2), [结构3] (颜色3).
Color-coded with leader lines to Chinese labels: [标签1], [标签2], [标签3].
Medical textbook quality, [技术参数], white background.
```

### 4.4 训练计划信息图（对应图4-1, 4-2, 4-3等）

**模板：**
```
[类型] infographic, [内容概述].
[时间轴/结构描述].
[颜色编码说明]. [风格]. [技术参数].
Chinese labels: [标题标签].
```

---

## 第五章：如何判断AI生成的图是否合格

### 5.1 检查清单（每次生成后对照）

```
□ 解剖比例是否正确？（手脚长度、躯干比例）
   → AI经常画错手指数量、手臂长度
   → 如果错 → 加负面prompt或手动修改

□ 动作角度是否准确？（膝关节90度？脊椎中立？）
   → AI不理解"膝关节90度"的精确含义
   → 如果错 → 在prompt中加具体参照物描述

□ 标注引线是否清晰可读？
   → AI经常画引线穿过人体
   → 如果错 → 用绘图软件手动加标注

□ 中文标签是否显示正确？
   → AI对中文生成不稳定
   → 如果错 → 在AI生成后手动添加中文标签
```

### 5.2 常见AI绘图问题及修复方法

| 问题 | 原因 | 修复方法 |
|:-----|:-----|:---------|
| 手指/脚趾数量错误 | AI对肢体末端处理不稳定 | 在prompt中加"正确的手指/脚趾数量"或后期修复 |
| 动作角度不准确 | AI不理解精确度数 | 用参照物描述代替度数（如"大腿与地面平行"） |
| 标注文字乱码 | AI对中文支持差 | 先用英文标注位置，再用软件替换成中文 |
| 人体比例失调 | 训练数据中的审美偏差 | 加"anatomical proportions, realistic body ratio" |
| 背景不干净 | 默认参数倾向艺术化 | 加"white background, no shadows, no decorations" |

---

## 第六章：设计工作流（不是"逐个生成"）

```
第一步：分类
将32张图按类型分成4组：技术动作 / 解剖 / 训练计划 / 营养恢复
每组内的图用同一种风格的prompt模板

第二步：写模板
为每组写一个通用模板（用第四章的模板）
在模板中用[variable]标记需要替换的部分

第三步：批量生成
用模板批量生成第一轮
不追求一次出完美图，先看整体风格是否统一

第四步：筛选+优化
每一张生成2-3个版本，选最好的
需要修改的，在模板基础上只改需要改的部分

第五步：后期处理
AI生成的图需要做后期处理（软件：Photoshop/GIMP/Canva）
必须做的后期处理：
  1. 检查并修复解剖比例
  2. 重新添加中文标签（一定要手动加，不要依赖AI）
  3. 统一所有图的颜色风格
  4. 添加图号（1-1, 1-2等）
```

---

*版本：v2.0（设计原理版）*
*核心变化：从"给你32个prompt"变成"教你怎么自己写prompt，用模板+公式自动生成"*
*配套使用：按类型分组→用模板→批量生成→手动后期*
