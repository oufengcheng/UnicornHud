import React, { useState, useCallback } from 'react';

/**
 * 安全按钮组件
 * 提供完善的错误处理、加载状态和用户反馈
 * 防止按钮操作导致的JavaScript错误
 */
const SafeButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  style = {},
  timeout = 5000,
  retryable = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClick = useCallback(async (event) => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // 设置超时保护
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('操作超时')), timeout);
      });

      // 执行点击处理函数
      const clickPromise = onClick ? onClick(event) : Promise.resolve();
      
      await Promise.race([clickPromise, timeoutPromise]);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
    } catch (err) {
      console.error('SafeButton错误:', err);
      setError(err.message || '操作失败');
      
      // 自动清除错误状态
      setTimeout(() => setError(null), 3000);
      
      // 错误报告
      reportError(err, event);
      
    } finally {
      setIsLoading(false);
    }
  }, [onClick, disabled, isLoading, timeout]);

  const reportError = (error, event) => {
    try {
      const errorReport = {
        component: 'SafeButton',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        buttonText: typeof children === 'string' ? children : 'Unknown',
        variant,
        size,
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.error('SafeButton错误报告:', errorReport);
      
      // 发送到错误监控服务
      if (import.meta.env.PROD) {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport)
        }).catch(console.error);
      }
    } catch (reportErr) {
      console.error('错误报告失败:', reportErr);
    }
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
      },
      secondary: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
      },
      success: {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
      },
      danger: {
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(250, 112, 154, 0.3)'
      },
      outline: {
        background: 'transparent',
        color: '#667eea',
        border: '2px solid #667eea',
        boxShadow: 'none'
      },
      ghost: {
        background: 'transparent',
        color: '#6b7280',
        border: 'none',
        boxShadow: 'none'
      }
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '6px',
        minHeight: '36px'
      },
      medium: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px',
        minHeight: '44px'
      },
      large: {
        padding: '16px 32px',
        fontSize: '18px',
        borderRadius: '10px',
        minHeight: '52px'
      }
    };
    return sizes[size] || sizes.medium;
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.6 : 1,
    transform: isLoading ? 'scale(0.98)' : 'scale(1)',
    ...style
  };

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <style jsx>{`
        .loading-spinner {
          display: inline-flex;
          align-items: center;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const SuccessIcon = () => (
    <div className="success-icon">
      ✓
      <style jsx>{`
        .success-icon {
          color: #10b981;
          font-weight: bold;
          font-size: 18px;
        }
      `}</style>
    </div>
  );

  const ErrorIcon = () => (
    <div className="error-icon">
      ⚠
      <style jsx>{`
        .error-icon {
          color: #ef4444;
          font-weight: bold;
          font-size: 16px;
        }
      `}</style>
    </div>
  );

  return (
    <div className="safe-button-container">
      <button
        {...props}
        className={`safe-button ${className}`}
        style={buttonStyles}
        onClick={handleClick}
        disabled={disabled || isLoading}
      >
        {isLoading && <LoadingSpinner />}
        {success && <SuccessIcon />}
        {error && <ErrorIcon />}
        {!isLoading && !success && !error && icon}
        
        <span className="button-text">
          {isLoading ? '处理中...' : 
           success ? '成功!' : 
           error ? (retryable ? '点击重试' : '操作失败') : 
           children}
        </span>
      </button>
      
      {error && (
        <div className="error-tooltip">
          {error}
        </div>
      )}
      
      <style jsx>{`
        .safe-button-container {
          position: relative;
          display: inline-block;
        }
        
        .safe-button {
          border: none;
          outline: none;
          text-decoration: none;
          user-select: none;
          white-space: nowrap;
        }
        
        .safe-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .safe-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .safe-button:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }
        
        .button-text {
          transition: all 0.2s ease;
        }
        
        .error-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #ef4444;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          margin-top: 8px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .error-tooltip::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 4px solid #ef4444;
        }
        
        @media (max-width: 640px) {
          .safe-button {
            min-width: 120px;
          }
          
          .error-tooltip {
            font-size: 11px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default SafeButton;

