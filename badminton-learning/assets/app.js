// === Badminton NSCA Training System ===
// Extracted from index.html

// 起始训练量计算
function calcBase() {
    const reps = +document.getElementById('base-reps').value;
    const pct = +document.getElementById('base-pct').value;
    const start = Math.round(reps * pct);
    const next = Math.round(start * 1.1);
    document.getElementById('base-start').textContent = start;
    document.getElementById('base-next').textContent = next;
    document.getElementById('base-result').style.display = 'block';
}

// 热身时间计算
function calcWarmupMain() {
    const age = +document.getElementById('warmup-age').value;
    const intensity = +document.getElementById('warmup-intensity').value;
    const warmup = Math.round((Math.floor(age / 10) + 2) * intensity);
    const cooldown = Math.round((Math.floor(age / 15) + 5) * intensity);
    document.getElementById('warmup-time').textContent = warmup;
    document.getElementById('cooldown-time').textContent = cooldown;
    document.getElementById('warmup-result').style.display = 'block';
}

// 每周训练频率计算
function calcFreqMain() {
    const age = +document.getElementById('freq-age').value;
    const baseFreq = +document.getElementById('freq-type').value;
    const coeff = age < 25 ? 1.2 : age <= 40 ? 1.0 : 0.8;
    const freq = Math.round(baseFreq * coeff * 10) / 10;
    let advice = '';
    if (baseFreq === 3) advice = '力量训练需48-72小时恢复，同一肌群不连续训练。';
    else if (baseFreq === 6) advice = '技术训练以神经疲劳为主，每天可练但注意不要过度。';
    else advice = '间歇/比赛需48-72小时恢复。';
    document.getElementById('freq-value').textContent = freq;
    document.getElementById('freq-advice').textContent = advice;
    document.getElementById('freq-result').style.display = 'block';
}

// TDEE计算
function calcTDEEMain() {
    const gender = document.getElementById('tdee-gender').value;
    const age = +document.getElementById('tdee-age').value;
    const weight = +document.getElementById('tdee-weight').value;
    const height = +document.getElementById('tdee-height').value;
    const activity = +document.getElementById('tdee-activity').value;
    const goal = +document.getElementById('tdee-goal').value;
    
    let bmr = gender === 'male' 
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    
    const tdee = Math.round(bmr * activity + goal);
    document.getElementById('tdee-bmr').textContent = Math.round(bmr);
    document.getElementById('tdee-value').textContent = tdee;
    document.getElementById('tdee-result').style.display = 'block';
}

// 水合计算
function calcWaterMain() {
    const weight = +document.getElementById('water-weight').value;
    const duration = +document.getElementById('water-duration').value;
    const temp = +document.getElementById('water-temp').value;
    
    let base = weight * 33;
    let train = duration * 12;
    let heat = temp > 30 ? (base + train) * 0.2 : 0;
    const total = Math.round(base + train + heat);
    const cups = Math.round(total / 250);
    
    document.getElementById('water-total').textContent = total;
    document.getElementById('water-cups').textContent = cups;
    document.getElementById('water-result').style.display = 'block';
}

