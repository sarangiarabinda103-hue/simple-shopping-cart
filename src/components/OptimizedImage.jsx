import { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ src, alt, className, placeholder = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={`optimized-image-container ${className}`}>
      {isInView && (
        <>
          {!isLoaded && placeholder && (
            <div className="image-placeholder">
              <div className="placeholder-shimmer"></div>
            </div>
          )}
          {hasError ? (
            <div className="image-error">
              <span>Image not available</span>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
              onLoad={handleLoad}
              onError={handleError}
              loading="lazy"
              decoding="async"
            />
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedImage;
