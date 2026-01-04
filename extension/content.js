// DeepBrief Content Script

let host = null;
let shadow = null;
let tooltip = null;
let lastSelectionRect = null;

// Track selection position
// We'll primarily capture this when the request comes in, but keeping this listener helps too
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    lastSelectionRect = range.getBoundingClientRect();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "SHOW_LOADER") {
    // 1. Force capture selection coordinates NOW if missing
    if (!lastSelectionRect || lastSelectionRect.width === 0) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        lastSelectionRect = selection.getRangeAt(0).getBoundingClientRect();
      }
    }
    
    createTooltip();
    showLoader(request.text);
    positionTooltip();
  } else if (request.action === "SHOW_EXPLANATION") {
    showExplanation(request.original, request.explanation);
  } else if (request.action === "SHOW_ERROR") {
    showError(request.error);
  }
});

// Close tooltip when clicking outside
document.addEventListener('mousedown', (e) => {
  if (host && tooltip) {
    // Check if click target is NOT inside our shadow root
    // Note: e.target on the page won't be inside shadow DOM
    // We are safe to close if we see a click on the main document
    // But we need to make sure we didn't just click inside the tooltip?
    // Events don't propagate out of shadow DOM easily for this check usually, 
    // but the 'host' is in the light DOM.
    if (e.target !== host) {
      removeTooltip();
    }
  }
});

function createTooltip() {
  // Remove existing tooltip if any
  removeTooltip();

  // Create Host
  host = document.createElement('div');
  host.id = 'deepbrief-host';
  // We attach to body
  document.body.appendChild(host);

  // Create Shadow DOM
  shadow = host.attachShadow({ mode: 'open' });

  // Inject CSS
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', chrome.runtime.getURL('styles.css'));
  shadow.appendChild(link);

  // Create Container
  tooltip = document.createElement('div');
  tooltip.className = 'deepbrief-container';
  
  // Header HTML
  const headerHtml = `
    <div class="deepbrief-header">
      <div class="deepbrief-logo">
        🧠 DeepBrief
      </div>
      <button class="deepbrief-close">×</button>
    </div>
  `;

  // Content Area
  const contentHtml = `<div class="deepbrief-content" id="db-content"></div>`;

  tooltip.innerHTML = headerHtml + contentHtml;
  shadow.appendChild(tooltip);

  // Add event listener for close button inside shadow DOM
  const closeBtn = tooltip.querySelector('.deepbrief-close');
  closeBtn.addEventListener('click', removeTooltip);

  // Stop clicks inside tooltip from closing it
  tooltip.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
}

function showLoader(term) {
  const content = shadow.getElementById('db-content');
  content.innerHTML = `
    <div class="deepbrief-term">Explaining: "${term}"</div>
    <div class="deepbrief-loader">
      <div class="spinner"></div>
      <div>Thinking...</div>
    </div>
  `;
  // Trigger transition
  requestAnimationFrame(() => {
    tooltip.classList.add('visible');
  });
}

function showExplanation(term, text) {
  const content = shadow.getElementById('db-content');
  // Format the text slightly (simple markdown to html if needed, or just plain text)
  // For now, we'll just handle newlines
  const formattedText = text.replace(/\n/g, '<br>');
  
  content.innerHTML = `
    <div class="deepbrief-term">${term}</div>
    <div class="deepbrief-explanation">${formattedText}</div>
  `;
}

function showError(msg) {
  const content = shadow.getElementById('db-content');
  content.innerHTML = `
    <div class="deepbrief-error">
      ⚠️ ${msg}
    </div>
  `;
}

function removeTooltip() {
  if (tooltip) {
    tooltip.classList.remove('visible');
    // Wait for transition to finish before removing from DOM
    setTimeout(() => {
      if (host) {
        host.remove();
      }
      host = null;
      shadow = null;
      tooltip = null;
    }, 200);
  } else if (host) {
    host.remove();
    host = null;
    shadow = null;
  }
}

function positionTooltip() {
  if (!tooltip || !lastSelectionRect) return;

  const rect = lastSelectionRect;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  // Position below selection by default
  let top = rect.bottom + scrollTop + 10;
  let left = rect.left + scrollLeft;

  // Keep within bounds (basic handling)
  if (left + 320 > window.innerWidth) {
    left = window.innerWidth - 330;
  }
  if (left < 10) left = 10;

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}
