import React, { useState, useCallback } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import DemoDayRegistrationModal from '../components/DemoDayRegistrationModal';

const DemoDayPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Demo Day活动数据
  const demoDayEvents = [
    {
      id: 1,
      title: "Unicorn 100 Global Demo Day 2025",
      date: "2025年3月15日",
      time: "14:00 - 18:00 (GMT+8)",
      location: "上海国际会议中心",
      virtual: true,
      status: "即将开始",
      participants: 150,
      investors: 45,
      startups: 20,
      theme: "AI与未来科技",
      description: "全球最具影响力的创业路演活动，连接顶级投资人与创新项目",
      highlights: ["20个精选项目路演", "45位顶级投资人", "一对一投资会面", "创业者交流晚宴"],
      registration_fee: "免费（VIP席位需付费）",
      deadline: "活动前7天",
      success_rate: "60%项目获得后续跟进",
      total_funding: "$300M"
    },
    {
      id: 2,
      title: "硅谷创新峰会 Demo Day",
      date: "2025年4月20日",
      time: "10:00 - 16:00 (PST)",
      location: "Stanford University",
      virtual: true,
      status: "报名中",
      participants: 200,
      investors: 60,
      startups: 25,
      theme: "深科技与硬件创新",
      description: "聚焦硬件创新和深科技领域的专业路演活动",
      highlights: ["25个深科技项目", "60位硅谷投资人", "斯坦福大学举办", "技术展示环节"],
      registration_fee: "免费",
      deadline: "活动前10天",
      success_rate: "70%项目获得投资意向",
      total_funding: "$200M"
    }
  ];

  // 显示错误消息
  const showErrorMessage = useCallback((message) => {
    setModalTitle('操作失败');
    setModalContent(`❌ ${message}\n\n请稍后重试或联系客服支持。\n\n客服邮箱: support@unicorn100.com\n客服电话: +86-400-888-0100`);
    setShowModal(true);
  }, []);

  // 活动报名处理函数
  const handleEventRegistration = useCallback((event) => {
    try {
      console.log('处理活动报名:', event.title);
      setSelectedEvent(event);
      setShowRegistrationModal(true);
    } catch (error) {
      console.error('活动报名处理失败:', error);
      showErrorMessage('活动报名处理失败');
    }
  }, [showErrorMessage]);

  // 关闭模态框
  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalContent('');
    setModalTitle('');
  }, []);

  // 关闭注册模态框
  const closeRegistrationModal = useCallback(() => {
    setShowRegistrationModal(false);
    setSelectedEvent(null);
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
            🎪 Demo Day 路演平台
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.9, 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            全球顶级创业路演活动，连接创新项目与投资机构，助力下一个独角兽诞生
          </p>
        </div>

        {/* 主要内容区域 */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem' 
        }}>
          {/* 活动统计 */}
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
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.25rem' }}>
                45
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>精选项目</div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
                105
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
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.25rem' }}>
                $500M
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>累计融资</div>
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
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.25rem' }}>
                65%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>成功率</div>
            </div>
          </div>

          {/* 活动列表 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '2rem'
          }}>
            {demoDayEvents.map(event => (
              <div
                key={event.id}
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
                {/* 活动头部 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      flex: 1
                    }}>
                      {event.title}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: event.status === '即将开始' ? '#fef3c7' : '#d1fae5',
                      color: event.status === '即将开始' ? '#92400e' : '#065f46',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem'
                    }}>
                      {event.status}
                    </span>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                  }}>
                    {event.description}
                  </p>
                </div>

                {/* 活动信息 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📅 活动时间
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {event.date}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {event.time}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      📍 活动地点
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {event.location}
                    </div>
                    {event.virtual && (
                      <div style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
                        🌐 支持线上参与
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      🎯 活动主题
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {event.theme}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      👥 参与规模
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {event.participants}人
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {event.investors}投资人 • {event.startups}项目
                    </div>
                  </div>
                </div>

                {/* 活动亮点 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    ✨ 活动亮点
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {event.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#eff6ff',
                          color: '#1e40af',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 成功数据 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                      {event.success_rate}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      项目成功率
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {event.total_funding}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      累计融资
                    </div>
                  </div>
                </div>

                {/* 报名信息 */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fef7cd',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
                      💰 报名费用
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#92400e' }}>
                      {event.registration_fee}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
                      ⏰ 报名截止
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#92400e' }}>
                      {event.deadline}
                    </span>
                  </div>
                </div>

                {/* 报名按钮 */}
                <button
                  onClick={() => handleEventRegistration(event)}
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '1.1rem',
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
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🎯 立即报名
                </button>
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
              🏆 为什么选择 Unicorn 100 Demo Day？
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  精选项目
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  严格筛选的高质量创新项目，每个项目都经过专业团队深度评估
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  顶级投资人
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  汇聚全球顶级投资机构和知名投资人，提供最优质的投资资源
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  专业撮合
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  AI驱动的智能撮合系统，精准匹配投资人与项目，提高成功率
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌐</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  全球网络
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  连接全球创新生态，为项目提供国际化的发展机会和资源
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
              maxWidth: '500px',
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

        {/* Demo Day报名模态框 */}
        {showRegistrationModal && selectedEvent && (
          <DemoDayRegistrationModal
            event={selectedEvent}
            onClose={closeRegistrationModal}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DemoDayPage;

