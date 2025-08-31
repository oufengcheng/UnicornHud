import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'

// Import error monitoring service
import errorMonitoring from './services/errorMonitoring.js'
// Import diagnostics
import { logDiagnostics, generateReport } from './utils/diagnostics.js'

console.log('🚀 Starting Unicorn 100 application...');

// Initialize error monitoring
errorMonitoring.initialize();

// Run diagnostics
setTimeout(() => {
  console.log('🔍 Running diagnostics...');
  const report = generateReport();
  logDiagnostics();
  
  if (report.summary.totalIssues > 0) {
    console.error('❌ Issues detected:', report.summary);
    console.error('Issues found:', report.issues);
  } else {
    console.log('✅ All systems operational');
  }
}, 1000);

// Create root and render app
const root = createRoot(document.getElementById('root'));

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  errorMonitoring.captureError({
    type: 'render',
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
}
