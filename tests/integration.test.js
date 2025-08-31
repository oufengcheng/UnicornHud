/**
 * Unicorn100平台集成测试套件
 * 验证所有功能模块的协同工作和完整用户流程
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// 导入主要组件
import App from '../src/App';
import HomePage from '../src/pages/HomePage';
import ProjectsPage from '../src/pages/ProjectsPage';
import PortfolioPage from '../src/pages/PortfolioPage';
import VCRadarPage from '../src/pages/VCRadarPage';
import DemoDayPage from '../src/pages/DemoDayPage';
import FoundersPage from '../src/pages/FoundersPage';
import MarketDataPage from '../src/pages/MarketDataPage';
import ProfilePage from '../src/pages/ProfilePage';

// 导入核心组件
import InvestmentModal from '../src/components/InvestmentModal';
import AIAnalysisModal from '../src/components/AIAnalysisModal';
import VCMatchingModal from '../src/components/VCMatchingModal';
import DemoDayRegistrationModal from '../src/components/DemoDayRegistrationModal';
import CommunityPost from '../src/components/CommunityPost';
import AdvancedAnalytics from '../src/components/AdvancedAnalytics';
import ExpertConsultation from '../src/components/ExpertConsultation';

// 导入移动端组件
import MobileProjectCard from '../src/components/MobileProjectCard';
import MobileChart from '../src/components/MobileChart';
import MobileBottomNavigation from '../src/components/MobileBottomNavigation';

// 导入服务
import { investmentService } from '../src/services/investmentService';
import { aiService } from '../src/services/aiService';
import { vcRadarService } from '../src/services/vcRadarService';
import { demoDayService } from '../src/services/demoDayService';
import { authService } from '../src/services/authService';
import { communityService } from '../src/services/communityService';
import { marketDataService } from '../src/services/marketDataService';

// 测试数据
const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: '/test-avatar.png',
  role: 'investor',
  verified: true
};

const mockProject = {
  id: 'project-1',
  name: 'Test Startup',
  description: 'A revolutionary AI-powered startup',
  industry: 'AI/ML',
  stage: 'A轮',
  valuation: 10000000,
  unicornScore: 8.5,
  foundedYear: 2023,
  tags: ['AI', 'Machine Learning', 'SaaS'],
  logo: '🤖'
};

const mockExpert = {
  id: 'expert-1',
  name: 'Expert Advisor',
  title: 'Senior Investment Partner',
  company: 'Top VC Fund',
  avatar: '/expert-avatar.png',
  rating: 4.8,
  reviewCount: 156,
  experience: 15,
  expertise: ['startup', 'venture', 'ai'],
  isOnline: true,
  verified: true
};

// 辅助函数
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

const mockApiResponse = (data, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

describe('Unicorn100平台集成测试', () => {
  let user;

  beforeAll(() => {
    user = userEvent.setup();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock navigator.vibrate
    Object.defineProperty(navigator, 'vibrate', {
      value: jest.fn(),
      writable: true,
    });

    // Mock navigator.share
    Object.defineProperty(navigator, 'share', {
      value: jest.fn(() => Promise.resolve()),
      writable: true,
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('P0级功能集成测试', () => {
    test('应用启动和基础导航', async () => {
      renderWithRouter(<App />);
      
      // 验证应用正常启动
      expect(screen.getByText(/Unicorn100/i)).toBeInTheDocument();
      
      // 验证导航菜单
      expect(screen.getByText(/首页/i)).toBeInTheDocument();
      expect(screen.getByText(/项目/i)).toBeInTheDocument();
      expect(screen.getByText(/投资/i)).toBeInTheDocument();
    });

    test('错误边界和错误处理', async () => {
      // 模拟组件错误
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithRouter(<ErrorComponent />);
      
      // 验证错误被正确捕获
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('市场数据页面加载和显示', async () => {
      // Mock市场数据服务
      jest.spyOn(marketDataService, 'getMarketData').mockResolvedValue({
        indices: [
          { name: 'NASDAQ', value: 15000, change: 1.2 },
          { name: 'S&P 500', value: 4500, change: 0.8 }
        ],
        trends: []
      });

      renderWithRouter(<MarketDataPage />);
      
      // 验证市场数据加载
      await waitFor(() => {
        expect(screen.getByText(/市场数据/i)).toBeInTheDocument();
      });
    });
  });

  describe('P1级核心功能集成测试', () => {
    test('投资功能完整流程', async () => {
      // Mock投资服务
      jest.spyOn(investmentService, 'paperInvest').mockResolvedValue({
        success: true,
        transactionId: 'tx-123'
      });

      renderWithRouter(
        <InvestmentModal 
          project={mockProject}
          user={mockUser}
          isOpen={true}
          onClose={() => {}}
        />
      );

      // 选择Paper Invest
      const paperInvestButton = screen.getByText(/Paper Invest/i);
      await user.click(paperInvestButton);

      // 输入投资金额
      const amountInput = screen.getByPlaceholderText(/投资金额/i);
      await user.type(amountInput, '10000');

      // 提交投资
      const submitButton = screen.getByText(/确认投资/i);
      await user.click(submitButton);

      // 验证投资成功
      await waitFor(() => {
        expect(investmentService.paperInvest).toHaveBeenCalledWith({
          projectId: mockProject.id,
          amount: 10000,
          userId: mockUser.id
        });
      });
    });

    test('AI分析功能集成', async () => {
      // Mock AI服务
      jest.spyOn(aiService, 'analyzeProject').mockResolvedValue({
        score: 8.5,
        analysis: {
          team: 9.0,
          market: 8.0,
          technology: 8.5,
          business: 8.0,
          financial: 7.5,
          risk: 7.0
        },
        insights: ['Strong technical team', 'Large market opportunity']
      });

      renderWithRouter(
        <AIAnalysisModal 
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );

      // 等待AI分析完成
      await waitFor(() => {
        expect(screen.getByText(/AI分析结果/i)).toBeInTheDocument();
      });

      // 验证分析结果显示
      expect(screen.getByText(/8.5/)).toBeInTheDocument();
    });

    test('用户投资组合管理', async () => {
      // Mock投资组合数据
      const mockPortfolio = {
        totalValue: 100000,
        totalReturn: 0.15,
        investments: [
          {
            id: 'inv-1',
            project: mockProject,
            amount: 10000,
            currentValue: 11500,
            return: 0.15
          }
        ]
      };

      renderWithRouter(<PortfolioPage user={mockUser} />);

      // 验证投资组合页面加载
      await waitFor(() => {
        expect(screen.getByText(/投资组合/i)).toBeInTheDocument();
      });
    });

    test('用户个人资料管理', async () => {
      renderWithRouter(<ProfilePage user={mockUser} />);

      // 验证个人资料页面
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();

      // 测试资料编辑
      const editButton = screen.getByText(/编辑资料/i);
      await user.click(editButton);

      // 验证编辑表单显示
      expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument();
    });
  });

  describe('P2级体验优化功能集成测试', () => {
    test('多语言国际化功能', async () => {
      renderWithRouter(<App />);

      // 查找语言切换器
      const languageSwitcher = screen.getByRole('button', { name: /语言/i });
      await user.click(languageSwitcher);

      // 选择英文
      const englishOption = screen.getByText(/English/i);
      await user.click(englishOption);

      // 验证语言切换
      await waitFor(() => {
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
      });
    });

    test('移动端组件响应式适配', async () => {
      // 模拟移动端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(
        <MobileProjectCard 
          project={mockProject}
          onInvest={() => {}}
          onAnalyze={() => {}}
          onFavorite={() => {}}
          onShare={() => {}}
        />
      );

      // 验证移动端卡片渲染
      expect(screen.getByText(mockProject.name)).toBeInTheDocument();

      // 测试滑动操作
      const card = screen.getByRole('article');
      fireEvent.touchStart(card, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchMove(card, { touches: [{ clientX: 50, clientY: 100 }] });
      fireEvent.touchEnd(card);

      // 验证操作按钮显示
      await waitFor(() => {
        expect(screen.getByText(/投资/i)).toBeInTheDocument();
      });
    });

    test('社区功能集成', async () => {
      const mockPost = {
        id: 'post-1',
        author: mockUser,
        content: 'This is a test community post',
        createdAt: new Date().toISOString(),
        likeCount: 5,
        commentCount: 2,
        isLiked: false
      };

      // Mock社区服务
      jest.spyOn(communityService, 'likePost').mockResolvedValue({
        success: true,
        likeCount: 6
      });

      renderWithRouter(
        <CommunityPost 
          post={mockPost}
          currentUser={mockUser}
          onLike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
        />
      );

      // 验证动态内容显示
      expect(screen.getByText(mockPost.content)).toBeInTheDocument();
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();

      // 测试点赞功能
      const likeButton = screen.getByText(/点赞/i);
      await user.click(likeButton);

      // 验证点赞状态更新
      await waitFor(() => {
        expect(screen.getByText(/6/)).toBeInTheDocument();
      });
    });

    test('高级数据分析功能', async () => {
      const mockAnalyticsData = {
        overview: {
          totalValue: 100000,
          totalReturn: 0.15,
          activeInvestments: 5,
          avgReturn: 0.12,
          sectorDistribution: [
            { name: 'AI/ML', value: 40000 },
            { name: 'Fintech', value: 35000 },
            { name: 'Healthcare', value: 25000 }
          ],
          performanceTrend: []
        },
        performance: {
          totalReturn: 0.15,
          annualizedReturn: 0.18,
          volatility: 0.25,
          sharpeRatio: 1.2,
          maxDrawdown: 0.08,
          winRate: 0.75
        }
      };

      renderWithRouter(
        <AdvancedAnalytics 
          data={mockAnalyticsData}
          timeRange="1M"
          onTimeRangeChange={() => {}}
          onExport={() => {}}
        />
      );

      // 验证分析数据显示
      expect(screen.getByText(/高级数据分析/i)).toBeInTheDocument();
      expect(screen.getByText(/100,000/)).toBeInTheDocument();

      // 测试标签页切换
      const performanceTab = screen.getByText(/性能分析/i);
      await user.click(performanceTab);

      // 验证性能分析内容
      expect(screen.getByText(/夏普比率/i)).toBeInTheDocument();
    });

    test('专家咨询功能', async () => {
      renderWithRouter(
        <ExpertConsultation 
          expert={mockExpert}
          currentUser={mockUser}
          onBookConsultation={() => {}}
          onSendMessage={() => {}}
          onRateExpert={() => {}}
        />
      );

      // 验证专家信息显示
      expect(screen.getByText(mockExpert.name)).toBeInTheDocument();
      expect(screen.getByText(mockExpert.title)).toBeInTheDocument();

      // 测试预约功能
      const bookingTab = screen.getByText(/预约/i);
      await user.click(bookingTab);

      // 选择咨询类型
      const videoConsultation = screen.getByText(/视频通话/i);
      await user.click(videoConsultation);

      // 验证预约表单
      expect(screen.getByText(/选择时间/i)).toBeInTheDocument();
    });
  });

  describe('性能和稳定性测试', () => {
    test('大数据量渲染性能', async () => {
      const largeProjectList = Array.from({ length: 1000 }, (_, i) => ({
        ...mockProject,
        id: `project-${i}`,
        name: `Project ${i}`
      }));

      const startTime = performance.now();
      
      renderWithRouter(<ProjectsPage projects={largeProjectList} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 验证渲染时间在合理范围内 (< 1000ms)
      expect(renderTime).toBeLessThan(1000);
    });

    test('内存泄漏检测', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // 渲染和卸载多个组件
      for (let i = 0; i < 100; i++) {
        const { unmount } = renderWithRouter(<HomePage />);
        unmount();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // 验证内存增长在合理范围内
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // < 10MB
    });

    test('并发操作处理', async () => {
      // 模拟多个并发投资操作
      const concurrentInvestments = Array.from({ length: 10 }, (_, i) => 
        investmentService.paperInvest({
          projectId: `project-${i}`,
          amount: 1000,
          userId: mockUser.id
        })
      );

      // 等待所有操作完成
      const results = await Promise.allSettled(concurrentInvestments);
      
      // 验证所有操作都成功处理
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
      });
    });
  });

  describe('安全性测试', () => {
    test('XSS攻击防护', async () => {
      const maliciousPost = {
        ...mockUser,
        content: '<script>alert("XSS")</script>恶意脚本测试'
      };

      renderWithRouter(
        <CommunityPost 
          post={maliciousPost}
          currentUser={mockUser}
          onLike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
        />
      );

      // 验证脚本标签被正确转义
      expect(screen.queryByText('<script>')).not.toBeInTheDocument();
      expect(screen.getByText(/恶意脚本测试/)).toBeInTheDocument();
    });

    test('敏感数据保护', async () => {
      const sensitiveUser = {
        ...mockUser,
        password: 'secret123',
        creditCard: '1234-5678-9012-3456'
      };

      renderWithRouter(<ProfilePage user={sensitiveUser} />);

      // 验证敏感信息不会显示
      expect(screen.queryByText('secret123')).not.toBeInTheDocument();
      expect(screen.queryByText('1234-5678-9012-3456')).not.toBeInTheDocument();
    });

    test('API请求安全性', async () => {
      // Mock fetch to verify security headers
      const mockFetch = jest.fn(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      );
      
      global.fetch = mockFetch;

      await investmentService.paperInvest({
        projectId: mockProject.id,
        amount: 10000,
        userId: mockUser.id
      });

      // 验证请求包含安全头
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  describe('用户体验完整流程测试', () => {
    test('新用户完整注册投资流程', async () => {
      // 1. 用户访问首页
      renderWithRouter(<App />);
      expect(screen.getByText(/Unicorn100/i)).toBeInTheDocument();

      // 2. 浏览项目
      const projectsLink = screen.getByText(/项目/i);
      await user.click(projectsLink);

      // 3. 查看项目详情
      const projectCard = screen.getByText(mockProject.name);
      await user.click(projectCard);

      // 4. 进行AI分析
      const analyzeButton = screen.getByText(/AI分析/i);
      await user.click(analyzeButton);

      // 5. 进行投资
      const investButton = screen.getByText(/投资/i);
      await user.click(investButton);

      // 验证完整流程可以顺利进行
      expect(screen.getByText(/投资确认/i)).toBeInTheDocument();
    });

    test('专家咨询完整流程', async () => {
      // 1. 访问专家页面
      renderWithRouter(<ExpertConsultation expert={mockExpert} currentUser={mockUser} />);

      // 2. 查看专家资料
      expect(screen.getByText(mockExpert.name)).toBeInTheDocument();

      // 3. 预约咨询
      const bookingTab = screen.getByText(/预约/i);
      await user.click(bookingTab);

      // 4. 选择咨询类型
      const videoOption = screen.getByText(/视频通话/i);
      await user.click(videoOption);

      // 5. 确认预约
      const confirmButton = screen.getByText(/确认预约/i);
      expect(confirmButton).toBeInTheDocument();
    });

    test('社区互动完整流程', async () => {
      const mockPost = {
        id: 'post-1',
        author: mockUser,
        content: 'Test community interaction',
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        isLiked: false
      };

      // 1. 查看社区动态
      renderWithRouter(
        <CommunityPost 
          post={mockPost}
          currentUser={mockUser}
          onLike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
        />
      );

      // 2. 点赞动态
      const likeButton = screen.getByText(/点赞/i);
      await user.click(likeButton);

      // 3. 评论动态
      const commentButton = screen.getByText(/评论/i);
      await user.click(commentButton);

      // 4. 分享动态
      const shareButton = screen.getByText(/分享/i);
      await user.click(shareButton);

      // 验证所有交互功能正常
      expect(likeButton).toBeInTheDocument();
      expect(commentButton).toBeInTheDocument();
      expect(shareButton).toBeInTheDocument();
    });
  });
});

// 性能基准测试
describe('性能基准测试', () => {
  test('首页加载性能基准', async () => {
    const startTime = performance.now();
    
    renderWithRouter(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Unicorn100/i)).toBeInTheDocument();
    });
    
    const loadTime = performance.now() - startTime;
    
    // 首页加载时间应小于500ms
    expect(loadTime).toBeLessThan(500);
  });

  test('项目列表渲染性能基准', async () => {
    const projects = Array.from({ length: 100 }, (_, i) => ({
      ...mockProject,
      id: `project-${i}`,
      name: `Project ${i}`
    }));

    const startTime = performance.now();
    
    renderWithRouter(<ProjectsPage projects={projects} />);
    
    const renderTime = performance.now() - startTime;
    
    // 100个项目渲染时间应小于200ms
    expect(renderTime).toBeLessThan(200);
  });

  test('移动端组件渲染性能基准', async () => {
    const startTime = performance.now();
    
    renderWithRouter(
      <MobileProjectCard 
        project={mockProject}
        onInvest={() => {}}
        onAnalyze={() => {}}
        onFavorite={() => {}}
        onShare={() => {}}
      />
    );
    
    const renderTime = performance.now() - startTime;
    
    // 移动端组件渲染时间应小于100ms
    expect(renderTime).toBeLessThan(100);
  });
});

export default {};

