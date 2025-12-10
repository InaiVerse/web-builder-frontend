"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback, useMemo } from 'react';
// Interaction script injected inside the iframe. Scoped with an IIFE and safer DOM checks.
const interactionScript = String.raw`(() => {
  const style = document.createElement('style');
  // Sanitize CSS content to prevent XSS
  const cssContent = "[data-nextinai-hover] { outline: 2px dashed #3B82F6 !important; cursor: pointer !important; transition: outline 0.1s ease-in-out; animation: nextinai-shake 0.5s ease-in-out; }\\n[data-nextinai-selected] { outline: 2px solid #93C5FD !important; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5) !important; }\\n@keyframes nextinai-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }";
  style.textContent = cssContent;
  document.head.appendChild(style);
  let lastHovered = null;
  let selectionEnabled = false;
  const sendMessage = (payload) => {
    try { 
      // Security: Only send messages to parent window
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, '*');
      }
    } catch (e) { 
      console.warn('Failed to send message to parent:', e);
    }
  };
  // Only observe element nodes
  function isValidTarget(t, body) {
    return t && t.nodeType === 1 && t !== body && t.tagName;
  }
  const setupBodyListeners = () => {
    const body = document.body;
    if (!body) return;
    window.addEventListener('message', (event) => {
      const data = event.data || {};
      if (data && data.type === 'nextinai-select-mode') {
        console.log('[NextInai] Received select-mode message:', data.enabled);
        selectionEnabled = !!data.enabled;
        console.log('[NextInai] Selection mode is now:', selectionEnabled);
        if (!selectionEnabled && lastHovered) {
          if (lastHovered.removeAttribute) {
            lastHovered.removeAttribute('data-nextinai-hover');
            lastHovered.removeAttribute('data-nextinai-selected');
          }
          lastHovered = null;
        }
      }
    }, false);
    body.addEventListener('mouseover', (e) => {
      if (!selectionEnabled) return;
      const target = e.target;
      if (!isValidTarget(target, body)) return;
      if (lastHovered && lastHovered.removeAttribute) lastHovered.removeAttribute('data-nextinai-hover');
      target.setAttribute('data-nextinai-hover', 'true');
      lastHovered = target;
    });
    body.addEventListener('mouseout', (e) => {
      const t = e.target;
      if (t && t.removeAttribute) t.removeAttribute('data-nextinai-hover');
    });
    body.addEventListener('click', (e) => {
      console.log('[NextInai] Click detected, selectionEnabled:', selectionEnabled);
      
      if (!selectionEnabled) {
        // Handle navigation when not in selection mode
        const target = e.target;
        const link = target.closest ? target.closest('a') : null;
        
        if (link) {
          const href = link.getAttribute('href');
          
          // Skip empty links
          if (!href) return;
          
          // Handle external links - open in new tab
          if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
            link.target = '_blank';
            return;
          }
          
          // Skip anchors and special protocols
          if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
          
          // Handle internal navigation
          e.preventDefault();
          e.stopPropagation();
          
          sendMessage({
            type: 'nextinai-navigate',
            path: href
          });
        }
        return;
      }
      // Selection mode handling
      console.log('[NextInai] Selection mode active, processing click');
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('[data-nextinai-selected]').forEach(el => el.removeAttribute('data-nextinai-selected'));
      const target = e.target;
      if (!isValidTarget(target, body)) {
        console.log('[NextInai] Invalid target');
        return;
      }
      target.setAttribute('data-nextinai-selected', 'true');
      
      // Generate unique CSS selector
      function generateSelector(el) {
        if (el.id) return '#' + el.id;
        let path = [];
        let current = el;
        while (current && current !== body && current.tagName) {
          let selector = current.tagName.toLowerCase();
          if (current.id) {
            selector = '#' + current.id;
            path.unshift(selector);
            break;
          }
          if (current.className && typeof current.className === 'string') {
            const cleanClass = current.className.replace(/data-nextinai-\\w+/g, '').trim();
            if (cleanClass) {
              selector += '.' + cleanClass.split(' ').filter(c => c && !c.startsWith('data-nextinai')).join('.');
            }
          }
          // Add nth-child for uniqueness
          const parent = current.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter(c => c.tagName === current.tagName);
            if (siblings.length > 1) {
              const index = siblings.indexOf(current) + 1;
              selector += ':nth-of-type(' + index + ')';
            }
          }
          path.unshift(selector);
          current = current.parentElement;
        }
        return path.join(' > ');
      }
      
      // Get parent selector
      function getParentSelector(el) {
        if (!el.parentElement || el.parentElement === body) return 'body';
        return generateSelector(el.parentElement);
      }
      
      // Get computed styles
      const computedStyles = window.getComputedStyle(target);
      const currentStyles = {
        'background-color': computedStyles.backgroundColor,
        'color': computedStyles.color,
        'font-size': computedStyles.fontSize,
        'font-weight': computedStyles.fontWeight,
        'font-family': computedStyles.fontFamily,
        'padding': computedStyles.padding,
        'margin': computedStyles.margin,
        'border': computedStyles.border,
        'border-radius': computedStyles.borderRadius,
        'width': computedStyles.width,
        'height': computedStyles.height,
        'display': computedStyles.display,
        'text-align': computedStyles.textAlign
      };
      
      // Get all attributes
      const attributes = {};
      for (let i = 0; i < target.attributes.length; i++) {
        const attr = target.attributes[i];
        if (!attr.name.startsWith('data-nextinai')) {
          attributes[attr.name] = attr.value;
        }
      }
      
      // Build DOM path for index-based navigation
      let indexPath = [];
      let current = target;
      while (current && current.parentElement && current !== body) {
        const parent = current.parentElement;
        const elementChildren = Array.from(parent.children).filter(n => n.nodeType === 1);
        const index = elementChildren.indexOf(current);
        indexPath.unshift(index);
        current = parent;
      }
      
      const selector = generateSelector(target);
      const parentSelector = getParentSelector(target);
      
      console.log('[NextInai] Sending enhanced select message');
      console.log('[NextInai] Selector:', selector);
      
      sendMessage({
        type: 'nextinai-select',
        path: indexPath,
        selector: selector,
        tag_name: target.tagName.toLowerCase(),
        html_snippet: target.outerHTML.substring(0, 1000),
        inner_text: (target.innerText || '').substring(0, 300),
        current_styles: currentStyles,
        attributes: attributes,
        parent_selector: parentSelector,
        // Legacy fields for backward compatibility
        textContent: target.innerText,
        tagName: target.tagName,
        classNames: (target.className || '').replace(/data-nextinai-\\w+/g, '').trim()
      });
    }, true);
    try {
      let lastSentHeight = 0;
      const heightChangeThreshold = 5; // Only send if height changes by more than 5px
      let resizeTimeout = null;
      
      const ro = new ResizeObserver(() => {
        try {
          // Clear previous timeout
          if (resizeTimeout) clearTimeout(resizeTimeout);
          
          // Debounce resize events
          resizeTimeout = setTimeout(() => {
            const height = Math.max(document.documentElement.scrollHeight || 0, body.scrollHeight || 0);
            
            // Only send message if height changed significantly
            if (Math.abs(height - lastSentHeight) > heightChangeThreshold) {
              lastSentHeight = height;
              sendMessage({ type: 'nextinai-resize', height });
            }
          }, 150); // 150ms debounce
        } catch (e) {
          console.warn('Failed to send resize message:', e);
        }
      });
      ro.observe(document.documentElement);
      ro.observe(body);
      
      // Cleanup function for ResizeObserver
      const cleanupResizeObserver = () => {
        try {
          if (resizeTimeout) clearTimeout(resizeTimeout);
          ro.disconnect();
        } catch (e) {
          console.warn('Failed to disconnect ResizeObserver:', e);
        }
      };
      
      // Store cleanup function for later use
      window._nextInaiCleanup = cleanupResizeObserver;
    } catch (err) {
      console.warn('ResizeObserver not available, falling back to MutationObserver:', err);
      let lastSentHeight = 0;
      const heightChangeThreshold = 5;
      let mutationTimeout = null;
      
      const mo = new MutationObserver(() => {
        if (mutationTimeout) clearTimeout(mutationTimeout);
        
        mutationTimeout = setTimeout(() => {
          const height = Math.max(document.documentElement.scrollHeight || 0, body.scrollHeight || 0);
          
          if (Math.abs(height - lastSentHeight) > heightChangeThreshold) {
            lastSentHeight = height;
            sendMessage({ type: 'nextinai-resize', height });
          }
        }, 150);
      });
      mo.observe(body, { childList: true, subtree: true, characterData: true });
      
      // Cleanup function for MutationObserver
      const cleanupMutationObserver = () => {
        try {
          if (mutationTimeout) clearTimeout(mutationTimeout);
          mo.disconnect();
        } catch (e) {
          console.warn('Failed to disconnect MutationObserver:', e);
        }
      };
      
      // Store cleanup function for later use
      window._nextInaiCleanup = cleanupMutationObserver;
    }
    // Force initial resize
    const initialHeight = Math.max(document.documentElement.scrollHeight || 0, body.scrollHeight || 0);
    sendMessage({ type: 'nextinai-resize', height: initialHeight });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBodyListeners, { once: true });
  } else {
    setupBodyListeners();
  }
})();`;
// Debounce utility
function debounce(fn, wait = 100) {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}
export const PreviewPanel = forwardRef((props, ref) => {
  const { htmlContent, cssContent, jsContent, isSelectMode, onToggleSelectMode, viewMode = 'desktop' } = props;
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('100%');
  const latestIsSelectMode = useRef(isSelectMode);
  useImperativeHandle(ref, () => iframeRef.current);
  // Build srcdoc - handle both complete HTML and body-only content
  const buildSrcDoc = useCallback((h, c, j) => {
    // Check if h is a complete HTML document
    const isCompleteHtml = h.trim().startsWith('<!DOCTYPE') || h.trim().startsWith('<html');
    if (isCompleteHtml) {
      // Use complete HTML, but inject CSS, JS, and interaction script
      let modifiedHtml = h;

      // Remove specific external script/style references to prevent 404s
      // We inject these contents manually
      modifiedHtml = modifiedHtml.replace(/<script\s+src=["'][\.\/]*script\.js["']\s*><\/script>/gi, '');
      modifiedHtml = modifiedHtml.replace(/<link\s+rel=["']stylesheet["']\s+href=["'][\.\/]*styles\.css["']\s*\/?>/gi, '');

      // 1. Inject CSS content if provided
      if (c && c.trim()) {
        const headCloseIndex = modifiedHtml.toLowerCase().indexOf('</head>');
        if (headCloseIndex !== -1) {
          modifiedHtml =
            modifiedHtml.substring(0, headCloseIndex) +
            `  <style>\n${c}\n  </style>\n` +
            modifiedHtml.substring(headCloseIndex);
        }
      }
      // 2. Inject interaction script before </head>
      const headCloseIndex2 = modifiedHtml.toLowerCase().indexOf('</head>');
      if (headCloseIndex2 !== -1) {
        modifiedHtml =
          modifiedHtml.substring(0, headCloseIndex2) +
          `  <script>${interactionScript}</script>\n` +
          modifiedHtml.substring(headCloseIndex2);
      }
      // 3. Inject JavaScript before </body>
      if (j && j.trim()) {
        const bodyCloseIndex = modifiedHtml.toLowerCase().lastIndexOf('</body>');
        if (bodyCloseIndex !== -1) {
          modifiedHtml =
            modifiedHtml.substring(0, bodyCloseIndex) +
            `  <script>\n    const module = { exports: {} }; const exports = module.exports;\n    try {\n      ${j}\n    } catch(e) { console.error('Preview JS execution error:', e); }\n  </script>\n` +
            modifiedHtml.substring(bodyCloseIndex);
        }
      }
      return modifiedHtml;
    }
    // For body-only content, wrap with full HTML structure (backward compatibility)
    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script>window.__NEXT_INAI_INJECTED__ = true;</script>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- GSAP Animation Library -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  
  <!-- Three.js for 3D Graphics -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }
  </script>
  
  <!-- Particles.js for Particle Effects -->
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  
  <!-- AOS (Animate On Scroll) -->
  <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
  
  <!-- Lenis Smooth Scroll -->
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.29/dist/lenis.min.js"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
  
  <script>
    tailwind.config = { darkMode: 'class', theme: { extend: { fontFamily: { sans: ['Inter','sans-serif'], headline: ['Space Grotesk','sans-serif'] } } } };
  </script>
  <style>
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; margin:0; }
    ${c}
  </style>
  <script>${interactionScript}</script>
</head>
<body>
  ${h}
  <script>
    const module = { exports: {} }; const exports = module.exports;
    try {
      ${j}
    } catch(e) { 
      console.error('Preview JS execution error:', e);
      // Create safe error element instead of using innerHTML
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:5px;border-radius:3px;font-size:12px;';
      errorDiv.textContent = 'JavaScript Error';
      document.body.appendChild(errorDiv);
    }
  </script>
</body>
</html>`;
  }, []);

  // Debounced resize handler to prevent excessive updates
  const debouncedSetHeight = useMemo(() =>
    debounce((height) => {
      requestAnimationFrame(() => {
        setIframeHeight(height);
      });
    }, 300), // 300ms debounce for smooth performance
    []
  );

  // Post height and selection messages handler coming from iframe
  useEffect(() => {
    let lastHeight = 0;
    const heightThreshold = 10; // Only update if height changes by more than 10px

    const onMessage = (ev) => {
      const data = ev.data || {};
      if (!data || typeof data !== 'object') return;
      if (data.type === 'nextinai-resize' && typeof data.height === 'number') {
        const newHeight = Math.max(300, data.height);
        // Only update if height changed significantly to prevent infinite loop
        if (Math.abs(newHeight - lastHeight) > heightThreshold) {
          lastHeight = newHeight;
          debouncedSetHeight(`${newHeight}px`);
        }
      }
      if (data.type === 'nextinai-select') {
        // Create custom event with proper data structure
        const event = new CustomEvent('nextinai-select', { detail: data });
        window.dispatchEvent(event);
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      // Cleanup debounced function on unmount
      if (debouncedSetHeight.cancel) {
        debouncedSetHeight.cancel();
      }
    };
  }, [debouncedSetHeight]);
  // Debounced srcdoc update to avoid thrashing on rapid edits
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const update = () => {
      try {
        const srcdoc = buildSrcDoc(htmlContent, cssContent, jsContent);
        // Only update if changed to reduce reloads
        if (iframe.srcdoc !== srcdoc) iframe.srcdoc = srcdoc;
      } catch (e) {
        console.warn('Failed to set iframe srcdoc', e);
      }
    };
    const debounced = debounce(update, 150);
    debounced();
    return () => {
      // nothing specific to cleanup
    };
  }, [htmlContent, cssContent, jsContent, buildSrcDoc]);
  // Keep select mode synced, but wait until iframe is ready
  useEffect(() => {
    latestIsSelectMode.current = isSelectMode;
    const sendMode = () => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      try {
        // Security: Use specific origin instead of wildcard
        const targetOrigin = window.location.origin;
        win.postMessage({ type: 'nextinai-select-mode', enabled: isSelectMode }, targetOrigin);
      } catch (e) {
        console.warn('Failed to send select mode message:', e);
      }
    };
    // try immediate, then try again on load
    sendMode();
    const onLoad = () => sendMode();
    const iframe = iframeRef.current;
    iframe?.addEventListener('load', onLoad);
    return () => iframe?.removeEventListener('load', onLoad);
  }, [isSelectMode]);
  // Ensure cleanup: remove listeners when unmounting
  useEffect(() => {
    return () => {
      // nothing to cleanup at top-level here presently
    };
  }, []);
  // Calculate width based on view mode
  const getWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };
  return (
    <div className="relative h-full w-full bg-background shadow-inner">
      <div className="h-full w-full overflow-auto pr-2 pb-16 flex justify-center bg-gray-900/50">
        <iframe
          ref={iframeRef}
          title="Live Preview"
          className="border-0 bg-white transition-all duration-300 ease-in-out shadow-2xl"
          style={{
            height: '100%', // Use 100% for all modes - parent container handles scrolling
            minHeight: viewMode === 'desktop' ? '100vh' : '100%',
            width: getWidth(),
            borderRadius: viewMode !== 'desktop' ? '12px' : '0',
            marginTop: viewMode !== 'desktop' ? '20px' : '0',
            marginBottom: viewMode !== 'desktop' ? '20px' : '0'
          }}
          // Narrow sandbox - only allow scripts inside the iframe
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <button
        type="button"
        onClick={onToggleSelectMode}
        className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg transition-colors ${isSelectMode
          ? 'bg-primary text-primary-foreground'
          : 'bg-gray-900/80 text-gray-100 border border-gray-700 hover:bg-gray-800/90'
          }`}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${isSelectMode ? 'bg-emerald-400' : 'bg-gray-400'}`}
        />
        <span>{isSelectMode ? 'Selecting elements' : 'Select design'}</span>
      </button>
    </div>
  );
});
PreviewPanel.displayName = 'PreviewPanel';
export default PreviewPanel;