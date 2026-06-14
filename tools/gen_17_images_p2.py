#!/usr/bin/env python3
"""Generate additional SVG anatomy reference images for Chapter 17 - Part 2."""
import os

OUT_DIR = r'D:\athleteiq\athlete_monitor\badmintongithub\docs\zh\images\17'

W, H = 500, 900  # body diagram dimensions

def header(title, w=W, h=H):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n'
            f'  <rect width="{w}" height="{h}" fill="#0f172a" rx="8"/>\n'
            f'  <text x="{w//2}" y="25" fill="#e2e8f0" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">{title}</text>\n')

def footer():
    return '</svg>'

def body_outline():
    """Simple body outline SVG group."""
    return '''
    <!-- Head -->
    <ellipse cx="250" cy="110" rx="40" ry="50" fill="none" stroke="#475569" stroke-width="1.5"/>
    <circle cx="250" cy="95" r="3" fill="#475569"/>
    <path d="M 233 105 Q 240 112 248 108" fill="none" stroke="#475569" stroke-width="1"/>
    <path d="M 267 105 Q 260 112 252 108" fill="none" stroke="#475569" stroke-width="1"/>
    <!-- Neck -->
    <rect x="230" y="155" width="40" height="30" fill="none" stroke="#475569" stroke-width="1.5"/>
    <!-- Torso -->
    <path d="M 180 185 L 180 480 Q 180 500 200 500 L 300 500 Q 320 500 320 480 L 320 185" fill="none" stroke="#475569" stroke-width="1.5"/>
    <!-- Arms -->
    <path d="M 180 200 L 100 320 L 85 450" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 320 200 L 400 320 L 415 450" fill="none" stroke="#475569" stroke-width="1.5"/>
    <!-- Hands -->
    <ellipse cx="82" cy="460" rx="15" ry="10" fill="none" stroke="#475569" stroke-width="1"/>
    <ellipse cx="418" cy="460" rx="15" ry="10" fill="none" stroke="#475569" stroke-width="1"/>
    <!-- Legs -->
    <path d="M 210 500 L 190 700 L 175 830" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 290 500 L 310 700 L 325 830" fill="none" stroke="#475569" stroke-width="1.5"/>
    <!-- Feet -->
    <path d="M 155 830 L 175 830 L 190 840" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 345 830 L 325 830 L 310 840" fill="none" stroke="#475569" stroke-width="1.5"/>
    <!-- Waist line -->
    <line x1="180" y1="380" x2="320" y2="380" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
    <!-- Center line -->
    <line x1="250" y1="185" x2="250" y2="830" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>
    '''

def body_outline_back():
    return '''
    <ellipse cx="250" cy="110" rx="40" ry="50" fill="none" stroke="#475569" stroke-width="1.5"/>
    <rect x="230" y="155" width="40" height="30" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 180 185 L 180 480 Q 180 500 200 500 L 300 500 Q 320 500 320 480 L 320 185" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 180 200 L 100 320 L 85 450" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 320 200 L 400 320 L 415 450" fill="none" stroke="#475569" stroke-width="1.5"/>
    <ellipse cx="82" cy="460" rx="15" ry="10" fill="none" stroke="#475569" stroke-width="1"/>
    <ellipse cx="418" cy="460" rx="15" ry="10" fill="none" stroke="#475569" stroke-width="1"/>
    <path d="M 210 500 L 190 700 L 175 830" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 290 500 L 310 700 L 325 830" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 155 830 L 175 830 L 190 840" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 345 830 L 325 830 L 310 840" fill="none" stroke="#475569" stroke-width="1.5"/>
    <line x1="180" y1="380" x2="320" y2="380" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
    <line x1="250" y1="185" x2="250" y2="830" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>
    <!-- Scapulae -->
    <path d="M 195 260 Q 190 290 200 320" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
    <path d="M 305 260 Q 310 290 300 320" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
    '''

def label(text, x, y, color="#94a3b8", size=8, align="middle"):
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="sans-serif" font-size="{size}" text-anchor="{align}">{text}</text>'

