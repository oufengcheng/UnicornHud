// API客户端服务
class APIClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.unicorn100.com';
    this.timeout = 10000; // 10秒超时
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1秒重试延迟
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // 添加认证令牌
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let lastError;
    
    // 重试机制
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, config);
        
        if (!response.ok) {
          throw new APIError(
            response.status,
            response.statusText,
            await this.parseErrorResponse(response)
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        
        // 如果是最后一次尝试，或者是不可重试的错误，直接抛出
        if (attempt === this.retryAttempts || !this.isRetryableError(error)) {
          throw this.handleError(error);
        }
        
        // 等待后重试
        await this.delay(this.retryDelay * attempt);
      }
    }
    
    throw this.handleError(lastError);
  }

  // 带超时的fetch
  async fetchWithTimeout(url, config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // GET请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  // POST请求
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT请求
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // 获取认证令牌
  getAuthToken() {
    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.warn('获取认证令牌失败:', error);
      return null;
    }
  }

  // 设置认证令牌
  setAuthToken(token) {
    try {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.warn('设置认证令牌失败:', error);
    }
  }

  // 解析错误响应
  async parseErrorResponse(response) {
    try {
      const errorData = await response.json();
      return errorData;
    } catch (error) {
      return { message: response.statusText };
    }
  }

  // 判断是否为可重试的错误
  isRetryableError(error) {
    // 网络错误、超时错误、5xx服务器错误可以重试
    if (error.name === 'AbortError') return true; // 超时
    if (error.name === 'TypeError') return true; // 网络错误
    if (error.status >= 500) return true; // 服务器错误
    
    return false;
  }

  // 错误处理
  handleError(error) {
    if (error instanceof APIError) {
      return error;
    }

    if (error.name === 'AbortError') {
      return new APIError(408, 'Request Timeout', {
        message: '请求超时，请检查网络连接后重试'
      });
    }

    if (error.name === 'TypeError') {
      return new APIError(0, 'Network Error', {
        message: '网络连接失败，请检查网络后重试'
      });
    }

    return new APIError(500, 'Unknown Error', {
      message: error.message || '未知错误，请稍后重试'
    });
  }

  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 自定义API错误类
class APIError extends Error {
  constructor(status, statusText, data = {}) {
    super(data.message || statusText);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }

  // 获取用户友好的错误消息
  getUserMessage() {
    const errorMessages = {
      400: '请求参数错误，请检查输入信息',
      401: '请先登录后再进行操作',
      403: '您没有权限执行此操作',
      404: '请求的资源不存在',
      408: '请求超时，请稍后重试',
      409: '操作冲突，请刷新页面后重试',
      422: '输入数据验证失败，请检查输入信息',
      429: '请求过于频繁，请稍后重试',
      500: '服务器内部错误，请稍后重试',
      502: '服务暂时不可用，请稍后重试',
      503: '服务维护中，请稍后重试'
    };

    return this.data.message || errorMessages[this.status] || '操作失败，请稍后重试';
  }

  // 判断是否为认证错误
  isAuthError() {
    return this.status === 401;
  }

  // 判断是否为权限错误
  isPermissionError() {
    return this.status === 403;
  }

  // 判断是否为验证错误
  isValidationError() {
    return this.status === 422;
  }
}

// 创建全局API客户端实例
const apiClient = new APIClient();

// 响应拦截器 - 处理全局错误
const originalRequest = apiClient.request.bind(apiClient);
apiClient.request = async function(endpoint, options) {
  try {
    return await originalRequest(endpoint, options);
  } catch (error) {
    // 处理认证错误
    if (error.isAuthError && error.isAuthError()) {
      // 清除认证令牌
      this.setAuthToken(null);
      
      // 重定向到登录页面
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // 显示错误提示
    if (typeof window !== 'undefined' && window.showErrorMessage) {
      window.showErrorMessage(error.getUserMessage());
    }
    
    throw error;
  }
};

export { APIClient, APIError };
export default apiClient;

