// VC Radar智能撮合服务
import apiClient from './apiClient';

class VCRadarService {
  constructor() {
    this.matchingDimensions = [
      { name: 'industry', weight: 0.25, label: '行业匹配' },
      { name: 'stage', weight: 0.20, label: '投资阶段' },
      { name: 'geography', weight: 0.15, label: '地理位置' },
      { name: 'checkSize', weight: 0.15, label: '投资金额' },
      { name: 'portfolio', weight: 0.10, label: '投资组合' },
      { name: 'timeline', weight: 0.10, label: '投资时间' },
      { name: 'strategy', weight: 0.05, label: '投资策略' }
    ];
  }

  // 智能撮合分析
  async performSmartMatching(project, vcFirm, userProfile = {}) {
    try {
      // 模拟AI分析过程
      await this.simulateAIProcessing();
      
      // 计算多维度匹配度
      const matchingScores = this.calculateMatchingScores(project, vcFirm, userProfile);
      
      // 生成综合评分
      const overallScore = this.calculateOverallScore(matchingScores);
      
      // 生成AI洞察和建议
      const insights = this.generateAIInsights(project, vcFirm, matchingScores, overallScore);
      
      // 预测成功概率
      const successProbability = this.predictSuccessProbability(overallScore, matchingScores);
      
      // 生成推荐理由
      const recommendations = this.generateRecommendations(matchingScores, insights);
      
      return {
        overallScore,
        matchingScores,
        insights,
        successProbability,
        recommendations,
        analysisTimestamp: new Date().toISOString(),
        confidence: this.calculateConfidence(matchingScores)
      };
    } catch (error) {
      console.error('智能撮合分析失败:', error);
      throw new Error('AI分析服务暂时不可用，请稍后重试');
    }
  }

  // 模拟AI处理过程
  async simulateAIProcessing() {
    const stages = [
      { message: '正在分析项目特征...', duration: 800 },
      { message: '匹配投资机构偏好...', duration: 1000 },
      { message: '计算多维度相似度...', duration: 700 },
      { message: '生成AI洞察建议...', duration: 500 }
    ];

    for (const stage of stages) {
      await this.delay(stage.duration);
      // 这里可以发送进度更新事件
      if (typeof window !== 'undefined' && window.updateAIProgress) {
        window.updateAIProgress(stage.message);
      }
    }
  }

  // 计算多维度匹配分数
  calculateMatchingScores(project, vcFirm, userProfile) {
    const scores = {};

    // 行业匹配度
    scores.industry = this.calculateIndustryMatch(project.industry, vcFirm.focusAreas);
    
    // 投资阶段匹配度
    scores.stage = this.calculateStageMatch(project.stage, vcFirm.investmentStages);
    
    // 地理位置匹配度
    scores.geography = this.calculateGeographyMatch(project.location, vcFirm.geographicFocus);
    
    // 投资金额匹配度
    scores.checkSize = this.calculateCheckSizeMatch(project.fundingGoal, vcFirm.typicalCheckSize);
    
    // 投资组合匹配度
    scores.portfolio = this.calculatePortfolioMatch(project, vcFirm.portfolio);
    
    // 投资时间匹配度
    scores.timeline = this.calculateTimelineMatch(project.urgency, vcFirm.decisionSpeed);
    
    // 投资策略匹配度
    scores.strategy = this.calculateStrategyMatch(project.businessModel, vcFirm.investmentStrategy);

    return scores;
  }

  // 行业匹配度计算
  calculateIndustryMatch(projectIndustry, vcFocusAreas) {
    const industryMap = {
      '人工智能': ['AI', '机器学习', '深度学习', '人工智能'],
      '生物技术': ['生物技术', '医疗健康', '制药', '生命科学'],
      '清洁能源': ['清洁能源', '新能源', '环保', '可持续发展'],
      '航空航天': ['航空航天', '太空技术', '卫星', '火箭'],
      '金融科技': ['金融科技', 'FinTech', '区块链', '数字支付'],
      '教育科技': ['教育科技', 'EdTech', '在线教育', '教育平台']
    };

    const projectKeywords = industryMap[projectIndustry] || [projectIndustry];
    let maxMatch = 0;

    for (const focusArea of vcFocusAreas) {
      for (const keyword of projectKeywords) {
        if (focusArea.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(focusArea.toLowerCase())) {
          maxMatch = Math.max(maxMatch, 0.9);
        }
      }
    }

    // 如果没有直接匹配，计算相关性
    if (maxMatch === 0) {
      maxMatch = this.calculateSemanticSimilarity(projectIndustry, vcFocusAreas);
    }

    return Math.min(maxMatch + Math.random() * 0.1, 1.0);
  }

