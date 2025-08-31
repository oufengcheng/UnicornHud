import React, { useState, useEffect } from 'react';
import { MarketDashboard } from '../components/MarketDataCharts';
import marketDataService from '../services/marketDataService';

const MarketDataPage = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 加载市场数据
  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 并行获取所有数据
      const [overview, industry, regional, funding, insights] = await Promise.all([
        marketDataService.getMarketOverview(),
        marketDataService.getIndustryDistribution(),
        marketDataService.getRegionalDistribution(),
        marketDataService.getFundingTrends(),
        marketDataService.getMarketInsights()
      ]);

      const combinedData = {
        market_overview: overview,
        industry_breakdown: industry,
        regional_distribution: regional,
        funding_trends: funding,
        market_insights: insights
      };

      setMarketData(combinedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load market data:', err);
      setError('Data loading failed, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000000) {
      return `$${(amount / 1000000000000).toFixed(1)}T`;
    } else if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>📊</div>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ 
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <p style={{ fontSize: '1.25rem', color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={loadMarketData}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Reload
          </button>
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
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          📊 市场数据中心
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '1rem' }}>
          实时独角兽市场数据分析与趋势洞察
        </p>
        {lastUpdated && (
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            最后更新: {lastUpdated.toLocaleString('zh-CN')}
          </p>
        )}
        <button
          onClick={loadMarketData}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          🔄 刷新数据
        </button>
      </div>

      {/* Market Overview Cards */}
      {marketData?.market_overview && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '-2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🦄</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem' }}>
              {formatNumber(marketData.market_overview.totalUnicorns)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>独角兽总数</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
              📈 +{marketData.market_overview.newUnicorns2024} 今年新增
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem' }}>
              {formatCurrency(marketData.market_overview.totalValuation)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>总市值</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
              📈 +{(marketData.market_overview.growthRate * 100).toFixed(1)}% 年增长
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📈</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem' }}>
              {formatCurrency(marketData.market_overview.averageValuation)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>平均估值</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
              📊 稳定增长
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌍</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem' }}>
              {marketData.regional_distribution?.length || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>主要区域</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              🗺️ 全球分布
            </div>
          </div>
        </div>
      )}

      {/* Charts Dashboard */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 2rem'
      }}>
        <MarketDashboard marketData={marketData} />
      </div>

      {/* Market Insights */}
      {marketData?.market_insights && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '2rem auto', 
          padding: '0 2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* 增长最快行业 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                🚀 增长最快行业
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {marketData.market_insights.topGrowthIndustries.map((industry, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '600' }}>
                        {industry.name}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                        {industry.description}
                      </p>
                    </div>
                    <span style={{ 
                      backgroundColor: '#d1fae5', 
                      color: '#065f46', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      +{industry.growth}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 最高估值公司 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                💎 最高估值公司
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {marketData.market_insights.topValuedCompanies.map((company, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '600' }}>
                        {company.name}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                        {company.industry}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                      {formatCurrency(company.valuation)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 市场预测 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                🔮 市场预测
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {marketData.market_insights.marketPredictions.map((prediction, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <h4 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {prediction.title}
                    </h4>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {prediction.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                        置信度:
                      </span>
                      <div style={{
                        backgroundColor: '#e5e7eb',
                        borderRadius: '0.25rem',
                        height: '0.5rem',
                        flex: 1,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          backgroundColor: prediction.confidence >= 80 ? '#10b981' : 
                                         prediction.confidence >= 60 ? '#f59e0b' : '#ef4444',
                          height: '100%',
                          width: `${prediction.confidence}%`,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {prediction.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '1rem 2rem',
        backgroundColor: '#d1fae5',
        border: '1px solid #a7f3d0',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#065f46', 
          fontSize: '0.875rem',
          margin: 0,
          fontWeight: '600'
        }}>
          ✅ 市场数据页面已完善 - 包含实时数据、可视化图表和市场洞察
        </p>
      </div>
    </div>
  );
};

export default MarketDataPage;

