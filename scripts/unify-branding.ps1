# 品牌与编号统一 pass（幂等，可重复执行）
# 依据 docs-data.js：修正每页 <title> 品牌后缀、.doc-badge 编号，
# 统一术语（步伐->步法），修正 index.html 品牌名。
# 用法: pwsh -ExecutionPolicy Bypass -File scripts/unify-branding.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$docs = Join-Path $root 'docs'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Save-Patched($path, $newText, $oldText) {
    if ($newText -ne $oldText) {
        [System.IO.File]::WriteAllText($path, $newText, $utf8)
        Write-Host "patched: $path"
    }
}

# 1) 从 docs-data.js 提取 文件名 -> 编号
$data = [System.IO.File]::ReadAllText((Join-Path $root 'docs-data.js'))
$entries = [regex]::Matches($data, "\{\s*num:\s*'([^']+)',\s*file:\s*'([^']+)'")
$numByFile = @{}
foreach ($m in $entries) { $numByFile[$m.Groups[2].Value] = $m.Groups[1].Value }

# 2) 每个 docs/*.html：品牌后缀 + 编号徽章 + 术语
Get-ChildItem $docs -Filter '*.html' | ForEach-Object {
    $num = $numByFile[$_.Name]
    if (-not $num) { return }
    $path = $_.FullName
    $text = [System.IO.File]::ReadAllText($path)
    $new = [regex]::Replace($text, ' — 羽毛球系统训练</title>', ' — 羽毛球职业训练系统</title>')
    $new = [regex]::Replace($new, '<div class="doc-badge">\d+</div>', '<div class="doc-badge">' + $num + '</div>', 1)
    $new = $new.Replace('步伐', '步法')
    Save-Patched $path $new $text
}

# 3) index.html 品牌
$idx = Join-Path $root 'index.html'
$text = [System.IO.File]::ReadAllText($idx)
$new = $text.Replace('<title>羽毛球系统训练 - NSCA CSCS认证体系</title>', '<title>羽毛球职业训练系统 — NSCA CSCS认证体系</title>')
$new = $new.Replace('<em>羽毛球系统训练</em>', '<em>羽毛球职业训练系统</em>')
$new = $new.Replace('© 2026 羽毛球系统训练 — NSCA CSCS认证体系', '© 2026 羽毛球职业训练系统 — NSCA CSCS认证体系')
$new = $new.Replace('步伐', '步法')
Save-Patched $idx $new $text
Write-Host 'done'
