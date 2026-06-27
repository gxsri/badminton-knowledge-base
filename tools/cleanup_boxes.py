#!/usr/bin/env python3
"""清理ASCII框转换后残留的 │ 字符和格式问题。"""
import os, re

def cleanup_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. 删除残留的 │ （行首或行尾的）
    content = re.sub(r'^[│\s]+│', '', content, flags=re.MULTILINE)
    content = re.sub(r'│$', '', content, flags=re.MULTILINE)
    
    # 2. 修复 **标题** 放到正确位置
    # **L1：xxx** → **L1：xxx**
    content = re.sub(r'^(\*{0,2})([^*]+?)\*\*$', r'**\2**', content, flags=re.MULTILINE)
    
    # 3. 删除连续 3 行以上的空行
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    
    # 4. 删除 "│" 独立行
    content = re.sub(r'^\s*│\s*$\n?', '', content, flags=re.MULTILINE)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

for d in ['zh', 'en']:
    if os.path.isdir(d):
        for f in sorted(os.listdir(d)):
            if f.endswith('.md'):
                path = os.path.join(d, f)
                if cleanup_file(path):
                    print(f'  ✓ {path}')
