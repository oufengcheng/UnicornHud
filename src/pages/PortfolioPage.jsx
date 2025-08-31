import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Calendar, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PortfolioEmptyState } from '../components/EmptyState';
import authService from '../services/authService';
import { paperInvestEngine } from '../services/investmentService';

const PortfolioPage = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userAccount, setUserAccount] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      loadPortfolioData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const userId = currentUser?.id || 'user_123'; // Use actual user ID
      
      // 获取用户账户信息
      const account = await paperInvestEngine.getUserAccount(userId);
      setUserAccount(account);
      
      // 更新投资组合估值
      const valuation = await paperInvestEngine.updatePortfolioValuation(userId);
      
      // 重新获取更新后的账户信息
      const updatedAccount = await paperInvestEngine.getUserAccount(userId);
      setUserAccount(updatedAccount);
      
      setPortfolioData({
        ...updatedAccount,
        valuation: valuation
      });
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle empty state actions
  const handleExploreProjects = () => {
    navigate('/projects');
  };

  const handleLearnMore = () => {
    navigate('/market-data');
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount?.toLocaleString() || 0}`;
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  const getReturnColor = (value) => {
    if (value > 0) return '#10b981'; // green
    if (value < 0) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: '#6b7280' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Show empty state if user is not logged in or has no investments
  if (!currentUser || !portfolioData || (portfolioData.investments && portfolioData.investments.length === 0)) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📊 My Investment Portfolio
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Track your investment performance and manage your portfolio
          </p>
        </div>

        {/* Empty State */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <PortfolioEmptyState
            onExploreProjects={handleExploreProjects}
            onLearnMore={handleLearnMore}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📊 My Investment Portfolio
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
          Track your investment performance and manage your portfolio
        </p>
      </div>

      {/* Portfolio Summary */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        marginTop: '-2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              虚拟资金余额
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
              {formatCurrency(userAccount?.virtual_balance || 0)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              总投资金额
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
              {formatCurrency(userAccount?.total_invested || 0)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              当前价值
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
              {formatCurrency(portfolioData?.valuation?.current_value || 0)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              总收益
            </div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: getReturnColor(portfolioData?.valuation?.total_returns || 0)
            }}>
              {formatCurrency(portfolioData?.valuation?.total_returns || 0)}
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: getReturnColor(portfolioData?.valuation?.roi_percentage || 0)
            }}>
              {formatPercentage(portfolioData?.valuation?.roi_percentage || 0)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'overview', label: '总览', icon: '📊' },
              { id: 'investments', label: '投资项目', icon: '💼' },
              { id: 'performance', label: '投资表现', icon: '📈' },
              { id: 'transactions', label: '交易记录', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                  color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'overview' && (
              <PortfolioOverview 
                userAccount={userAccount} 
                portfolioData={portfolioData}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
                getReturnColor={getReturnColor}
              />
            )}
            
            {activeTab === 'investments' && (
              <InvestmentsList 
                portfolio={userAccount?.portfolio || []}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
                getReturnColor={getReturnColor}
              />
            )}
            
            {activeTab === 'performance' && (
              <PerformanceAnalysis 
                userAccount={userAccount}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
                getReturnColor={getReturnColor}
              />
            )}
            
            {activeTab === 'transactions' && (
              <TransactionHistory 
                userId="user_123"
                formatCurrency={formatCurrency}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 投资组合总览组件
const PortfolioOverview = ({ userAccount, portfolioData, formatCurrency, formatPercentage, getReturnColor }) => {
  const portfolio = userAccount?.portfolio || [];
  const activeInvestments = portfolio.filter(inv => inv.status === 'active');
  
  return (
    <div style={{ space: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        投资组合总览
      </h3>
      
      {activeInvestments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>还没有投资项目</h4>
          <p>开始您的第一笔投资，建立投资组合</p>
          <button
            onClick={() => window.location.href = '/projects'}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            发现项目
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {activeInvestments.map((investment, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {investment.project_name}
                </h4>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem'
                }}>
                  {investment.status}
                </span>
              </div>
              
              <div style={{ space: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>投资金额:</span>
                  <span style={{ fontWeight: '600' }}>
                    {formatCurrency(investment.investment_amount)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>当前价值:</span>
                  <span style={{ fontWeight: '600' }}>
                    {formatCurrency(investment.current_value || investment.investment_amount)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>股份比例:</span>
                  <span style={{ fontWeight: '600' }}>
                    {formatPercentage(investment.shares_percentage)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>投资日期:</span>
                  <span style={{ fontWeight: '600' }}>
                    {new Date(investment.investment_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 投资项目列表组件
const InvestmentsList = ({ portfolio, formatCurrency, formatPercentage, getReturnColor }) => {
  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        投资项目列表
      </h3>
      
      {portfolio.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          暂无投资项目
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>项目名称</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>投资金额</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>当前价值</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>股份比例</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#374151' }}>状态</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>投资日期</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((investment, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>
                    {investment.project_name}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {formatCurrency(investment.investment_amount)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {formatCurrency(investment.current_value || investment.investment_amount)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {formatPercentage(investment.shares_percentage)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: investment.status === 'active' ? '#10b981' : '#6b7280',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.75rem'
                    }}>
                      {investment.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#6b7280' }}>
                    {new Date(investment.investment_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 投资表现分析组件
const PerformanceAnalysis = ({ userAccount, formatCurrency, formatPercentage, getReturnColor }) => {
  const portfolio = userAccount?.portfolio || [];
  const activeInvestments = portfolio.filter(inv => inv.status === 'active');
  
  // 计算表现指标
  const totalInvested = userAccount?.total_invested || 0;
  const totalCurrentValue = activeInvestments.reduce((sum, inv) => 
    sum + (inv.current_value || inv.investment_amount), 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const roi = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  
  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        投资表现分析
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            投资项目数
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
            {activeInvestments.length}
          </div>
        </div>
        
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            平均投资金额
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
            {formatCurrency(activeInvestments.length > 0 ? totalInvested / activeInvestments.length : 0)}
          </div>
        </div>
        
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            投资回报率
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: getReturnColor(roi)
          }}>
            {formatPercentage(roi)}
          </div>
        </div>
      </div>
      
      {activeInvestments.length > 0 && (
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            项目表现排名
          </h4>
          <div style={{ space: '1rem' }}>
            {activeInvestments
              .map(inv => ({
                ...inv,
                returns: (inv.current_value || inv.investment_amount) - inv.investment_amount,
                roi: ((inv.current_value || inv.investment_amount) - inv.investment_amount) / inv.investment_amount * 100
              }))
              .sort((a, b) => b.roi - a.roi)
              .map((investment, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: index === 0 ? '#fef3c7' : '#f9fafb',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <span style={{ fontWeight: '600' }}>#{index + 1} {investment.project_name}</span>
                    {index === 0 && <span style={{ marginLeft: '0.5rem' }}>🏆</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '600',
                      color: getReturnColor(investment.returns)
                    }}>
                      {formatCurrency(investment.returns)}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: getReturnColor(investment.roi)
                    }}>
                      {formatPercentage(investment.roi)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 交易记录组件
const TransactionHistory = ({ userId, formatCurrency }) => {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    loadTransactions();
  }, [userId]);
  
  const loadTransactions = () => {
    const transactionsKey = `transactions_${userId}`;
    const transactionData = JSON.parse(localStorage.getItem(transactionsKey) || '[]');
    setTransactions(transactionData.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)));
  };
  
  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        交易记录
      </h3>
      
      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          暂无交易记录
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>交易ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>类型</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151' }}>项目</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>金额</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>手续费</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#374151' }}>状态</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#374151' }}>日期</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {transaction.transaction_id.substring(0, 12)}...
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: transaction.transaction_type === 'invest' ? '#3b82f6' : '#6b7280',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.75rem'
                    }}>
                      {transaction.transaction_type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {transaction.project_id}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#6b7280' }}>
                    {formatCurrency(transaction.fees)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: transaction.status === 'completed' ? '#10b981' : '#f59e0b',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.75rem'
                    }}>
                      {transaction.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#6b7280' }}>
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;

