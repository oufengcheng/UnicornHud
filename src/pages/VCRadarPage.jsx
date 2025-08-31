import React, { useState, useCallback } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import VCMatchingModal from '../components/VCMatchingModal';

const VCRadarPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [selectedVC, setSelectedVC] = useState(null);

  // VC数据
  const vcData = [
    {
      id: 1,
      name: "红杉资本中国",
      logo: "🌲",
      type: "顶级VC",
      aum: "$85亿",
      founded: "2005年",
      location: "北京/上海",
      focus_stages: ["A轮", "B轮", "C轮"],
      focus_industries: ["人工智能", "企业服务", "消费科技", "医疗健康"],
      investment_range: "$5M - $50M",
      portfolio_companies: ["字节跳动", "美团", "滴滴出行", "京东"],
      recent_investments: ["AI芯片公司", "SaaS平台", "新能源汽车"],
      investment_thesis: "专注于科技驱动的创新企业，重视团队执行力和市场潜力",
      contact_info: {
        website: "www.sequoiacap.com.cn",
        email: "contact@sequoiacap.com.cn",
        address: "北京市朝阳区建国门外大街1号"
      },
      team: ["沈南鹏", "周逵", "计越"],
      success_rate: 85,
      avg_exit_time: "5-7年",
      notable_exits: ["阿里巴巴", "京东", "美团"]
    },
    {
      id: 2,
      name: "IDG资本",
      logo: "💎",
      type: "知名VC",
      aum: "$35亿",
      founded: "1993年",
      location: "北京/上海/深圳",
      focus_stages: ["种子轮", "A轮", "B轮"],
      focus_industries: ["消费升级", "企业服务", "医疗健康", "教育科技"],
      investment_range: "$2M - $30M",
      portfolio_companies: ["百度", "腾讯", "搜狐", "携程"],
      recent_investments: ["在线教育平台", "医疗AI", "新零售"],
      investment_thesis: "关注具有颠覆性创新的早期项目，重视创始人背景",
      contact_info: {
        website: "www.idgcapital.com",
        email: "info@idgcapital.com",
        address: "北京市朝阳区东三环中路39号"
      },
      team: ["熊晓鸽", "李丰", "牛奎光"],
      success_rate: 78,
      avg_exit_time: "4-6年",
      notable_exits: ["百度", "腾讯", "搜狐"]
    },
    {
      id: 3,
      name: "经纬创投",
      logo: "🧭",
      type: "活跃VC",
      aum: "$20亿",
      founded: "2008年",
      location: "北京/上海",
      focus_stages: ["天使轮", "A轮", "B轮"],
      focus_industries: ["移动互联网", "企业服务", "消费科技", "金融科技"],
      investment_range: "$1M - $20M",
      portfolio_companies: ["陌陌", "饿了么", "猎豹移动", "滴滴出行"],
      recent_investments: ["直播平台", "企业SaaS", "金融科技"],
      investment_thesis: "专注移动互联网和企业服务，重视数据驱动的商业模式",
      contact_info: {
        website: "www.matrixpartners.com.cn",
        email: "contact@matrixpartners.com.cn",
        address: "北京市海淀区中关村大街27号"
      },
      team: ["张颖", "徐传陞", "王华东"],
      success_rate: 72,
      avg_exit_time: "3-5年",
      notable_exits: ["陌陌", "饿了么", "猎豹移动"]
    }
  ];

  // 显示错误消息
  const showErrorMessage = useCallback((message) => {
    setModalTitle('操作失败');
    setModalContent(`❌ ${message}\n\n请稍后重试或联系客服支持。\n\n客服邮箱: support@unicorn100.com\n客服电话: +86-400-888-0100`);
    setShowModal(true);
  }, []);

  // 查看详情处理函数
  const handleViewDetails = useCallback((vc) => {
    try {
      console.log('查看VC详情:', vc.name);
      
      const detailsInfo = `🏢 ${vc.name} - 详细信息

📊 基本信息
• 机构类型: ${vc.type}
• 管理资产: ${vc.aum}
• 成立时间: ${vc.founded}
• 办公地点: ${vc.location}

🎯 投资策略
• 关注阶段: ${vc.focus_stages.join(', ')}
• 关注领域: ${vc.focus_industries.join(', ')}
• 投资金额: ${vc.investment_range}
• 投资理念: ${vc.investment_thesis}

💼 投资组合
• 知名案例: ${vc.portfolio_companies.join(', ')}
• 近期投资: ${vc.recent_investments.join(', ')}
• 成功退出: ${vc.notable_exits.join(', ')}

📈 投资表现
• 成功率: ${vc.success_rate}%
• 平均退出时间: ${vc.avg_exit_time}

👥 核心团队
• 主要合伙人: ${vc.team.join(', ')}

📞 联系方式
• 官方网站: ${vc.contact_info.website}
• 联系邮箱: ${vc.contact_info.email}
• 办公地址: ${vc.contact_info.address}

💡 投资建议
• 适合寻求${vc.focus_stages[0]}融资的项目
• 重点关注${vc.focus_industries[0]}领域
• 建议通过官方渠道或推荐人联系
• 准备详细的商业计划书和财务模型`;

      setModalTitle(`${vc.name} - 详细信息`);
      setModalContent(detailsInfo);
      setShowModal(true);
      
    } catch (error) {
      console.error('查看详情失败:', error);
      showErrorMessage('查看详情失败');
    }
  }, [showErrorMessage]);

  // 智能撮合处理函数
  const handleSmartMatching = useCallback((vc) => {
    try {
      console.log('启动智能撮合:', vc.name);
      setSelectedVC(vc);
      setShowMatchingModal(true);
    } catch (error) {
      console.error('智能撮合处理失败:', error);
      showErrorMessage('智能撮合处理失败');
    }
  }, [showErrorMessage]);

  // 关闭模态框
  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalContent('');
    setModalTitle('');
  }, []);

  // 关闭撮合模态框
  const closeMatchingModal = useCallback(() => {
    setShowMatchingModal(false);
    setSelectedVC(null);
  }, []);

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
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎯 VC Radar 双向选择
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.9, 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            AI驱动的智能撮合系统，精准匹配投资机构与创新项目
          </p>
        </div>

        {/* 主要内容区域 */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem' 
        }}>
          {/* 平台统计 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏢</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.25rem' }}>
                500+
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资机构</div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
                92%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>匹配准确率</div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.25rem' }}>
                1,200+
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>成功撮合</div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.25rem' }}>
                3秒
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>AI分析时间</div>
            </div>
          </div>

          {/* VC机构列表 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem'
          }}>
            {vcData.map(vc => (
              <div
                key={vc.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* 机构头部 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginRight: '1rem',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '1rem'
                  }}>
                    {vc.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      {vc.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {vc.type}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {vc.aum} AUM
                      </span>
                    </div>
                  </div>
                </div>

                {/* 基本信息 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📅 成立时间
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {vc.founded}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📍 办公地点
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {vc.location}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      💰 投资金额
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {vc.investment_range}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📈 成功率
                    </div>
                    <div style={{ fontWeight: '600', color: '#10b981' }}>
                      {vc.success_rate}%
                    </div>
                  </div>
                </div>

                {/* 投资阶段 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    🎯 关注阶段
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {vc.focus_stages.map((stage, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 关注领域 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    🏭 关注领域
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {vc.focus_industries.map((industry, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 投资组合 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    💼 知名案例
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>
                    {vc.portfolio_companies.slice(0, 3).join(', ')}
                    {vc.portfolio_companies.length > 3 && '...'}
                  </div>
                </div>

                {/* 投资理念 */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    💡 投资理念
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    lineHeight: '1.6',
                    fontStyle: 'italic'
                  }}>
                    "{vc.investment_thesis}"
                  </div>
                </div>

                {/* 操作按钮 */}
                <div style={{
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <button
                    onClick={() => handleSmartMatching(vc)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🤖 智能撮合
                  </button>

                  <button
                    onClick={() => handleViewDetails(vc)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#059669';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#10b981';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📋 查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 平台优势 */}
          <div style={{
            marginTop: '4rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              🚀 AI驱动的智能撮合优势
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  AI智能分析
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  7个维度深度分析，3秒完成智能匹配，92%准确率
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  数据驱动
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  基于海量投资数据和成功案例，提供精准的匹配建议
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  高效撮合
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  大幅缩短撮合时间，提高投资成功率和效率
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  精准匹配
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  个性化推荐最适合的投资机构，提供详细的匹配分析
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 通用模态框 */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {modalTitle}
                </h3>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.6',
                color: '#374151'
              }}>
                {modalContent}
              </div>
            </div>
          </div>
        )}

        {/* VC撮合分析模态框 */}
        {showMatchingModal && selectedVC && (
          <VCMatchingModal
            vc={selectedVC}
            onClose={closeMatchingModal}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default VCRadarPage;

