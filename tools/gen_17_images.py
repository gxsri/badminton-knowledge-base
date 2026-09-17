#!/usr/bin/env python3
"""Generate SVG anatomy reference images for Chapter 17."""
import os

OUT_DIR = r'D:\athleteiq\athlete_monitor\badmintongithub\docs\zh\images\17'

def header(w, h, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n'
            f'  <rect width="{w}" height="{h}" fill="#0f172a" rx="8"/>\n'
            f'  <text x="{w//2}" y="30" fill="#e2e8f0" font-family="sans-serif" font-size="16" text-anchor="middle" font-weight="bold">{title}</text>\n')

def footer():
    return '</svg>'

# ============================================================
def make_motor_control():
    s = header(1000, 480, "运动控制完整链条")
    boxes = [
        ("大脑想动", 50, 80, 140, 50, "#3b82f6"),
        ("神经传信号", 250, 80, 140, 50, "#6366f1"),
        ("肌肉收缩", 450, 80, 140, 50, "#ef4444"),
        ("筋膜传力", 650, 80, 140, 50, "#f59e0b"),
        ("骨骼运动\n动作完成", 850, 80, 140, 50, "#22c55e"),
    ]
    for label, bx, by, bw, bh, bc in boxes:
        s += f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="6" fill="{bc}" fill-opacity="0.15" stroke="{bc}" stroke-width="1.5"/>'
        lines = label.split('\n')
        for li, ln in enumerate(lines):
            s += f'<text x="{bx+bw//2}" y="{by+bh//2+li*14-4}" fill="{bc}" font-family="sans-serif" font-size="12" text-anchor="middle" font-weight="bold">{ln}</text>'
    # arrows
    pts = [(190,105,250,105),(390,105,450,105),(590,105,650,105),(790,105,850,105)]
    for x1,y1,x2,y2 in pts:
        s += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#475569" stroke-width="2" marker-end="url(#a)"/>'
    # feedback loop
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>'
    s += '<path d="M 920 130 L 920 190 L 100 190 L 100 130" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="4,3"/>'
    s += '<text x="510" y="180" fill="#a78bfa" font-family="sans-serif" font-size="11" text-anchor="middle">感觉反馈（闭环）</text>'
    # Layers
    s += '<text x="60" y="260" fill="#e2e8f0" font-family="sans-serif" font-size="13" font-weight="bold">运动控制的三层结构：</text>'
    layers = [
        (60, 280, "第一层：神经（指令系统）", "大脑→脊髓→运动神经元→神经肌肉接头", "#6366f1"),
        (60, 340, "第二层：肌肉（执行系统）", "运动单位募集 · 大小原则 · 精细vs爆发", "#ef4444"),
        (60, 400, "第三层：筋膜（传力系统）", "滑动 · 传力 · 弹性储能 · 本体感觉", "#f59e0b"),
    ]
    for lx, ly, ltitle, ldesc, lc in layers:
        s += f'<rect x="{lx}" y="{ly}" width="900" height="50" rx="4" fill="{lc}" fill-opacity="0.08" stroke="{lc}" stroke-width="1"/>'
        s += f'<text x="{lx+10}" y="{ly+18}" fill="{lc}" font-family="sans-serif" font-size="12" font-weight="bold">{ltitle}</text>'
        s += f'<text x="{lx+10}" y="{ly+38}" fill="#94a3b8" font-family="sans-serif" font-size="10">{ldesc}</text>'
    s += footer()
    return s

