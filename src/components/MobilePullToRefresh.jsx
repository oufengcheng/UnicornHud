import React, { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 移动端下拉刷新组件
 * 提供原生应用级别的下拉刷新体验
 */
const MobilePullToRefresh = ({
  children,
  onRefresh,
  refreshing = false,
  pullDistance = 80,
  triggerDistance = 60,
  refreshText = '下拉刷新',
  releaseText = '释放刷新',
  refreshingText = '刷新中...',
  completeText = '刷新完成',
  disabled = false,
  className = '',
  ...props
}) => {
  const [pullState, setPullState] = useState('idle'); // idle, pulling, triggered, refreshing, complete
  const [pullDistance_, setPullDistance] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef(null);

  // 检查是否在顶部
  const checkIsAtTop = useCallback(() => {
    if (contentRef.current) {
      const scrollTop = contentRef.current.scrollTop;
      setIsAtTop(scrollTop <= 0);
    }
  }, []);

  // 处理触摸开始
  const handleTouchStart = useCallback((e) => {
    if (disabled || refreshing) return;
    
    checkIsAtTop();
    if (isAtTop) {
      setTouchStartY(e.touches[0].clientY);
      setPullState('idle');
    }
  }, [disabled, refreshing, isAtTop, checkIsAtTop]);

  // 处理触摸移动
  const handleTouchMove = useCallback((e) => {
    if (disabled || refreshing || !isAtTop) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;
    
    if (deltaY > 0) {
      e.preventDefault();
      
      // 计算拉动距离，添加阻尼效果
      const distance = Math.min(deltaY * 0.5, pullDistance);
      setPullDistance(distance);
      
      if (distance >= triggerDistance) {
        setPullState('triggered');
      } else {
        setPullState('pulling');
      }
    }
  }, [disabled, refreshing, isAtTop, touchStartY, pullDistance, triggerDistance]);

  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    if (disabled || refreshing || !isAtTop) return;
    
    if (pullState === 'triggered') {
      setPullState('refreshing');
      onRefresh?.();
    } else {
      // 回弹动画
      animationRef.current = requestAnimationFrame(() => {
        setPullDistance(0);
        setPullState('idle');
      });
    }
  }, [disabled, refreshing, isAtTop, pullState, onRefresh]);

  // 处理刷新状态变化
  useEffect(() => {
    if (refreshing) {
      setPullState('refreshing');
      setPullDistance(triggerDistance);
    } else if (pullState === 'refreshing') {
      setPullState('complete');
      
      // 显示完成状态后回弹
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(() => {
          setPullDistance(0);
          setPullState('idle');
        });
      }, 500);
    }
  }, [refreshing, pullState, triggerDistance]);

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 获取刷新指示器文本
  const getRefreshText = () => {
    switch (pullState) {
      case 'pulling':
        return refreshText;
      case 'triggered':
        return releaseText;
      case 'refreshing':
        return refreshingText;
      case 'complete':
        return completeText;
      default:
        return refreshText;
    }
  };

  // 获取刷新指示器图标
  const getRefreshIcon = () => {
    switch (pullState) {
      case 'pulling':
        return '↓';
      case 'triggered':
        return '↑';
      case 'refreshing':
        return '⟳';
      case 'complete':
        return '✓';
      default:
        return '↓';
    }
  };

  // 计算刷新指示器的透明度和旋转角度
  const getIndicatorStyle = () => {
    const opacity = Math.min(pullDistance_ / triggerDistance, 1);
    const rotation = pullState === 'triggered' ? 180 : 0;
    const scale = pullState === 'refreshing' ? 1.2 : 1;
    
    return {
      opacity,
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: pullState === 'refreshing' ? 'transform 0.2s ease' : 'transform 0.3s ease'
    };
  };

  return (
    <div 
      className={`mobile-pull-to-refresh ${className}`}
      ref={containerRef}
      {...props}
    >
      {/* 刷新指示器 */}
      <div 
        className="refresh-indicator"
        style={{
          height: `${pullDistance_}px`,
          transition: pullState === 'idle' ? 'height 0.3s ease' : 'none'
        }}
      >
        <div className="refresh-content" style={getIndicatorStyle()}>
          <span 
            className={`refresh-icon ${pullState === 'refreshing' ? 'spinning' : ''}`}
          >
            {getRefreshIcon()}
          </span>
          <span className="refresh-text">
            {getRefreshText()}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        className="refresh-content-wrapper"
        ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={checkIsAtTop}
        style={{
          transform: `translateY(${pullDistance_}px)`,
          transition: pullState === 'idle' || pullState === 'complete' ? 'transform 0.3s ease' : 'none'
        }}
      >
        {children}
      </div>

      <style jsx>{`
        .mobile-pull-to-refresh {
          position: relative;
          height: 100%;
          overflow: hidden;
        }

        .refresh-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(to bottom, #f8fafc, #ffffff);
          z-index: 10;
          overflow: hidden;
        }

        .refresh-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px;
          color: #6b7280;
          font-size: 14px;
        }

        .refresh-icon {
          font-size: 20px;
          font-weight: bold;
          transition: transform 0.3s ease;
        }

        .refresh-icon.spinning {
          animation: refresh-spin 1s linear infinite;
        }

        .refresh-text {
          font-weight: 500;
          white-space: nowrap;
        }

        .refresh-content-wrapper {
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          will-change: transform;
        }

        @keyframes refresh-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* 隐藏滚动条 */
        .refresh-content-wrapper::-webkit-scrollbar {
          display: none;
        }

        .refresh-content-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

/**
 * 带下拉刷新的列表组件
 * 专门用于列表数据的下拉刷新
 */
export const MobileRefreshableList = ({
  items = [],
  renderItem,
  onRefresh,
  refreshing = false,
  loading = false,
  hasMore = false,
  onLoadMore,
  emptyText = '暂无数据',
  loadingText = '加载中...',
  noMoreText = '没有更多了',
  className = '',
  ...props
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef(null);

  // 处理滚动到底部
  const handleScroll = useCallback((e) => {
    if (!hasMore || loading || isLoadingMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const threshold = 100; // 距离底部100px时开始加载
    
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setIsLoadingMore(true);
      onLoadMore?.().finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [hasMore, loading, isLoadingMore, onLoadMore]);

  // 渲染列表项
  const renderListItems = () => {
    if (loading && items.length === 0) {
      return (
        <div className="list-loading">
          <div className="loading-spinner"></div>
          <span>{loadingText}</span>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="list-empty">
          <span>📭</span>
          <p>{emptyText}</p>
        </div>
      );
    }

    return (
      <>
        {items.map((item, index) => (
          <div key={index} className="list-item">
            {renderItem ? renderItem(item, index) : (
              <div className="default-item">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </div>
            )}
          </div>
        ))}
        
        {/* 加载更多指示器 */}
        {(hasMore || isLoadingMore) && (
          <div className="load-more-indicator">
            {isLoadingMore ? (
              <>
                <div className="loading-spinner small"></div>
                <span>加载中...</span>
              </>
            ) : (
              <span>{noMoreText}</span>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <MobilePullToRefresh
      onRefresh={onRefresh}
      refreshing={refreshing}
      className={`mobile-refreshable-list ${className}`}
      {...props}
    >
      <div 
        className="list-container"
        ref={listRef}
        onScroll={handleScroll}
      >
        {renderListItems()}
      </div>

      <style jsx>{`
        .mobile-refreshable-list {
          height: 100%;
        }

        .list-container {
          padding: 16px;
          min-height: 100%;
        }

        .list-item {
          margin-bottom: 12px;
        }

        .list-item:last-child {
          margin-bottom: 0;
        }

        .default-item {
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .list-loading,
        .list-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #6b7280;
          text-align: center;
        }

        .list-empty span {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .list-empty p {
          font-size: 16px;
          margin: 0;
        }

        .load-more-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-spinner.small {
          width: 16px;
          height: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </MobilePullToRefresh>
  );
};

/**
 * 带下拉刷新的页面容器
 * 用于整个页面的下拉刷新功能
 */
export const MobileRefreshablePage = ({
  children,
  onRefresh,
  refreshing = false,
  title,
  showHeader = true,
  headerActions,
  className = '',
  ...props
}) => {
  return (
    <div className={`mobile-refreshable-page ${className}`}>
      {showHeader && (
        <div className="page-header">
          <div className="page-title">
            <h1>{title}</h1>
          </div>
          {headerActions && (
            <div className="page-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="page-content">
        <MobilePullToRefresh
          onRefresh={onRefresh}
          refreshing={refreshing}
          {...props}
        >
          {children}
        </MobilePullToRefresh>
      </div>

      <style jsx>{`
        .mobile-refreshable-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .page-header {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .page-title h1 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .page-actions {
          display: flex;
          gap: 8px;
        }

        .page-content {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MobilePullToRefresh;

