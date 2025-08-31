/**
 * 市场数据服务
 * 提供独角兽市场数据的获取、处理和分析功能
 * 支持实时数据更新和历史数据分析
 */

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
    this.apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  // 获取市场概览数据
  async getMarketOverview() {
    const cacheKey = 'market_overview';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // 模拟API调用，实际应该从后端获取
      const data = await this.fetchMarketOverview();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to get market overview:', error);
      // 返回模拟数据作为fallback
      return this.getMockMarketOverview();
    }
  }

  // 获取行业分布数据
  async getIndustryDistribution() {
    const cacheKey = 'industry_distribution';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchIndustryDistribution();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to get industry distribution:', error);
      return this.getMockIndustryDistribution();
    }
  }

  // 获取地区分布数据
  async getRegionalDistribution() {
    const cacheKey = 'regional_distribution';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchRegionalDistribution();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('获取地区分布失败:', error);
      return this.getMockRegionalDistribution();
    }
  }

  // 获取融资趋势数据
  async getFundingTrends() {
    const cacheKey = 'funding_trends';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchFundingTrends();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('获取融资趋势失败:', error);
      return this.getMockFundingTrends();
    }
  }

  // 获取市场洞察数据
  async getMarketInsights() {
    const cacheKey = 'market_insights';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchMarketInsights();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('获取市场洞察失败:', error);
      return this.getMockMarketInsights();
    }
  }

  // 实际API调用方法（模拟）
  async fetchMarketOverview() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 实际应该调用真实API
    // const response = await fetch(`${this.apiBaseUrl}/market/overview`);
    // return response.json();
    
    return this.getMockMarketOverview();
  }

  async fetchIndustryDistribution() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getMockIndustryDistribution();
  }

  async fetchRegionalDistribution() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getMockRegionalDistribution();
  }

  async fetchFundingTrends() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.getMockFundingTrends();
  }

  async fetchMarketInsights() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.getMockMarketInsights();
  }

  // 模拟数据方法
  getMockMarketOverview() {
    return {
      totalUnicorns: 1200,
      totalValuation: 4.5e12, // 4.5万亿美元
      averageValuation: 3.8e9, // 38亿美元
      newUnicorns2024: 156,
      growthRate: 0.15, // 15%增长
      lastUpdated: new Date().toISOString(),
      topMetrics: [
        {
          label: '独角兽总数',
          value: '1,200',
          change: '+156',
          changePercent: '+15%',
          trend: 'up'
        },
        {
          label: '总市值',
          value: '$4.5T',
          change: '+$680B',
          changePercent: '+18%',
          trend: 'up'
        },
        {
          label: '平均估值',
          value: '$3.8B',
          change: '+$320M',
          changePercent: '+9%',
          trend: 'up'
        },
        {
          label: '新增独角兽',
          value: '156',
          change: '+23',
          changePercent: '+17%',
          trend: 'up'
        }
      ]
    };
  }

  getMockIndustryDistribution() {
    return [
      { name: 'FinTech', value: 280, percentage: 23.3, color: '#667eea' },
      { name: 'E-commerce', value: 192, percentage: 16.0, color: '#764ba2' },
      { name: 'AI/ML', value: 168, percentage: 14.0, color: '#f093fb' },
      { name: 'HealthTech', value: 144, percentage: 12.0, color: '#f5576c' },
      { name: 'Enterprise Software', value: 132, percentage: 11.0, color: '#4facfe' },
      { name: 'Transportation', value: 96, percentage: 8.0, color: '#00f2fe' },
      { name: 'EdTech', value: 72, percentage: 6.0, color: '#43e97b' },
      { name: 'Gaming', value: 60, percentage: 5.0, color: '#38f9d7' },
      { name: 'Others', value: 56, percentage: 4.7, color: '#ffecd2' }
    ];
  }

  getMockRegionalDistribution() {
    return [
      { region: '北美', count: 480, percentage: 40.0, color: '#667eea' },
      { region: '亚太', count: 360, percentage: 30.0, color: '#764ba2' },
      { region: '欧洲', count: 240, percentage: 20.0, color: '#f093fb' },
      { region: '拉美', count: 72, percentage: 6.0, color: '#f5576c' },
      { region: '中东非洲', count: 48, percentage: 4.0, color: '#4facfe' }
    ];
  }

  getMockFundingTrends() {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return months.map((month, index) => ({
      month,
      funding: Math.floor(Math.random() * 50 + 30), // 30-80亿美元
      deals: Math.floor(Math.random() * 20 + 10), // 10-30笔交易
      newUnicorns: Math.floor(Math.random() * 15 + 5) // 5-20个新独角兽
    }));
  }

  getMockMarketInsights() {
    return {
      topGrowthIndustries: [
        { name: 'AI/ML', growth: 45.2, description: '人工智能和机器学习领域增长最快' },
        { name: 'HealthTech', growth: 38.7, description: '健康科技受疫情推动快速发展' },
        { name: 'FinTech', growth: 32.1, description: '金融科技持续创新和数字化转型' }
      ],
      topValuedCompanies: [
        { name: 'ByteDance', valuation: 140e9, industry: 'Social Media' },
        { name: 'SpaceX', valuation: 137e9, industry: 'Aerospace' },
        { name: 'Stripe', valuation: 95e9, industry: 'FinTech' },
        { name: 'Klarna', valuation: 46e9, industry: 'FinTech' },
        { name: 'Canva', valuation: 40e9, industry: 'Design Software' }
      ],
      marketPredictions: [
        {
          title: '2024年预计新增200+独角兽',
          description: '基于当前增长趋势，预计2024年将新增超过200家独角兽企业',
          confidence: 85
        },
        {
          title: 'AI领域将占新增独角兽30%',
          description: '人工智能相关企业将成为独角兽增长的主要驱动力',
          confidence: 78
        },
        {
          title: '亚太地区增长将超越北美',
          description: '亚太地区的独角兽增长速度预计将首次超越北美地区',
          confidence: 72
        }
      ]
    };
  }

  // 缓存管理
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // 数据格式化工具
  formatCurrency(value) {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  }

  formatNumber(value) {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return value.toLocaleString();
    }
  }

  formatPercentage(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  // 数据分析工具
  calculateGrowthRate(current, previous) {
    if (previous === 0) return 0;
    return (current - previous) / previous;
  }

  calculateTrend(data, key) {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-3).map(item => item[key]);
    const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const latest = recent[recent.length - 1];
    
    if (latest > average * 1.1) return 'up';
    if (latest < average * 0.9) return 'down';
    return 'stable';
  }
}

// 创建服务实例
const marketDataService = new MarketDataService();

export default marketDataService;

// 导出常用方法
export const {
  getMarketOverview,
  getIndustryDistribution,
  getRegionalDistribution,
  getFundingTrends,
  getMarketInsights,
  formatCurrency,
  formatNumber,
  formatPercentage
} = marketDataService;

