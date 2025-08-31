/**
 * Unicorn100平台性能监控系统
 * 监控应用性能指标并生成报告
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: [],
      userInteractions: [],
      errors: []
    };
    
    this.thresholds = {
      loadTime: 2000, // 2秒
      renderTime: 100, // 100ms
      memoryUsage: 50 * 1024 * 1024, // 50MB
      networkTimeout: 5000 // 5秒
    };

    this.init();
  }

  init() {
    this.monitorPageLoad();
    this.monitorRenderPerformance();
    this.monitorMemoryUsage();
    this.monitorNetworkRequests();
    this.monitorUserInteractions();
    this.monitorErrors();
    this.setupReporting();
  }

  // 监控页面加载性能
  monitorPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        console.log(`页面加载时间: ${this.metrics.loadTime}ms`);
        
        if (this.metrics.loadTime > this.thresholds.loadTime) {
          this.reportPerformanceIssue('loadTime', this.metrics.loadTime);
        }
      });
    }
  }

  // 监控渲染性能
  monitorRenderPerformance() {
    if (typeof window !== 'undefined' && window.performance) {
      // 监控First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log(`首次内容绘制: ${entry.startTime}ms`);
          }
          if (entry.name === 'largest-contentful-paint') {
            console.log(`最大内容绘制: ${entry.startTime}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // 监控React组件渲染时间
      this.monitorReactRender();
    }
  }

  // 监控React组件渲染
  monitorReactRender() {
    const originalRender = React.createElement;
    const self = this;
    
    React.createElement = function(...args) {
      const startTime = performance.now();
      const result = originalRender.apply(this, args);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      if (renderTime > self.thresholds.renderTime) {
        console.warn(`组件渲染时间过长: ${args[0]?.name || 'Unknown'} - ${renderTime}ms`);
      }
      
      return result;
    };
  }

  // 监控内存使用
  monitorMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      setInterval(() => {
        const memory = window.performance.memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        
        if (memory.usedJSHeapSize > this.thresholds.memoryUsage) {
          this.reportPerformanceIssue('memoryUsage', memory.usedJSHeapSize);
        }
        
        // 检测内存泄漏
        if (memory.usedJSHeapSize > memory.totalJSHeapSize * 0.9) {
          console.warn('可能存在内存泄漏');
          this.reportPerformanceIssue('memoryLeak', memory.usedJSHeapSize);
        }
      }, 10000); // 每10秒检查一次
    }
  }

  // 监控网络请求
  monitorNetworkRequests() {
    if (typeof window !== 'undefined') {
      // 监控fetch请求
      const originalFetch = window.fetch;
      const self = this;
      
      window.fetch = function(...args) {
        const startTime = performance.now();
        const url = args[0];
        
        return originalFetch.apply(this, args)
          .then(response => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            self.metrics.networkRequests.push({
              url,
              duration,
              status: response.status,
              timestamp: new Date().toISOString()
            });
            
            if (duration > self.thresholds.networkTimeout) {
              self.reportPerformanceIssue('networkTimeout', { url, duration });
            }
            
            return response;
          })
          .catch(error => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            self.metrics.networkRequests.push({
              url,
              duration,
              error: error.message,
              timestamp: new Date().toISOString()
            });
            
            self.reportPerformanceIssue('networkError', { url, error: error.message });
            throw error;
          });
      };
    }
  }

  // 监控用户交互
  monitorUserInteractions() {
    if (typeof window !== 'undefined') {
      const interactionTypes = ['click', 'scroll', 'keypress', 'touchstart'];
      
      interactionTypes.forEach(type => {
        document.addEventListener(type, (event) => {
          const startTime = performance.now();
          
          // 使用requestAnimationFrame来测量响应时间
          requestAnimationFrame(() => {
            const responseTime = performance.now() - startTime;
            
            this.metrics.userInteractions.push({
              type,
              target: event.target.tagName,
              responseTime,
              timestamp: new Date().toISOString()
            });
            
            if (responseTime > 100) { // 100ms响应时间阈值
              console.warn(`用户交互响应时间过长: ${type} - ${responseTime}ms`);
            }
          });
        });
      });
    }
  }

  // 监控错误
  monitorErrors() {
    if (typeof window !== 'undefined') {
      // JavaScript错误
      window.addEventListener('error', (event) => {
        this.metrics.errors.push({
          type: 'javascript',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString()
        });
        
        this.reportError('javascript', event);
      });

      // Promise rejection错误
      window.addEventListener('unhandledrejection', (event) => {
        this.metrics.errors.push({
          type: 'promise',
          reason: event.reason,
          timestamp: new Date().toISOString()
        });
        
        this.reportError('promise', event);
      });

      // React错误边界
      this.monitorReactErrors();
    }
  }

  // 监控React错误
  monitorReactErrors() {
    const originalConsoleError = console.error;
    const self = this;
    
    console.error = function(...args) {
      // 检查是否是React错误
      if (args[0] && args[0].includes && args[0].includes('React')) {
        self.metrics.errors.push({
          type: 'react',
          message: args.join(' '),
          timestamp: new Date().toISOString()
        });
        
        self.reportError('react', { message: args.join(' ') });
      }
      
      return originalConsoleError.apply(this, args);
    };
  }

  // 报告性能问题
  reportPerformanceIssue(type, data) {
    const issue = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.warn('性能问题:', issue);
    
    // 发送到监控服务
    this.sendToMonitoringService('performance', issue);
  }

  // 报告错误
  reportError(type, error) {
    const errorReport = {
      type,
      error: {
        message: error.message || error.reason,
        stack: error.error?.stack,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('错误报告:', errorReport);
    
    // 发送到监控服务
    this.sendToMonitoringService('error', errorReport);
  }

  // 发送到监控服务
  sendToMonitoringService(type, data) {
    // 这里可以集成第三方监控服务，如Sentry、DataDog等
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString()
        })
      }).catch(err => {
        console.error('发送监控数据失败:', err);
      });
    }
  }

  // 设置定期报告
  setupReporting() {
    // 每分钟生成性能报告
    setInterval(() => {
      this.generatePerformanceReport();
    }, 60000);

    // 页面卸载时生成最终报告
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.generateFinalReport();
      });
    }
  }

  // 生成性能报告
  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {
        loadTime: this.metrics.loadTime,
        memoryUsage: this.metrics.memoryUsage,
        networkRequests: this.metrics.networkRequests.length,
        userInteractions: this.metrics.userInteractions.length,
        errors: this.metrics.errors.length
      },
      performance: {
        avgNetworkTime: this.calculateAverageNetworkTime(),
        avgInteractionTime: this.calculateAverageInteractionTime(),
        errorRate: this.calculateErrorRate()
      }
    };
    
    console.log('性能报告:', report);
    return report;
  }

  // 计算平均网络请求时间
  calculateAverageNetworkTime() {
    if (this.metrics.networkRequests.length === 0) return 0;
    
    const totalTime = this.metrics.networkRequests.reduce((sum, req) => sum + req.duration, 0);
    return totalTime / this.metrics.networkRequests.length;
  }

  // 计算平均交互响应时间
  calculateAverageInteractionTime() {
    if (this.metrics.userInteractions.length === 0) return 0;
    
    const totalTime = this.metrics.userInteractions.reduce((sum, interaction) => sum + interaction.responseTime, 0);
    return totalTime / this.metrics.userInteractions.length;
  }

  // 计算错误率
  calculateErrorRate() {
    const totalInteractions = this.metrics.userInteractions.length + this.metrics.networkRequests.length;
    if (totalInteractions === 0) return 0;
    
    return (this.metrics.errors.length / totalInteractions) * 100;
  }

  // 生成最终报告
  generateFinalReport() {
    const finalReport = {
      sessionDuration: performance.now(),
      finalMetrics: this.generatePerformanceReport(),
      recommendations: this.generateRecommendations()
    };
    
    console.log('最终性能报告:', finalReport);
    
    // 发送最终报告
    this.sendToMonitoringService('final-report', finalReport);
    
    return finalReport;
  }

  // 生成性能优化建议
  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.loadTime > this.thresholds.loadTime) {
      recommendations.push({
        type: 'loadTime',
        message: '页面加载时间过长，建议优化资源加载和代码分割',
        priority: 'high'
      });
    }
    
    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      recommendations.push({
        type: 'memory',
        message: '内存使用过高，建议检查内存泄漏和优化组件渲染',
        priority: 'high'
      });
    }
    
    const avgNetworkTime = this.calculateAverageNetworkTime();
    if (avgNetworkTime > 1000) {
      recommendations.push({
        type: 'network',
        message: '网络请求时间过长，建议优化API响应时间和使用缓存',
        priority: 'medium'
      });
    }
    
    const errorRate = this.calculateErrorRate();
    if (errorRate > 5) {
      recommendations.push({
        type: 'errors',
        message: '错误率过高，建议加强错误处理和测试覆盖',
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  // 获取当前性能指标
  getCurrentMetrics() {
    return {
      ...this.metrics,
      performance: {
        avgNetworkTime: this.calculateAverageNetworkTime(),
        avgInteractionTime: this.calculateAverageInteractionTime(),
        errorRate: this.calculateErrorRate()
      }
    };
  }

  // 重置指标
  resetMetrics() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: [],
      userInteractions: [],
      errors: []
    };
  }
}

// 自动启动性能监控
let performanceMonitor;

if (typeof window !== 'undefined') {
  performanceMonitor = new PerformanceMonitor();
  
  // 暴露到全局对象，方便调试
  window.performanceMonitor = performanceMonitor;
}

export default PerformanceMonitor;

