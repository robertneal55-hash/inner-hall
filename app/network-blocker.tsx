'use client';

import { useEffect } from 'react';

const ALLOWED_DOMAINS = [
  'supabase.co',
  'dropbox.com',
  'dropboxusercontent.com',
  'youtube.com',
  'ytimg.com',
  'googlevideo.com',
  'localhost',
  '127.0.0.1',
];

const BLOCKED_DOMAINS = [
  'growthbook.io',
  'cdn.growthbook.io',
  'analytics',
  'telemetry',
  'tracking',
  'googletagmanager',
  'google-analytics',
  'fonts.googleapis',
  'fonts.gstatic',
];

const BLOCKED_PATHS = [
  '/api/token',
  '/api/cors',
  '/api/analytics',
];

const isPreviewMode = () => {
  try {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           hostname.includes('netlify') ||
           process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
};

const createMockResponse = (): Response => {
  try {
    return new Response('{}', {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response('{}', {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export function NetworkBlocker() {
  useEffect(() => {
    try {
      if (!isPreviewMode()) {
        return;
      }

      console.log('[Network Blocker] Preview mode - monitoring network calls');

      const originalFetch = window.fetch;

      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        try {
          const url = input.toString();

          const isRelativeUrl = url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
          const isDataUrl = url.startsWith('data:') || url.startsWith('blob:');
          const isAllowed = ALLOWED_DOMAINS.some(domain => url.includes(domain));
          const isBlocked = BLOCKED_DOMAINS.some(domain => url.includes(domain)) ||
                           BLOCKED_PATHS.some(path => url.includes(path));

          if (isBlocked) {
            console.log('[Network Blocker] Blocked:', url);
            return Promise.resolve(createMockResponse());
          }

          if (!isRelativeUrl && !isDataUrl && !isAllowed) {
            console.log('[Network Blocker] Non-whitelisted:', url);
            return Promise.resolve(createMockResponse());
          }

          return originalFetch.call(window, input, init);
        } catch (error) {
          console.log('[Network Blocker] Fetch error, returning mock response');
          return Promise.resolve(createMockResponse());
        }
      };

      const originalXHROpen = XMLHttpRequest.prototype.open;
      const originalXHRSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function(
        method: string,
        url: string | URL,
        async?: boolean,
        username?: string | null,
        password?: string | null
      ) {
        try {
          const urlStr = url.toString();

          const isRelativeUrl = urlStr.startsWith('/') || urlStr.startsWith('./') || urlStr.startsWith('../');
          const isDataUrl = urlStr.startsWith('data:') || urlStr.startsWith('blob:');
          const isAllowed = ALLOWED_DOMAINS.some(domain => urlStr.includes(domain));
          const isBlocked = BLOCKED_DOMAINS.some(domain => urlStr.includes(domain)) ||
                           BLOCKED_PATHS.some(path => urlStr.includes(path));

          if (isBlocked || (!isRelativeUrl && !isDataUrl && !isAllowed)) {
            console.log('[Network Blocker] XHR blocked:', urlStr);

            (this as any).__blocked = true;

            return originalXHROpen.call(this, method, 'data:application/json,{}', async ?? true, username, password);
          }

          return originalXHROpen.call(this, method, url, async ?? true, username, password);
        } catch (error) {
          console.log('[Network Blocker] XHR open error, using data URL');
          (this as any).__blocked = true;
          return originalXHROpen.call(this, method, 'data:application/json,{}', async ?? true, username, password);
        }
      };

      XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
        try {
          if ((this as any).__blocked) {
            setTimeout(() => {
              try {
                Object.defineProperty(this, 'status', { value: 200, writable: false });
                Object.defineProperty(this, 'statusText', { value: 'OK', writable: false });
                Object.defineProperty(this, 'responseText', { value: '{}', writable: false });
                Object.defineProperty(this, 'response', { value: '{}', writable: false });
                Object.defineProperty(this, 'readyState', { value: 4, writable: false });

                const loadEvent = { lengthComputable: true, loaded: 2, total: 2 } as ProgressEvent;
                if (this.onload) this.onload.call(this, loadEvent);
                if (this.onreadystatechange) this.onreadystatechange.call(this, new Event('readystatechange') as any);
              } catch {
                // Silently fail property assignment
              }
            }, 0);
            return;
          }

          return originalXHRSend.call(this, body);
        } catch (error) {
          console.log('[Network Blocker] XHR send error');
          return;
        }
      };

      console.log('[Network Blocker] Active');
    } catch (error) {
      console.log('[Network Blocker] Failed to initialize, app will continue normally');
    }
  }, []);

  return null;
}
