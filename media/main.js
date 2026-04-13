// @ts-nocheck
// Webview script — runs inside the VS Code webview sandbox (no Node.js)

(function () {
  // 6.1 Acquire VS Code API (can only be called once per webview lifetime)
  const vscode = acquireVsCodeApi();

  // DOM references
  const preview = /** @type {HTMLDivElement} */ (document.getElementById('preview'));
  const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('editor'));
  const toggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById('toggle'));

  // 6.3 Initialise markdown-it with required options
  // markdown-it is loaded via a <script> tag before this file
  // @ts-ignore — markdownit is a global from the UMD build
  const md = markdownit({ html: false, linkify: true, typographer: true });

  // 6.2 Restore mode from persisted state; default to "preview"
  const savedState = vscode.getState();
  let currentMode = (savedState && savedState.mode) ? savedState.mode : 'preview';
  let currentText = '';

  // 6.4 Render Markdown into the preview div
  function render(text) {
    preview.innerHTML = md.render(text);
    // Wrap tables for horizontal scroll
    preview.querySelectorAll('table').forEach(table => {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
    // Syntax highlight all code blocks
    preview.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });
    addCopyButtons();
  }

  // Inject a header bar with language label and copy button into every code block
  function addCopyButtons() {
    preview.querySelectorAll('pre').forEach(pre => {
      // Guard: skip if header already exists (prevent duplicates on re-render)
      if (pre.querySelector('.pre-header')) return;

      const codeEl = pre.querySelector('code');
      if (!codeEl) return;

      // Extract language from class like "language-javascript"
      const rawClass = codeEl.className || '';
      const lang = rawClass.replace('language-', '').trim();

      // Build header
      const header = document.createElement('div');
      header.className = 'pre-header';

      const label = document.createElement('span');
      label.className = 'lang-label';
      label.textContent = lang ? lang.toUpperCase() : '';

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        try {
          navigator.clipboard.writeText(codeEl.textContent).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
          }).catch(() => {
            // Clipboard write rejected silently — no UI change
          });
        } catch (_e) {
          // navigator.clipboard unavailable — do nothing
        }
      });

      header.appendChild(label);
      header.appendChild(btn);
      pre.insertBefore(header, pre.firstChild);
    });
  }

  // 6.5 Switch between preview and edit modes
  function setMode(mode) {
    currentMode = mode;
    if (mode === 'preview') {
      preview.style.display = '';
      textarea.style.display = 'none';
      toggleBtn.textContent = 'Edit';
      render(currentText);
    } else {
      preview.style.display = 'none';
      textarea.style.display = '';
      toggleBtn.textContent = 'Preview';
      textarea.value = currentText;
    }
    // Persist mode across tab switches (spec: state-persistence)
    vscode.setState({ mode });
  }

  // 6.6 Handle messages from the extension host
  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'updateContent') {
      currentText = message.text;
      if (currentMode === 'preview') {
        render(currentText);
      } else if (textarea.value !== currentText) {
        // Only update textarea if content actually differs (external change).
        // Skip echo-back from our own edits to preserve cursor position.
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = currentText;
        textarea.selectionStart = Math.min(start, currentText.length);
        textarea.selectionEnd = Math.min(end, currentText.length);
      }
    }
  });

  // 6.7 Post edit messages to the extension host when the user types
  textarea.addEventListener('input', () => {
    vscode.postMessage({
      type: 'edit',
      text: textarea.value,
    });
  });

  // 6.8 Wire the toggle button to switch modes
  toggleBtn.addEventListener('click', () => {
    setMode(currentMode === 'preview' ? 'edit' : 'preview');
  });

  // Initialise the UI in the restored (or default) mode
  setMode(currentMode);

  // Signal to extension host that webview is ready to receive messages
  vscode.postMessage({ type: 'ready' });
}());
