import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    user_type: '',
    company: '',
    position: '',
    bio: '',
    linkedin: '',
    investment_focus: [],
    startup_stage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'investment_focus') {
      setFormData(prev => ({
        ...prev,
        investment_focus: checked 
          ? [...prev.investment_focus, value]
          : prev.investment_focus.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // 清除错误信息
    if (error) setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.user_type) {
          setError('请选择用户类型');
          return false;
        }
        break;
      case 2:
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.full_name) {
          setError('请填写所有必需字段');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('两次输入的密码不一致');
          return false;
        }
        if (formData.password.length < 8) {
          setError('密码长度至少8位');
          return false;
        }
        break;
      case 3:
        // 第三步是可选的，不需要验证
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://8xhpiqcqnwyz.manus.space/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // 保存用户信息和token到localStorage
        localStorage.setItem('unicorn100_token', data.data.token);
        localStorage.setItem('unicorn100_user', JSON.stringify(data.data.user));
        
        // 显示成功消息
        alert('注册成功！欢迎加入Unicorn 100');
        
        // 跳转到主页
        navigate('/');
      } else {
        setError(data.error || '注册失败，请重试');
      }
    } catch (error) {
      console.error('注册错误:', error);
      setError('网络连接失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  };

  const investmentFocusOptions = [
    '人工智能', '生物技术', '清洁能源', '金融科技', 
    '教育科技', '航空航天', '医疗健康', '企业服务'
  ];

  const startupStageOptions = [
    '概念阶段', '种子轮', 'A轮', 'B轮', 'C轮及以后'
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '3rem',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 装饰性背景 */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(124,58,237,0.1), rgba(59,130,246,0.1))',
          borderRadius: '50%',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦄</div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              加入Unicorn 100
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              连接创新与资本，发现投资机会
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              {[1, 2, 3].map((step) => (
                <div key={step} style={{
                  width: '30%',
                  height: '4px',
                  backgroundColor: step <= currentStep ? '#7c3aed' : '#e5e7eb',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}></div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              第 {currentStep} 步，共 3 步
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: User Type Selection */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                  选择您的身份
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.5rem',
                    border: `2px solid ${formData.user_type === 'investor' ? '#7c3aed' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: formData.user_type === 'investor' ? '#f3f4f6' : 'white'
                  }}>
                    <input
                      type="radio"
                      name="user_type"
                      value="investor"
                      checked={formData.user_type === 'investor'}
                      onChange={handleInputChange}
                      style={{ marginRight: '1rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>投资人</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        寻找优质投资项目，发现下一个独角兽
                      </div>
                    </div>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.5rem',
                    border: `2px solid ${formData.user_type === 'founder' ? '#7c3aed' : '#e5e7eb'}`,
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: formData.user_type === 'founder' ? '#f3f4f6' : 'white'
                  }}>
                    <input
                      type="radio"
                      name="user_type"
                      value="founder"
                      checked={formData.user_type === 'founder'}
                      onChange={handleInputChange}
                      style={{ marginRight: '1rem' }}
                    />
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>创始人</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        展示创新项目，获得投资和合作机会
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                  基本信息
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      姓名 *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      placeholder="请输入您的姓名"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      邮箱地址 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="请输入您的邮箱"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      密码 *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="至少8位，包含大小写字母和数字"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          paddingRight: '3rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6b7280',
                          fontSize: '1.2rem'
                        }}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      确认密码 *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="请再次输入密码"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Professional Information */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                  专业信息（可选）
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      公司/机构
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="请输入您的公司或机构名称"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      职位
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="请输入您的职位"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {formData.user_type === 'investor' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        投资偏好
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {investmentFocusOptions.map((option) => (
                          <label key={option} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                            <input
                              type="checkbox"
                              name="investment_focus"
                              value={option}
                              checked={formData.investment_focus.includes(option)}
                              onChange={handleInputChange}
                              style={{ marginRight: '0.5rem' }}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.user_type === 'founder' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        创业阶段
                      </label>
                      <select
                        name="startup_stage"
                        value={formData.startup_stage}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">请选择创业阶段</option>
                        {startupStageOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      个人简介
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="简单介绍一下您的背景和经验"
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  style={{
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  上一步
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginLeft: 'auto'
                  }}
                >
                  下一步
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#9ca3af' : 'linear-gradient(to right, #7c3aed, #3b82f6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginLeft: 'auto'
                  }}
                >
                  {loading ? '注册中...' : '完成注册'}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              已有账户？{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7c3aed',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.875rem'
                }}
              >
                立即登录
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
