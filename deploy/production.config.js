/**
 * Unicorn100平台生产环境部署配置
 * 包含性能优化、安全配置、监控设置等
 */

const productionConfig = {
  // 应用基础配置
  app: {
    name: 'Unicorn100',
    version: '1.0.0',
    environment: 'production',
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },

  // 性能优化配置
  performance: {
    // 启用Gzip压缩
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024
    },
    
    // 缓存配置
    cache: {
      // 静态资源缓存
      staticAssets: {
        maxAge: '1y',
        immutable: true
      },
      // API响应缓存
      apiCache: {
        maxAge: '5m',
        staleWhileRevalidate: '1h'
      },
      // 浏览器缓存
      browserCache: {
        maxAge: '1d',
        mustRevalidate: true
      }
    },
    
    // CDN配置
    cdn: {
      enabled: true,
      baseUrl: process.env.CDN_BASE_URL || 'https://cdn.unicorn100.com',
      regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1']
    },
    
    // 代码分割配置
    codeSplitting: {
      enabled: true,
      chunkSize: {
        maxInitial: 250000, // 250KB
        maxAsync: 250000,   // 250KB
        maxTotal: 2000000   // 2MB
      }
    },
    
    // 预加载配置
    preload: {
      criticalResources: [
        '/fonts/inter.woff2',
        '/images/logo.svg'
      ],
      prefetchRoutes: [
        '/projects',
        '/portfolio',
        '/market-data'
      ]
    }
  },

  // 安全配置
  security: {
    // HTTPS配置
    https: {
      enabled: true,
      forceRedirect: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    },
    
    // 内容安全策略
    csp: {
      enabled: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://apis.google.com",
          "https://www.gstatic.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:"
        ],
        connectSrc: [
          "'self'",
          "https://api.unicorn100.com",
          "wss://api.unicorn100.com"
        ]
      }
    },
    
    // CORS配置
    cors: {
      origin: [
        'https://unicorn100.com',
        'https://www.unicorn100.com',
        'https://app.unicorn100.com'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    
    // 速率限制
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 每个IP最多1000次请求
      message: 'Too many requests from this IP'
    },
    
    // 安全头
    securityHeaders: {
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      xXssProtection: '1; mode=block',
      referrerPolicy: 'strict-origin-when-cross-origin'
    }
  },

  // 监控配置
  monitoring: {
    // 应用性能监控
    apm: {
      enabled: true,
      serviceName: 'unicorn100-frontend',
      environment: 'production',
      sampleRate: 0.1
    },
    
    // 错误监控
    errorTracking: {
      enabled: true,
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      release: process.env.APP_VERSION || '1.0.0'
    },
    
    // 用户行为分析
    analytics: {
      enabled: true,
      googleAnalytics: {
        trackingId: process.env.GA_TRACKING_ID
      },
      customEvents: {
        investment: true,
        aiAnalysis: true,
        expertConsultation: true,
        communityInteraction: true
      }
    },
    
    // 实时监控
    realTimeMonitoring: {
      enabled: true,
      metrics: [
        'response_time',
        'error_rate',
        'throughput',
        'memory_usage',
        'cpu_usage'
      ],
      alerts: {
        responseTime: 2000, // 2秒
        errorRate: 0.05,    // 5%
        memoryUsage: 0.8,   // 80%
        cpuUsage: 0.8       // 80%
      }
    }
  },

  // 数据库配置
  database: {
    // 主数据库
    primary: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: true,
      pool: {
        min: 5,
        max: 20,
        idle: 10000
      }
    },
    
    // 只读副本
    replica: {
      host: process.env.DB_REPLICA_HOST,
      port: process.env.DB_REPLICA_PORT || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: true,
      pool: {
        min: 2,
        max: 10,
        idle: 10000
      }
    },
    
    // Redis缓存
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: 0,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    }
  },

  // API配置
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.unicorn100.com',
    timeout: 30000, // 30秒
    retries: 3,
    
    // API版本控制
    versioning: {
      enabled: true,
      defaultVersion: 'v1',
      supportedVersions: ['v1']
    },
    
    // API限流
    throttling: {
      enabled: true,
      requests: 100,
      per: 60000 // 每分钟100次请求
    }
  },

  // 第三方服务配置
  services: {
    // 支付服务
    payment: {
      stripe: {
        publicKey: process.env.STRIPE_PUBLIC_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
      }
    },
    
    // 邮件服务
    email: {
      provider: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: 'noreply@unicorn100.com'
    },
    
    // 短信服务
    sms: {
      provider: 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER
    },
    
    // 文件存储
    storage: {
      provider: 'aws-s3',
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  },

  // 日志配置
  logging: {
    level: 'info',
    format: 'json',
    
    // 日志输出
    transports: [
      {
        type: 'console',
        level: 'info'
      },
      {
        type: 'file',
        level: 'error',
        filename: 'logs/error.log',
        maxSize: '10m',
        maxFiles: 5
      },
      {
        type: 'cloudwatch',
        level: 'info',
        logGroup: '/aws/lambda/unicorn100-frontend',
        logStream: 'production'
      }
    ],
    
    // 敏感信息过滤
    sanitize: {
      enabled: true,
      fields: ['password', 'token', 'secret', 'key']
    }
  },

  // 部署配置
  deployment: {
    // 容器配置
    container: {
      image: 'unicorn100/frontend:latest',
      port: 3000,
      healthCheck: {
        path: '/health',
        interval: 30,
        timeout: 5,
        retries: 3
      }
    },
    
    // 负载均衡
    loadBalancer: {
      enabled: true,
      algorithm: 'round_robin',
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 10
      }
    },
    
    // 自动扩缩容
    autoScaling: {
      enabled: true,
      minInstances: 2,
      maxInstances: 10,
      targetCpuUtilization: 70,
      targetMemoryUtilization: 80
    },
    
    // 滚动更新
    rollingUpdate: {
      enabled: true,
      maxUnavailable: 1,
      maxSurge: 1
    }
  },

  // 备份配置
  backup: {
    // 数据库备份
    database: {
      enabled: true,
      schedule: '0 2 * * *', // 每天凌晨2点
      retention: 30, // 保留30天
      encryption: true
    },
    
    // 文件备份
    files: {
      enabled: true,
      schedule: '0 3 * * *', // 每天凌晨3点
      retention: 7, // 保留7天
      compression: true
    }
  },

  // 灾难恢复
  disasterRecovery: {
    enabled: true,
    
    // 多区域部署
    multiRegion: {
      enabled: true,
      primaryRegion: 'us-east-1',
      secondaryRegions: ['us-west-2', 'eu-west-1']
    },
    
    // 故障转移
    failover: {
      enabled: true,
      automaticFailover: true,
      healthCheckInterval: 30,
      failoverThreshold: 3
    },
    
    // 数据同步
    dataSync: {
      enabled: true,
      syncInterval: 300, // 5分钟
      conflictResolution: 'last_write_wins'
    }
  }
};

// 环境变量验证
const requiredEnvVars = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'REDIS_HOST',
  'API_BASE_URL',
  'STRIPE_PUBLIC_KEY',
  'SENDGRID_API_KEY'
];

function validateEnvironment() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// 配置验证
function validateConfig() {
  validateEnvironment();
  
  // 验证端口号
  if (isNaN(productionConfig.app.port) || productionConfig.app.port < 1 || productionConfig.app.port > 65535) {
    throw new Error('Invalid port number');
  }
  
  // 验证数据库配置
  if (!productionConfig.database.primary.host) {
    throw new Error('Database host is required');
  }
  
  console.log('✅ Production configuration validated successfully');
}

// 导出配置
module.exports = {
  ...productionConfig,
  validate: validateConfig
};

// 如果直接运行此文件，则验证配置
if (require.main === module) {
  try {
    validateConfig();
    console.log('🚀 Production configuration is ready for deployment');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    process.exit(1);
  }
}

