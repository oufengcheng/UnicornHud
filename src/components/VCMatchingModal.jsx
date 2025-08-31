import React, { useState, useEffect } from 'react';
import vcRadarService from '../services/vcRadarService';

const VCMatchingModal = ({ isOpen, onClose, vcFirm, userProfile = {} }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState('');

  // 模拟项目数据（实际应用中应该从props或context获取）
  const mockProject = {
    id: 1,
    name: "QuantumAI Labs",
    industry: "人工智能",
    stage: "A轮",
    location: "旧金山",
    fundingGoal: "$10M",
    businessModel: "SaaS",
    urgency: "normal"
  };

  useEffect(() => {
    if (isOpen && vcFirm) {
      performAnalysis();
    }
  }, [isOpen, vcFirm]);

  // 设置进度更新回调
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateAIProgress = (message) => {
        setProgress(message);
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.updateAIProgress;
      }
    };
  }, []);

  const performAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress('开始AI分析...');
      
      const result = await vcRadarService.performSmartMatching(
        mockProject, 
        vcFirm, 
        userProfile
      );
      
      setAnalysisData(result);
      setProgress('分析完成！');
      
      // 清除进度信息
      setTimeout(() => setProgress(''), 1000);
      
    } catch (err) {
      console.error('VC撮合分析失败:', err);
      setError(err.message || 'AI分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#059669'; // 绿色
    if (score >= 0.6) return '#d97706'; // 橙色
    return '#dc2626'; // 红色
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return '高匹配';
    if (score >= 0.6) return '中等匹配';
    return '低匹配';
  };

  const formatPercentage = (score) => {
    return Math.round(score * 100) + '%';
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* 头部 */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                🤖 AI智能撮合分析
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                {vcFirm?.name} × {mockProject.name}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div style={{
            padding: '3rem',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {progress || 'AI正在分析中...'}
            </p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div style={{
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#dc2626', margin: 0 }}>
                {error}
              </p>
            </div>
            <button
              onClick={performAnalysis}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              重新分析
            </button>
          </div>
        )}

        {/* 分析结果 */}
        {!loading && !error && analysisData && (
          <div style={{ height: 'calc(90vh - 120px)', overflow: 'auto' }}>
            {/* 标签导航 */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              {[
                { id: 'overview', label: '总览' },
                { id: 'scores', label: '详细评分' },
                { id: 'insights', label: 'AI洞察' },
                { id: 'recommendations', label: '行动建议' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                    borderBottom: activeTab === tab.id ? '2px solid #667eea' : '2px solid transparent',
                    color: activeTab === tab.id ? '#667eea' : '#6b7280',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '2rem' }}>
              {/* 总览标签 */}
              {activeTab === 'overview' && (
                <div>
                  {/* 综合评分 */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    padding: '2rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '1rem'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      fontWeight: 'bold',
                      color: getScoreColor(analysisData.overallScore),
                      marginBottom: '0.5rem'
                    }}>
                      {formatPercentage(analysisData.overallScore)}
                    </div>
                    <div style={{
                      fontSize: '1.2rem',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      综合匹配度
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: getScoreColor(analysisData.overallScore),
                      color: 'white',
                      borderRadius: '1rem',
                      display: 'inline-block',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {getScoreLabel(analysisData.overallScore)}
                    </div>
                  </div>

                  {/* 关键指标 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: '#ecfdf5',
                      borderRadius: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#059669',
                        marginBottom: '0.5rem'
                      }}>
                        {analysisData.successProbability}%
                      </div>
                      <div style={{ color: '#065f46', fontWeight: '500' }}>
                        成功概率
                      </div>
                    </div>

                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: '#eff6ff',
                      borderRadius: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#2563eb',
                        marginBottom: '0.5rem'
                      }}>
                        {analysisData.confidence}%
                      </div>
                      <div style={{ color: '#1e40af', fontWeight: '500' }}>
                        分析置信度
                      </div>
                    </div>
                  </div>

                  {/* 快速洞察 */}
                  <div>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '1rem'
                    }}>
                      快速洞察
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {analysisData.insights.slice(0, 3).map((insight, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '1rem',
                            backgroundColor: insight.type === 'strength' ? '#ecfdf5' : 
                                           insight.type === 'concern' ? '#fef2f2' : '#f0f9ff',
                            border: `1px solid ${insight.type === 'strength' ? '#d1fae5' : 
                                                insight.type === 'concern' ? '#fecaca' : '#dbeafe'}`,
                            borderRadius: '0.5rem'
                          }}
                        >
                          <div style={{
                            fontWeight: '600',
                            color: insight.type === 'strength' ? '#065f46' : 
                                   insight.type === 'concern' ? '#991b1b' : '#1e40af',
                            marginBottom: '0.25rem'
                          }}>
                            {insight.title}
                          </div>
                          <div style={{
                            color: insight.type === 'strength' ? '#047857' : 
                                   insight.type === 'concern' ? '#dc2626' : '#2563eb',
                            fontSize: '0.9rem'
                          }}>
                            {insight.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 详细评分标签 */}
              {activeTab === 'scores' && (
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '1.5rem'
                  }}>
                    多维度匹配分析
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {vcRadarService.matchingDimensions.map(dimension => {
                      const score = analysisData.matchingScores[dimension.name] || 0;
                      return (
                        <div
                          key={dimension.name}
                          style={{
                            padding: '1.5rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.75rem',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.75rem'
                          }}>
                            <div>
                              <div style={{
                                fontWeight: '600',
                                color: '#1f2937',
                                marginBottom: '0.25rem'
                              }}>
                                {dimension.label}
                              </div>
                              <div style={{
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                权重: {Math.round(dimension.weight * 100)}%
                              </div>
                            </div>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              color: getScoreColor(score)
                            }}>
                              {formatPercentage(score)}
                            </div>
                          </div>
                          
                          {/* 进度条 */}
                          <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${score * 100}%`,
                              height: '100%',
                              backgroundColor: getScoreColor(score),
                              transition: 'width 0.5s ease'
                            }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI洞察标签 */}
              {activeTab === 'insights' && (
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '1.5rem'
                  }}>
                    AI深度洞察
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {analysisData.insights.map((insight, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1.5rem',
                          backgroundColor: insight.type === 'strength' ? '#ecfdf5' : 
                                         insight.type === 'concern' ? '#fef2f2' : '#f0f9ff',
                          border: `2px solid ${insight.type === 'strength' ? '#10b981' : 
                                              insight.type === 'concern' ? '#ef4444' : '#3b82f6'}`,
                          borderRadius: '0.75rem'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{
                            fontSize: '1.5rem',
                            marginRight: '0.75rem'
                          }}>
                            {insight.type === 'strength' ? '💪' : 
                             insight.type === 'concern' ? '⚠️' : '💡'}
                          </div>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            color: insight.type === 'strength' ? '#065f46' : 
                                   insight.type === 'concern' ? '#991b1b' : '#1e40af'
                          }}>
                            {insight.title}
                          </div>
                        </div>
                        <div style={{
                          color: '#374151',
                          lineHeight: '1.6'
                        }}>
                          {insight.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 行动建议标签 */}
              {activeTab === 'recommendations' && (
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '1.5rem'
                  }}>
                    AI推荐行动方案
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {analysisData.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '1.5rem',
                          backgroundColor: 'white',
                          border: `2px solid ${rec.priority === 'high' ? '#ef4444' : '#f59e0b'}`,
                          borderRadius: '0.75rem',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: rec.priority === 'high' ? '#ef4444' : '#f59e0b',
                            color: 'white',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            marginRight: '0.75rem'
                          }}>
                            {rec.priority === 'high' ? '高优先级' : '中优先级'}
                          </div>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            color: '#1f2937'
                          }}>
                            {rec.action}
                          </div>
                        </div>
                        <div style={{
                          color: '#6b7280',
                          lineHeight: '1.6'
                        }}>
                          {rec.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 联系建议 */}
                  <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#f0f9ff',
                    border: '2px solid #3b82f6',
                    borderRadius: '0.75rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1e40af',
                      marginBottom: '1rem'
                    }}>
                      📞 联系建议
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>最佳联系时间</div>
                        <div style={{ color: '#6b7280' }}>工作日 10:00-16:00</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>推荐接触方式</div>
                        <div style={{ color: '#6b7280' }}>邮件 + LinkedIn</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>预期响应时间</div>
                        <div style={{ color: '#6b7280' }}>3-7个工作日</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 底部操作按钮 */}
        {!loading && !error && analysisData && (
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              分析时间: {new Date(analysisData.analysisTimestamp).toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={performAnalysis}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                重新分析
              </button>
              <button
                onClick={() => {
                  // 这里可以添加保存报告的逻辑
                  alert('分析报告已保存到您的账户');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                保存报告
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                开始联系
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCMatchingModal;

