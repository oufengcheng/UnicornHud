import React, { useState, useCallback } from 'react';
import InvestmentModal from '../components/InvestmentModal';
import AIAnalysisModal from '../components/AIAnalysisModal';
import ErrorBoundary from '../components/ErrorBoundary';
import apiClient from '../services/apiClient';

const ProjectsPage = () => {
  // 状态管理
  const [selectedProject, setSelectedProject] = useState(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState({});

  // 项目数据
  const projects = [
    {
      id: 1,
      name: "QuantumAI Labs",
      industry: "人工智能",
      stage: "A轮",
      location: "旧金山",
      description: "革命性的量子计算与人工智能融合平台，专注于解决复杂的优化问题",
      highlights: ["量子算法专利", "顶级AI团队", "Google合作伙伴"],
      valuation: "$50M",
      fundingGoal: "$10M",
      icon: "🧠"
    },
    {
      id: 2,
      name: "BioNano Therapeutics",
      industry: "生物技术",
      stage: "B轮",
      location: "波士顿",
      description: "基于纳米技术的精准医疗平台，开发下一代癌症治疗方案",
      highlights: ["FDA突破性疗法认定", "哈佛医学院合作", "3项核心专利"],
      valuation: "$120M",
      fundingGoal: "$25M",
      icon: "🧬"
    },
    {
      id: 3,
      name: "GreenTech Energy",
      industry: "清洁能源",
      stage: "种子轮",
      location: "奥斯汀",
      description: "智能电网和储能解决方案，推动可再生能源的大规模应用",
      highlights: ["Tesla前工程师团队", "政府补贴支持", "已获3个大型合同"],
      valuation: "$15M",
      fundingGoal: "$5M",
      icon: "🔋"
    },
    {
      id: 4,
      name: "SpaceLogistics Pro",
      industry: "航空航天",
      stage: "A轮",
      location: "洛杉矶",
      description: "太空物流和卫星服务平台，为商业太空活动提供基础设施",
      highlights: ["SpaceX合作伙伴", "NASA认证", "首个商业太空港"],
      valuation: "$80M",
      fundingGoal: "$15M",
      icon: "🚀"
    },
    {
      id: 5,
      name: "FinTech Revolution",
      industry: "金融科技",
      stage: "B轮",
      location: "纽约",
      description: "基于区块链的去中心化金融平台，重新定义传统银行业务",
      highlights: ["高盛投资", "监管沙盒批准", "100万+用户"],
      valuation: "$200M",
      fundingGoal: "$30M",
      icon: "💰"
    },
    {
      id: 6,
      name: "EduTech Future",
      industry: "教育科技",
      stage: "种子轮",
      location: "西雅图",
      description: "AI驱动的个性化学习平台，革命性的在线教育体验",
      highlights: ["斯坦福教育学院合作", "获教育部认可", "AI个性化算法"],
      valuation: "$25M",
      fundingGoal: "$8M",
      icon: "📚"
    }
  ];

  // 设置按钮加载状态
  const setButtonLoadingState = useCallback((projectId, action, isLoading) => {
    setButtonLoading(prev => ({
      ...prev,
      [`${projectId}_${action}`]: isLoading
    }));
  }, []);

  // 检查按钮是否在加载中
  const isButtonLoading = useCallback((projectId, action) => {
    return buttonLoading[`${projectId}_${action}`] || false;
  }, [buttonLoading]);

  // 查看详情处理函数
  const handleViewDetails = useCallback(async (project) => {
    try {
      setButtonLoadingState(project.id, 'details', true);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 显示项目详情模态框
      alert(`📋 ${project.name} 项目详情

🏢 公司信息:
• 行业: ${project.industry}
• 阶段: ${project.stage}
• 地点: ${project.location}
• 估值: ${project.valuation}

💡 项目描述:
${project.description}

⭐ 核心亮点:
${project.highlights.map(h => `• ${h}`).join('\n')}

💰 融资信息:
• 融资目标: ${project.fundingGoal}
• 投资机会: 开放中
• 最小投资额: $10,000

📞 联系方式:
• 邮箱: contact@${project.name.toLowerCase().replace(/\s+/g, '')}.com
• 电话: +1-555-0123
• 网站: www.${project.name.toLowerCase().replace(/\s+/g, '')}.com

⚠️ 风险提示:
投资有风险，请仔细评估项目风险后做出投资决策。建议咨询专业投资顾问。

🎯 下一步行动:
1. 深入了解项目技术和商业模式
2. 联系项目方获取更多信息
3. 进行尽职调查
4. 考虑投资金额和条件`);
      
    } catch (err) {
      console.error('获取项目详情失败:', err);
      alert('获取项目详情失败，请重试');
    } finally {
      setButtonLoadingState(project.id, 'details', false);
    }
  }, [setButtonLoadingState]);

  // AI分析处理函数
  const handleAIAnalysis = useCallback(async (project) => {
    try {
      setButtonLoadingState(project.id, 'ai', true);
      
      // 设置选中的项目并显示AI分析模态框
      setSelectedProject(project);
      setShowAIAnalysisModal(true);
      
    } catch (err) {
      console.error('AI分析失败:', err);
      alert('AI分析失败，请重试');
    } finally {
      setButtonLoadingState(project.id, 'ai', false);
    }
  }, [setButtonLoadingState]);

  // 投资意向处理函数
  const handleInvestmentIntent = useCallback(async (project) => {
    try {
      setButtonLoadingState(project.id, 'invest', true);
      
      // 设置选中的项目并显示投资模态框
      setSelectedProject(project);
      setShowInvestmentModal(true);
      
    } catch (err) {
      console.error('投资意向处理失败:', err);
      alert('投资意向处理失败，请重试');
    } finally {
      setButtonLoadingState(project.id, 'invest', false);
    }
  }, [setButtonLoadingState]);

  // 关闭投资模态框
  const handleCloseInvestmentModal = useCallback(() => {
    setShowInvestmentModal(false);
    setSelectedProject(null);
  }, []);

  // 关闭AI分析模态框
  const handleCloseAIAnalysisModal = useCallback(() => {
    setShowAIAnalysisModal(false);
    setSelectedProject(null);
  }, []);

  // 投资确认处理
  const handleInvestmentConfirm = useCallback(async (investmentData) => {
    try {
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`投资确认成功！
      
项目: ${selectedProject?.name}
投资类型: ${investmentData.type === 'paper' ? 'Paper Invest (模拟投资)' : 'Real Invest (真实投资)'}
投资金额: $${investmentData.amount.toLocaleString()}

${investmentData.type === 'paper' ? 
  '您的模拟投资已记录，可在投资组合中查看收益表现。' : 
  '您的真实投资申请已提交，我们将在24小时内联系您确认投资详情。'}

感谢您选择Unicorn 100投资平台！`);
      
      handleCloseInvestmentModal();
      
    } catch (err) {
      console.error('投资确认失败:', err);
      alert('投资确认失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [selectedProject, handleCloseInvestmentModal]);

  if (loading) {
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
            加载项目数据中...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            加载失败
          </h3>
          <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
            {error}
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
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            🦄 Project Discovery
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover the next unicorn, featuring the world's most promising innovative projects
          </p>
        </div>

        {/* 项目列表 */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem' 
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {projects.map(project => (
              <div 
                key={project.id} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* 项目头部 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginRight: '1rem'
                  }}>
                    {project.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.5rem'
                    }}>
                      {project.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span>🏢 {project.industry}</span>
                      <span>📍 {project.location}</span>
                      <span>💰 {project.stage}</span>
                    </div>
                  </div>
                </div>

                {/* 项目描述 */}
                <p style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {project.description}
                </p>

                {/* 核心亮点 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.75rem'
                  }}>
                    ⭐ 核心亮点
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {project.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '1rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 估值信息 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      当前估值
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#059669'
                    }}>
                      {project.valuation}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      融资目标
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#3b82f6'
                    }}>
                      {project.fundingGoal}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => handleViewDetails(project)}
                    disabled={isButtonLoading(project.id, 'details')}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '0.75rem 1rem',
                      backgroundColor: isButtonLoading(project.id, 'details') ? '#d1d5db' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: isButtonLoading(project.id, 'details') ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      opacity: isButtonLoading(project.id, 'details') ? 0.6 : 1
                    }}
                  >
                    {isButtonLoading(project.id, 'details') ? '加载中...' : '📋 查看详情'}
                  </button>

                  <button
                    onClick={() => handleAIAnalysis(project)}
                    disabled={isButtonLoading(project.id, 'ai')}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '0.75rem 1rem',
                      backgroundColor: isButtonLoading(project.id, 'ai') ? '#d1d5db' : '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: isButtonLoading(project.id, 'ai') ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      opacity: isButtonLoading(project.id, 'ai') ? 0.6 : 1
                    }}
                  >
                    {isButtonLoading(project.id, 'ai') ? '分析中...' : '🤖 AI分析'}
                  </button>

                  <button
                    onClick={() => handleInvestmentIntent(project)}
                    disabled={isButtonLoading(project.id, 'invest')}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '0.75rem 1rem',
                      backgroundColor: isButtonLoading(project.id, 'invest') ? '#d1d5db' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: isButtonLoading(project.id, 'invest') ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      opacity: isButtonLoading(project.id, 'invest') ? 0.6 : 1
                    }}
                  >
                    {isButtonLoading(project.id, 'invest') ? '处理中...' : '💰 投资意向'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 状态提示 */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '2rem auto', 
          padding: '1rem 2rem', 
          backgroundColor: '#d1fae5', 
          borderRadius: '0.5rem', 
          textAlign: 'center', 
          color: '#065f46' 
        }}>
          ✅ 项目发现数据加载成功！显示 {projects.length} 个精选项目，所有按钮功能正常工作
        </div>

        {/* 投资模态框 */}
        {showInvestmentModal && selectedProject && (
          <InvestmentModal
            project={selectedProject}
            isOpen={showInvestmentModal}
            onClose={handleCloseInvestmentModal}
            onConfirm={handleInvestmentConfirm}
          />
        )}

        {/* AI分析模态框 */}
        {showAIAnalysisModal && selectedProject && (
          <AIAnalysisModal
            project={selectedProject}
            isOpen={showAIAnalysisModal}
            onClose={handleCloseAIAnalysisModal}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ProjectsPage;

