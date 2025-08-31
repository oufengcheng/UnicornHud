/**
 * Internationalization Configuration System
 * Supports multi-language switching and localization adaptation
 */

// Supported languages list
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', displayCode: 'EN' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳', displayCode: 'CN' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵', displayCode: 'JP' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷', displayCode: 'KR' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', displayCode: 'ES' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', displayCode: 'FR' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', displayCode: 'DE' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', displayCode: 'SA', rtl: true }
];

// Default language - English
export const DEFAULT_LANGUAGE = 'en-US';

// Language resources
const translations = {
  'zh-CN': {
    // Common
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      more: '更多',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      submit: '提交',
      reset: '重置',
      close: '关闭',
      open: '打开',
      view: '查看',
      download: '下载',
      upload: '上传',
      share: '分享',
      copy: '复制',
      refresh: '刷新'
    },
    
    // Navigation
    navigation: {
      home: '首页',
      projects: '项目',
      vcRadar: 'VC雷达',
      demoDay: '路演日',
      marketData: '市场数据',
      portfolio: '投资组合',
      profile: '个人中心',
      founders: '创业者',
      logout: '退出登录',
      login: '登录',
      register: '注册'
    },
    
    // Home
    home: {
      title: 'Unicorn 100',
      subtitle: '连接独角兽与投资者的智能平台',
      description: '通过AI驱动的智能撮合，为创业者和投资者提供最优质的投资机会',
      getStarted: '开始使用',
      learnMore: '了解更多',
      features: {
        aiMatching: 'AI智能撮合',
        aiMatchingDesc: '基于深度学习的项目评估和投资者匹配',
        paperInvest: '模拟投资',
        paperInvestDesc: '零风险的投资学习和实践环境',
        realInvest: '真实投资',
        realInvestDesc: '完整的投资流程和合规保障',
        marketData: '市场数据',
        marketDataDesc: '实时的独角兽市场数据和趋势分析'
      },
      stats: {
        totalProjects: '项目总数',
        totalInvestors: '投资者总数',
        totalFunding: '总融资额',
        successRate: '成功率'
      }
    },
    
    // Projects
    projects: {
      title: '项目列表',
      subtitle: '发现下一个独角兽',
      filters: {
        all: '全部',
        industry: '行业',
        stage: '阶段',
        location: '地区',
        valuation: '估值'
      },
      industries: {
        ai: '人工智能',
        fintech: '金融科技',
        biotech: '生物技术',
        cleantech: '清洁技术',
        ecommerce: '电子商务',
        aerospace: '航空航天',
        healthcare: '医疗健康',
        education: '教育科技'
      },
      stages: {
        seed: '种子轮',
        seriesA: 'A轮',
        seriesB: 'B轮',
        seriesC: 'C轮',
        ipo: 'IPO'
      },
      actions: {
        viewDetails: '查看详情',
        aiAnalysis: 'AI分析',
        invest: '投资',
        favorite: '收藏'
      }
    },
    
    // Investment
    investment: {
      title: '投资',
      paperInvest: '模拟投资',
      realInvest: '真实投资',
      amount: '投资金额',
      shares: '股份比例',
      fees: '交易费用',
      total: '总计',
      minAmount: '最小投资金额',
      availableFunds: '可用资金',
      riskWarning: '投资风险提示',
      riskItems: [
        '投资有风险，可能面临本金损失',
        '创业投资属于高风险投资，成功率较低',
        '投资决策应基于充分的尽职调查',
        '建议分散投资，不要将所有资金投入单一项目'
      ],
      confirmInvestment: '确认投资',
      investmentSuccess: '投资成功！',
      investmentFailed: '投资失败',
      viewPortfolio: '查看投资组合'
    },
    
    // AI Analysis
    ai: {
      title: 'AI分析',
      analyzing: 'AI分析中...',
      evaluation: '项目评估',
      matching: '投资匹配',
      recommendation: '投资建议',
      overallScore: '综合评分',
      confidence: '置信度',
      strengths: '优势',
      weaknesses: '劣势',
      investmentThesis: '投资论点',
      dimensions: {
        team: '团队',
        market: '市场',
        technology: '技术',
        business: '商业',
        financial: '财务',
        risk: '风险'
      },
      recommendations: {
        strongBuy: '强烈推荐',
        buy: '推荐投资',
        hold: '谨慎考虑',
        weakHold: '不建议投资',
        sell: '强烈不推荐'
      }
    },
    
    // Portfolio
    portfolio: {
      title: '投资组合',
      overview: '概览',
      investments: '投资项目',
      performance: '投资表现',
      history: '投资历史',
      totalInvested: '总投资额',
      currentValue: '当前价值',
      totalReturns: '总收益',
      roi: '投资回报率',
      bestInvestment: '最佳投资',
      worstInvestment: '最差投资',
      activeInvestments: '活跃投资',
      exitedInvestments: '已退出投资'
    },
    
    // Profile
    profile: {
      title: '个人中心',
      personalInfo: '个人信息',
      investmentPreferences: '投资偏好',
      security: '安全设置',
      verification: '身份认证',
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      location: '地区',
      bio: '个人简介',
      avatar: '头像',
      preferredIndustries: '偏好行业',
      preferredStages: '偏好阶段',
      riskLevel: '风险偏好',
      investmentRange: '投资范围',
      emailVerified: '邮箱已验证',
      phoneVerified: '电话已验证',
      identityVerified: '身份已认证',
      kycStatus: 'KYC状态',
      amlStatus: 'AML状态'
    },
    
    // Market Data
    marketData: {
      title: '市场数据中心',
      subtitle: '实时独角兽市场数据分析与趋势洞察',
      overview: '市场概览',
      totalUnicorns: '独角兽总数',
      totalMarketCap: '总市值',
      averageValuation: '平均估值',
      newUnicorns: '新增独角兽',
      growthRate: '增长率',
      industryDistribution: '行业分布',
      regionalDistribution: '地区分布',
      fundingTrends: '融资趋势',
      marketInsights: '市场洞察',
      fastestGrowing: '增长最快行业',
      largestIndustries: '规模最大行业',
      highestValued: '价值最高行业',
      marketPredictions: '市场预测',
      lastUpdated: '最后更新'
    },
    
    // Error Messages
    errors: {
      networkError: '网络连接失败，请检查网络后重试',
      serverError: '服务器错误，请稍后重试',
      unauthorized: '请先登录后再进行操作',
      forbidden: '您没有权限执行此操作',
      notFound: '请求的资源不存在',
      validationError: '输入数据验证失败，请检查输入信息',
      timeout: '请求超时，请稍后重试',
      unknownError: '未知错误，请稍后重试'
    },
    
    // Success Messages
    success: {
      saved: '保存成功',
      updated: '更新成功',
      deleted: '删除成功',
      uploaded: '上传成功',
      sent: '发送成功',
      copied: '复制成功'
    }
  },
  
  'en-US': {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      more: 'More',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      close: 'Close',
      open: 'Open',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      share: 'Share',
      copy: 'Copy',
      refresh: 'Refresh'
    },
    
    // Navigation
    navigation: {
      home: 'Home',
      projects: 'Projects',
      vcRadar: 'VC Radar',
      demoDay: 'Demo Day',
      marketData: 'Market Data',
      portfolio: 'Portfolio',
      profile: 'Profile',
      founders: 'Founders',
      logout: 'Logout',
      login: 'Login',
      register: 'Register'
    },
    
    // Home
    home: {
      title: 'Unicorn 100',
      subtitle: 'Intelligent Platform Connecting Unicorns with Investors',
      description: 'AI-driven smart matching providing optimal investment opportunities for entrepreneurs and investors',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      features: {
        aiMatching: 'AI Smart Matching',
        aiMatchingDesc: 'Deep learning-based project evaluation and investor matching',
        paperInvest: 'Paper Trading',
        paperInvestDesc: 'Risk-free investment learning and practice environment',
        realInvest: 'Real Investment',
        realInvestDesc: 'Complete investment process with compliance assurance',
        marketData: 'Market Data',
        marketDataDesc: 'Real-time unicorn market data and trend analysis'
      },
      stats: {
        totalProjects: 'Total Projects',
        totalInvestors: 'Total Investors',
        totalFunding: 'Total Funding',
        successRate: 'Success Rate'
      }
    },
    
    // Projects
    projects: {
      title: 'Project List',
      subtitle: 'Discover the Next Unicorn',
      filters: {
        all: 'All',
        industry: 'Industry',
        stage: 'Stage',
        location: 'Location',
        valuation: 'Valuation'
      },
      industries: {
        ai: 'Artificial Intelligence',
        fintech: 'FinTech',
        biotech: 'BioTech',
        cleantech: 'CleanTech',
        ecommerce: 'E-commerce',
        aerospace: 'Aerospace',
        healthcare: 'Healthcare',
        education: 'EdTech'
      },
      stages: {
        seed: 'Seed',
        seriesA: 'Series A',
        seriesB: 'Series B',
        seriesC: 'Series C',
        ipo: 'IPO'
      },
      actions: {
        viewDetails: 'View Details',
        aiAnalysis: 'AI Analysis',
        invest: 'Invest',
        favorite: 'Favorite'
      }
    },
    
    // Investment
    investment: {
      title: 'Investment',
      paperInvest: 'Paper Investment',
      realInvest: 'Real Investment',
      amount: 'Investment Amount',
      shares: 'Share Percentage',
      fees: 'Transaction Fees',
      total: 'Total',
      minAmount: 'Minimum Investment',
      availableFunds: 'Available Funds',
      riskWarning: 'Investment Risk Warning',
      riskItems: [
        'Investment involves risks and may result in loss of principal',
        'Startup investments are high-risk with low success rates',
        'Investment decisions should be based on thorough due diligence',
        'Diversification is recommended; avoid putting all funds in a single project'
      ],
      confirmInvestment: 'Confirm Investment',
      investmentSuccess: 'Investment Successful!',
      investmentFailed: 'Investment Failed',
      viewPortfolio: 'View Portfolio'
    },
    
    // AI Analysis
    ai: {
      title: 'AI Analysis',
      analyzing: 'AI Analyzing...',
      evaluation: 'Project Evaluation',
      matching: 'Investment Matching',
      recommendation: 'Investment Recommendation',
      overallScore: 'Overall Score',
      confidence: 'Confidence',
      strengths: 'Strengths',
      weaknesses: 'Weaknesses',
      investmentThesis: 'Investment Thesis',
      dimensions: {
        team: 'Team',
        market: 'Market',
        technology: 'Technology',
        business: 'Business',
        financial: 'Financial',
        risk: 'Risk'
      },
      recommendations: {
        strongBuy: 'Strong Buy',
        buy: 'Buy',
        hold: 'Hold',
        weakHold: 'Weak Hold',
        sell: 'Sell'
      }
    },
    
    // Portfolio
    portfolio: {
      title: 'Portfolio',
      overview: 'Overview',
      investments: 'Investments',
      performance: 'Performance',
      history: 'History',
      totalInvested: 'Total Invested',
      currentValue: 'Current Value',
      totalReturns: 'Total Returns',
      roi: 'ROI',
      bestInvestment: 'Best Investment',
      worstInvestment: 'Worst Investment',
      activeInvestments: 'Active Investments',
      exitedInvestments: 'Exited Investments'
    },
    
    // Profile
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      investmentPreferences: 'Investment Preferences',
      security: 'Security Settings',
      verification: 'Verification',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      bio: 'Bio',
      avatar: 'Avatar',
      preferredIndustries: 'Preferred Industries',
      preferredStages: 'Preferred Stages',
      riskLevel: 'Risk Level',
      investmentRange: 'Investment Range',
      emailVerified: 'Email Verified',
      phoneVerified: 'Phone Verified',
      identityVerified: 'Identity Verified',
      kycStatus: 'KYC Status',
      amlStatus: 'AML Status'
    },
    
    // Market Data
    marketData: {
      title: 'Market Data Center',
      subtitle: 'Real-time Unicorn Market Data Analysis and Trend Insights',
      overview: 'Market Overview',
      totalUnicorns: 'Total Unicorns',
      totalMarketCap: 'Total Market Cap',
      averageValuation: 'Average Valuation',
      newUnicorns: 'New Unicorns',
      growthRate: 'Growth Rate',
      industryDistribution: 'Industry Distribution',
      regionalDistribution: 'Regional Distribution',
      fundingTrends: 'Funding Trends',
      marketInsights: 'Market Insights',
      fastestGrowing: 'Fastest Growing Industries',
      largestIndustries: 'Largest Industries',
      highestValued: 'Highest Valued Industries',
      marketPredictions: 'Market Predictions',
      lastUpdated: 'Last Updated'
    },
    
    // Errors
    errors: {
      networkError: 'Network connection failed, please check your connection and try again',
      serverError: 'Server error, please try again later',
      unauthorized: 'Please login first',
      forbidden: 'You do not have permission to perform this action',
      notFound: 'The requested resource was not found',
      validationError: 'Input validation failed, please check your input',
      timeout: 'Request timeout, please try again later',
      unknownError: 'Unknown error, please try again later'
    },
    
    // Success
    success: {
      saved: 'Saved successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      uploaded: 'Uploaded successfully',
      sent: 'Sent successfully',
      copied: 'Copied successfully'
    }
  }
};