// 滚动显示动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.level-card, .module-card, .doc-card, .formula-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// === Search Functionality ===
const searchDocs = [
    { title: '快速开始', file: 'docs/00-quickstart.html', keywords: '开始 入门 基线 评估 测试' },
    { title: '训练哲学', file: 'docs/01-philosophy.html', keywords: '哲学 原则 核心 动作 质量' },
    { title: '核心内容', file: 'docs/01-core-content.html', keywords: '核心 理念 体系 模块' },
    { title: '基线评估', file: 'docs/02-assessment.html', keywords: '评估 测试 基线 水平' },
    { title: 'Level 0：零基础启蒙', file: 'docs/03-level-0.html', keywords: '零基础 启蒙 神经 肌肉 控制' },
    { title: '功能筛查', file: 'docs/03-bsfs-screening.html', keywords: '筛查 功能 评估 测试' },
    { title: 'Level 1：基础建立', file: 'docs/04-level-1.html', keywords: '基础 力量 稳定 关节' },
    { title: 'Level 2：技术入门', file: 'docs/05-level-2.html', keywords: '技术 入门 击球 步法' },
    { title: '正手高远球', file: 'docs/05-clear-shot.html', keywords: '正手 高远球 发力 技术' },
    { title: 'Level 3：技术熟练', file: 'docs/06-level-3.html', keywords: '技术 熟练 自动化 变化' },
    { title: '4周训练计划', file: 'docs/06-four-week-plan.html', keywords: '训练 计划 周期 安排' },
    { title: 'Level 4：技术精进', file: 'docs/07-level-4.html', keywords: '技术 精进 高级 精细化' },
    { title: '心理训练', file: 'docs/07-psychological-training.html', keywords: '心理 注意力 压力 决策 自信' },
    { title: 'Level 5：战术应用', file: 'docs/08-level-5.html', keywords: '战术 应用 比赛 阅读' },
    { title: '营养与恢复', file: 'docs/08-nutrition-recovery.html', keywords: '营养 恢复 TDEE 蛋白质 碳水' },
    { title: 'Level 6：准专业', file: 'docs/09-level-6.html', keywords: '准专业 全面 发展' },
    { title: '力量体能', file: 'docs/09-strength-conditioning.html', keywords: '力量 体能 代谢 间歇 周期' },
    { title: 'Level 7：职业水平', file: 'docs/10-level-7.html', keywords: '职业 水平 比赛 心理' },
    { title: '步伐训练', file: 'docs/11-footwork.html', keywords: '步伐 步法 启动 节奏 移动' },
    { title: '技术全解析', file: 'docs/15-technique-analysis.html', keywords: '技术 发力 握拍 网前' },
    { title: '运动解剖与康复', file: 'docs/17-anatomy-rehabilitation.html', keywords: '解剖 康复 肌肉 筋膜 激痛点' },
    { title: '纠错指南', file: 'docs/20-error-correction.html', keywords: '纠错 错误 纠正 诊断' },
    { title: '热身与整理', file: 'docs/22-warmup-cooldown.html', keywords: '热身 整理 拉伸 恢复' },
    { title: '训练安全边界', file: 'docs/24-safety-guide.html', keywords: '安全 损伤 RICE 重返 标准' },
    { title: '安全检查', file: 'docs/25-safety-checklist.html', keywords: '安全 检查 预防 损伤' },
    { title: '睡眠优化', file: 'docs/26-sleep-optimization.html', keywords: '睡眠 优化 恢复 生长激素' },
    { title: '比赛准备', file: 'docs/27-competition-prep.html', keywords: '比赛 准备 赛前 赛中 赛后' },
    { title: '级别定位器', file: 'docs/29-level-locator.html', keywords: '级别 定位 评估 工具' },
    { title: '成就系统', file: 'docs/30-achievements.html', keywords: '成就 进步 动力 记录' }
];

function openSearch() {
    document.getElementById('search-modal').style.display = 'block';
    setTimeout(() => document.getElementById('search-input').focus(), 100);
}

function closeSearch() {
    document.getElementById('search-modal').style.display = 'none';
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
}

function doSearch(query) {
    const results = document.getElementById('search-results');
    if (!query.trim()) {
        results.innerHTML = '<div style="padding:1rem;color:var(--text-2);text-align:center">输入关键词搜索文档</div>';
        return;
    }
    const q = query.toLowerCase();
    const matches = searchDocs.filter(d =>
        d.title.toLowerCase().includes(q) || d.keywords.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
        results.innerHTML = '<div style="padding:1rem;color:var(--text-2);text-align:center">未找到匹配结果</div>';
        return;
    }
    results.innerHTML = matches.map(d => `
        <a href="${d.file}" style="display:block;padding:0.75rem 1rem;text-decoration:none;color:var(--text);border-radius:6px;transition:background 0.2s" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'">
            <div style="font-weight:600;font-size:0.9rem">${d.title}</div>
            <div style="font-size:0.8rem;color:var(--text-2)">${d.file}</div>
        </a>
    `).join('');
}

// Keyboard shortcut for search
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
    if (e.key === 'Escape') closeSearch();
});
