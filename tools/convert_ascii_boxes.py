#!/usr/bin/env python3
"""将 .md 文件中的 ASCII 画框（┌──┐ ... └──┘）转为结构化 Markdown。

用法:
  python tools/convert_ascii_boxes.py zh/19-national-team-systems.md
  python tools/convert_ascii_boxes.py zh/21-women-training.md
  python tools/convert_ascii_boxes.py --all
"""

import re
import sys
import os

BOX_START = re.compile(r'^\s*┌[─┄┈]+\w?')
BOX_END   = re.compile(r'^\s*└[─┄┈]+')

def is_box_line(line):
    """判断一行是否属于ASCII画框（边框或内容）。"""
    stripped = line.strip()
    if not stripped:
        return False
    # 边框线
    if stripped.startswith(('┌', '└', '├', '┤', '┴', '┬')):
        return True
    if stripped.startswith('│'):
        return True
    # 有些框用 ===== 做顶底
    if stripped.startswith('==='):
        return True
    return False

def clean_content_line(line):
    """去掉 │ 和首尾空格，保留缩进。"""
    # 找出缩进
    indent = len(line) - len(line.lstrip())
    stripped = line.strip()
    # 去掉开头的 │ 或 ├ 等
    if stripped.startswith('│'):
        stripped = stripped[1:]
    elif stripped.startswith(('├', '┤', '┴', '┬')):
        # 分隔线 → 跳过
        return None
    elif stripped.startswith(('┌', '└')):
        # 顶底边框 → 跳过
        return None
    # 去掉尾部的 │
    if stripped.endswith('│'):
        stripped = stripped[:-1]
    stripped = stripped.strip()
    if not stripped:
        return None
    return ' ' * indent + stripped

def convert_box_to_markdown(box_lines):
    """将 ASCII 框内容转为结构化 Markdown。"""
    lines = []
    for raw in box_lines:
        cleaned = clean_content_line(raw)
        if cleaned is not None:
            lines.append(cleaned)
    if not lines:
        return ''
    
    # 判断是数据表还是文本框
    # 如果有多个 │ 且内容对齐的 → 可能是表格
    # 简单处理：全部转为缩进列表
    
    # 检测是否是分阶段训练描述
    phase_pattern = re.compile(r'阶段|第[一二三四五六七八九十]阶段|第\d周')
    has_phases = any(phase_pattern.search(l) for l in lines)
    
    if has_phases:
        # 阶段描述 → 用 **标题** + 列表
        result = []
        for line in lines:
            if phase_pattern.search(line):
                # 阶段标题加粗
                result.append(f'\n**{line.strip()}**')
            elif line.startswith('    '):
                # 缩进内容变成列表
                result.append(f'- {line.strip()}')
            else:
                result.append(f'- {line.strip()}')
        return '\n'.join(result)
    else:
        # 普通文本框 → 简单列表或代码块
        # 如果只有1-2行 → 一行文本
        if len(lines) <= 2:
            return '\n'.join(lines)
        # 多行 → 缩进列表
        result = []
        for line in lines:
            result.append(f'- {line.strip()}')
        return '\n'.join(result)


def process_file(filepath):
    """处理单个文件，转换所有ASCII框。"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 按行处理，逐块查找
    lines = content.split('\n')
    new_lines = []
    i = 0
    in_box = False
    box_buffer = []
    box_start_idx = -1
    converted_count = 0
    
    while i < len(lines):
        line = lines[i]
        
        if not in_box and BOX_START.match(line):
            # 进入一个框
            in_box = True
            box_buffer = [line]
            box_start_idx = len(new_lines)
            i += 1
            continue
        
        if in_box:
            box_buffer.append(line)
            if BOX_END.match(line):
                # 框结束
                converted = convert_box_to_markdown(box_buffer)
                if converted:
                    new_lines.append(converted)
                    converted_count += 1
                in_box = False
                box_buffer = []
                i += 1
                continue
            i += 1
            continue
        
        if not in_box:
            new_lines.append(line)
            i += 1
    
    # 处理未关闭的框
    if in_box:
        # 回退 buffer 中的内容
        for bl in box_buffer:
            new_lines.append(bl)
    
    result = '\n'.join(new_lines)
    
    if result != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f'  ✓ {filepath} — 转换了 {converted_count} 个框')
    else:
        print(f'  - {filepath} — 无变化')


def main():
    if '--all' in sys.argv:
        base_dirs = ['zh', 'en']
        targets = []
        for d in base_dirs:
            if os.path.isdir(d):
                for f in sorted(os.listdir(d)):
                    if f.endswith('.md'):
                        targets.append(os.path.join(d, f))
        for f in targets:
            process_file(f)
    else:
        files = [f for f in sys.argv[1:] if not f.startswith('--') and f.endswith('.md')]
        if not files:
            print(__doc__)
            return
        for f in files:
            if os.path.exists(f):
                process_file(f)
            else:
                print(f'  ✗ 文件不存在: {f}')


if __name__ == '__main__':
    main()
