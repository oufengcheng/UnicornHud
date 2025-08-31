// AI智能服务模块 - 实现项目评估、投资撮合和智能推荐功能

// 项目评估AI Agent
export class ProjectEvaluationAgent {
  constructor() {
    this.modelWeights = {
      team: 0.25,        // 团队评估权重
      market: 0.20,      // 市场分析权重
      technology: 0.20,  // 技术评估权重
      business: 0.15,    // 商业模式权重
      financial: 0.10,   // 财务状况权重
      risk: 0.10         // 风险评估权重
    };
    
    this.learningData = this.loadLearningData();
  }

  // 综合项目评估
  async evaluateProject(project) {
    try {
      console.log('AI评估项目:', project.name);
      
      // 1. 团队评估
      const teamScore = await this.evaluateTeam(project);
      
      // 2. 市场分析
      const marketScore = await this.evaluateMarket(project);
      
      // 3. 技术评估
      const technologyScore = await this.evaluateTechnology(project);
      
      // 4. 商业模式评估
      const businessScore = await this.evaluateBusiness(project);
      
      // 5. 财务评估
      const financialScore = await this.evaluateFinancial(project);
      
      // 6. 风险评估
      const riskScore = await this.evaluateRisk(project);
      
      // 7. 计算综合评分
      const overallScore = this.calculateOverallScore({
        team: teamScore,
        market: marketScore,
        technology: technologyScore,
        business: businessScore,
        financial: financialScore,
        risk: riskScore
      });
      
      // 8. 生成评估报告
      const evaluation = {
        project_id: project.id,
        project_name: project.name,
        overall_score: overallScore,
        detailed_scores: {
          team: teamScore,
          market: marketScore,
          technology: technologyScore,
          business: businessScore,
          financial: financialScore,
          risk: riskScore
        },
        recommendation: this.generateRecommendation(overallScore),
        strengths: this.identifyStrengths(project, {
          team: teamScore,
          market: marketScore,
          technology: technologyScore,
          business: businessScore,
          financial: financialScore,
          risk: riskScore
        }),
        weaknesses: this.identifyWeaknesses(project, {
          team: teamScore,
          market: marketScore,
          technology: technologyScore,
          business: businessScore,
          financial: financialScore,
          risk: riskScore
        }),
        investment_thesis: this.generateInvestmentThesis(project, overallScore),
        confidence_level: this.calculateConfidence(project),
        evaluation_date: new Date(),
        ai_version: '1.0'
      };
      
      // 9. 保存评估结果用于学习
      await this.saveEvaluationForLearning(evaluation);
      
      return evaluation;
    } catch (error) {
      console.error('项目评估失败:', error);
      return {
        project_id: project.id,
        error: error.message,
        overall_score: 0,
        confidence_level: 0
      };
    }
  }

  // 团队评估
  async evaluateTeam(project) {
    const factors = {
      founder_experience: this.analyzeFounderExperience(project),
      team_completeness: this.analyzeTeamCompleteness(project),
      domain_expertise: this.analyzeDomainExpertise(project),
      execution_track_record: this.analyzeExecutionRecord(project),
      advisory_board: this.analyzeAdvisoryBoard(project)
    };
    
    const weights = { founder_experience: 0.3, team_completeness: 0.25, domain_expertise: 0.2, execution_track_record: 0.15, advisory_board: 0.1 };
    
    return this.calculateWeightedScore(factors, weights);
  }

  // 市场分析
  async evaluateMarket(project) {
    const factors = {
      market_size: this.analyzeMarketSize(project),
      market_growth: this.analyzeMarketGrowth(project),
      competition: this.analyzeCompetition(project),
      market_timing: this.analyzeMarketTiming(project),
      customer_validation: this.analyzeCustomerValidation(project)
    };
    
    const weights = { market_size: 0.25, market_growth: 0.2, competition: 0.2, market_timing: 0.2, customer_validation: 0.15 };
    
    return this.calculateWeightedScore(factors, weights);
  }

  // 技术评估
  async evaluateTechnology(project) {
    const factors = {
      innovation_level: this.analyzeTechnicalInnovation(project),
      technical_feasibility: this.analyzeTechnicalFeasibility(project),
      ip_protection: this.analyzeIPProtection(project),
      scalability: this.analyzeTechnicalScalability(project),
      competitive_moat: this.analyzeTechnicalMoat(project)
    };
    
    const weights = { innovation_level: 0.25, technical_feasibility: 0.2, ip_protection: 0.2, scalability: 0.2, competitive_moat: 0.15 };
    
    return this.calculateWeightedScore(factors, weights);
  }

  // 商业模式评估
  async evaluateBusiness(project) {
    const factors = {
      revenue_model: this.analyzeRevenueModel(project),
      unit_economics: this.analyzeUnitEconomics(project),
      scalability: this.analyzeBusinessScalability(project),
      customer_acquisition: this.analyzeCustomerAcquisition(project),
      monetization: this.analyzeMonetization(project)
    };
    
    const weights = { revenue_model: 0.25, unit_economics: 0.25, scalability: 0.2, customer_acquisition: 0.15, monetization: 0.15 };
    
    return this.calculateWeightedScore(factors, weights);
  }

  // 财务评估
  async evaluateFinancial(project) {
    const factors = {
      revenue_growth: this.analyzeRevenueGrowth(project),
      burn_rate: this.analyzeBurnRate(project),
      runway: this.analyzeRunway(project),
      funding_efficiency: this.analyzeFundingEfficiency(project),
      financial_projections: this.analyzeFinancialProjections(project)
    };
    
    const weights = { revenue_growth: 0.3, burn_rate: 0.2, runway: 0.2, funding_efficiency: 0.15, financial_projections: 0.15 };
    
    return this.calculateWeightedScore(factors, weights);
  }