def region_label(text, x, y, w, h, color, alpha="0.15"):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{color}" fill-opacity="{alpha}" stroke="{color}" stroke-width="1"/>'
    lines = text.split('\\n') if '\\n' in text else [text]
    for i, ln in enumerate(lines):
        s += f'<text x="{x+w//2}" y="{y+14+i*12}" fill="{color}" font-family="sans-serif" font-size="8" text-anchor="middle">{ln}</text>'
    return s

# ============================================================
def make_muscle_front():
    s = header("全身肌肉正面视图", 600, 900)
    s += body_outline()
    muscles = [
        ("胸锁乳突肌", 225, 165, 50, 18, "#a78bfa"),
        ("三角肌(前束)", 125, 210, 50, 25, "#3b82f6"),
        ("胸大肌", 185, 210, 60, 55, "#ef4444"),
        ("肱二头肌", 105, 250, 40, 60, "#f59e0b"),
        ("肱三头肌", 335, 250, 40, 50, "#22c55e"),
        ("前臂屈肌群", 90, 330, 40, 60, "#f97316"),
        ("腹直肌", 200, 255, 100, 80, "#ef4444"),
        ("腹外斜肌", 175, 290, 30, 80, "#f59e0b"),
        ("前锯肌", 175, 240, 20, 50, "#a78bfa"),
        ("股四头肌", 195, 395, 110, 110, "#ef4444"),
        ("缝匠肌", 190, 410, 40, 90, "#f59e0b"),
        ("内收肌群", 200, 490, 60, 60, "#a78bfa"),
        ("胫骨前肌", 185, 590, 35, 80, "#3b82f6"),
        ("腓肠肌", 200, 670, 30, 60, "#22c55e"),
    ]
    for name, mx, my, mw, mh, mc in muscles:
        s += region_label(name, mx, my, mw, mh, mc)
    # Connective lines from labels on right side
    s += label("1. 胸大肌 - 杀球主要发力肌", 370, 230, "#ef4444", 9, "start")
    s += label("2. 三角肌前束 - 架拍抬臂", 370, 245, "#3b82f6", 9, "start")
    s += label("3. 腹直肌 - 核心稳定", 370, 260, "#ef4444", 9, "start")
    s += label("4. 股四头肌 - 弓步前腿", 370, 275, "#ef4444", 9, "start")
    s += label("5. 胫骨前肌 - 落地缓冲", 370, 290, "#3b82f6", 9, "start")
    s += label("6. 腓肠肌 - 启动蹬地", 370, 305, "#22c55e", 9, "start")
    s += footer()
    return s

def make_muscle_back():
    s = header("全身肌肉背面视图", 600, 900)
    s += body_outline_back()
    muscles = [
        ("斜方肌(上束)", 210, 185, 75, 35, "#ef4444"),
        ("斜方肌(中下束)", 175, 220, 95, 40, "#f59e0b"),
        ("三角肌(后束)", 135, 215, 45, 25, "#3b82f6"),
        ("冈下肌+小圆肌", 180, 210, 30, 30, "#a78bfa"),
        ("菱形肌", 200, 235, 50, 30, "#22c55e"),
        ("背阔肌", 145, 260, 70, 70, "#ef4444"),
        ("竖脊肌", 230, 270, 40, 100, "#f59e0b"),
        ("腰方肌", 185, 340, 40, 30, "#f97316"),
        ("臀大肌", 175, 380, 100, 55, "#ef4444"),
        ("臀中肌", 160, 360, 50, 30, "#a78bfa"),
        ("腘绳肌", 195, 410, 100, 95, "#f59e0b"),
        ("腓肠肌", 195, 630, 35, 80, "#22c55e"),
        ("比目鱼肌", 185, 690, 30, 50, "#3b82f6"),
        ("跟腱", 200, 750, 20, 40, "#f97316"),
    ]
    for name, mx, my, mw, mh, mc in muscles:
        s += region_label(name, mx, my, mw, mh, mc)
    s += label("1. 斜方肌(中下束) - 肩胛骨稳定", 370, 230, "#f59e0b", 9, "start")
    s += label("2. 背阔肌 - 杀球动力源", 370, 245, "#ef4444", 9, "start")
    s += label("3. 竖脊肌 - 维持直立", 370, 260, "#f59e0b", 9, "start")
    s += label("4. 臀大肌 - 蹬地驱动", 370, 275, "#ef4444", 9, "start")
    s += label("5. 腘绳肌 - 急停刹车", 370, 290, "#f59e0b", 9, "start")
    s += label("6. 腓肠肌 - 弹性储能", 370, 305, "#22c55e", 9, "start")
    s += footer()
    return s

