import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 滑动手势Hook
 * 提供完整的滑动手势识别和处理功能
 */
export const useSwipeGesture = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    preventDefaultTouchmove = true,
    threshold = 10
  } = options;

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  // 处理触摸开始
  const onTouchStart = useCallback((e) => {
    if (!isSwipeEnabled) return;
    
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setTouchStartTime(Date.now());
  }, [isSwipeEnabled]);

  // 处理触摸移动
  const onTouchMove = useCallback((e) => {
    if (!isSwipeEnabled || !touchStart) return;
    
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });

    // 阻止默认滚动行为（可选）
    if (preventDefaultTouchmove) {
      const deltaX = Math.abs(e.targetTouches[0].clientX - touchStart.x);
      const deltaY = Math.abs(e.targetTouches[0].clientY - touchStart.y);
      
      // 如果水平滑动距离大于垂直滑动距离，阻止垂直滚动
      if (deltaX > deltaY && deltaX > threshold) {
        e.preventDefault();
      }
    }
  }, [isSwipeEnabled, touchStart, preventDefaultTouchmove, threshold]);

  // 处理触摸结束
  const onTouchEnd = useCallback(() => {
    if (!isSwipeEnabled || !touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const deltaTime = Date.now() - touchStartTime;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // 检查是否满足滑动条件
    if (deltaTime > maxSwipeTime) return;
    
    // 水平滑动
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      if (deltaX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
    
    // 垂直滑动
    if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
      if (deltaY > 0) {
        onSwipeUp?.();
      } else {
        onSwipeDown?.();
      }
    }
  }, [
    isSwipeEnabled,
    touchStart,
    touchEnd,
    touchStartTime,
    minSwipeDistance,
    maxSwipeTime,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  ]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setIsSwipeEnabled,
    isSwipeEnabled
  };
};

/**
 * 卡片滑动Hook
 * 专门用于卡片滑动浏览功能
 */
export const useCardSwipe = (items, options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    loop = false,
    autoPlay = false,
    autoPlayInterval = 3000
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef(null);

  // 下一张卡片
  const nextCard = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      if (newIndex >= items.length) {
        return loop ? 0 : prevIndex;
      }
      return newIndex;
    });
    
    setTimeout(() => setIsAnimating(false), 300);
    onSwipeLeft?.(currentIndex);
  }, [isAnimating, items.length, loop, currentIndex, onSwipeLeft]);

  // 上一张卡片
  const prevCard = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      if (newIndex < 0) {
        return loop ? items.length - 1 : prevIndex;
      }
      return newIndex;
    });
    
    setTimeout(() => setIsAnimating(false), 300);
    onSwipeRight?.(currentIndex);
  }, [isAnimating, items.length, loop, currentIndex, onSwipeRight]);

  // 跳转到指定卡片
  const goToCard = useCallback((index) => {
    if (isAnimating || index < 0 || index >= items.length) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating, items.length]);

  // 滑动手势处理
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: nextCard,
    onSwipeRight: prevCard,
    minSwipeDistance: 50
  });

  // 自动播放
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      autoPlayRef.current = setInterval(nextCard, autoPlayInterval);
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, nextCard, items.length]);

  // 暂停自动播放
  const pauseAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // 恢复自动播放
  const resumeAutoPlay = useCallback(() => {
    if (autoPlay && items.length > 1 && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(nextCard, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval, nextCard, items.length]);

  return {
    currentIndex,
    isAnimating,
    nextCard,
    prevCard,
    goToCard,
    swipeHandlers,
    pauseAutoPlay,
    resumeAutoPlay,
    canGoNext: currentIndex < items.length - 1 || loop,
    canGoPrev: currentIndex > 0 || loop
  };
};

/**
 * 长按手势Hook
 * 提供长按手势识别功能
 */
export const useLongPress = (callback, options = {}) => {
  const {
    threshold = 500,
    onStart,
    onFinish,
    onCancel
  } = options;

  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeout = useRef();
  const prevent = useRef(false);

  const start = useCallback((event) => {
    prevent.current = false;
    timeout.current = setTimeout(() => {
      callback(event);
      setIsLongPressing(true);
      onStart?.(event);
    }, threshold);
  }, [callback, threshold, onStart]);

  const clear = useCallback((event, shouldTriggerOnFinish = true) => {
    timeout.current && clearTimeout(timeout.current);
    shouldTriggerOnFinish && isLongPressing && onFinish?.(event);
    setIsLongPressing(false);
    prevent.current = true;
  }, [isLongPressing, onFinish]);

  const cancel = useCallback((event) => {
    timeout.current && clearTimeout(timeout.current);
    setIsLongPressing(false);
    onCancel?.(event);
  }, [onCancel]);

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
    onTouchCancel: (e) => cancel(e),
    isLongPressing
  };
};

/**
 * 双击手势Hook
 * 提供双击手势识别功能
 */
export const useDoubleClick = (callback, options = {}) => {
  const {
    threshold = 300,
    preventDefault = true
  } = options;

  const [clickCount, setClickCount] = useState(0);
  const timeout = useRef();

  const handleClick = useCallback((event) => {
    if (preventDefault) {
      event.preventDefault();
    }

    setClickCount(prev => prev + 1);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      if (clickCount === 1) {
        // 双击触发
        callback(event);
      }
      setClickCount(0);
    }, threshold);
  }, [callback, threshold, preventDefault, clickCount]);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return {
    onClick: handleClick
  };
};

/**
 * 捏合缩放手势Hook
 * 提供双指缩放功能
 */
export const usePinchZoom = (options = {}) => {
  const {
    minScale = 0.5,
    maxScale = 3,
    onZoomStart,
    onZoomEnd,
    onZoom
  } = options;

  const [scale, setScale] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const lastDistance = useRef(0);
  const lastScale = useRef(1);

  // 计算两点间距离
  const getDistance = useCallback((touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      setIsZooming(true);
      lastDistance.current = getDistance(e.touches);
      lastScale.current = scale;
      onZoomStart?.(scale);
    }
  }, [scale, getDistance, onZoomStart]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && isZooming) {
      e.preventDefault();
      
      const distance = getDistance(e.touches);
      const scaleChange = distance / lastDistance.current;
      const newScale = Math.min(Math.max(lastScale.current * scaleChange, minScale), maxScale);
      
      setScale(newScale);
      onZoom?.(newScale);
    }
  }, [isZooming, getDistance, minScale, maxScale, onZoom]);

  const onTouchEnd = useCallback(() => {
    if (isZooming) {
      setIsZooming(false);
      onZoomEnd?.(scale);
    }
  }, [isZooming, scale, onZoomEnd]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setIsZooming(false);
  }, []);

  return {
    scale,
    isZooming,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetZoom
  };
};

export default useSwipeGesture;

