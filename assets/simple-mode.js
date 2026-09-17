/* ============================================================
 * simple-mode.js — 「傻瓜化模式」行为层
 * 两种模式：
 *   pro（默认）= 现有专业内容
 *   simple     = 每页插入「30 秒看懂」白话摘要 + 术语白话气泡 + 放宽排版
 * 数据来源：docs-simple.js（window.SIMPLE_MODE）
 * 记忆：localStorage['bl-mode']；也支持 ?mode=simple 直接进入
 * ============================================================ */
(function () {
    'use strict';
    if (window.__blSimple) return;
    window.__blSimple = true;

    var doc = document;
    var root = doc.documentElement;
    var DATA = window.SIMPLE_MODE || null;

    function currentFile() {
        var parts = location.pathname.split('/');
        var last = parts[parts.length - 1];
        return (!last || last === '') ? 'index.html' : last;
    }
    function isHome() { return currentFile() === 'index.html'; }
    function stored() {
        try { return localStorage.getItem('bl-mode'); } catch (e) { return null; }
    }
    function urlMode() {
        var m = location.search.match(/[?&]mode=(simple|pro)\b/);
        return m ? m[1] : null;
    }
    function setStored(mode) { try { localStorage.setItem('bl-mode', mode); } catch (e) { /* 忽略 */ } }
    function mode() { return root.getAttribute('data-mode') === 'simple' ? 'simple' : 'pro'; }

    /* URL 参数优先：?mode=simple 进入并记住 */
    var fromUrl = urlMode();
    if (fromUrl) setStored(fromUrl);

    /* ---------- 模式切换按钮 ---------- */
    function buildSwitch() {
        if (doc.getElementById('bl-mode')) return;
        var wrap = doc.createElement('span');
        wrap.className = 'bl-mode';
        wrap.id = 'bl-mode';
        wrap.setAttribute('role', 'group');
        wrap.setAttribute('aria-label', '阅读模式切换');

        [['simple', '🙂 小白模式'], ['pro', '🎓 专业模式']].forEach(function (pair) {
            var b = doc.createElement('button');
            b.type = 'button';
            b.textContent = pair[1];
            b.setAttribute('data-mode-set', pair[0]);
            b.title = pair[0] === 'simple' ? '用大白话看：每页只讲怎么做' : '看完整原理、参数与细节';
            if (mode() === pair[0]) b.className = 'active';
            b.addEventListener('click', function () {
                if (mode() === pair[0]) return;
                setStored(pair[0]);
                /* 重新加载以应用/移除摘要卡与术语气泡，行为可预测 */
                var url = location.pathname + location.search.replace(/[?&]mode=(simple|pro)\b/g, '');
                location.replace(url || location.pathname);
            });
            wrap.appendChild(b);
        });

        var bar = doc.querySelector('.back');
        if (bar) {
            var docsBtn = bar.querySelector('#bl-docs');   /* 📚 在右，模式切换放它左边 */
            if (docsBtn) bar.insertBefore(wrap, docsBtn);
            else bar.appendChild(wrap);
        } else {
            var navList = doc.querySelector('.nav-links');
            var li = doc.createElement('li');
            li.id = 'bl-mode-item';
            li.appendChild(wrap);
            if (navList) {
                var cta = navList.querySelector('.nav-cta');
                if (cta && cta.parentElement) navList.insertBefore(li, cta.parentElement);
                else navList.appendChild(li);
            }
        }
    }

    /* ---------- 「30 秒看懂」摘要卡 ---------- */
    function pageEntry() {
        if (!DATA || !DATA.pages) return null;
        return DATA.pages[currentFile()] || null;
    }
    function termPlain(key) {
        var t = DATA && DATA.terms && DATA.terms[key];
        return t ? t.plain : '';
    }
    function summaryCard(entry) {
        var card = doc.createElement('section');
        card.className = 'simple-card';
        card.id = 'simple-card';
        card.setAttribute('aria-label', '小白模式摘要');

        var head = doc.createElement('div');
        head.className = 'simple-card-head';
        head.innerHTML = '<strong>🙂 30 秒看懂</strong>' +
            '<span class="simple-level">' + (entry.lv === 'a' ? '本页偏专业，已为你提炼要点' : '零基础可读') + '</span>';
        card.appendChild(head);

        var tldr = doc.createElement('p');
        tldr.className = 'simple-tldr';
        tldr.textContent = entry.t;
        card.appendChild(tldr);

        if (entry.s && entry.s.length) {
            var blk = doc.createElement('div');
            blk.className = 'simple-block';
            blk.innerHTML = '<h4>怎么做（三步）</h4><ol class="simple-steps">' +
                entry.s.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
            card.appendChild(blk);
        }
        if (entry.m && entry.m.length) {
            var blk2 = doc.createElement('div');
            blk2.className = 'simple-block';
            blk2.innerHTML = '<h4>常见坑</h4><ul class="simple-tips">' +
                entry.m.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
            card.appendChild(blk2);
        }
        var terms = (entry.tm || []).map(function (k) {
            var plain = termPlain(k);
            return plain ? '<div><dt>' + k + '</dt><dd>' + plain + '</dd></div>' : '';
        }).join('');
        if (terms) {
            var blk3 = doc.createElement('div');
            blk3.className = 'simple-block';
            blk3.innerHTML = '<h4>这些词是什么意思</h4><dl class="simple-terms">' + terms + '</dl>';
            card.appendChild(blk3);
        }
        var foot = doc.createElement('div');
        foot.className = 'simple-foot';
        foot.innerHTML = '<span>想要原理、公式和完整参数？</span>' +
            '<a href="#" data-mode-set="pro">切到专业模式 →</a>' +
            '<a href="40-search.html">按关键词搜索</a>';
        card.appendChild(foot);
        var back = foot.querySelector('[data-mode-set="pro"]');
        if (back) back.addEventListener('click', function (e) {
            e.preventDefault();
            setStored('pro');
            var url = location.pathname + location.search.replace(/[?&]mode=(simple|pro)\b/g, '');
            location.replace(url || location.pathname);
        });
        return card;
    }
    function insertSummary() {
        var entry = pageEntry();
        if (!entry || doc.getElementById('simple-card')) return;
        var card = summaryCard(entry);
        var anchor = doc.querySelector('.meta') || doc.querySelector('h1');
        if (!anchor || !anchor.parentNode) return;
        anchor.parentNode.insertBefore(card, anchor.nextSibling);
    }

    /* ---------- 分层处方导航：小白只被指向「基础版」，不要求读三档 ---------- */
    function addTierGuide() {
        var grid = doc.querySelector('.rx-grid');
        if (!grid || doc.getElementById('simple-tier-guide')) return;
        var base = doc.querySelector('.rx-base');
        var box = doc.createElement('div');
        box.className = 'simple-tier-guide';
        box.id = 'simple-tier-guide';
        box.innerHTML = '<strong>你现在只需要看这一档 👉</strong>' +
            '<span>下面这份处方分了三档（基础 / 进阶 / 精英）。刚开始打球、每周打 2-3 次的话，' +
            '<a href="' + (base && base.id ? '#' + base.id : '#rx') + '">直接照「基础版」那张卡做</a>' +
            '，其余两档等你练到「不觉得吃力」再看。</span>';
        grid.parentNode.insertBefore(box, grid);
    }

    /* ---------- 正文术语白话气泡（限制数量，避免噪音） ---------- */
    var MAX_TIPS = 10;
    function addTermTips() {
        if (!DATA || !DATA.terms) return;
        var scope = doc.querySelector('.content') || doc.querySelector('.section');
        if (!scope) return;
        var terms = Object.keys(DATA.terms)
            .filter(function (k) { return DATA.terms[k].wrap; })
            .sort(function (a, b) { return b.length - a.length; });
        var used = 0;
        var skip = /^(SCRIPT|STYLE|CODE|PRE|A|BUTTON|H1|H2|H3|H4|TEXTAREA|INPUT|SELECT|SUMMARY)$/;
        var walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
        var nodes = [];
        while (walker.nextNode()) {
            var n = walker.currentNode;
            var p = n.parentNode;
            if (!p || skip.test(p.nodeName)) continue;
            if (p.closest && p.closest('.simple-card, .bl-term, .code-block, .bl-toc, .demo-card')) continue;
            nodes.push(n);
        }
        for (var i = 0; i < nodes.length && used < MAX_TIPS; i++) {
            var node = nodes[i];
            var text = node.nodeValue;
            for (var j = 0; j < terms.length && used < MAX_TIPS; j++) {
                var key = terms[j];
                var idx = text.indexOf(key);
                if (idx < 0) continue;
                var span = doc.createElement('span');
                span.className = 'bl-term';
                span.setAttribute('tabindex', '0');
                span.setAttribute('data-tip', DATA.terms[key].plain);
                span.setAttribute('role', 'note');
                span.setAttribute('aria-label', key + '：' + DATA.terms[key].plain);
                span.textContent = key;
                var after = node.splitText(idx);
                after.nodeValue = after.nodeValue.slice(key.length);
                node.parentNode.insertBefore(span, after);
                used++;
                text = after.nodeValue;
                node = after;
                j--;
            }
        }
    }

    /* ---------- 挂载 ---------- */
    function mount() {
        buildSwitch();
        if (isHome()) return;                 /* 主页不插摘要卡（已有新手通道） */
        if (mode() !== 'simple') return;
        insertSummary();
        addTierGuide();
        addTermTips();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
