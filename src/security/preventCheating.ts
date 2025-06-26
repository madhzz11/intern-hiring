// Additional security measures to prevent cheating

// Disable drag and drop
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
});

// Disable text selection globally (except for specific elements)
document.addEventListener('selectstart', (e) => {
  const target = e.target as Node;
  // Check if target is an Element before calling closest
  if (target instanceof Element && !target.closest('.selectable')) {
    e.preventDefault();
  } else if (!(target instanceof Element)) {
    // If it's not an Element (e.g., text node), prevent selection by default
    e.preventDefault();
  }
});

// Disable image saving
document.addEventListener('dragstart', (e) => {
  if ((e.target as Element).tagName === 'IMG') {
    e.preventDefault();
  }
});

// Clear console periodically to prevent inspection
if (typeof window !== 'undefined') {
  setInterval(() => {
    console.clear();
    console.log('%cCodeAssess Pro - Security Active', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('%cAny attempt to manipulate this assessment is being monitored and logged.', 'color: orange; font-size: 12px;');
  }, 10000);
}

// Detect if developer tools are open
let devtools = {
  open: false,
  orientation: null as string | null
};

const threshold = 160;

setInterval(() => {
  if (typeof window !== 'undefined') {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.log('%cDeveloper tools detected!', 'color: red; font-size: 16px;');
        
        // Dispatch security event if Redux store is available
        if (window.__REDUX_STORE__) {
          window.__REDUX_STORE__.dispatch({
            type: 'security/addSecurityEvent',
            payload: {
              type: 'DEVELOPER_TOOLS_DETECTED',
              timestamp: new Date(),
              details: { 
                windowInner: `${window.innerWidth}x${window.innerHeight}`,
                windowOuter: `${window.outerWidth}x${window.outerHeight}`
              }
            }
          });
        }
      }
    } else {
      devtools.open = false;
    }
  }
}, 500);

// Prevent common inspection shortcuts
document.addEventListener('keydown', (e) => {
  // Prevent Ctrl+Shift+I (Developer Tools)
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    console.log('%cDeveloper tools access blocked!', 'color: red;');
  }
  
  // Prevent Ctrl+Shift+C (Element inspector)
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    console.log('%cElement inspector blocked!', 'color: red;');
  }
  
  // Prevent Ctrl+U (View source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    console.log('%cView source blocked!', 'color: red;');
  }
  
  // Prevent F12 (Developer Tools)
  if (e.key === 'F12') {
    e.preventDefault();
    console.log('%cDeveloper tools blocked!', 'color: red;');
  }
});

// Make Redux store globally accessible for security events
if (typeof window !== 'undefined') {
  Object.defineProperty(window, '__REDUX_STORE__', {
    get: function() {
      return (window as any).__ACTUAL_REDUX_STORE__;
    },
    set: function(store) {
      (window as any).__ACTUAL_REDUX_STORE__ = store;
    }
  });
}