  // 风险评估
  async evaluateRisk(project) {
    const factors = {
      market_risk: this.analyzeMarketRisk(project),
      technology_risk: this.analyzeTechnologyRisk(project),
      execution_risk: this.analyzeExecutionRisk(project),
      competitive_risk: this.analyzeCompetitiveRisk(project),
      regulatory_risk: this.analyzeRegulatoryRisk(project)
    };
    
    const weights = { market_risk: 0.25, technology_risk: 0.2, execution_risk: 0.2, competitive_risk: 0.2, regulatory_risk: 0.15 };
    
    // 风险评分需要反转（风险越低，评分越高）
    const riskScore = this.calculateWeightedScore(factors, weights);
    return 10 - riskScore; // 反转评分
  }

  // 计算综合评分
  calculateOverallScore(scores) {
    let totalScore = 0;
    for (const [category, score] of Object.entries(scores)) {
      totalScore += score * this.modelWeights[category];
    }
    return Math.round(totalScore * 10) / 10; // 保留一位小数
  }

  // 生成投资建议
  generateRecommendation(score) {
    if (score >= 8.5) {
      return {
        level: 'STRONG_BUY',
        message: '强烈推荐投资',
        reasoning: '项目在多个维度表现优异，具有成为独角兽的巨大潜力'
      };
    } else if (score >= 7.5) {
      return {
        level: 'BUY',
        message: '推荐投资',
        reasoning: '项目整体表现良好，具有较高的投资价值'
      };
    } else if (score >= 6.5) {
      return {
        level: 'HOLD',
        message: '谨慎考虑',
        reasoning: '项目有一定潜力，但存在需要关注的风险点'
      };
    } else if (score >= 5.0) {
      return {
        level: 'WEAK_HOLD',
        message: '不建议投资',
        reasoning: '项目存在较多风险，投资回报不确定性较高'
      };
    } else {
      return {
        level: 'SELL',
        message: '强烈不推荐',
        reasoning: '项目风险过高，不建议投资'
      };
    }
  }

  // 识别项目优势
  identifyStrengths(project, scores) {
    const strengths = [];
    
    if (scores.team >= 8.0) {
      strengths.push('优秀的创始团队和执行能力');
    }
    if (scores.market >= 8.0) {
      strengths.push('巨大的市场机会和良好的市场时机');
    }
    if (scores.technology >= 8.0) {
      strengths.push('领先的技术创新和强大的技术壁垒');
    }
    if (scores.business >= 8.0) {
      strengths.push('清晰可行的商业模式和盈利路径');
    }
    if (scores.financial >= 8.0) {
      strengths.push('健康的财务状况和高效的资金使用');
    }
    if (scores.risk <= 3.0) {
      strengths.push('较低的投资风险和良好的风险控制');
    }
    
    return strengths;
  }

  // 识别项目弱点
  identifyWeaknesses(project, scores) {
    const weaknesses = [];
    
    if (scores.team <= 5.0) {
      weaknesses.push('团队经验不足或关键岗位缺失');
    }
    if (scores.market <= 5.0) {
      weaknesses.push('市场规模有限或竞争过于激烈');
    }
    if (scores.technology <= 5.0) {
      weaknesses.push('技术创新性不足或技术风险较高');
    }
    if (scores.business <= 5.0) {
      weaknesses.push('商业模式不清晰或盈利能力存疑');
    }
    if (scores.financial <= 5.0) {
      weaknesses.push('财务状况不佳或资金使用效率低');
    }
    if (scores.risk >= 7.0) {
      weaknesses.push('投资风险较高，需要密切关注');
    }
    
    return weaknesses;
  }

  // 生成投资论点
  generateInvestmentThesis(project, score) {
    const industry = project.industry || '科技';
    const stage = project.stage || 'A轮';
    
    if (score >= 8.0) {
      return `${project.name}是${industry}领域的优秀项目，在${stage}阶段展现出强劲的增长潜力。项目具备优秀的团队、巨大的市场机会和领先的技术优势，有望成为该领域的独角兽企业。建议重点关注并积极投资。`;
    } else if (score >= 6.5) {
      return `${project.name}在${industry}领域具有一定的竞争优势，${stage}阶段的表现符合预期。项目在某些方面表现突出，但也存在需要改进的地方。建议适度投资并持续跟踪项目发展。`;
    } else {
      return `${project.name}作为${industry}领域的${stage}项目，目前还面临一些挑战。项目需要在团队建设、市场拓展或技术创新等方面进一步提升。建议谨慎投资或等待项目进一步成熟。`;
    }
  }

  // 计算置信度
  calculateConfidence(project) {
    // 基于数据完整性和历史准确性计算置信度
    let confidence = 0.7; // 基础置信度
    
    // 数据完整性加分
    if (project.team_info) confidence += 0.1;
    if (project.financial_data) confidence += 0.1;
    if (project.market_data) confidence += 0.05;
    if (project.technology_details) confidence += 0.05;
    
    return Math.min(confidence, 0.95); // 最高95%置信度
  }

  // 分析函数（模拟实现）
  analyzeFounderExperience(project) {
    // 模拟创始人经验分析
    const experienceFactors = {
      'AI': 8.5, 'FinTech': 8.0, 'BioTech': 9.0, 'CleanTech': 7.5, 'E-commerce': 7.0, 'Aerospace': 8.8
    };
    return experienceFactors[project.industry] || 7.0;
  }

  analyzeTeamCompleteness(project) {
    // 模拟团队完整性分析
    return Math.random() * 3 + 7; // 7-10分
  }

