/**
 * Comprehensive Error Monitoring Service
 * Tracks and reports errors to help diagnose issues
 */

class ErrorMonitoringService {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.isInitialized = false;
    this.performanceMetrics = {
      appLoadTime: null,
      cssLoadTime: null,
      reactLoadTime: null,
      routerLoadTime: null
    };
  }

  initialize() {
    if (this.isInitialized) return;

    console.log('🔍 Initializing Error Monitoring Service...');

    // Track performance metrics
    this.trackPerformance();

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Set up React error boundary integration
    this.setupReactErrorHandling();

    // Monitor CSS loading
    this.monitorCSSLoading();

    // Monitor React loading
    this.monitorReactLoading();

    // Monitor router loading
    this.monitorRouterLoading();

    this.isInitialized = true;
    console.log('✅ Error Monitoring Service initialized');
  }

  trackPerformance() {
    const startTime = performance.now();

    // Track app load time
    window.addEventListener('load', () => {
      this.performanceMetrics.appLoadTime = performance.now() - startTime;
      console.log('📊 App load time:', this.performanceMetrics.appLoadTime.toFixed(2), 'ms');
    });

    // Track CSS load time
    const cssStartTime = performance.now();
    const checkCSSLoaded = () => {
      const testElement = document.createElement('div');
      testElement.className = 'bg-red-500';
      document.body.appendChild(testElement);
      const computedStyle = window.getComputedStyle(testElement);
      const isLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                      computedStyle.backgroundColor !== 'transparent';
      document.body.removeChild(testElement);
      
      if (isLoaded) {
        this.performanceMetrics.cssLoadTime = performance.now() - cssStartTime;
        console.log('📊 CSS load time:', this.performanceMetrics.cssLoadTime.toFixed(2), 'ms');
      } else {
        setTimeout(checkCSSLoaded, 100);
      }
    };
    checkCSSLoaded();
  }

  setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          timestamp: new Date().toISOString()
        });
      }
    }, true);
  }

  setupReactErrorHandling() {
    // Override console.error to capture React errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if it's a React error
      const message = args.join(' ');
      if (message.includes('React') || message.includes('Warning')) {
        this.captureError({
          type: 'react',
          message: message,
          stack: new Error().stack,
          timestamp: new Date().toISOString()
        });
      }
      
      // Call original console.error
      originalConsoleError.apply(console, args);
    };
  }

  monitorCSSLoading() {
    const cssStartTime = performance.now();
    
    const checkCSS = () => {
      const testElement = document.createElement('div');
      testElement.className = 'bg-red-500';
      document.body.appendChild(testElement);
      const computedStyle = window.getComputedStyle(testElement);
      const isLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                      computedStyle.backgroundColor !== 'transparent';
      document.body.removeChild(testElement);
      
      if (isLoaded) {
        this.performanceMetrics.cssLoadTime = performance.now() - cssStartTime;
        console.log('✅ CSS loaded successfully');
      } else {
        console.warn('⚠️ CSS not loaded yet, retrying...');
        setTimeout(checkCSS, 500);
      }
    };
    
    checkCSS();
  }

  monitorReactLoading() {
    const reactStartTime = performance.now();
    
    const checkReact = () => {
      if (typeof React !== 'undefined' && React.version) {
        this.performanceMetrics.reactLoadTime = performance.now() - reactStartTime;
        console.log('✅ React loaded successfully');
      } else {
        console.warn('⚠️ React not loaded yet, retrying...');
        setTimeout(checkReact, 100);
      }
    };
    
    checkReact();
  }

  monitorRouterLoading() {
    const routerStartTime = performance.now();
    
    const checkRouter = () => {
      if (typeof window !== 'undefined' && window.location) {
        this.performanceMetrics.routerLoadTime = performance.now() - routerStartTime;
        console.log('✅ Router loaded successfully');
      } else {
        console.warn('⚠️ Router not loaded yet, retrying...');
        setTimeout(checkRouter, 100);
      }
    };
    
    checkRouter();
  }

  captureError(error) {
    // Add error to list
    this.errors.push(error);
    
    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log error
    console.group('🚨 Error Captured');
    console.error('Type:', error.type);
    console.error('Message:', error.message);
    console.error('Timestamp:', error.timestamp);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    console.groupEnd();

    // Store in localStorage for persistence
    try {
      localStorage.setItem('unicorn100_errors', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Could not save error to localStorage:', e);
    }
  }

  getErrors() {
    return this.errors;
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  getSystemStatus() {
    return {
      css: this.performanceMetrics.cssLoadTime !== null,
      react: this.performanceMetrics.reactLoadTime !== null,
      router: this.performanceMetrics.routerLoadTime !== null,
      app: this.performanceMetrics.appLoadTime !== null
    };
  }

  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      errors: this.errors,
      performance: this.performanceMetrics,
      systemStatus: this.getSystemStatus(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem('unicorn100_errors');
    } catch (e) {
      console.warn('Could not clear errors from localStorage:', e);
    }
  }

  // Load errors from localStorage on initialization
  loadPersistedErrors() {
    try {
      const persisted = localStorage.getItem('unicorn100_errors');
      if (persisted) {
        this.errors = JSON.parse(persisted);
        console.log('📋 Loaded', this.errors.length, 'persisted errors');
      }
    } catch (e) {
      console.warn('Could not load persisted errors:', e);
    }
  }
}

// Create singleton instance
const errorMonitoring = new ErrorMonitoringService();

// Initialize on module load
if (typeof window !== 'undefined') {
  errorMonitoring.loadPersistedErrors();
  errorMonitoring.initialize();
}

export default errorMonitoring;

