import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestComponent = () => {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    console.log('✅ TestComponent mounted successfully');
    return () => {
      console.log('🔄 TestComponent unmounted');
    };
  }, []);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    console.log('🔢 Count incremented to:', count + 1);
  };

  const handleToggle = () => {
    setIsVisible(prev => !prev);
    console.log('👁️ Visibility toggled to:', !isVisible);
  };

  if (!isVisible) {
    return (
      <div className="p-4">
        <Button onClick={handleToggle} className="bg-green-600 hover:bg-green-700">
          Show Test Component
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          React Test Component
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Counter: {count}</p>
          <p className="text-sm text-gray-500">This proves React is working!</p>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={handleIncrement} className="bg-blue-600 hover:bg-blue-700">
            Increment ({count})
          </Button>
          <Button onClick={handleToggle} variant="outline">
            Hide Component
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>✅ React Hooks working</p>
          <p>✅ State management working</p>
          <p>✅ Event handlers working</p>
          <p>✅ UI components working</p>
          <p>✅ Console logging working</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestComponent;
