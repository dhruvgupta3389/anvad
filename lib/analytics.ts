// Analytics and performance monitoring utilities

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  // Google Analytics 4 event tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, eventData);
  }
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'INR',
    items: items
  });
};

export const trackProductView = (productId: string, productName: string, category: string, price: number) => {
  trackEvent('view_item', {
    item_id: productId,
    item_name: productName,
    item_category: category,
    price: price,
    currency: 'INR'
  });
};

export const trackAddToCart = (productId: string, productName: string, quantity: number, price: number) => {
  trackEvent('add_to_cart', {
    item_id: productId,
    item_name: productName,
    quantity: quantity,
    price: price,
    currency: 'INR'
  });
};

export const trackSearchQuery = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

// Page load performance
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('Web Vitals:', metric);
  }
};
