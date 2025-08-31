import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 移动端懒加载图片组件
 * 提供智能的图片加载优化和占位符功能
 */
const MobileLazyImage = ({
  src,
  alt = '',
  placeholder,
  fallback,
  className = '',
  style = {},
  threshold = 0.1,
  rootMargin = '50px',
  fadeInDuration = 300,
  showLoader = true,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // 创建Intersection Observer
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  // 开始加载图片
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsError(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
      onError?.();
    };
    
    img.src = src;
  }, [isInView, src, onLoad, onError]);

  // 获取图片样式
  const getImageStyle = () => ({
    ...style,
    opacity: isLoaded ? 1 : 0,
    transition: `opacity ${fadeInDuration}ms ease-in-out`,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  });

  // 渲染占位符
  const renderPlaceholder = () => {
    if (placeholder) {
      return typeof placeholder === 'string' ? (
        <img src={placeholder} alt={alt} style={getImageStyle()} />
      ) : (
        placeholder
      );
    }

    return (
      <div className="lazy-image-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🖼️</div>
          {showLoader && <div className="placeholder-loader"></div>}
        </div>
      </div>
    );
  };

  // 渲染错误状态
  const renderError = () => {
    if (fallback) {
      return typeof fallback === 'string' ? (
        <img src={fallback} alt={alt} style={getImageStyle()} />
      ) : (
        fallback
      );
    }

    return (
      <div className="lazy-image-error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <p className="error-text">图片加载失败</p>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={imgRef}
      className={`mobile-lazy-image ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        ...style
      }}
      {...props}
    >
      {/* 占位符 */}
      {!isLoaded && !isError && renderPlaceholder()}
      
      {/* 错误状态 */}
      {isError && renderError()}
      
      {/* 实际图片 */}
      {imageSrc && !isError && (
        <img
          src={imageSrc}
          alt={alt}
          style={getImageStyle()}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            setIsError(true);
            onError?.();
          }}
        />
      )}

      <style jsx>{`
        .mobile-lazy-image {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
        }

        .lazy-image-placeholder,
        .lazy-image-error {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .placeholder-content,
        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6b7280;
        }

        .placeholder-icon,
        .error-icon {
          font-size: 32px;
          opacity: 0.5;
        }

        .placeholder-loader {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: lazy-image-spin 1s linear infinite;
        }

        .error-text {
          font-size: 12px;
          margin: 0;
          text-align: center;
        }

        @keyframes lazy-image-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端图片网格组件
 * 专门用于图片网格展示的懒加载
 */
export const MobileImageGrid = ({ 
  images = [], 
  columns = 2, 
  gap = 8,
  aspectRatio = '1/1',
  onImageClick,
  className = '',
  ...props 
}) => {
  const handleImageClick = useCallback((image, index) => {
    onImageClick?.(image, index);
  }, [onImageClick]);

  return (
    <div 
      className={`mobile-image-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        ...props.style
      }}
      {...props}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="grid-item"
          style={{
            aspectRatio,
            cursor: onImageClick ? 'pointer' : 'default'
          }}
          onClick={() => handleImageClick(image, index)}
        >
          <MobileLazyImage
            src={image.src || image}
            alt={image.alt || `图片 ${index + 1}`}
            placeholder={image.placeholder}
            fallback={image.fallback}
            style={{
              borderRadius: '8px',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      ))}

      <style jsx>{`
        .mobile-image-grid {
          width: 100%;
        }

        .grid-item {
          overflow: hidden;
          border-radius: 8px;
          transition: transform 0.2s ease;
        }

        .grid-item:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端头像组件
 * 专门用于用户头像的懒加载展示
 */
export const MobileAvatar = ({
  src,
  name = '',
  size = 40,
  shape = 'circle', // circle, square, rounded
  showOnlineStatus = false,
  isOnline = false,
  className = '',
  ...props
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getShapeStyle = () => {
    switch (shape) {
      case 'circle':
        return { borderRadius: '50%' };
      case 'square':
        return { borderRadius: '0' };
      case 'rounded':
        return { borderRadius: '8px' };
      default:
        return { borderRadius: '50%' };
    }
  };

  const fallbackElement = (
    <div className="avatar-fallback">
      {name ? getInitials(name) : '👤'}
    </div>
  );

  return (
    <div 
      className={`mobile-avatar ${className}`}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        ...getShapeStyle()
      }}
      {...props}
    >
      <MobileLazyImage
        src={src}
        alt={name || '用户头像'}
        fallback={fallbackElement}
        style={{
          ...getShapeStyle(),
          width: '100%',
          height: '100%'
        }}
        showLoader={false}
      />
      
      {showOnlineStatus && (
        <div 
          className={`online-status ${isOnline ? 'online' : 'offline'}`}
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: `${Math.max(size * 0.25, 8)}px`,
            height: `${Math.max(size * 0.25, 8)}px`,
            borderRadius: '50%',
            border: '2px solid white',
            backgroundColor: isOnline ? '#10b981' : '#6b7280'
          }}
        />
      )}

      <style jsx>{`
        .mobile-avatar {
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          font-size: ${size > 40 ? '16px' : '12px'};
        }

        .online-status {
          box-shadow: 0 0 0 2px white;
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端图片预览组件
 * 专门用于图片的全屏预览功能
 */
export const MobileImagePreview = ({
  images = [],
  currentIndex = 0,
  visible = false,
  onClose,
  onIndexChange,
  showThumbnails = true,
  className = '',
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  
  const containerRef = useRef(null);

  // 同步外部索引
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // 处理索引变化
  const handleIndexChange = useCallback((newIndex) => {
    setActiveIndex(newIndex);
    setScale(1);
    setIsZoomed(false);
    onIndexChange?.(newIndex);
  }, [onIndexChange]);

  // 处理双击缩放
  const handleDoubleClick = useCallback(() => {
    if (isZoomed) {
      setScale(1);
      setIsZoomed(false);
    } else {
      setScale(2);
      setIsZoomed(true);
    }
  }, [isZoomed]);

  // 处理关闭
  const handleClose = useCallback(() => {
    setScale(1);
    setIsZoomed(false);
    onClose?.();
  }, [onClose]);

  if (!visible) return null;

  const currentImage = images[activeIndex];

  return (
    <div 
      className={`mobile-image-preview ${className}`}
      ref={containerRef}
      {...props}
    >
      {/* 遮罩层 */}
      <div className="preview-overlay" onClick={handleClose} />
      
      {/* 关闭按钮 */}
      <button className="preview-close" onClick={handleClose}>
        ✕
      </button>
      
      {/* 图片容器 */}
      <div className="preview-container">
        <div 
          className="preview-image-wrapper"
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease'
          }}
          onDoubleClick={handleDoubleClick}
        >
          <MobileLazyImage
            src={currentImage?.src || currentImage}
            alt={currentImage?.alt || `图片 ${activeIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
      
      {/* 导航按钮 */}
      {images.length > 1 && (
        <>
          <button 
            className="preview-nav prev"
            onClick={() => handleIndexChange(
              activeIndex > 0 ? activeIndex - 1 : images.length - 1
            )}
          >
            ‹
          </button>
          <button 
            className="preview-nav next"
            onClick={() => handleIndexChange(
              activeIndex < images.length - 1 ? activeIndex + 1 : 0
            )}
          >
            ›
          </button>
        </>
      )}
      
      {/* 缩略图 */}
      {showThumbnails && images.length > 1 && (
        <div className="preview-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleIndexChange(index)}
            >
              <MobileLazyImage
                src={image.src || image}
                alt={`缩略图 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </button>
          ))}
        </div>
      )}
      
      {/* 图片信息 */}
      <div className="preview-info">
        <span>{activeIndex + 1} / {images.length}</span>
        {currentImage?.caption && (
          <p>{currentImage.caption}</p>
        )}
      </div>

      <style jsx>{`
        .mobile-image-preview {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
        }

        .preview-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 18px;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s ease;
        }

        .preview-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .preview-container {
          position: relative;
          max-width: 90%;
          max-height: 90%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .preview-image-wrapper {
          cursor: zoom-in;
        }

        .preview-image-wrapper[style*="scale(2)"] {
          cursor: zoom-out;
        }

        .preview-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s ease;
        }

        .preview-nav:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .preview-nav.prev {
          left: 20px;
        }

        .preview-nav.next {
          right: 20px;
        }

        .preview-thumbnails {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          max-width: 90%;
          overflow-x: auto;
          z-index: 10;
        }

        .thumbnail {
          flex: 0 0 60px;
          height: 40px;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          background: none;
          padding: 0;
          transition: border-color 0.2s ease;
        }

        .thumbnail.active {
          border-color: #3b82f6;
        }

        .preview-info {
          position: absolute;
          top: 20px;
          left: 20px;
          color: white;
          z-index: 10;
        }

        .preview-info span {
          font-size: 14px;
          font-weight: 500;
        }

        .preview-info p {
          margin: 8px 0 0 0;
          font-size: 12px;
          opacity: 0.8;
          max-width: 200px;
        }

        /* 移动端优化 */
        @media (max-width: 768px) {
          .preview-nav {
            display: none;
          }
          
          .preview-thumbnails {
            bottom: 10px;
            max-width: 95%;
          }
          
          .thumbnail {
            flex: 0 0 50px;
            height: 35px;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileLazyImage;

