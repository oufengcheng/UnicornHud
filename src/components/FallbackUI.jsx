import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Settings, 
  Info,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

const FallbackUI = ({ error, retry }) => {
  const [systemStatus, setSystemStatus] = useState({
    css: 'checking',
    react: 'checking',
    router: 'checking',
    dom: 'checking'
  });

  const [debugInfo, setDebugInfo] = useState({
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  });

  useEffect(() => {
    // Check system status
    const checkSystemStatus = async () => {
      const newStatus = { ...systemStatus };

      // Check CSS
      try {
        const testElement = document.createElement('div');
        testElement.className = 'bg-red-500';
        document.body.appendChild(testElement);
        const computedStyle = window.getComputedStyle(testElement);
        const isCSSLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                           computedStyle.backgroundColor !== 'transparent';
        document.body.removeChild(testElement);
        newStatus.css = isCSSLoaded ? 'success' : 'error';
      } catch (err) {
        newStatus.css = 'error';
      }

      // Check React
      try {
        newStatus.react = typeof React !== 'undefined' && React.version ? 'success' : 'error';
      } catch (err) {
        newStatus.react = 'error';
      }

      // Check Router
      try {
        newStatus.router = typeof window !== 'undefined' && window.location ? 'success' : 'error';
      } catch (err) {
        newStatus.router = 'error';
      }

      // Check DOM
      try {
        newStatus.dom = document && document.body ? 'success' : 'error';
      } catch (err) {
        newStatus.dom = 'error';
      }

      setSystemStatus(newStatus);
    };

    checkSystemStatus();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
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
      case 'checking':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRetry = () => {
    if (retry) {
      retry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const copyDebugInfo = () => {
    const debugData = {
      error: error?.toString(),
      systemStatus,
      debugInfo,
      timestamp: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🦄</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Unicorn 100
          </h1>
          <p className="text-gray-600">
            Fallback Interface - Application Loading Issue Detected
          </p>
        </div>

        {/* Error Card */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Error Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-100 p-3 rounded border border-red-200">
                <p className="text-red-800 font-medium">{error.toString()}</p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-red-600">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(systemStatus).map(([component, status]) => (
                <div key={component} className="flex items-center justify-between">
                  <span className="capitalize">{component}:</span>
                  <Badge className={getStatusColor(status)}>
                    {getStatusIcon(status)}
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>URL:</strong> {debugInfo.url}</div>
              <div><strong>Viewport:</strong> {debugInfo.viewport.width} x {debugInfo.viewport.height}</div>
              <div><strong>User Agent:</strong> {debugInfo.userAgent.substring(0, 50)}...</div>
              <div><strong>Timestamp:</strong> {new Date(debugInfo.timestamp).toLocaleString()}</div>
            </div>
            <Button
              onClick={copyDebugInfo}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Copy Debug Info
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Loading
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Clear browser cache and cookies</li>
              <li>Try a different browser</li>
              <li>Contact support if the issue persists</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FallbackUI;
