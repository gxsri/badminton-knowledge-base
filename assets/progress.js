// === Progress Tracking & Navigation Module ===
// Used by all docs/*.html pages

const BNSCA = {
    // All docs with metadata
    docs: [
        { id: '00', file: '00-quickstart.html', title: '快速开始', group: 'foundation' },
        { id: '01p', file: '01-philosophy.html', title: '训练哲学', group: 'foundation' },
        { id: '01c', file: '01-core-content.html', title: '核心内容', group: 'foundation' },
        { id: '02', file: '02-assessment.html', title: '基线评估', group: 'foundation' },
        { id: '03l0', file: '03-level-0.html', title: 'Level 0：零基础启蒙', group: 'levels' },
        { id: '03bsfs', file: '03-bsfs-screening.html', title: '功能筛查', group: 'assessment' },
        { id: '04', file: '04-level-1.html', title: 'Level 1：基础建立', group: 'levels' },
        { id: '05l2', file: '05-level-2.html', title: 'Level 2：技术入门', group: 'levels' },
        { id: '05cs', file: '05-clear-shot.html', title: '正手高远球', group: 'technique' },
        { id: '06l3', file: '06-level-3.html', title: 'Level 3：技术熟练', group: 'levels' },
        { id: '06p', file: '06-four-week-plan.html', title: '4周训练计划', group: 'training' },
        { id: '07l4', file: '07-level-4.html', title: 'Level 4：技术精进', group: 'levels' },
        { id: '07psych', file: '07-psychological-training.html', title: '心理训练', group: 'mental' },
        { id: '08l5', file: '08-level-5.html', title: 'Level 5：战术应用', group: 'levels' },
        { id: '08nr', file: '08-nutrition-recovery.html', title: '营养与恢复', group: 'recovery' },
        { id: '09l6', file: '09-level-6.html', title: 'Level 6：准专业', group: 'levels' },
        { id: '09sc', file: '09-strength-conditioning.html', title: '力量体能', group: 'training' },
        { id: '10', file: '10-level-7.html', title: 'Level 7：职业水平', group: 'levels' },
        { id: '11', file: '11-footwork.html', title: '步伐训练', group: 'technique' },
        { id: '15', file: '15-technique-analysis.html', title: '技术全解析', group: 'technique' },
        { id: '17', file: '17-anatomy-rehabilitation.html', title: '运动解剖与康复', group: 'recovery' },
        { id: '20', file: '20-error-correction.html', title: '纠错指南', group: 'technique' },
        { id: '22', file: '22-warmup-cooldown.html', title: '热身与整理', group: 'training' },
        { id: '24', file: '24-safety-guide.html', title: '训练安全边界', group: 'safety' },
        { id: '25', file: '25-safety-checklist.html', title: '安全检查', group: 'safety' },
        { id: '26', file: '26-sleep-optimization.html', title: '睡眠优化', group: 'recovery' },
        { id: '27', file: '27-competition-prep.html', title: '比赛准备', group: 'competition' },
        { id: '29', file: '29-level-locator.html', title: '级别定位器', group: 'tools' },
        { id: '30', file: '30-achievements.html', title: '成就系统', group: 'tools' },
        { id: '31', file: '31-search.html', title: '搜索', group: 'tools' }
    ],

    groups: {
        foundation: { label: '基础', color: '#3b82f6' },
        levels: { label: '等级', color: '#a855f7' },
        technique: { label: '技术', color: '#22c55e' },
        training: { label: '训练', color: '#f97316' },
        mental: { label: '心理', color: '#ec4899' },
        recovery: { label: '恢复', color: '#06b6d4' },
        safety: { label: '安全', color: '#ef4444' },
        competition: { label: '比赛', color: '#eab308' },
        assessment: { label: '评估', color: '#8b5cf6' },
        tools: { label: '工具', color: '#64748b' }
    },

    // localStorage key
    STORAGE_KEY: 'bnsca_progress',

    // Get progress from localStorage
    getProgress() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    },

    // Save progress to localStorage
    saveProgress(progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    },

    // Mark a doc as read
    markRead(file) {
        const progress = this.getProgress();
        progress[file] = { ...progress[file], read: true, timestamp: Date.now() };
        this.saveProgress(progress);
    },

    // Check if a doc is read
    isRead(file) {
        const progress = this.getProgress();
        return !!progress[file]?.read;
    },

    // Get total progress percentage
    getProgressPct() {
        const progress = this.getProgress();
        const total = this.docs.filter(d => !d.file.includes('search')).length;
        const read = this.docs.filter(d => progress[d.file]?.read).length;
        return Math.round((read / total) * 100);
    },

    // Get current doc from URL
    getCurrentDoc() {
        const file = window.location.pathname.split('/').pop();
        return this.docs.find(d => d.file === file);
    },

    // Get prev/next docs
    getNavDocs() {
        const current = this.getCurrentDoc();
        if (!current) return { prev: null, next: null };
        const idx = this.docs.findIndex(d => d.file === current.file);
        return {
            prev: idx > 0 ? this.docs[idx - 1] : null,
            next: idx < this.docs.length - 1 ? this.docs[idx + 1] : null
        };
    },

    // Render back navigation bar
    renderNav() {
        const current = this.getCurrentDoc();
        if (!current) return;
        const { prev, next } = this.getNavDocs();
        const pct = this.getProgressPct();

        const navHTML = `
        <div class="back">
            <div class="back-left">
                <a href="../index.html">← 首页</a>
                <ul class="back-nav">
                    <li><a href="${prev ? prev.file : '#'}" ${prev ? '' : 'style="opacity:0.3;pointer-events:none"'}>‹ 上一课</a></li>
                    <li><a href="${next ? next.file : '#'}" ${next ? '' : 'style="opacity:0.3;pointer-events:none"'}>下一课 ›</a></li>
                </ul>
            </div>
            <div style="display:flex;align-items:center;gap:1rem">
                <span style="font-size:0.8rem;color:var(--text-2)">${pct}% 已学</span>
                <a href="../index.html" style="font-size:0.85rem">目录</a>
            </div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>`;

        document.body.insertAdjacentHTML('afterbegin', navHTML);
    },

    // Render back-to-top button
    renderBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '↑';
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 300);
        });
    },

    // Initialize on doc page
    init() {
        const current = this.getCurrentDoc();
        if (!current) return;

        // Mark as read
        this.markRead(current.file);

        // Render navigation
        this.renderNav();

        // Render back-to-top
        this.renderBackToTop();

        // Scroll progress
        window.addEventListener('scroll', () => {
            const fill = document.querySelector('.progress-fill');
            if (fill) {
                const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                fill.style.width = Math.min(scrolled, 100) + '%';
            }
        });
    }
};

// Auto-init on doc pages
if (window.location.pathname.includes('/docs/')) {
    document.addEventListener('DOMContentLoaded', () => BNSCA.init());
}
