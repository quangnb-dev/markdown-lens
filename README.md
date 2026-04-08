# Markdown Lens

A VS Code extension that provides a custom editor for `.md` files with a **preview/edit toggle** — similar to how VS Code handles SVG files.

## Features

- **Preview mode** — Rendered Markdown with clean, VS Code theme-aware styling
- **Edit mode** — Raw Markdown text editor with monospace font
- **Toggle** — Switch between Preview and Edit with one click
- **Live sync** — External file changes auto-update the preview
- **Multi-panel** — Same file open in multiple tabs stays in sync
- **Theme-aware** — Adapts to your VS Code light/dark theme

## Install

### From GitHub Release

1. Download `markdown-lens-x.x.x.vsix` from [Releases](https://github.com/quangnb-dev/markdown-lens/releases)
2. Run:
```bash
code --install-extension markdown-lens-x.x.x.vsix
```

### From Source

```bash
git clone https://github.com/quangnb-dev/markdown-lens.git
cd markdown-lens
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
code --install-extension markdown-lens-0.0.1.vsix
```

## Usage

1. Open any `.md` file in VS Code
2. Right-click the tab → **"Reopen Editor With..."** → **"Markdown Lens"**
3. Click **Edit** to switch to raw Markdown editing
4. Click **Preview** to switch back to rendered view

## Tech Stack

- TypeScript
- [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown rendering
- VS Code Custom Editor API (`CustomTextEditorProvider`)

## License

MIT
