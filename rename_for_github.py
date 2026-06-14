#!/usr/bin/env python3
"""
为GitHub重命名Level文件，确保中文名正确显示
"""

import os
import sys

def decode_git_filename(encoded_name):
    """解码Git中的八进制编码文件名"""
    # Git显示为: Level5_\346\212\200\346\234\257\346\210\220\347\206\237\351\230\266\346\256\265.md
    # 需要解码\346\212\200这样的八进制编码
    
    import re
    
    def replace_octal(match):
        octal_str = match.group(1)
        try:
            # 八进制转十进制，然后转字符
            char_code = int(octal_str, 8)
            return chr(char_code)
        except:
            return match.group(0)
    
    # 替换八进制编码
    decoded = re.sub(r'\\(\d{3})', replace_octal, encoded_name)
    return decoded

def get_correct_filenames():
    """获取正确的文件名列表"""
    return {
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

def rename_level_files():
    """重命名Level文件"""
    
    levels_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system\Levels"
    correct_names = get_correct_filenames()
    
    print("开始重命名Level文件...")
    print(f"目录: {levels_dir}")
    print()
    
    # 首先，获取当前所有Level文件
    current_files = []
    for filename in os.listdir(levels_dir):
        if filename.startswith('Level') and filename.endswith('.md'):
            current_files.append(filename)
    
    print(f"找到 {len(current_files)} 个Level文件:")
    for f in current_files:
        print(f"  {f}")
    
    print()
    print("开始重命名...")
    
    # 重命名每个文件
    renamed_count = 0
    for old_name in current_files:
        # 提取Level编号
        if len(old_name) >= 6 and old_name[5].isdigit():
            level_num = old_name[5]
            level_key = f'Level{level_num}'
            
            if level_key in correct_names:
                new_name = correct_names[level_key]
                old_path = os.path.join(levels_dir, old_name)
                new_path = os.path.join(levels_dir, new_name)
                
                # 如果新文件名与旧文件名不同，则重命名
                if old_name != new_name:
                    try:
                        os.rename(old_path, new_path)
                        print(f"[重命名] {old_name} -> {new_name}")
                        renamed_count += 1
                    except Exception as e:
                        print(f"[错误] 重命名失败 {old_name}: {e}")
                else:
                    print(f"[跳过] {old_name} 已经是正确名称")
    
    return renamed_count

def update_git():
    """更新Git仓库"""
    
    print()
    print("更新Git仓库...")
    
    project_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system"
    os.chdir(project_dir)
    
    # 删除Levels目录中的所有文件（从Git中）
    os.system('git rm -r Levels/')
    
    # 重新添加Levels目录
    os.system('git add Levels/')
    
    # 提交更改
    commit_msg = "Fix Level 5-7 filename encoding for GitHub mobile display"
    result = os.system(f'git commit -m "{commit_msg}"')
    
    if result == 0:
        print("Git提交成功")
        return True
    else:
        print("Git提交失败")
        return False

def push_to_github():
    """推送到GitHub"""
    
    print()
    print("推送到GitHub...")
    
    try:
        result = os.system('git push origin main')
        if result == 0:
            print("推送成功!")
            return True
        else:
            print("推送失败")
            return False
    except Exception as e:
        print(f"推送异常: {e}")
        return False

def main():
    print("=" * 60)
    print("GitHub文件名修复工具")
    print("=" * 60)
    print("问题: Level 5-7在手机上显示乱码")
    print("解决方案: 重新命名为正确的中文文件名")
    print("=" * 60)
    
    # 1. 重命名文件
    renamed = rename_level_files()
    
    if renamed == 0:
        print("没有需要重命名的文件")
        return 0
    
    print()
    print(f"重命名了 {renamed} 个文件")
    
    # 2. 验证重命名结果
    print()
    print("验证重命名结果...")
    levels_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system\Levels"
    
    if os.path.exists(levels_dir):
        files = os.listdir(levels_dir)
        files.sort()
        print("重命名后的文件:")
        for f in files:
            if f.startswith('Level') and f.endswith('.md'):
                print(f"  {f}")
    
    # 3. 更新Git
    if not update_git():
        print("[错误] Git更新失败")
        return 1
    
    # 4. 推送到GitHub
    print()
    print("=" * 60)
    print("准备推送到GitHub...")
    print("=" * 60)
    
    push_success = push_to_github()
    
    if push_success:
        print()
        print("=" * 60)
        print("[成功] 文件名修复完成!")
        print("=" * 60)
        print("GitHub仓库: https://github.com/gxsri/badminton-knowledge-base")
        print("Levels目录: https://github.com/gxsri/badminton-knowledge-base/tree/main/Levels")
        print()
        print("现在Level 5-7应该在手机上显示正确的中文名:")
        print("- Level5_技术成熟阶段.md")
        print("- Level6_战术应用阶段.md") 
        print("- Level7_比赛准备阶段.md")
        print("=" * 60)
        return 0
    else:
        print()
        print("=" * 60)
        print("[错误] 推送失败")
        print("=" * 60)
        print("文件已重命名，但需要手动推送:")
        print("cd badminton-training-system")
        print("git push origin main")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())