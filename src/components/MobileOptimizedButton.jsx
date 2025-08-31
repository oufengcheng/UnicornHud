import React, { useState, useCallback } from 'react';

/**
 * 移动端优化按钮组件
 * 提供原生应用级别的触摸体验和反馈
 */
const MobileOptimizedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  className = '',
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);

  // 处理触摸开始
  const handleTouchStart = useCallback((e) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    
    // 创建涟漪效果
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.touches[0].clientX - rect.left - size / 2;
    const y = e.touches[0].clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // 清除涟漪效果
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, [disabled, loading]);

  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  // 处理触摸取消
  const handleTouchCancel = useCallback(() => {
    setIsPressed(false);
  }, []);

  // 处理点击事件
  const handleClick = useCallback((e) => {
    if (disabled || loading) return;
    onClick?.(e);
  }, [onClick, disabled, loading]);

  // 构建CSS类名
  const getButtonClasses = () => {
    const baseClasses = 'mobile-button';
    const variantClasses = `mobile-button-${variant}`;
    const sizeClasses = `mobile-button-${size}`;
    const stateClasses = [
      fullWidth && 'mobile-button-full',
      loading && 'mobile-button-loading',
      disabled && 'mobile-button-disabled',
      isPressed && 'mobile-button-pressed'
    ].filter(Boolean).join(' ');
    
    return [baseClasses, variantClasses, sizeClasses, stateClasses, className]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <button
      className={getButtonClasses()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{
        position: 'relative',
        overflow: 'hidden',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        ...props.style
      }}
      {...props}
    >
      {/* 涟漪效果 */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="mobile-button-ripple"
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(0)',
            animation: 'mobile-ripple 0.6s ease-out',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      {/* 按钮内容 */}
      <span className="mobile-button-content" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        opacity: loading ? 0 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        {icon && <span className="mobile-button-icon">{icon}</span>}
        {children}
      </span>
      
      {/* 加载指示器 */}
      {loading && (
        <span 
          className="mobile-button-loader"
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'mobile-button-spin 1s linear infinite'
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes mobile-ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes mobile-button-spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .mobile-button-disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        
        .mobile-button-pressed {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </button>
  );
};

/**
 * 快速操作按钮组件
 * 用于移动端的快速操作面板
 */
export const MobileQuickActionButton = ({ 
  icon, 
  text, 
  onClick, 
  color = '#3b82f6',
  ...props 
}) => {
  return (
    <MobileOptimizedButton
      variant="outline"
      size="large"
      fullWidth
      onClick={onClick}
      className="mobile-quick-action-button"
      style={{
        flexDirection: 'column',
        height: '80px',
        borderColor: color,
        color: color,
        ...props.style
      }}
      {...props}
    >
      <span style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</span>
      <span style={{ fontSize: '12px', fontWeight: '500' }}>{text}</span>
    </MobileOptimizedButton>
  );
};

/**
 * 浮动操作按钮组件
 * 用于移动端的主要操作
 */
export const MobileFloatingActionButton = ({ 
  icon, 
  onClick, 
  position = 'bottom-right',
  ...props 
}) => {
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 1000,
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    };
    
    switch (position) {
      case 'bottom-right':
        return { ...baseStyles, bottom: '80px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '80px', left: '20px' };
      case 'top-right':
        return { ...baseStyles, top: '20px', right: '20px' };
      case 'top-left':
        return { ...baseStyles, top: '20px', left: '20px' };
      default:
        return { ...baseStyles, bottom: '80px', right: '20px' };
    }
  };

  return (
    <MobileOptimizedButton
      variant="primary"
      onClick={onClick}
      style={getPositionStyles()}
      className="mobile-fab"
      {...props}
    >
      <span style={{ fontSize: '24px' }}>{icon}</span>
    </MobileOptimizedButton>
  );
};

/**
 * 底部操作栏按钮组件
 * 用于移动端的底部操作栏
 */
export const MobileBottomActionButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  ...props 
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px',
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      zIndex: 1000
    }}>
      <MobileOptimizedButton
        variant={variant}
        size="large"
        fullWidth
        onClick={onClick}
        {...props}
      >
        {children}
      </MobileOptimizedButton>
    </div>
  );
};

export default MobileOptimizedButton;

