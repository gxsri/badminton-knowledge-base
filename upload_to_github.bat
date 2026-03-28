@echo off
echo ========================================
echo GitHub上传脚本 - 羽毛球训练系统
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist "README.md" (
    echo [错误] 请确保在badminton-training-system目录中运行此脚本
    echo 当前目录: %cd%
    pause
    exit /b 1
)

echo [1/6] 检查Git安装...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Git未安装，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Git已安装

echo.
echo [2/6] 配置Git用户信息...
git config user.name "gxsri"
git config user.email "gxsri@github.com"
echo ✓ Git用户信息已配置

echo.
echo [3/6] 初始化Git仓库...
if exist ".git" (
    echo ✓ Git仓库已存在
) else (
    git init
    echo ✓ Git仓库已初始化
)

echo.
echo [4/6] 添加文件到Git...
git add .
echo ✓ 文件已添加到Git

echo.
echo [5/6] 提交更改...
git commit -m "Initial commit: 羽毛球训练系统v1.0 - 完整的8级训练体系"
echo ✓ 更改已提交

echo.
echo [6/6] 连接到GitHub并推送...
echo.
echo 注意：这一步需要你的GitHub凭证
echo.
echo 请按照以下步骤操作：
echo 1. 打开浏览器访问：https://github.com/new
echo 2. 创建新仓库，名称为：badminton-training-system
echo 3. 创建后，复制仓库的HTTPS URL
echo 4. 回到此窗口继续
echo.
set /p GITHUB_URL=请输入GitHub仓库URL（例如：https://github.com/gxsri/badminton-training-system.git）: 

if "%GITHUB_URL%"=="" (
    echo [错误] 未提供GitHub URL
    pause
    exit /b 1
)

echo.
echo 正在连接到GitHub...
git remote add origin "%GITHUB_URL%"
if %errorlevel% neq 0 (
    echo [警告] 远程仓库已存在，更新URL...
    git remote set-url origin "%GITHUB_URL%"
)

echo.
echo 正在推送到GitHub...
echo 注意：可能需要输入GitHub用户名和密码/令牌
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✓ 成功推送到GitHub！
    echo ========================================
    echo 仓库地址：%GITHUB_URL%
    echo.
    echo 下一步：
    echo 1. 访问GitHub查看仓库
    echo 2. 添加仓库描述和标签
    echo 3. 分享给其他人
) else (
    echo.
    echo ========================================
    echo ⚠ 推送失败，请检查：
    echo ========================================
    echo 1. GitHub仓库是否已创建
    echo 2. URL是否正确
    echo 3. GitHub凭证是否正确
    echo 4. 网络连接是否正常
    echo.
    echo 备用方案：使用网页上传
    echo 1. 登录GitHub
    echo 2. 创建仓库 badminton-training-system
    echo 3. 点击"Upload files"
    echo 4. 上传整个文件夹
)

echo.
pause