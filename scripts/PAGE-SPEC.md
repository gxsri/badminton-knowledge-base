# 页面制作规范（PAGE-SPEC）— 羽毛球职业训练系统 docs/

本规范用于在 `docs/` 下新增/改写任何文档页，保证全站风格统一。所有新页面必须满足
`node tests/regression.mjs` 的全部检查（写完后自行运行验证，不得引入新的失败项）。

## 1. 必须遵守的结构（每个文件）

1. `<!DOCTYPE html>` + `<html lang="zh-CN">`；`<head>` 内依次为：
   - `<meta charset="UTF-8">`
   - `<meta name="description" content="…">`（内容 = docs-data.js 中本页 desc，与登记表一致）
   - `<link rel="icon" href="data:image/svg+xml,…">`（内联 🏸 favicon）
   - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
   - `<title>{页面名} — 羽毛球职业训练系统</title>`（品牌后缀固定，不得省略）
   - Google Fonts 加载链接（Noto Sans SC + JetBrains Mono），与现有页面完全一致
   - `<style>` 末尾保留 `@media print` 打印配色块
   - 共享视觉增强层（**必须保留，勿删除**）：主题引导内联脚本 + `assets/site-ui.css` + `assets/site-ui.js`，
     由 `node scripts/apply-site-ui.mjs` 幂等注入（提供深浅主题切换、阅读进度条、本页目录、回到顶部、标题锚点、移动端表格横向滚动）
   （head 其余统一项可运行 `node scripts/unify-head.mjs` 自动补齐/修复）
2. `<body>` 顶部固定：`<div class="back"><a href="../index.html">← 返回首页</a></div>`
3. 主体容器：`<div class="content">`（max-width 800px 居中，由 CSS 控制）
4. 页面头：`<div class="doc-badge">NN</div>`（NN = 本页编号，见下表）→ `<h1>` → `<div class="meta">…</div>`
   （meta 一行说明适用对象/前置要求，如 `Level 2+ · 一句话副标题`）
5. 内容层：
   - `h2` 分章、`h3` 分节
   - 强调框用 `.callout`（红）/ `.callout info`（蓝）/ `.callout.warn`（琥珀）
   - 代码/流程/清单用 `.code-block`（内部高亮 `<span class="k">` 关键词、`<span class="v">` 数值/对勾、`<span class="c">` 注释）
   - 表格一律 `<table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table>`（th/td 闭合齐全）
   - 动作/要点卡用 `.exercise` + `.exercise-title`
6. 页尾：`<div class="next">` 内放"← 上一章"与"下一章 →"两个 `<a>`，指向规范规定的前后邻居文件；
   页尾之后闭合 `</div></body></html>`。**不要**再放其他 CTA 块。
7. 除 `.next` 两个链接与 `.back` 链接外，不出现任何其他 href；正文中提及相关文档一律写中文名，
   不写链接、不写 `xx.md` 或旧编号文件名。
8. 动作示范画廊：需要示范动图时使用 `.demo-grid/.demo-card/.demo-media/.demo-name`（骨架模板已内置样式），
   `<img>` 一律 `loading="lazy"`、`src="../images/exercises/<文件>"`、必须有中文 `alt`。
   素材只能使用 `images/exercises/` 内已入库文件（来源/署名/逐文件对照见该目录 README.md）；
   **红线：素材 © Gym visual（180×180），任何使用必须保留署名与分辨率限制**，入库新图需同步更新该 README 对照表。

## 2. 视觉与文风

- 深色主题变量来自模板，直接复用 scripts/template.html 的 `<style>`，**不得增删类名**
- 语言：简体中文、教练口吻、短句、行动导向；数字与单位规范（组×次数、kg、分钟、%）
- 术语：步法（不用"步伐"）；其余术语与《术语表》(41-glossary.html) 一致
- 段落文字颜色由 CSS 控制：正文写 `<p>`，强调词用 `<strong>`，不要内联改色
- 禁止出现 emoji 以外的装饰字符滥用；编号一律两位（00-41 或 L0-L7）

## 3. 编号登记表（新页面）

| 编号 | 文件名 | 标题 | 前一篇(.next ←) | 后一篇(.next →) |
|------|--------|------|------------------|------------------|
| 17 | 17-fitness-plan.html | 健身与体能 | 16-strength-conditioning.html 力量体能 | 18-training-log.html 训练日志 |
| 18 | 18-training-log.html | 训练日志 | 17-fitness-plan.html 健身与体能 | 19-footwork.html 步法训练 |
| 20 | 20-shot-patterns.html | 球路训练 | 19-footwork.html 步法训练 | 21-match-training.html 对抗与多球训练 |
| 21 | 21-match-training.html | 对抗与多球训练 | 20-shot-patterns.html 球路训练 | 22-match-strategy.html 比赛策略 |
| 22 | 22-match-strategy.html | 比赛策略 | 21-match-training.html 对抗与多球训练 | 23-technique-analysis.html 技术全解析 |
| 24 | 24-match-reading.html | 比赛阅读 | 23-technique-analysis.html 技术全解析 | 25-anatomy-rehabilitation.html 运动解剖与康复 |
| 26 | 26-elite-player-analysis.html | 精英打法分析 | 25-anatomy-rehabilitation.html 运动解剖与康复 | 27-national-team-systems.html 各国训练体系 |
| 27 | 27-national-team-systems.html | 各国训练体系 | 26-elite-player-analysis.html 精英打法分析 | 28-equipment-guide.html 装备指南 |
| 28 | 28-equipment-guide.html | 装备指南 | 27-national-team-systems.html 各国训练体系 | 29-women-training.html 女性训练专项 |
| 29 | 29-women-training.html | 女性训练专项 | 28-equipment-guide.html 装备指南 | 30-warmup-cooldown.html 热身与整理 |
| 31 | 31-diagnosis-index.html | 症状诊断索引 | 30-warmup-cooldown.html 热身与整理 | 32-safety-guide.html 训练安全边界 |
| 41 | 41-glossary.html | 术语表 | 40-search.html 全文搜索 | （无后一篇，右链放 ../index.html 返回首页） |

邻居文本约定：`← {上一页标题}` 与 `{下一页标题} →`；无后一篇时右链文案为 `返回首页 →`。

## 4. 内容取材

- 主要来源：仓库根 `zh/` 下同名知识库 markdown（如 20-shot-patterns.html 对应 `zh/12-shot-patterns.md`）；
  glossary 对应仓库根 `TERMINOLOGY.md`；fitness 页为原创编写。
- 转换原则：**压缩而非搬运**——保留全部关键表格、数值、动作清单与决策树，删去冗余叙述，
  目标 130-300 行/页；markdown 的 `>` 引言改写成 `.callout`，代码围栏改写成 `.code-block`。
- 若 markdown 内出现对其它文档的链接（如 `[14-比赛策略](14-match-strategy.md)`），一律只写中文名文字，不加链接。

## 5. 完成后自检（必须执行）

```
node tests/regression.mjs
```
只允许出现你任务说明中列出的"已知尚未创建"页面相关失败；你负责的文件必须零失败、零警告。
自查项：标题后缀正确；无重复 id；div/a/table 配平；.next 指向存在的文件；badge 数字与编号一致。
