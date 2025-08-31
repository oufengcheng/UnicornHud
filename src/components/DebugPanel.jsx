import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Copy,
  Download
} from 'lucide-react';

const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    components: {},
    errors: [],
    cssLoaded: false,
    reactLoaded: false,
    routerLoaded: false
  });

  const [componentStates, setComponentStates] = useState({
    App: 'loading',
    Layout: 'loading',
    HomePage: 'loading',
    Router: 'loading'
  });

  useEffect(() => {
    // Check if CSS is loaded
    const checkCSSLoaded = () => {
      const testElement = document.createElement('div');
      testElement.className = 'bg-red-500';
      document.body.appendChild(testElement);
      const computedStyle = window.getComputedStyle(testElement);
      const isLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                      computedStyle.backgroundColor !== 'transparent';
      document.body.removeChild(testElement);
      
      setDebugInfo(prev => ({
        ...prev,
        cssLoaded: isLoaded
      }));
    };

    // Check if React is loaded
    const checkReactLoaded = () => {
      const isReactLoaded = typeof React !== 'undefined' && React.version;
      setDebugInfo(prev => ({
        ...prev,
        reactLoaded: !!isReactLoaded
      }));
    };

    // Check if Router is loaded
    const checkRouterLoaded = () => {
      const isRouterLoaded = typeof window !== 'undefined' && window.location;
      setDebugInfo(prev => ({
        ...prev,
        routerLoaded: !!isRouterLoaded
      }));
    };

    // Update viewport on resize
    const updateViewport = () => {
      setDebugInfo(prev => ({
        ...prev,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }));
    };

    // Monitor for errors
    const handleError = (event) => {
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString()
        }]
      }));
    };

    // Monitor for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, {
          message: event.reason?.message || 'Unhandled Promise Rejection',
          type: 'promise',
          timestamp: new Date().toISOString()
        }]
      }));
    };

    // Initial checks
    checkCSSLoaded();
    checkReactLoaded();
    checkRouterLoaded();

    // Set up event listeners
    window.addEventListener('resize', updateViewport);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Update timestamp every second
    const interval = setInterval(() => {
      setDebugInfo(prev => ({
        ...prev,
        timestamp: new Date().toISOString()
      }));
    }, 1000);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(interval);
    };
  }, []);

  const updateComponentState = (componentName, state) => {
    setComponentStates(prev => ({
      ...prev,
      [componentName]: state
    }));
  };

  const copyDebugInfo = () => {
    const debugData = {
      ...debugInfo,
      componentStates
    };
    navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
  };

  const downloadDebugInfo = () => {
    const debugData = {
      ...debugInfo,
      componentStates
    };
    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-info-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'loading':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'loading':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0"
          title="Debug Panel"
        >
          <Bug className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Debug Panel
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={copyDebugInfo}
                variant="outline"
                size="sm"
                title="Copy Debug Info"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={downloadDebugInfo}
                variant="outline"
                size="sm"
                title="Download Debug Info"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                size="sm"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">System Status</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>CSS Loaded:</span>
                  <Badge className={getStatusColor(debugInfo.cssLoaded ? 'success' : 'error')}>
                    {getStatusIcon(debugInfo.cssLoaded ? 'success' : 'error')}
                    {debugInfo.cssLoaded ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>React Loaded:</span>
                  <Badge className={getStatusColor(debugInfo.reactLoaded ? 'success' : 'error')}>
                    {getStatusIcon(debugInfo.reactLoaded ? 'success' : 'error')}
                    {debugInfo.reactLoaded ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Router Loaded:</span>
                  <Badge className={getStatusColor(debugInfo.routerLoaded ? 'success' : 'error')}>
                    {getStatusIcon(debugInfo.routerLoaded ? 'success' : 'error')}
                    {debugInfo.routerLoaded ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Component States */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Component States</h3>
              
              <div className="space-y-2">
                {Object.entries(componentStates).map(([component, state]) => (
                  <div key={component} className="flex items-center justify-between">
                    <span>{component}:</span>
                    <Badge className={getStatusColor(state)}>
                      {getStatusIcon(state)}
                      {state}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Viewport Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Viewport</h3>
              
              <div className="space-y-2 text-sm">
                <div>Width: {debugInfo.viewport.width}px</div>
                <div>Height: {debugInfo.viewport.height}px</div>
                <div>URL: {debugInfo.url}</div>
                <div>Timestamp: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Errors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Errors ({debugInfo.errors.length})</h3>
              
              {debugInfo.errors.length === 0 ? (
                <div className="text-green-600 text-sm">No errors detected</div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {debugInfo.errors.slice(-5).map((error, index) => (
                    <div key={index} className="text-xs bg-red-50 p-2 rounded border border-red-200">
                      <div className="font-semibold text-red-800">{error.message}</div>
                      {error.filename && (
                        <div className="text-red-600">{error.filename}:{error.lineno}</div>
                      )}
                      <div className="text-red-500">{new Date(error.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel;
