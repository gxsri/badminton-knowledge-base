#!/usr/bin/env python3
"""
修复所有Level文件的文件名编码问题
"""

import os
import sys

def get_correct_filenames():
    """获取正确的文件名列表"""
    return [
        'Level0_零基础入门阶段.md',
        'Level1_预备阶段.md',
        'Level2_基础建立阶段.md',
        'Level3_技术入门阶段.md',
        'Level4_技术精进阶段.md',
        'Level5_技术成熟阶段.md',
        'Level6_战术应用阶段.md',
        'Level7_比赛准备阶段.md',
        'Level8_专业水平阶段.md'
    ]

def fix_all_filenames():
    """修复所有文件名"""
    
    levels_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system\Levels"
    correct_names = get_correct_filenames()
    
    print("修复所有Level文件名编码...")
    print(f"目录: {levels_dir}")
    print()
    
    # 第一步：备份所有文件内容
    file_contents = {}
    
    # 获取当前所有Level文件
    current_files = []
    for filename in os.listdir(levels_dir):
        if filename.startswith('Level') and filename.endswith('.md'):
            current_files.append(filename)
            filepath = os.path.join(levels_dir, filename)
            
            # 读取内容（尝试多种编码）
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                try:
                    with open(filepath, 'r', encoding='gbk') as f:
                        content = f.read()
                except:
                    with open(filepath, 'r', encoding='latin-1') as f:
                        content = f.read()
            
            file_contents[filename] = content
            print(f"[备份] {filename} -> {len(content)} 字符")
    
    print()
    print(f"备份了 {len(file_contents)} 个文件")
    print()
    
    # 第二步：删除所有旧文件
    print("删除旧文件...")
    for filename in current_files:
        filepath = os.path.join(levels_dir, filename)
        os.remove(filepath)
        print(f"[删除] {filename}")
    
    print()
    
    # 第三步：用正确文件名创建新文件
    print("用正确文件名创建新文件...")
    
    # 创建映射：Level编号 -> 内容
    content_by_level = {}
    for old_name, content in file_contents.items():
        # 提取Level编号
        if len(old_name) >= 6 and old_name[5].isdigit():
            level_num = old_name[5]
            content_by_level[level_num] = content
    
    # 用正确文件名创建文件
    created_count = 0
    for correct_name in correct_names:
        # 提取Level编号
        if correct_name.startswith('Level') and len(correct_name) >= 6:
            level_num = correct_name[5]
            
            if level_num in content_by_level:
                content = content_by_level[level_num]
                filepath = os.path.join(levels_dir, correct_name)
                
                # 用UTF-8编码写入文件
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"[创建] {correct_name} ({len(content)} 字符)")
                created_count += 1
            else:
                print(f"[警告] 未找到Level {level_num} 的内容")
    
    return created_count

def update_git_and_push():
    """更新Git并推送到GitHub"""
    
    print()
    print("更新Git仓库...")
    
    project_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system"
    os.chdir(project_dir)
    
    # 从Git中删除所有Level文件
    print("从Git中删除Level文件...")
    os.system('git rm -r Levels/')
    
    # 重新添加Levels目录
    print("重新添加Level文件...")
    os.system('git add Levels/')
    
    # 提交更改
    commit_msg = "Fix ALL Level filename encoding for GitHub display"
    print(f"提交: {commit_msg}")
    result = os.system(f'git commit -m "{commit_msg}"')
    
    if result != 0:
        print("[错误] Git提交失败")
        return False
    
    print()
    print("推送到GitHub...")
    push_result = os.system('git push origin main')
    
    return push_result == 0

def main():
    print("=" * 60)
    print("GitHub文件名编码修复工具")
    print("=" * 60)
    print("问题: GitHub电脑端和手机端都显示Level文件名乱码")
    print("解决方案: 重新创建所有文件，使用正确UTF-8编码")
    print("=" * 60)
    
    # 修复所有文件名
    created = fix_all_filenames()
    
    if created == 0:
        print("[错误] 未创建任何文件")
        return 1
    
    print()
    print(f"成功创建了 {created} 个文件")
    
    # 验证结果
    print()
    print("验证本地文件...")
    levels_dir = r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system\Levels"
    
    if os.path.exists(levels_dir):
        files = sorted([f for f in os.listdir(levels_dir) if f.endswith('.md')])
        print("当前文件:")
        for f in files:
            print(f"  {f}")
    
    print()
    print("=" * 60)
    print("准备更新GitHub...")
    print("=" * 60)
    
    # 更新Git并推送
    success = update_git_and_push()
    
    if success:
        print()
        print("=" * 60)
        print("[成功] 所有文件名编码修复完成!")
        print("=" * 60)
        print("GitHub仓库: https://github.com/gxsri/badminton-knowledge-base")
        print("Levels目录: https://github.com/gxsri/badminton-knowledge-base/tree/main/Levels")
        print()
        print("现在GitHub应该显示正确的文件名:")
        for name in get_correct_filenames():
            print(f"  {name}")
        print("=" * 60)
        return 0
    else:
        print()
        print("=" * 60)
        print("[错误] 推送失败")
        print("=" * 60)
        print("文件已修复，但需要手动推送:")
        print("cd badminton-training-system")
        print("git add Levels/")
        print("git commit -m 'Fix filename encoding'")
        print("git push origin main")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())