# ============================================================
def make_skeleton():
    s = header("全身骨骼正面视图", 500, 900)
    s += body_outline()
    bones = [
        ("颅骨", 230, 85, 40, 40, "#94a3b8"),
        ("锁骨", 175, 195, 100, 12, "#e2e8f0"),
        ("肩胛骨", 165, 210, 30, 55, "#e2e8f0"),
        ("肱骨", 120, 245, 20, 80, "#e2e8f0"),
        ("桡骨", 105, 335, 15, 65, "#e2e8f0"),
        ("尺骨", 120, 335, 15, 65, "#94a3b8"),
        ("胸骨", 230, 210, 40, 55, "#e2e8f0"),
        ("肋骨", 180, 220, 80, 60, "#94a3b8"),
        ("脊柱(颈椎+)", 240, 160, 20, 180, "#e2e8f0"),
        ("骨盆", 200, 355, 100, 40, "#e2e8f0"),
        ("股骨", 190, 410, 30, 150, "#e2e8f0"),
        ("髌骨", 220, 540, 20, 18, "#e2e8f0"),
        ("胫骨", 195, 565, 25, 120, "#e2e8f0"),
        ("腓骨", 220, 575, 15, 105, "#94a3b8"),
        ("足骨", 185, 710, 60, 40, "#94a3b8"),
    ]
    for name, bx, by, bw, bh, bc in bones:
        s += f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="3" fill="{bc}" fill-opacity="0.2" stroke="{bc}" stroke-width="1"/>'
        s += f'<text x="{bx+bw//2}" y="{by+bh//2+3}" fill="{bc}" font-family="sans-serif" font-size="6.5" text-anchor="middle">{name}</text>'
    # annotations on side
    annots = [
        "锁骨 - 手臂悬挂点", "肩胛骨 - 肩关节底座", "肱骨 - 上臂骨",
        "桡骨+尺骨 - 前臂", "骨盆 - 核心底座", "股骨 - 大腿骨",
        "髌骨 - 膝盖骨", "胫骨+腓骨 - 小腿",
    ]
    for i, a in enumerate(annots):
        s += label(a, 340, 215+i*20, "#94a3b8", 8, "start")
    s += footer()
    return s

# ============================================================
def make_trigger_front():
    s = header("激痛点分布(正面)", 650, 900)
    s += body_outline()
    # Trigger point locations as small red dots
    triggers = [
        ("胸大肌\n→肩前+臂内", 205, 230, 30, 30, "#ef4444"),
        ("腹直肌\n→腰部", 230, 280, 25, 25, "#ef4444"),
        ("髂腰肌\n→腹股沟+下背", 220, 370, 30, 25, "#ef4444"),
        ("股四头肌\n→膝前", 225, 450, 25, 25, "#ef4444"),
        ("胫骨前肌\n→足背", 200, 620, 25, 20, "#ef4444"),
        ("肩胛下肌\n→肩后到腕", 120, 230, 25, 25, "#f59e0b"),
        ("冈上肌\n→肩外侧", 155, 195, 25, 25, "#22c55e"),
        ("臀中肌\n→臀外侧到髋", 160, 375, 25, 25, "#a78bfa"),
    ]
    for name, tx, ty, tw, th, tc in triggers:
        s += f'<circle cx="{tx+tw//2}" cy="{ty+th//2}" r="8" fill="{tc}" fill-opacity="0.4" stroke="{tc}" stroke-width="1.5"/>'
        s += f'<rect x="{tx}" y="{ty}" width="{tw}" height="{th}" rx="3" fill="{tc}" fill-opacity="0.08" stroke="{tc}" stroke-width="0.5"/>'
        lines = name.split('\\n')
        for li, ln in enumerate(lines):
            s += f'<text x="{tx+tw//2}" y="{ty+12+li*10}" fill="{tc}" font-family="sans-serif" font-size="7" text-anchor="middle">{ln}</text>'
    # Annotation
    s += label("● 红框=常见激痛点", 370, 200, "#ef4444", 9, "start")
    s += label("→ 箭头=牵涉痛方向", 370, 215, "#94a3b8", 9, "start")
    # Referral arrows
    s += '<path d="M 220 245 Q 240 230 250 220" fill="none" stroke="#ef4444" stroke-width="1" marker-end="url(#a)"/>'
    s += '<path d="M 237 395 L 210 420" fill="none" stroke="#ef4444" stroke-width="1" marker-end="url(#a)"/>'
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ef4444"/></marker></defs>'
    s += footer()
    return s

