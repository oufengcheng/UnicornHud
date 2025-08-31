import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import CommunityFeed from '../components/CommunityFeed';
import communityService from '../services/communityService';
import authService from '../services/authService';

const FoundersPage = () => {
  const [activeTab, setActiveTab] = useState('community');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // 社区相关状态
  const [feedFilters, setFeedFilters] = useState({ type: 'all', tags: [] });
  const [showPostModal, setShowPostModal] = useState(false);
  const [trendingTags, setTrendingTags] = useState([]);
  
  // 连接相关状态
  const [connections, setConnections] = useState([]);
  const [recommendedFounders, setRecommendedFounders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // 通知相关状态
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    initializePage();
    
    // 监听认证状态变化
    const unsubscribe = authService.onAuthStateChange((authEvent) => {
      if (authEvent.type === 'login') {
        setCurrentUser(authEvent.data);
        loadUserData(authEvent.data);
      } else if (authEvent.type === 'logout') {
        setCurrentUser(null);
        resetUserData();
      }
    });

    return unsubscribe;
  }, []);

  const initializePage = async () => {
    try {
      setLoading(true);
      
      // 获取当前用户
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        await loadUserData(user);
      }
      
      // 加载公共数据
      await loadPublicData();
      
    } catch (err) {
      console.error('初始化页面失败:', err);
      setError('页面加载失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (user) => {
    try {
      // 并行加载用户相关数据
      const [connectionsRes, recommendationsRes, notificationsRes] = await Promise.all([
        communityService.getUserConnections(user.id),
        communityService.getRecommendedFounders(user.id),
        communityService.getNotifications()
      ]);

      if (connectionsRes.success) {
        setConnections(connectionsRes.data.connections);
      }

      if (recommendationsRes.success) {
        setRecommendedFounders(recommendationsRes.data.recommendations);
      }

      if (notificationsRes.success) {
        setNotifications(notificationsRes.data.notifications);
        setUnreadCount(notificationsRes.data.unreadCount);
      }
    } catch (err) {
      console.error('加载用户数据失败:', err);
    }
  };

  const loadPublicData = async () => {
    try {
      const tagsRes = await communityService.getTrendingTags();
      if (tagsRes.success) {
        setTrendingTags(tagsRes.data);
      }
    } catch (err) {
      console.error('加载公共数据失败:', err);
    }
  };

  const resetUserData = () => {
    setConnections([]);
    setRecommendedFounders([]);
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await communityService.searchFounders(searchQuery);
      
      if (response.success) {
        setSearchResults(response.data.founders);
        setActiveTab('search');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('搜索失败:', err);
      alert('搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (targetUserId) => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    try {
      const response = await communityService.sendConnectionRequest(targetUserId);
      
      if (response.success) {
        alert('连接请求已发送');
        // 刷新推荐列表
        const recommendationsRes = await communityService.getRecommendedFounders(currentUser.id);
        if (recommendationsRes.success) {
          setRecommendedFounders(recommendationsRes.data.recommendations);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('发送连接请求失败:', err);
      alert(err.message || '发送连接请求失败');
    }
  };

  const handlePostInteraction = useCallback((action, postId, data) => {
    console.log('动态交互:', action, postId, data);
    // 这里可以添加额外的交互处理逻辑
  }, []);

  const handleFilterChange = (newFilters) => {
    setFeedFilters(newFilters);
  };

  const handleTagClick = (tag) => {
    const newTags = feedFilters.tags.includes(tag)
      ? feedFilters.tags.filter(t => t !== tag)
      : [...feedFilters.tags, tag];
    
    setFeedFilters({ ...feedFilters, tags: newTags });
  };

  // 如果用户未登录，显示登录提示
  if (!currentUser) {
    return (
      <ErrorBoundary>
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              加入Founders社区
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              连接全球创始人，分享创业智慧与经验。请先登录以访问社区功能。
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.href = '/login'}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                立即登录
              </button>
              <button
                onClick={() => authService.mockLogin('founder')}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  border: '2px solid #3b82f6',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                体验模式
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* 页面头部 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '3rem 2rem' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem' 
                }}>
                  👥 Founders社区
                </h1>
                <p style={{ 
                  fontSize: '1.2rem', 
                  opacity: 0.9,
                  marginBottom: '0'
                }}>
                  连接全球创始人，分享创业智慧与经验
                </p>
              </div>
              
              {/* 用户信息和通知 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{currentUser.avatar}</span>
                  <span style={{ fontWeight: '600' }}>{currentUser.name}</span>
                </div>
                
                {unreadCount > 0 && (
                  <div style={{
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🔔</span>
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {unreadCount}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {/* 搜索栏 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索创始人、公司或行业..."
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? '搜索中...' : '🔍 搜索'}
              </button>
            </div>
          </div>

          {/* 标签页导航 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto'
            }}>
              {[
                { id: 'community', label: '社区动态', icon: '📝' },
                { id: 'connections', label: '我的连接', icon: '🤝' },
                { id: 'recommendations', label: '推荐创始人', icon: '⭐' },
                { id: 'search', label: '搜索结果', icon: '🔍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
            {/* 主内容区域 */}
            <div>
              {activeTab === 'community' && (
                <CommunityTab
                  feedFilters={feedFilters}
                  onFilterChange={handleFilterChange}
                  onPostInteraction={handlePostInteraction}
                  showPostModal={showPostModal}
                  setShowPostModal={setShowPostModal}
                />
              )}

              {activeTab === 'connections' && (
                <ConnectionsTab
                  connections={connections}
                  onConnect={handleConnect}
                />
              )}

              {activeTab === 'recommendations' && (
                <RecommendationsTab
                  recommendations={recommendedFounders}
                  onConnect={handleConnect}
                />
              )}

              {activeTab === 'search' && (
                <SearchResultsTab
                  results={searchResults}
                  query={searchQuery}
                  onConnect={handleConnect}
                />
              )}
            </div>

            {/* 侧边栏 */}
            <div>
              <SidebarWidget
                title="热门标签"
                icon="🔥"
                content={
                  <TrendingTags
                    tags={trendingTags}
                    selectedTags={feedFilters.tags}
                    onTagClick={handleTagClick}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// 社区动态标签页
const CommunityTab = ({ feedFilters, onFilterChange, onPostInteraction, showPostModal, setShowPostModal }) => {
  return (
    <div>
      {/* 过滤器 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
            社区动态
          </h3>
          <button
            onClick={() => setShowPostModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ✏️ 发布动态
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'all', label: '全部' },
            { id: 'milestone', label: '里程碑' },
            { id: 'tech_share', label: '技术分享' },
            { id: 'experience_share', label: '经验分享' },
            { id: 'funding', label: '融资动态' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange({ ...feedFilters, type: filter.id })}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: feedFilters.type === filter.id ? '#3b82f6' : '#f3f4f6',
                color: feedFilters.type === filter.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '1rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 社区动态流 */}
      <CommunityFeed
        filters={feedFilters}
        onPostInteraction={onPostInteraction}
      />
    </div>
  );
};

// 连接标签页
const ConnectionsTab = ({ connections, onConnect }) => {
  if (connections.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
          还没有连接
        </h3>
        <p style={{ color: '#6b7280' }}>
          开始连接其他创始人，建立您的专业网络
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          onConnect={onConnect}
        />
      ))}
    </div>
  );
};

// 推荐标签页
const RecommendationsTab = ({ recommendations, onConnect }) => {
  if (recommendations.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
          暂无推荐
        </h3>
        <p style={{ color: '#6b7280' }}>
          完善您的资料以获得更精准的推荐
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {recommendations.map((founder) => (
        <RecommendationCard
          key={founder.id}
          founder={founder}
          onConnect={onConnect}
        />
      ))}
    </div>
  );
};

// 搜索结果标签页
const SearchResultsTab = ({ results, query, onConnect }) => {
  if (results.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
          {query ? `未找到"${query}"的相关结果` : '开始搜索'}
        </h3>
        <p style={{ color: '#6b7280' }}>
          {query ? '尝试使用其他关键词搜索' : '输入关键词搜索创始人、公司或行业'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
          搜索结果: "{query}" ({results.length}个结果)
        </h3>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {results.map((founder) => (
          <FounderCard
            key={founder.id}
            founder={founder}
            onConnect={onConnect}
          />
        ))}
      </div>
    </div>
  );
};

// 连接卡片组件
const ConnectionCard = ({ connection, onConnect }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{ fontSize: '3rem' }}>
        {connection.user.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
          {connection.user.name}
        </h4>
        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
          {connection.user.title} • {connection.user.company}
        </p>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {connection.commonInterests.map((interest, index) => (
            <span
              key={index}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: connection.connectionType === 'mutual' ? '#dcfce7' : '#fef3c7',
        color: connection.connectionType === 'mutual' ? '#166534' : '#92400e',
        borderRadius: '1rem',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        {connection.connectionType === 'mutual' ? '已连接' : '待确认'}
      </div>
    </div>
  );
};

// 推荐卡片组件
const RecommendationCard = ({ founder, onConnect }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '3rem' }}>
          {founder.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
            {founder.name}
          </h4>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            {founder.title} • {founder.company}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              匹配度 {founder.matchScore}%
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {founder.mutualConnections} 个共同连接
            </span>
          </div>
        </div>
        <button
          onClick={() => onConnect(founder.id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          连接
        </button>
      </div>

      <p style={{ color: '#374151', marginBottom: '1rem', lineHeight: '1.5' }}>
        {founder.bio}
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
          匹配原因:
        </h5>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {founder.matchReasons.map((reason, index) => (
            <span
              key={index}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        {founder.tags.map((tag, index) => (
          <span
            key={index}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// 创始人卡片组件
const FounderCard = ({ founder, onConnect }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{ fontSize: '3rem' }}>
        {founder.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
          {founder.name}
        </h4>
        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
          {founder.title} • {founder.company}
        </p>
        <p style={{ color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          {founder.bio}
        </p>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {founder.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => onConnect(founder.id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          连接
        </button>
        <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
          {founder.mutualConnections} 个共同连接
        </span>
      </div>
    </div>
  );
};

// 侧边栏组件
const SidebarWidget = ({ title, icon, content }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
          {title}
        </h3>
      </div>
      {content}
    </div>
  );
};

// 热门标签组件
const TrendingTags = ({ tags, selectedTags, onTagClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {tags.map((tagData, index) => (
        <div
          key={index}
          onClick={() => onTagClick(tagData.tag)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: selectedTags.includes(tagData.tag) ? '#e0f2fe' : 'transparent',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!selectedTags.includes(tagData.tag)) {
              e.target.style.backgroundColor = '#f8fafc';
            }
          }}
          onMouseLeave={(e) => {
            if (!selectedTags.includes(tagData.tag)) {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{
            fontSize: '0.875rem',
            color: selectedTags.includes(tagData.tag) ? '#0369a1' : '#374151'
          }}>
            #{tagData.tag}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              {tagData.count}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: tagData.trend === 'up' ? '#10b981' : 
                     tagData.trend === 'down' ? '#ef4444' : '#6b7280'
            }}>
              {tagData.trend === 'up' ? '↗' : 
               tagData.trend === 'down' ? '↘' : '→'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoundersPage;
