# tools/ — 辅助脚本

供文档维护者使用的 Python 辅助脚本。运行需要 Python 3.8+。

---

## `gen_17_images.py` — 生成第17章解剖图（第一部分）

生成 6 张 SVG 解剖示意图，输出至 `images/17/`：
1. `motor-control-chain.svg` — 运动控制完整链条
2. `trigger-point-cycle.svg` — 激痛点形成机制（能量危机恶性循环）
3. `referred-pain.svg` — 牵涉痛机制（脊髓节段串线现象）
4. `upper-cross-syndrome.svg` — 上交叉综合征
5. `lower-cross-syndrome.svg` — 下交叉综合征
6. `rotator-cuff.svg` — 肩袖四肌

**用法：**
```bash
python tools/gen_17_images.py
```

**注意**：脚本中 `OUT_DIR` 硬编码了旧版路径 `docs/zh/images/17`，使用前需改为 `images/17/`。

---

## `gen_17_images_p2.py` — 生成第17章解剖图（第二部分）

生成 7 张 SVG 解剖示意图（第二部分）：
1. `muscle_front.svg` — 全身肌肉正面（自制标注版）
2. `muscle_back.svg` — 全身肌肉背面（自制标注版）
3. `skeleton_front.svg` — 全身骨骼正面视图
4. `trigger_points_front.svg` — 激痛点分布（正面+牵涉痛方向）
5. `trigger_points_back.svg` — 激痛点分布（背面+牵涉痛方向）
6. `fascial_lines.svg` — 五大筋膜经线（侧面示意图）
7. `knee_anatomy.svg` — 膝关节解剖（正面，含韧带）
8. `ankle_anatomy.svg` — 踝关节解剖（外侧面，含韧带）

**用法：**
```bash
python tools/gen_17_images_p2.py
```

**注意**：同样需先修正脚本中的 `OUT_DIR` 路径。

---

## `append_en_17.py` — 追加英文版第17章缺失章节

向英文版 `17-sports-anatomy-rehab.md` 追加第6章（常见损伤分析）、第7章（康复训练）、附录D（诊断测试）。一次性补全脚本。

**用法：**
```bash
python tools/append_en_17.py
```

**注意**：脚本中 `EN_PATH` 指向 `docs/en/17-sports-anatomy-rehab.md`，已迁移至 `en/17-sports-anatomy-rehab.md`。使用前需修改路径。此脚本为一次性补全工具，内容已合入正式文档。

---

## 维护说明

- 所有脚本均为 v2.0-v2.1 开发阶段的一次性或有限次工具，**非持续维护**
- 硬编码的旧版路径（`D:\athleteiq\...`、`docs/zh/...`）在新目录结构下需修正
- 如需新增 SVG 图片，建议直接编辑 `/images/17/` 下的 SVG 文件，而非通过脚本生成

---
*最后更新：2026-06-14 (v2.1)*
