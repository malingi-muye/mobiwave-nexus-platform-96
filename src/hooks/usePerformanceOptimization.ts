
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Cache management utilities
export const useCacheOptimization = () => {
  const queryClient = useQueryClient();

  const clearStaleCache = () => {
    queryClient.removeQueries({
      predicate: (query) => {
        const now = Date.now();
        const staleTime = query.options.staleTime || 0;
        const dataUpdatedAt = query.state.dataUpdatedAt;
        return now - dataUpdatedAt > staleTime + 300000; // 5 minutes buffer
      }
    });
  };

  const prefetchKey = (key: string[], fetcher: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: fetcher,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const optimizeMemoryUsage = () => {
    queryClient.setQueryDefaults(['campaigns'], {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
    
    queryClient.setQueryDefaults(['surveys'], {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

    queryClient.setQueryDefaults(['contacts'], {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  useEffect(() => {
    optimizeMemoryUsage();
    
    const interval = setInterval(clearStaleCache, 600000); // Every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return {
    clearStaleCache,
    prefetchKey,
    optimizeMemoryUsage
  };
};

// Performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0
  });

  const measurePageLoad = () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime)
      }));
    }
  };

  const measureRenderTime = (componentName: string, startTime: number) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(renderTime)
    }));
  };

  const getMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage
      }));
    }
  };

  useEffect(() => {
    measurePageLoad();
    getMemoryUsage();
    
    const interval = setInterval(getMemoryUsage, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    measurePageLoad,
    measureRenderTime,
    getMemoryUsage
  };
};

// Image optimization
export const useImageOptimization = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const createObserver = (element: HTMLElement, src: string) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setImageSrc(src);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return observer;
  };

  return {
    isIntersecting,
    imageSrc,
    createObserver
  };
};
