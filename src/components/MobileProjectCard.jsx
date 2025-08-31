import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeGesture, useLongPress } from '../hooks/useSwipeGesture';
import { useTranslation } from '../hooks/useTranslation';

/**
 * 移动端优化的项目卡片组件
 * 提供触摸友好的交互体验
 */
const MobileProjectCard = ({
  project,
  onInvest,
  onAnalyze,
  onFavorite,
  onShare,
  className = '',
  ...props
}) => {
  const { t, formatCurrency } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(project.isFavorited || false);
  const [showActions, setShowActions] = useState(false);
  
  const cardRef = useRef(null);

  // 滑动手势处理
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => setShowActions(true),
    onSwipeRight: () => setShowActions(false),
    minSwipeDistance: 50
  });

  // 长按手势处理
  const longPressHandlers = useLongPress(
    () => {
      setShowActions(true);
      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    { threshold: 500 }
  );

  // 处理收藏
  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(project, !isFavorited);
    
    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // 处理投资
  const handleInvest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onInvest?.(project);
    setShowActions(false);
  };

  // 处理AI分析
  const handleAnalyze = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAnalyze?.(project);
    setShowActions(false);
  };

  // 处理分享
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: project.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      onShare?.(project);
    }
    setShowActions(false);
  };

  // 获取独角兽评分颜色
  const getScoreColor = (score) => {
    if (score >= 9) return '#10b981'; // 绿色
    if (score >= 7) return '#f59e0b'; // 黄色
    if (score >= 5) return '#ef4444'; // 红色
    return '#6b7280'; // 灰色
  };

  // 获取融资阶段颜色
  const getStageColor = (stage) => {
    const colors = {
      '种子轮': '#8b5cf6',
      'A轮': '#3b82f6',
      'B轮': '#10b981',
      'C轮': '#f59e0b',
      'D轮': '#ef4444',
      '上市': '#6366f1'
    };
    return colors[stage] || '#6b7280';
  };

  return (
    <div 
      className={`mobile-project-card ${showActions ? 'actions-visible' : ''} ${className}`}
      ref={cardRef}
      {...swipeHandlers}
      {...longPressHandlers}
      {...props}
    >
      {/* 主卡片内容 */}
      <Link 
        to={`/projects/${project.id}`}
        className="card-main-content"
        onClick={() => setShowActions(false)}
      >
        {/* 卡片头部 */}
        <div className="card-header">
          <div className="project-logo">
            {project.logo || '🦄'}
          </div>
          <div className="project-info">
            <h3 className="project-name">{project.name}</h3>
            <div className="project-meta">
              <span className="project-industry">{project.industry}</span>
              <span 
                className="project-stage"
                style={{ color: getStageColor(project.stage) }}
              >
                {project.stage}
              </span>
            </div>
          </div>
          <button 
            className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavorite}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>

        {/* 项目描述 */}
        <div className="project-description">
          <p className={`description-text ${isExpanded ? 'expanded' : ''}`}>
            {project.description}
          </p>
          {project.description && project.description.length > 100 && (
            <button 
              className="expand-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? t('common.showLess') : t('common.showMore')}
            </button>
          )}
        </div>

        {/* 项目指标 */}
        <div className="project-metrics">
          <div className="metric-item">
            <span className="metric-label">{t('projects.valuation')}</span>
            <span className="metric-value">
              {formatCurrency(project.valuation)}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">{t('projects.unicornScore')}</span>
            <span 
              className="metric-value score"
              style={{ color: getScoreColor(project.unicornScore) }}
            >
              {project.unicornScore}/10
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">{t('projects.founded')}</span>
            <span className="metric-value">
              {project.foundedYear || 'N/A'}
            </span>
          </div>
        </div>

        {/* 项目标签 */}
        {project.tags && project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="project-tag">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="project-tag more">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* 操作按钮区域 */}
      <div className="card-actions">
        <button 
          className="action-button invest"
          onClick={handleInvest}
        >
          <span className="action-icon">💰</span>
          <span className="action-text">{t('projects.invest')}</span>
        </button>
        <button 
          className="action-button analyze"
          onClick={handleAnalyze}
        >
          <span className="action-icon">🤖</span>
          <span className="action-text">{t('projects.analyze')}</span>
        </button>
        <button 
          className="action-button share"
          onClick={handleShare}
        >
          <span className="action-icon">📤</span>
          <span className="action-text">{t('common.share')}</span>
        </button>
      </div>

      {/* 滑动提示 */}
      {!showActions && (
        <div className="swipe-hint">
          <span>← {t('mobile.swipeForActions')}</span>
        </div>
      )}

      <style jsx>{`
        .mobile-project-card {
          position: relative;
          background: white;
          border-radius: 16px;
          margin: 12px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .mobile-project-card:active {
          transform: scale(0.98);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }

        .mobile-project-card.actions-visible {
          transform: translateX(-120px);
        }

        .card-main-content {
          display: block;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          position: relative;
          z-index: 1;
          background: white;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .project-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .project-info {
          flex: 1;
          min-width: 0;
        }

        .project-name {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .project-meta {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .project-industry {
          font-size: 14px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .project-stage {
          font-size: 14px;
          font-weight: 600;
        }

        .favorite-button {
          width: 44px;
          height: 44px;
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .favorite-button:active {
          transform: scale(1.2);
          background: rgba(239, 68, 68, 0.1);
        }

        .favorite-button.favorited {
          animation: favorite-bounce 0.6s ease;
        }

        @keyframes favorite-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .project-description {
          margin-bottom: 16px;
        }

        .description-text {
          font-size: 15px;
          line-height: 1.5;
          color: #374151;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .description-text.expanded {
          -webkit-line-clamp: unset;
          display: block;
        }

        .expand-button {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 0;
          margin-top: 4px;
        }

        .project-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .metric-item {
          text-align: center;
        }

        .metric-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .metric-value {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
        }

        .metric-value.score {
          font-size: 18px;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .project-tag {
          font-size: 12px;
          padding: 4px 8px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 12px;
          font-weight: 500;
        }

        .project-tag.more {
          background: #f3f4f6;
          color: #6b7280;
        }

        .card-actions {
          position: absolute;
          top: 0;
          right: -120px;
          width: 120px;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          z-index: 0;
        }

        .action-button {
          flex: 1;
          border: none;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid #e5e7eb;
        }

        .action-button:last-child {
          border-bottom: none;
        }

        .action-button:active {
          background: rgba(0, 0, 0, 0.05);
          transform: scale(0.95);
        }

        .action-button.invest {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .action-button.analyze {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .action-button.share {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }

        .action-icon {
          font-size: 20px;
        }

        .action-text {
          font-size: 11px;
          font-weight: 600;
        }

        .swipe-hint {
          position: absolute;
          bottom: 8px;
          right: 16px;
          font-size: 12px;
          color: #9ca3af;
          opacity: 0.7;
          animation: swipe-hint-pulse 2s infinite;
        }

        @keyframes swipe-hint-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }

        .mobile-project-card.actions-visible .swipe-hint {
          display: none;
        }

        /* 响应式适配 */
        @media (max-width: 480px) {
          .card-main-content {
            padding: 16px;
          }

          .project-metrics {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 12px;
          }

          .project-name {
            font-size: 16px;
          }

          .metric-value {
            font-size: 14px;
          }
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .mobile-project-card {
            background: #1f2937;
            border-color: #374151;
          }

          .card-main-content {
            background: #1f2937;
          }

          .project-name {
            color: #f9fafb;
          }

          .description-text {
            color: #d1d5db;
          }

          .project-metrics {
            background: #374151;
          }

          .metric-value {
            color: #f9fafb;
          }

          .card-actions {
            background: #374151;
          }

          .action-button {
            border-color: #4b5563;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端项目列表组件
 * 专门用于移动端的项目展示
 */
export const MobileProjectList = ({
  projects = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  onInvest,
  onAnalyze,
  onFavorite,
  onShare,
  className = '',
  ...props
}) => {
  const { t } = useTranslation();

  if (loading && projects.length === 0) {
    return (
      <div className="mobile-project-list-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="mobile-project-list-empty">
        <div className="empty-icon">🦄</div>
        <h3>{t('projects.noProjects')}</h3>
        <p>{t('projects.noProjectsDescription')}</p>
      </div>
    );
  }

  return (
    <div className={`mobile-project-list ${className}`} {...props}>
      {projects.map((project, index) => (
        <MobileProjectCard
          key={project.id || index}
          project={project}
          onInvest={onInvest}
          onAnalyze={onAnalyze}
          onFavorite={onFavorite}
          onShare={onShare}
        />
      ))}
      
      {hasMore && (
        <div className="load-more-container">
          <button 
            className="load-more-button"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner small"></div>
                {t('common.loading')}
              </>
            ) : (
              t('common.loadMore')
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        .mobile-project-list {
          padding: 0 16px;
        }

        .mobile-project-list-loading,
        .mobile-project-list-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .loading-spinner.small {
          width: 20px;
          height: 20px;
          border-width: 2px;
          margin-bottom: 0;
          margin-right: 8px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .mobile-project-list-empty h3 {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .mobile-project-list-empty p {
          font-size: 16px;
          margin: 0;
          max-width: 300px;
        }

        .load-more-container {
          padding: 20px 0;
          text-align: center;
        }

        .load-more-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          min-width: 120px;
          margin: 0 auto;
        }

        .load-more-button:active {
          transform: scale(0.95);
        }

        .load-more-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MobileProjectCard;

