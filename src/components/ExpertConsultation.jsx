import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Expert Consultation System Component
 * Provides professional investment consulting and guidance services
 */
const ExpertConsultation = ({
  expert,
  currentUser,
  onBookConsultation,
  onSendMessage,
  onRateExpert,
  className = '',
  ...props
}) => {
  const { t, formatCurrency, formatRelativeTime } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [consultationType, setConsultationType] = useState('video');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [consultationTopic, setConsultationTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  
  const messageRef = useRef(null);

  // Consultation type options
  const consultationTypes = [
    {
      id: 'video',
      name: t('expert.videoCall'),
      icon: '📹',
      duration: 60,
      price: expert?.pricing?.video || 500,
      description: t('expert.videoCallDesc')
    },
    {
      id: 'audio',
      name: t('expert.audioCall'),
      icon: '📞',
      duration: 60,
      price: expert?.pricing?.audio || 300,
      description: t('expert.audioCallDesc')
    },
    {
      id: 'message',
      name: t('expert.messaging'),
      icon: '💬',
      duration: 0,
      price: expert?.pricing?.message || 100,
      description: t('expert.messagingDesc')
    },
    {
      id: 'review',
      name: t('expert.portfolioReview'),
      icon: '📊',
      duration: 90,
      price: expert?.pricing?.review || 800,
      description: t('expert.portfolioReviewDesc')
    }
  ];

  // 专业领域标签
  const expertiseTags = [
    { id: 'startup', label: t('expert.startup'), color: '#3b82f6' },
    { id: 'venture', label: t('expert.venture'), color: '#10b981' },
    { id: 'growth', label: t('expert.growth'), color: '#f59e0b' },
    { id: 'fintech', label: t('expert.fintech'), color: '#8b5cf6' },
    { id: 'ai', label: t('expert.ai'), color: '#ef4444' },
    { id: 'blockchain', label: t('expert.blockchain'), color: '#06b6d4' }
  ];

  // 处理预约咨询
  const handleBookConsultation = async () => {
    if (!selectedTimeSlot || !consultationType) return;
    
    setIsBooking(true);
    try {
      await onBookConsultation?.({
        expertId: expert.id,
        type: consultationType,
        timeSlot: selectedTimeSlot,
        topic: consultationTopic,
        message: message
      });
      
      // 重置表单
      setSelectedTimeSlot(null);
      setConsultationTopic('');
      setMessage('');
    } catch (error) {
      console.error('预约失败:', error);
    } finally {
      setIsBooking(false);
    }
  };

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await onSendMessage?.({
        expertId: expert.id,
        message: message.trim()
      });
      setMessage('');
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  // 处理评分
  const handleRating = async (score) => {
    setRating(score);
    try {
      await onRateExpert?.(expert.id, score);
      setShowRating(false);
    } catch (error) {
      console.error('评分失败:', error);
    }
  };

  // 获取专家状态
  const getExpertStatus = () => {
    if (expert.isOnline) {
      return { status: 'online', text: t('expert.online'), color: '#10b981' };
    } else if (expert.lastSeen && Date.now() - new Date(expert.lastSeen).getTime() < 3600000) {
      return { status: 'recent', text: t('expert.recentlyOnline'), color: '#f59e0b' };
    } else {
      return { status: 'offline', text: t('expert.offline'), color: '#6b7280' };
    }
  };

  // 渲染专家资料标签页
  const renderProfileTab = () => {
    const status = getExpertStatus();
    
    return (
      <div className="expert-profile">
        {/* 专家头部信息 */}
        <div className="expert-header">
          <div className="expert-avatar">
            <img 
              src={expert.avatar || '/default-avatar.png'} 
              alt={expert.name}
            />
            <div className={`status-indicator ${status.status}`} />
          </div>
          <div className="expert-info">
            <h2 className="expert-name">
              {expert.name}
              {expert.verified && <span className="verified">✅</span>}
            </h2>
            <p className="expert-title">{expert.title}</p>
            <p className="expert-company">{expert.company}</p>
            <div className="expert-status">
              <span className="status-dot" style={{ backgroundColor: status.color }} />
              {status.text}
            </div>
          </div>
          <div className="expert-rating">
            <div className="rating-score">
              <span className="score">{expert.rating?.toFixed(1) || '5.0'}</span>
              <div className="stars">
                {'★'.repeat(Math.floor(expert.rating || 5))}
                {'☆'.repeat(5 - Math.floor(expert.rating || 5))}
              </div>
            </div>
            <p className="rating-count">
              {expert.reviewCount || 0} {t('expert.reviews')}
            </p>
          </div>
        </div>

        {/* 专业领域 */}
        <div className="expertise-section">
          <h3 className="section-title">{t('expert.expertise')}</h3>
          <div className="expertise-tags">
            {expert.expertise?.map((tag, index) => {
              const tagInfo = expertiseTags.find(t => t.id === tag) || { label: tag, color: '#6b7280' };
              return (
                <span 
                  key={index} 
                  className="expertise-tag"
                  style={{ backgroundColor: tagInfo.color }}
                >
                  {tagInfo.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* 专家简介 */}
        <div className="bio-section">
          <h3 className="section-title">{t('expert.biography')}</h3>
          <p className="expert-bio">{expert.bio}</p>
        </div>

        {/* 经验和成就 */}
        <div className="achievements-section">
          <h3 className="section-title">{t('expert.achievements')}</h3>
          <div className="achievements-grid">
            <div className="achievement-item">
              <span className="achievement-icon">💼</span>
              <div className="achievement-content">
                <h4 className="achievement-title">{t('expert.experience')}</h4>
                <p className="achievement-value">{expert.experience || 10}+ {t('expert.years')}</p>
              </div>
            </div>
            <div className="achievement-item">
              <span className="achievement-icon">🚀</span>
              <div className="achievement-content">
                <h4 className="achievement-title">{t('expert.investmentsLed')}</h4>
                <p className="achievement-value">{expert.investmentsLed || 50}+</p>
              </div>
            </div>
            <div className="achievement-item">
              <span className="achievement-icon">💰</span>
              <div className="achievement-content">
                <h4 className="achievement-title">{t('expert.totalInvested')}</h4>
                <p className="achievement-value">{formatCurrency(expert.totalInvested || 100000000)}</p>
              </div>
            </div>
            <div className="achievement-item">
              <span className="achievement-icon">🎯</span>
              <div className="achievement-content">
                <h4 className="achievement-title">{t('expert.successRate')}</h4>
                <p className="achievement-value">{expert.successRate || 85}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 最近案例 */}
        {expert.recentCases && expert.recentCases.length > 0 && (
          <div className="cases-section">
            <h3 className="section-title">{t('expert.recentCases')}</h3>
            <div className="cases-list">
              {expert.recentCases.slice(0, 3).map((case_, index) => (
                <div key={index} className="case-item">
                  <div className="case-logo">
                    {case_.logo || '🦄'}
                  </div>
                  <div className="case-info">
                    <h4 className="case-name">{case_.name}</h4>
                    <p className="case-description">{case_.description}</p>
                    <div className="case-result">
                      <span className="case-return">+{case_.return}%</span>
                      <span className="case-period">{case_.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染预约标签页
  const renderBookingTab = () => {
    return (
      <div className="booking-section">
        {/* 咨询类型选择 */}
        <div className="consultation-types">
          <h3 className="section-title">{t('expert.selectConsultationType')}</h3>
          <div className="types-grid">
            {consultationTypes.map(type => (
              <div 
                key={type.id}
                className={`type-card ${consultationType === type.id ? 'selected' : ''}`}
                onClick={() => setConsultationType(type.id)}
              >
                <div className="type-header">
                  <span className="type-icon">{type.icon}</span>
                  <h4 className="type-name">{type.name}</h4>
                </div>
                <p className="type-description">{type.description}</p>
                <div className="type-details">
                  {type.duration > 0 && (
                    <span className="type-duration">{type.duration} {t('expert.minutes')}</span>
                  )}
                  <span className="type-price">{formatCurrency(type.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 时间选择 */}
        {consultationType && consultationType !== 'message' && (
          <div className="time-selection">
            <h3 className="section-title">{t('expert.selectTime')}</h3>
            <div className="time-slots">
              {expert.availableSlots?.map((slot, index) => (
                <button
                  key={index}
                  className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeSlot(slot)}
                >
                  <div className="slot-date">{new Date(slot).toLocaleDateString()}</div>
                  <div className="slot-time">{new Date(slot).toLocaleTimeString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 咨询主题 */}
        <div className="topic-selection">
          <h3 className="section-title">{t('expert.consultationTopic')}</h3>
          <select 
            value={consultationTopic}
            onChange={(e) => setConsultationTopic(e.target.value)}
            className="topic-select"
          >
            <option value="">{t('expert.selectTopic')}</option>
            <option value="investment-strategy">{t('expert.investmentStrategy')}</option>
            <option value="portfolio-review">{t('expert.portfolioReview')}</option>
            <option value="startup-evaluation">{t('expert.startupEvaluation')}</option>
            <option value="market-analysis">{t('expert.marketAnalysis')}</option>
            <option value="risk-management">{t('expert.riskManagement')}</option>
            <option value="other">{t('expert.other')}</option>
          </select>
        </div>

        {/* 附加信息 */}
        <div className="additional-info">
          <h3 className="section-title">{t('expert.additionalInfo')}</h3>
          <textarea
            ref={messageRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('expert.additionalInfoPlaceholder')}
            className="info-textarea"
            rows={4}
          />
        </div>

        {/* 预约按钮 */}
        <div className="booking-actions">
          <div className="booking-summary">
            <div className="summary-item">
              <span className="summary-label">{t('expert.consultationType')}:</span>
              <span className="summary-value">
                {consultationTypes.find(t => t.id === consultationType)?.name}
              </span>
            </div>
            {selectedTimeSlot && (
              <div className="summary-item">
                <span className="summary-label">{t('expert.scheduledTime')}:</span>
                <span className="summary-value">
                  {new Date(selectedTimeSlot).toLocaleString()}
                </span>
              </div>
            )}
            <div className="summary-item total">
              <span className="summary-label">{t('expert.totalCost')}:</span>
              <span className="summary-value">
                {formatCurrency(consultationTypes.find(t => t.id === consultationType)?.price || 0)}
              </span>
            </div>
          </div>
          
          <button 
            className="book-button"
            onClick={handleBookConsultation}
            disabled={isBooking || !consultationType || (consultationType !== 'message' && !selectedTimeSlot)}
          >
            {isBooking ? t('expert.booking') : t('expert.bookConsultation')}
          </button>
        </div>
      </div>
    );
  };

  // 渲染评价标签页
  const renderReviewsTab = () => {
    return (
      <div className="reviews-section">
        {/* 评分概览 */}
        <div className="rating-overview">
          <div className="overall-rating">
            <div className="rating-score-large">
              {expert.rating?.toFixed(1) || '5.0'}
            </div>
            <div className="rating-stars-large">
              {'★'.repeat(Math.floor(expert.rating || 5))}
              {'☆'.repeat(5 - Math.floor(expert.rating || 5))}
            </div>
            <p className="rating-count-large">
              {t('expert.basedOnReviews', { count: expert.reviewCount || 0 })}
            </p>
          </div>
          
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-bar">
                <span className="star-label">{star}★</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${((expert.ratingBreakdown?.[star] || 0) / (expert.reviewCount || 1)) * 100}%` 
                    }}
                  />
                </div>
                <span className="star-count">{expert.ratingBreakdown?.[star] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 评价列表 */}
        <div className="reviews-list">
          {expert.reviews?.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <img 
                    src={review.user.avatar || '/default-avatar.png'} 
                    alt={review.user.name}
                    className="reviewer-avatar"
                  />
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{review.user.name}</h4>
                    <div className="review-meta">
                      <div className="review-stars">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                      <span className="review-date">
                        {formatRelativeTime(new Date(review.createdAt))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="consultation-type-badge">
                  {consultationTypes.find(t => t.id === review.consultationType)?.icon}
                  {consultationTypes.find(t => t.id === review.consultationType)?.name}
                </div>
              </div>
              <p className="review-content">{review.content}</p>
              {review.expertReply && (
                <div className="expert-reply">
                  <div className="reply-header">
                    <span className="reply-icon">💬</span>
                    <span className="reply-label">{t('expert.expertReply')}</span>
                  </div>
                  <p className="reply-content">{review.expertReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 写评价按钮 */}
        {currentUser && (
          <button 
            className="write-review-button"
            onClick={() => setShowRating(true)}
          >
            {t('expert.writeReview')}
          </button>
        )}
      </div>
    );
  };

  // 渲染评分模态框
  const renderRatingModal = () => {
    if (!showRating) return null;

    return (
      <div className="rating-modal">
        <div className="modal-backdrop" onClick={() => setShowRating(false)} />
        <div className="modal-content">
          <h3 className="modal-title">{t('expert.rateExpert')}</h3>
          <div className="rating-stars-input">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star-button ${rating >= star ? 'filled' : ''}`}
                onClick={() => handleRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button 
              className="cancel-button"
              onClick={() => setShowRating(false)}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`expert-consultation ${className}`} {...props}>
      {/* 标签页导航 */}
      <div className="consultation-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          {t('expert.profile')}
        </button>
        <button
          className={`tab-button ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          <span className="tab-icon">📅</span>
          {t('expert.booking')}
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <span className="tab-icon">⭐</span>
          {t('expert.reviews')}
        </button>
      </div>

      {/* 标签页内容 */}
      <div className="tab-content">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'booking' && renderBookingTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </div>

      {/* 评分模态框 */}
      {renderRatingModal()}

      <style jsx>{`
        .expert-consultation {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .consultation-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .tab-button {
          flex: 1;
          padding: 16px 12px;
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .tab-button.active {
          color: #3b82f6;
          background: white;
          border-bottom: 2px solid #3b82f6;
        }

        .tab-button:hover:not(.active) {
          background: #f1f5f9;
        }

        .tab-icon {
          font-size: 18px;
        }

        .tab-content {
          padding: 24px;
        }

        .expert-header {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          align-items: flex-start;
        }

        .expert-avatar {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .expert-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-indicator {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .status-indicator.online {
          background: #10b981;
        }

        .status-indicator.recent {
          background: #f59e0b;
        }

        .status-indicator.offline {
          background: #6b7280;
        }

        .expert-info {
          flex: 1;
        }

        .expert-name {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified {
          font-size: 18px;
        }

        .expert-title {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .expert-company {
          font-size: 14px;
          color: #9ca3af;
          margin: 0 0 12px 0;
        }

        .expert-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .expert-rating {
          text-align: center;
        }

        .rating-score {
          margin-bottom: 8px;
        }

        .score {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          display: block;
        }

        .stars {
          color: #fbbf24;
          font-size: 16px;
        }

        .rating-count {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .expertise-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .expertise-tag {
          padding: 6px 12px;
          border-radius: 16px;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .expert-bio {
          font-size: 15px;
          line-height: 1.6;
          color: #374151;
          margin: 0 0 24px 0;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .achievement-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .achievement-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .achievement-content {
          flex: 1;
        }

        .achievement-title {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .achievement-value {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .cases-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .case-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .case-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .case-info {
          flex: 1;
        }

        .case-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .case-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .case-result {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .case-return {
          font-size: 16px;
          font-weight: 700;
          color: #10b981;
        }

        .case-period {
          font-size: 12px;
          color: #6b7280;
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .type-card {
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .type-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .type-card.selected {
          border-color: #3b82f6;
          background: #f0f9ff;
        }

        .type-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .type-icon {
          font-size: 24px;
        }

        .type-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .type-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .type-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .type-duration {
          font-size: 12px;
          color: #6b7280;
        }

        .type-price {
          font-size: 16px;
          font-weight: 700;
          color: #3b82f6;
        }

        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .time-slot {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .time-slot:hover {
          border-color: #3b82f6;
        }

        .time-slot.selected {
          border-color: #3b82f6;
          background: #f0f9ff;
        }

        .slot-date {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .slot-time {
          font-size: 12px;
          color: #6b7280;
        }

        .topic-select {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          margin-bottom: 24px;
        }

        .info-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 24px;
        }

        .booking-summary {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item.total {
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
        }

        .summary-label {
          color: #6b7280;
        }

        .summary-value {
          color: #1f2937;
          font-weight: 500;
        }

        .book-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .book-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .book-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rating-overview {
          display: flex;
          gap: 32px;
          margin-bottom: 32px;
          align-items: center;
        }

        .overall-rating {
          text-align: center;
        }

        .rating-score-large {
          font-size: 48px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .rating-stars-large {
          color: #fbbf24;
          font-size: 24px;
          margin: 8px 0;
        }

        .rating-count-large {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .rating-breakdown {
          flex: 1;
        }

        .rating-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .star-label {
          font-size: 14px;
          color: #6b7280;
          width: 30px;
        }

        .bar-container {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #fbbf24;
          transition: width 0.3s ease;
        }

        .star-count {
          font-size: 12px;
          color: #6b7280;
          width: 30px;
          text-align: right;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 24px;
        }

        .review-item {
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .reviewer-info {
          display: flex;
          gap: 12px;
        }

        .reviewer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .reviewer-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .review-meta {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .review-stars {
          color: #fbbf24;
          font-size: 14px;
        }

        .review-date {
          font-size: 12px;
          color: #6b7280;
        }

        .consultation-type-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .review-content {
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          margin: 0;
        }

        .expert-reply {
          margin-top: 16px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .reply-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .reply-icon {
          font-size: 16px;
        }

        .reply-label {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
        }

        .reply-content {
          font-size: 14px;
          line-height: 1.5;
          color: #374151;
          margin: 0;
        }

        .write-review-button {
          width: 100%;
          padding: 12px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .write-review-button:hover {
          background: #e5e7eb;
        }

        .rating-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          position: relative;
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
        }

        .rating-stars-input {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .star-button {
          background: none;
          border: none;
          font-size: 32px;
          color: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .star-button.filled {
          color: #fbbf24;
        }

        .star-button:hover {
          transform: scale(1.1);
        }

        .modal-actions {
          display: flex;
          justify-content: center;
        }

        .cancel-button {
          padding: 8px 16px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        /* 响应式适配 */
        @media (max-width: 768px) {
          .tab-content {
            padding: 16px;
          }

          .expert-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .achievements-grid {
            grid-template-columns: 1fr;
          }

          .types-grid {
            grid-template-columns: 1fr;
          }

          .rating-overview {
            flex-direction: column;
            gap: 20px;
          }

          .review-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .expert-consultation {
            background: #1f2937;
          }

          .consultation-tabs {
            background: #374151;
            border-color: #4b5563;
          }

          .tab-button {
            color: #9ca3af;
          }

          .tab-button.active {
            color: #60a5fa;
            background: #1f2937;
          }

          .expert-name,
          .section-title,
          .achievement-value,
          .case-name {
            color: #f9fafb;
          }

          .expert-bio,
          .review-content {
            color: #d1d5db;
          }

          .achievement-item,
          .case-item,
          .review-item {
            background: #374151;
            border-color: #4b5563;
          }

          .type-card {
            background: #374151;
            border-color: #4b5563;
          }

          .type-card.selected {
            background: #1e3a8a;
            border-color: #60a5fa;
          }

          .booking-summary {
            background: #374151;
          }

          .modal-content {
            background: #1f2937;
          }

          .modal-title {
            color: #f9fafb;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpertConsultation;

