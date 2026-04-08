import * as vscode from 'vscode';
import * as crypto from 'crypto';
import * as path from 'path';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
  // D5: per-document panel registry for fan-out updates
  private readonly panelRegistry: Map<string, Set<vscode.WebviewPanel>> = new Map();

  constructor(private readonly context: vscode.ExtensionContext) {
    // Single global subscription for document changes — fans out to all registered panels.
    // Registered once here instead of per-panel to avoid duplicate listener accumulation.
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        const uri = e.document.uri.toString();
        const panels = this.panelRegistry.get(uri);
        if (!panels || panels.size === 0) {
          return;
        }
        for (const panel of panels) {
          panel.webview.postMessage({
            type: 'updateContent',
            text: e.document.getText(),
          });
        }
      })
    );
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    const uri = document.uri.toString();

    // Configure webview options
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
      ],
    };

    // Register panel in registry (D5)
    if (!this.panelRegistry.has(uri)) {
      this.panelRegistry.set(uri, new Set());
    }
    this.panelRegistry.get(uri)!.add(webviewPanel);

    // Set initial webview HTML
    const mediaPath = vscode.Uri.file(
      path.join(this.context.extensionPath, 'media')
    );
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, mediaPath);

    // Handle messages from the webview (edit-sync)
    const messageSubscription = webviewPanel.webview.onDidReceiveMessage(
      async (message: { type: string; text: string }) => {
        if (message.type === 'ready') {
          webviewPanel.webview.postMessage({
            type: 'updateContent',
            text: document.getText(),
          });
          return;
        }
        if (message.type !== 'edit') {
          return;
        }
        // Apply the edit to the VS Code document
        const edit = new vscode.WorkspaceEdit();
        const fullRange = document.validateRange(
          new vscode.Range(0, 0, document.lineCount, 0)
        );
        edit.replace(document.uri, fullRange, message.text);
        await vscode.workspace.applyEdit(edit);
      }
    );

    // Clean up when the panel is closed
    webviewPanel.onDidDispose(() => {
      const panels = this.panelRegistry.get(uri);
      if (panels) {
        panels.delete(webviewPanel);
        if (panels.size === 0) {
          this.panelRegistry.delete(uri);
        }
      }
      messageSubscription.dispose();
    });
  }

  private getHtmlForWebview(
    webview: vscode.Webview,
    mediaPath: vscode.Uri
  ): string {
    // Generate a cryptographically random nonce for CSP
    const nonce = crypto.randomBytes(16).toString('base64');

    const markdownItUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaPath, 'markdown-it.min.js')
    );
    const mainJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaPath, 'main.js')
    );
    const styleCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaPath, 'style.css')
    );

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
  <link rel="stylesheet" nonce="${nonce}" href="${styleCssUri}">
  <title>Markdown Lens</title>
</head>
<body>
  <div id="toolbar">
    <span class="toolbar-label">Markdown Lens</span>
    <button id="toggle">Edit</button>
  </div>
  <div id="preview"></div>
  <textarea id="editor" style="display:none"></textarea>

  <script nonce="${nonce}" src="${markdownItUri}"></script>
  <script nonce="${nonce}" src="${mainJsUri}"></script>
</body>
</html>`;
  }
}
