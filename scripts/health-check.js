/**
 * Unicorn100平台健康检查系统
 * 监控应用各个组件的健康状态
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class HealthChecker {
  constructor(config = {}) {
    this.config = {
      // 应用配置
      app: {
        host: config.app?.host || 'localhost',
        port: config.app?.port || 3000,
        protocol: config.app?.protocol || 'http'
      },
      
      // 数据库配置
      database: {
        host: config.database?.host || process.env.DB_HOST,
        port: config.database?.port || 5432,
        name: config.database?.name || process.env.DB_NAME,
        user: config.database?.user || process.env.DB_USER,
        password: config.database?.password || process.env.DB_PASSWORD
      },
      
      // Redis配置
      redis: {
        host: config.redis?.host || process.env.REDIS_HOST,
        port: config.redis?.port || 6379
      },
      
      // 外部服务配置
      services: {
        api: config.services?.api || process.env.API_BASE_URL,
        stripe: config.services?.stripe || 'https://api.stripe.com',
        sendgrid: config.services?.sendgrid || 'https://api.sendgrid.com'
      },
      
      // 检查阈值
      thresholds: {
        responseTime: config.thresholds?.responseTime || 2000, // 2秒
        memoryUsage: config.thresholds?.memoryUsage || 0.8,    // 80%
        cpuUsage: config.thresholds?.cpuUsage || 0.8,          // 80%
        diskUsage: config.thresholds?.diskUsage || 0.9         // 90%
      },
      
      // 检查间隔
      intervals: {
        quick: config.intervals?.quick || 30000,    // 30秒
        detailed: config.intervals?.detailed || 300000, // 5分钟
        external: config.intervals?.external || 60000   // 1分钟
      }
    };
    
    this.healthStatus = {
      overall: 'unknown',
      components: {},
      lastCheck: null,
      uptime: process.uptime()
    };
    
    this.checks = [];
    this.setupChecks();
  }

  // 设置健康检查
  setupChecks() {
    // 应用基础检查
    this.addCheck('app', this.checkApplication.bind(this), this.config.intervals.quick);
    
    // 数据库检查
    this.addCheck('database', this.checkDatabase.bind(this), this.config.intervals.detailed);
    
    // Redis检查
    this.addCheck('redis', this.checkRedis.bind(this), this.config.intervals.detailed);
    
    // 系统资源检查
    this.addCheck('system', this.checkSystemResources.bind(this), this.config.intervals.quick);
    
    // 外部服务检查
    this.addCheck('external', this.checkExternalServices.bind(this), this.config.intervals.external);
    
    // 文件系统检查
    this.addCheck('filesystem', this.checkFileSystem.bind(this), this.config.intervals.detailed);
  }

  // 添加检查项
  addCheck(name, checkFunction, interval) {
    const check = {
      name,
      function: checkFunction,
      interval,
      lastRun: null,
      status: 'unknown'
    };
    
    this.checks.push(check);
    
    // 立即执行一次
    this.runCheck(check);
    
    // 设置定时执行
    setInterval(() => this.runCheck(check), interval);
  }

  // 执行单个检查
  async runCheck(check) {
    try {
      const startTime = Date.now();
      const result = await check.function();
      const duration = Date.now() - startTime;
      
      check.lastRun = new Date();
      check.status = result.status;
      check.duration = duration;
      check.details = result.details;
      
      this.healthStatus.components[check.name] = {
        status: result.status,
        message: result.message,
        details: result.details,
        duration,
        lastCheck: check.lastRun
      };
      
      this.updateOverallStatus();
      
    } catch (error) {
      check.status = 'error';
      check.error = error.message;
      
      this.healthStatus.components[check.name] = {
        status: 'error',
        message: error.message,
        lastCheck: new Date()
      };
      
      this.updateOverallStatus();
    }
  }

  // 检查应用状态
  async checkApplication() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const protocol = this.config.app.protocol === 'https' ? https : http;
      
      const req = protocol.get({
        hostname: this.config.app.host,
        port: this.config.app.port,
        path: '/health',
        timeout: 5000
      }, (res) => {
        const duration = Date.now() - startTime;
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({
              status: duration < this.config.thresholds.responseTime ? 'healthy' : 'warning',
              message: `应用响应正常 (${duration}ms)`,
              details: {
                responseTime: duration,
                statusCode: res.statusCode,
                response: data
              }
            });
          } else {
            resolve({
              status: 'error',
              message: `应用响应异常 (状态码: ${res.statusCode})`,
              details: {
                responseTime: duration,
                statusCode: res.statusCode,
                response: data
              }
            });
          }
        });
      });
      
      req.on('error', (error) => {
        resolve({
          status: 'error',
          message: `应用连接失败: ${error.message}`,
          details: { error: error.message }
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'error',
          message: '应用响应超时',
          details: { timeout: true }
        });
      });
    });
  }

  // 检查数据库状态
  async checkDatabase() {
    return new Promise((resolve) => {
      // 这里使用pg客户端检查PostgreSQL
      const { Client } = require('pg');
      
      const client = new Client({
        host: this.config.database.host,
        port: this.config.database.port,
        database: this.config.database.name,
        user: this.config.database.user,
        password: this.config.database.password,
        connectionTimeoutMillis: 5000
      });
      
      const startTime = Date.now();
      
      client.connect()
        .then(() => {
          return client.query('SELECT NOW()');
        })
        .then((result) => {
          const duration = Date.now() - startTime;
          client.end();
          
          resolve({
            status: 'healthy',
            message: `数据库连接正常 (${duration}ms)`,
            details: {
              responseTime: duration,
              serverTime: result.rows[0].now
            }
          });
        })
        .catch((error) => {
          client.end();
          resolve({
            status: 'error',
            message: `数据库连接失败: ${error.message}`,
            details: { error: error.message }
          });
        });
    });
  }

  // 检查Redis状态
  async checkRedis() {
    return new Promise((resolve) => {
      const redis = require('redis');
      const client = redis.createClient({
        host: this.config.redis.host,
        port: this.config.redis.port,
        connect_timeout: 5000
      });
      
      const startTime = Date.now();
      
      client.on('connect', () => {
        const duration = Date.now() - startTime;
        
        client.ping((err, result) => {
          client.quit();
          
          if (err) {
            resolve({
              status: 'error',
              message: `Redis ping失败: ${err.message}`,
              details: { error: err.message }
            });
          } else {
            resolve({
              status: 'healthy',
              message: `Redis连接正常 (${duration}ms)`,
              details: {
                responseTime: duration,
                pingResult: result
              }
            });
          }
        });
      });
      
      client.on('error', (error) => {
        resolve({
          status: 'error',
          message: `Redis连接失败: ${error.message}`,
          details: { error: error.message }
        });
      });
    });
  }

  // 检查系统资源
  async checkSystemResources() {
    return new Promise((resolve) => {
      const os = require('os');
      
      // 内存使用率
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsage = usedMemory / totalMemory;
      
      // CPU使用率（简化版本）
      const cpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;
      
      cpus.forEach(cpu => {
        for (let type in cpu.times) {
          totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
      });
      
      const cpuUsage = 1 - (totalIdle / totalTick);
      
      // 系统负载
      const loadAverage = os.loadavg();
      
      // 判断状态
      let status = 'healthy';
      let warnings = [];
      
      if (memoryUsage > this.config.thresholds.memoryUsage) {
        status = 'warning';
        warnings.push(`内存使用率过高: ${(memoryUsage * 100).toFixed(1)}%`);
      }
      
      if (cpuUsage > this.config.thresholds.cpuUsage) {
        status = 'warning';
        warnings.push(`CPU使用率过高: ${(cpuUsage * 100).toFixed(1)}%`);
      }
      
      resolve({
        status,
        message: warnings.length > 0 ? warnings.join(', ') : '系统资源正常',
        details: {
          memory: {
            total: totalMemory,
            used: usedMemory,
            free: freeMemory,
            usage: memoryUsage
          },
          cpu: {
            usage: cpuUsage,
            cores: cpus.length
          },
          load: loadAverage,
          uptime: os.uptime()
        }
      });
    });
  }

  // 检查外部服务
  async checkExternalServices() {
    const services = [
      { name: 'API', url: this.config.services.api + '/health' },
      { name: 'Stripe', url: this.config.services.stripe + '/v1' },
      { name: 'SendGrid', url: this.config.services.sendgrid + '/v3' }
    ];
    
    const results = await Promise.allSettled(
      services.map(service => this.checkExternalService(service))
    );
    
    const details = {};
    let overallStatus = 'healthy';
    const messages = [];
    
    results.forEach((result, index) => {
      const service = services[index];
      if (result.status === 'fulfilled') {
        details[service.name] = result.value;
        if (result.value.status !== 'healthy') {
          overallStatus = 'warning';
          messages.push(`${service.name}: ${result.value.message}`);
        }
      } else {
        details[service.name] = {
          status: 'error',
          message: result.reason.message
        };
        overallStatus = 'error';
        messages.push(`${service.name}: ${result.reason.message}`);
      }
    });
    
    return {
      status: overallStatus,
      message: messages.length > 0 ? messages.join(', ') : '外部服务正常',
      details
    };
  }

  // 检查单个外部服务
  async checkExternalService(service) {
    return new Promise((resolve) => {
      const url = new URL(service.url);
      const protocol = url.protocol === 'https:' ? https : http;
      
      const startTime = Date.now();
      
      const req = protocol.get({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        timeout: 10000
      }, (res) => {
        const duration = Date.now() - startTime;
        
        resolve({
          status: res.statusCode < 400 ? 'healthy' : 'error',
          message: `${service.name} 响应 ${res.statusCode} (${duration}ms)`,
          details: {
            responseTime: duration,
            statusCode: res.statusCode
          }
        });
      });
      
      req.on('error', (error) => {
        resolve({
          status: 'error',
          message: `${service.name} 连接失败: ${error.message}`,
          details: { error: error.message }
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'error',
          message: `${service.name} 响应超时`,
          details: { timeout: true }
        });
      });
    });
  }

  // 检查文件系统
  async checkFileSystem() {
    return new Promise((resolve) => {
      exec('df -h /', (error, stdout, stderr) => {
        if (error) {
          resolve({
            status: 'error',
            message: `文件系统检查失败: ${error.message}`,
            details: { error: error.message }
          });
          return;
        }
        
        const lines = stdout.trim().split('\n');
        const data = lines[1].split(/\s+/);
        const usagePercent = parseInt(data[4].replace('%', '')) / 100;
        
        const status = usagePercent > this.config.thresholds.diskUsage ? 'warning' : 'healthy';
        const message = status === 'warning' 
          ? `磁盘使用率过高: ${(usagePercent * 100).toFixed(1)}%`
          : '文件系统正常';
        
        resolve({
          status,
          message,
          details: {
            filesystem: data[0],
            size: data[1],
            used: data[2],
            available: data[3],
            usage: usagePercent,
            mountPoint: data[5]
          }
        });
      });
    });
  }

  // 更新整体状态
  updateOverallStatus() {
    const components = Object.values(this.healthStatus.components);
    
    if (components.length === 0) {
      this.healthStatus.overall = 'unknown';
      return;
    }
    
    const hasError = components.some(c => c.status === 'error');
    const hasWarning = components.some(c => c.status === 'warning');
    
    if (hasError) {
      this.healthStatus.overall = 'error';
    } else if (hasWarning) {
      this.healthStatus.overall = 'warning';
    } else {
      this.healthStatus.overall = 'healthy';
    }
    
    this.healthStatus.lastCheck = new Date();
    this.healthStatus.uptime = process.uptime();
  }

  // 获取健康状态
  getHealthStatus() {
    return {
      ...this.healthStatus,
      timestamp: new Date().toISOString()
    };
  }

  // 获取详细报告
  getDetailedReport() {
    const status = this.getHealthStatus();
    
    return {
      ...status,
      summary: {
        total: Object.keys(status.components).length,
        healthy: Object.values(status.components).filter(c => c.status === 'healthy').length,
        warning: Object.values(status.components).filter(c => c.status === 'warning').length,
        error: Object.values(status.components).filter(c => c.status === 'error').length
      },
      recommendations: this.generateRecommendations()
    };
  }

  // 生成建议
  generateRecommendations() {
    const recommendations = [];
    const components = this.healthStatus.components;
    
    // 检查响应时间
    if (components.app?.details?.responseTime > this.config.thresholds.responseTime) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: '应用响应时间过长，建议优化性能或增加服务器资源'
      });
    }
    
    // 检查内存使用
    if (components.system?.details?.memory?.usage > this.config.thresholds.memoryUsage) {
      recommendations.push({
        type: 'resource',
        priority: 'high',
        message: '内存使用率过高，建议检查内存泄漏或增加内存'
      });
    }
    
    // 检查磁盘使用
    if (components.filesystem?.details?.usage > this.config.thresholds.diskUsage) {
      recommendations.push({
        type: 'storage',
        priority: 'critical',
        message: '磁盘空间不足，建议清理日志文件或扩展存储空间'
      });
    }
    
    // 检查外部服务
    if (components.external?.status === 'error') {
      recommendations.push({
        type: 'dependency',
        priority: 'medium',
        message: '外部服务连接异常，建议检查网络连接和服务状态'
      });
    }
    
    return recommendations;
  }

  // 启动健康检查服务
  startHealthCheckServer(port = 8080) {
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      if (req.url === '/health') {
        const status = this.getHealthStatus();
        res.statusCode = status.overall === 'healthy' ? 200 : 503;
        res.end(JSON.stringify(status));
      } else if (req.url === '/health/detailed') {
        const report = this.getDetailedReport();
        res.statusCode = 200;
        res.end(JSON.stringify(report, null, 2));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    });
    
    server.listen(port, () => {
      console.log(`健康检查服务启动在端口 ${port}`);
    });
    
    return server;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  const healthChecker = new HealthChecker();
  
  // 启动健康检查服务
  healthChecker.startHealthCheckServer(8080);
  
  // 定期输出状态
  setInterval(() => {
    const status = healthChecker.getHealthStatus();
    console.log(`[${new Date().toISOString()}] 整体状态: ${status.overall}`);
    
    if (status.overall !== 'healthy') {
      console.log('组件状态:', JSON.stringify(status.components, null, 2));
    }
  }, 60000); // 每分钟输出一次
}

module.exports = HealthChecker;

