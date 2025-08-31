// 投资服务模块 - 处理Paper Invest和Real Invest功能

// 投资账户数据模型
export const createUserInvestmentAccount = (userId) => {
  return {
    user_id: userId,
    account_type: 'paper', // 'paper' | 'real'
    virtual_balance: 1000000, // 默认100万虚拟资金
    real_balance: 0,
    total_invested: 0,
    total_returns: 0,
    portfolio: [],
    performance_metrics: {
      total_roi: 0,
      annualized_return: 0,
      success_rate: 0,
      best_investment: null,
      worst_investment: null
    },
    created_at: new Date(),
    updated_at: new Date()
  };
};

// 投资交易记录模型
export const createInvestmentTransaction = (data) => {
  return {
    transaction_id: generateTransactionId(),
    user_id: data.user_id,
    project_id: data.project_id,
    transaction_type: data.transaction_type, // 'invest' | 'exit' | 'dividend'
    amount: data.amount,
    shares_percentage: data.shares_percentage,
    valuation_at_time: data.valuation_at_time,
    transaction_date: new Date(),
    status: 'completed', // 'pending' | 'completed' | 'failed'
    fees: data.amount * 0.02, // 2%交易费用
    notes: data.notes || ''
  };
};

// Paper Invest模拟投资引擎
export class PaperInvestEngine {
  constructor() {
    this.virtualBalance = 1000000; // 默认100万虚拟资金
    this.transactionFee = 0.02; // 2%交易费用
  }