def make_trigger_back():
    s = header("激痛点分布(背面)", 650, 900)
    s += body_outline_back()
    triggers = [
        ("冈下肌\n→肩前+上臂", 195, 215, 30, 25, "#ef4444"),
        ("斜方肌上束\n→颈侧到太阳穴", 225, 175, 30, 25, "#ef4444"),
        ("菱形肌\n→肩胛区", 210, 245, 30, 25, "#f59e0b"),
        ("竖脊肌腰段\n→臀部", 240, 310, 25, 25, "#ef4444"),
        ("腰方肌\n→骶髂+臀外侧", 195, 335, 30, 25, "#f97316"),
        ("臀大肌\n→臀部+大腿后外侧", 205, 395, 30, 25, "#ef4444"),
        ("腘绳肌\n→大腿后+腘窝", 215, 455, 30, 25, "#f59e0b"),
        ("腓肠肌\n→小腿后+足跟", 205, 660, 30, 25, "#22c55e"),
    ]
    for name, tx, ty, tw, th, tc in triggers:
        s += f'<circle cx="{tx+tw//2}" cy="{ty+th//2}" r="8" fill="{tc}" fill-opacity="0.4" stroke="{tc}" stroke-width="1.5"/>'
        s += f'<rect x="{tx}" y="{ty}" width="{tw}" height="{th}" rx="3" fill="{tc}" fill-opacity="0.08" stroke="{tc}" stroke-width="0.5"/>'
        lines = name.split('\\n')
        for li, ln in enumerate(lines):
            s += f'<text x="{tx+tw//2}" y="{ty+12+li*10}" fill="{tc}" font-family="sans-serif" font-size="7" text-anchor="middle">{ln}</text>'
    # Referral arrows
    s += '<path d="M 210 227 Q 180 200 175 180" fill="none" stroke="#ef4444" stroke-width="1" marker-end="url(#a)"/>'
    s += '<path d="M 252 322 L 230 380" fill="none" stroke="#ef4444" stroke-width="1" marker-end="url(#a)"/>'
    s += '<defs><marker id="a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ef4444"/></marker></defs>'
    # Arrow explanation
    s += label("● 红点=激痛点位置", 370, 200, "#ef4444", 9, "start")
    s += label("→ 箭头=牵涉痛方向", 370, 215, "#94a3b8", 9, "start")
    s += footer()
    return s