  analyzeDomainExpertise(project) {
    // 模拟领域专业性分析
    return Math.random() * 2 + 7.5; // 7.5-9.5分
  }

  analyzeExecutionRecord(project) {
    // 模拟执行记录分析
    return Math.random() * 2.5 + 6.5; // 6.5-9分
  }

  analyzeAdvisoryBoard(project) {
    // 模拟顾问团队分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeMarketSize(project) {
    // 模拟市场规模分析
    const marketSizes = {
      'AI': 9.0, 'FinTech': 8.5, 'BioTech': 8.0, 'CleanTech': 8.5, 'E-commerce': 7.5, 'Aerospace': 7.0
    };
    return marketSizes[project.industry] || 7.5;
  }

  analyzeMarketGrowth(project) {
    // 模拟市场增长分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeCompetition(project) {
    // 模拟竞争分析
    return Math.random() * 3 + 6; // 6-9分
  }

  analyzeMarketTiming(project) {
    // 模拟市场时机分析
    return Math.random() * 2.5 + 7; // 7-9.5分
  }

  analyzeCustomerValidation(project) {
    // 模拟客户验证分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeTechnicalInnovation(project) {
    // 模拟技术创新分析
    const innovationScores = {
      'AI': 9.0, 'BioTech': 8.8, 'Aerospace': 8.5, 'CleanTech': 8.0, 'FinTech': 7.5, 'E-commerce': 6.5
    };
    return innovationScores[project.industry] || 7.0;
  }

  analyzeTechnicalFeasibility(project) {
    // 模拟技术可行性分析
    return Math.random() * 2 + 7.5; // 7.5-9.5分
  }

  analyzeIPProtection(project) {
    // 模拟知识产权保护分析
    return Math.random() * 3 + 6; // 6-9分
  }

  analyzeTechnicalScalability(project) {
    // 模拟技术可扩展性分析
    return Math.random() * 2.5 + 7; // 7-9.5分
  }

  analyzeTechnicalMoat(project) {
    // 模拟技术护城河分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeRevenueModel(project) {
    // 模拟收入模式分析
    return Math.random() * 2.5 + 6.5; // 6.5-9分
  }

  analyzeUnitEconomics(project) {
    // 模拟单位经济效益分析
    return Math.random() * 3 + 6; // 6-9分
  }

  analyzeBusinessScalability(project) {
    // 模拟商业可扩展性分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeCustomerAcquisition(project) {
    // 模拟客户获取分析
    return Math.random() * 2.5 + 6.5; // 6.5-9分
  }

  analyzeMonetization(project) {
    // 模拟变现能力分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeRevenueGrowth(project) {
    // 模拟收入增长分析
    return Math.random() * 3 + 6; // 6-9分
  }

  analyzeBurnRate(project) {
    // 模拟烧钱率分析
    return Math.random() * 2.5 + 6.5; // 6.5-9分
  }

  analyzeRunway(project) {
    // 模拟资金跑道分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeFundingEfficiency(project) {
    // 模拟融资效率分析
    return Math.random() * 2.5 + 6.5; // 6.5-9分
  }

  analyzeFinancialProjections(project) {
    // 模拟财务预测分析
    return Math.random() * 2 + 7; // 7-9分
  }

  analyzeMarketRisk(project) {
    // 模拟市场风险分析
    return Math.random() * 3 + 4; // 4-7分（风险分数）
  }

  analyzeTechnologyRisk(project) {
    // 模拟技术风险分析
    return Math.random() * 3 + 4; // 4-7分
  }

  analyzeExecutionRisk(project) {
    // 模拟执行风险分析
    return Math.random() * 3 + 4; // 4-7分
  }

  analyzeCompetitiveRisk(project) {
    // 模拟竞争风险分析
    return Math.random() * 3 + 4; // 4-7分
  }

  analyzeRegulatoryRisk(project) {
    // 模拟监管风险分析
    const regulatoryRisks = {
      'FinTech': 6.5, 'BioTech': 6.0, 'AI': 5.5, 'CleanTech': 5.0, 'E-commerce': 4.5, 'Aerospace': 6.0
    };
    return regulatoryRisks[project.industry] || 5.0;
  }

  // 计算加权评分
  calculateWeightedScore(factors, weights) {
    let totalScore = 0;
    for (const [factor, score] of Object.entries(factors)) {
      totalScore += score * weights[factor];
    }
    return totalScore;
  }

  // 保存评估结果用于学习
  async saveEvaluationForLearning(evaluation) {
    const learningKey = 'ai_learning_data';
    const existingData = JSON.parse(localStorage.getItem(learningKey) || '[]');
    existingData.push({
      ...evaluation,
      timestamp: Date.now()
    });
    
    // 只保留最近1000条记录
    if (existingData.length > 1000) {
      existingData.splice(0, existingData.length - 1000);
    }
    
    localStorage.setItem(learningKey, JSON.stringify(existingData));
  }

  // 加载学习数据
  loadLearningData() {
    const learningKey = 'ai_learning_data';
    return JSON.parse(localStorage.getItem(learningKey) || '[]');
  }

  // 自我学习和模型优化
  async optimizeModel() {
    const learningData = this.loadLearningData();
    
    if (learningData.length < 10) {
      console.log('学习数据不足，跳过模型优化');
      return;
    }

    // 分析历史评估的准确性
    const accuracyAnalysis = this.analyzeHistoricalAccuracy(learningData);
    
    // 根据准确性调整模型权重
    if (accuracyAnalysis.team_accuracy < 0.7) {
      this.modelWeights.team *= 0.9; // 降低团队评估权重
    }
    if (accuracyAnalysis.market_accuracy > 0.8) {
      this.modelWeights.market *= 1.1; // 提高市场分析权重
    }
    
    // 重新归一化权重
    const totalWeight = Object.values(this.modelWeights).reduce((sum, weight) => sum + weight, 0);
    for (const key in this.modelWeights) {
      this.modelWeights[key] /= totalWeight;
    }
    
    console.log('AI模型权重已优化:', this.modelWeights);
  }

