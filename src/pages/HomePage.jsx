import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  Trophy, 
  Radar, 
  Users, 
  Calendar,
  ArrowRight,
  Star,
  DollarSign,
  Building2,
  Zap
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const HomePage = () => {
  const { t, formatCurrency, formatNumber } = useTranslation();
  const [stats, setStats] = useState({
    totalUnicorns: 1200,
    totalValue: 4500000000000,
    newThisMonth: 15,
    avgValuation: 3750000000
  });

  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    // 模拟获取特色项目数据
    setFeaturedProjects([
      {
        id: 1,
        name: "QuantumAI Labs",
        logo: "🧠",
        industry: t('projects.industries.ai'),
        valuation: 50000000,
        stage: t('projects.stages.seriesA'),
        unicornScore: 8.5,
        description: "革命性的量子计算与人工智能融合平台"
      },
      {
        id: 2,
        name: "BioNano Therapeutics",
        logo: "🧬",
        industry: t('projects.industries.biotech'),
        valuation: 120000000,
        stage: t('projects.stages.seriesB'),
        unicornScore: 9.2,
        description: "基于纳米技术的精准医疗平台"
      },
      {
        id: 3,
        name: "GreenTech Energy",
        logo: "⚡",
        industry: t('projects.industries.cleantech'),
        valuation: 20000000,
        stage: t('projects.stages.seed'),
        unicornScore: 7.8,
        description: "智能电网和储能解决方案"
      }
    ]);
  }, [t]);

  const coreFeatures = [
    {
      icon: Trophy,
      title: "Unicorn 100 Ranking",
      description: "Global unicorn enterprise real-time ranking, tracking the most valuable innovative companies",
      path: "/ranking",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Radar,
      title: "Unicorn Radar",
      description: "AI-driven investment research engine, discovering early signals of the next unicorn",
      path: "/radar",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Users,
      title: t('navigation.vcRadar'),
      description: "Bidirectional investment matching platform, connecting quality projects with top investors",
      path: "/vc-radar",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Calendar,
      title: t('navigation.demoDay'),
      description: "Global pitch event platform, showcasing the most promising startup projects",
      path: "/demo-day",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Building2,
      title: t('navigation.founders'),
      description: "Exclusive community for entrepreneurs, sharing experiences, accessing resources, building connections",
      path: "/founders",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Referrer Network",
      description: "Referral incentive system, earning generous rewards through recommendations",
      path: "/referrer",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🦄</div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/projects">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
                <TrendingUp className="mr-2" size={20} />
                {t('home.getStarted')}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3">
                <Users className="mr-2" size={20} />
                {t('home.learnMore')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{formatNumber(stats.totalUnicorns)}</div>
              <div className="text-sm text-gray-600">{t('home.stats.totalProjects')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalValue)}</div>
              <div className="text-sm text-gray-600">{t('home.stats.totalFunding')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{formatNumber(stats.newThisMonth)}</div>
              <div className="text-sm text-gray-600">{t('home.stats.totalInvestors')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.avgValuation)}</div>
              <div className="text-sm text-gray-600">{t('home.stats.successRate')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Six Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive investment ecosystem, from discovery to investment, from community to exit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.path}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <div className="flex items-center text-purple-600 font-medium">
                        Learn More
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-curated high-potential projects, discover the next unicorn first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{project.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {project.industry}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500 fill-current" size={16} />
                      <span className="font-bold text-sm">{project.unicornScore}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="text-sm font-medium">{formatCurrency(project.valuation)}</span>
                      </div>
                      <Badge variant="outline">{project.stage}</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/projects">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                View All Projects
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to discover the next unicorn?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the world's leading investment matching platform and connect with top investors and innovative projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                <Zap className="mr-2" size={20} />
                Register Now
              </Button>
            </Link>
            <Link to="/market-data">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                <BarChart3 className="mr-2" size={20} />
                View Market Data
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

