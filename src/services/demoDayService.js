// Demo Day报名服务
import apiClient from './apiClient';

class DemoDayService {
  constructor() {
    this.registrationSteps = [
      { id: 1, title: '参与者信息', description: '填写基本信息和项目详情' },
      { id: 2, title: '联系信息', description: '提供联系方式和团队信息' },
      { id: 3, title: '确认报名', description: '确认信息并完成支付' }
    ];
  }

  // 开始报名流程
  async startRegistration(eventId, userProfile = {}) {
    try {
      // 检查用户认证状态
      const isAuthenticated = await this.checkUserAuth();
      if (!isAuthenticated) {
        throw new Error('请先登录后再进行报名');
      }

      // 获取活动详细信息
      const eventDetails = await this.getEventDetails(eventId);
      if (!eventDetails) {
        throw new Error('活动信息不存在');
      }

      // 检查报名资格
      const eligibility = await this.checkEligibility(eventId, userProfile);
      if (!eligibility.eligible) {
        throw new Error(eligibility.reason || '不符合报名条件');
      }

      // 创建报名会话
      const registrationSession = {
        id: this.generateSessionId(),
        eventId,
        userId: userProfile.id || 'anonymous',
        startTime: new Date().toISOString(),
        currentStep: 1,
        data: {},
        status: 'in_progress'
      };

      // 保存到本地存储
      this.saveRegistrationSession(registrationSession);

      return {
        success: true,
        sessionId: registrationSession.id,
        eventDetails,
        currentStep: 1,
        totalSteps: this.registrationSteps.length
      };

    } catch (error) {
      console.error('开始报名失败:', error);
      throw error;
    }
  }

  // 提交报名步骤数据
  async submitStepData(sessionId, stepId, stepData) {
    try {
      const session = this.getRegistrationSession(sessionId);
      if (!session) {
        throw new Error('报名会话不存在');
      }

      // 验证步骤数据
      const validation = this.validateStepData(stepId, stepData);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // 更新会话数据
      session.data[`step${stepId}`] = stepData;
      session.currentStep = Math.max(session.currentStep, stepId);
      session.lastUpdated = new Date().toISOString();

      // 保存更新后的会话
      this.saveRegistrationSession(session);

      // 检查是否可以进入下一步
      const canProceed = this.canProceedToNextStep(session, stepId);
      const nextStep = stepId < this.registrationSteps.length ? stepId + 1 : null;

      return {
        success: true,
        sessionId,
        currentStep: stepId,
        nextStep,
        canProceed,
        completedSteps: this.getCompletedSteps(session)
      };

    } catch (error) {
      console.error('提交步骤数据失败:', error);
      throw error;
    }
  }

  // 完成报名
  async completeRegistration(sessionId, paymentInfo = {}) {
    try {
      const session = this.getRegistrationSession(sessionId);
      if (!session) {
        throw new Error('报名会话不存在');
      }

      // 验证所有步骤都已完成
      const completedSteps = this.getCompletedSteps(session);
      if (completedSteps.length !== this.registrationSteps.length) {
        throw new Error('请完成所有报名步骤');
      }

      // 生成报名摘要
      const registrationSummary = this.generateRegistrationSummary(session);

      // 模拟支付处理
      const paymentResult = await this.processPayment(session, paymentInfo);
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || '支付处理失败');
      }

      // 生成确认码
      const confirmationCode = this.generateConfirmationCode();

      // 创建最终报名记录
      const registration = {
        id: this.generateRegistrationId(),
        sessionId,
        eventId: session.eventId,
        userId: session.userId,
        confirmationCode,
        registrationData: session.data,
        paymentInfo: paymentResult.paymentInfo,
        status: 'confirmed',
        registrationTime: new Date().toISOString(),
        summary: registrationSummary
      };

      // 保存报名记录
      this.saveRegistration(registration);

      // 发送确认邮件
      await this.sendConfirmationEmail(registration);

      // 清理会话
      this.clearRegistrationSession(sessionId);