  // 分析历史准确性
  analyzeHistoricalAccuracy(learningData) {
    // 模拟准确性分析
    return {
      team_accuracy: Math.random() * 0.3 + 0.6,    // 60%-90%
      market_accuracy: Math.random() * 0.3 + 0.6,  // 60%-90%
      technology_accuracy: Math.random() * 0.3 + 0.6,
      business_accuracy: Math.random() * 0.3 + 0.6,
      financial_accuracy: Math.random() * 0.3 + 0.6,
      risk_accuracy: Math.random() * 0.3 + 0.6
    };
  }
}

// 投资撮合AI Agent
export class InvestmentMatchingAgent {
  constructor() {
    this.matchingAlgorithm = 'collaborative_filtering_v2';
    this.learningData = this.loadMatchingData();
  }

  // 智能投资撮合
  async findMatches(investor, projects) {
    try {
      console.log('AI撮合分析，投资者:', investor.id);
      
      // 1. 分析投资者画像
      const investorProfile = await this.analyzeInvestorProfile(investor);
      
      // 2. 项目匹配分析
      const projectMatches = [];
      
      for (const project of projects) {
        const matchScore = await this.calculateMatchScore(investorProfile, project);
        const matchReasons = this.generateMatchReasons(investorProfile, project, matchScore);
        
        projectMatches.push({
          project: project,
          match_score: matchScore,
          match_reasons: matchReasons,
          investment_recommendation: this.generateInvestmentRecommendation(matchScore),
          success_probability: this.calculateSuccessProbability(investorProfile, project),
          recommended_amount: this.recommendInvestmentAmount(investorProfile, project),
          risk_assessment: this.assessInvestmentRisk(investorProfile, project)
        });
      }
      
      // 3. 按匹配度排序
      projectMatches.sort((a, b) => b.match_score - a.match_score);
      
      // 4. 生成撮合报告
      const matchingReport = {
        investor_id: investor.id,
        total_projects: projects.length,
        top_matches: projectMatches.slice(0, 5),
        all_matches: projectMatches,
        matching_strategy: this.explainMatchingStrategy(investorProfile),
        confidence_level: this.calculateMatchingConfidence(projectMatches),
        generated_at: new Date(),
        ai_version: '1.0'
      };
      
      // 5. 保存撮合结果用于学习
      await this.saveMatchingForLearning(matchingReport);
      
      return matchingReport;
    } catch (error) {
      console.error('投资撮合失败:', error);
      return {
        investor_id: investor.id,
        error: error.message,
        top_matches: [],
        confidence_level: 0
      };
    }
  }

  // 分析投资者画像
  async analyzeInvestorProfile(investor) {
    return {
      investment_preferences: this.analyzeInvestmentPreferences(investor),
      risk_tolerance: this.analyzeRiskTolerance(investor),
      investment_stage_preference: this.analyzeStagePreference(investor),
      industry_focus: this.analyzeIndustryFocus(investor),
      geographic_preference: this.analyzeGeographicPreference(investor),
      investment_size_range: this.analyzeInvestmentSizeRange(investor),
      investment_style: this.analyzeInvestmentStyle(investor),
      success_criteria: this.analyzeSuccessCriteria(investor)
    };
  }

  // 计算匹配分数
  async calculateMatchScore(investorProfile, project) {
    const factors = {
      industry_match: this.calculateIndustryMatch(investorProfile, project),
      stage_match: this.calculateStageMatch(investorProfile, project),
      risk_match: this.calculateRiskMatch(investorProfile, project),
      size_match: this.calculateSizeMatch(investorProfile, project),
      geographic_match: this.calculateGeographicMatch(investorProfile, project),
      style_match: this.calculateStyleMatch(investorProfile, project),
      criteria_match: this.calculateCriteriaMatch(investorProfile, project)
    };
    
    const weights = {
      industry_match: 0.25,
      stage_match: 0.20,
      risk_match: 0.15,
      size_match: 0.15,
      geographic_match: 0.10,
      style_match: 0.10,
      criteria_match: 0.05
    };
    
    let totalScore = 0;
    for (const [factor, score] of Object.entries(factors)) {
      totalScore += score * weights[factor];
    }
    
    return Math.round(totalScore * 10) / 10;
  }

  // 生成匹配原因
  generateMatchReasons(investorProfile, project, matchScore) {
    const reasons = [];
    
    if (this.calculateIndustryMatch(investorProfile, project) >= 8.0) {
      reasons.push(`行业匹配度高：${project.industry}是您关注的重点领域`);
    }
    
    if (this.calculateStageMatch(investorProfile, project) >= 8.0) {
      reasons.push(`融资阶段符合：${project.stage}符合您的投资偏好`);
    }
    
    if (this.calculateRiskMatch(investorProfile, project) >= 8.0) {
      reasons.push('风险水平匹配：项目风险水平符合您的风险承受能力');
    }
    
    if (this.calculateSizeMatch(investorProfile, project) >= 8.0) {
      reasons.push('投资规模合适：项目融资需求符合您的投资规模');
    }
    
    if (project.unicorn_score >= 8.5) {
      reasons.push(`独角兽潜力突出：AI评分${project.unicorn_score}/10`);
    }
    
    return reasons;
  }

