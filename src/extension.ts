import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './MarkdownEditorProvider';

export function activate(context: vscode.ExtensionContext): void {
  const registration = vscode.window.registerCustomEditorProvider(
    'markdownLens.editor',
    new MarkdownEditorProvider(context),
    {
      webviewOptions: {
        retainContextWhenHidden: false,
      },
    }
  );

  context.subscriptions.push(registration);
}

export function deactivate(): void {
  // Nothing to clean up; subscriptions are managed by context.subscriptions
}
