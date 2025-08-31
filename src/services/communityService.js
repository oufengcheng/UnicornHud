// 社区服务模块
import apiClient from './apiClient';

class CommunityService {
  constructor() {
    this.posts = [];
    this.connections = [];
    this.notifications = [];
    this.initializeMockData();
  }

  // 初始化模拟数据
  initializeMockData() {
    // 模拟社区动态数据
    this.posts = [
      {
        id: 1,
        author: {
          id: 'founder_001',
          name: '李创新',
          avatar: '👩‍💻',
          title: 'AI独角兽 CEO',
          verified: true
        },
        content: '刚刚完成了A轮融资，感谢所有投资者的信任！我们的AI技术将改变整个行业。寻找更多志同道合的创始人一起交流经验。 #融资成功 #AI创新',
        images: [],
        tags: ['融资', 'AI', 'A轮'],
        likes: 156,
        comments: 23,
        shares: 12,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'milestone'
      },
      {
        id: 2,
        author: {
          id: 'founder_002',
          name: '张技术',
          avatar: '👨‍💻',
          title: 'BlockChain Pro CTO',
          verified: true
        },
        content: '分享一下我们在区块链技术方面的最新突破。经过6个月的研发，我们的去中心化协议已经在测试网上稳定运行。有兴趣的创始人可以私信交流技术细节。',
        images: [],
        tags: ['区块链', '技术分享', '去中心化'],
        likes: 89,
        comments: 15,
        shares: 8,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        type: 'tech_share'
      },
      {
        id: 3,
        author: {
          id: 'founder_003',
          name: '王市场',
          avatar: '👩‍💼',
          title: 'FinTech Star CMO',
          verified: true
        },
        content: '今天参加了硅谷的创业者聚会，认识了很多优秀的创始人。分享几个市场推广的心得：1. 用户体验是王道 2. 数据驱动决策 3. 快速迭代验证。期待与大家深入交流！',
        images: [],
        tags: ['市场推广', '用户体验', '创业心得'],
        likes: 234,
        comments: 31,
        shares: 18,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        type: 'experience_share'
      }
    ];

    // 模拟连接数据
    this.connections = [
      {
        id: 1,
        user: {
          id: 'founder_004',
          name: '赵产品',
          avatar: '👨‍💻',
          title: 'SaaS Leader 产品总监',
          company: 'SaaS Leader',
          industry: 'SaaS',
          stage: 'B轮'
        },
        connectionType: 'mutual',
        connectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        commonInterests: ['产品设计', 'SaaS', 'B轮融资'],
        mutualConnections: 5
      },
      {
        id: 2,
        user: {
          id: 'founder_005',
          name: '刘运营',
          avatar: '👩‍💼',
          title: 'Growth Hacker CEO',
          company: 'Growth Hacker',
          industry: 'MarTech',
          stage: 'A轮'
        },
        connectionType: 'pending',
        connectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        commonInterests: ['增长黑客', '用户获取', 'A轮融资'],
        mutualConnections: 3
      }
    ];

    // 模拟通知数据
    this.notifications = [
      {
        id: 1,
        type: 'connection_request',
        title: '新的连接请求',
        message: '刘运营想要与您建立连接',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: '/founders'
      },
      {
        id: 2,
        type: 'post_like',
        title: '动态获得点赞',
        message: '您的动态获得了15个新点赞',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: '/founders'
      }
    ];
  }

  // 获取社区动态
  async getCommunityPosts(filters = {}) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredPosts = [...this.posts];