  // 生成投资建议
  generateInvestmentRecommendation(matchScore) {
    if (matchScore >= 8.5) {
      return {
        level: 'HIGHLY_RECOMMENDED',
        message: '强烈推荐投资',
        action: '建议优先考虑，快速决策'
      };
    } else if (matchScore >= 7.5) {
      return {
        level: 'RECOMMENDED',
        message: '推荐投资',
        action: '建议深入尽调，积极跟进'
      };
    } else if (matchScore >= 6.5) {
      return {
        level: 'CONSIDER',
        message: '可以考虑',
        action: '建议进一步了解，谨慎评估'
      };
    } else {
      return {
        level: 'NOT_RECOMMENDED',
        message: '不建议投资',
        action: '匹配度较低，建议关注其他项目'
      };
    }
  }

  // 计算成功概率
  calculateSuccessProbability(investorProfile, project) {
    // 基于历史数据和项目特征计算成功概率
    let baseProbability = 0.15; // 基础成功率15%
    
    // 行业调整
    const industryMultipliers = {
      'AI': 1.3, 'BioTech': 1.1, 'FinTech': 1.2, 'CleanTech': 1.1, 'E-commerce': 0.9, 'Aerospace': 1.0
    };
    baseProbability *= industryMultipliers[project.industry] || 1.0;
    
    // 阶段调整
    const stageMultipliers = {
      '种子轮': 0.8, 'A轮': 1.0, 'B轮': 1.2, 'C轮': 1.4
    };
    baseProbability *= stageMultipliers[project.stage] || 1.0;
    
    // 独角兽评分调整
    if (project.unicorn_score >= 8.5) {
      baseProbability *= 1.5;
    } else if (project.unicorn_score >= 7.5) {
      baseProbability *= 1.2;
    }
    
    return Math.min(baseProbability, 0.85); // 最高85%成功率
  }

  // 推荐投资金额
  recommendInvestmentAmount(investorProfile, project) {
    const baseAmount = investorProfile.investment_size_range.preferred || 100000;
    const projectValuation = project.valuation || 50000000;
    
    // 基于项目估值和投资者偏好计算推荐金额
    let recommendedAmount = Math.min(baseAmount, projectValuation * 0.05); // 不超过5%股份
    
    // 根据匹配度调整
    const matchScore = this.calculateMatchScore(investorProfile, project);
    if (matchScore >= 8.5) {
      recommendedAmount *= 1.2; // 高匹配度增加20%
    } else if (matchScore <= 6.5) {
      recommendedAmount *= 0.8; // 低匹配度减少20%
    }
    
    return {
      recommended_amount: Math.round(recommendedAmount),
      min_amount: Math.round(recommendedAmount * 0.5),
      max_amount: Math.round(recommendedAmount * 2),
      reasoning: '基于您的投资偏好和项目匹配度计算'
    };
  }

  // 评估投资风险
  assessInvestmentRisk(investorProfile, project) {
    const riskFactors = {
      market_risk: this.assessMarketRisk(project),
      team_risk: this.assessTeamRisk(project),
      technology_risk: this.assessTechnologyRisk(project),
      financial_risk: this.assessFinancialRisk(project),
      competitive_risk: this.assessCompetitiveRisk(project)
    };
    
    const overallRisk = Object.values(riskFactors).reduce((sum, risk) => sum + risk, 0) / Object.keys(riskFactors).length;
    
    return {
      overall_risk_level: this.categorizeRisk(overallRisk),
      risk_factors: riskFactors,
      risk_mitigation: this.suggestRiskMitigation(riskFactors),
      investor_risk_tolerance_match: this.matchRiskTolerance(investorProfile.risk_tolerance, overallRisk)
    };
  }

  // 匹配计算函数（模拟实现）
  calculateIndustryMatch(investorProfile, project) {
    const focusIndustries = investorProfile.industry_focus || [];
    if (focusIndustries.includes(project.industry)) {
      return 9.0 + Math.random(); // 9-10分
    } else if (focusIndustries.length === 0) {
      return 7.0 + Math.random() * 2; // 7-9分（通用投资者）
    } else {
      return 4.0 + Math.random() * 3; // 4-7分（非关注领域）
    }
  }

  calculateStageMatch(investorProfile, project) {
    const preferredStages = investorProfile.investment_stage_preference || [];
    if (preferredStages.includes(project.stage)) {
      return 8.5 + Math.random() * 1.5; // 8.5-10分
    } else {
      return 5.0 + Math.random() * 3; // 5-8分
    }
  }

  calculateRiskMatch(investorProfile, project) {
    const riskTolerance = investorProfile.risk_tolerance || 'medium';
    const projectRisk = this.assessProjectRisk(project);
    
    if (riskTolerance === 'high' && projectRisk >= 7) {
      return 8.0 + Math.random() * 2; // 8-10分
    } else if (riskTolerance === 'medium' && projectRisk >= 5 && projectRisk <= 7) {
      return 8.0 + Math.random() * 2; // 8-10分
    } else if (riskTolerance === 'low' && projectRisk <= 5) {
      return 8.0 + Math.random() * 2; // 8-10分
    } else {
      return 4.0 + Math.random() * 4; // 4-8分
    }
  }

  calculateSizeMatch(investorProfile, project) {
    const sizeRange = investorProfile.investment_size_range || { min: 10000, max: 1000000 };
    const projectNeed = project.funding_need || 500000;
    
    if (projectNeed >= sizeRange.min && projectNeed <= sizeRange.max) {
      return 8.5 + Math.random() * 1.5; // 8.5-10分
    } else {
      return 5.0 + Math.random() * 3; // 5-8分
    }
  }

  calculateGeographicMatch(investorProfile, project) {
    const geoPreference = investorProfile.geographic_preference || [];
    if (geoPreference.length === 0 || geoPreference.includes(project.location)) {
      return 8.0 + Math.random() * 2; // 8-10分
    } else {
      return 6.0 + Math.random() * 2; // 6-8分
    }
  }

