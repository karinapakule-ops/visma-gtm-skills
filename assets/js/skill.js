/* Detail page: look the skill up in the embedded library (window.SKILLS), render
   it, and wire up copy / downloads. No network fetch — works under Jekyll and file://. */
(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const root = document.getElementById('detail');

  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
    root.innerHTML = '<a class="backlink" href="index.html">&larr; All skills</a><p>Skill not found.</p>';
    return;
  }

  const data = Array.isArray(window.SKILLS) ? window.SKILLS.find(s => s.slug === slug) : null;
  if (!data) {
    root.innerHTML = '<a class="backlink" href="index.html">&larr; All skills</a><p>This skill could not be found. It may have been renamed. <a href="index.html">Back to the library</a>.</p>';
    return;
  }

  const body = data.body || '';
  document.title = (data.title || 'Skill') + ' · Visma GTM Skill Library';

  const meta = [];
  if (data.owner) meta.push(`<span><b>Owner:</b> ${data.owner}</span>`);
  if (data.updated) meta.push(`<span><b>Updated:</b> ${data.updated}</span>`);
  if (data.connectors) meta.push(`<span><b>Connectors:</b> ${data.connectors}</span>`);
  if (data.trigger) meta.push(`<span><b>When to use:</b> ${data.trigger}</span>`);

  // Installable package button, shown only when a .skill file is declared for this skill.
  const pkgBtn = data.package
    ? `<a class="btn btn-primary" href="${data.package}" download>Download .skill (install)</a>`
    : '';
  const hint = data.package
    ? 'Download the <b>.skill</b> package to install it in Claude / Cowork, or copy the text to paste into any AI agent.'
    : 'Copy the skill to paste into your AI agent (Claude, Copilot, ...) or download the Markdown to reuse it.';

  root.innerHTML = `
    <a class="backlink" href="index.html">&larr; All skills</a>
    ${data.category ? `<div><span class="pill">${data.category}</span></div>` : ''}
    <h1>${data.title || slug}</h1>
    ${data.summary ? `<p class="summary">${data.summary}</p>` : ''}
    <div class="meta-row">${meta.join('')}</div>
    <div class="action-bar">
      ${pkgBtn}
      <button class="btn ${data.package ? 'btn-outline' : 'btn-primary'}" id="copyBtn">Copy text</button>
      <button class="btn btn-outline" id="downloadBtn">Download .md</button>
      <div class="hint">${hint}</div>
    </div>
    <div class="md">${renderMarkdown(body)}</div>
  `;

  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(body);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = body; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    copyBtn.textContent = 'Copied ✓';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy text'; copyBtn.classList.remove('copied'); }, 2000);
  });

  // Build the .md download in-memory (no server file needed).
  document.getElementById('downloadBtn').addEventListener('click', () => {
    const blob = new Blob([body], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${slug}.md`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
