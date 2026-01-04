// DeepBrief Background Service Worker
const API_URL = 'https://deepbrief-api-ble76liyba-uc.a.run.app/explain';

// 1. Create the Context Menu on Installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-jargon",
    title: "Explain \"%s\"", 
    contexts: ["selection"] // Only show when text is selected
  });
  console.log("✅ DeepBrief Context Menu initialized");
});

// 2. Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "explain-jargon" && info.selectionText) {
    
    const selectedText = info.selectionText.trim();
    if (!selectedText) return;

    // Notify content script that we are fetching (to show a loader)
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_LOADER",
        text: selectedText,
        x: 0, 
      });
    } catch (err) {
      console.warn("Could not send message to tab (content script might not be ready yet)", err);
      return; 
    }

    // 3. Call the DeepBrief API
    try {
      const explanation = await fetchExplanation(selectedText);
      
      // 4. Send Result to Content Script
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_EXPLANATION",
        original: selectedText,
        explanation: explanation
      });

    } catch (error) {
      console.error("API Error:", error);
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_ERROR",
        error: "Failed to get explanation. Please try again."
      });
    }
  }
});

// Helper function to call the Go Backend
async function fetchExplanation(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data.explanation;
}