  // 投资阶段匹配度计算
  calculateStageMatch(projectStage, vcStages) {
    const stageMap = {
      '种子轮': ['种子轮', 'Seed', 'Pre-Seed'],
      'A轮': ['A轮', 'Series A', 'A系列'],
      'B轮': ['B轮', 'Series B', 'B系列'],
      'C轮': ['C轮', 'Series C', 'C系列']
    };

    const projectStageKeywords = stageMap[projectStage] || [projectStage];
    
    for (const vcStage of vcStages) {
      for (const keyword of projectStageKeywords) {
        if (vcStage.toLowerCase().includes(keyword.toLowerCase())) {
          return 0.85 + Math.random() * 0.15;
        }
      }
    }

    return 0.3 + Math.random() * 0.4;
  }

  // 地理位置匹配度计算
  calculateGeographyMatch(projectLocation, vcGeography) {
    const locationMap = {
      '旧金山': ['旧金山', 'San Francisco', '硅谷', 'Silicon Valley', '加州', 'California'],
      '波士顿': ['波士顿', 'Boston', '马萨诸塞', 'Massachusetts', '东海岸'],
      '纽约': ['纽约', 'New York', 'NYC', '东海岸'],
      '洛杉矶': ['洛杉矶', 'Los Angeles', 'LA', '加州', 'California'],
      '西雅图': ['西雅图', 'Seattle', '华盛顿州', 'Washington'],
      '奥斯汀': ['奥斯汀', 'Austin', '德克萨斯', 'Texas']
    };

    const projectLocationKeywords = locationMap[projectLocation] || [projectLocation];
    
    for (const geoFocus of vcGeography) {
      for (const keyword of projectLocationKeywords) {
        if (geoFocus.toLowerCase().includes(keyword.toLowerCase())) {
          return 0.8 + Math.random() * 0.2;
        }
      }
    }

    // 全球投资机构
    if (vcGeography.includes('全球') || vcGeography.includes('Global')) {
      return 0.7 + Math.random() * 0.2;
    }

    return 0.4 + Math.random() * 0.3;
  }

  // 投资金额匹配度计算
  calculateCheckSizeMatch(fundingGoal, typicalCheckSize) {
    const goalAmount = this.parseAmount(fundingGoal);
    const checkAmount = this.parseAmount(typicalCheckSize);
    
    if (goalAmount === 0 || checkAmount === 0) return 0.5;
    
    const ratio = Math.min(goalAmount, checkAmount) / Math.max(goalAmount, checkAmount);
    return Math.max(0.3, ratio * 0.9 + Math.random() * 0.1);
  }

  // 解析金额字符串
  parseAmount(amountStr) {
    if (!amountStr) return 0;
    
    const cleanStr = amountStr.replace(/[$,\s]/g, '');
    const multiplier = cleanStr.includes('M') ? 1000000 : 
                     cleanStr.includes('K') ? 1000 : 1;
    
    const number = parseFloat(cleanStr.replace(/[MK]/g, ''));
    return isNaN(number) ? 0 : number * multiplier;
  }

  // 投资组合匹配度计算
  calculatePortfolioMatch(project, vcPortfolio) {
    // 基于投资机构的历史投资组合计算匹配度
    let matchScore = 0.5; // 基础分数
    
    // 模拟基于投资组合的相似性分析
    if (vcPortfolio && vcPortfolio.length > 0) {
      const industryMatch = vcPortfolio.some(company => 
        company.industry === project.industry
      );
      
      if (industryMatch) {
        matchScore += 0.3;
      }
      
      const stageMatch = vcPortfolio.some(company => 
        company.stage === project.stage
      );
      
      if (stageMatch) {
        matchScore += 0.2;
      }
    }
    
    return Math.min(matchScore + Math.random() * 0.1, 1.0);
  }

  // 投资时间匹配度计算
  calculateTimelineMatch(projectUrgency, vcDecisionSpeed) {
    // 模拟时间匹配度计算
    const urgencyScore = projectUrgency === 'urgent' ? 0.8 : 0.6;
    const speedScore = vcDecisionSpeed === 'fast' ? 0.9 : 0.7;
    
    return (urgencyScore + speedScore) / 2 + Math.random() * 0.1;
  }

  // 投资策略匹配度计算
  calculateStrategyMatch(projectBusinessModel, vcStrategy) {
    // 模拟策略匹配度计算
    return 0.6 + Math.random() * 0.3;
  }

  // 语义相似度计算
  calculateSemanticSimilarity(term1, terms2) {
    // 简化的语义相似度计算
    const keywords1 = term1.toLowerCase().split(/\s+/);
    
    for (const term2 of terms2) {
      const keywords2 = term2.toLowerCase().split(/\s+/);
      
      for (const k1 of keywords1) {
        for (const k2 of keywords2) {
          if (k1.includes(k2) || k2.includes(k1)) {
            return 0.4 + Math.random() * 0.3;
          }
        }
      }
    }
    
    return 0.1 + Math.random() * 0.2;
  }

  // 计算综合评分
  calculateOverallScore(matchingScores) {
    let totalScore = 0;
    
    for (const dimension of this.matchingDimensions) {
      const score = matchingScores[dimension.name] || 0;
      totalScore += score * dimension.weight;
    }
    
    return Math.round(totalScore * 100) / 100;
  }

