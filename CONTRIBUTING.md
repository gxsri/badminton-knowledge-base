# 贡献与维护指南（CONTRIBUTING）

本项目 = **知识库（`zh/` `en/` markdown）** + **训练系统网页版（根目录 `docs/`）**。
所有内容改动都走同一条流水线，保证"高水准运动员和零基础读者都能得到提高"。

## 一、内容工作流（改任何一篇文档都按这个顺序）

1. **读标准**：`scripts/CONTENT-STANDARD.md`（作者身份 / 三档读者 / 必备区块 / 参数密度 / 禁止项）
2. **选提示词**：
   - 升级现有页面 → `scripts/prompts/PAGE-UPGRADE-PROMPT.md`
   - 新建页面 → `scripts/prompts/NEW-PAGE-PROMPT.md`
   - 补小白要点 → `scripts/prompts/SIMPLE-MODE-PROMPT.md`
   - 审稿挑错（建议换个人/换个代理跑）→ `scripts/prompts/REVIEW-PROMPT.md`
3. **写内容**：先改 `docs/*.html`，再同步登记表：
   - `docs-data.js`（标题/描述/标签，专业模式目录）
   - `docs-simple.js`（白话要点 + 术语词典，小白模式）
   - 新增素材 → `scripts/exercise-gifs.data.mjs` + `node scripts/update-assets-readme.mjs`
4. **跑工具**（都在仓库根执行，幂等可重复）：
   ```bash
   node scripts/quality-pass.mjs          # 一致性修复
   node scripts/unify-head.mjs            # head 元数据/字体/favicon/打印样式
   node scripts/apply-site-ui.mjs         # 视觉增强层
   node scripts/apply-simple-mode.mjs     # 双模式资源
   node scripts/stamp-pages.mjs           # 更新时间 + 反馈入口
   node scripts/gen-seo.mjs               # sitemap / robots / JSON-LD
   node tests/regression.mjs              # 必须 0 失败 0 警告
   ```
5. **提交**：`git push` 到 `main` 后，GitHub Actions 会跑质量门禁并部署到 Pages。

## 二、页面结构规范

见 `scripts/PAGE-SPEC.md`：外壳类名、head 顺序、`.next` 前后篇、动图画廊（`.demo-grid`）、分层处方（`.rx-grid`/`.rx-*`）。
**不要删除**已注入的共享层（`assets/site-ui.*`、`assets/simple-mode.*`）。

## 三、质量红线（自动化校验，违反即 CI 失败）

- 三档读者都要有可执行的下一步；`CONTENT-STANDARD v2` 必备区块齐全
- 每篇 ≥8 处带单位参数；禁用无依据绝对化表述（"研究表明""史上最强""保证提升"等）
- 标题与登记表一致（h1 = `docs-data.js` 标题）；前后篇导航对称
- 链接/锚点/图片/样式表全部可达；`<img>` 必须 `loading="lazy"` + 中文 `alt`
- 单页动图数量上限 16（性能预算）；动图素材必须登记并保留署名
- 白话要点覆盖 51/51；术语引用必须在词典中定义

## 四、素材与许可

- 动作动图：媒体 **© Gym visual**（180×180，须保留署名），代码/数据 MIT；逐文件台账见 `images/exercises/README.md`
- 知识库正文：遵循仓库 `LICENSE.md`
- 新增素材必须写明来源与许可；**不要**引入来源不明或需付费授权的图片/动图

## 五、隐私与数据

- 站点**无账号、无追踪、无第三方分析**；训练数据（日志、日历、比赛记录、成就、进度）**只存在你本机的 localStorage**
- 换设备/清理浏览器前，请用右下角 **💾 按钮导出数据**，在新设备导入即可恢复
- 外部依赖仅：Google Fonts（文档页，可被墙时自动回退）与 Chart.js（仅基线评估页，离线降级为文字提示）

## 六、本地预览

```bash
# 方式一：直接双击 index.html（相对路径全部可用）
# 方式二：本地静态服务器（推荐，路径更接近线上）
python -m http.server 8080     # 然后访问 http://localhost:8080/
```

## 七、常见问题

- **改了标题但页面没变**：登记表 `docs-data.js` 与 h1 必须同时改，编辑后跑 `node tests/regression.mjs`
- **小白模式没有摘要卡**：检查 `docs-simple.js` 是否有该文件条目，以及页面是否注入了 `simple-mode.*`
- **动图不显示**：确认在 `images/exercises/` 且已登记；路径必须是 `../images/exercises/<文件名>.gif`
- **样式错乱**：多半是页内重复定义了共享类（如 `.demo-grid`），删掉页内副本即可
