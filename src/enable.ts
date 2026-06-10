import type { MockControlsConfig, MockControlsInstance } from "./core/types.js";
import { ENABLE_FLAG_KEY } from "./core/constants.js";
import { normalizeConfig } from "./core/config.js";
import { MockController } from "./core/controller.js";
import { checkBrowserSupport, getBrowserName } from "./utils/dom.js";
import { warn, error } from "./utils/logger.js";

function isEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLE_FLAG_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Initialize MSW Cockpit UI overlay for controlling mock scenarios
 *
 * @param config - Configuration object (optional, supports zero-config)
 * @returns MockControlsInstance or null if not enabled/supported
 *
 * @example
 * ```typescript
 * const worker = setupWorker(...handlers);
 *
 * setupMswCockpit({
 *   worker,
 *   scenarios: [
 *     { id: 'default', label: 'Default', handlers: [defaultHandler] },
 *     { id: 'error',   label: 'Error',   handlers: [errorHandler] },
 *   ]
 * });
 * ```
 */
export function setupMswCockpit(
  config?: MockControlsConfig,
): MockControlsInstance | null {
  if (!isEnabled()) {
    warn(
      `Not enabled. To enable MSW Cockpit:\n\n` +
        `  localStorage.setItem("${ENABLE_FLAG_KEY}", "true")\n\n` +
        `Then reload the page. This flag prevents accidental production deployment.`,
    );
    return null;
  }

  if (!checkBrowserSupport()) {
    error(
      `Browser not supported. MSW Cockpit requires:\n` +
        `- Chrome 90+\n` +
        `- Firefox 88+\n` +
        `- Safari 14+\n` +
        `- Edge 90+\n\n` +
        `Your browser: ${getBrowserName()}`,
    );
    return null;
  }

  if (config?.worker) {
    if (
      typeof config.worker.use !== "function" ||
      typeof config.worker.resetHandlers !== "function"
    ) {
      error(
        "worker must have use() and resetHandlers() methods — pass the value returned by setupWorker()",
      );
      return null;
    }
  }

  const normalizedConfig = normalizeConfig(config);

  try {
    return new MockController(normalizedConfig);
  } catch (err) {
    error("Failed to initialize MSW Cockpit", err as Error);
    return null;
  }
}
