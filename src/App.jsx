import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/mobile.css';

// Import debugging and error handling components
import ErrorBoundary from './components/ErrorBoundary';
import DebugPanel from './components/DebugPanel';
import FallbackUI from './components/FallbackUI';

// Import page components directly (temporarily removing lazy loading)
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import MarketDataPage from './pages/MarketDataPage';
import RankingPage from './pages/RankingPage';
import RadarPage from './pages/RadarPage';
import VCRadarPage from './pages/VCRadarPage';
import DemoDayPage from './pages/DemoDayPage';
import FoundersPage from './pages/FoundersPage';
import ReferrerPage from './pages/ReferrerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import InvestmentPage from './pages/InvestmentPage';
import PortfolioPage from './pages/PortfolioPage';
import TestPage from './pages/TestPage';

// Import mobile components
import MobileBottomNavigation from './components/MobileBottomNavigation';

function App() {
  const [appState, setAppState] = useState({
    isLoading: true,
    hasError: false,
    error: null,
    loadTime: null
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Simulate app initialization
    const initializeApp = async () => {
      try {
        // Check if all required dependencies are available
        if (typeof React === 'undefined') {
          throw new Error('React is not loaded');
        }
        
        if (typeof window === 'undefined') {
          throw new Error('Window object is not available');
        }

        // Check if CSS is loaded
        const testElement = document.createElement('div');
        testElement.className = 'bg-red-500';
        document.body.appendChild(testElement);
        const computedStyle = window.getComputedStyle(testElement);
        const isCSSLoaded = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                           computedStyle.backgroundColor !== 'transparent';
        document.body.removeChild(testElement);
        
        if (!isCSSLoaded) {
          console.warn('CSS may not be fully loaded');
        }

        const loadTime = performance.now() - startTime;
        setAppState({
          isLoading: false,
          hasError: false,
          error: null,
          loadTime
        });

        console.log('🚀 App initialized successfully in', loadTime.toFixed(2), 'ms');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setAppState({
          isLoading: false,
          hasError: true,
          error,
          loadTime: performance.now() - startTime
        });
      }
    };

    initializeApp();
  }, []);

  // Loading component
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-2xl">🦄</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Unicorn 100</h2>
        <p className="text-gray-600">Initializing application...</p>
        <div className="mt-4">
          <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
            <div className="w-1/3 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // If there's an error during initialization, show fallback UI
  if (appState.hasError) {
    return <FallbackUI error={appState.error} />;
  }

  // If still loading, show loading spinner
  if (appState.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="market-data" element={<MarketDataPage />} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="radar" element={<RadarPage />} />
              <Route path="vc-radar" element={<VCRadarPage />} />
              <Route path="demo-day" element={<DemoDayPage />} />
              <Route path="founders" element={<FoundersPage />} />
              <Route path="referrer" element={<ReferrerPage />} />
              <Route path="investment" element={<InvestmentPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
          
          {/* Mobile bottom navigation */}
          <MobileBottomNavigation />
        </div>
      </Router>
      
      {/* Debug panel - only show in development */}
      {import.meta.env.DEV && <DebugPanel />}
    </ErrorBoundary>
  );
}

export default App;
