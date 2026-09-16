#!/usr/bin/env node
/* 生成 SEO 资产（幂等，可复跑）：
 *   1. sitemap.xml（index + 全部文档，含 lastmod）
 *   2. robots.txt（允许抓取 + 指向 sitemap）
 *   3. 每页注入 JSON-LD（Article + isPartOf WebSite，中文站点）
 * 用法: node scripts/gen-seo.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://gxsri.github.io/badminton-knowledge-base/';

function lastCommitDate(rel) {
    try {
        const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', rel], { cwd: ROOT, encoding: 'utf8' }).trim();
        return out || new Date().toISOString().slice(0, 10);
    } catch (e) { return new Date().toISOString().slice(0, 10); }
}

/* 登记表 */
const data = readFileSync(resolve(ROOT, 'docs-data.js'), 'utf8');
const docs = [...data.matchAll(/num:\s*'([^']+)',\s*file:\s*'([^']+)',\s*group:\s*'([^']+)',\s*title:\s*'([^']*)',\s*desc:\s*'([^']*)'/g)]
    .map(m => ({ num: m[1], file: m[2], title: m[4], desc: m[5] }));

/* 1) sitemap */
const urls = [
    `  <url><loc>${SITE}</loc><lastmod>${lastCommitDate('index.html')}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ...docs.map(d => `  <url><loc>${SITE}docs/${d.file}</loc><lastmod>${lastCommitDate('docs/' + d.file)}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
];
writeFileSync(resolve(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log('sitemap.xml:', urls.length, '条 URL');

/* 2) robots */
writeFileSync(resolve(ROOT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log('robots.txt 已生成');

/* 3) JSON-LD */
let n = 0;
for (const d of docs) {
    const path = resolve(ROOT, 'docs', d.file);
    let t = readFileSync(path, 'utf8');
    const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: d.title,
        description: d.desc,
        inLanguage: 'zh-CN',
        url: SITE + 'docs/' + d.file,
        isPartOf: { '@type': 'WebSite', name: '羽毛球职业训练系统', url: SITE }
    };
    const block = `    <!-- seo:jsonld -->\n    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n`;
    const existing = /[ \t]*<!-- seo:jsonld -->\n[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n/;
    let out;
    if (existing.test(t)) {
        if (t.match(existing)[0] === block) continue;
        out = t.replace(existing, block);
    } else {
        const i = t.lastIndexOf('</head>');
        if (i < 0) continue;
        out = t.slice(0, i) + block + t.slice(i);
    }
    writeFileSync(path, out);
    n++;
}
console.log('JSON-LD 注入:', n, '页');