// Internationalization class
class I18n {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.translations = translations;
    this.listeners = [];
  }

  // Detect user language
  detectLanguage() {
    // 1. Get user settings from localStorage
    const savedLanguage = localStorage.getItem('unicorn100_language');
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      return savedLanguage;
    }

    // 2. Detect from browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    const supportedLanguage = this.findSupportedLanguage(browserLanguage);
    if (supportedLanguage) {
      return supportedLanguage;
    }

    // 3. Return default language
    return DEFAULT_LANGUAGE;
  }

  // Check if language is supported
  isLanguageSupported(languageCode) {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
  }

  // Find supported language
  findSupportedLanguage(browserLanguage) {
    // Exact match
    const exactMatch = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLanguage);
    if (exactMatch) return exactMatch.code;

    // Language prefix match
    const languagePrefix = browserLanguage.split('-')[0];
    const prefixMatch = SUPPORTED_LANGUAGES.find(lang => lang.code.startsWith(languagePrefix));
    if (prefixMatch) return prefixMatch.code;

    return null;
  }

  // Change language
  changeLanguage(languageCode) {
    if (!this.isLanguageSupported(languageCode)) {
      console.warn(`Language ${languageCode} is not supported`);
      return;
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('unicorn100_language', languageCode);
    
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;
    
    // Update HTML dir attribute (RTL support)
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    document.documentElement.dir = language?.rtl ? 'rtl' : 'ltr';
    
    // Notify listeners
    this.notifyListeners();
  }

  // Get translation text
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    // Traverse key path
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If current language has no translation, try default language
        value = this.translations[DEFAULT_LANGUAGE];
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            console.warn(`Translation key "${key}" not found`);
            return key;
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" is not a string`);
      return key;
    }

    // Parameter replacement
    return this.interpolate(value, params);
  }

  // Parameter interpolation
  interpolate(text, params) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get current language info
  getCurrentLanguageInfo() {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === this.currentLanguage);
  }

  // Get supported languages list
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  // Add language change listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentLanguage);
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    });
  }

  // Format number
  formatNumber(number, options = {}) {
    try {
      return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    } catch (error) {
      return number.toLocaleString();
    }
  }

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat(this.currentLanguage, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toLocaleString()}`;
    }
  }

  // Format date
  formatDate(date, options = {}) {
    try {
      return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  // Format relative time
  formatRelativeTime(date) {
    try {
      const rtf = new Intl.RelativeTimeFormat(this.currentLanguage, { numeric: 'auto' });
      const now = new Date();
      const diffInSeconds = Math.floor((date - now) / 1000);
      
      if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(diffInSeconds, 'second');
      } else if (Math.abs(diffInSeconds) < 3600) {
        return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
      } else if (Math.abs(diffInSeconds) < 86400) {
        return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
      } else {
        return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
      }
    } catch (error) {
      return date.toLocaleDateString();
    }
  }
}

// Create global instance
const i18n = new I18n();

// Export
export default i18n;
export { I18n };

// Convenience functions
export const t = (key, params) => i18n.t(key, params);
export const changeLanguage = (languageCode) => i18n.changeLanguage(languageCode);
export const getCurrentLanguage = () => i18n.getCurrentLanguage();
export const formatCurrency = (amount, currency) => i18n.formatCurrency(amount, currency);
export const formatDate = (date, options) => i18n.formatDate(date, options);
export const formatNumber = (number, options) => i18n.formatNumber(number, options);

