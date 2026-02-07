export const isPreviewMode = () => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV !== 'production';
  }

  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
  const isNetlifyPreview = hostname.includes('netlify.app') || hostname.includes('netlify.live');

  return isLocalhost || isNetlifyPreview || process.env.NODE_ENV !== 'production';
};

export const shouldBlockExternalCalls = () => {
  return isPreviewMode();
};

export const safeExternalFetch = async <T>(
  fetchFn: () => Promise<T>,
  fallbackValue: T,
  timeoutMs: number = 2000
): Promise<T> => {
  if (shouldBlockExternalCalls()) {
    console.warn('[Network Guard] External fetch blocked in preview mode, using fallback');
    return fallbackValue;
  }

  return Promise.race([
    fetchFn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)
    )
  ]).catch((error) => {
    console.warn('[Network Guard] Fetch failed, using fallback:', error);
    return fallbackValue;
  });
};

export const blockExternalScript = (scriptUrl: string): boolean => {
  const blockedDomains = [
    'growthbook.io',
    'cdn.growthbook.io',
    'googletagmanager.com',
    'google-analytics.com',
    'analytics.google.com',
    'doubleclick.net',
    'facebook.net',
  ];

  const shouldBlock = blockedDomains.some(domain => scriptUrl.includes(domain));

  if (shouldBlock && isPreviewMode()) {
    console.warn('[Network Guard] Blocked external script in preview mode:', scriptUrl);
    return true;
  }

  return false;
};
