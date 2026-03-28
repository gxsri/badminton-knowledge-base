@echo off
chcp 65001 >nul
title GitHub上传工具 - 羽毛球训练系统

echo ========================================
echo        GitHub上传最终工具
echo ========================================
echo.

echo [信息] 项目: 羽毛球训练系统
echo [信息] 用户名: gxsriphysics
echo [信息] 邮箱: gxsri.physics@gmail.com
echo [信息] 仓库: badminton-training-system
echo.

echo [步骤1] 检查Git配置...
git --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Git未安装，请先安装Git
    echo 下载: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [成功] Git已安装

echo.
echo [步骤2] 进入项目目录...
cd /d "C:\Users\gxsri\.openclaw\workspace\badminton-training-system"
if errorlevel 1 (
    echo [错误] 无法进入项目目录
    pause
    exit /b 1
)
echo [成功] 当前目录: %cd%

echo.
echo [步骤3] 检查Git状态...
git status
echo.

echo [步骤4] 设置远程仓库...
git remote set-url origin https://github.com/gxsriphysics/badminton-training-system.git
echo [成功] 远程仓库已设置

echo.
echo ========================================
echo [重要] 需要GitHub个人访问令牌
echo ========================================
echo.
echo 由于GitHub安全政策，需要使用令牌而不是密码：
echo.
echo 如何获取令牌：
echo 1. 登录GitHub (https://github.com)
echo 2. 访问: https://github.com/settings/tokens
echo 3. 点击"Generate new token"
echo 4. 权限选择: repo (完全控制仓库)
echo 5. 生成并复制令牌
echo.
echo 注意：令牌只显示一次，请妥善保存
echo.

set /p GITHUB_TOKEN=请输入GitHub个人访问令牌: 

if "%GITHUB_TOKEN%"=="" (
    echo [错误] 未输入令牌
    pause
    exit /b 1
)

echo.
echo [步骤5] 配置Git使用令牌...
REM 使用包含令牌的URL
git remote set-url origin https://gxsriphysics:%GITHUB_TOKEN%@github.com/gxsriphysics/badminton-training-system.git

echo.
echo [步骤6] 推送到GitHub...
echo 正在推送，请稍候...
git push -u origin main

if errorlevel 0 (
    echo.
    echo ========================================
    echo [成功] 推送完成！
    echo ========================================
    echo 仓库地址: https://github.com/gxsriphysics/badminton-training-system
    echo.
    echo 下一步：
    echo 1. 访问GitHub查看仓库
    echo 2. 添加仓库描述和标签
    echo 3. 分享项目
) else (
    echo.
    echo ========================================
    echo [错误] 推送失败
    echo ========================================
    echo 可能的原因：
    echo 1. 令牌无效或已过期
    echo 2. 仓库不存在
    echo 3. 网络问题
    echo.
    echo 解决方案：
    echo 1. 确认仓库已创建: https://github.com/gxsriphysics/badminton-training-system
    echo 2. 重新生成令牌
    echo 3. 手动网页上传
)

echo.
pause