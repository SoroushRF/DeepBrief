# DeepBrief Chrome Extension

AI-powered jargon explainer for Chrome.

## 📁 Structure

```
extension/
├── manifest.json       # Extension configuration (Manifest V3)
├── background.js       # Service worker for context menu & API calls
├── content.js          # Content script for tooltip display
├── styles.css          # Tooltip styling
├── popup.html          # Extension popup UI
└── icons/              # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder
5. The DeepBrief icon should appear in your extensions toolbar

## 🧪 Testing

1. Navigate to any webpage with technical content
2. Highlight a technical term (e.g., "API", "Docker", "machine learning")
3. Right-click and select "Explain this..."
4. A tooltip should appear with the AI explanation

## 🔧 Configuration

The extension connects to the backend API at:
```
https://deepbrief-api-ble76liyba-uc.a.run.app
```

This URL is configured in `background.js`.

## 📝 Development Status

- ✅ **Task 3.1:** Manifest & Permissions (Complete)
- ⏳ **Task 3.2:** Background Script (Pending)
- ⏳ **Task 3.3:** Content Script & UI (Pending)

## 🎨 Features

- Context menu integration
- Shadow DOM for isolated styling
- Smooth animations
- Dark mode support
- Responsive tooltip positioning

## 🔒 Permissions

- `contextMenus` - Create right-click menu items
- `storage` - Save user preferences
- `scripting` - Inject content scripts
- `<all_urls>` - Work on all websites