  // 预测成功概率
  predictSuccessProbability(overallScore, matchingScores) {
    // 基于综合评分和关键维度计算成功概率
    const keyFactors = [
      matchingScores.industry * 0.3,
      matchingScores.stage * 0.25,
      matchingScores.checkSize * 0.2,
      overallScore * 0.25
    ];
    
    const baseProbability = keyFactors.reduce((sum, factor) => sum + factor, 0);
    const adjustedProbability = Math.min(baseProbability * 0.8 + 0.1, 0.95);
    
    return Math.round(adjustedProbability * 100);
  }

  // 计算置信度
  calculateConfidence(matchingScores) {
    const scores = Object.values(matchingScores);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    
    // 置信度与方差成反比
    const confidence = Math.max(0.6, 1 - variance);
    return Math.round(confidence * 100);
  }

  // 生成AI洞察
  generateAIInsights(project, vcFirm, matchingScores, overallScore) {
    const insights = [];
    
    // 基于匹配分数生成洞察
    if (matchingScores.industry > 0.8) {
      insights.push({
        type: 'strength',
        title: '行业高度匹配',
        content: `${vcFirm.name}在${project.industry}领域有深厚投资经验，与项目高度匹配`
      });
    }
    
    if (matchingScores.stage > 0.8) {
      insights.push({
        type: 'strength',
        title: '投资阶段契合',
        content: `该机构专注${project.stage}投资，正是项目当前所需的资金阶段`
      });
    }
    
    if (matchingScores.checkSize < 0.5) {
      insights.push({
        type: 'concern',
        title: '投资金额考量',
        content: '项目融资需求与机构典型投资金额存在差异，需要进一步沟通'
      });
    }
    
    if (overallScore > 0.8) {
      insights.push({
        type: 'opportunity',
        title: '高匹配度机会',
        content: '综合评估显示这是一个高潜力的投资撮合机会，建议优先接触'
      });
    }
    
    return insights;
  }

  // 生成推荐建议
  generateRecommendations(matchingScores, insights) {
    const recommendations = [];
    
    // 基于分析结果生成具体建议
    if (matchingScores.industry > 0.7) {
      recommendations.push({
        priority: 'high',
        action: '强调行业经验',
        description: '在接触时重点展示项目在该行业的独特优势和技术创新'
      });
    }
    
    if (matchingScores.portfolio > 0.6) {
      recommendations.push({
        priority: 'medium',
        action: '参考投资组合',
        description: '研究该机构的类似投资案例，了解其投资偏好和成功模式'
      });
    }
    
    recommendations.push({
      priority: 'high',
      action: '准备详细商业计划',
      description: '基于匹配分析结果，定制化准备针对该机构的商业计划书'
    });
    
    recommendations.push({
      priority: 'medium',
      action: '寻找内部推荐',
      description: '通过网络寻找该机构的内部推荐人，提高接触成功率'
    });
    
    return recommendations;
  }

  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 获取VC机构数据
  getVCFirmData(firmId) {
    // 模拟VC机构数据
    const vcFirms = {
      1: {
        id: 1,
        name: "Sequoia Capital",
        focusAreas: ["AI", "企业软件", "消费科技"],
        investmentStages: ["种子轮", "A轮", "B轮"],
        geographicFocus: ["硅谷", "全球"],
        typicalCheckSize: "$5M-50M",
        decisionSpeed: "fast",
        investmentStrategy: "growth",
        portfolio: [
          { name: "Google", industry: "人工智能", stage: "A轮" },
          { name: "Apple", industry: "消费科技", stage: "种子轮" }
        ]
      },
      2: {
        id: 2,
        name: "Andreessen Horowitz",
        focusAreas: ["区块链", "生物技术", "AI"],
        investmentStages: ["A轮", "B轮", "C轮"],
        geographicFocus: ["硅谷", "纽约"],
        typicalCheckSize: "$10M-100M",
        decisionSpeed: "medium",
        investmentStrategy: "disruptive",
        portfolio: [
          { name: "Coinbase", industry: "金融科技", stage: "B轮" },
          { name: "Facebook", industry: "社交网络", stage: "A轮" }
        ]
      },
      3: {
        id: 3,
        name: "Kleiner Perkins",
        focusAreas: ["清洁能源", "医疗健康", "教育科技"],
        investmentStages: ["种子轮", "A轮"],
        geographicFocus: ["硅谷", "波士顿"],
        typicalCheckSize: "$2M-25M",
        decisionSpeed: "slow",
        investmentStrategy: "sustainable",
        portfolio: [
          { name: "Tesla", industry: "清洁能源", stage: "A轮" },
          { name: "Coursera", industry: "教育科技", stage: "种子轮" }
        ]
      }
    };
    
    return vcFirms[firmId] || null;
  }
}

// 创建全局服务实例
const vcRadarService = new VCRadarService();

export default vcRadarService;

