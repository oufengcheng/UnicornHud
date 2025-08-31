import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Trophy, 
  Radar, 
  Users, 
  Calendar, 
  Building2, 
  Network,
  User,
  LogOut,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from './LoginModal';
import { useTranslation, useRTL } from '../hooks/useTranslation';
import authService from '../services/authService';

const Layout = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  React.useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange(({ type, data }) => {
      if (type === 'login' || type === 'register') {
        setCurrentUser(data);
      } else if (type === 'logout') {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const navigationItems = [
    { path: '/', label: t('navigation.home'), icon: Home },
    { path: '/projects', label: t('navigation.projects'), icon: TrendingUp },
    { path: '/portfolio', label: t('navigation.portfolio'), icon: Briefcase },
    { path: '/market-data', label: t('navigation.marketData'), icon: BarChart3 },
    { path: '/ranking', label: 'Unicorn 100 Ranking', icon: Trophy },
    { path: '/radar', label: 'Unicorn Radar', icon: Radar },
    { path: '/vc-radar', label: t('navigation.vcRadar'), icon: Users },
    { path: '/demo-day', label: t('navigation.demoDay'), icon: Calendar },
    { path: '/founders', label: t('navigation.founders'), icon: Building2 },
    { path: '/referrer', label: 'Referrer Network', icon: Network },
  ];

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-3xl">🦄</div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Unicorn 100
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side - Language Switcher and Auth */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher compact={true} />

              {/* User Authentication */}
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {currentUser.avatar || currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {currentUser.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut size={16} className="mr-1" />
                    {t('navigation.logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleLogin}>
                    {t('navigation.login')}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleLogin}
                  >
                    {t('navigation.register')}
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-purple-100">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🦄</div>
                <span className="text-lg font-bold">Unicorn 100</span>
              </div>
              <p className="text-gray-400 text-sm">
                发现下一个独角兽，连接创新与资本
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-4">
              <h3 className="font-semibold">平台功能</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/projects" className="hover:text-white transition-colors">项目发现</Link></li>
                <li><Link to="/ranking" className="hover:text-white transition-colors">独角兽榜单</Link></li>
                <li><Link to="/radar" className="hover:text-white transition-colors">AI投研引擎</Link></li>
                <li><Link to="/vc-radar" className="hover:text-white transition-colors">双向选择</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-4">
              <h3 className="font-semibold">社区服务</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/demo-day" className="hover:text-white transition-colors">Demo Day</Link></li>
                <li><Link to="/founders" className="hover:text-white transition-colors">创始人社区</Link></li>
                <li><Link to="/referrer" className="hover:text-white transition-colors">推荐网络</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">知识库</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">支持</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Unicorn 100. All rights reserved. | 发现下一个独角兽</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Layout;

