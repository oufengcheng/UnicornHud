import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLongPress } from '../hooks/useSwipeGesture';

/**
 * 社区动态发布组件
 * 支持文本、图片、链接等多种内容类型
 */
const CommunityPost = ({
  post,
  currentUser,
  onLike,
  onComment,
  onShare,
  onReport,
  onFollow,
  className = '',
  ...props
}) => {
  const { t, formatRelativeTime } = useTranslation();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const postRef = useRef(null);

  // 长按显示更多操作
  const longPressHandlers = useLongPress(
    () => {
      setShowActions(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    { threshold: 500 }
  );

  // 处理点赞
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    
    // 触觉反馈
    if (navigator.vibrate && newIsLiked) {
      navigator.vibrate(30);
    }
    
    try {
      await onLike?.(post.id, newIsLiked);
    } catch (error) {
      // 回滚状态
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
    }
  };

  // 处理评论
  const handleComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(!showComments);
    onComment?.(post.id);
  };

  // 处理分享
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.author.name}的动态`,
          text: post.content,
          url: `${window.location.origin}/community/post/${post.id}`
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      onShare?.(post);
    }
  };

  // 处理关注
  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await onFollow?.(post.author.id);
  };

  // 处理举报
  const handleReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onReport?.(post.id);
    setShowActions(false);
  };

  // 获取用户角色标识
  const getUserRoleBadge = (user) => {
    if (user.role === 'investor') return '💰';
    if (user.role === 'founder') return '🚀';
    if (user.role === 'expert') return '🎓';
    if (user.role === 'verified') return '✅';
    return '';
  };

  // 渲染内容类型
  const renderContent = () => {
    const { content, type, media, link } = post;
    
    return (
      <div className="post-content">
        {/* 文本内容 */}
        {content && (
          <div className="post-text">
            <p className={`text-content ${isExpanded ? 'expanded' : ''}`}>
              {content}
            </p>
            {content.length > 200 && (
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
        )}

        {/* 图片内容 */}
        {media && media.length > 0 && (
          <div className={`post-media ${media.length > 1 ? 'multiple' : 'single'}`}>
            {media.slice(0, 4).map((item, index) => (
              <div key={index} className="media-item">
                <img 
                  src={item.url} 
                  alt={item.alt || `图片 ${index + 1}`}
                  loading="lazy"
                />
                {media.length > 4 && index === 3 && (
                  <div className="media-overlay">
                    +{media.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 链接预览 */}
        {link && (
          <div className="post-link-preview">
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {link.image && (
                <div className="link-image">
                  <img src={link.image} alt={link.title} />
                </div>
              )}
              <div className="link-content">
                <h4 className="link-title">{link.title}</h4>
                <p className="link-description">{link.description}</p>
                <span className="link-domain">{link.domain}</span>
              </div>
            </a>
          </div>
        )}

        {/* 投资项目引用 */}
        {post.project && (
          <div className="post-project-ref">
            <Link to={`/projects/${post.project.id}`} onClick={(e) => e.stopPropagation()}>
              <div className="project-info">
                <div className="project-logo">
                  {post.project.logo || '🦄'}
                </div>
                <div className="project-details">
                  <h4 className="project-name">{post.project.name}</h4>
                  <p className="project-industry">{post.project.industry}</p>
                  <span className="project-valuation">
                    {t('projects.valuation')}: {post.project.valuation}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <article 
      className={`community-post ${className}`}
      ref={postRef}
      {...longPressHandlers}
      {...props}
    >
      {/* 用户信息头部 */}
      <header className="post-header">
        <Link 
          to={`/profile/${post.author.id}`}
          className="author-info"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="author-avatar">
            <img 
              src={post.author.avatar || '/default-avatar.png'} 
              alt={post.author.name}
            />
            <span className="role-badge">
              {getUserRoleBadge(post.author)}
            </span>
          </div>
          <div className="author-details">
            <h3 className="author-name">
              {post.author.name}
              {post.author.verified && <span className="verified">✅</span>}
            </h3>
            <div className="post-meta">
              <span className="author-title">{post.author.title}</span>
              <span className="post-time">
                {formatRelativeTime(new Date(post.createdAt))}
              </span>
            </div>
          </div>
        </Link>

        <div className="post-actions-header">
          {currentUser?.id !== post.author.id && (
            <button 
              className={`follow-button ${post.author.isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {post.author.isFollowing ? t('community.following') : t('community.follow')}
            </button>
          )}
          <button 
            className="more-button"
            onClick={() => setShowActions(!showActions)}
          >
            ⋯
          </button>
        </div>
      </header>

      {/* 动态内容 */}
      {renderContent()}

      {/* 互动统计 */}
      <div className="post-stats">
        <div className="stats-left">
          {likeCount > 0 && (
            <span className="like-count">
              ❤️ {likeCount} {t('community.likes')}
            </span>
          )}
          {post.commentCount > 0 && (
            <span className="comment-count">
              💬 {post.commentCount} {t('community.comments')}
            </span>
          )}
          {post.shareCount > 0 && (
            <span className="share-count">
              📤 {post.shareCount} {t('community.shares')}
            </span>
          )}
        </div>
        <div className="stats-right">
          {post.viewCount > 0 && (
            <span className="view-count">
              👁️ {post.viewCount} {t('community.views')}
            </span>
          )}
        </div>
      </div>

      {/* 互动按钮 */}
      <footer className="post-footer">
        <button 
          className={`action-button like ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="action-text">{t('community.like')}</span>
        </button>
        
        <button 
          className="action-button comment"
          onClick={handleComment}
        >
          <span className="action-icon">💬</span>
          <span className="action-text">{t('community.comment')}</span>
        </button>
        
        <button 
          className="action-button share"
          onClick={handleShare}
        >
          <span className="action-icon">📤</span>
          <span className="action-text">{t('community.share')}</span>
        </button>
      </footer>

      {/* 更多操作菜单 */}
      {showActions && (
        <div className="post-actions-menu">
          <div className="actions-backdrop" onClick={() => setShowActions(false)} />
          <div className="actions-content">
            {currentUser?.id === post.author.id ? (
              <>
                <button className="action-item edit">
                  <span className="action-icon">✏️</span>
                  {t('community.edit')}
                </button>
                <button className="action-item delete">
                  <span className="action-icon">🗑️</span>
                  {t('community.delete')}
                </button>
              </>
            ) : (
              <>
                <button className="action-item report" onClick={handleReport}>
                  <span className="action-icon">🚨</span>
                  {t('community.report')}
                </button>
                <button className="action-item hide">
                  <span className="action-icon">👁️‍🗨️</span>
                  {t('community.hide')}
                </button>
              </>
            )}
            <button className="action-item cancel" onClick={() => setShowActions(false)}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .community-post {
          background: white;
          border-radius: 12px;
          margin: 16px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .community-post:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 20px 0;
        }

        .author-info {
          display: flex;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          flex: 1;
        }

        .author-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .role-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .author-details {
          flex: 1;
          min-width: 0;
        }

        .author-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .verified {
          font-size: 14px;
        }

        .post-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 14px;
          color: #6b7280;
        }

        .author-title {
          font-weight: 500;
        }

        .post-time::before {
          content: '•';
          margin-right: 8px;
        }

        .post-actions-header {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .follow-button {
          padding: 6px 16px;
          border: 1px solid #3b82f6;
          background: transparent;
          color: #3b82f6;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .follow-button.following {
          background: #3b82f6;
          color: white;
        }

        .follow-button:active {
          transform: scale(0.95);
        }

        .more-button {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #6b7280;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .more-button:hover {
          background: #f3f4f6;
        }

        .post-content {
          padding: 16px 20px;
        }

        .post-text {
          margin-bottom: 12px;
        }

        .text-content {
          font-size: 15px;
          line-height: 1.6;
          color: #374151;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .text-content.expanded {
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
          margin-top: 8px;
        }

        .post-media {
          margin: 12px 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .post-media.single {
          max-height: 400px;
        }

        .post-media.multiple {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          max-height: 300px;
        }

        .media-item {
          position: relative;
          overflow: hidden;
        }

        .media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
        }

        .post-link-preview {
          margin: 12px 0;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .post-link-preview a {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        .post-link-preview a:hover {
          background: #f8fafc;
        }

        .link-image {
          height: 200px;
          overflow: hidden;
        }

        .link-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .link-content {
          padding: 16px;
        }

        .link-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .link-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .link-domain {
          font-size: 12px;
          color: #9ca3af;
          text-transform: uppercase;
          font-weight: 500;
        }

        .post-project-ref {
          margin: 12px 0;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .post-project-ref a {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .post-project-ref a:hover {
          background: #f8fafc;
        }

        .project-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .project-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .project-details {
          flex: 1;
        }

        .project-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .project-industry {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .project-valuation {
          font-size: 14px;
          color: #10b981;
          font-weight: 600;
        }

        .post-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px 12px;
          font-size: 14px;
          color: #6b7280;
        }

        .stats-left,
        .stats-right {
          display: flex;
          gap: 16px;
        }

        .post-footer {
          display: flex;
          border-top: 1px solid #e5e7eb;
          padding: 0;
        }

        .action-button {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s ease;
          border-right: 1px solid #e5e7eb;
        }

        .action-button:last-child {
          border-right: none;
        }

        .action-button:hover {
          background: #f8fafc;
        }

        .action-button:active {
          transform: scale(0.95);
        }

        .action-button.like.liked {
          color: #ef4444;
          animation: like-bounce 0.6s ease;
        }

        @keyframes like-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .action-icon {
          font-size: 16px;
        }

        .post-actions-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: flex-end;
        }

        .actions-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .actions-content {
          position: relative;
          width: 100%;
          background: white;
          border-radius: 16px 16px 0 0;
          padding: 20px;
          animation: slide-up 0.3s ease;
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .action-item {
          width: 100%;
          padding: 16px;
          border: none;
          background: transparent;
          text-align: left;
          font-size: 16px;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .action-item:hover {
          background: #f3f4f6;
        }

        .action-item:active {
          transform: scale(0.98);
        }

        .action-item.delete {
          color: #ef4444;
        }

        .action-item.report {
          color: #f59e0b;
        }

        .action-item.cancel {
          background: #f3f4f6;
          font-weight: 600;
          margin-top: 12px;
          justify-content: center;
        }

        /* 响应式适配 */
        @media (max-width: 480px) {
          .community-post {
            margin: 12px 0;
            border-radius: 8px;
          }

          .post-header {
            padding: 12px 16px 0;
          }

          .post-content {
            padding: 12px 16px;
          }

          .post-stats {
            padding: 0 16px 8px;
          }

          .author-name {
            font-size: 15px;
          }

          .text-content {
            font-size: 14px;
          }
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .community-post {
            background: #1f2937;
            border-color: #374151;
          }

          .author-name {
            color: #f9fafb;
          }

          .text-content {
            color: #d1d5db;
          }

          .post-footer {
            border-color: #374151;
          }

          .action-button {
            color: #9ca3af;
          }

          .action-button:hover {
            background: #374151;
          }

          .actions-content {
            background: #1f2937;
          }

          .action-item {
            color: #d1d5db;
          }

          .action-item:hover {
            background: #374151;
          }
        }
      `}</style>
    </article>
  );
};

/**
 * 社区动态列表组件
 * 用于展示多个社区动态
 */
export const CommunityPostList = ({
  posts = [],
  currentUser,
  loading = false,
  hasMore = false,
  onLoadMore,
  onLike,
  onComment,
  onShare,
  onReport,
  onFollow,
  className = '',
  ...props
}) => {
  const { t } = useTranslation();

  if (loading && posts.length === 0) {
    return (
      <div className="community-post-list-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="community-post-list-empty">
        <div className="empty-icon">💬</div>
        <h3>{t('community.noPosts')}</h3>
        <p>{t('community.noPostsDescription')}</p>
      </div>
    );
  }

  return (
    <div className={`community-post-list ${className}`} {...props}>
      {posts.map((post, index) => (
        <CommunityPost
          key={post.id || index}
          post={post}
          currentUser={currentUser}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onReport={onReport}
          onFollow={onFollow}
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
        .community-post-list {
          padding: 0 16px;
        }

        .community-post-list-loading,
        .community-post-list-empty {
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

        .community-post-list-empty h3 {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .community-post-list-empty p {
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

export default CommunityPost;

