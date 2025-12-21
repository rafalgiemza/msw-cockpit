/**
 * Check if the browser supports all required features
 * Returns true if all features are supported
 */
export function checkBrowserSupport(): boolean {
  const requirements = [
    'attachShadow' in Element.prototype,
    'CSSStyleSheet' in window,
    'adoptedStyleSheets' in (ShadowRoot.prototype as any),
    'URLSearchParams' in window,
    'Map' in window,
    'Set' in window,
  ];

  return requirements.every(Boolean);
}

/**
 * Get browser name for better error messages
 */
export function getBrowserName(): string {
  const ua = navigator.userAgent;

  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Edge') > -1) return 'Edge';

  return 'Unknown';
}
