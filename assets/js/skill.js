/* Detail page: fetch a single skill markdown file, render it, wire up copy/download. */
(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const root = document.getElementById('detail');

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    root.innerHTML = '<p>Skill not found. <a href="index.html">Back to the library</a>.</p>';
    return;
  }

  const file = `skills/${slug}.md`;

  fetch(file)
    .then(r => { if (!r.ok) throw new Error('not found'); return r.text(); })
    .then(raw => {
      const { data, body } = parseFrontMatter(raw);
      document.title = (data.title || 'Skill') + ' · Visma GTM Skill Library';

      const meta = [];
      if (data.owner) meta.push(`<span><b>Owner:</b> ${data.owner}</span>`);
      if (data.updated) meta.push(`<span><b>Updated:</b> ${data.updated}</span>`);
      if (data.trigger) meta.push(`<span><b>When to use:</b> ${data.trigger}</span>`);

      root.innerHTML = `
        <a class="backlink" href="index.html">&larr; All skills</a>
        ${data.category ? `<div><span class="pill">${data.category}</span></div>` : ''}
        <h1>${data.title || slug}</h1>
        ${data.summary ? `<p class="summary">${data.summary}</p>` : ''}
        <div class="meta-row">${meta.join('')}</div>
        <div class="action-bar">
          <button class="btn btn-primary" id="copyBtn">Copy skill</button>
          <a class="btn btn-outline" id="downloadBtn" href="${file}" download="${slug}.md">Download .md</a>
          <div class="hint">Paste the copied skill into your AI agent (Claude, Copilot, ...) or download the file to reuse it.</div>
        </div>
        <div class="md">${renderMarkdown(body)}</div>
      `;

      const copyBtn = document.getElementById('copyBtn');
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(body);
        } catch (e) {
          // Fallback for older browsers / non-secure contexts
          const ta = document.createElement('textarea');
          ta.value = body; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); ta.remove();
        }
        copyBtn.textContent = 'Copied ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = 'Copy skill'; copyBtn.classList.remove('copied'); }, 2000);
      });
    })
    .catch(() => {
      root.innerHTML = '<a class="backlink" href="index.html">&larr; All skills</a><p>This skill could not be loaded. It may have been moved or renamed.</p>';
    });
})();