  calculateStyleMatch(investorProfile, project) {
    // 模拟投资风格匹配
    return 7.0 + Math.random() * 2; // 7-9分
  }

  calculateCriteriaMatch(investorProfile, project) {
    // 模拟成功标准匹配
    return 7.5 + Math.random() * 1.5; // 7.5-9分
  }

  // 分析函数（模拟实现）
  analyzeInvestmentPreferences(investor) {
    return {
      preferred_industries: ['AI', 'FinTech', 'BioTech'],
      preferred_stages: ['A轮', 'B轮'],
      investment_horizon: '3-5年'
    };
  }

  analyzeRiskTolerance(investor) {
    return 'medium'; // 'low', 'medium', 'high'
  }

  analyzeStagePreference(investor) {
    return ['A轮', 'B轮'];
  }

  analyzeIndustryFocus(investor) {
    return ['AI', 'FinTech'];
  }

  analyzeGeographicPreference(investor) {
    return ['北美', '欧洲', '亚洲'];
  }

  analyzeInvestmentSizeRange(investor) {
    return {
      min: 50000,
      max: 500000,
      preferred: 200000
    };
  }

  analyzeInvestmentStyle(investor) {
    return 'growth'; // 'value', 'growth', 'balanced'
  }

  analyzeSuccessCriteria(investor) {
    return {
      target_return: '10x',
      exit_timeline: '5年',
      success_metrics: ['revenue_growth', 'market_share', 'profitability']
    };
  }

  assessProjectRisk(project) {
    // 模拟项目风险评估
    const riskScores = {
      'AI': 6.5, 'FinTech': 5.5, 'BioTech': 7.0, 'CleanTech': 6.0, 'E-commerce': 5.0, 'Aerospace': 6.5
    };
    return riskScores[project.industry] || 6.0;
  }

  assessMarketRisk(project) {
    return Math.random() * 3 + 4; // 4-7分
  }

  assessTeamRisk(project) {
    return Math.random() * 3 + 4; // 4-7分
  }

  assessTechnologyRisk(project) {
    return Math.random() * 3 + 4; // 4-7分
  }

  assessFinancialRisk(project) {
    return Math.random() * 3 + 4; // 4-7分
  }

  assessCompetitiveRisk(project) {
    return Math.random() * 3 + 4; // 4-7分
  }

  categorizeRisk(riskScore) {
    if (riskScore <= 3) return 'LOW';
    if (riskScore <= 5) return 'MEDIUM';
    if (riskScore <= 7) return 'HIGH';
    return 'VERY_HIGH';
  }

  suggestRiskMitigation(riskFactors) {
    const suggestions = [];
    
    if (riskFactors.market_risk > 6) {
      suggestions.push('建议深入市场调研，验证市场需求');
    }
    if (riskFactors.team_risk > 6) {
      suggestions.push('建议评估团队经验，考虑增加顾问');
    }
    if (riskFactors.technology_risk > 6) {
      suggestions.push('建议技术尽调，评估技术可行性');
    }
    
    return suggestions;
  }

  matchRiskTolerance(tolerance, projectRisk) {
    const toleranceScores = { 'low': 3, 'medium': 5, 'high': 7 };
    const toleranceScore = toleranceScores[tolerance] || 5;
    
    return Math.abs(toleranceScore - projectRisk) <= 2;
  }

  explainMatchingStrategy(investorProfile) {
    return `基于您的投资偏好（${investorProfile.industry_focus.join(', ')}行业，${investorProfile.investment_stage_preference.join(', ')}阶段），我们使用协同过滤算法为您匹配最适合的投资项目。`;
  }

  calculateMatchingConfidence(projectMatches) {
    if (projectMatches.length === 0) return 0;
    
    const avgScore = projectMatches.reduce((sum, match) => sum + match.match_score, 0) / projectMatches.length;
    return Math.min(avgScore / 10, 0.95);
  }

  // 保存撮合结果用于学习
  async saveMatchingForLearning(matchingReport) {
    const learningKey = 'ai_matching_data';
    const existingData = JSON.parse(localStorage.getItem(learningKey) || '[]');
    existingData.push({
      ...matchingReport,
      timestamp: Date.now()
    });
    
    // 只保留最近500条记录
    if (existingData.length > 500) {
      existingData.splice(0, existingData.length - 500);
    }
    
    localStorage.setItem(learningKey, JSON.stringify(existingData));
  }

  // 加载撮合数据
  loadMatchingData() {
    const learningKey = 'ai_matching_data';
    return JSON.parse(localStorage.getItem(learningKey) || '[]');
  }
}

// 智能推荐引擎
export class SmartRecommendationEngine {
  constructor() {
    this.recommendationModel = 'hybrid_v2';
    this.userBehaviorData = this.loadUserBehaviorData();
  }