      // 应用过滤器
      if (filters.type && filters.type !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.type === filters.type);
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags.some(tag => filters.tags.includes(tag))
        );
      }

      // 按时间排序
      filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        success: true,
        data: {
          posts: filteredPosts,
          total: filteredPosts.length,
          hasMore: false
        }
      };
    } catch (error) {
      console.error('获取社区动态失败:', error);
      return {
        success: false,
        message: '获取社区动态失败'
      };
    }
  }

  // 发布动态
  async createPost(postData) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      const newPost = {
        id: this.posts.length + 1,
        author: {
          id: 'current_user',
          name: '当前用户',
          avatar: '👤',
          title: '创始人',
          verified: false
        },
        content: postData.content,
        images: postData.images || [],
        tags: postData.tags || [],
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        type: postData.type || 'general'
      };

      this.posts.unshift(newPost);

      return {
        success: true,
        data: newPost,
        message: '动态发布成功'
      };
    } catch (error) {
      console.error('发布动态失败:', error);
      return {
        success: false,
        message: '发布动态失败'
      };
    }
  }

  // 点赞动态
  async likePost(postId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.likes += 1;
        return {
          success: true,
          data: { likes: post.likes },
          message: '点赞成功'
        };
      } else {
        throw new Error('动态不存在');
      }
    } catch (error) {
      console.error('点赞失败:', error);
      return {
        success: false,
        message: '点赞失败'
      };
    }
  }

  // 评论动态
  async commentPost(postId, comment) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.comments += 1;
        
        // 这里可以添加评论详情的存储逻辑
        const newComment = {
          id: Date.now(),
          author: '当前用户',
          content: comment,
          timestamp: new Date().toISOString()
        };

        return {
          success: true,
          data: { 
            comments: post.comments,
            newComment 
          },
          message: '评论成功'
        };
      } else {
        throw new Error('动态不存在');
      }
    } catch (error) {
      console.error('评论失败:', error);
      return {
        success: false,
        message: '评论失败'
      };
    }
  }

  // 分享动态
  async sharePost(postId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.shares += 1;
        return {
          success: true,
          data: { shares: post.shares },
          message: '分享成功'
        };
      } else {
        throw new Error('动态不存在');
      }
    } catch (error) {
      console.error('分享失败:', error);
      return {
        success: false,
        message: '分享失败'
      };
    }
  }

  // 获取用户连接
  async getUserConnections(userId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 400));

      return {
        success: true,
        data: {
          connections: this.connections,
          total: this.connections.length
        }
      };
    } catch (error) {
      console.error('获取用户连接失败:', error);
      return {
        success: false,
        message: '获取用户连接失败'
      };
    }
  }

  // 发送连接请求
  async sendConnectionRequest(targetUserId, message = '') {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 600));

      // 检查是否已经连接
      const existingConnection = this.connections.find(
        conn => conn.user.id === targetUserId
      );

      if (existingConnection) {
        throw new Error('已经建立连接或请求已发送');
      }

      // 创建新的连接请求
      const newConnection = {
        id: this.connections.length + 1,
        user: {
          id: targetUserId,
          name: '目标用户',
          avatar: '👤',
          title: '创始人',
          company: '创新公司',
          industry: 'Tech',
          stage: 'A轮'
        },
        connectionType: 'pending',
        connectedAt: new Date().toISOString(),
        message: message,
        commonInterests: ['创业', '技术'],
        mutualConnections: 2
      };

      this.connections.push(newConnection);

      return {
        success: true,
        data: newConnection,
        message: '连接请求已发送'
      };
    } catch (error) {
      console.error('发送连接请求失败:', error);
      return {
        success: false,
        message: error.message || '发送连接请求失败'
      };
    }
  }

  // 接受连接请求
  async acceptConnectionRequest(connectionId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 400));

      const connection = this.connections.find(conn => conn.id === connectionId);
      if (connection) {
        connection.connectionType = 'mutual';
        return {
          success: true,
          data: connection,
          message: '连接请求已接受'
        };
      } else {
        throw new Error('连接请求不存在');
      }
    } catch (error) {
      console.error('接受连接请求失败:', error);
      return {
        success: false,
        message: '接受连接请求失败'
      };
    }
  }

  // 拒绝连接请求
  async rejectConnectionRequest(connectionId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      const connectionIndex = this.connections.findIndex(conn => conn.id === connectionId);
      if (connectionIndex !== -1) {
        this.connections.splice(connectionIndex, 1);
        return {
          success: true,
          message: '连接请求已拒绝'
        };
      } else {
        throw new Error('连接请求不存在');
      }
    } catch (error) {
      console.error('拒绝连接请求失败:', error);
      return {
        success: false,
        message: '拒绝连接请求失败'
      };
    }
  }

  // 获取通知
  async getNotifications() {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: {
          notifications: this.notifications,
          unreadCount: this.notifications.filter(n => !n.read).length
        }
      };
    } catch (error) {
      console.error('获取通知失败:', error);
      return {
        success: false,
        message: '获取通知失败'
      };
    }
  }

  // 标记通知为已读
  async markNotificationAsRead(notificationId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        return {
          success: true,
          message: '通知已标记为已读'
        };
      } else {
        throw new Error('通知不存在');
      }
    } catch (error) {
      console.error('标记通知失败:', error);
      return {
        success: false,
        message: '标记通知失败'
      };
    }
  }

  // 搜索创始人
  async searchFounders(query, filters = {}) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 600));

      // 模拟搜索结果
      const mockFounders = [
        {
          id: 'founder_006',
          name: '陈AI',
          avatar: '👨‍💻',
          title: 'AI Vision CEO',
          company: 'AI Vision',
          industry: 'AI',
          stage: 'B轮',
          location: '深圳',
          bio: '专注于计算机视觉和深度学习，致力于用AI改变世界',
          tags: ['AI', '计算机视觉', '深度学习'],
          mutualConnections: 8,
          connectionStatus: 'none'
        },
        {
          id: 'founder_007',
          name: '林区块',
          avatar: '👩‍💻',
          title: 'Crypto Future CTO',
          company: 'Crypto Future',
          industry: '区块链',
          stage: 'A轮',
          location: '上海',
          bio: '区块链技术专家，专注于DeFi和NFT领域的创新',
          tags: ['区块链', 'DeFi', 'NFT'],
          mutualConnections: 3,
          connectionStatus: 'none'
        }
      ];

      // 简单的搜索过滤
      let results = mockFounders;
      if (query) {
        results = results.filter(founder => 
          founder.name.includes(query) || 
          founder.company.includes(query) ||
          founder.industry.includes(query) ||
          founder.tags.some(tag => tag.includes(query))
        );
      }

      return {
        success: true,
        data: {
          founders: results,
          total: results.length
        }
      };
    } catch (error) {
      console.error('搜索创始人失败:', error);
      return {
        success: false,
        message: '搜索创始人失败'
      };
    }
  }

  // 获取推荐创始人
  async getRecommendedFounders(userId) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 基于用户画像的推荐算法（简化版）
      const recommendations = [
        {
          id: 'founder_008',
          name: '周金融',
          avatar: '👨‍💼',
          title: 'FinTech Pro CEO',
          company: 'FinTech Pro',
          industry: 'FinTech',
          stage: 'B轮',
          location: '北京',
          bio: '金融科技专家，专注于数字支付和风控技术',
          tags: ['FinTech', '数字支付', '风控'],
          matchScore: 92,
          matchReasons: ['同行业经验', '相似发展阶段', '地理位置匹配'],
          mutualConnections: 12,
          connectionStatus: 'none'
        },
        {
          id: 'founder_009',
          name: '吴生物',
          avatar: '👩‍🔬',
          title: 'BioTech Star CEO',
          company: 'BioTech Star',
          industry: 'BioTech',
          stage: 'A轮',
          location: '广州',
          bio: '生物技术创新者，专注于精准医疗和基因治疗',
          tags: ['BioTech', '精准医疗', '基因治疗'],
          matchScore: 85,
          matchReasons: ['创新技术领域', '高成长潜力', '投资者关注度高'],
          mutualConnections: 6,
          connectionStatus: 'none'
        }
      ];

      return {
        success: true,
        data: {
          recommendations,
          total: recommendations.length
        }
      };
    } catch (error) {
      console.error('获取推荐创始人失败:', error);
      return {
        success: false,
        message: '获取推荐创始人失败'
      };
    }
  }

  // 获取热门标签
  async getTrendingTags() {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      const trendingTags = [
        { tag: 'AI', count: 156, trend: 'up' },
        { tag: '融资', count: 89, trend: 'up' },
        { tag: 'FinTech', count: 67, trend: 'stable' },
        { tag: '区块链', count: 45, trend: 'down' },
        { tag: 'SaaS', count: 34, trend: 'up' },
        { tag: '创业心得', count: 28, trend: 'stable' }
      ];

      return {
        success: true,
        data: trendingTags
      };
    } catch (error) {
      console.error('获取热门标签失败:', error);
      return {
        success: false,
        message: '获取热门标签失败'
      };
    }
  }
}

// 创建单例实例
const communityService = new CommunityService();

export default communityService;

