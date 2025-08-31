import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import authService from '../services/authService';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUserProfile();
    
    // 监听认证状态变化
    const unsubscribe = authService.onAuthStateChange((authEvent) => {
      if (authEvent.type === 'login' || authEvent.type === 'profileUpdate') {
        loadUserProfile();
      } else if (authEvent.type === 'logout') {
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const createDefaultProfile = (user) => {
    const defaults = {
      personal: {
        name: user.name || '',
        email: user.email || '',
        title: '',
        company: '',
        location: '',
        bio: '',
        avatar: user.avatar || ''
      },
      preferences: {
        industries: [],
        stages: [],
        risk_level: 'balanced',
        min_investment: 10000,
        max_investment: 100000
      },
      authentication: {
        email_verified: user.email_verified || false,
        phone_verified: false,
        identity_verified: false,
        accredited_investor: false
      },
      statistics: {
        paper_investments: 0,
        real_investments: 0,
        total_invested: 0,
        portfolio_value: 1000000,
        total_return: 0,
        success_rate: 0
      }
    };

    return {
      id: user.id,
      ...defaults,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  const loadUserProfile = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      // 从认证服务获取当前用户
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        // 从localStorage加载完整的用户资料
        const profileKey = `user_profile_${currentUser.id}`;
        const savedProfile = localStorage.getItem(profileKey);
        
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserProfile(profile);
          setEditForm(profile);
        } else {
          // 创建基于当前用户的默认资料
          const defaultProfile = createDefaultProfile(currentUser);
          localStorage.setItem(profileKey, JSON.stringify(defaultProfile));
          setUserProfile(defaultProfile);
          setEditForm(defaultProfile);
        }
      } else {
        // 用户未登录，创建默认资料
        const defaultProfile = createDefaultProfile({
          id: 'user_123',
          name: 'Demo User',
          email: 'demo@unicorn100.com',
          email_verified: true
        });
        
        localStorage.setItem('user_profile_user_123', JSON.stringify(defaultProfile));
        setUserProfile(defaultProfile);
        setEditForm(defaultProfile);
      }
      
    } catch (err) {
      console.error('加载用户资料失败:', err);
      setError('加载用户资料失败，请重试');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserProfile = () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const profileKey = 'user_profile_user_123';
      const updatedProfile = {
        ...editForm,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      setIsEditing(false);
      setSuccess('资料保存成功！');
      
      // 通知认证服务资料已更新
      authService.notifyProfileUpdate(updatedProfile);
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('保存用户资料失败:', err);
      setError('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: Array.isArray(value) ? value : [value]
      }
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // 取消编辑，恢复原始数据
      setEditForm(userProfile);
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  if (loading && !userProfile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ fontSize: '1.1rem', color: '#374151' }}>
            加载用户资料中...
          </span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            用户资料加载失败
          </h3>
          <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
            无法加载用户资料，请重新登录或刷新页面
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* 页面头部 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '4rem 2rem', 
          textAlign: 'center' 
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginRight: '1.5rem'
            }}>
              👤
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                {userProfile.personal.name || 'Demo User'}
              </h1>
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: 0.9 
              }}>
                {userProfile.personal.title || '投资者'} • {userProfile.personal.company || 'Unicorn 100'}
              </p>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem' 
        }}>
          {/* 成功/错误消息 */}
          {success && (
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #a7f3d0',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#065f46'
            }}>
              ✅ {success}
            </div>
          )}
          
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#dc2626'
            }}>
              ❌ {error}
            </div>
          )}

          {/* 标签页导航 */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #e5e7eb',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}>
            {[
              { id: 'overview', label: '📊 概览', icon: '📊' },
              { id: 'profile', label: '👤 个人资料', icon: '👤' },
              { id: 'preferences', label: '⚙️ 投资偏好', icon: '⚙️' },
              { id: 'authentication', label: '🛡️ 认证状态', icon: '🛡️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 2rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                  color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 标签页内容 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {/* 概览标签页 */}
            {activeTab === 'overview' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    📊 投资概览
                  </h2>
                </div>

                {/* 统计卡片 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.25rem' }}>
                      ${userProfile.statistics.portfolio_value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资组合价值</div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.25rem' }}>
                      {userProfile.statistics.total_return >= 0 ? '+' : ''}{userProfile.statistics.total_return.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>总收益率</div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.25rem' }}>
                      {userProfile.statistics.paper_investments + userProfile.statistics.real_investments}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资项目数</div>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.25rem' }}>
                      {userProfile.statistics.success_rate.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资成功率</div>
                  </div>
                </div>

                {/* 最近活动 */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                    📋 最近活动
                  </h3>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    暂无最近活动记录
                  </div>
                </div>
              </div>
            )}

            {/* 个人资料标签页 */}
            {activeTab === 'profile' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    👤 个人资料
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveUserProfile}
                          disabled={loading}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: loading ? '#d1d5db' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {loading ? '保存中...' : '💾 保存'}
                        </button>
                        <button
                          onClick={toggleEdit}
                          disabled={loading}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ❌ 取消
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={toggleEdit}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ✏️ 编辑
                      </button>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}>
                  {/* 基本信息 */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      基本信息
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          姓名
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.personal?.name || ''}
                            onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                            {userProfile.personal.name || '未设置'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          邮箱
                        </label>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                          {userProfile.personal.email || '未设置'}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          职位
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.personal?.title || ''}
                            onChange={(e) => handleInputChange('personal', 'title', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                            {userProfile.personal.title || '未设置'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          公司
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.personal?.company || ''}
                            onChange={(e) => handleInputChange('personal', 'company', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                            {userProfile.personal.company || '未设置'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          所在地
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.personal?.location || ''}
                            onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                            {userProfile.personal.location || '未设置'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 个人简介 */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      个人简介
                    </h3>
                    {isEditing ? (
                      <textarea
                        value={editForm.personal?.bio || ''}
                        onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                        rows={6}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                        placeholder="介绍一下您的投资经验和兴趣..."
                      />
                    ) : (
                      <div style={{ 
                        padding: '0.75rem', 
                        backgroundColor: '#f9fafb', 
                        borderRadius: '0.5rem', 
                        color: '#374151',
                        minHeight: '150px',
                        lineHeight: '1.6'
                      }}>
                        {userProfile.personal.bio || '暂无个人简介'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 投资偏好标签页 */}
            {activeTab === 'preferences' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    ⚙️ 投资偏好
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveUserProfile}
                          disabled={loading}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: loading ? '#d1d5db' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {loading ? '保存中...' : '💾 保存'}
                        </button>
                        <button
                          onClick={toggleEdit}
                          disabled={loading}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ❌ 取消
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={toggleEdit}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ✏️ 编辑
                      </button>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}>
                  {/* 行业偏好 */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      关注行业
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {['人工智能', '生物技术', '金融科技', '清洁能源', '航空航天', '教育科技', '医疗健康', '企业服务'].map(industry => (
                        <span
                          key={industry}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: (userProfile.preferences.industries || []).includes(industry) ? '#3b82f6' : '#f3f4f6',
                            color: (userProfile.preferences.industries || []).includes(industry) ? 'white' : '#374151',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            cursor: isEditing ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (isEditing) {
                              const currentIndustries = editForm.preferences?.industries || [];
                              const newIndustries = currentIndustries.includes(industry)
                                ? currentIndustries.filter(i => i !== industry)
                                : [...currentIndustries, industry];
                              handleArrayChange('preferences', 'industries', newIndustries);
                            }
                          }}
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 投资阶段 */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      投资阶段
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {['种子轮', 'A轮', 'B轮', 'C轮', 'D轮及以后'].map(stage => (
                        <span
                          key={stage}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: (userProfile.preferences.stages || []).includes(stage) ? '#10b981' : '#f3f4f6',
                            color: (userProfile.preferences.stages || []).includes(stage) ? 'white' : '#374151',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            cursor: isEditing ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (isEditing) {
                              const currentStages = editForm.preferences?.stages || [];
                              const newStages = currentStages.includes(stage)
                                ? currentStages.filter(s => s !== stage)
                                : [...currentStages, stage];
                              handleArrayChange('preferences', 'stages', newStages);
                            }
                          }}
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 风险偏好 */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      风险偏好
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { value: 'conservative', label: '保守型', desc: '偏好稳定收益，风险承受能力较低' },
                        { value: 'balanced', label: '平衡型', desc: '追求收益与风险的平衡' },
                        { value: 'aggressive', label: '激进型', desc: '追求高收益，能承受较高风险' }
                      ].map(option => (
                        <div
                          key={option.value}
                          onClick={() => {
                            if (isEditing) {
                              handleInputChange('preferences', 'risk_level', option.value);
                            }
                          }}
                          style={{
                            padding: '1rem',
                            border: `2px solid ${userProfile.preferences.risk_level === option.value ? '#3b82f6' : '#e5e7eb'}`,
                            borderRadius: '0.5rem',
                            cursor: isEditing ? 'pointer' : 'default',
                            backgroundColor: userProfile.preferences.risk_level === option.value ? '#eff6ff' : 'white'
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {option.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 投资金额范围 */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      投资金额范围
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          最小投资额 ($)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.preferences?.min_investment || 0}
                            onChange={(e) => handleInputChange('preferences', 'min_investment', parseInt(e.target.value) || 0)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                            ${userProfile.preferences.min_investment?.toLocaleString() || '0'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          最大投资额 ($)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.preferences?.max_investment || 0}
                            onChange={(e) => handleInputChange('preferences', 'max_investment', parseInt(e.target.value) || 0)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', color: '#374151' }}>
                            ${userProfile.preferences.max_investment?.toLocaleString() || '0'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 认证状态标签页 */}
            {activeTab === 'authentication' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    🛡️ 认证状态
                  </h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {/* 邮箱认证 */}
                  <div style={{
                    padding: '1.5rem',
                    border: `2px solid ${userProfile.authentication.email_verified ? '#10b981' : '#f59e0b'}`,
                    borderRadius: '0.75rem',
                    backgroundColor: userProfile.authentication.email_verified ? '#d1fae5' : '#fef3c7'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>
                        {userProfile.authentication.email_verified ? '✅' : '⏳'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          邮箱认证
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {userProfile.authentication.email_verified ? '已认证' : '待认证'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>
                      验证您的邮箱地址以确保账户安全
                    </p>
                    {!userProfile.authentication.email_verified && (
                      <button style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        发送验证邮件
                      </button>
                    )}
                  </div>

                  {/* 手机认证 */}
                  <div style={{
                    padding: '1.5rem',
                    border: `2px solid ${userProfile.authentication.phone_verified ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    backgroundColor: userProfile.authentication.phone_verified ? '#d1fae5' : '#f9fafb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>
                        {userProfile.authentication.phone_verified ? '✅' : '📱'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          手机认证
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {userProfile.authentication.phone_verified ? '已认证' : '未认证'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>
                      验证手机号码以提高账户安全性
                    </p>
                    {!userProfile.authentication.phone_verified && (
                      <button style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        开始认证
                      </button>
                    )}
                  </div>

                  {/* 身份认证 */}
                  <div style={{
                    padding: '1.5rem',
                    border: `2px solid ${userProfile.authentication.identity_verified ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    backgroundColor: userProfile.authentication.identity_verified ? '#d1fae5' : '#f9fafb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>
                        {userProfile.authentication.identity_verified ? '✅' : '🆔'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          身份认证
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {userProfile.authentication.identity_verified ? '已认证' : '未认证'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>
                      上传身份证件完成实名认证
                    </p>
                    {!userProfile.authentication.identity_verified && (
                      <button style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        开始认证
                      </button>
                    )}
                  </div>

                  {/* 合格投资者认证 */}
                  <div style={{
                    padding: '1.5rem',
                    border: `2px solid ${userProfile.authentication.accredited_investor ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    backgroundColor: userProfile.authentication.accredited_investor ? '#d1fae5' : '#f9fafb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>
                        {userProfile.authentication.accredited_investor ? '✅' : '💼'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          合格投资者认证
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {userProfile.authentication.accredited_investor ? '已认证' : '未认证'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>
                      认证合格投资者身份以参与高级投资项目
                    </p>
                    {!userProfile.authentication.accredited_investor && (
                      <button style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        申请认证
                      </button>
                    )}
                  </div>
                </div>

                {/* 认证进度 */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                    认证进度
                  </h3>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        认证完成度
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>
                        {Math.round(
                          (Object.values(userProfile.authentication).filter(Boolean).length / 
                           Object.keys(userProfile.authentication).length) * 100
                        )}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.round(
                          (Object.values(userProfile.authentication).filter(Boolean).length / 
                           Object.keys(userProfile.authentication).length) * 100
                        )}%`,
                        height: '100%',
                        backgroundColor: '#3b82f6',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfilePage;