  // 生成个性化推荐
  async generateRecommendations(userId, context = {}) {
    try {
      console.log('生成个性化推荐，用户:', userId);
      
      // 1. 分析用户行为
      const userProfile = await this.analyzeUserBehavior(userId);
      
      // 2. 内容基础推荐
      const contentBasedRecs = await this.generateContentBasedRecommendations(userProfile);
      
      // 3. 协同过滤推荐
      const collaborativeRecs = await this.generateCollaborativeRecommendations(userId);
      
      // 4. 混合推荐
      const hybridRecs = this.combineRecommendations(contentBasedRecs, collaborativeRecs);
      
      // 5. 实时调整
      const finalRecs = this.applyRealTimeAdjustments(hybridRecs, context);
      
      // 6. 生成推荐报告
      const recommendations = {
        user_id: userId,
        recommendations: finalRecs,
        recommendation_strategy: this.explainRecommendationStrategy(userProfile),
        confidence_scores: this.calculateConfidenceScores(finalRecs),
        diversity_score: this.calculateDiversityScore(finalRecs),
        freshness_score: this.calculateFreshnessScore(finalRecs),
        generated_at: new Date(),
        context: context,
        ai_version: '1.0'
      };
      
      // 7. 保存推荐结果用于学习
      await this.saveRecommendationForLearning(recommendations);
      
      return recommendations;
    } catch (error) {
      console.error('生成推荐失败:', error);
      return {
        user_id: userId,
        error: error.message,
        recommendations: [],
        confidence_scores: []
      };
    }
  }

  // 分析用户行为
  async analyzeUserBehavior(userId) {
    const behaviorData = this.getUserBehaviorData(userId);
    
    return {
      viewing_history: this.analyzeViewingHistory(behaviorData),
      investment_history: this.analyzeInvestmentHistory(userId),
      search_patterns: this.analyzeSearchPatterns(behaviorData),
      interaction_patterns: this.analyzeInteractionPatterns(behaviorData),
      preference_signals: this.extractPreferenceSignals(behaviorData),
      engagement_level: this.calculateEngagementLevel(behaviorData),
      user_segment: this.classifyUserSegment(behaviorData)
    };
  }

  // 内容基础推荐
  async generateContentBasedRecommendations(userProfile) {
    const recommendations = [];
    
    // 基于用户偏好推荐相似项目
    const preferredIndustries = userProfile.preference_signals.industries || [];
    const preferredStages = userProfile.preference_signals.stages || [];
    
    // 模拟推荐项目
    const projects = await this.getAvailableProjects();
    
    for (const project of projects) {
      let score = 0;
      
      // 行业匹配
      if (preferredIndustries.includes(project.industry)) {
        score += 3;
      }
      
      // 阶段匹配
      if (preferredStages.includes(project.stage)) {
        score += 2;
      }
      
      // 独角兽评分加权
      score += project.unicorn_score * 0.5;
      
      // 用户历史行为加权
      if (userProfile.viewing_history.includes(project.industry)) {
        score += 1;
      }
      
      recommendations.push({
        project: project,
        score: score,
        reason: 'content_based',
        explanation: `基于您对${project.industry}行业的兴趣推荐`
      });
    }
    
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  // 协同过滤推荐
  async generateCollaborativeRecommendations(userId) {
    const recommendations = [];
    
    // 找到相似用户
    const similarUsers = await this.findSimilarUsers(userId);
    
    // 基于相似用户的行为推荐
    for (const similarUser of similarUsers) {
      const userInvestments = this.getUserInvestments(similarUser.user_id);
      
      for (const investment of userInvestments) {
        const project = await this.getProjectById(investment.project_id);
        if (project && !this.hasUserInvested(userId, project.id)) {
          recommendations.push({
            project: project,
            score: similarUser.similarity * investment.rating,
            reason: 'collaborative',
            explanation: `与您投资偏好相似的用户也投资了这个项目`
          });
        }
      }
    }
    
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  // 混合推荐
  combineRecommendations(contentBased, collaborative) {
    const combined = [];
    const projectMap = new Map();
    
    // 合并内容基础推荐
    for (const rec of contentBased) {
      const projectId = rec.project.id;
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          project: rec.project,
          content_score: rec.score,
          collaborative_score: 0,
          reasons: [rec.reason],
          explanations: [rec.explanation]
        });
      }
    }
    
    // 合并协同过滤推荐
    for (const rec of collaborative) {
      const projectId = rec.project.id;
      if (projectMap.has(projectId)) {
        const existing = projectMap.get(projectId);
        existing.collaborative_score = rec.score;
        existing.reasons.push(rec.reason);
        existing.explanations.push(rec.explanation);
      } else {
        projectMap.set(projectId, {
          project: rec.project,
          content_score: 0,
          collaborative_score: rec.score,
          reasons: [rec.reason],
          explanations: [rec.explanation]
        });
      }
    }
    
    // 计算混合评分
    for (const [projectId, data] of projectMap) {
      const hybridScore = data.content_score * 0.6 + data.collaborative_score * 0.4;
      combined.push({
        project: data.project,
        hybrid_score: hybridScore,
        content_score: data.content_score,
        collaborative_score: data.collaborative_score,
        reasons: data.reasons,
        explanations: data.explanations
      });
    }
    