# ============================================================
def make_trigger_cycle():
    s = header(1000, 650, "激痛点形成机制——能量危机恶性循环")
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>'
    nodes = [
        ("肌纤维过度负荷\n(急性/反复/缩短位)", 400, 40, 200, 60, "#ef4444"),
        ("钙离子调节异常\n→ 持续收缩", 400, 140, 200, 60, "#f97316"),
        ("毛细血管被压\n→ 缺血+缺氧", 400, 240, 200, 60, "#eab308"),
        ("ATP不足→钙泵失灵\n→ 更无法放松", 400, 340, 200, 60, "#22c55e"),
        ("代谢废物堆积\n→ 刺激痛觉神经", 400, 440, 200, 60, "#06b6d4"),
        ("脊髓异常兴奋\n→ 更多肌纤维卷入", 400, 540, 200, 60, "#a78bfa"),
    ]
    for i, (label, nx, ny, nw, nh, nc) in enumerate(nodes):
        s += f'<rect x="{nx}" y="{ny}" width="{nw}" height="{nh}" rx="6" fill="{nc}" fill-opacity="0.12" stroke="{nc}" stroke-width="1.5"/>'
        lines = label.split('\n')
        for li, ln in enumerate(lines):
            s += f'<text x="{nx+nw//2}" y="{ny+24+li*18}" fill="{nc}" font-family="sans-serif" font-size="11" text-anchor="middle">{ln}</text>'
        # arrow down
        if i < len(nodes) - 1:
            cy = ny + nh
            nxt_y = nodes[i+1][2]
            s += f'<line x1="{nx+nw//2}" y1="{cy}" x2="{nx+nw//2}" y2="{nxt_y}" stroke="#475569" stroke-width="2" marker-end="url(#a)"/>'
    # arrow from last to first
    s += f'<line x1="400" y1="540" x2="400" y2="100" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#a)"/>'
    # summary
    s += '<rect x="150" y="610" width="700" height="30" rx="4" fill="#334155" fill-opacity="0.5"/>'
    s += '<text x="500" y="630" fill="#f87171" font-family="sans-serif" font-size="12" text-anchor="middle" font-weight="bold">总结：激痛点 = 一小团肌纤维因能量危机而无法放松</text>'
    s += footer()
    return s

# ============================================================
def make_referred_pain():
    s = header(900, 500, "牵涉痛机制——脊髓节段\"串线\"现象")
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>'
    # spinal cord
    s += '<rect x="350" y="80" width="200" height="350" rx="10" fill="#334155" fill-opacity="0.3" stroke="#475569" stroke-width="1.5"/>'
    s += '<text x="450" y="110" fill="#e2e8f0" font-family="sans-serif" font-size="12" text-anchor="middle">脊髓(C5-C6节段)</text>'
    s += '<rect x="380" y="140" width="140" height="60" rx="4" fill="#a78bfa" fill-opacity="0.15" stroke="#a78bfa" stroke-width="1"/>'
    s += '<text x="450" y="165" fill="#a78bfa" font-family="sans-serif" font-size="10" text-anchor="middle">后角(痛觉交汇区)</text>'
    # infraspinatus
    s += '<path d="M 100 280 L 380 170" fill="none" stroke="#ef4444" stroke-width="2"/>'
    s += '<circle cx="100" cy="280" r="30" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444" stroke-width="1.5"/>'
    s += '<text x="100" y="275" fill="#ef4444" font-family="sans-serif" font-size="10" text-anchor="middle">冈下肌</text>'
    s += '<text x="100" y="290" fill="#ef4444" font-family="sans-serif" font-size="9" text-anchor="middle">(激痛点)</text>'
    # shoulder front signal
    s += '<path d="M 100 120 L 380 160" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3"/>'
    s += '<circle cx="100" cy="120" r="30" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>'
    s += '<text x="100" y="115" fill="#f59e0b" font-family="sans-serif" font-size="10" text-anchor="middle">肩前侧</text>'
    s += '<text x="100" y="130" fill="#f59e0b" font-family="sans-serif" font-size="9" text-anchor="middle">(正常信号)</text>'
    # brain
    s += '<line x1="450" y1="140" x2="450" y2="60" stroke="#e2e8f0" stroke-width="2" marker-end="url(#a)"/>'
    s += '<ellipse cx="450" cy="45" rx="30" ry="20" fill="#e2e8f0" fill-opacity="0.1" stroke="#e2e8f0" stroke-width="1"/>'
    s += '<text x="450" y="48" fill="#e2e8f0" font-family="sans-serif" font-size="9" text-anchor="middle">大脑</text>'
    # explanation
    texts = [
        ("关键原理：", "#e2e8f0", 12, True),
        ("冈下肌痛觉信号→脊髓C5-C6节段", "#94a3b8", 10.5, False),
        ("同一节段也接收肩前侧的信号", "#94a3b8", 10.5, False),
        ("大脑分不清信号到底来自哪里", "#94a3b8", 10.5, False),
        ("告诉你\"肩前侧痛\"", "#f59e0b", 10.5, False),
        ("——问题实际在肩后侧的冈下肌", "#ef4444", 10.5, False),
        ("", "#94a3b8", 10.5, False),
        ("临床意义：患者说肩前侧痛→", "#f59e0b", 10.5, False),
        ("不要只查前面，查冈下肌和小圆肌", "#22c55e", 10.5, False),
    ]
    for i, (txt, tc, tsize, bold) in enumerate(texts):
        fw = " font-weight=\"bold\"" if bold else ""
        s += f'<text x="600" y="{130+i*22}" fill="{tc}" font-family="sans-serif" font-size="{tsize}"{fw}>{"• " if not bold and txt else ""}{txt}</text>'
    s += footer()
    return s

