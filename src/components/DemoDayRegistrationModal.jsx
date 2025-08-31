import React, { useState, useEffect } from 'react';
import demoDayService from '../services/demoDayService';

const DemoDayRegistrationModal = ({ isOpen, onClose, event, userProfile = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {}
  });
  const [completedSteps, setCompletedSteps] = useState([]);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // 初始化报名流程
  useEffect(() => {
    if (isOpen && event && !sessionId) {
      initializeRegistration();
    }
  }, [isOpen, event]);

  const initializeRegistration = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await demoDayService.startRegistration(event.id, userProfile);
      setSessionId(result.sessionId);
      setCurrentStep(1);
      
    } catch (err) {
      console.error('初始化报名失败:', err);
      setError(err.message || '初始化报名失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 更新表单数据
  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [`step${step}`]: { ...prev[`step${step}`], ...data }
    }));
  };

  // 提交步骤数据
  const submitStep = async (stepId) => {
    try {
      setLoading(true);
      setError(null);
      
      const stepData = formData[`step${stepId}`];
      const result = await demoDayService.submitStepData(sessionId, stepId, stepData);
      
      setCompletedSteps(result.completedSteps);
      
      if (result.nextStep && stepId < 3) {
        setCurrentStep(result.nextStep);
      }
      
    } catch (err) {
      console.error('提交步骤数据失败:', err);
      setError(err.message || '提交失败，请检查填写的信息');
    } finally {
      setLoading(false);
    }
  };

  // 完成报名
  const completeRegistration = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentInfo = formData.step3.paymentInfo || {};
      const result = await demoDayService.completeRegistration(sessionId, paymentInfo);
      
      setConfirmationData(result);
      setRegistrationComplete(true);
      
    } catch (err) {
      console.error('完成报名失败:', err);
      setError(err.message || '报名完成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置状态
  const resetModal = () => {
    setCurrentStep(1);
    setSessionId(null);
    setFormData({ step1: {}, step2: {}, step3: {} });
    setCompletedSteps([]);
    setRegistrationComplete(false);
    setConfirmationData(null);
    setError(null);
  };

  // 关闭模态框
  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* 头部 */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                🎯 Demo Day 报名
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                {event?.name || 'Demo Day活动'}
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* 进度指示器 */}
        {!registrationComplete && (
          <div style={{
            padding: '1.5rem 2rem',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              {demoDayService.registrationSteps.map((step, index) => (
                <div
                  key={step.id}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: completedSteps.includes(step.id) ? '#059669' :
                                   currentStep === step.id ? '#667eea' : '#d1d5db',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    margin: '0 auto 0.5rem auto'
                  }}>
                    {completedSteps.includes(step.id) ? '✓' : step.id}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: currentStep === step.id ? '#667eea' : '#6b7280'
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginTop: '0.25rem'
                  }}>
                    {step.description}
                  </div>
                  
                  {/* 连接线 */}
                  {index < demoDayService.registrationSteps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: 'calc(50% + 20px)',
                      right: 'calc(-50% + 20px)',
                      height: '2px',
                      backgroundColor: completedSteps.includes(step.id) ? '#059669' : '#d1d5db'
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div style={{ 
          height: registrationComplete ? 'auto' : 'calc(90vh - 200px)', 
          overflow: 'auto',
          padding: '2rem'
        }}>
          {/* 加载状态 */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}></div>
              <p style={{ color: '#6b7280' }}>处理中...</p>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#dc2626' }}>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* 报名完成页面 */}
          {registrationComplete && confirmationData && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '1rem'
              }}>
                报名成功！
              </h3>
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '2px solid #10b981',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#065f46',
                  marginBottom: '0.5rem'
                }}>
                  确认码: {confirmationData.confirmationCode}
                </div>
                <div style={{ color: '#047857', fontSize: '0.9rem' }}>
                  请保存此确认码，活动当天需要出示
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  报名信息摘要
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>参与者</div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {confirmationData.summary.participant.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>公司</div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {confirmationData.summary.participant.company}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>项目</div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {confirmationData.summary.participant.project}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>行业</div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {confirmationData.summary.project.industry}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{ color: '#0369a1', fontSize: '0.9rem' }}>
                  📧 确认邮件已发送至 {confirmationData.summary.participant.email}
                </div>
              </div>

              <button
                onClick={handleClose}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                完成
              </button>
            </div>
          )}

          {/* 步骤1: 参与者信息 */}
          {!loading && !registrationComplete && currentStep === 1 && (
            <Step1Form
              data={formData.step1}
              onChange={(data) => updateFormData(1, data)}
              onNext={() => submitStep(1)}
              loading={loading}
            />
          )}

          {/* 步骤2: 联系信息 */}
          {!loading && !registrationComplete && currentStep === 2 && (
            <Step2Form
              data={formData.step2}
              onChange={(data) => updateFormData(2, data)}
              onNext={() => submitStep(2)}
              onBack={() => setCurrentStep(1)}
              loading={loading}
            />
          )}

          {/* 步骤3: 确认报名 */}
          {!loading && !registrationComplete && currentStep === 3 && (
            <Step3Form
              data={formData.step3}
              onChange={(data) => updateFormData(3, data)}
              onNext={completeRegistration}
              onBack={() => setCurrentStep(2)}
              loading={loading}
              event={event}
              summary={formData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 步骤1组件: 参与者信息
const Step1Form = ({ data, onChange, onNext, loading }) => {
  const [formData, setFormData] = useState({
    participantType: 'founder',
    companyName: '',
    projectName: '',
    industry: '',
    stage: '',
    projectDescription: '',
    teamSize: '',
    ...data
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '1.5rem'
      }}>
        参与者信息
      </h3>

      {/* 参与者类型 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          参与者类型 *
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { value: 'founder', label: '创始人/CEO' },
            { value: 'investor', label: '投资者' },
            { value: 'partner', label: '合作伙伴' }
          ].map(option => (
            <label key={option.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value={option.value}
                checked={formData.participantType === option.value}
                onChange={(e) => handleChange('participantType', e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* 公司名称 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          公司名称 *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          placeholder="请输入公司名称"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 项目名称 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          项目名称 *
        </label>
        <input
          type="text"
          value={formData.projectName}
          onChange={(e) => handleChange('projectName', e.target.value)}
          placeholder="请输入项目名称"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 行业 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          所属行业 *
        </label>
        <select
          value={formData.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <option value="">请选择行业</option>
          <option value="人工智能">人工智能</option>
          <option value="金融科技">金融科技</option>
          <option value="医疗健康">医疗健康</option>
          <option value="企业服务">企业服务</option>
          <option value="消费科技">消费科技</option>
          <option value="教育科技">教育科技</option>
          <option value="清洁能源">清洁能源</option>
          <option value="其他">其他</option>
        </select>
      </div>

      {/* 发展阶段 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          发展阶段 *
        </label>
        <select
          value={formData.stage}
          onChange={(e) => handleChange('stage', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <option value="">请选择阶段</option>
          <option value="种子轮">种子轮</option>
          <option value="A轮">A轮</option>
          <option value="B轮">B轮</option>
          <option value="C轮">C轮</option>
          <option value="D轮及以后">D轮及以后</option>
          <option value="已上市">已上市</option>
        </select>
      </div>

      {/* 项目描述 */}
      {formData.participantType === 'founder' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            项目描述 *
          </label>
          <textarea
            value={formData.projectDescription}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            placeholder="请简要描述您的项目，包括核心产品、目标市场、竞争优势等（200字以内）"
            required
            rows={4}
            maxLength={200}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            textAlign: 'right',
            marginTop: '0.25rem'
          }}>
            {formData.projectDescription.length}/200
          </div>
        </div>
      )}

      {/* 提交按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: loading ? '#9ca3af' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? '提交中...' : '下一步'}
        </button>
      </div>
    </form>
  );
};

// 步骤2组件: 联系信息
const Step2Form = ({ data, onChange, onNext, onBack, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    website: '',
    position: '',
    ...data
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '1.5rem'
      }}>
        联系信息
      </h3>

      {/* 姓名 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          姓名 *
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="请输入您的姓名"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 邮箱 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          邮箱地址 *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="请输入邮箱地址"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 电话 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          电话号码 *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="请输入电话号码"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* LinkedIn */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          LinkedIn 个人资料 *
        </label>
        <input
          type="url"
          value={formData.linkedIn}
          onChange={(e) => handleChange('linkedIn', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 网站 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          公司网站
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://yourcompany.com"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 职位 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          职位
        </label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          placeholder="请输入您的职位"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* 按钮组 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          上一步
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: loading ? '#9ca3af' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? '提交中...' : '下一步'}
        </button>
      </div>
    </form>
  );
};

// 步骤3组件: 确认报名
const Step3Form = ({ data, onChange, onNext, onBack, loading, event, summary }) => {
  const [formData, setFormData] = useState({
    agreeToTerms: false,
    agreeToPrivacy: false,
    networkingInterests: [],
    specialRequests: '',
    paymentInfo: {},
    ...data
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const registrationFee = event?.registrationFee || 0;

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '1.5rem'
      }}>
        确认报名
      </h3>

      {/* 报名摘要 */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          报名信息确认
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: '#6b7280' }}>姓名: </span>
            <span style={{ fontWeight: '500' }}>{summary.step2?.fullName}</span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>邮箱: </span>
            <span style={{ fontWeight: '500' }}>{summary.step2?.email}</span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>公司: </span>
            <span style={{ fontWeight: '500' }}>{summary.step1?.companyName}</span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>项目: </span>
            <span style={{ fontWeight: '500' }}>{summary.step1?.projectName}</span>
          </div>
        </div>
      </div>

      {/* 网络兴趣 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          网络兴趣（可多选）
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            '寻找投资者',
            '寻找合作伙伴',
            '技术交流',
            '市场拓展',
            '人才招聘',
            '媒体曝光'
          ].map(interest => (
            <label key={interest} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.networkingInterests.includes(interest)}
                onChange={(e) => {
                  const interests = e.target.checked
                    ? [...formData.networkingInterests, interest]
                    : formData.networkingInterests.filter(i => i !== interest);
                  handleChange('networkingInterests', interests);
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: '0.875rem' }}>{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 特殊要求 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          特殊要求或备注
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          placeholder="如有特殊饮食要求、住宿需求或其他特殊安排，请在此说明"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      {/* 支付信息 */}
      {registrationFee > 0 && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#0369a1',
            marginBottom: '1rem'
          }}>
            支付信息
          </h4>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0369a1' }}>
              报名费: ${registrationFee}
            </span>
          </div>
          
          {/* 信用卡信息 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                卡号 *
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                onChange={(e) => handleChange('paymentInfo', { 
                  ...formData.paymentInfo, 
                  cardNumber: e.target.value 
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                有效期 *
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                onChange={(e) => handleChange('paymentInfo', { 
                  ...formData.paymentInfo, 
                  expiryDate: e.target.value 
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                CVV *
              </label>
              <input
                type="text"
                placeholder="123"
                onChange={(e) => handleChange('paymentInfo', { 
                  ...formData.paymentInfo, 
                  cvv: e.target.value 
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                持卡人姓名 *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                onChange={(e) => handleChange('paymentInfo', { 
                  ...formData.paymentInfo, 
                  cardholderName: e.target.value 
                })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 条款同意 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            required
            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
          />
          <span style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            我已阅读并同意 <a href="#" style={{ color: '#667eea', textDecoration: 'underline' }}>活动条款和条件</a> *
          </span>
        </label>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.agreeToPrivacy}
            onChange={(e) => handleChange('agreeToPrivacy', e.target.checked)}
            required
            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
          />
          <span style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            我已阅读并同意 <a href="#" style={{ color: '#667eea', textDecoration: 'underline' }}>隐私政策</a> *
          </span>
        </label>
      </div>

      {/* 按钮组 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          上一步
        </button>
        <button
          type="submit"
          disabled={loading || !formData.agreeToTerms || !formData.agreeToPrivacy}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: (loading || !formData.agreeToTerms || !formData.agreeToPrivacy) ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: (loading || !formData.agreeToTerms || !formData.agreeToPrivacy) ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? '处理中...' : `完成报名${registrationFee > 0 ? ` ($${registrationFee})` : ''}`}
        </button>
      </div>
    </form>
  );
};

export default DemoDayRegistrationModal;

