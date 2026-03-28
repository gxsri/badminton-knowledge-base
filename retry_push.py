#!/usr/bin/env python3
"""
重试推送脚本
"""

import subprocess
import time
import sys

def run_git_push(max_retries=3, retry_delay=5):
    """运行git push，支持重试"""
    
    print("尝试推送到GitHub...")
    print("仓库: https://github.com/gxsri/badminton-knowledge-base")
    print()
    
    for attempt in range(1, max_retries + 1):
        print(f"尝试 {attempt}/{max_retries}...")
        
        try:
            # 运行git push
            result = subprocess.run(
                ['git', 'push', 'origin', 'main'],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                print("[成功] 推送完成!")
                print(f"输出: {result.stdout}")
                return True
            else:
                print(f"[失败] 推送失败 (尝试 {attempt})")
                print(f"错误: {result.stderr[:200]}")
                
                if attempt < max_retries:
                    print(f"等待 {retry_delay} 秒后重试...")
                    time.sleep(retry_delay)
                else:
                    print("已达到最大重试次数")
                    return False
                    
        except subprocess.TimeoutExpired:
            print(f"[超时] 推送超时 (尝试 {attempt})")
            if attempt < max_retries:
                print(f"等待 {retry_delay} 秒后重试...")
                time.sleep(retry_delay)
            else:
                print("已达到最大重试次数")
                return False
                
        except Exception as e:
            print(f"[异常] 推送异常: {e}")
            if attempt < max_retries:
                print(f"等待 {retry_delay} 秒后重试...")
                time.sleep(retry_delay)
            else:
                print("已达到最大重试次数")
                return False
    
    return False

def main():
    print("=" * 60)
    print("GitHub推送重试脚本")
    print("=" * 60)
    
    # 进入项目目录
    import os
    os.chdir(r"C:\Users\gxsri\.openclaw\workspace\badminton-training-system")
    print(f"工作目录: {os.getcwd()}")
    print()
    
    # 检查当前状态
    print("检查Git状态...")
    try:
        status_result = subprocess.run(
            ['git', 'status'],
            capture_output=True,
            text=True,
            timeout=10
        )
        print(status_result.stdout)
    except Exception as e:
        print(f"检查状态失败: {e}")
    
    print()
    
    # 尝试推送
    success = run_git_push(max_retries=3, retry_delay=5)
    
    if success:
        print()
        print("=" * 60)
        print("[成功] 所有文档已推送到GitHub!")
        print("=" * 60)
        print("仓库地址: https://github.com/gxsri/badminton-knowledge-base")
        print()
        print("包含内容:")
        print("- Level 0-8 完整训练文档 (9个级别)")
        print("- 完整的项目文档和指南")
        print("- 开源许可证和贡献指南")
        print("=" * 60)
        return 0
    else:
        print()
        print("=" * 60)
        print("[失败] 推送未完成")
        print("=" * 60)
        print("可能的原因:")
        print("1. 网络连接不稳定")
        print("2. GitHub服务暂时不可用")
        print("3. 令牌权限问题")
        print()
        print("建议:")
        print("1. 稍后重试")
        print("2. 使用网页上传ZIP文件")
        print("3. 检查网络连接")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())