import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import MobileChart from './MobileChart';

/**
 * 高级数据分析组件
 * 提供深度的数据分析和可视化功能
 */
const AdvancedAnalytics = ({
  data = {},
  timeRange = '1M',
  onTimeRangeChange,
  onExport,
  className = '',
  ...props
}) => {
  const { t, formatCurrency, formatNumber, formatPercentage } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [insights, setInsights] = useState([]);
  
  const analyticsRef = useRef(null);

  // 时间范围选项
  const timeRangeOptions = [
    { value: '1D', label: t('analytics.1day') },
    { value: '1W', label: t('analytics.1week') },
    { value: '1M', label: t('analytics.1month') },
    { value: '3M', label: t('analytics.3months') },
    { value: '6M', label: t('analytics.6months') },
    { value: '1Y', label: t('analytics.1year') },
    { value: 'ALL', label: t('analytics.all') }
  ];

  // 分析标签页
  const analyticsTabs = [
    { id: 'overview', label: t('analytics.overview'), icon: '📊' },
    { id: 'performance', label: t('analytics.performance'), icon: '📈' },
    { id: 'risk', label: t('analytics.risk'), icon: '⚠️' },
    { id: 'correlation', label: t('analytics.correlation'), icon: '🔗' },
    { id: 'prediction', label: t('analytics.prediction'), icon: '🔮' }
  ];

  // 生成AI洞察
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      generateInsights();
    }
  }, [data, timeRange]);

  const generateInsights = () => {
    const newInsights = [];
    
    // 性能洞察
    if (data.performance) {
      const { totalReturn, volatility, sharpeRatio } = data.performance;
      
      if (totalReturn > 0.15) {
        newInsights.push({
          type: 'positive',
          title: t('analytics.insights.highReturn'),
          description: t('analytics.insights.highReturnDesc', { return: formatPercentage(totalReturn) }),
          confidence: 0.85
        });
      }
      
      if (sharpeRatio > 1.5) {
        newInsights.push({
          type: 'positive',
          title: t('analytics.insights.excellentSharpe'),
          description: t('analytics.insights.excellentSharpeDesc', { ratio: sharpeRatio.toFixed(2) }),
          confidence: 0.92
        });
      }
      
      if (volatility > 0.3) {
        newInsights.push({
          type: 'warning',
          title: t('analytics.insights.highVolatility'),
          description: t('analytics.insights.highVolatilityDesc', { volatility: formatPercentage(volatility) }),
          confidence: 0.78
        });
      }
    }
    
    // 风险洞察
    if (data.risk) {
      const { maxDrawdown, var95 } = data.risk;
      
      if (maxDrawdown > 0.2) {
        newInsights.push({
          type: 'negative',
          title: t('analytics.insights.highDrawdown'),
          description: t('analytics.insights.highDrawdownDesc', { drawdown: formatPercentage(maxDrawdown) }),
          confidence: 0.88
        });
      }
    }
    
    // 多样化洞察
    if (data.diversification) {
      const { concentrationRisk, sectorAllocation } = data.diversification;
      
      if (concentrationRisk > 0.4) {
        newInsights.push({
          type: 'warning',
          title: t('analytics.insights.concentrationRisk'),
          description: t('analytics.insights.concentrationRiskDesc'),
          confidence: 0.82
        });
      }
    }
    
    setInsights(newInsights);
  };

  // 处理导出
  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport?.(format, { timeRange, activeTab, data });
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 渲染概览标签页
  const renderOverviewTab = () => {
    const { overview } = data;
    if (!overview) return null;

    return (
      <div className="analytics-overview">
        {/* 关键指标卡片 */}
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-header">
              <span className="metric-icon">💰</span>
              <h3 className="metric-title">{t('analytics.totalValue')}</h3>
            </div>
            <div className="metric-value">
              {formatCurrency(overview.totalValue)}
            </div>
            <div className="metric-change positive">
              +{formatPercentage(overview.totalValueChange)}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">📈</span>
              <h3 className="metric-title">{t('analytics.totalReturn')}</h3>
            </div>
            <div className="metric-value">
              {formatPercentage(overview.totalReturn)}
            </div>
            <div className={`metric-change ${overview.totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {overview.totalReturn >= 0 ? '+' : ''}{formatPercentage(overview.totalReturn)}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🎯</span>
              <h3 className="metric-title">{t('analytics.activeInvestments')}</h3>
            </div>
            <div className="metric-value">
              {formatNumber(overview.activeInvestments)}
            </div>
            <div className="metric-change neutral">
              {t('analytics.projects')}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">⚡</span>
              <h3 className="metric-title">{t('analytics.avgReturn')}</h3>
            </div>
            <div className="metric-value">
              {formatPercentage(overview.avgReturn)}
            </div>
            <div className="metric-change neutral">
              {t('analytics.annualized')}
            </div>
          </div>
        </div>

        {/* 投资组合分布图表 */}
        <div className="chart-section">
          <h3 className="section-title">{t('analytics.portfolioDistribution')}</h3>
          <MobileChart
            data={overview.sectorDistribution}
            type="pie"
            height={300}
            showLegend={true}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']}
          />
        </div>

        {/* 性能趋势图表 */}
        <div className="chart-section">
          <h3 className="section-title">{t('analytics.performanceTrend')}</h3>
          <MobileChart
            data={overview.performanceTrend}
            type="area"
            height={250}
            showTooltip={true}
            colors={['#10b981']}
          />
        </div>
      </div>
    );
  };

  // 渲染性能分析标签页
  const renderPerformanceTab = () => {
    const { performance } = data;
    if (!performance) return null;

    return (
      <div className="analytics-performance">
        {/* 性能指标 */}
        <div className="performance-metrics">
          <div className="metric-row">
            <span className="metric-label">{t('analytics.totalReturn')}</span>
            <span className="metric-value">{formatPercentage(performance.totalReturn)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">{t('analytics.annualizedReturn')}</span>
            <span className="metric-value">{formatPercentage(performance.annualizedReturn)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">{t('analytics.volatility')}</span>
            <span className="metric-value">{formatPercentage(performance.volatility)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">{t('analytics.sharpeRatio')}</span>
            <span className="metric-value">{performance.sharpeRatio.toFixed(2)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">{t('analytics.maxDrawdown')}</span>
            <span className="metric-value negative">{formatPercentage(performance.maxDrawdown)}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">{t('analytics.winRate')}</span>
            <span className="metric-value">{formatPercentage(performance.winRate)}</span>
          </div>
        </div>

        {/* 收益分布图表 */}
        <div className="chart-section">
          <h3 className="section-title">{t('analytics.returnDistribution')}</h3>
          <MobileChart
            data={performance.returnDistribution}
            type="bar"
            height={250}
            colors={['#3b82f6']}
          />
        </div>

        {/* 滚动收益图表 */}
        <div className="chart-section">
          <h3 className="section-title">{t('analytics.rollingReturns')}</h3>
          <MobileChart
            data={performance.rollingReturns}
            type="line"
            height={250}
            colors={['#10b981', '#f59e0b']}
          />
        </div>
      </div>
    );
  };

  // 渲染风险分析标签页
  const renderRiskTab = () => {
    const { risk } = data;
    if (!risk) return null;

    return (
      <div className="analytics-risk">
        {/* 风险指标 */}
        <div className="risk-metrics">
          <div className="risk-card high">
            <div className="risk-header">
              <span className="risk-icon">🔴</span>
              <h4 className="risk-title">{t('analytics.highRisk')}</h4>
            </div>
            <div className="risk-value">{formatPercentage(risk.highRisk)}</div>
          </div>

          <div className="risk-card medium">
            <div className="risk-header">
              <span className="risk-icon">🟡</span>
              <h4 className="risk-title">{t('analytics.mediumRisk')}</h4>
            </div>
            <div className="risk-value">{formatPercentage(risk.mediumRisk)}</div>
          </div>

          <div className="risk-card low">
            <div className="risk-header">
              <span className="risk-icon">🟢</span>
              <h4 className="risk-title">{t('analytics.lowRisk')}</h4>
            </div>
            <div className="risk-value">{formatPercentage(risk.lowRisk)}</div>
          </div>
        </div>

        {/* VaR分析 */}
        <div className="var-analysis">
          <h3 className="section-title">{t('analytics.varAnalysis')}</h3>
          <div className="var-metrics">
            <div className="var-item">
              <span className="var-label">VaR (95%)</span>
              <span className="var-value negative">{formatCurrency(risk.var95)}</span>
            </div>
            <div className="var-item">
              <span className="var-label">VaR (99%)</span>
              <span className="var-value negative">{formatCurrency(risk.var99)}</span>
            </div>
            <div className="var-item">
              <span className="var-label">CVaR (95%)</span>
              <span className="var-value negative">{formatCurrency(risk.cvar95)}</span>
            </div>
          </div>
        </div>

        {/* 风险分布图表 */}
        <div className="chart-section">
          <h3 className="section-title">{t('analytics.riskDistribution')}</h3>
          <MobileChart
            data={risk.riskDistribution}
            type="pie"
            height={250}
            colors={['#ef4444', '#f59e0b', '#10b981']}
          />
        </div>
      </div>
    );
  };

  // 渲染相关性分析标签页
  const renderCorrelationTab = () => {
    const { correlation } = data;
    if (!correlation) return null;

    return (
      <div className="analytics-correlation">
        {/* 相关性矩阵 */}
        <div className="correlation-matrix">
          <h3 className="section-title">{t('analytics.correlationMatrix')}</h3>
          <div className="matrix-grid">
            {correlation.matrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((value, j) => (
                  <div 
                    key={j} 
                    className={`matrix-cell ${getCorrelationLevel(value)}`}
                    title={`${correlation.labels[i]} vs ${correlation.labels[j]}: ${value.toFixed(2)}`}
                  >
                    {value.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 多样化指标 */}
        <div className="diversification-metrics">
          <h3 className="section-title">{t('analytics.diversification')}</h3>
          <div className="diversification-score">
            <div className="score-circle">
              <span className="score-value">{Math.round(correlation.diversificationScore * 100)}</span>
              <span className="score-label">{t('analytics.diversificationScore')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染预测分析标签页
  const renderPredictionTab = () => {
    const { prediction } = data;
    if (!prediction) return null;

    return (
      <div className="analytics-prediction">
        {/* 预测指标 */}
        <div className="prediction-metrics">
          <div className="prediction-card">
            <h4 className="prediction-title">{t('analytics.expectedReturn')}</h4>
            <div className="prediction-value positive">
              {formatPercentage(prediction.expectedReturn)}
            </div>
            <div className="prediction-confidence">
              {t('analytics.confidence')}: {formatPercentage(prediction.confidence)}
            </div>
          </div>

          <div className="prediction-card">
            <h4 className="prediction-title">{t('analytics.expectedVolatility')}</h4>
            <div className="prediction-value neutral">
              {formatPercentage(prediction.expectedVolatility)}
            </div>
            <div className="prediction-confidence">
              {t('analytics.confidence')}: {formatPercentage(prediction.volatilityConfidence)}
            </div>
          </div>
        </div>

        {/* 预测图表 */}
        <div className="chart-section">
          <h3 className="section-title">{t('analytics.predictionChart')}</h3>
          <MobileChart
            data={prediction.forecastData}
            type="line"
            height={300}
            colors={['#3b82f6', '#10b981', '#f59e0b']}
          />
        </div>

        {/* 情景分析 */}
        <div className="scenario-analysis">
          <h3 className="section-title">{t('analytics.scenarioAnalysis')}</h3>
          <div className="scenario-grid">
            <div className="scenario-item bull">
              <h4 className="scenario-title">{t('analytics.bullScenario')}</h4>
              <div className="scenario-return">{formatPercentage(prediction.scenarios.bull)}</div>
              <div className="scenario-probability">{formatPercentage(prediction.scenarios.bullProbability)}</div>
            </div>
            <div className="scenario-item base">
              <h4 className="scenario-title">{t('analytics.baseScenario')}</h4>
              <div className="scenario-return">{formatPercentage(prediction.scenarios.base)}</div>
              <div className="scenario-probability">{formatPercentage(prediction.scenarios.baseProbability)}</div>
            </div>
            <div className="scenario-item bear">
              <h4 className="scenario-title">{t('analytics.bearScenario')}</h4>
              <div className="scenario-return">{formatPercentage(prediction.scenarios.bear)}</div>
              <div className="scenario-probability">{formatPercentage(prediction.scenarios.bearProbability)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 获取相关性级别
  const getCorrelationLevel = (value) => {
    const abs = Math.abs(value);
    if (abs >= 0.8) return 'very-high';
    if (abs >= 0.6) return 'high';
    if (abs >= 0.4) return 'medium';
    if (abs >= 0.2) return 'low';
    return 'very-low';
  };

  // 渲染AI洞察
  const renderInsights = () => {
    if (insights.length === 0) return null;

    return (
      <div className="ai-insights">
        <h3 className="section-title">
          <span className="insights-icon">🤖</span>
          {t('analytics.aiInsights')}
        </h3>
        <div className="insights-list">
          {insights.map((insight, index) => (
            <div key={index} className={`insight-item ${insight.type}`}>
              <div className="insight-header">
                <h4 className="insight-title">{insight.title}</h4>
                <div className="insight-confidence">
                  {formatPercentage(insight.confidence)}
                </div>
              </div>
              <p className="insight-description">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`advanced-analytics ${className}`} ref={analyticsRef} {...props}>
      {/* 分析头部 */}
      <div className="analytics-header">
        <div className="header-left">
          <h2 className="analytics-title">{t('analytics.advancedAnalytics')}</h2>
          <p className="analytics-subtitle">{t('analytics.subtitle')}</p>
        </div>
        <div className="header-right">
          {/* 时间范围选择器 */}
          <div className="time-range-selector">
            {timeRangeOptions.map(option => (
              <button
                key={option.value}
                className={`time-range-button ${timeRange === option.value ? 'active' : ''}`}
                onClick={() => onTimeRangeChange?.(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* 导出按钮 */}
          <div className="export-buttons">
            <button 
              className="export-button"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              📄 PDF
            </button>
            <button 
              className="export-button"
              onClick={() => handleExport('excel')}
              disabled={isExporting}
            >
              📊 Excel
            </button>
          </div>
        </div>
      </div>

      {/* AI洞察 */}
      {renderInsights()}

      {/* 分析标签页 */}
      <div className="analytics-tabs">
        <div className="tab-headers">
          {analyticsTabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-header ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'risk' && renderRiskTab()}
          {activeTab === 'correlation' && renderCorrelationTab()}
          {activeTab === 'prediction' && renderPredictionTab()}
        </div>
      </div>

      <style jsx>{`
        .advanced-analytics {
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 20px;
        }

        .header-left {
          flex: 1;
        }

        .analytics-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .analytics-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .time-range-selector {
          display: flex;
          gap: 4px;
          background: white;
          border-radius: 8px;
          padding: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .time-range-button {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #6b7280;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-range-button.active {
          background: #3b82f6;
          color: white;
        }

        .time-range-button:hover:not(.active) {
          background: #f3f4f6;
        }

        .export-buttons {
          display: flex;
          gap: 8px;
        }

        .export-button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .export-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-insights {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .insights-icon {
          font-size: 20px;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .insight-item {
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .insight-item.positive {
          background: #f0fdf4;
          border-color: #10b981;
        }

        .insight-item.negative {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .insight-item.warning {
          background: #fffbeb;
          border-color: #f59e0b;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .insight-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .insight-confidence {
          font-size: 12px;
          color: #6b7280;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 8px;
          border-radius: 12px;
        }

        .insight-description {
          font-size: 14px;
          color: #374151;
          margin: 0;
          line-height: 1.5;
        }

        .analytics-tabs {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .tab-headers {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .tab-header {
          flex: 1;
          min-width: 120px;
          padding: 16px 12px;
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-header.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
          background: #f8fafc;
        }

        .tab-header:hover:not(.active) {
          background: #f9fafb;
        }

        .tab-icon {
          font-size: 20px;
        }

        .tab-label {
          font-size: 12px;
          font-weight: 500;
        }

        .tab-content {
          padding: 24px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .metric-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .metric-card.primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .metric-icon {
          font-size: 20px;
        }

        .metric-title {
          font-size: 14px;
          font-weight: 500;
          margin: 0;
          opacity: 0.8;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .metric-change {
          font-size: 14px;
          font-weight: 500;
        }

        .metric-change.positive {
          color: #10b981;
        }

        .metric-change.negative {
          color: #ef4444;
        }

        .metric-change.neutral {
          color: #6b7280;
        }

        .chart-section {
          margin-bottom: 24px;
        }

        .performance-metrics,
        .var-metrics {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .metric-row,
        .var-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .metric-row:last-child,
        .var-item:last-child {
          border-bottom: none;
        }

        .metric-label,
        .var-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .metric-value,
        .var-value {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .metric-value.negative,
        .var-value.negative {
          color: #ef4444;
        }

        .risk-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .risk-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          border: 2px solid;
        }

        .risk-card.high {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .risk-card.medium {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .risk-card.low {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .risk-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .risk-icon {
          font-size: 24px;
        }

        .risk-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .risk-value {
          font-size: 28px;
          font-weight: 700;
        }

        .correlation-matrix {
          margin-bottom: 24px;
        }

        .matrix-grid {
          display: grid;
          gap: 2px;
          background: #e5e7eb;
          border-radius: 8px;
          padding: 2px;
          overflow-x: auto;
        }

        .matrix-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 2px;
        }

        .matrix-cell {
          background: white;
          padding: 8px 4px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          border-radius: 4px;
        }

        .matrix-cell.very-high {
          background: #dc2626;
          color: white;
        }

        .matrix-cell.high {
          background: #f59e0b;
          color: white;
        }

        .matrix-cell.medium {
          background: #eab308;
          color: white;
        }

        .matrix-cell.low {
          background: #22c55e;
          color: white;
        }

        .matrix-cell.very-low {
          background: #f3f4f6;
          color: #6b7280;
        }

        .diversification-metrics {
          text-align: center;
        }

        .diversification-score {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .score-value {
          font-size: 32px;
          font-weight: 700;
        }

        .score-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .prediction-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .prediction-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .prediction-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .prediction-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .prediction-value.positive {
          color: #10b981;
        }

        .prediction-value.neutral {
          color: #6b7280;
        }

        .prediction-confidence {
          font-size: 14px;
          color: #6b7280;
        }

        .scenario-analysis {
          margin-top: 24px;
        }

        .scenario-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .scenario-item {
          background: white;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          border: 2px solid;
        }

        .scenario-item.bull {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .scenario-item.base {
          border-color: #6b7280;
          background: #f9fafb;
        }

        .scenario-item.bear {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .scenario-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .scenario-return {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .scenario-probability {
          font-size: 14px;
          color: #6b7280;
        }

        /* 响应式适配 */
        @media (max-width: 768px) {
          .advanced-analytics {
            padding: 16px;
          }

          .analytics-header {
            flex-direction: column;
            gap: 16px;
          }

          .header-right {
            width: 100%;
            align-items: stretch;
          }

          .time-range-selector {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .analytics-title {
            font-size: 24px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .tab-headers {
            flex-wrap: nowrap;
          }

          .tab-content {
            padding: 16px;
          }
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .advanced-analytics {
            background: #111827;
          }

          .analytics-title {
            color: #f9fafb;
          }

          .analytics-subtitle {
            color: #d1d5db;
          }

          .ai-insights,
          .analytics-tabs,
          .metric-card,
          .prediction-card,
          .scenario-item {
            background: #1f2937;
            border-color: #374151;
          }

          .section-title {
            color: #f9fafb;
          }

          .tab-header {
            color: #9ca3af;
          }

          .tab-header.active {
            color: #60a5fa;
            background: #374151;
          }

          .metric-value {
            color: #f9fafb;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedAnalytics;

