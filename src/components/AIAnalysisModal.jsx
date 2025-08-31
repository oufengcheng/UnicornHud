import React, { useState, useEffect } from 'react';
import { projectEvaluationAgent, investmentMatchingAgent, smartRecommendationEngine } from '../services/aiService';

const AIAnalysisModal = ({ isOpen, onClose, project, analysisType = 'evaluation' }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && project) {
      performAnalysis();
    }
  }, [isOpen, project, analysisType]);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (analysisType) {
        case 'evaluation':
          result = await projectEvaluationAgent.evaluateProject(project);
          break;
        case 'matching':
          const mockInvestor = { id: 'user_123' }; // Should get from user authentication in practice
          result = await investmentMatchingAgent.findMatches(mockInvestor, [project]);
          break;
        case 'recommendation':
          result = await smartRecommendationEngine.generateRecommendations('user_123', { project_context: project });
          break;
        default:
          result = await projectEvaluationAgent.evaluateProject(project);
      }
      
      setAnalysis(result);
    } catch (err) {
      console.error('AI analysis failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score) => {
    return (score || 0).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return '#10b981'; // green
    if (score >= 7.0) return '#f59e0b'; // yellow
    if (score >= 5.5) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getRecommendationColor = (level) => {
    const colors = {
      'STRONG_BUY': '#10b981',
      'BUY': '#22c55e',
      'HOLD': '#f59e0b',
      'WEAK_HOLD': '#f97316',
      'SELL': '#ef4444',
      'HIGHLY_RECOMMENDED': '#10b981',
      'RECOMMENDED': '#22c55e',
      'CONSIDER': '#f59e0b',
      'NOT_RECOMMENDED': '#ef4444'
    };
    return colors[level] || '#6b7280';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 模态框头部 */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-3xl mr-3">🤖</span>
            AI智能分析 - {project?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">AI正在分析项目，请稍候...</p>
              <p className="text-sm text-gray-500 mt-2">
                正在运行多维度评估算法，预计需要3-5秒
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">分析失败</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={performAnalysis}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                重新分析
              </button>
            </div>
          )}

          {analysis && !loading && !error && (
            <div>
              {/* 分析类型标签 */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'overview', label: '总览', icon: '📊' },
                  { id: 'detailed', label: '详细评分', icon: '📈' },
                  { id: 'insights', label: 'AI洞察', icon: '🧠' },
                  { id: 'recommendations', label: '投资建议', icon: '💡' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 总览标签 */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 综合评分 */}
                  <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">AI综合评分</h3>
                    <div className="flex items-center justify-center space-x-8">
                      <div className="text-center">
                        <div 
                          className="text-6xl font-bold mb-2"
                          style={{ color: getScoreColor(analysis.overall_score) }}
                        >
                          {formatScore(analysis.overall_score)}
                        </div>
                        <div className="text-gray-600">/ 10.0</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-gray-600 mb-2">评估维度</div>
                        <div className="space-y-1 text-sm">
                          <div>🏢 团队: {formatScore(analysis.detailed_scores?.team)}</div>
                          <div>📈 市场: {formatScore(analysis.detailed_scores?.market)}</div>
                          <div>⚡ 技术: {formatScore(analysis.detailed_scores?.technology)}</div>
                          <div>💼 商业: {formatScore(analysis.detailed_scores?.business)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 投资建议 */}
                  {analysis.recommendation && (
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <span className="mr-2">🎯</span>
                        AI投资建议
                      </h4>
                      <div className="flex items-center space-x-4 mb-3">
                        <span 
                          className="px-3 py-1 rounded-full text-white text-sm font-medium"
                          style={{ backgroundColor: getRecommendationColor(analysis.recommendation.level) }}
                        >
                          {analysis.recommendation.message}
                        </span>
                        <span className="text-sm text-gray-600">
                          置信度: {Math.round((analysis.confidence_level || 0.8) * 100)}%
                        </span>
                      </div>
                      <p className="text-gray-700">{analysis.recommendation.reasoning}</p>
                    </div>
                  )}

                  {/* 核心优势 */}
                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold mb-3 text-green-800 flex items-center">
                        <span className="mr-2">✅</span>
                        核心优势
                      </h4>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span className="text-green-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 风险提示 */}
                  {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-semibold mb-3 text-yellow-800 flex items-center">
                        <span className="mr-2">⚠️</span>
                        需要关注的风险
                      </h4>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-600 mr-2">•</span>
                            <span className="text-yellow-700">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 详细评分标签 */}
              {activeTab === 'detailed' && analysis.detailed_scores && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">详细评分分析</h3>
                  {Object.entries(analysis.detailed_scores).map(([category, score]) => {
                    const categoryNames = {
                      team: '团队评估',
                      market: '市场分析',
                      technology: '技术评估',
                      business: '商业模式',
                      financial: '财务状况',
                      risk: '风险评估'
                    };
                    
                    const categoryIcons = {
                      team: '👥',
                      market: '📊',
                      technology: '⚡',
                      business: '💼',
                      financial: '💰',
                      risk: '🛡️'
                    };

                    return (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium flex items-center">
                            <span className="mr-2">{categoryIcons[category]}</span>
                            {categoryNames[category]}
                          </span>
                          <span 
                            className="text-xl font-bold"
                            style={{ color: getScoreColor(score) }}
                          >
                            {formatScore(score)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(score / 10) * 100}%`,
                              backgroundColor: getScoreColor(score)
                            }}
                          ></div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {this.getScoreDescription(category, score)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* AI洞察标签 */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">AI深度洞察</h3>
                  
                  {/* 投资论点 */}
                  {analysis.investment_thesis && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold mb-3 text-blue-800 flex items-center">
                        <span className="mr-2">📝</span>
                        投资论点
                      </h4>
                      <p className="text-blue-700 leading-relaxed">{analysis.investment_thesis}</p>
                    </div>
                  )}

                  {/* AI分析方法 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <span className="mr-2">🔬</span>
                      分析方法说明
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">评估维度</h5>
                        <ul className="space-y-1 text-gray-600">
                          <li>• 团队评估 (25%权重)</li>
                          <li>• 市场分析 (20%权重)</li>
                          <li>• 技术评估 (20%权重)</li>
                          <li>• 商业模式 (15%权重)</li>
                          <li>• 财务状况 (10%权重)</li>
                          <li>• 风险评估 (10%权重)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">AI算法特点</h5>
                        <ul className="space-y-1 text-gray-600">
                          <li>• 多维度综合评估</li>
                          <li>• 行业对标分析</li>
                          <li>• 历史数据学习</li>
                          <li>• 实时模型优化</li>
                          <li>• 风险量化评估</li>
                          <li>• 投资成功率预测</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 数据来源 */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-3 text-purple-800 flex items-center">
                      <span className="mr-2">📊</span>
                      数据来源与可信度
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">公开数据</h5>
                        <p className="text-gray-600">公司官网、新闻报道、行业报告</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">平台数据</h5>
                        <p className="text-gray-600">用户行为、投资记录、评价反馈</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">AI模型</h5>
                        <p className="text-gray-600">机器学习算法、预测模型、风险评估</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-purple-700">
                      <strong>置信度: {Math.round((analysis.confidence_level || 0.8) * 100)}%</strong>
                      <span className="ml-2">基于数据完整性和模型准确性计算</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 投资建议标签 */}
              {activeTab === 'recommendations' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">AI投资建议</h3>
                  
                  {/* 投资建议总结 */}
                  {analysis.recommendation && (
                    <div 
                      className="border-l-4 p-6 rounded-r-lg"
                      style={{ 
                        borderColor: getRecommendationColor(analysis.recommendation.level),
                        backgroundColor: `${getRecommendationColor(analysis.recommendation.level)}10`
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">
                          {analysis.recommendation.message}
                        </h4>
                        <span 
                          className="px-3 py-1 rounded-full text-white text-sm font-medium"
                          style={{ backgroundColor: getRecommendationColor(analysis.recommendation.level) }}
                        >
                          {analysis.recommendation.level}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{analysis.recommendation.reasoning}</p>
                      
                      {/* 建议投资金额 */}
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-medium mb-2">建议投资策略</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">建议投资金额:</span>
                            <div className="font-semibold">$50,000 - $100,000</div>
                          </div>
                          <div>
                            <span className="text-gray-600">投资时机:</span>
                            <div className="font-semibold">当前轮次</div>
                          </div>
                          <div>
                            <span className="text-gray-600">预期回报:</span>
                            <div className="font-semibold">5-10x (3-5年)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 风险管理建议 */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-3 text-yellow-800 flex items-center">
                      <span className="mr-2">🛡️</span>
                      风险管理建议
                    </h4>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li>• 建议投资金额不超过投资组合的5-10%</li>
                      <li>• 密切关注项目的里程碑进展</li>
                      <li>• 定期评估市场环境变化</li>
                      <li>• 考虑分阶段投资降低风险</li>
                      <li>• 保持与项目团队的定期沟通</li>
                    </ul>
                  </div>

                  {/* 后续行动建议 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-3 text-green-800 flex items-center">
                      <span className="mr-2">🎯</span>
                      后续行动建议
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                        <div>
                          <div className="font-medium">深入尽职调查</div>
                          <div className="text-green-700">详细了解团队背景、技术细节、财务状况</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                        <div>
                          <div className="font-medium">市场验证</div>
                          <div className="text-green-700">验证市场需求、竞争格局、商业模式可行性</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                        <div>
                          <div className="font-medium">投资决策</div>
                          <div className="text-green-700">基于分析结果制定投资策略和条款</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  关闭分析
                </button>
                <button
                  onClick={() => {
                    // 跳转到投资页面
                    onClose();
                    // 这里可以触发投资模态框
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  立即投资
                </button>
                <button
                  onClick={performAnalysis}
                  className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                >
                  重新分析
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 获取评分描述的辅助函数
const getScoreDescription = (category, score) => {
  const descriptions = {
    team: {
      high: '团队经验丰富，执行能力强',
      medium: '团队基础良好，有提升空间',
      low: '团队需要加强或补充关键人才'
    },
    market: {
      high: '市场机会巨大，时机成熟',
      medium: '市场前景良好，竞争适中',
      low: '市场挑战较大，需谨慎评估'
    },
    technology: {
      high: '技术领先，创新性强',
      medium: '技术可行，有一定优势',
      low: '技术风险较高，需要验证'
    },
    business: {
      high: '商业模式清晰，盈利能力强',
      medium: '商业模式可行，需要优化',
      low: '商业模式不明确，风险较高'
    },
    financial: {
      high: '财务状况健康，增长强劲',
      medium: '财务表现良好，增长稳定',
      low: '财务压力较大，需要关注'
    },
    risk: {
      high: '风险控制良好，投资相对安全',
      medium: '风险适中，需要持续监控',
      low: '风险较高，需要谨慎投资'
    }
  };

  const level = score >= 7.5 ? 'high' : score >= 5.5 ? 'medium' : 'low';
  return descriptions[category]?.[level] || '评估中...';
};

export default AIAnalysisModal;

