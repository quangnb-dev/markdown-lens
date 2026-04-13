# Markdown Lens

A VS Code extension that provides a custom editor for `.md` files with a **preview/edit toggle** — similar to how VS Code handles SVG files.

## Features

- **Preview mode** — Rendered Markdown with clean, VS Code theme-aware styling
- **Edit mode** — Raw Markdown text editor with monospace font
- **Toggle** — Switch between Preview and Edit with one click
- **Live sync** — External file changes auto-update the preview
- **Multi-panel** — Same file open in multiple tabs stays in sync
- **Theme-aware** — Adapts to your VS Code light/dark theme
- **Syntax highlighting** — Code blocks with language-aware colors
- **Copy button** — One-click copy on every code block

## Usage

1. Open any `.md` file in VS Code
2. Right-click the tab → **"Reopen Editor With..."** → **"Markdown Lens"**
3. Click **Edit** to switch to raw Markdown editing
4. Click **Preview** to switch back to rendered view

## Tech Stack

- TypeScript
- [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown rendering
- [highlight.js](https://highlightjs.org) for syntax highlighting
- VS Code Custom Editor API (`CustomTextEditorProvider`)

## License

MIT
