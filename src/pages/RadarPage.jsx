import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radar, Brain, TrendingUp, Target, Zap, Star, AlertTriangle } from 'lucide-react';

const RadarPage = () => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  const fetchAIAnalysis = async () => {
    try {
      const response = await fetch('https://8xhpiqcqnwyz.manus.space/api/radar');
      const data = await response.json();
      if (data.success) {
        setAiAnalysis(data.data);
      }
    } catch (error) {
      console.error('获取AI分析数据失败:', error);
      // 使用模拟数据
      setAiAnalysis({
        trending_projects: [
          {
            id: 1,
            name: "QuantumAI Labs",
            ai_score: 95,
            growth_potential: 92,
            risk_assessment: "中等",
            trend_direction: "上升",
            key_signals: ["技术突破", "团队扩张", "合作伙伴增加"],
            logo: "🧠"
          },
          {
            id: 2,
            name: "BioNano Therapeutics", 
            ai_score: 88,
            growth_potential: 94,
            risk_assessment: "高",
            trend_direction: "上升",
            key_signals: ["FDA认证", "临床试验进展", "投资人关注"],
            logo: "🧬"
          },
          {
            id: 3,
            name: "GreenTech Energy",
            ai_score: 82,
            growth_potential: 85,
            risk_assessment: "低",
            trend_direction: "稳定",
            key_signals: ["政策支持", "市场需求", "技术成熟"],
            logo: "⚡"
          }
        ],
        market_insights: {
          hot_sectors: ["人工智能", "生物技术", "清洁能源", "金融科技"],
          emerging_trends: ["量子计算", "基因编辑", "碳中和", "Web3"],
          investment_climate: "积极",
          risk_level: "中等"
        },
        ai_recommendations: [
          {
            type: "投资机会",
            title: "AI驱动的医疗诊断",
            confidence: 89,
            reasoning: "技术成熟度高，市场需求强劲，监管环境友好"
          },
          {
            type: "风险警告", 
            title: "加密货币相关项目",
            confidence: 76,
            reasoning: "监管不确定性增加，市场波动性大"
          },
          {
            type: "新兴机会",
            title: "可持续发展技术",
            confidence: 84,
            reasoning: "政策支持力度大，ESG投资趋势明显"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case '低': return 'text-green-600 bg-green-100';
      case '中等': return 'text-yellow-600 bg-yellow-100';
      case '高': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case '上升': return <TrendingUp className="text-green-600" size={16} />;
      case '下降': return <TrendingUp className="text-red-600 rotate-180" size={16} />;
      default: return <Target className="text-blue-600" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <div className="text-lg text-gray-600">AI投研引擎分析中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Radar className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unicorn Radar</h1>
              <p className="text-lg text-gray-600">AI驱动的投研引擎，智能发现投资机会</p>
            </div>
          </div>
        </div>

        {/* AI Analysis Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Brain className="text-purple-600" size={20} />
                <div>
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-gray-600">AI准确率</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="text-blue-600" size={20} />
                <div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-gray-600">项目分析</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-600" size={20} />
                <div>
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm text-gray-600">成功预测</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="text-orange-600" size={20} />
                <div>
                  <div className="text-2xl font-bold">实时</div>
                  <div className="text-sm text-gray-600">数据更新</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <span>AI推荐项目</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiAnalysis.trending_projects.map((project) => (
                    <div 
                      key={project.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{project.logo}</div>
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getRiskColor(project.risk_assessment)}>
                                {project.risk_assessment}风险
                              </Badge>
                              <div className="flex items-center space-x-1">
                                {getTrendIcon(project.trend_direction)}
                                <span className="text-sm text-gray-600">{project.trend_direction}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-500 fill-current" size={16} />
                            <span className="font-bold">{project.ai_score}</span>
                          </div>
                          <div className="text-sm text-gray-600">AI评分</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>增长潜力</span>
                          <span>{project.growth_potential}%</span>
                        </div>
                        <Progress value={project.growth_potential} className="h-2" />
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-2">关键信号</div>
                        <div className="flex flex-wrap gap-1">
                          {project.key_signals.map((signal, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {signal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Insights & AI Recommendations */}
          <div className="space-y-6">
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="text-purple-600" size={20} />
                  <span>市场洞察</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">热门赛道</h4>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.market_insights.hot_sectors.map((sector, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">新兴趋势</h4>
                    <div className="flex flex-wrap gap-1">
                      {aiAnalysis.market_insights.emerging_trends.map((trend, index) => (
                        <Badge key={index} variant="outline">
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">投资环境</span>
                      <Badge className="bg-green-100 text-green-800">
                        {aiAnalysis.market_insights.investment_climate}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="text-orange-600" size={20} />
                  <span>AI建议</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiAnalysis.ai_recommendations.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {rec.type === '风险警告' ? (
                            <AlertTriangle className="text-red-500" size={16} />
                          ) : (
                            <Target className="text-blue-500" size={16} />
                          )}
                          <span className="font-semibold text-sm">{rec.type}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {rec.confidence}% 置信度
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              获取详细报告
            </Button>
            <Button variant="outline">
              自定义分析
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarPage;

