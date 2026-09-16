/* ============================================================
 * site-ui.js — 全站视觉/交互增强（幂等）
 * 功能：阅读进度条、本页目录、回到顶部、深色/浅色切换、
 *       标题锚点、移动端表格横向滚动包裹、主页统计数字滚动
 * 说明：所有元素由脚本注入，页面无需改动结构；样式见 assets/site-ui.css
 * ============================================================ */
(function () {
    'use strict';
    if (window.__blUI) return;
    window.__blUI = true;

    var doc = document;
    var root = doc.documentElement;

    /* ---------- 工具 ---------- */
    function el(tag, id, cls) {
        var n = doc.createElement(tag);
        if (id) n.id = id;
        if (cls) n.className = cls;
        return n;
    }
    function prefersReduced() {
        try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
    }

    /* ---------- 主题切换 ---------- */
    function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
    function applyTheme(t) {
        if (t === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
        updateThemeBtn();
    }
    var themeBtn = el('button', 'bl-theme');
    themeBtn.type = 'button';
    function updateThemeBtn() {
        var light = currentTheme() === 'light';
        themeBtn.textContent = light ? '🌙' : '☀️';
        var label = light ? '切换到深色主题' : '切换到浅色主题';
        themeBtn.setAttribute('aria-label', label);
        themeBtn.title = label;
    }
    themeBtn.addEventListener('click', function () {
        var next = currentTheme() === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try { localStorage.setItem('bl-theme', next); } catch (e) { /* 隐私模式忽略 */ }
    });

    /* ---------- 阅读进度条 ---------- */
    var bar = el('div', 'bl-progress');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', '阅读进度');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');

    /* ---------- 跳到正文（键盘 / 读屏用户） ---------- */
    function addSkipLink() {
        if (doc.querySelector('.bl-skip')) return;
        var target = doc.querySelector('.content') || doc.querySelector('main') || doc.querySelector('.section');
        if (!target) return;
        if (!target.id) target.id = 'bl-main';
        var a = el('a', null, 'bl-skip');
        a.href = '#' + target.id;
        a.textContent = '跳到正文';
        doc.body.appendChild(a);
    }

    /* ---------- 回到顶部 ---------- */
    var topBtn = el('button', 'bl-top');
    topBtn.type = 'button';
    topBtn.textContent = '↑';
    topBtn.setAttribute('aria-label', '回到顶部');
    topBtn.title = '回到顶部';
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
    });

    /* ---------- 本页目录 + 标题锚点 ---------- */
    function slugOf(node, i) { return node.id || ('bl-sec-' + (i + 1)); }
    function buildToc() {
        // 仅文档页（.content 外壳）生成目录；主页为分区式落地页，不注入
        var scope = doc.querySelector('.content');
        if (!scope) return null;
        var heads = Array.prototype.slice.call(scope.querySelectorAll('h2'));
        if (heads.length < 3) return null;
        var nav = el('nav', 'bl-toc');
        nav.setAttribute('aria-label', '本页目录');
        var title = el('div', 'bl-toc-title');
        title.textContent = '本页目录';
        nav.appendChild(title);
        var links = [];
        heads.forEach(function (h, i) {
            var id = slugOf(h, i);
            h.id = id;
            var a = el('a');
            a.href = '#' + id;
            a.textContent = h.textContent.replace(/^[^一-龥A-Za-z0-9]+/, '').trim() || ('第 ' + (i + 1) + ' 节');
            a.title = h.textContent.trim();
            nav.appendChild(a);
            links.push(a);
            var anchor = el('a', null, 'bl-anchor');
            anchor.href = '#' + id;
            anchor.textContent = '#';
            anchor.setAttribute('aria-label', '本节链接');
            h.appendChild(anchor);
        });
        // 滚动高亮
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (!en.isIntersecting) return;
                    var idx = heads.indexOf(en.target);
                    if (idx < 0) return;
                    links.forEach(function (l) { l.classList.remove('active'); });
                    links[idx].classList.add('active');
                });
            }, { rootMargin: '-70px 0px -70% 0px', threshold: 0 });
            heads.forEach(function (h) { io.observe(h); });
        }
        return nav;
    }

    /* ---------- 表格横向滚动包裹（移动端友好） ---------- */
    function wrapTables() {
        var scope = doc.querySelector('.content') || doc.body;
        Array.prototype.slice.call(scope.querySelectorAll('table')).forEach(function (t) {
            if (t.parentNode && t.parentNode.classList && t.parentNode.classList.contains('table-wrap')) return;
            if (t.parentNode && t.parentNode.classList && t.parentNode.classList.contains('bl-table-scroll')) return;
            var w = el('div', null, 'bl-table-scroll');
            t.parentNode.insertBefore(w, t);
            w.appendChild(t);
        });
    }

    /* ---------- 主页统计数字滚动 ---------- */
    function animateStats() {
        var nums = Array.prototype.slice.call(doc.querySelectorAll('.stat-num'));
        nums = nums.filter(function (n) { return /^\d+$/.test(n.textContent.trim()); });
        if (!nums.length || prefersReduced()) return;
        var run = function (node) {
            var target = parseInt(node.textContent.trim(), 10);
            if (!target || target < 10) return;
            var start = null, dur = 900;
            function step(ts) {
                if (start === null) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                node.textContent = Math.round(target * eased);
                if (p < 1) requestAnimationFrame(step);
                else node.textContent = target;
            }
            requestAnimationFrame(step);
        };
        if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
            });
        }, { threshold: 0.4 });
        nums.forEach(function (n) { io.observe(n); });
    }

    /* ---------- 滚动/进度 ---------- */
    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            var st = window.pageYOffset || doc.documentElement.scrollTop || 0;
            var h = Math.max(1, (doc.documentElement.scrollHeight - window.innerHeight));
            var pct = Math.min(100, Math.max(0, (st / h) * 100));
            bar.style.width = pct.toFixed(2) + '%';
            bar.setAttribute('aria-valuenow', Math.round(pct));
            if (st > 480) topBtn.classList.add('show'); else topBtn.classList.remove('show');
            ticking = false;
        });
    }

    /* ---------- 代码块一键复制 ---------- */
    function legacyCopy(text, done) {
        try {
            var ta = doc.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', 'readonly');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            doc.body.appendChild(ta);
            ta.select();
            doc.execCommand('copy');
            doc.body.removeChild(ta);
            done();
        } catch (e) { /* 忽略：可手动选择复制 */ }
    }
    function addCopyButtons() {
        var blocks = Array.prototype.slice.call(doc.querySelectorAll('.code-block, pre'));
        blocks.forEach(function (block) {
            if (block.getAttribute('data-bl-copy')) return;
            block.setAttribute('data-bl-copy', '1');
            var text = block.textContent;
            var btn = el('button', null, 'bl-copy');
            btn.type = 'button';
            btn.textContent = '复制';
            btn.setAttribute('aria-label', '复制本段内容');
            btn.title = '复制本段内容';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var done = function () {
                    btn.textContent = '✓ 已复制';
                    btn.classList.add('ok');
                    setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('ok'); }, 1600);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done); });
                } else legacyCopy(text, done);
            });
            block.classList.add('bl-copyable');
            block.appendChild(btn);
        });
    }

    /* ---------- 文档快速切换器 + 面包屑（读取 docs-data.js 登记表） ---------- */
    function registryUrl() {
        var tags = doc.querySelectorAll('script[src]');
        for (var i = 0; i < tags.length; i++) {
            var src = tags[i].getAttribute('src') || '';
            if (src.indexOf('site-ui.js') > -1) return src.replace('assets/site-ui.js', 'docs-data.js');
        }
        return null;
    }
    function currentFile() {
        var parts = location.pathname.split('/');
        var last = parts[parts.length - 1];
        return (!last || last === '') ? 'index.html' : last;
    }
    function buildSwitcher(data) {
        if (!data || !data.docs || !data.docs.length) return;
        var docs = data.docs, groups = data.groups || [];
        var nameOf = {};
        groups.forEach(function (g) { nameOf[g.key] = g.name; });
        var me = currentFile(), mine = null;
        docs.forEach(function (d) { if (d.file === me) mine = d; });

        var bar = doc.querySelector('.back');
        var prefix = bar ? '' : 'docs/'; /* 主页位于仓库根，文档在 docs/ 下 */
        if (bar && mine && !bar.querySelector('.bl-crumb')) {
            var crumb = el('span', null, 'bl-crumb');
            crumb.textContent = '/ ' + (nameOf[mine.group] || '文档') + ' / ' + mine.title;
            bar.appendChild(crumb);
        }

        var btn = el('button', 'bl-docs');
        btn.type = 'button';
        btn.setAttribute('aria-haspopup', 'dialog');
        btn.setAttribute('aria-label', '打开文档快速切换');
        btn.title = '文档快速切换（按 / 键）';
        btn.textContent = '📚';
        var navList = doc.querySelector('.nav-links');
        if (bar) {
            bar.appendChild(el('span', null, 'bl-bar-spacer'));
            bar.appendChild(btn);
        } else if (navList) {
            /* 主页：作为导航项，避免右下角悬浮按钮堆叠 */
            btn.classList.add('nav-link-btn');
            btn.textContent = '📚 快速跳转';
            var li = el('li', null, 'nav-docs-item');
            li.appendChild(btn);
            var cta = navList.querySelector('.nav-cta');
            if (cta && cta.parentElement) navList.insertBefore(li, cta.parentElement);
            else navList.appendChild(li);
        } else {
            doc.body.appendChild(btn);
        }

        var panel = el('div', 'bl-docs-panel');
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', '文档快速切换');
        var wrapper = el('div', null, 'bl-docs-box');
        var head = el('div', null, 'bl-docs-head');
        var input = doc.createElement('input');
        input.type = 'search';
        input.className = 'bl-docs-input';
        input.placeholder = '筛选文档（标题 / 关键词 / 编号）…';
        input.setAttribute('aria-label', '筛选文档');
        var close = el('button', null, 'bl-docs-close');
        close.type = 'button';
        close.textContent = '✕';
        close.setAttribute('aria-label', '关闭');
        head.appendChild(input);
        head.appendChild(close);
        var list = el('div', null, 'bl-docs-list');
        wrapper.appendChild(head);
        wrapper.appendChild(list);
        panel.appendChild(wrapper);
        doc.body.appendChild(panel);

        function render(q) {
            q = (q || '').trim().toLowerCase();
            var html = [];
            groups.forEach(function (g) {
                var items = docs.filter(function (d) { return d.group === g.key; });
                if (q) {
                    items = items.filter(function (d) {
                        return (d.num + ' ' + d.title + ' ' + d.desc + ' ' + (d.tags || []).join(' ')).toLowerCase().indexOf(q) > -1;
                    });
                }
                if (!items.length) return;
                html.push('<div class="bl-docs-group">' + g.name + ' · ' + items.length + '</div>');
                items.forEach(function (d) {
                    html.push('<a class="bl-docs-item' + (d.file === me ? ' is-current' : '') + '" href="' + prefix + d.file + '">' +
                        '<span class="n">' + d.num + '</span>' +
                        '<span class="t">' + d.title + '</span>' +
                        '<span class="d">' + d.desc + '</span></a>');
                });
            });
            list.innerHTML = html.join('') || '<div class="bl-docs-empty">没有匹配的文档</div>';
        }
        render('');

        var open = false;
        function show() {
            if (open) return;
            open = true;
            panel.classList.add('show');
            render('');
            input.value = '';
            setTimeout(function () { input.focus(); }, 30);
        }
        function hide() {
            if (!open) return;
            open = false;
            panel.classList.remove('show');
            try { btn.focus(); } catch (e) { /* 忽略 */ }
        }
        btn.addEventListener('click', function () { if (open) hide(); else show(); });
        close.addEventListener('click', hide);
        panel.addEventListener('click', function (e) { if (e.target === panel) hide(); });
        input.addEventListener('input', function () { render(input.value); });
        doc.addEventListener('keydown', function (e) {
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '');
            if (e.key === 'Escape' && open) hide();
            if (e.key === '/' && !open && !typing) { e.preventDefault(); show(); }
        });
    }
    function initSwitcher() {
        if (window.DOCS_DATA) { buildSwitcher(window.DOCS_DATA); return; }
        var url = registryUrl();
        if (!url) return;
        var s = doc.createElement('script');
        s.src = url;
        s.async = true;
        s.onload = function () { buildSwitcher(window.DOCS_DATA); };
        doc.head.appendChild(s);
    }

    /* ---------- 挂载 ---------- */
    function mount() {
        updateThemeBtn();
        applyTheme(currentTheme());
        doc.body.appendChild(bar);
        addSkipLink();
        doc.body.appendChild(themeBtn);
        doc.body.appendChild(topBtn);
        var toc = buildToc();
        if (toc) doc.body.appendChild(toc);
        wrapTables();
        try { addCopyButtons(); } catch (e) { /* 复制按钮失败不影响阅读 */ }
        animateStats();
        try { initSwitcher(); } catch (e) { /* 切换器失败不影响阅读 */ }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        onScroll();
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
