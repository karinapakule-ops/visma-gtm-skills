/* Scans skills/*.md, reads each file's front matter, and writes skills.json —
   the index the website loads. Run locally with:  node scripts/build-index.mjs
   (A GitHub Action also runs this automatically whenever a skill is added.) */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');

function parseFrontMatter(raw) {
  raw = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return { data, body: m[2].trim() };
}

const files = readdirSync(skillsDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
const index = [];

for (const file of files) {
  const raw = readFileSync(join(skillsDir, file), 'utf8');
  const { data } = parseFrontMatter(raw);
  const slug = basename(file, '.md');
  if (!data.title) {
    console.warn(`⚠  ${file} has no "title" in its front matter — skipping.`);
    continue;
  }
  index.push({
    slug,
    title: data.title,
    category: data.category || 'Uncategorised',
    summary: data.summary || '',
    trigger: data.trigger || '',
    inputs: data.inputs || '',
    owner: data.owner || 'Visma GTM',
    updated: data.updated || '',
    tags: (data.tags || '').split(',').map(t => t.trim()).filter(Boolean),
  });
}

index.sort((a, b) => a.title.localeCompare(b.title));
writeFileSync(join(root, 'skills.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`✓ Wrote skills.json with ${index.length} skill(s).`);