# ============================================================
def make_upper_cross():
    s = header(700, 550, "上交叉综合征——圆肩+头前引")
    # body
    s += '<ellipse cx="350" cy="240" rx="75" ry="170" fill="none" stroke="#475569" stroke-width="1.5"/>'
    s += '<ellipse cx="350" cy="120" rx="55" ry="65" fill="none" stroke="#475569" stroke-width="1.5"/>'
    # tight muscles - red
    s += '<rect x="300" y="175" width="80" height="35" rx="4" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1.5"/>'
    s += '<text x="340" y="192" fill="#ef4444" font-family="sans-serif" font-size="9" text-anchor="middle">胸大肌(紧)</text>'
    s += '<rect x="315" y="90" width="90" height="35" rx="4" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1.5"/>'
    s += '<text x="360" y="107" fill="#ef4444" font-family="sans-serif" font-size="9" text-anchor="middle">上斜方肌(紧)</text>'
    # weak muscles - blue dashed
    s += '<rect x="400" y="115" width="90" height="35" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>'
    s += '<text x="445" y="132" fill="#3b82f6" font-family="sans-serif" font-size="9" text-anchor="middle">深层颈屈肌(弱)</text>'
    s += '<rect x="390" y="200" width="90" height="35" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>'
    s += '<text x="435" y="217" fill="#3b82f6" font-family="sans-serif" font-size="9" text-anchor="middle">中下斜方肌(弱)</text>'
    # postural arrows
    s += '<path d="M 350 150 Q 290 175 270 185" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#a)"/>'
    s += '<text x="260" y="170" fill="#ef4444" font-family="sans-serif" font-size="10">圆肩→</text>'
    s += '<path d="M 350 65 Q 370 70 395 90" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#a)"/>'
    s += '<text x="375" y="75" fill="#ef4444" font-family="sans-serif" font-size="10">头前引→</text>'
    # legend
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ef4444"/></marker></defs>'
    items = ["胸大肌短缩紧张 → 肩活动度下降", "上斜方肌紧张 → 架拍耸肩", "深层颈屈肌无力 → 头前引", "中下斜方肌无力 → 肩胛骨不稳"]
    s += '<rect x="30" y="400" width="640" height="130" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>'
    s += '<text x="40" y="420" fill="#e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold">表现与后果：</text>'
    for i, item in enumerate(items):
        s += f'<text x="40" y="445+{i*22}" fill="#94a3b8" font-family="sans-serif" font-size="10">• {item}</text>'
    s += '<text x="40" y="445" fill="#94a3b8" font-family="sans-serif" font-size="10">• 胸大肌短缩紧张 → 肩活动度下降</text>'
    s += '<text x="40" y="467" fill="#94a3b8" font-family="sans-serif" font-size="10">• 上斜方肌紧张 → 架拍耸肩</text>'
    s += '<text x="40" y="489" fill="#94a3b8" font-family="sans-serif" font-size="10">• 深层颈屈肌无力 → 头前引</text>'
    s += '<text x="40" y="511" fill="#94a3b8" font-family="sans-serif" font-size="10">• 中下斜方肌无力 → 肩胛骨不稳</text>'
    s += footer()
    return s

def make_lower_cross():
    s = header(700, 550, "下交叉综合征——骨盆前倾")
    s += '<ellipse cx="350" cy="270" rx="75" ry="170" fill="none" stroke="#475569" stroke-width="1.5"/>'
    # tight muscles
    s += '<rect x="310" y="230" width="100" height="35" rx="4" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1.5"/>'
    s += '<text x="360" y="250" fill="#ef4444" font-family="sans-serif" font-size="9" text-anchor="middle">髂腰肌+股直肌(紧)</text>'
    s += '<rect x="320" y="170" width="90" height="35" rx="4" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1.5"/>'
    s += '<text x="365" y="190" fill="#ef4444" font-family="sans-serif" font-size="9" text-anchor="middle">竖脊肌腰部(紧)</text>'
    # weak muscles
    s += '<rect x="400" y="215" width="80" height="35" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>'
    s += '<text x="440" y="232" fill="#3b82f6" font-family="sans-serif" font-size="9" text-anchor="middle">腹肌(弱)</text>'
    s += '<rect x="370" y="320" width="80" height="35" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>'
    s += '<text x="410" y="337" fill="#3b82f6" font-family="sans-serif" font-size="9" text-anchor="middle">臀大肌(弱)</text>'
    # pelvis tilt
    s += '<path d="M 350 300 L 380 270" fill="none" stroke="#ef4444" stroke-width="2" marker-end="url(#a)"/>'
    s += '<text x="385" y="270" fill="#ef4444" font-family="sans-serif" font-size="10">骨盆前倾→</text>'
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ef4444"/></marker></defs>'
    # items
    s += '<rect x="30" y="400" width="640" height="130" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>'
    s += '<text x="40" y="420" fill="#e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold">后果：</text>'
    s += '<text x="40" y="445" fill="#94a3b8" font-family="sans-serif" font-size="10">• 下背痛</text>'
    s += '<text x="40" y="467" fill="#94a3b8" font-family="sans-serif" font-size="10">• 腘绳肌代偿性紧张(骨盆前倾拉长腘绳肌)</text>'
    s += '<text x="40" y="489" fill="#94a3b8" font-family="sans-serif" font-size="10">• 髋关节活动度下降</text>'
    s += footer()
    return s

