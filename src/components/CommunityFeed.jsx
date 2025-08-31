import React, { useState, useEffect, useCallback } from 'react';
import communityService from '../services/communityService';

const CommunityFeed = ({ filters = {}, onPostInteraction }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interactionLoading, setInteractionLoading] = useState({});

  useEffect(() => {
    loadPosts();
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await communityService.getCommunityPosts(filters);
      
      if (response.success) {
        setPosts(response.data.posts);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('加载动态失败:', err);
      setError('加载动态失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  const setInteractionLoadingState = useCallback((postId, action, isLoading) => {
    setInteractionLoading(prev => ({
      ...prev,
      [`${postId}_${action}`]: isLoading
    }));
  }, []);

  const isInteractionLoading = useCallback((postId, action) => {
    return interactionLoading[`${postId}_${action}`] || false;
  }, [interactionLoading]);

  const handleLike = async (postId) => {
    try {
      setInteractionLoadingState(postId, 'like', true);
      
      const response = await communityService.likePost(postId);
      
      if (response.success) {
        // 更新本地状态
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: response.data.likes }
              : post
          )
        );
        
        if (onPostInteraction) {
          onPostInteraction('like', postId, response.data);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('点赞失败:', err);
      alert('点赞失败，请重试');
    } finally {
      setInteractionLoadingState(postId, 'like', false);
    }
  };

  const handleComment = async (postId, comment) => {
    if (!comment.trim()) return;
    
    try {
      setInteractionLoadingState(postId, 'comment', true);
      
      const response = await communityService.commentPost(postId, comment);
      
      if (response.success) {
        // 更新本地状态
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, comments: response.data.comments }
              : post
          )
        );
        
        if (onPostInteraction) {
          onPostInteraction('comment', postId, response.data);
        }
        
        return true; // 表示评论成功
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('评论失败:', err);
      alert('评论失败，请重试');
      return false;
    } finally {
      setInteractionLoadingState(postId, 'comment', false);
    }
  };

  const handleShare = async (postId) => {
    try {
      setInteractionLoadingState(postId, 'share', true);
      
      const response = await communityService.sharePost(postId);
      
      if (response.success) {
        // 更新本地状态
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, shares: response.data.shares }
              : post
          )
        );
        
        if (onPostInteraction) {
          onPostInteraction('share', postId, response.data);
        }
        
        alert('分享成功！');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('分享失败:', err);
      alert('分享失败，请重试');
    } finally {
      setInteractionLoadingState(postId, 'share', false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return postTime.toLocaleDateString('zh-CN');
    }
  };

  const getPostTypeLabel = (type) => {
    const typeLabels = {
      milestone: '里程碑',
      tech_share: '技术分享',
      experience_share: '经验分享',
      funding: '融资动态',
      product_update: '产品更新',
      general: '一般动态'
    };
    return typeLabels[type] || '动态';
  };

  const getPostTypeColor = (type) => {
    const typeColors = {
      milestone: '#10b981',
      tech_share: '#3b82f6',
      experience_share: '#8b5cf6',
      funding: '#f59e0b',
      product_update: '#ef4444',
      general: '#6b7280'
    };
    return typeColors[type] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        color: '#6b7280'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '1rem',
            height: '1rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          加载社区动态中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        padding: '1rem',
        margin: '1rem 0',
        textAlign: 'center'
      }}>
        <div style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
          {error}
        </div>
        <button
          onClick={loadPosts}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          重新加载
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          暂无动态
        </div>
        <div>成为第一个分享动态的人吧！</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          isLikeLoading={isInteractionLoading(post.id, 'like')}
          isCommentLoading={isInteractionLoading(post.id, 'comment')}
          isShareLoading={isInteractionLoading(post.id, 'share')}
          formatTimestamp={formatTimestamp}
          getPostTypeLabel={getPostTypeLabel}
          getPostTypeColor={getPostTypeColor}
        />
      ))}
    </div>
  );
};

// 动态卡片组件
const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  isLikeLoading, 
  isCommentLoading, 
  isShareLoading,
  formatTimestamp,
  getPostTypeLabel,
  getPostTypeColor
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    const success = await onComment(post.id, commentText);
    if (success) {
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    }}>
      {/* 作者信息 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '2.5rem',
          marginRight: '1rem'
        }}>
          {post.author.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}>
            <span style={{
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {post.author.name}
            </span>
            {post.author.verified && (
              <span style={{
                color: '#3b82f6',
                fontSize: '0.875rem'
              }}>
                ✓
              </span>
            )}
            <span style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: getPostTypeColor(post.type),
              color: 'white',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {getPostTypeLabel(post.type)}
            </span>
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {post.author.title} • {formatTimestamp(post.timestamp)}
          </div>
        </div>
      </div>

      {/* 动态内容 */}
      <div style={{
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#374151',
        marginBottom: '1rem'
      }}>
        {post.content}
      </div>

      {/* 标签 */}
      {post.tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {post.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                // 这里可以添加标签点击处理逻辑
                console.log('点击标签:', tag);
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 互动按钮 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => onLike(post.id)}
          disabled={isLikeLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isLikeLoading ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            opacity: isLikeLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLikeLoading) {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#ef4444';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLikeLoading) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6b7280';
            }
          }}
        >
          <span>👍</span>
          <span>{post.likes}</span>
          {isLikeLoading && <span>...</span>}
        </button>

        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
          }}
        >
          <span>💬</span>
          <span>{post.comments}</span>
        </button>

        <button
          onClick={() => onShare(post.id)}
          disabled={isShareLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isShareLoading ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            opacity: isShareLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isShareLoading) {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#10b981';
            }
          }}
          onMouseLeave={(e) => {
            if (!isShareLoading) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6b7280';
            }
          }}
        >
          <span>🔄</span>
          <span>{post.shares}</span>
          {isShareLoading && <span>...</span>}
        </button>
      </div>

      {/* 评论输入框 */}
      {showCommentInput && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下您的评论..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                resize: 'vertical',
                minHeight: '80px',
                fontSize: '0.875rem'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <button
                onClick={handleCommentSubmit}
                disabled={isCommentLoading || !commentText.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isCommentLoading || !commentText.trim() ? '#d1d5db' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: isCommentLoading || !commentText.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {isCommentLoading ? '发送中...' : '发送'}
              </button>
              <button
                onClick={() => {
                  setShowCommentInput(false);
                  setCommentText('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;