# ============================================================
def make_fascial_lines():
    s = header("肌筋膜经线(侧面示意图)", 600, 900)
    # Side body
    s += '''
    <ellipse cx="280" cy="110" rx="35" ry="45" fill="none" stroke="#475569" stroke-width="1.5"/>
    <rect x="265" y="150" width="30" height="25" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 230 175 L 200 400 Q 195 420 210 420 L 300 420 Q 315 420 310 400 L 290 175" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 200 220 L 120 330 L 110 430" fill="none" stroke="#475569" stroke-width="1.5"/>
    <path d="M 230 420 L 200 670 L 190 780" fill="none" stroke="#475569" stroke-width="1.5"/>
    <ellipse cx="107" cy="440" rx="12" ry="8" fill="none" stroke="#475569" stroke-width="1"/>
    <path d="M 170 780 L 190 780 L 200 790" fill="none" stroke="#475569" stroke-width="1.5"/>
    '''
    # Superficial Back Line
    s += '<path d="M 195 780 L 210 700 Q 220 600 230 500 Q 240 400 260 250 Q 280 175 280 150" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="8,4"/>'
    s += label("后表线(SBL)", 290, 580, "#ef4444", 9, "start")
    # Superficial Front Line
    s += '<path d="M 200 790 L 200 700 Q 210 600 220 500 Q 230 380 240 250 Q 255 175 265 155" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="8,4"/>'
    s += label("前表线(SFL)", 100, 450, "#3b82f6", 9, "start")
    # Lateral Line
    s += '<path d="M 200 780 L 195 670 Q 190 550 195 400 Q 200 250 180 200 Q 140 150 110 120" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="4,4"/>'
    s += label("侧线(LL)", 90, 180, "#22c55e", 9, "start")
    # Spiral Line
    s += '<path d="M 280 155 Q 200 180 120 280 Q 140 350 190 380 Q 240 400 280 350" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="2,4"/>'
    s += label("螺旋线(SpL)", 285, 350, "#f59e0b", 9, "start")
    # Arm Line
    s += '<path d="M 230 220 L 160 280 Q 120 340 110 430" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,3"/>'
    s += label("臂前线(AFL)", 115, 400, "#a78bfa", 9, "start")
    # Legend
    s += '<rect x="360" y="130" width="220" height="200" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>'
    s += label("筋膜经线说明：", 370, 150, "#e2e8f0", 10, "start")
    lines_info = [
        ("后表线(SBL)", "#ef4444", "足底→跟腱→腘绳肌→竖脊肌→头顶"),
        ("前表线(SFL)", "#3b82f6", "足背→胫前肌→股直肌→腹直肌→颈"),
        ("侧线(LL)", "#22c55e", "腓骨肌→髂胫束→腹斜肌→肋间肌→颈"),
        ("螺旋线(SpL)", "#f59e0b", "头夹肌→菱形肌→前锯肌→腹斜肌→胫前肌"),
        ("臂前线(AFL)", "#a78bfa", "胸大肌→肱二头肌→前臂屈肌→手掌"),
    ]
    for i, (ln, lc, ld) in enumerate(lines_info):
        s += label(f"━━ {ln}", 370, 175+i*30, lc, 9, "start")
        s += label(ld, 370, 188+i*30, "#94a3b8", 7.5, "start")
    s += footer()
    return s

# ============================================================
def make_knee():
    s = header("膝关节解剖(正面)", 700, 500)
    # Femur
    s += '<rect x="300" y="50" width="40" height="120" rx="8" fill="#94a3b8" fill-opacity="0.3" stroke="#e2e8f0" stroke-width="1.5"/>'
    s += label("股骨", 320, 100, "#e2e8f0", 10, "middle")
    # Patella
    s += '<ellipse cx="320" cy="210" rx="35" ry="30" fill="#e2e8f0" fill-opacity="0.4" stroke="#e2e8f0" stroke-width="1.5"/>'
    s += label("髌骨", 320, 210, "#e2e8f0", 10, "middle")
    # Tibia
    s += '<rect x="300" y="260" width="35" height="130" rx="6" fill="#94a3b8" fill-opacity="0.3" stroke="#e2e8f0" stroke-width="1.5"/>'
    s += label("胫骨", 317, 320, "#e2e8f0", 10, "middle")
    # Fibula
    s += '<rect x="340" y="270" width="15" height="100" rx="4" fill="#94a3b8" fill-opacity="0.15" stroke="#94a3b8" stroke-width="1"/>'
    s += label("腓骨", 347, 310, "#94a3b8", 8, "middle")
    # Quad tendon
    s += '<path d="M 305 170 L 305 195 M 335 170 L 335 195" stroke="#ef4444" stroke-width="2.5"/>'
    s += label("股四头肌腱", 290, 180, "#ef4444", 8, "end")
    # Patellar tendon
    s += '<path d="M 305 240 L 305 260 M 335 240 L 335 260" stroke="#ef4444" stroke-width="2.5"/>'
    s += label("髌腱", 350, 250, "#ef4444", 8, "start")
    # Cartilage
    s += '<path d="M 285 190 Q 320 240 355 190" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,3"/>'
    s += label("关节软骨", 360, 190, "#22c55e", 8, "start")
    # Ligaments
    s += '<path d="M 320 240 L 320 260" stroke="#f59e0b" stroke-width="2"/>'
    s += label("前交叉韧带(ACL)", 330, 275, "#f59e0b", 8, "start")
    s += '<path d="M 295 55 L 275 260" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="4,2"/>'
    s += label("内侧副韧带(MCL)", 250, 150, "#a78bfa", 8, "end")
    # Info panel
    s += '<rect x="40" y="380" width="620" height="100" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>'
    knee_facts = [
        "羽毛球90%的膝盖损伤与髌股关节有关 (VMO无力→髌骨轨迹异常)",
        "前交叉韧带(ACL)损伤在急停变向时最高发",
        "膝盖缓冲角度每增加10°, 髌腱负荷降低约12%",
    ]
    for i, f in enumerate(knee_facts):
        s += label(f"• {f}", 50, 400+i*22, "#94a3b8", 9, "start")
    s += footer()
    return s

