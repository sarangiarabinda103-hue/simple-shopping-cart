import { useState, useEffect, useRef, useCallback } from 'react';

const VirtualizedProductList = ({ products, renderItem, itemHeight = 400, containerHeight = 800 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: containerHeight });
  const containerRef = useRef(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerSize.height / itemHeight) + 1,
    products.length
  );

  const visibleProducts = products.slice(visibleStart, visibleEnd);
  const totalHeight = products.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || containerHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [containerHeight]);

  return (
    <div
      ref={containerRef}
      className="virtualized-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleProducts.map((product, index) => 
            renderItem(product, visibleStart + index)
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedProductList;
