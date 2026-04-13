# Preview Style Test

## Headings

# H1 - Tiêu đề lớn nhất
## H2 - Tiêu đề cấp 2
### H3 - Tiêu đề cấp 3
#### H4 - Tiêu đề cấp 4
##### H5 - Tiêu đề cấp 5
###### H6 - Tiêu đề cấp 6 (mờ nhất)

---

## Code Blocks (với nút Copy)

### JavaScript
```javascript
function addCopyButtons() {
  /* Đây là chú thích và sẽ không được hiển thị */
  document.querySelectorAll('pre').forEach(pre => {
    const codeEl = pre.querySelector('code');
    if (!codeEl) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(codeEl.textContent);
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    });
  });
}
```

### HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example</title>
</head>
<body>
  <!-- Main content -->
  <div id="app">
    <h1>Hello World</h1>
    <!-- TODO: add nav here -->
  </div>
</body>
</html>
```

### TypeScript
```typescript
interface Message {
  type: 'edit' | 'ready' | 'updateContent';
  text?: string;
}

async function resolveCustomTextEditor(
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
): Promise<void> {
  panel.webview.html = getHtmlForWebview(panel.webview);
}
```

### Python
```python
def fibonacci(n: int) -> list[int]:
    result = [0, 1]
    while len(result) < n:
        result.append(result[-1] + result[-2])
    return result[:n]

print(fibonacci(10))
```

### Bash
```bash
npm run compile
npx @vscode/vsce package --allow-missing-repository
code --install-extension markdown-lens-0.0.3.vsix
```

### JSON
```json
{
  "name": "markdown-lens",
  "version": "0.0.3",
  "engines": {
    "vscode": "^1.110.0"
  }
}
```

### Code block không có ngôn ngữ
```
Đây là plain text code block
Không có ngôn ngữ được chỉ định
```

---

## Inline Code

Dùng `const` thay vì `var` để khai báo biến. Hàm `addCopyButtons()` được gọi sau mỗi lần `render()`. Biến `currentText` lưu nội dung hiện tại.

So sánh: text thường vs `inline code` vs **bold** vs *italic*.

---

## Blockquotes

> Đây là một blockquote đơn giản. Nó sẽ có border trái dày hơn và text nghiêng.

> **Lưu ý quan trọng:** Blockquote bây giờ có style nổi bật hơn với border 5px,
> background tint đậm hơn, và toàn bộ text được in nghiêng để phân biệt
> với nội dung bình thường.

> Nested blockquote:
> > Blockquote lồng nhau cũng được hỗ trợ.
> > Có thể dùng để trích dẫn nhiều cấp.

---

## Lists

### Unordered
- Item một
- Item hai
  - Sub-item A
  - Sub-item B
    - Sub-sub-item
- Item ba

### Ordered
1. Bước đầu tiên: cài đặt extension
2. Bước hai: mở file `.md`
3. Bước ba: click **Preview** để xem kết quả
4. Bước bốn: click **Edit** để chỉnh sửa

### Task list
- [x] CSS code block header
- [x] Nút Copy với feedback "Copied!"
- [x] Blockquote italic + border 5px
- [x] Inline code border
- [ ] Syntax highlighting (chưa làm)

---

## Tables

| Thành phần | Trước | Sau |
|---|---|---|
| Code block | Không có header | Có header + nút Copy |
| Blockquote | Border 4px | Border 5px + italic |
| Inline code | Chỉ background | Background + border |
| Code block border | Không có | Accent border trái 3px |

---

## Links & Images

- [GitHub repo](https://github.com)
- [VS Code Extension API](https://code.visualstudio.com/api)

---

## Mixed Content

Đây là một đoạn văn bình thường với `inline code` xen kẽ. Khi bạn dùng
markdown-it để render, các đoạn như `function render(text)` hay `md.render()`
sẽ được highlight khác với text xung quanh.

> **Tip:** Nhấn nút **Copy** ở góc phải của mỗi code block để copy toàn bộ nội dung.
> Nút sẽ đổi thành "Copied!" trong 2 giây rồi tự reset.

```css
/* Copy button styles */
.copy-btn {
  font-size: 11px;
  padding: 2px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.copy-btn:hover {
  background-color: var(--vscode-button-hoverBackground);
}
```

---

## Keyboard shortcuts

Nhấn <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> để mở Command Palette.

Nhấn <kbd>Ctrl</kbd>+<kbd>`</kbd> để mở Terminal.

---

*End of test file.*
