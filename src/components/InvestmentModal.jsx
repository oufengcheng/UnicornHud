import React, { useState, useEffect } from 'react';
import { paperInvestEngine, realInvestEngine } from '../services/investmentService';

const InvestmentModal = ({ isOpen, onClose, project }) => {
  const [investmentType, setInvestmentType] = useState('paper');
  const [amount, setAmount] = useState('');
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState('selection'); // 'selection', 'confirmation', 'result'

  useEffect(() => {
    if (isOpen) {
      loadUserAccount();
      setStep('selection');
      setResult(null);
    }
  }, [isOpen]);

  const loadUserAccount = async () => {
    try {
      const userId = 'user_123'; // Should get from user authentication in practice
      const account = await paperInvestEngine.getUserAccount(userId);
      setUserAccount(account);
    } catch (error) {
      console.error('Failed to load user account:', error);
    }
  };

  const handleInvestment = async () => {
    if (!amount || parseFloat(amount) < 1000) {
      alert('Investment amount cannot be less than $1,000');
      return;
    }

    setLoading(true);
    try {
      const userId = 'user_123';
      const investmentAmount = parseFloat(amount);

      let result;
      if (investmentType === 'paper') {
        result = await paperInvestEngine.simulateInvestment(
          userId, 
          project.id, 
          investmentAmount
        );
      } else {
        result = await realInvestEngine.executeRealInvestment(
          userId, 
          project.id, 
          investmentAmount
        );
      }

      setResult(result);
      setStep('result');

      if (result.success) {
        // Update user account information
        await loadUserAccount();
      }
    } catch (error) {
      console.error('Investment failed:', error);
      setResult({
        success: false,
        error: error.message
      });
      setStep('result');
    } finally {
      setLoading(false);
    }
  };

  const calculateShares = () => {
    if (!amount || !project.valuation) return 0;
    return ((parseFloat(amount) / project.valuation) * 100).toFixed(4);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Invest in {project?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {step === 'selection' && (
            <div className="space-y-6">
              {/* 项目信息摘要 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{project?.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">当前估值:</span>
                    <span className="ml-2 font-semibold">{formatCurrency(project?.valuation)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">融资阶段:</span>
                    <span className="ml-2 font-semibold">{project?.stage}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">行业:</span>
                    <span className="ml-2 font-semibold">{project?.industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">最小投资:</span>
                    <span className="ml-2 font-semibold">$1,000</span>
                  </div>
                </div>
              </div>

              {/* 投资类型选择 */}
              <div>
                <h4 className="font-semibold mb-3">选择投资类型</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      investmentType === 'paper'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setInvestmentType('paper')}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">📊</span>
                      <span className="font-semibold">Paper Invest</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      使用虚拟资金进行模拟投资，学习投资决策和风险管理
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="text-green-600">
                        可用资金: {formatCurrency(userAccount?.virtual_balance || 0)}
                      </span>
                    </div>
                  </button>

                  <button
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      investmentType === 'real'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setInvestmentType('real')}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">💰</span>
                      <span className="font-semibold">Real Invest</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      使用真实资金进行投资，需要完成投资者认证
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="text-blue-600">
                        需要KYC认证
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 投资金额输入 */}
              <div>
                <h4 className="font-semibold mb-3">投资金额</h4>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="请输入投资金额"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1000"
                      step="1000"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {[10000, 25000, 50000, 100000].map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value.toString())}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {formatCurrency(value)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 投资计算 */}
              {amount && parseFloat(amount) >= 1000 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">投资计算</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>投资金额:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>获得股份:</span>
                      <span className="font-semibold">{calculateShares()}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>交易费用 (2%):</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(amount) * 0.02)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>总计:</span>
                      <span>{formatCurrency(parseFloat(amount) * 1.02)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 投资说明 */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  投资风险提示
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 投资有风险，可能面临本金损失</li>
                  <li>• 创业投资属于高风险投资，成功率较低</li>
                  <li>• 投资决策应基于充分的尽职调查</li>
                  <li>• 建议分散投资，不要将所有资金投入单一项目</li>
                  {investmentType === 'real' && (
                    <li>• 真实投资需要完成KYC认证和合规审查</li>
                  )}
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => setStep('confirmation')}
                  disabled={!amount || parseFloat(amount) < 1000}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  继续投资
                </button>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">确认投资信息</h3>
                <p className="text-gray-600">请仔细核对以下投资信息</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">项目名称:</span>
                  <span className="font-semibold">{project?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">投资类型:</span>
                  <span className="font-semibold">
                    {investmentType === 'paper' ? '📊 Paper Invest (模拟投资)' : '💰 Real Invest (真实投资)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">投资金额:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">获得股份:</span>
                  <span className="font-semibold">{calculateShares()}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">交易费用:</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(amount) * 0.02)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-semibold">总计:</span>
                  <span className="font-bold text-purple-600">{formatCurrency(parseFloat(amount) * 1.02)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('selection')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  返回修改
                </button>
                <button
                  onClick={handleInvestment}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
                >
                  {loading ? '处理中...' : '确认投资'}
                </button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-6">
              <div className="text-center">
                {result?.success ? (
                  <div>
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">投资成功！</h3>
                    <p className="text-gray-600">{result.message}</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">投资失败</h3>
                    <p className="text-gray-600">{result?.error}</p>
                  </div>
                )}
              </div>

              {result?.success && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">投资详情</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>项目:</span>
                      <span className="font-semibold">{project?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>投资金额:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>股份比例:</span>
                      <span className="font-semibold">{calculateShares()}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>投资时间:</span>
                      <span className="font-semibold">{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  {investmentType === 'real' && result.next_steps && (
                    <div className="mt-4">
                      <h5 className="font-semibold mb-2">后续步骤:</h5>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        {result.next_steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  完成
                </button>
                {result?.success && (
                  <button
                    onClick={() => {
                      // 跳转到投资组合页面
                      window.location.href = '/portfolio';
                    }}
                    className="flex-1 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    查看投资组合
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;

