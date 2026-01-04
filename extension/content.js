// DeepBrief Content Script

let host = null;
let shadow = null;
let tooltip = null;
let lastSelectionRect = null;
let currentExplanations = null; // Store the 3 versions
let activeTab = 'simple'; // Default tab

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
    // Store all 3 versions of the explanation
    currentExplanations = request.explanation; 
    // Render the UI with the default tab (Simple)
    showResult(request.original);
  } else if (request.action === "SHOW_ERROR") {
    showError(request.error);
  }
});

// Track selection position
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    lastSelectionRect = range.getBoundingClientRect();
  }
});

// Close tooltip when clicking outside
document.addEventListener('mousedown', (e) => {
  if (host && tooltip) {
    if (e.target !== host) {
      removeTooltip();
    }
  }
});

function createTooltip() {
  removeTooltip();

  host = document.createElement('div');
  host.id = 'deepbrief-host';
  document.body.appendChild(host);

  shadow = host.attachShadow({ mode: 'open' });

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', chrome.runtime.getURL('styles.css'));
  shadow.appendChild(link);

  tooltip = document.createElement('div');
  tooltip.className = 'deepbrief-container';
  
  // Initial Skeleton HTML (Header + Content)
  // Tabs will be injected when content arrives
  const headerHtml = `
    <div class="deepbrief-header">
      <div class="deepbrief-logo">
        🧠 DeepBrief
      </div>
      <button class="deepbrief-close">×</button>
    </div>
  `;

  tooltip.innerHTML = headerHtml + `<div class="deepbrief-content" id="db-content"></div>`;
  shadow.appendChild(tooltip);

  const closeBtn = tooltip.querySelector('.deepbrief-close');
  closeBtn.addEventListener('click', removeTooltip);

  tooltip.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
}

function showLoader(term) {
  console.log("DeepBrief: showing loader");
  const content = shadow.getElementById('db-content');
  content.innerHTML = `
    <div class="deepbrief-term">Explaining: "${term}"</div>
    <div class="deepbrief-loader">
      <div class="spinner"></div>
      <div>Thinking...</div>
    </div>
  `;
  requestAnimationFrame(() => {
    tooltip.classList.add('visible');
  });
}

function showResult(term) {
  console.log("DeepBrief: showing result for", term);
  // Inject the Tabs + Content
  // We recreate the inner structure to include tabs
  
  // 1. Header with Copy Button
  const headerHtml = `
    <div class="deepbrief-header">
      <div class="deepbrief-logo">
        🧠 DeepBrief
      </div>
      <div class="deepbrief-actions">
        <button class="deepbrief-icon-btn deepbrief-copy" title="Copy to clipboard">
          <!-- Copy Icon (SVG) -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button class="deepbrief-close" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `;

  const tabsHtml = `
    <div class="deepbrief-tabs">
      <button class="deepbrief-tab ${activeTab === 'concise' ? 'active' : ''}" data-tab="concise">Concise</button>
      <button class="deepbrief-tab ${activeTab === 'simple' ? 'active' : ''}" data-tab="simple">Simple</button>
      <button class="deepbrief-tab ${activeTab === 'deep_dive' ? 'active' : ''}" data-tab="deep_dive">Deep Dive</button>
    </div>
  `;

  const contentText = currentExplanations[activeTab] || "Processing...";
  const formattedText = contentText.replace(/\n/g, '<br>');

  const contentHtml = `
    <div class="deepbrief-content" id="db-content">
      <div class="deepbrief-term">${term}</div>
      <div class="deepbrief-explanation">${formattedText}</div>
    </div>
  `;

  tooltip.innerHTML = headerHtml + tabsHtml + contentHtml;

  // Re-attach listeners
  const closeBtn = tooltip.querySelector('.deepbrief-close');
  closeBtn.addEventListener('click', removeTooltip);
  
  // Tabs
  const tabs = tooltip.querySelectorAll('.deepbrief-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const selectedTab = e.target.getAttribute('data-tab');
      switchTab(selectedTab, term);
    });
  });

  // Copy Button Logic
  const copyBtn = tooltip.querySelector('.deepbrief-copy');
  copyBtn.addEventListener('click', () => {
    const textToCopy = currentExplanations[activeTab];
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Show Feedback (Change icon to checkmark)
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          // Revert icon after 2 seconds
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 2000);
      });
    }
  });
}

function switchTab(newTab, term) {
  activeTab = newTab;
  
  // Update Tab Styling
  const tabs = tooltip.querySelectorAll('.deepbrief-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === newTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update Content
  const explanationDiv = tooltip.querySelector('.deepbrief-explanation');
  if (explanationDiv && currentExplanations) {
    const text = currentExplanations[newTab] || "";
    explanationDiv.innerHTML = text.replace(/\n/g, '<br>');
  }
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
    setTimeout(() => {
      if (host) {
        host.remove();
      }
      host = null;
      shadow = null;
      tooltip = null;
      currentExplanations = null;
      activeTab = 'simple'; // Reset to default
    }, 200);
  } else if (host) {
    host.remove();
    host = null;
    shadow = null;
  }
}

function positionTooltip() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const scrollX = window.scrollX || document.documentElement.scrollLeft;

  let top, left;

  if (lastSelectionRect && lastSelectionRect.width > 0) {
    // Normal positioning below selection
    top = lastSelectionRect.bottom + scrollY + 12;
    left = lastSelectionRect.left + scrollX;
  } else {
    // Fallback: Center of screen
    top = scrollY + (window.innerHeight / 2) - 150;
    left = scrollX + (window.innerWidth / 2) - 170;
  }

  // Boundary checks
  if (left + 350 > window.innerWidth + scrollX) {
    left = (window.innerWidth + scrollX) - 360;
  }
  if (left < 10) left = 10;

  // Ensure it's not off-screen top
  if (top < scrollY) top = scrollY + 10;

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}