# ============================================================
def make_rotator_cuff():
    s = header(800, 550, "肩袖四肌——包裹肱骨头的稳定系统")
    # glenoid
    s += '<ellipse cx="320" cy="280" rx="30" ry="45" fill="#475569" fill-opacity="0.3" stroke="#64748b" stroke-width="2"/>'
    s += '<text x="320" y="275" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">关节盂</text>'
    # humerus head
    s += '<circle cx="400" cy="280" r="32" fill="#334155" stroke="#64748b" stroke-width="2"/>'
    s += '<text x="400" y="275" fill="#64748b" font-family="sans-serif" font-size="10" text-anchor="middle">肱骨头</text>'
    s += '<rect x="395" y="312" width="10" height="100" fill="#334155" stroke="#64748b" stroke-width="1.5"/>'
    # muscles
    muscles = [
        ("冈上肌", 360, 235, 55, 28, "#ef4444", "外展0-30°"),
        ("冈下肌", 435, 255, 55, 28, "#f59e0b", "外旋"),
        ("小圆肌", 440, 290, 55, 28, "#22c55e", "外旋+内收"),
        ("肩胛下肌", 360, 310, 55, 28, "#3b82f6", "内旋"),
    ]
    for name, mx, my, mw, mh, mc, func in muscles:
        s += f'<rect x="{mx}" y="{my}" width="{mw}" height="{mh}" rx="4" fill="{mc}" fill-opacity="0.15" stroke="{mc}" stroke-width="1.5"/>'
        s += f'<text x="{mx+mw//2}" y="{my+14}" fill="{mc}" font-family="sans-serif" font-size="9" text-anchor="middle" font-weight="bold">{name}</text>'
        s += f'<text x="{mx+mw//2}" y="{my+24}" fill="{mc}" font-family="sans-serif" font-size="8" text-anchor="middle">{func}</text>'
    # info panel
    s += '<rect x="530" y="80" width="240" height="440" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>'
    s += '<text x="540" y="105" fill="#e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold">核心作用：</text>'
    lines = [
        "肩袖不是\"发力\"肌肉——",
        "它是\"稳定\"的肌肉。",
        "",
        "作用：手臂快速运动时",
        "把肱骨头稳定在关节盂里。",
        "",
        "杀球时肩内旋速度：",
        "7000°/秒",
        "",
        "肩袖不稳定→",
        "• 肱骨头撞击肩峰",
        "  → 肩峰下撞击综合征",
        "• 肌腱过度摩擦",
        "  → 肩袖肌腱炎",
        "• 关节囊被牵拉",
        "  → 肩关节不稳",
    ]
    for i, line in enumerate(lines):
        s += f'<text x="540" y="125+{i*18}" fill="#94a3b8" font-family="sans-serif" font-size="10">{line}</text>'
    s += footer()
    return s

# ============================================================
# Generate all
# ============================================================
os.makedirs(OUT_DIR, exist_ok=True)

files = {
    "motor-control-chain.svg": make_motor_control(),
    "trigger-point-cycle.svg": make_trigger_cycle(),
    "referred-pain.svg": make_referred_pain(),
    "upper-cross-syndrome.svg": make_upper_cross(),
    "lower-cross-syndrome.svg": make_lower_cross(),
    "rotator-cuff.svg": make_rotator_cuff(),
}

for fname, content in files.items():
    fpath = os.path.join(OUT_DIR, fname)
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    sz = os.path.getsize(fpath)
    print(f'OK  {sz:>6}B  {fname}')

print(f'\nTotal: {len(files)} SVG files in {OUT_DIR}')
