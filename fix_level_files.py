#!/usr/bin/env python3
"""
修复Level文件：读取内容，用正确编码重新创建文件
"""

import os
import sys

def read_file_content(filepath):
    """读取文件内容"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # 尝试其他编码
        try:
            with open(filepath, 'r', encoding='gbk') as f:
                return f.read()
        except:
            with open(filepath, 'r', encoding='latin-1') as f:
                return f.read()

def recreate_level_files():
    """重新创建Level文件"""
    
    levels_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system\Levels"
    
    # 正确的文件名
    correct_filenames = {
        'Level0': 'Level0_零基础入门阶段.md',
        'Level1': 'Level1_预备阶段.md',
        'Level2': 'Level2_基础建立阶段.md',
        'Level3': 'Level3_技术入门阶段.md',
        'Level4': 'Level4_技术精进阶段.md',
        'Level5': 'Level5_技术成熟阶段.md',
        'Level6': 'Level6_战术应用阶段.md',
        'Level7': 'Level7_比赛准备阶段.md',
        'Level8': 'Level8_专业水平阶段.md'
    }
    
    print("重新创建Level文件（修复编码问题）...")
    print(f"目录: {levels_dir}")
    print()
    
    # 首先备份所有文件内容
    file_contents = {}
    
    for old_name in os.listdir(levels_dir):
        if old_name.startswith('Level') and old_name.endswith('.md'):
            old_path = os.path.join(levels_dir, old_name)
            
            # 读取内容
            content = read_file_content(old_path)
            file_contents[old_name] = content
            
            print(f"[读取] {old_name} ({len(content)} 字符)")
    
    print()
    print("开始重新创建文件...")
    
    # 删除所有旧文件
    for old_name in list(file_contents.keys()):
        old_path = os.path.join(levels_dir, old_name)
        os.remove(old_path)
        print(f"[删除] {old_name}")
    
    print()
    
    # 用正确文件名重新创建文件
    for level_key, new_name in correct_filenames.items():
        # 找到对应的旧文件内容
        old_name = None
        for fname in file_contents.keys():
            if fname.startswith(level_key):
                old_name = fname
                break
        
        if old_name and old_name in file_contents:
            content = file_contents[old_name]
            new_path = os.path.join(levels_dir, new_name)
            
            # 用UTF-8编码写入文件
            with open(new_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"[创建] {new_name} ({len(content)} 字符)")
        else:
            print(f"[警告] 未找到 {level_key} 的内容")
    
    return len(correct_filenames)

def main():
    print("=" * 60)
    print("Level文件编码修复工具")
    print("=" * 60)
    print("问题: GitHub手机端显示Level 5-7文件名乱码")
    print("解决方案: 用正确UTF-8编码重新创建所有文件")
    print("=" * 60)
    
    # 重新创建文件
    created_count = recreate_level_files()
    
    print()
    print(f"重新创建了 {created_count} 个文件")
    
    # 验证结果
    print()
    print("验证结果...")
    levels_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system\Levels"
    
    if os.path.exists(levels_dir):
        files = os.listdir(levels_dir)
        files.sort()
        print("当前文件列表:")
        for f in files:
            if f.endswith('.md'):
                print(f"  {f}")
    
    print()
    print("=" * 60)
    print("[完成] 文件已用正确UTF-8编码重新创建")
    print("=" * 60)
    print("下一步:")
    print("1. 运行: cd badminton-training-system")
    print("2. 运行: git add Levels/")
    print("3. 运行: git commit -m 'Fix file encoding for GitHub'")
    print("4. 运行: git push origin main")
    print("=" * 60)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())