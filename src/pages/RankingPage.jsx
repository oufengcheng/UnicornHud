import React from 'react';

const RankingPage = () => {
  // 榜单数据
  const rankings = [
    {
      rank: 1,
      name: "ByteDance",
      logo: "🎵",
      industry: "社交媒体",
      valuation: 140000000000,
      founded: 2012,
      location: "北京",
      employees: 110000,
      description: "全球领先的内容平台，旗下拥有抖音、TikTok等产品",
      growth_rate: 85,
      unicorn_score: 9.8
    },
    {
      rank: 2,
      name: "SpaceX",
      logo: "🚀",
      industry: "航空航天",
      valuation: 137000000000,
      founded: 2002,
      location: "加州",
      employees: 12000,
      description: "革命性的太空探索和卫星互联网服务提供商",
      growth_rate: 120,
      unicorn_score: 9.9
    },
    {
      rank: 3,
      name: "Stripe",
      logo: "💳",
      industry: "金融科技",
      valuation: 95000000000,
      founded: 2010,
      location: "旧金山",
      employees: 4000,
      description: "全球领先的在线支付处理平台",
      growth_rate: 70,
      unicorn_score: 9.5
    },
    {
      rank: 4,
      name: "Klarna",
      logo: "🛍️",
      industry: "金融科技",
      valuation: 45600000000,
      founded: 2005,
      location: "斯德哥尔摩",
      employees: 5000,
      description: "先买后付的购物支付解决方案",
      growth_rate: 60,
      unicorn_score: 9.2
    },
    {
      rank: 5,
      name: "Canva",
      logo: "🎨",
      industry: "设计软件",
      valuation: 40000000000,
      founded: 2013,
      location: "悉尼",
      employees: 3000,
      description: "简化设计的在线图形设计平台",
      growth_rate: 90,
      unicorn_score: 9.3
    },
    {
      rank: 6,
      name: "Databricks",
      logo: "📊",
      industry: "数据分析",
      valuation: 38000000000,
      founded: 2013,
      location: "旧金山",
      employees: 5000,
      description: "统一的数据分析平台",
      growth_rate: 75,
      unicorn_score: 9.1
    },
    {
      rank: 7,
      name: "Discord",
      logo: "🎮",
      industry: "社交平台",
      valuation: 15000000000,
      founded: 2015,
      location: "旧金山",
      employees: 600,
      description: "面向游戏玩家的语音和文字聊天平台",
      growth_rate: 110,
      unicorn_score: 8.9
    },
    {
      rank: 8,
      name: "Figma",
      logo: "✏️",
      industry: "设计软件",
      valuation: 20000000000,
      founded: 2012,
      location: "旧金山",
      employees: 800,
      description: "协作式界面设计工具",
      growth_rate: 95,
      unicorn_score: 9.0
    }
  ];

  const formatValuation = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(0)}M`;
    }
    return `$${value}`;
  };

  const getScoreColor = (score) => {
    if (score >= 9.5) return '#10b981'; // green
    if (score >= 9.0) return '#f59e0b'; // yellow
    if (score >= 8.5) return '#f97316'; // orange
    return '#6b7280'; // gray
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)'; // gold
    if (rank === 2) return 'linear-gradient(135deg, #c0c0c0, #e5e5e5)'; // silver
    if (rank === 3) return 'linear-gradient(135deg, #cd7f32, #daa520)'; // bronze
    return 'linear-gradient(135deg, #667eea, #764ba2)'; // default
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🏆 Unicorn 100 榜单
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
          全球最具价值的独角兽企业排行榜
        </p>
      </div>

      {/* Stats */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '-2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
            {rankings.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>独角兽企业</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
            {formatValuation(rankings.reduce((sum, r) => sum + r.valuation, 0))}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>总市值</div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
            {Math.round(rankings.reduce((sum, r) => sum + r.growth_rate, 0) / rankings.length)}%
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>平均增长率</div>
        </div>
      </div>

      {/* Rankings List */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {rankings.map((company, index) => (
            <div key={company.rank} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '2rem',
              borderBottom: index < rankings.length - 1 ? '1px solid #e5e7eb' : 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}>
              {/* Rank Badge */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: getRankBadgeColor(company.rank),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginRight: '2rem',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}>
                {company.rank}
              </div>

              {/* Company Logo */}
              <div style={{ 
                fontSize: '3rem', 
                marginRight: '2rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                {company.logo}
              </div>

              {/* Company Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    marginRight: '1rem'
                  }}>
                    {company.name}
                  </h3>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {company.industry}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  {company.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  fontSize: '0.875rem', 
                  color: '#6b7280' 
                }}>
                  <span>📍 {company.location}</span>
                  <span>📅 成立于 {company.founded}</span>
                  <span>👥 {company.employees.toLocaleString()} 员工</span>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                textAlign: 'center',
                marginLeft: '2rem'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    marginBottom: '0.25rem'
                  }}>
                    {formatValuation(company.valuation)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>估值</div>
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#10b981',
                    marginBottom: '0.25rem'
                  }}>
                    +{company.growth_rate}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>增长率</div>
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: getScoreColor(company.unicorn_score),
                    marginBottom: '0.25rem'
                  }}>
                    {company.unicorn_score}/10
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>评分</div>
                </div>
              </div>

              {/* Action Button */}
              <button style={{
                marginLeft: '2rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}>
                查看详情
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '1rem 2rem',
        backgroundColor: '#d1fae5',
        border: '1px solid #a7f3d0',
        borderRadius: '0.5rem',
        textAlign: 'center',
        color: '#065f46'
      }}>
        ✅ 榜单数据加载成功！显示全球前 {rankings.length} 名独角兽企业
      </div>
    </div>
  );
};

export default RankingPage;

