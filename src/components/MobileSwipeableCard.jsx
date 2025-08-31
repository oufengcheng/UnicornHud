import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCardSwipe } from '../hooks/useSwipeGesture';

/**
 * 移动端滑动卡片组件
 * 提供原生应用级别的卡片滑动体验
 */
const MobileSwipeableCard = ({ 
  items = [], 
  renderCard, 
  onCardChange,
  showIndicators = true,
  showNavigation = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  className = '',
  ...props 
}) => {
  const {
    currentIndex,
    isAnimating,
    nextCard,
    prevCard,
    goToCard,
    swipeHandlers,
    pauseAutoPlay,
    resumeAutoPlay,
    canGoNext,
    canGoPrev
  } = useCardSwipe(items, {
    onSwipeLeft: (index) => onCardChange?.(index + 1),
    onSwipeRight: (index) => onCardChange?.(index - 1),
    loop: true,
    autoPlay,
    autoPlayInterval
  });

  const containerRef = useRef(null);

  // 处理卡片变化
  useEffect(() => {
    onCardChange?.(currentIndex);
  }, [currentIndex, onCardChange]);

  // 渲染指示器
  const renderIndicators = () => {
    if (!showIndicators || items.length <= 1) return null;

    return (
      <div className="mobile-card-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            className={`mobile-card-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToCard(index)}
            aria-label={`跳转到第${index + 1}张卡片`}
          />
        ))}
      </div>
    );
  };

  // 渲染导航按钮
  const renderNavigation = () => {
    if (!showNavigation || items.length <= 1) return null;

    return (
      <>
        <button
          className={`mobile-card-nav mobile-card-nav-prev ${!canGoPrev ? 'disabled' : ''}`}
          onClick={prevCard}
          disabled={!canGoPrev}
          aria-label="上一张卡片"
        >
          <span>‹</span>
        </button>
        <button
          className={`mobile-card-nav mobile-card-nav-next ${!canGoNext ? 'disabled' : ''}`}
          onClick={nextCard}
          disabled={!canGoNext}
          aria-label="下一张卡片"
        >
          <span>›</span>
        </button>
      </>
    );
  };

  if (!items.length) {
    return (
      <div className="mobile-card-empty">
        <p>暂无内容</p>
      </div>
    );
  }

  return (
    <div 
      className={`mobile-swipeable-card ${className}`}
      ref={containerRef}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      {...swipeHandlers}
      {...props}
    >
      {/* 卡片容器 */}
      <div className="mobile-card-container">
        <div 
          className="mobile-card-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`mobile-card-item ${index === currentIndex ? 'active' : ''}`}
            >
              {renderCard ? renderCard(item, index, currentIndex) : (
                <div className="mobile-card-default">
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 导航按钮 */}
      {renderNavigation()}

      {/* 指示器 */}
      {renderIndicators()}

      {/* 卡片信息 */}
      <div className="mobile-card-info">
        <span className="mobile-card-counter">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      <style jsx>{`
        .mobile-swipeable-card {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          border-radius: 12px;
          background: #f8fafc;
          user-select: none;
          -webkit-user-select: none;
          touch-action: pan-y;
        }

        .mobile-card-container {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .mobile-card-track {
          display: flex;
          width: ${items.length * 100}%;
          height: 100%;
          will-change: transform;
        }

        .mobile-card-item {
          flex: 0 0 ${100 / items.length}%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .mobile-card-default {
          padding: 20px;
          text-align: center;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          width: 90%;
          height: 80%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-card-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          color: #374151;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .mobile-card-nav:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .mobile-card-nav:active {
          transform: translateY(-50%) scale(0.95);
        }

        .mobile-card-nav.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        .mobile-card-nav-prev {
          left: 10px;
        }

        .mobile-card-nav-next {
          right: 10px;
        }

        .mobile-card-indicators {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .mobile-card-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-card-indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .mobile-card-indicator:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .mobile-card-info {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          z-index: 10;
        }

        .mobile-card-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #6b7280;
          font-size: 16px;
        }

        /* 移动端优化 */
        @media (max-width: 768px) {
          .mobile-card-nav {
            display: none;
          }
          
          .mobile-swipeable-card {
            height: 250px;
          }
          
          .mobile-card-info {
            top: 10px;
            right: 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * 项目卡片滑动组件
 * 专门用于项目展示的滑动卡片
 */
export const MobileProjectCard = ({ projects = [] }) => {
  const renderProjectCard = useCallback((project, index, currentIndex) => {
    const isActive = index === currentIndex;
    
    return (
      <div className={`project-card ${isActive ? 'active' : ''}`}>
        <div className="project-header">
          <div className="project-logo">
            {project.logo || '🦄'}
          </div>
          <div className="project-info">
            <h3 className="project-name">{project.name}</h3>
            <p className="project-stage">{project.stage}</p>
          </div>
          <div className="project-valuation">
            ${project.valuation}
          </div>
        </div>
        
        <div className="project-description">
          <p>{project.description}</p>
        </div>
        
        <div className="project-tags">
          {project.tags?.map((tag, tagIndex) => (
            <span key={tagIndex} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="project-actions">
          <button className="project-action-btn primary">
            📋 查看详情
          </button>
          <button className="project-action-btn secondary">
            💰 投资意向
          </button>
        </div>
        
        <style jsx>{`
          .project-card {
            background: white;
            border-radius: 16px;
            padding: 20px;
            margin: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            height: calc(100% - 20px);
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            transform: ${isActive ? 'scale(1)' : 'scale(0.95)'};
            opacity: ${isActive ? 1 : 0.7};
          }
          
          .project-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }
          
          .project-logo {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
          }
          
          .project-info {
            flex: 1;
          }
          
          .project-name {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 4px 0;
          }
          
          .project-stage {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }
          
          .project-valuation {
            font-size: 16px;
            font-weight: 700;
            color: #059669;
            background: #ecfdf5;
            padding: 6px 12px;
            border-radius: 8px;
          }
          
          .project-description {
            flex: 1;
            margin-bottom: 16px;
          }
          
          .project-description p {
            color: #4b5563;
            line-height: 1.5;
            margin: 0;
            font-size: 14px;
          }
          
          .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
          }
          
          .project-tag {
            background: #f3f4f6;
            color: #374151;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .project-actions {
            display: flex;
            gap: 12px;
          }
          
          .project-action-btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .project-action-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .project-action-btn.secondary {
            background: #f8fafc;
            color: #374151;
            border: 1px solid #e5e7eb;
          }
          
          .project-action-btn:active {
            transform: scale(0.95);
          }
        `}</style>
      </div>
    );
  }, []);

  return (
    <MobileSwipeableCard
      items={projects}
      renderCard={renderProjectCard}
      showIndicators={true}
      showNavigation={false}
      autoPlay={false}
      className="mobile-project-cards"
    />
  );
};

/**
 * 图片轮播组件
 * 专门用于图片展示的滑动组件
 */
export const MobileImageCarousel = ({ 
  images = [], 
  aspectRatio = '16/9',
  showThumbnails = false 
}) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const renderImageCard = useCallback((image, index) => {
    return (
      <div className="image-card">
        <img 
          src={image.url || image} 
          alt={image.alt || `图片 ${index + 1}`}
          className="carousel-image"
        />
        {image.caption && (
          <div className="image-caption">
            {image.caption}
          </div>
        )}
        
        <style jsx>{`
          .image-card {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
          
          .image-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            color: white;
            padding: 20px 15px 15px;
            font-size: 14px;
            border-radius: 0 0 8px 8px;
          }
        `}</style>
      </div>
    );
  }, []);

  const handleCardChange = useCallback((index) => {
    setSelectedThumbnail(index);
  }, []);

  return (
    <div className="mobile-image-carousel">
      <MobileSwipeableCard
        items={images}
        renderCard={renderImageCard}
        onCardChange={handleCardChange}
        showIndicators={!showThumbnails}
        showNavigation={true}
        autoPlay={true}
        autoPlayInterval={4000}
        style={{ aspectRatio }}
      />
      
      {showThumbnails && images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === selectedThumbnail ? 'active' : ''}`}
              onClick={() => setSelectedThumbnail(index)}
            >
              <img 
                src={image.url || image} 
                alt={`缩略图 ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .mobile-image-carousel {
          width: 100%;
        }
        
        .carousel-thumbnails {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          overflow-x: auto;
          padding: 8px 0;
        }
        
        .thumbnail {
          flex: 0 0 60px;
          height: 40px;
          border: 2px solid transparent;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          background: none;
          padding: 0;
        }
        
        .thumbnail.active {
          border-color: #3b82f6;
        }
        
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .thumbnail:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default MobileSwipeableCard;

