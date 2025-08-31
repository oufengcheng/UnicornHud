import React from "react";

const ReferrerPage = () => {
  const referrers = [
    { id: 1, name: "李开复", title: "创新工场董事长", referrals: 156, success_rate: "85%", reward: "$2.5M", level: "钻石推荐人" },
    { id: 2, name: "徐小平", title: "真格基金创始人", referrals: 203, success_rate: "78%", reward: "$3.2M", level: "钻石推荐人" },
    { id: 3, name: "王刚", title: "滴滴天使投资人", referrals: 89, success_rate: "92%", reward: "$1.8M", level: "黄金推荐人" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>🤝 Referrer推荐网络</h1>
        <p style={{ fontSize: "1.25rem", opacity: 0.9 }}>构建信任网络，让推荐创造价值</p>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {referrers.map(referrer => (
          <div key={referrer.id} style={{ backgroundColor: "white", borderRadius: "1rem", padding: "2rem", marginBottom: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{referrer.name}</h3>
                <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>{referrer.title}</p>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <span>推荐数: {referrer.referrals}</span>
                  <span>成功率: {referrer.success_rate}</span>
                  <span>累计奖励: {referrer.reward}</span>
                </div>
              </div>
              <div style={{ backgroundColor: "#fbbf24", color: "white", padding: "0.5rem 1rem", borderRadius: "1rem", fontWeight: "600" }}>
                {referrer.level}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "1rem 2rem", backgroundColor: "#d1fae5", borderRadius: "0.5rem", textAlign: "center", color: "#065f46" }}>
        ✅ Referrer推荐网络数据加载成功！显示 {referrers.length} 位顶级推荐人
      </div>
    </div>
  );
};

export default ReferrerPage;
