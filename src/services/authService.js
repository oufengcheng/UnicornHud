// 用户认证服务
import apiClient from './apiClient';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authToken = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    this.initializeAuth();
  }

  // 初始化认证状态
  async initializeAuth() {
    if (this.authToken) {
      try {
        await this.validateToken();
      } catch (error) {
        console.error('Token validation failed:', error);
        this.logout();
      }
    }
  }

  // 用户登录
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // 保存认证信息
        this.currentUser = user;
        this.authToken = token;
        this.refreshToken = refreshToken;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_profile', JSON.stringify(user));
        
        // 触发登录事件
        this.dispatchAuthEvent('login', user);
        
        return {
          success: true,
          user,
          message: 'Login successful'
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.message || 'Login service temporarily unavailable'
      };
    }
  }

  // 用户注册
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // 自动登录新注册用户
        this.currentUser = user;
        this.authToken = token;
        this.refreshToken = refreshToken;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_profile', JSON.stringify(user));
        
        // 触发注册事件
        this.dispatchAuthEvent('register', user);
        
        return {
          success: true,
          user,
          message: 'Registration successful'
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: error.message || 'Registration service temporarily unavailable'
      };
    }
  }

  // 用户登出
  async logout() {
    try {
      if (this.authToken) {
        await apiClient.post('/auth/logout', {
          token: this.authToken
        });
      }
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 清除本地认证信息
      this.currentUser = null;
      this.authToken = null;
      this.refreshToken = null;
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
      
      // 触发登出事件
      this.dispatchAuthEvent('logout', null);
    }
  }

  // 获取当前用户
  getCurrentUser() {
    if (!this.currentUser) {
      const userProfile = localStorage.getItem('user_profile');
      if (userProfile) {
        try {
          this.currentUser = JSON.parse(userProfile);
        } catch (error) {
          console.error('用户信息解析失败:', error);
        }
      }
    }
    return this.currentUser;
  }

  // 检查是否已登录
  isAuthenticated() {
    return !!(this.authToken && this.getCurrentUser());
  }

  // 获取认证令牌
  getAuthToken() {
    return this.authToken;
  }

  // 验证令牌
  async validateToken() {
    if (!this.authToken) {
      throw new Error('无认证令牌');
    }

    try {
      const response = await apiClient.get('/auth/validate', {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.success) {
        this.currentUser = response.data.user;
        localStorage.setItem('user_profile', JSON.stringify(this.currentUser));
        return true;
      } else {
        throw new Error('令牌验证失败');
      }
    } catch (error) {
      console.error('令牌验证失败:', error);
      throw error;
    }
  }

  // 刷新令牌
  async refreshAuthToken() {
    if (!this.refreshToken) {
      throw new Error('无刷新令牌');
    }

    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken: this.refreshToken
      });

      if (response.success) {
        const { token, refreshToken } = response.data;
        
        this.authToken = token;
        this.refreshToken = refreshToken;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        
        return token;
      } else {
        throw new Error('令牌刷新失败');
      }
    } catch (error) {
      console.error('令牌刷新失败:', error);
      this.logout();
      throw error;
    }
  }

  // 更新用户资料
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.success) {
        this.currentUser = { ...this.currentUser, ...response.data.user };
        localStorage.setItem('user_profile', JSON.stringify(this.currentUser));
        
        // 触发资料更新事件
        this.dispatchAuthEvent('profileUpdate', this.currentUser);
        
        return {
          success: true,
          user: this.currentUser,
          message: '资料更新成功'
        };
      } else {
        throw new Error(response.message || '资料更新失败');
      }
    } catch (error) {
      console.error('资料更新失败:', error);
      return {
        success: false,
        message: error.message || '资料更新服务暂时不可用'
      };
    }
  }

  // 修改密码
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.success) {
        return {
          success: true,
          message: '密码修改成功'
        };
      } else {
        throw new Error(response.message || '密码修改失败');
      }
    } catch (error) {
      console.error('密码修改失败:', error);
      return {
        success: false,
        message: error.message || '密码修改服务暂时不可用'
      };
    }
  }

  // 忘记密码
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });

      if (response.success) {
        return {
          success: true,
          message: '重置密码邮件已发送'
        };
      } else {
        throw new Error(response.message || '密码重置失败');
      }
    } catch (error) {
      console.error('密码重置失败:', error);
      return {
        success: false,
        message: error.message || '密码重置服务暂时不可用'
      };
    }
  }

  // 重置密码
  async resetPassword(resetData) {
    try {
      const response = await apiClient.post('/auth/reset-password', resetData);

      if (response.success) {
        return {
          success: true,
          message: '密码重置成功'
        };
      } else {
        throw new Error(response.message || '密码重置失败');
      }
    } catch (error) {
      console.error('密码重置失败:', error);
      return {
        success: false,
        message: error.message || '密码重置服务暂时不可用'
      };
    }
  }

  // 获取用户权限
  getUserPermissions() {
    const user = this.getCurrentUser();
    if (!user) return [];
    
    return user.permissions || [];
  }

  // 检查用户权限
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // 获取用户角色
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || 'guest';
  }

  // 检查用户角色
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // 分发认证事件
  dispatchAuthEvent(type, data) {
    const event = new CustomEvent('authStateChange', {
      detail: { type, data }
    });
    window.dispatchEvent(event);
  }

  // 监听认证状态变化
  onAuthStateChange(callback) {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('authStateChange', handler);
    
    // 返回取消监听的函数
    return () => {
      window.removeEventListener('authStateChange', handler);
    };
  }

  // 模拟登录（开发环境）
  async mockLogin(userType = 'investor') {
    const mockUsers = {
      investor: {
        id: 1,
        name: '张投资',
        email: 'investor@example.com',
        role: 'investor',
        avatar: '👨‍💼',
        company: '红杉资本中国',
        position: '投资总监',
        permissions: ['view_projects', 'make_investments', 'access_vc_radar']
      },
      founder: {
        id: 2,
        name: '李创始',
        email: 'founder@example.com',
        role: 'founder',
        avatar: '👩‍💻',
        company: 'AI独角兽',
        position: 'CEO & 创始人',
        permissions: ['view_projects', 'submit_projects', 'access_demo_day']
      },
      admin: {
        id: 3,
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
        avatar: '👨‍💼',
        company: 'Unicorn 100',
        position: '平台管理员',
        permissions: ['admin_access', 'manage_users', 'manage_projects']
      }
    };

    const user = mockUsers[userType];
    const token = `mock_token_${Date.now()}`;
    const refreshToken = `mock_refresh_${Date.now()}`;

    // 模拟认证成功
    this.currentUser = user;
    this.authToken = token;
    this.refreshToken = refreshToken;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_profile', JSON.stringify(user));

    // 触发登录事件
    this.dispatchAuthEvent('login', user);

    return {
      success: true,
      user,
      message: '模拟登录成功'
    };
  }
}

// 创建单例实例
const authService = new AuthService();

export default authService;

