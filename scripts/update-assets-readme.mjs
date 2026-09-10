#!/usr/bin/env node
/* 由 scripts/exercise-gifs.data.mjs 生成 images/exercises/README.md（素材台账 + 许可说明）。
 * 用法: node scripts/update-assets-readme.mjs
 */
import { writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GIFS } from './exercise-gifs.data.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = resolve(ROOT, 'images/exercises');

const onDisk = readdirSync(DIR).filter(f => f.endsWith('.gif')).sort();
const missingOnDisk = GIFS.filter(g => !onDisk.includes(g.file)).map(g => g.file);
const notInLedger = onDisk.filter(f => !GIFS.some(g => g.file === f));
if (missingOnDisk.length || notInLedger.length) {
    console.error('台账与磁盘不一致：');
    if (missingOnDisk.length) console.error('  台账有、磁盘缺:', missingOnDisk.join(', '));
    if (notInLedger.length) console.error('  磁盘有、台账缺:', notInLedger.join(', '));
    process.exit(1);
}

const rows = GIFS.map(g => `| ${g.file} | ${g.en} | ${g.eq} | ${g.zh} | ${g.pages} |`).join('\n');

const md = `# 动作示范素材（动图）来源与许可

本目录 \`images/exercises/*.gif\` 共 **${GIFS.length}** 个动作示范动图，用于站点各页的"动作示范"画廊。

## 来源

- 数据集仓库：[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)（\`main\` 分支，\`videos/\` 目录）
- 数据集许可证：代码/数据结构/说明文本为 **MIT**；媒体（\`images/\` 与 \`videos/\` 下的 GIF/图片）为 **© Gym visual** 资产，
  经数据集作者书面许可在该仓库中以 **180×180** 分辨率再分发。
- 原图版权方：[© Gym visual — https://gymvisual.com/](https://gymvisual.com/)
- 按数据集 \`NOTICE.md\` 要求：**任何使用须保留署名「© Gym visual — https://gymvisual.com/」并遵守其条款**。
  本目录动图未做任何放大/修改，仅作为动作学习缩略示范。
- 下载日期：2026-09（动图直接取自上述仓库 \`videos/\`，文件名为 \`<数据集id>-<media_id>.gif\`，可回溯）。

## 台账与维护

- 台账数据源：[\`scripts/exercise-gifs.data.mjs\`](../../scripts/exercise-gifs.data.mjs)
- 重新生成本文档：\`node scripts/update-assets-readme.mjs\`
- 一致性由回归测试保证：磁盘 GIF ↔ 台账 ↔ 本文档三者必须完全对应（缺失即测试失败）

## 逐文件对照（数据集登记字段）

| 文件 | 数据集英文名 | 器材 | 页面用途（中文名） | 使用页面 |
|------|--------------|------|--------------------|----------|
${rows}

## 商用与再发布提醒

- MIT 只覆盖数据集的结构化数据与代码；**动图的使用/再发布以 Gym visual 条款为准**（详见仓库
  [NOTICE.md](https://github.com/hasaneyldrm/exercises-dataset/blob/main/NOTICE.md) 与
  [LICENSE](https://github.com/hasaneyldrm/exercises-dataset/blob/main/LICENSE)）。
- 若站点被商用或大规模发布，请自行向 Gym visual 获取授权后再使用这些动图。
`;

writeFileSync(resolve(DIR, 'README.md'), md);
console.log(`README.md 已生成：${GIFS.length} 条素材记录`);
