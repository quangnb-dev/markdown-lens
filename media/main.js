// @ts-check
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
      } else {
        textarea.value = currentText;
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
}());
