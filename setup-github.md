# GitHub发布指南

本文档指导如何将《从零到一：羽毛球系统教学与训练体系》项目发布到GitHub。

## 准备工作

### 1. 创建GitHub账户
如果你还没有GitHub账户，请先注册：
- 访问 https://github.com
- 点击"Sign up"注册新账户
- 完成邮箱验证

### 2. 安装Git
如果你还没有安装Git，请先安装：
- Windows: 下载 https://git-scm.com/download/win
- macOS: `brew install git` 或下载安装包
- Linux: `sudo apt-get install git` (Ubuntu/Debian)

### 3. 配置Git
```bash
# 配置用户名
git config --global user.name "你的名字"

# 配置邮箱
git config --global user.email "你的邮箱"

# 配置默认编辑器（可选）
git config --global core.editor "code --wait"
```

## 发布到GitHub

### 方法一：通过GitHub网页创建

#### 步骤1：创建新仓库
1. 登录GitHub
2. 点击右上角"+"号，选择"New repository"
3. 填写仓库信息：
   - Repository name: `badminton-training-system`
   - Description: `从零到一：羽毛球系统教学与训练体系 - 完整的8级训练系统`
   - Public（公开）或 Private（私有）
   - 不要初始化README.md（我们已经有了）
4. 点击"Create repository"

#### 步骤2：上传文件
1. 在新建的仓库页面，找到上传文件的选项
2. 将`badminton-training-system`文件夹中的所有文件拖拽到上传区域
3. 填写提交信息，如："Initial commit: 羽毛球训练系统v1.0"
4. 点击"Commit changes"

### 方法二：通过Git命令行

#### 步骤1：初始化本地仓库
```bash
# 进入项目目录
cd badminton-training-system

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 羽毛球训练系统v1.0"
```

#### 步骤2：连接到GitHub
```bash
# 添加远程仓库（将YOUR_USERNAME替换为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/badminton-training-system.git

# 推送到GitHub
git push -u origin main
```

### 方法三：通过GitHub Desktop

#### 步骤1：安装GitHub Desktop
- 下载 https://desktop.github.com
- 安装并登录你的GitHub账户

#### 步骤2：创建仓库
1. 点击"File" → "New repository"
2. 填写仓库信息
3. 本地路径选择`badminton-training-system`文件夹
4. 点击"Create repository"

#### 步骤3：发布到GitHub
1. 点击"Publish repository"
2. 填写仓库信息
3. 点击"Publish repository"

## 仓库设置建议

### 1. 仓库描述
在仓库设置中完善描述：
```
从零到一：羽毛球系统教学与训练体系

一个完整的羽毛球教学与训练系统，包含8个渐进式水平级别，从零基础到专业水平。基于NSCA CSCS科学标准和世界顶级教练经验，采用口语化讲解+专业表格的混合风格。
```

### 2. 主题标签
添加相关主题标签：
- badminton
- training
- sports-science
- nsca
- chinese-culture
- education

### 3. README徽章
可以在README.md中添加徽章：
```markdown
![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/badminton-training-system)
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/badminton-training-system)
![GitHub repo size](https://img.shields.io/github/repo-size/YOUR_USERNAME/badminton-training-system)
```

### 4. 分支保护
建议启用分支保护：
- 要求Pull Request审查
- 要求状态检查通过
- 要求线性提交历史

## 后续维护

### 1. 更新内容
```bash
# 拉取最新更改
git pull origin main

# 添加更改
git add .

# 提交更改
git commit -m "更新描述"

# 推送到GitHub
git push origin main
```

### 2. 处理Pull Request
1. 其他人提交Pull Request
2. 审查代码和内容
3. 提出修改建议
4. 测试通过后合并

### 3. 发布版本
```bash
# 创建标签
git tag -a v1.0 -m "版本1.0发布"

# 推送标签
git push origin v1.0
```

## 推广建议

### 1. 社交媒体
- 在Twitter/X上分享
- 在LinkedIn上发布
- 在羽毛球相关论坛分享

### 2. 社区参与
- 提交到相关GitHub主题集合
- 参与开源运动讨论
- 在技术会议上展示

### 3. 协作邀请
- 邀请其他开发者参与
- 邀请羽毛球教练审核
- 邀请运动科学家提供建议

## 问题解决

### 常见问题

#### 1. 权限错误
```
error: failed to push some refs to 'https://github.com/YOUR_USERNAME/badminton-training-system.git'
```
解决方案：
```bash
git pull origin main --rebase
git push origin main
```

#### 2. 大文件上传
如果文件太大，可能需要使用Git LFS：
```bash
# 安装Git LFS
git lfs install

# 跟踪大文件
git lfs track "*.mp4"
git lfs track "*.pdf"

# 添加跟踪文件
git add .gitattributes
```

#### 3. 文件名编码问题
如果文件名显示乱码：
```bash
# 查看当前编码
git config --get core.quotepath

# 设置为false
git config core.quotepath false
```

## 联系方式

如果在发布过程中遇到问题：
- GitHub Issues: 在仓库中提交Issue
- 电子邮件: 通过GitHub个人资料联系
- 社区: 相关技术社区求助

---
*最后更新：2026-03-28*