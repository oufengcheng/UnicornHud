import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * 移动端虚拟滚动列表组件
 * 用于大数据量列表的性能优化
 */
const MobileVirtualList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  onScroll,
  className = '',
  style = {},
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // 计算可见区域
  const visibleRange = useMemo(() => {
    const visibleHeight = containerHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + visibleHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  // 计算虚拟列表的总高度
  const totalHeight = items.length * itemHeight;

  // 计算可见项目
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const result = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({
          index: i,
          data: items[i],
          style: {
            position: 'absolute',
            top: i * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          }
        });
      }
    }
    
    return result;
  }, [items, visibleRange, itemHeight]);

  // 处理滚动事件
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);
    
    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // 设置滚动结束标志
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    
    onScroll?.(e, newScrollTop);
  }, [onScroll]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 滚动到指定索引
  const scrollToIndex = useCallback((index) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight;
      containerRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  }, [itemHeight]);

  // 滚动到指定位置
  const scrollToOffset = useCallback((offset) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = offset;
      setScrollTop(offset);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mobile-virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        ...style
      }}
      onScroll={handleScroll}
      {...props}
    >
      {/* 虚拟容器 */}
      <div
        className="virtual-container"
        style={{
          height: totalHeight,
          position: 'relative'
        }}
      >
        {/* 渲染可见项目 */}
        {visibleItems.map(({ index, data, style: itemStyle }) => (
          <div
            key={index}
            className="virtual-item"
            style={itemStyle}
          >
            {renderItem ? renderItem(data, index, isScrolling) : (
              <div className="default-item">
                {typeof data === 'string' ? data : JSON.stringify(data)}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mobile-virtual-list {
          -webkit-overflow-scrolling: touch;
          will-change: scroll-position;
        }

        .virtual-container {
          width: 100%;
        }

        .virtual-item {
          will-change: transform;
        }

        .default-item {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: white;
          display: flex;
          align-items: center;
          height: 100%;
          box-sizing: border-box;
        }

        /* 隐藏滚动条 */
        .mobile-virtual-list::-webkit-scrollbar {
          display: none;
        }

        .mobile-virtual-list {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端虚拟网格组件
 * 用于大数据量网格的性能优化
 */
export const MobileVirtualGrid = ({
  items = [],
  itemWidth = 100,
  itemHeight = 100,
  columns = 2,
  gap = 8,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  onScroll,
  className = '',
  style = {},
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // 计算行数
  const rowCount = Math.ceil(items.length / columns);
  const rowHeight = itemHeight + gap;

  // 计算可见区域
  const visibleRange = useMemo(() => {
    const visibleHeight = containerHeight;
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endRow = Math.min(
      rowCount - 1,
      Math.floor((scrollTop + visibleHeight) / rowHeight) + overscan
    );
    
    return { startRow, endRow };
  }, [scrollTop, containerHeight, rowHeight, rowCount, overscan]);

  // 计算虚拟网格的总高度
  const totalHeight = rowCount * rowHeight;

  // 计算可见项目
  const visibleItems = useMemo(() => {
    const { startRow, endRow } = visibleRange;
    const result = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < items.length) {
          result.push({
            index,
            row,
            col,
            data: items[index],
            style: {
              position: 'absolute',
              top: row * rowHeight,
              left: col * (itemWidth + gap),
              width: itemWidth,
              height: itemHeight,
            }
          });
        }
      }
    }
    
    return result;
  }, [items, visibleRange, columns, itemWidth, itemHeight, gap, rowHeight]);

  // 处理滚动事件
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    
    onScroll?.(e, newScrollTop);
  }, [onScroll]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mobile-virtual-grid ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        ...style
      }}
      onScroll={handleScroll}
      {...props}
    >
      {/* 虚拟容器 */}
      <div
        className="virtual-grid-container"
        style={{
          height: totalHeight,
          position: 'relative',
          width: columns * itemWidth + (columns - 1) * gap
        }}
      >
        {/* 渲染可见项目 */}
        {visibleItems.map(({ index, row, col, data, style: itemStyle }) => (
          <div
            key={index}
            className="virtual-grid-item"
            style={itemStyle}
          >
            {renderItem ? renderItem(data, index, { row, col }, isScrolling) : (
              <div className="default-grid-item">
                {typeof data === 'string' ? data : `Item ${index}`}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mobile-virtual-grid {
          -webkit-overflow-scrolling: touch;
          will-change: scroll-position;
        }

        .virtual-grid-container {
          margin: 0 auto;
        }

        .virtual-grid-item {
          will-change: transform;
        }

        .default-grid-item {
          width: 100%;
          height: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #6b7280;
          box-sizing: border-box;
        }

        /* 隐藏滚动条 */
        .mobile-virtual-grid::-webkit-scrollbar {
          display: none;
        }

        .mobile-virtual-grid {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端无限滚动虚拟列表
 * 结合虚拟滚动和无限加载的高性能列表
 */
export const MobileInfiniteVirtualList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  hasMore = false,
  loading = false,
  onLoadMore,
  loadingText = '加载中...',
  noMoreText = '没有更多了',
  threshold = 200,
  className = '',
  ...props
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 处理滚动事件，检测是否需要加载更多
  const handleScroll = useCallback((e, scrollTop) => {
    if (!hasMore || loading || isLoadingMore) return;
    
    const { scrollHeight, clientHeight } = e.target;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    
    if (scrollBottom <= threshold) {
      setIsLoadingMore(true);
      onLoadMore?.().finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [hasMore, loading, isLoadingMore, onLoadMore, threshold]);

  // 创建包含加载指示器的项目列表
  const itemsWithLoader = useMemo(() => {
    const result = [...items];
    
    if (hasMore || isLoadingMore) {
      result.push({
        type: 'loader',
        isLoading: isLoadingMore,
        text: isLoadingMore ? loadingText : noMoreText
      });
    }
    
    return result;
  }, [items, hasMore, isLoadingMore, loadingText, noMoreText]);

  // 渲染项目
  const renderItemWithLoader = useCallback((item, index, isScrolling) => {
    if (item.type === 'loader') {
      return (
        <div className="infinite-loader">
          {item.isLoading ? (
            <>
              <div className="loader-spinner"></div>
              <span>{item.text}</span>
            </>
          ) : (
            <span>{item.text}</span>
          )}
        </div>
      );
    }
    
    return renderItem ? renderItem(item, index, isScrolling) : (
      <div className="default-infinite-item">
        {typeof item === 'string' ? item : JSON.stringify(item)}
      </div>
    );
  }, [renderItem]);

  return (
    <div className={`mobile-infinite-virtual-list ${className}`}>
      <MobileVirtualList
        items={itemsWithLoader}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={renderItemWithLoader}
        onScroll={handleScroll}
        {...props}
      />

      <style jsx>{`
        .mobile-infinite-virtual-list {
          height: 100%;
        }

        .infinite-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
          background: #f8fafc;
        }

        .loader-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: infinite-spin 1s linear infinite;
        }

        .default-infinite-item {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: white;
          display: flex;
          align-items: center;
          height: 100%;
          box-sizing: border-box;
        }

        @keyframes infinite-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * 移动端聊天消息虚拟列表
 * 专门用于聊天消息的虚拟滚动优化
 */
export const MobileChatVirtualList = ({
  messages = [],
  renderMessage,
  containerHeight = 400,
  autoScroll = true,
  onScroll,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(autoScroll);
  
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  // 计算消息高度（动态高度）
  const getMessageHeight = useCallback((message, index) => {
    // 根据消息内容估算高度
    const baseHeight = 60;
    const textLength = message.text?.length || 0;
    const extraHeight = Math.ceil(textLength / 50) * 20;
    
    return Math.max(baseHeight, baseHeight + extraHeight);
  }, []);

  // 计算累积高度
  const cumulativeHeights = useMemo(() => {
    const heights = [0];
    let totalHeight = 0;
    
    messages.forEach((message, index) => {
      const height = getMessageHeight(message, index);
      totalHeight += height;
      heights.push(totalHeight);
    });
    
    return heights;
  }, [messages, getMessageHeight]);

  // 计算可见区域
  const visibleRange = useMemo(() => {
    const visibleHeight = containerHeight;
    const overscan = 3;
    
    let startIndex = 0;
    let endIndex = messages.length - 1;
    
    // 找到开始索引
    for (let i = 0; i < cumulativeHeights.length - 1; i++) {
      if (cumulativeHeights[i + 1] > scrollTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
    }
    
    // 找到结束索引
    for (let i = startIndex; i < cumulativeHeights.length - 1; i++) {
      if (cumulativeHeights[i] > scrollTop + visibleHeight) {
        endIndex = Math.min(messages.length - 1, i + overscan);
        break;
      }
    }
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, messages.length, cumulativeHeights]);

  // 计算可见消息
  const visibleMessages = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const result = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      if (messages[i]) {
        result.push({
          index: i,
          data: messages[i],
          style: {
            position: 'absolute',
            top: cumulativeHeights[i],
            left: 0,
            right: 0,
            height: getMessageHeight(messages[i], i),
          }
        });
      }
    }
    
    return result;
  }, [messages, visibleRange, cumulativeHeights, getMessageHeight]);

  // 处理滚动事件
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    const { scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - newScrollTop - clientHeight < 10;
    
    setScrollTop(newScrollTop);
    setShouldAutoScroll(isAtBottom);
    
    onScroll?.(e, newScrollTop, isAtBottom);
  }, [onScroll]);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, []);

  // 新消息时自动滚动
  useEffect(() => {
    if (messages.length > prevMessagesLength.current && shouldAutoScroll) {
      setTimeout(scrollToBottom, 0);
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length, shouldAutoScroll, scrollToBottom]);

  const totalHeight = cumulativeHeights[cumulativeHeights.length - 1] || 0;

  return (
    <div
      ref={containerRef}
      className={`mobile-chat-virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
      {...props}
    >
      {/* 虚拟容器 */}
      <div
        className="chat-virtual-container"
        style={{
          height: totalHeight,
          position: 'relative'
        }}
      >
        {/* 渲染可见消息 */}
        {visibleMessages.map(({ index, data, style: messageStyle }) => (
          <div
            key={data.id || index}
            className="chat-virtual-message"
            style={messageStyle}
          >
            {renderMessage ? renderMessage(data, index) : (
              <div className="default-chat-message">
                <div className="message-content">
                  <strong>{data.sender}:</strong> {data.text}
                </div>
                <div className="message-time">
                  {data.timestamp}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mobile-chat-virtual-list {
          -webkit-overflow-scrolling: touch;
          will-change: scroll-position;
          background: #f8fafc;
        }

        .chat-virtual-container {
          width: 100%;
        }

        .chat-virtual-message {
          will-change: transform;
          padding: 8px 16px;
        }

        .default-chat-message {
          background: white;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message-content {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .message-time {
          font-size: 11px;
          color: #6b7280;
          text-align: right;
        }

        /* 隐藏滚动条 */
        .mobile-chat-virtual-list::-webkit-scrollbar {
          display: none;
        }

        .mobile-chat-virtual-list {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileVirtualList;

