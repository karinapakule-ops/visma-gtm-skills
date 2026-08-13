/* Minimal, dependency-free Markdown -> HTML renderer.
   Supports: headings, bold, italic, inline code, fenced code blocks,
   unordered/ordered lists, links, blockquotes, horizontal rules, paragraphs.
   Kept intentionally small — skill files use a controlled subset of Markdown. */

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Inline formatting applied to already-escaped text (never inside code blocks).
function inline(text) {
  return text
    // inline code first, so its contents aren't further formatted
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    // links [text](url)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // italic (single * not part of **)
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

function renderMarkdown(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      out.push('<p>' + inline(escapeHtml(para.join(' '))) + '</p>');
      para = [];
    }
  };

  while (i < lines.length) {
    let line = lines[i];

    // Fenced code block
    const fence = line.match(/^```(.*)$/);
    if (fence) {
      flushPara();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // skip closing fence
      out.push('<pre><code>' + escapeHtml(buf.join('\n')) + '</code></pre>');
      continue;
    }

    // Horizontal rule
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) { flushPara(); out.push('<hr>'); i++; continue; }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      const level = h[1].length;
      out.push(`<h${level}>${inline(escapeHtml(h[2].trim()))}</h${level}>`);
      i++; continue;
    }

    // Table (GitHub-style pipe table): a header row followed by a |---|---| separator
    if (line.includes('|') && i + 1 < lines.length &&
        /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      flushPara();
      const splitRow = (row) => {
        let s = row.trim();
        if (s.startsWith('|')) s = s.slice(1);
        if (s.endsWith('|')) s = s.slice(0, -1);
        return s.split('|').map(c => c.trim());
      };
      const headers = splitRow(line);
      i += 2; // skip the header and the separator line
      const bodyRows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }
      let html = '<div class="table-wrap"><table><thead><tr>' +
        headers.map(h => `<th>${inline(escapeHtml(h))}</th>`).join('') +
        '</tr></thead><tbody>';
      for (const r of bodyRows) {
        html += '<tr>' + headers.map((_, ci) => `<td>${inline(escapeHtml(r[ci] || ''))}</td>`).join('') + '</tr>';
      }
      html += '</tbody></table></div>';
      out.push(html);
      continue;
    }

    // Blockquote (consecutive)
    if (/^>\s?/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push('<blockquote>' + inline(escapeHtml(buf.join(' '))) + '</blockquote>');
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        buf.push('<li>' + inline(escapeHtml(lines[i].replace(/^\s*[-*+]\s+/, ''))) + '</li>');
        i++;
      }
      out.push('<ul>' + buf.join('') + '</ul>');
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push('<li>' + inline(escapeHtml(lines[i].replace(/^\s*\d+\.\s+/, ''))) + '</li>');
        i++;
      }
      out.push('<ol>' + buf.join('') + '</ol>');
      continue;
    }

    // Blank line -> paragraph break
    if (/^\s*$/.test(line)) { flushPara(); i++; continue; }

    // Otherwise, accumulate into current paragraph
    para.push(line.trim());
    i++;
  }
  flushPara();
  return out.join('\n');
}

/* Split raw skill file into { data: {frontmatter}, body: "markdown" }.
   Front matter is a simple `key: value` block between --- fences. */
function parseFrontMatter(raw) {
  raw = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  m[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  });
  return { data, body: m[2].trim() };
}

// Expose for browser (script tags, no modules) and Node (build script).
if (typeof window !== 'undefined') {
  window.renderMarkdown = renderMarkdown;
  window.parseFrontMatter = parseFrontMatter;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderMarkdown, parseFrontMatter, escapeHtml };
}