    return combined.sort((a, b) => b.hybrid_score - a.hybrid_score);
  }

  // 实时调整
  applyRealTimeAdjustments(recommendations, context) {
    return recommendations.map(rec => {
      let adjustedScore = rec.hybrid_score;
      
      // 时间因素调整
      if (context.time_of_day === 'evening') {
        adjustedScore *= 1.1; // 晚上用户更活跃
      }
      
      // 设备因素调整
      if (context.device === 'mobile') {
        adjustedScore *= 0.95; // 移动端稍微降权
      }
      
      // 新项目加权
      const daysSinceCreated = (Date.now() - new Date(rec.project.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated <= 7) {
        adjustedScore *= 1.2; // 新项目加权
      }
      
      return {
        ...rec,
        final_score: adjustedScore
      };
    }).sort((a, b) => b.final_score - a.final_score);
  }

  // 解释推荐策略
  explainRecommendationStrategy(userProfile) {
    const segment = userProfile.user_segment;
    const strategies = {
      'new_user': '基于热门项目和多样化推荐，帮助您探索不同投资机会',
      'active_investor': '基于您的投资历史和偏好，推荐相似的高质量项目',
      'passive_browser': '基于您的浏览行为，推荐您可能感兴趣的项目',
      'expert_investor': '基于深度分析和专业指标，推荐符合您投资策略的项目'
    };
    
    return strategies[segment] || '基于AI算法为您个性化推荐';
  }

  // 计算置信度分数
  calculateConfidenceScores(recommendations) {
    return recommendations.map(rec => {
      let confidence = 0.5; // 基础置信度
      
      // 基于评分调整
      confidence += (rec.final_score / 10) * 0.3;
      
      // 基于推荐原因调整
      if (rec.reasons.includes('content_based') && rec.reasons.includes('collaborative')) {
        confidence += 0.2; // 混合推荐更可信
      }
      
      return Math.min(confidence, 0.95);
    });
  }

  // 计算多样性分数
  calculateDiversityScore(recommendations) {
    const industries = new Set();
    const stages = new Set();
    
    for (const rec of recommendations) {
      industries.add(rec.project.industry);
      stages.add(rec.project.stage);
    }
    
    return (industries.size + stages.size) / (recommendations.length * 2);
  }

  // 计算新鲜度分数
  calculateFreshnessScore(recommendations) {
    const now = Date.now();
    let totalFreshness = 0;
    
    for (const rec of recommendations) {
      const daysSinceCreated = (now - new Date(rec.project.created_at).getTime()) / (1000 * 60 * 60 * 24);
      const freshness = Math.max(0, 1 - daysSinceCreated / 30); // 30天内为新鲜
      totalFreshness += freshness;
    }
    
    return totalFreshness / recommendations.length;
  }

  // 辅助函数（模拟实现）
  getUserBehaviorData(userId) {
    const behaviorKey = `user_behavior_${userId}`;
    return JSON.parse(localStorage.getItem(behaviorKey) || '{}');
  }

  analyzeViewingHistory(behaviorData) {
    return behaviorData.viewed_projects || [];
  }

  analyzeInvestmentHistory(userId) {
    const accountKey = `investment_account_${userId}`;
    const account = JSON.parse(localStorage.getItem(accountKey) || '{}');
    return account.portfolio || [];
  }

  analyzeSearchPatterns(behaviorData) {
    return behaviorData.search_queries || [];
  }

  analyzeInteractionPatterns(behaviorData) {
    return {
      clicks: behaviorData.clicks || 0,
      time_spent: behaviorData.time_spent || 0,
      pages_visited: behaviorData.pages_visited || 0
    };
  }

  extractPreferenceSignals(behaviorData) {
    return {
      industries: ['AI', 'FinTech'], // 模拟偏好
      stages: ['A轮', 'B轮'],
      risk_level: 'medium'
    };
  }

  calculateEngagementLevel(behaviorData) {
    const clicks = behaviorData.clicks || 0;
    const timeSpent = behaviorData.time_spent || 0;
    
    if (clicks > 50 && timeSpent > 3600) return 'high';
    if (clicks > 20 && timeSpent > 1800) return 'medium';
    return 'low';
  }

  classifyUserSegment(behaviorData) {
    const investmentHistory = this.analyzeInvestmentHistory(behaviorData.user_id);
    const engagementLevel = this.calculateEngagementLevel(behaviorData);
    
    if (investmentHistory.length === 0) return 'new_user';
    if (investmentHistory.length > 10) return 'expert_investor';
    if (engagementLevel === 'high') return 'active_investor';
    return 'passive_browser';
  }

  async getAvailableProjects() {
    // 模拟获取可用项目
    return [
      { id: 'ai-startup-1', name: 'AI Vision Pro', industry: 'AI', stage: 'A轮', unicorn_score: 8.5, created_at: new Date() },
      { id: 'fintech-2', name: 'FinTech Solutions', industry: 'FinTech', stage: 'Seed', unicorn_score: 8.0, created_at: new Date() },
      { id: 'biotech-3', name: 'BioInnovate', industry: 'BioTech', stage: 'B轮', unicorn_score: 9.2, created_at: new Date() }
    ];
  }

  async findSimilarUsers(userId) {
    // 模拟找到相似用户
    return [
      { user_id: 'user_456', similarity: 0.85 },
      { user_id: 'user_789', similarity: 0.78 }
    ];
  }

  getUserInvestments(userId) {
    // 模拟获取用户投资
    return [
      { project_id: 'ai-startup-1', rating: 4.5 },
      { project_id: 'fintech-2', rating: 4.0 }
    ];
  }

  async getProjectById(projectId) {
    const projects = await this.getAvailableProjects();
    return projects.find(p => p.id === projectId);
  }

  hasUserInvested(userId, projectId) {
    const investmentHistory = this.analyzeInvestmentHistory(userId);
    return investmentHistory.some(inv => inv.project_id === projectId);
  }

  // 保存推荐结果用于学习
  async saveRecommendationForLearning(recommendations) {
    const learningKey = 'ai_recommendation_data';
    const existingData = JSON.parse(localStorage.getItem(learningKey) || '[]');
    existingData.push({
      ...recommendations,
      timestamp: Date.now()
    });
    
    // 只保留最近300条记录
    if (existingData.length > 300) {
      existingData.splice(0, existingData.length - 300);
    }
    
    localStorage.setItem(learningKey, JSON.stringify(existingData));
  }

  loadUserBehaviorData() {
    const behaviorKey = 'user_behavior_data';
    return JSON.parse(localStorage.getItem(behaviorKey) || '{}');
  }
}

// 导出AI服务实例
export const projectEvaluationAgent = new ProjectEvaluationAgent();
export const investmentMatchingAgent = new InvestmentMatchingAgent();
export const smartRecommendationEngine = new SmartRecommendationEngine();

