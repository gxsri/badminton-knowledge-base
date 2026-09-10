# 文档库规范重命名：为每份文档分配唯一的前缀编号（编号 = 登记表中的展示编号）。
# 用法: pwsh -File scripts/renumber-docs.ps1
# 幂等：已在目标名的文件会被跳过。执行后请运行 node tests/regression.mjs 验证。

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$docs = Join-Path $root 'docs'

# old basename -> new basename (仅文件名，不含 docs/ 前缀)
$map = [ordered]@{
    '01-core-content.html'          = '03-core-content.html'
    '03-level-0.html'               = '04-level-0.html'
    '04-level-1.html'               = '05-level-1.html'
    '05-level-2.html'               = '06-level-2.html'
    '06-level-3.html'               = '07-level-3.html'
    '07-level-4.html'               = '08-level-4.html'
    '08-level-5.html'               = '09-level-5.html'
    '09-level-6.html'               = '10-level-6.html'
    '10-level-7.html'               = '11-level-7.html'
    '05-clear-shot.html'            = '12-clear-shot.html'
    '06-four-week-plan.html'        = '13-four-week-plan.html'
    '07-psychological-training.html'= '14-psychological-training.html'
    '08-nutrition-recovery.html'    = '15-nutrition-recovery.html'
    '09-strength-conditioning.html' = '16-strength-conditioning.html'
    '11-footwork.html'              = '19-footwork.html'
    '15-technique-analysis.html'    = '23-technique-analysis.html'
    '17-anatomy-rehabilitation.html'= '25-anatomy-rehabilitation.html'
    '22-warmup-cooldown.html'       = '30-warmup-cooldown.html'
    '24-safety-guide.html'          = '32-safety-guide.html'
    '20-error-correction.html'      = '33-error-correction.html'
    '25-safety-checklist.html'      = '34-safety-checklist.html'
    '26-sleep-optimization.html'    = '35-sleep-optimization.html'
    '27-competition-prep.html'      = '36-competition-prep.html'
    '03-bsfs-screening.html'        = '37-bsfs-screening.html'
    '29-level-locator.html'         = '38-level-locator.html'
    '30-achievements.html'          = '39-achievements.html'
    '31-search.html'                = '40-search.html'
}

# 1) 收集需要改写引用的文件（*.html 与 README.md，docs/ 目录 + 根目录）
$targets = @()
$targets += Get-ChildItem -Path $docs -Filter '*.html' -File
$targets += Get-ChildItem -Path $root -Filter '*.html' -File
$targets += Get-ChildItem -Path $root -Filter 'README.md' -File

# 2) 先改文件内的引用（确保没有旧名出现在任何文本内容中）
$totalReplacements = 0
foreach ($f in $targets) {
    $text = [System.IO.File]::ReadAllText($f.FullName)
    $orig = $text
    foreach ($kv in $map.GetEnumerator()) {
        $count = [regex]::Matches($text, [regex]::Escape($kv.Key)).Count
        if ($count -gt 0) {
            $text = $text.Replace($kv.Key, $kv.Value)
            $totalReplacements += $count
            Write-Host ("    {0}: {1} -> {2}  x{3}" -f $f.Name, $kv.Key, $kv.Value, $count)
        }
    }
    if ($text -ne $orig) {
        $utf8 = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($f.FullName, $text, $utf8)
    }
}
Write-Host "total replacement count: $totalReplacements"

# 3) 物理改名（保留 git 追踪通过后续 git add 识别为 rename）
$moved = 0
foreach ($kv in $map.GetEnumerator()) {
    $old = Join-Path $docs $kv.Key
    $new = Join-Path $docs $kv.Value
    if ((Test-Path $old) -and -not (Test-Path $new)) {
        Move-Item -Path $old -Destination $new
        Write-Host ("    mv {0} -> {1}" -f $kv.Key, $kv.Value)
        $moved++
    }
}
Write-Host "files moved: $moved / $($map.Count)"
