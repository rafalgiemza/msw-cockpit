import type { MockControlsConfig, MockControlsInstance } from './core/types.js';
import { ENABLE_FLAG_KEY } from './core/constants.js';
import { normalizeConfig } from './core/config.js';
import { MockController } from './core/controller.js';
import { checkBrowserSupport, getBrowserName } from './utils/dom.js';
import { warn, error } from './utils/logger.js';

/**
 * Check if the controls are enabled via localStorage flag
 */
function isEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLE_FLAG_KEY) === 'true';
  } catch {
    // localStorage blocked or not available
    return false;
  }
}

/**
 * Enable MSW Demo Controls UI overlay
 *
 * @param config - Configuration object (optional, supports zero-config)
 * @returns MockControlsInstance or null if not enabled/supported
 *
 * @example
 * ```typescript
 * // Zero-config (auto-detects from URL)
 * enableMockControls();
 *
 * // Simple array
 * enableMockControls({ scenarios: ['default', 'error', 'loading'] });
 *
 * // Rich scenarios
 * enableMockControls({
 *   scenarios: [
 *     { id: 'error', label: 'Error State', icon: '❌', description: 'Simulates API error' }
 *   ]
 * });
 *
 * // With onChange callback
 * enableMockControls({
 *   scenarios: ['default', 'error'],
 *   onChange: (state) => console.log('Scenario changed:', state)
 * });
 * ```
 */
export function enableMockControls(config?: MockControlsConfig): MockControlsInstance | null {
  // Check if enabled via localStorage flag
  if (!isEnabled()) {
    warn(
      `Not enabled. To enable MSW Demo Controls:\n\n` +
      `  localStorage.setItem("${ENABLE_FLAG_KEY}", "true")\n\n` +
      `Then reload the page. This flag prevents accidental production deployment.`
    );
    return null;
  }

  // Check browser support
  if (!checkBrowserSupport()) {
    error(
      `Browser not supported. MSW Demo Controls requires:\n` +
      `- Chrome 90+\n` +
      `- Firefox 88+\n` +
      `- Safari 14+\n` +
      `- Edge 90+\n\n` +
      `Your browser: ${getBrowserName()}`
    );
    return null;
  }

  // Normalize config
  const normalizedConfig = normalizeConfig(config);

  // Create and return controller instance
  try {
    return new MockController(normalizedConfig);
  } catch (err) {
    error('Failed to initialize MSW Demo Controls', err as Error);
    return null;
  }
}