# ============================================================
def make_ankle():
    s = header("踝关节解剖(外侧面)", 700, 500)
    # Tibia
    s += '<rect x="310" y="40" width="30" height="110" rx="5" fill="#94a3b8" fill-opacity="0.3" stroke="#e2e8f0" stroke-width="1.5"/>'
    s += label("胫骨", 325, 90, "#e2e8f0", 10, "middle")
    # Fibula
    s += '<rect x="340" y="50" width="20" height="100" rx="4" fill="#94a3b8" fill-opacity="0.2" stroke="#94a3b8" stroke-width="1.5"/>'
    s += label("腓骨", 350, 95, "#94a3b8", 9, "middle")
    # Talus
    s += '<polygon points="310,150 350,150 355,175 305,175" fill="#e2e8f0" fill-opacity="0.3" stroke="#e2e8f0" stroke-width="1.5"/>'
    s += label("距骨", 330, 168, "#e2e8f0", 9, "middle")
    # Calcaneus
    s += '<path d="M 305 175 L 295 220 Q 310 230 330 220 L 345 175" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>'
    s += label("跟骨", 320, 210, "#e2e8f0", 9, "middle")
    # Achilles
    s += '<path d="M 320 85 L 310 215" stroke="#ef4444" stroke-width="3"/>'
    s += label("跟腱", 295, 140, "#ef4444", 9, "end")
    # ATFL
    s += '<path d="M 345 90 L 330 160" stroke="#f59e0b" stroke-width="2.5"/>'
    s += label("距腓前韧带(ATFL)", 350, 125, "#f59e0b", 8, "start")
    # CFL
    s += '<path d="M 342 140 L 310 205" stroke="#a78bfa" stroke-width="2" stroke-dasharray="4,2"/>'
    s += label("跟腓韧带(CFL)", 350, 180, "#a78bfa", 8, "start")
    # Peroneals
    s += '<path d="M 350 60 L 345 160" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,3"/>'
    s += label("腓骨长短肌", 360, 100, "#22c55e", 8, "start")
    # Info panel
    s += '<rect x="40" y="360" width="620" height="120" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>'
    ankle_facts = [
        "羽毛球踝关节扭伤90%为内翻损伤 (距腓前韧带最先受伤)",
        "ATFL是踝关节外侧最薄弱的韧带, 也是最常撕裂的",
        "腓骨长短肌是防止踝内翻的主要动力性稳定结构",
        "POLICE原则: 保护→适当负荷→冰敷→加压→抬高",
    ]
    for i, f in enumerate(ankle_facts):
        s += label(f"• {f}", 50, 380+i*22, "#94a3b8", 9, "start")
    s += footer()
    return s

# ============================================================
os.makedirs(OUT_DIR, exist_ok=True)

files = {
    "muscle_front.svg": make_muscle_front(),
    "muscle_back.svg": make_muscle_back(),
    "skeleton_front.svg": make_skeleton(),
    "trigger_points_front.svg": make_trigger_front(),
    "trigger_points_back.svg": make_trigger_back(),
    "fascial_lines.svg": make_fascial_lines(),
    "knee_anatomy.svg": make_knee(),
    "ankle_anatomy.svg": make_ankle(),
}

for fname, content in files.items():
    fpath = os.path.join(OUT_DIR, fname)
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    sz = os.path.getsize(fpath)
    print(f'OK  {sz:>6}B  {fname}')

print(f'\nTotal: {len(files)} SVG files in {OUT_DIR}')
