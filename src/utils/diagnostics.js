/**
 * Diagnostic Utilities
 * Help identify issues causing blank page
 */

export const runDiagnostics = () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    system: {},
    react: {},
    css: {},
    router: {},
    errors: [],
    recommendations: []
  };

  // System checks
  try {
    diagnostics.system = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      documentReady: document.readyState,
      hasRootElement: !!document.getElementById('root'),
      rootElementContent: document.getElementById('root')?.innerHTML || 'empty'
    };
  } catch (error) {
    diagnostics.errors.push(`System check failed: ${error.message}`);
  }

  // React checks
  try {
    diagnostics.react = {
      isDefined: typeof React !== 'undefined',
      version: React?.version || 'unknown',
      isReactDOMDefined: typeof ReactDOM !== 'undefined',
      createRootAvailable: typeof createRoot !== 'undefined'
    };
  } catch (error) {
    diagnostics.errors.push(`React check failed: ${error.message}`);
  }

  // CSS checks
  try {
    const testElement = document.createElement('div');
    testElement.className = 'bg-red-500';
    document.body.appendChild(testElement);
    const computedStyle = window.getComputedStyle(testElement);
    const isCSSLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                       computedStyle.backgroundColor !== 'transparent';
    document.body.removeChild(testElement);

    diagnostics.css = {
      isLoaded: isCSSLoaded,
      backgroundColor: computedStyle.backgroundColor,
      testElementCreated: true
    };
  } catch (error) {
    diagnostics.errors.push(`CSS check failed: ${error.message}`);
    diagnostics.css = { isLoaded: false, error: error.message };
  }

  // Router checks
  try {
    diagnostics.router = {
      windowAvailable: typeof window !== 'undefined',
      locationAvailable: !!window.location,
      historyAvailable: !!window.history,
      currentPath: window.location.pathname
    };
  } catch (error) {
    diagnostics.errors.push(`Router check failed: ${error.message}`);
  }

  // Generate recommendations
  if (!diagnostics.system.hasRootElement) {
    diagnostics.recommendations.push('Root element not found - check HTML structure');
  }

  if (!diagnostics.react.isDefined) {
    diagnostics.recommendations.push('React not loaded - check script imports');
  }

  if (!diagnostics.css.isLoaded) {
    diagnostics.recommendations.push('CSS not loaded - check CSS imports and Tailwind configuration');
  }

  if (diagnostics.system.rootElementContent === 'empty') {
    diagnostics.recommendations.push('Root element is empty - React app may not be rendering');
  }

  return diagnostics;
};

export const logDiagnostics = () => {
  const diagnostics = runDiagnostics();
  
  console.group('🔍 Unicorn 100 Diagnostics Report');
  console.log('Timestamp:', diagnostics.timestamp);
  
  console.group('System Status');
  console.log('User Agent:', diagnostics.system.userAgent);
  console.log('URL:', diagnostics.system.url);
  console.log('Viewport:', diagnostics.system.viewport);
  console.log('Document Ready State:', diagnostics.system.documentReady);
  console.log('Root Element Found:', diagnostics.system.hasRootElement);
  console.log('Root Element Content:', diagnostics.system.rootElementContent);
  console.groupEnd();
  
  console.group('React Status');
  console.log('React Defined:', diagnostics.react.isDefined);
  console.log('React Version:', diagnostics.react.version);
  console.log('ReactDOM Defined:', diagnostics.react.isReactDOMDefined);
  console.log('createRoot Available:', diagnostics.react.createRootAvailable);
  console.groupEnd();
  
  console.group('CSS Status');
  console.log('CSS Loaded:', diagnostics.css.isLoaded);
  console.log('Background Color:', diagnostics.css.backgroundColor);
  console.groupEnd();
  
  console.group('Router Status');
  console.log('Window Available:', diagnostics.router.windowAvailable);
  console.log('Location Available:', diagnostics.router.locationAvailable);
  console.log('Current Path:', diagnostics.router.currentPath);
  console.groupEnd();
  
  if (diagnostics.errors.length > 0) {
    console.group('❌ Errors');
    diagnostics.errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  if (diagnostics.recommendations.length > 0) {
    console.group('💡 Recommendations');
    diagnostics.recommendations.forEach(rec => console.warn(rec));
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return diagnostics;
};

export const checkForCommonIssues = () => {
  const issues = [];
  
  // Check for common React issues
  if (typeof React === 'undefined') {
    issues.push('React is not defined - check if React is properly imported');
  }
  
  if (typeof ReactDOM === 'undefined') {
    issues.push('ReactDOM is not defined - check if ReactDOM is properly imported');
  }
  
  // Check for CSS issues
  const testElement = document.createElement('div');
  testElement.className = 'bg-red-500';
  document.body.appendChild(testElement);
  const computedStyle = window.getComputedStyle(testElement);
  const isCSSLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                     computedStyle.backgroundColor !== 'transparent';
  document.body.removeChild(testElement);
  
  if (!isCSSLoaded) {
    issues.push('Tailwind CSS is not loaded - check CSS imports and configuration');
  }
  
  // Check for DOM issues
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    issues.push('Root element not found - check HTML structure');
  } else if (rootElement.innerHTML.trim() === '') {
    issues.push('Root element is empty - React app is not rendering');
  }
  
  // Check for script loading issues
  const scripts = document.querySelectorAll('script');
  const hasReactScript = Array.from(scripts).some(script => 
    script.src && (script.src.includes('react') || script.src.includes('vite'))
  );
  
  if (!hasReactScript) {
    issues.push('React/Vite scripts not found - check script loading');
  }
  
  return issues;
};

export const generateReport = () => {
  const diagnostics = runDiagnostics();
  const issues = checkForCommonIssues();
  
  return {
    ...diagnostics,
    issues,
    summary: {
      hasErrors: diagnostics.errors.length > 0,
      hasIssues: issues.length > 0,
      isReactWorking: diagnostics.react.isDefined,
      isCSSWorking: diagnostics.css.isLoaded,
      isDOMWorking: diagnostics.system.hasRootElement,
      totalIssues: diagnostics.errors.length + issues.length
    }
  };
};
