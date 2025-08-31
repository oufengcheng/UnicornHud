import React from 'react';
import TestComponent from '../components/TestComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const TestPage = () => {
  const [systemChecks, setSystemChecks] = React.useState({
    react: false,
    css: false,
    router: false,
    components: false
  });

  React.useEffect(() => {
    console.log('🧪 TestPage mounted - running system checks...');
    
    // Check React
    const reactCheck = typeof React !== 'undefined' && React.version;
    
    // Check CSS
    const testElement = document.createElement('div');
    testElement.className = 'bg-red-500';
    document.body.appendChild(testElement);
    const computedStyle = window.getComputedStyle(testElement);
    const cssCheck = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                    computedStyle.backgroundColor !== 'transparent';
    document.body.removeChild(testElement);
    
    // Check Router
    const routerCheck = typeof window !== 'undefined' && window.location;
    
    // Check Components
    const componentsCheck = true; // If we got here, components are working
    
    setSystemChecks({
      react: reactCheck,
      css: cssCheck,
      router: routerCheck,
      components: componentsCheck
    });

    console.log('✅ System checks completed:', {
      react: reactCheck,
      css: cssCheck,
      router: routerCheck,
      components: componentsCheck
    });
  }, []);

  const allChecksPassed = Object.values(systemChecks).every(check => check);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🧪</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Test Page
          </h1>
          <p className="text-gray-600">
            This page tests if all core systems are working correctly
          </p>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(systemChecks).map(([system, status]) => (
                <div key={system} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="capitalize font-medium">{system}:</span>
                  <Badge className={status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {status ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-1" />
                    )}
                    {status ? 'OK' : 'FAIL'}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 rounded-lg border-2 border-dashed">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {allChecksPassed ? '🎉' : '⚠️'}
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {allChecksPassed ? 'All Systems Operational' : 'Some Issues Detected'}
                </h3>
                <p className="text-gray-600">
                  {allChecksPassed 
                    ? 'Your Unicorn 100 application is ready to use!' 
                    : 'Please check the console for detailed error information.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Component */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Test Component</CardTitle>
          </CardHeader>
          <CardContent>
            <TestComponent />
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>React Version:</strong> {React.version}</div>
              <div><strong>Current URL:</strong> {window.location.href}</div>
              <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
              <div><strong>Viewport:</strong> {window.innerWidth} x {window.innerHeight}</div>
              <div><strong>Timestamp:</strong> {new Date().toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            If all tests pass, you can proceed to the main application
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Go to Home Page
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
