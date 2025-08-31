import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * 移动端底部导航栏组件
 * 提供原生应用级别的底部导航体验
 */
const MobileBottomNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  // 导航项配置
  const navItems = [
    { 
      id: 'home', 
      icon: '🏠', 
      label: 'Home', 
      path: '/',
      color: '#3b82f6'
    },
    { 
      id: 'projects', 
      icon: '🦄', 
      label: 'Projects', 
      path: '/projects',
      color: '#8b5cf6'
    },
    { 
      id: 'portfolio', 
      icon: '📊', 
      label: 'Portfolio', 
      path: '/portfolio',
      color: '#10b981'
    },
    { 
      id: 'radar', 
      icon: '🎯', 
      label: 'AI Match', 
      path: '/vc-radar',
      color: '#f59e0b'
    },
    { 
      id: 'profile', 
      icon: '👤', 
      label: 'Profile', 
      path: '/profile',
      color: '#ef4444'
    }
  ];

  // 根据当前路径更新活跃标签
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => 
      item.path === currentPath || 
      (item.path !== '/' && currentPath.startsWith(item.path))
    );
    
    if (activeItem) {
      setActiveTab(activeItem.id);
    }
  }, [location.pathname]);

  // 处理标签点击
  const handleTabClick = (itemId) => {
    setActiveTab(itemId);
    
    // 添加触觉反馈（如果支持）
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <>
      {/* 底部导航栏 */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleTabClick(item.id)}
            style={{
              '--nav-color': item.color,
              color: activeTab === item.id ? item.color : '#6b7280'
            }}
          >
            <span className="mobile-nav-icon">
              {item.icon}
            </span>
            <span className="mobile-nav-label">
              {item.label}
            </span>
            
            {/* 活跃指示器 */}
            {activeTab === item.id && (
              <span 
                className="mobile-nav-indicator"
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  animation: 'mobile-nav-indicator 0.3s ease'
                }}
              />
            )}
          </Link>
        ))}
      </nav>
      
      {/* 底部导航栏占位符，防止内容被遮挡 */}
      <div style={{ height: '70px' }} className="mobile-only" />
      
      <style jsx>{`
        @keyframes mobile-nav-indicator {
          0% {
            transform: translateX(-50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateX(-50%) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 1;
          }
        }
        
        .mobile-nav-item {
          position: relative;
          transition: all 0.2s ease;
        }
        
        .mobile-nav-item:active {
          transform: scale(0.95);
        }
        
        .mobile-nav-item.active .mobile-nav-icon {
          transform: scale(1.1);
        }
        
        .mobile-nav-item.active .mobile-nav-label {
          font-weight: 600;
        }
        
        /* 移动端显示 */
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

/**
 * 移动端标签栏组件
 * 用于页面内的标签切换
 */
export const MobileTabBar = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default' 
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // 更新指示器位置
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1) {
      const width = 100 / tabs.length;
      setIndicatorStyle({
        width: `${width}%`,
        transform: `translateX(${activeIndex * 100}%)`,
        transition: 'transform 0.3s ease'
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className={`mobile-tab-bar mobile-tab-bar-${variant}`}>
      {/* 标签按钮 */}
      <div className="mobile-tab-buttons">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`mobile-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              color: activeTab === tab.id ? tab.color || '#3b82f6' : '#6b7280'
            }}
          >
            {tab.icon && <span className="mobile-tab-icon">{tab.icon}</span>}
            <span className="mobile-tab-text">{tab.label}</span>
            {tab.badge && (
              <span className="mobile-tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      
      {/* 活跃指示器 */}
      <div 
        className="mobile-tab-indicator"
        style={indicatorStyle}
      />
      
      <style jsx>{`
        .mobile-tab-bar {
          position: relative;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .mobile-tab-buttons {
          display: flex;
          position: relative;
        }
        
        .mobile-tab-button {
          flex: 1;
          padding: 12px 8px;
          background: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 60px;
          justify-content: center;
        }
        
        .mobile-tab-button:active {
          background: rgba(0, 0, 0, 0.05);
          transform: scale(0.95);
        }
        
        .mobile-tab-button.active {
          color: var(--mobile-primary);
        }
        
        .mobile-tab-icon {
          font-size: 18px;
        }
        
        .mobile-tab-text {
          font-size: 12px;
          font-weight: 500;
          line-height: 1;
        }
        
        .mobile-tab-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mobile-tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: var(--mobile-primary);
          border-radius: 2px 2px 0 0;
        }
        
        /* 卡片样式变体 */
        .mobile-tab-bar-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 4px;
          border: none;
        }
        
        .mobile-tab-bar-card .mobile-tab-button {
          border-radius: 8px;
          margin: 0 2px;
        }
        
        .mobile-tab-bar-card .mobile-tab-button.active {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-tab-bar-card .mobile-tab-indicator {
          display: none;
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端分段控制器组件
 * 用于二选一或多选一的场景
 */
export const MobileSegmentedControl = ({ 
  options, 
  value, 
  onChange, 
  fullWidth = true 
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const activeIndex = options.findIndex(option => option.value === value);
    if (activeIndex !== -1) {
      const width = 100 / options.length;
      setIndicatorStyle({
        width: `${width}%`,
        transform: `translateX(${activeIndex * 100}%)`,
        transition: 'transform 0.3s ease'
      });
    }
  }, [value, options]);

  return (
    <div 
      className="mobile-segmented-control"
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {/* 背景指示器 */}
      <div 
        className="mobile-segmented-indicator"
        style={indicatorStyle}
      />
      
      {/* 选项按钮 */}
      {options.map(option => (
        <button
          key={option.value}
          className={`mobile-segmented-option ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.icon && <span className="mobile-segmented-icon">{option.icon}</span>}
          <span className="mobile-segmented-text">{option.label}</span>
        </button>
      ))}
      
      <style jsx>{`
        .mobile-segmented-control {
          position: relative;
          display: flex;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 2px;
          overflow: hidden;
        }
        
        .mobile-segmented-indicator {
          position: absolute;
          top: 2px;
          bottom: 2px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        
        .mobile-segmented-option {
          flex: 1;
          padding: 8px 16px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          z-index: 2;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          min-height: 36px;
        }
        
        .mobile-segmented-option:active {
          transform: scale(0.95);
        }
        
        .mobile-segmented-option.active {
          color: #374151;
        }
        
        .mobile-segmented-icon {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default MobileBottomNavigation;