  // 模拟投资
  async simulateInvestment(userId, projectId, amount) {
    try {
      // 1. 验证投资金额
      const userAccount = await this.getUserAccount(userId);
      if (userAccount.virtual_balance < amount) {
        throw new Error('虚拟资金不足');
      }

      // 2. 获取项目信息
      const project = await this.getProjectInfo(projectId);
      if (!project || project.status !== 'fundraising') {
        throw new Error('项目不可投资');
      }

      // 3. 计算投资份额
      const sharesPercentage = (amount / project.current_valuation) * 100;
      
      // 4. 创建投资记录
      const investment = {
        project_id: projectId,
        project_name: project.name,
        investment_amount: amount,
        investment_date: new Date(),
        current_valuation: project.current_valuation,
        shares_percentage: sharesPercentage,
        status: 'active',
        current_value: amount // 初始价值等于投资金额
      };

      // 5. 更新用户账户
      const updatedAccount = {
        ...userAccount,
        virtual_balance: userAccount.virtual_balance - amount,
        total_invested: userAccount.total_invested + amount,
        portfolio: [...userAccount.portfolio, investment],
        updated_at: new Date()
      };

      await this.updateUserAccount(userId, updatedAccount);

      // 6. 记录交易
      const transaction = createInvestmentTransaction({
        user_id: userId,
        project_id: projectId,
        transaction_type: 'invest',
        amount: amount,
        shares_percentage: sharesPercentage,
        valuation_at_time: project.current_valuation
      });

      await this.recordTransaction(transaction);

      return {
        success: true,
        investment: investment,
        transaction: transaction,
        message: '模拟投资成功！您已成功投资该项目。'
      };
    } catch (error) {
      console.error('模拟投资失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 投资组合估值更新
  async updatePortfolioValuation(userId) {
    const userAccount = await this.getUserAccount(userId);
    let totalCurrentValue = 0;

    for (let investment of userAccount.portfolio) {
      if (investment.status === 'active') {
        // 模拟项目估值变化（实际应该从API获取）
        const growthRate = this.simulateGrowthRate(investment.project_id);
        const currentValue = investment.investment_amount * (1 + growthRate);
        
        investment.current_value = currentValue;
        totalCurrentValue += currentValue;
      }
    }

    // 计算总收益和ROI
    const totalReturns = totalCurrentValue - userAccount.total_invested;
    const totalROI = userAccount.total_invested > 0 ? (totalReturns / userAccount.total_invested) * 100 : 0;

    const updatedAccount = {
      ...userAccount,
      portfolio: userAccount.portfolio,
      total_returns: totalReturns,
      performance_metrics: {
        ...userAccount.performance_metrics,
        total_roi: totalROI
      },
      updated_at: new Date()
    };

    await this.updateUserAccount(userId, updatedAccount);

    return {
      total_invested: userAccount.total_invested,
      current_value: totalCurrentValue,
      total_returns: totalReturns,
      roi_percentage: totalROI
    };
  }

  // 模拟增长率（实际应该基于真实数据）
  simulateGrowthRate(projectId) {
    // 模拟不同项目的增长率
    const growthRates = {
      'ai-startup-1': 0.25, // 25%增长
      'fintech-2': 0.15,    // 15%增长
      'biotech-3': 0.35,    // 35%增长
      'cleantech-4': 0.20,  // 20%增长
      'ecommerce-5': 0.10,  // 10%增长
      'default': 0.12       // 默认12%增长
    };
    
    return growthRates[projectId] || growthRates['default'];
  }

  // 获取用户账户信息
  async getUserAccount(userId) {
    // 从localStorage获取用户账户信息
    const accountKey = `investment_account_${userId}`;
    const accountData = localStorage.getItem(accountKey);
    
    if (accountData) {
      return JSON.parse(accountData);
    } else {
      // 创建新账户
      const newAccount = createUserInvestmentAccount(userId);
      localStorage.setItem(accountKey, JSON.stringify(newAccount));
      return newAccount;
    }
  }

  // 更新用户账户信息
  async updateUserAccount(userId, accountData) {
    const accountKey = `investment_account_${userId}`;
    localStorage.setItem(accountKey, JSON.stringify(accountData));
  }

  // 获取项目信息
  async getProjectInfo(projectId) {
    // 模拟项目数据（实际应该从API获取）
    const projects = {
      'ai-startup-1': {
        id: 'ai-startup-1',
        name: 'AI Vision Pro',
        status: 'fundraising',
        current_valuation: 50000000, // $50M
        industry: 'AI',
        stage: 'Series A'
      },
      'fintech-2': {
        id: 'fintech-2',
        name: 'FinTech Solutions',
        status: 'fundraising',
        current_valuation: 30000000, // $30M
        industry: 'FinTech',
        stage: 'Seed'
      },
      'biotech-3': {
        id: 'biotech-3',
        name: 'BioInnovate',
        status: 'fundraising',
        current_valuation: 80000000, // $80M
        industry: 'BioTech',
        stage: 'Series B'
      }
    };

    return projects[projectId] || null;
  }

  // 记录交易
  async recordTransaction(transaction) {
    const transactionsKey = `transactions_${transaction.user_id}`;
    const existingTransactions = JSON.parse(localStorage.getItem(transactionsKey) || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem(transactionsKey, JSON.stringify(existingTransactions));
  }
}

// Real Invest真实投资引擎
export class RealInvestEngine {
  constructor() {
    this.escrowService = new EscrowService();
    this.complianceService = new ComplianceService();
  }

  // 真实投资流程
  async executeRealInvestment(userId, projectId, amount) {
    try {
      // 1. 投资者认证检查
      const verification = await this.complianceService.checkInvestorStatus(userId);
      if (!verification.verified) {
        throw new Error('投资者认证未通过，请先完成KYC认证');
      }

      // 2. AML检查
      const amlResult = await this.complianceService.performAML(userId, amount);
      if (!amlResult.approved) {
        throw new Error('AML检查未通过');
      }

      // 3. 投资限额检查
      const investmentLimits = await this.checkInvestmentLimits(userId, amount);
      if (!investmentLimits.allowed) {
        throw new Error(`超出投资限额: ${investmentLimits.reason}`);
      }

      // 4. 项目尽职调查状态检查
      const project = await this.getProjectDueDiligence(projectId);
      if (project.dd_status !== 'completed') {
        throw new Error('项目尽职调查未完成');
      }

      // 5. 生成投资协议
      const investmentAgreement = await this.generateInvestmentAgreement({
        investor_id: userId,
        project_id: projectId,
        investment_amount: amount,
        terms: project.investment_terms
      });

      // 6. 资金托管
      const escrowResult = await this.escrowService.createEscrow({
        investor_id: userId,
        project_id: projectId,
        amount: amount,
        release_conditions: investmentAgreement.release_conditions
      });

      // 7. 创建投资记录
      const investment = await this.createRealInvestment({
        user_id: userId,
        project_id: projectId,
        amount: amount,
        agreement_id: investmentAgreement.id,
        escrow_id: escrowResult.escrow_id,
        status: 'pending_signature'
      });

      return {
        success: true,
        investment_id: investment.id,
        agreement_url: investmentAgreement.document_url,
        escrow_id: escrowResult.escrow_id,
        next_steps: [
          '审阅并签署投资协议',
          '完成资金转账到托管账户',
          '等待项目方确认',
          '投资正式生效'
        ],
        message: '真实投资申请已提交，请按照后续步骤完成投资流程。'
      };
    } catch (error) {
      console.error('真实投资执行失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 检查投资限额
  async checkInvestmentLimits(userId, amount) {
    // 模拟投资限额检查
    const userProfile = await this.getUserProfile(userId);
    const maxInvestment = userProfile.accredited_investor ? 1000000 : 100000; // 合格投资者$1M，普通投资者$100K
    
    if (amount > maxInvestment) {
      return {
        allowed: false,
        reason: `投资金额超出限额，最大投资金额为$${maxInvestment.toLocaleString()}`
      };
    }

    return { allowed: true };
  }

  // 获取项目尽职调查信息
  async getProjectDueDiligence(projectId) {
    // 模拟项目尽职调查数据
    return {
      project_id: projectId,
      dd_status: 'completed',
      investment_terms: {
        minimum_investment: 10000,
        maximum_investment: 500000,
        valuation: 50000000,
        share_class: 'Series A Preferred'
      }
    };
  }

  // 生成投资协议
  async generateInvestmentAgreement(data) {
    // 模拟投资协议生成
    return {
      id: generateAgreementId(),
      document_url: `/agreements/${data.investor_id}_${data.project_id}_agreement.pdf`,
      release_conditions: [
        'investor_signature',
        'project_signature',
        'funds_received'
      ]
    };
  }

  // 创建真实投资记录
  async createRealInvestment(data) {
    const investment = {
      id: generateInvestmentId(),
      ...data,
      created_at: new Date(),
      status: 'pending_signature'
    };

    // 保存到localStorage（实际应该保存到数据库）
    const investmentsKey = `real_investments_${data.user_id}`;
    const existingInvestments = JSON.parse(localStorage.getItem(investmentsKey) || '[]');
    existingInvestments.push(investment);
    localStorage.setItem(investmentsKey, JSON.stringify(existingInvestments));

    return investment;
  }

  // 获取用户资料
  async getUserProfile(userId) {
    // 模拟用户资料
    return {
      user_id: userId,
      accredited_investor: true,
      net_worth: 2000000,
      annual_income: 500000
    };
  }
}

// 合规服务
export class ComplianceService {
  // 检查投资者状态
  async checkInvestorStatus(userId) {
    // 模拟投资者认证状态
    const verificationKey = `verification_${userId}`;
    const verificationData = localStorage.getItem(verificationKey);
    
    if (verificationData) {
      const verification = JSON.parse(verificationData);
      return {
        verified: verification.kyc_status === 'verified' && verification.aml_status === 'verified',
        kyc_status: verification.kyc_status,
        aml_status: verification.aml_status
      };
    }

    return {
      verified: false,
      kyc_status: 'pending',
      aml_status: 'pending'
    };
  }

  // 执行AML检查
  async performAML(userId, amount) {
    // 模拟AML检查
    if (amount > 100000) {
      // 大额投资需要额外审查
      return {
        approved: false,
        risk_level: 'high',
        reason: '大额投资需要人工审查'
      };
    }

    return {
      approved: true,
      risk_level: 'low',
      compliance_score: 95
    };
  }
}

// 托管服务
export class EscrowService {
  // 创建托管账户
  async createEscrow(data) {
    const escrow = {
      escrow_id: generateEscrowId(),
      investor_id: data.investor_id,
      project_id: data.project_id,
      amount: data.amount,
      status: 'pending',
      release_conditions: data.release_conditions,
      created_at: new Date()
    };

    // 保存托管信息
    const escrowKey = `escrow_${data.investor_id}`;
    const existingEscrows = JSON.parse(localStorage.getItem(escrowKey) || '[]');
    existingEscrows.push(escrow);
    localStorage.setItem(escrowKey, JSON.stringify(existingEscrows));

    return escrow;
  }
}

// 工具函数
function generateTransactionId() {
  return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateAgreementId() {
  return 'agr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateInvestmentId() {
  return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateEscrowId() {
  return 'esc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 导出实例
export const paperInvestEngine = new PaperInvestEngine();
export const realInvestEngine = new RealInvestEngine();
export const complianceService = new ComplianceService();
export const escrowService = new EscrowService();

