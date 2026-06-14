@echo off
chcp 65001 >nul
echo GitHub推送脚本 - 羽毛球知识库
echo ========================================
echo.

echo 检查网络连接...
ping -n 2 github.com >nul
if %errorlevel% neq 0 (
    echo [错误] 无法连接到GitHub
    echo 请检查网络连接后重试
    pause
    exit /b 1
)

echo [成功] 网络连接正常
echo.

echo 检查Git状态...
cd /d "%~dp0"
git status

echo.
echo 推送到GitHub...
echo 仓库: https://github.com/gxsri/badminton-knowledge-base
echo.

git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] 所有文档已推送到GitHub!
    echo ========================================
    echo 仓库地址: https://github.com/gxsri/badminton-knowledge-base
    echo.
    echo 包含内容:
    echo - Level 0-8 完整训练文档 (9个级别)
    echo - 完整的项目文档和指南
    echo - 开源许可证和贡献指南
    echo ========================================
) else (
    echo.
    echo [错误] 推送失败，错误码: %errorlevel%
    echo.
    echo 建议:
    echo 1. 检查网络连接
    echo 2. 检查GitHub令牌是否有效
    echo 3. 手动网页上传ZIP文件
)

pause