      return {
        success: true,
        registrationId: registration.id,
        confirmationCode,
        summary: registrationSummary,
        paymentInfo: paymentResult.paymentInfo
      };

    } catch (error) {
      console.error('完成报名失败:', error);
      throw error;
    }
  }

  // 验证步骤数据
  validateStepData(stepId, data) {
    switch (stepId) {
      case 1: // 参与者信息
        return this.validateParticipantInfo(data);
      case 2: // 联系信息
        return this.validateContactInfo(data);
      case 3: // 确认报名
        return this.validateConfirmationInfo(data);
      default:
        return { valid: false, message: '无效的步骤ID' };
    }
  }

  // 验证参与者信息
  validateParticipantInfo(data) {
    const required = ['participantType', 'companyName', 'projectName', 'industry', 'stage'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      return { 
        valid: false, 
        message: `请填写必填字段: ${missing.join(', ')}` 
      };
    }

    if (data.participantType === 'founder' && !data.projectDescription) {
      return { 
        valid: false, 
        message: '创始人参与者必须提供项目描述' 
      };
    }

    return { valid: true };
  }

  // 验证联系信息
  validateContactInfo(data) {
    const required = ['fullName', 'email', 'phone', 'linkedIn'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      return { 
        valid: false, 
        message: `请填写必填字段: ${missing.join(', ')}` 
      };
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { 
        valid: false, 
        message: '请输入有效的邮箱地址' 
      };
    }

    // 电话格式验证
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      return { 
        valid: false, 
        message: '请输入有效的电话号码' 
      };
    }

    return { valid: true };
  }

  // 验证确认信息
  validateConfirmationInfo(data) {
    if (!data.agreeToTerms) {
      return { 
        valid: false, 
        message: '请同意活动条款和条件' 
      };
    }

    if (!data.agreeToPrivacy) {
      return { 
        valid: false, 
        message: '请同意隐私政策' 
      };
    }

    return { valid: true };
  }

  // 处理支付
  async processPayment(session, paymentInfo) {
    try {
      // 获取活动信息
      const eventDetails = await this.getEventDetails(session.eventId);
      const registrationFee = eventDetails.registrationFee || 0;

      if (registrationFee === 0) {
        return {
          success: true,
          paymentInfo: {
            amount: 0,
            currency: 'USD',
            method: 'free',
            transactionId: 'FREE_' + Date.now(),
            status: 'completed'
          }
        };
      }

      // 模拟支付处理
      await this.delay(2000);

      // 模拟支付验证
      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        throw new Error('请提供完整的支付信息');
      }

      // 生成模拟支付结果
      const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      return {
        success: true,
        paymentInfo: {
          amount: registrationFee,
          currency: 'USD',
          method: 'credit_card',
          transactionId,
          status: 'completed',
          cardLast4: paymentInfo.cardNumber.slice(-4),
          processedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || '支付处理失败'
      };
    }
  }

  // 发送确认邮件
  async sendConfirmationEmail(registration) {
    try {
      // 模拟邮件发送
      await this.delay(1000);

      const emailContent = this.generateConfirmationEmail(registration);
      
      // 这里应该调用实际的邮件服务
      console.log('发送确认邮件:', {
        to: registration.registrationData.step2.email,
        subject: `Demo Day报名确认 - ${registration.confirmationCode}`,
        content: emailContent
      });

      return { success: true };
    } catch (error) {
      console.error('发送确认邮件失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 生成确认邮件内容
  generateConfirmationEmail(registration) {
    const eventDetails = this.getEventDetails(registration.eventId);
    const participantData = registration.registrationData.step1;
    const contactData = registration.registrationData.step2;

    return `
亲爱的 ${contactData.fullName}，

感谢您报名参加 ${eventDetails?.name || 'Demo Day'} 活动！

报名确认信息：
• 确认码: ${registration.confirmationCode}
• 报名时间: ${new Date(registration.registrationTime).toLocaleString()}
• 参与类型: ${participantData.participantType === 'founder' ? '创始人' : '投资者'}
• 公司名称: ${participantData.companyName}
• 项目名称: ${participantData.projectName}

活动详情：
• 活动名称: ${eventDetails?.name}
• 活动时间: ${eventDetails?.date}
• 活动地点: ${eventDetails?.location}
• 活动规模: ${eventDetails?.scale}

重要提醒：
1. 请保存此确认码，活动当天需要出示
2. 活动前一周会发送详细议程和参与指南
3. 如需修改报名信息，请联系组委会

联系方式：
• 邮箱: events@unicorn100.com
• 电话: +1-555-DEMO-DAY
• 网站: www.unicorn100.com/demo-day

期待在活动中与您相遇！

Unicorn 100 团队
    `;
  }

  // 生成报名摘要
  generateRegistrationSummary(session) {
    const step1 = session.data.step1 || {};
    const step2 = session.data.step2 || {};
    const step3 = session.data.step3 || {};

    return {
      participant: {
        type: step1.participantType,
        name: step2.fullName,
        email: step2.email,
        company: step1.companyName,
        project: step1.projectName
      },
      project: {
        industry: step1.industry,
        stage: step1.stage,
        description: step1.projectDescription
      },
      contact: {
        phone: step2.phone,
        linkedIn: step2.linkedIn,
        website: step2.website
      },
      preferences: {
        networkingInterests: step3.networkingInterests || [],
        specialRequests: step3.specialRequests || ''
      }
    };
  }

  // 获取活动详情
  async getEventDetails(eventId) {
    // 模拟活动数据
    const events = {
      1: {
        id: 1,
        name: "全球独角兽Demo Day 2024",
        date: "2024年12月15日",
        location: "旧金山湾区",
        scale: "500+参与者",
        registrationFee: 299,
        description: "汇聚全球最具潜力的独角兽项目和顶级投资机构"
      },
      2: {
        id: 2,
        name: "AI创新项目路演",
        date: "2024年11月20日",
        location: "纽约曼哈顿",
        scale: "300+参与者",
        registrationFee: 199,
        description: "专注于人工智能领域的创新项目展示"
      }
    };

    return events[eventId] || null;
  }

  // 检查报名资格
  async checkEligibility(eventId, userProfile) {
    // 模拟资格检查
    await this.delay(500);

    // 基本检查
    if (!userProfile.email) {
      return { eligible: false, reason: '需要提供有效的邮箱地址' };
    }

    // 活动特定检查
    if (eventId === 1) {
      // 全球Demo Day需要更严格的条件
      if (!userProfile.company && !userProfile.project) {
        return { eligible: false, reason: '需要有公司或项目背景' };
      }
    }

    return { eligible: true };
  }

  // 检查用户认证
  async checkUserAuth() {
    try {
      const token = localStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // 会话管理方法
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateRegistrationId() {
    return 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateConfirmationCode() {
    return 'DD' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  saveRegistrationSession(session) {
    try {
      localStorage.setItem(`demo_day_session_${session.id}`, JSON.stringify(session));
    } catch (error) {
      console.error('保存报名会话失败:', error);
    }
  }

  getRegistrationSession(sessionId) {
    try {
      const sessionData = localStorage.getItem(`demo_day_session_${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('获取报名会话失败:', error);
      return null;
    }
  }

  clearRegistrationSession(sessionId) {
    try {
      localStorage.removeItem(`demo_day_session_${sessionId}`);
    } catch (error) {
      console.error('清理报名会话失败:', error);
    }
  }

  saveRegistration(registration) {
    try {
      const registrations = this.getRegistrations();
      registrations.push(registration);
      localStorage.setItem('demo_day_registrations', JSON.stringify(registrations));
    } catch (error) {
      console.error('保存报名记录失败:', error);
    }
  }

  getRegistrations() {
    try {
      const registrationsData = localStorage.getItem('demo_day_registrations');
      return registrationsData ? JSON.parse(registrationsData) : [];
    } catch (error) {
      console.error('获取报名记录失败:', error);
      return [];
    }
  }

  canProceedToNextStep(session, currentStep) {
    const completedSteps = this.getCompletedSteps(session);
    return completedSteps.includes(currentStep);
  }

  getCompletedSteps(session) {
    const completed = [];
    for (let i = 1; i <= this.registrationSteps.length; i++) {
      if (session.data[`step${i}`]) {
        const validation = this.validateStepData(i, session.data[`step${i}`]);
        if (validation.valid) {
          completed.push(i);
        }
      }
    }
    return completed;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 创建全局服务实例
const demoDayService = new DemoDayService();

export default demoDayService;

