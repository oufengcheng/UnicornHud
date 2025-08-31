import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePinchZoom } from '../hooks/useSwipeGesture';
import { useTranslation } from '../hooks/useTranslation';

/**
 * 移动端优化的图表组件
 * 提供触摸友好的数据可视化体验
 */
const MobileChart = ({
  data = [],
  type = 'line', // line, bar, pie, area
  title,
  subtitle,
  height = 300,
  showLegend = true,
  showTooltip = true,
  interactive = true,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  className = '',
  ...props
}) => {
  const { t, formatCurrency, formatNumber } = useTranslation();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showTooltip_, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const chartRef = useRef(null);
  const svgRef = useRef(null);

  // 缩放手势支持
  const {
    scale,
    isZooming,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetZoom
  } = usePinchZoom({
    minScale: 1,
    maxScale: 3,
    onZoomStart: () => setShowTooltip(false)
  });

  // 计算图表尺寸
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: height,
    padding: { top: 20, right: 20, bottom: 40, left: 40 }
  });

  // 响应式尺寸计算
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const rect = chartRef.current.getBoundingClientRect();
        setChartDimensions(prev => ({
          ...prev,
          width: rect.width
        }));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 处理触摸事件
  const handleTouch = useCallback((e) => {
    if (!interactive || isZooming) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0] || e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // 查找最近的数据点
    const point = findNearestPoint(x, y);
    if (point) {
      setSelectedPoint(point);
      setTooltipPosition({ x, y });
      setShowTooltip(true);
      
      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    }
  }, [interactive, isZooming]);

  // 查找最近的数据点
  const findNearestPoint = (x, y) => {
    if (!data.length) return null;

    const { width, height, padding } = chartDimensions;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // 根据图表类型查找数据点
    if (type === 'line' || type === 'area') {
      const xStep = chartWidth / (data.length - 1);
      const index = Math.round((x - padding.left) / xStep);
      
      if (index >= 0 && index < data.length) {
        return {
          ...data[index],
          index,
          x: padding.left + index * xStep,
          y: padding.top + (chartHeight - (data[index].value / getMaxValue()) * chartHeight)
        };
      }
    } else if (type === 'bar') {
      const barWidth = chartWidth / data.length;
      const index = Math.floor((x - padding.left) / barWidth);
      
      if (index >= 0 && index < data.length) {
        return {
          ...data[index],
          index,
          x: padding.left + index * barWidth + barWidth / 2,
          y: padding.top + (chartHeight - (data[index].value / getMaxValue()) * chartHeight)
        };
      }
    }

    return null;
  };

  // 获取数据最大值
  const getMaxValue = () => {
    return Math.max(...data.map(d => d.value || 0));
  };

  // 渲染折线图
  const renderLineChart = () => {
    const { width, height, padding } = chartDimensions;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = getMaxValue();

    if (!data.length || chartWidth <= 0) return null;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + (chartHeight - (d.value / maxValue) * chartHeight);
      return `${x},${y}`;
    }).join(' ');

    return (
      <g>
        {/* 网格线 */}
        <g className="grid-lines" opacity="0.1">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + ratio * chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + ratio * chartHeight}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* 面积填充 (如果是area类型) */}
        {type === 'area' && (
          <path
            d={`M${padding.left},${padding.top + chartHeight} L${points} L${padding.left + chartWidth},${padding.top + chartHeight} Z`}
            fill={colors[0]}
            fillOpacity="0.2"
          />
        )}

        {/* 折线 */}
        <polyline
          points={points}
          fill="none"
          stroke={colors[0]}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {data.map((d, i) => {
          const x = padding.left + (i / (data.length - 1)) * chartWidth;
          const y = padding.top + (chartHeight - (d.value / maxValue) * chartHeight);
          const isSelected = selectedPoint?.index === i;
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isSelected ? 6 : 4}
              fill={colors[0]}
              stroke="white"
              strokeWidth="2"
              className="data-point"
              style={{
                filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
              }}
            />
          );
        })}
      </g>
    );
  };

  // 渲染柱状图
  const renderBarChart = () => {
    const { width, height, padding } = chartDimensions;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = getMaxValue();
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    if (!data.length || chartWidth <= 0) return null;

    return (
      <g>
        {/* 网格线 */}
        <g className="grid-lines" opacity="0.1">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + ratio * chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + ratio * chartHeight}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* 柱子 */}
        {data.map((d, i) => {
          const x = padding.left + i * (chartWidth / data.length) + barSpacing / 2;
          const barHeight = (d.value / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          const isSelected = selectedPoint?.index === i;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={colors[i % colors.length]}
              rx="4"
              className="bar"
              style={{
                opacity: isSelected ? 1 : 0.8,
                filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
              }}
            />
          );
        })}
      </g>
    );
  };

  // 渲染饼图
  const renderPieChart = () => {
    const { width, height } = chartDimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    if (!data.length || total === 0) return null;

    let currentAngle = -Math.PI / 2; // 从顶部开始

    return (
      <g>
        {data.map((d, i) => {
          const angle = (d.value / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          const largeArcFlag = angle > Math.PI ? 1 : 0;
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          currentAngle += angle;
          
          const isSelected = selectedPoint?.index === i;
          const offset = isSelected ? 10 : 0;
          const offsetX = offset * Math.cos(startAngle + angle / 2);
          const offsetY = offset * Math.sin(startAngle + angle / 2);

          return (
            <path
              key={i}
              d={pathData}
              fill={colors[i % colors.length]}
              stroke="white"
              strokeWidth="2"
              className="pie-slice"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
              }}
            />
          );
        })}
      </g>
    );
  };

  // 渲染坐标轴
  const renderAxes = () => {
    if (type === 'pie') return null;

    const { width, height, padding } = chartDimensions;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = getMaxValue();

    return (
      <g className="axes">
        {/* X轴 */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Y轴 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Y轴标签 */}
        {[0, 0.5, 1].map(ratio => (
          <text
            key={ratio}
            x={padding.left - 8}
            y={padding.top + (1 - ratio) * chartHeight}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="12"
            fill="currentColor"
            opacity="0.6"
          >
            {formatNumber(maxValue * ratio)}
          </text>
        ))}

        {/* X轴标签 */}
        {data.map((d, i) => {
          if (type === 'bar' || i % Math.ceil(data.length / 5) === 0) {
            const x = type === 'bar' 
              ? padding.left + i * (chartWidth / data.length) + (chartWidth / data.length) / 2
              : padding.left + (i / (data.length - 1)) * chartWidth;
            
            return (
              <text
                key={i}
                x={x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                opacity="0.6"
              >
                {d.label || d.name}
              </text>
            );
          }
          return null;
        })}
      </g>
    );
  };

  // 渲染图例
  const renderLegend = () => {
    if (!showLegend || type === 'line' || type === 'area') return null;

    return (
      <div className="chart-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="legend-label">{d.label || d.name}</span>
            <span className="legend-value">
              {typeof d.value === 'number' && d.value > 1000000 
                ? formatCurrency(d.value) 
                : formatNumber(d.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // 渲染工具提示
  const renderTooltip = () => {
    if (!showTooltip || !showTooltip_ || !selectedPoint) return null;

    return (
      <div 
        className="chart-tooltip"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y - 60,
          transform: 'translateX(-50%)'
        }}
      >
        <div className="tooltip-title">
          {selectedPoint.label || selectedPoint.name}
        </div>
        <div className="tooltip-value">
          {typeof selectedPoint.value === 'number' && selectedPoint.value > 1000000 
            ? formatCurrency(selectedPoint.value) 
            : formatNumber(selectedPoint.value)}
        </div>
      </div>
    );
  };

  return (
    <div className={`mobile-chart ${className}`} ref={chartRef} {...props}>
      {/* 图表标题 */}
      {(title || subtitle) && (
        <div className="chart-header">
          {title && <h3 className="chart-title">{title}</h3>}
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
      )}

      {/* 图表容器 */}
      <div 
        className="chart-container"
        style={{ 
          height: height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
          onTouchStart={(e) => {
            onTouchStart(e);
            handleTouch(e);
          }}
          onTouchMove={onTouchMove}
          onTouchEnd={(e) => {
            onTouchEnd();
            setShowTooltip(false);
          }}
          style={{ overflow: 'visible' }}
        >
          {renderAxes()}
          {type === 'line' && renderLineChart()}
          {type === 'area' && renderLineChart()}
          {type === 'bar' && renderBarChart()}
          {type === 'pie' && renderPieChart()}
        </svg>

        {renderTooltip()}
      </div>

      {/* 图例 */}
      {renderLegend()}

      {/* 缩放控制 */}
      {interactive && scale > 1 && (
        <button className="zoom-reset" onClick={resetZoom}>
          {t('chart.resetZoom')}
        </button>
      )}

      <style jsx>{`
        .mobile-chart {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin: 12px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .chart-header {
          margin-bottom: 16px;
          text-align: center;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .chart-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .chart-container {
          position: relative;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          transition: transform 0.3s ease;
        }

        .chart-tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          pointer-events: none;
          z-index: 10;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .tooltip-title {
          font-weight: 600;
          margin-bottom: 2px;
        }

        .tooltip-value {
          font-size: 16px;
          font-weight: 700;
        }

        .chart-legend {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .legend-label {
          flex: 1;
          color: #374151;
        }

        .legend-value {
          font-weight: 600;
          color: #1f2937;
        }

        .zoom-reset {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          z-index: 10;
        }

        .data-point {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bar {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pie-slice {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        /* 响应式适配 */
        @media (max-width: 480px) {
          .mobile-chart {
            padding: 12px;
          }

          .chart-title {
            font-size: 16px;
          }

          .chart-subtitle {
            font-size: 13px;
          }

          .legend-item {
            font-size: 13px;
          }
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .mobile-chart {
            background: #1f2937;
            border-color: #374151;
          }

          .chart-title {
            color: #f9fafb;
          }

          .chart-subtitle {
            color: #d1d5db;
          }

          .legend-label {
            color: #d1d5db;
          }

          .legend-value {
            color: #f9fafb;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端仪表板组件
 * 用于展示多个图表的仪表板
 */
export const MobileDashboard = ({
  charts = [],
  title,
  refreshing = false,
  onRefresh,
  className = '',
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <div className={`mobile-dashboard ${className}`} {...props}>
      {title && (
        <div className="dashboard-header">
          <h2 className="dashboard-title">{title}</h2>
          {onRefresh && (
            <button 
              className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
              onClick={onRefresh}
              disabled={refreshing}
            >
              🔄
            </button>
          )}
        </div>
      )}

      <div className="dashboard-grid">
        {charts.map((chart, index) => (
          <MobileChart
            key={index}
            {...chart}
          />
        ))}
      </div>

      <style jsx>{`
        .mobile-dashboard {
          padding: 16px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .refresh-button {
          width: 44px;
          height: 44px;
          border: none;
          background: #f3f4f6;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .refresh-button:active {
          transform: scale(0.95);
          background: #e5e7eb;
        }

        .refresh-button.refreshing {
          animation: refresh-spin 1s linear infinite;
        }

        .dashboard-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @keyframes refresh-spin {
          to { transform: rotate(360deg); }
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .dashboard-title {
            color: #f9fafb;
          }

          .refresh-button {
            background: #374151;
          }

          .refresh-button:active {
            background: #4b5563;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileChart;

