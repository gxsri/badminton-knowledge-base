#!/usr/bin/env node
/* 给 <img> 补真实的 width/height（读 GIF/PNG 文件头拿尺寸），消除布局抖动（CLS）。
 * 幂等。用法: node scripts/gen-img-dims.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

/* 读位图尺寸：GIF / PNG / JPEG 都只读文件头，不依赖任何库 */
function sizeOf(abs) {
    const b = readFileSync(abs);
    if (b.slice(0, 3).toString('latin1') === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
    if (b[0] === 0x89 && b.slice(1, 4).toString('latin1') === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b[0] === 0xff && b[1] === 0xd8) {
        let i = 2;
        while (i < b.length - 9) {
            if (b[i] !== 0xff) { i++; continue; }
            const marker = b[i + 1], len = b.readUInt16BE(i + 2);
            if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
            }
            i += 2 + len;
        }
    }
    return null;
}

const files = ['index.html', ...readdirSync(resolve(ROOT, 'docs')).filter(f => f.endsWith('.html')).map(f => 'docs/' + f)];
let touched = 0, fixed = 0;

for (const rel of files) {
    const path = resolve(ROOT, rel);
    const src = readFileSync(path, 'utf8');
    const base = rel.includes('/') ? resolve(ROOT, 'docs') : ROOT;
    const cache = new Map();
    const out = src.replace(/<img\b[^>]*>/g, (tag) => {
        if (/\bwidth=/.test(tag) && /\bheight=/.test(tag)) return tag;
        const srcAttr = (tag.match(/src="([^"]+)"/) || [])[1];
        if (!srcAttr || /^(https?:|data:)/.test(srcAttr)) return tag;
        const abs = resolve(base, decodeURIComponent(srcAttr));
        if (!existsSync(abs)) return tag;
        if (!cache.has(abs)) cache.set(abs, sizeOf(abs));
        const dim = cache.get(abs);
        if (!dim) return tag;
        fixed++;
        /* 已有其中一个就补另一个，都没有就都补上；插在 src 之后，保持属性顺序可读 */
        let next = tag;
        if (!/\bwidth=/.test(next)) next = next.replace(/(\ssrc="[^"]+")/, `$1 width="${dim[0]}"`);
        if (!/\bheight=/.test(next)) next = next.replace(/(\swidth="\d+")/, `$1 height="${dim[1]}"`);
        return next;
    });
    if (out !== src) {
        touched++;
        if (!DRY) writeFileSync(path, out, 'utf8');
    }
}

console.log(`${DRY ? '（试运行）' : ''}扫描 ${files.length} 页 · 改动 ${touched} 页 · 补尺寸 ${fixed} 个 <img>`);
