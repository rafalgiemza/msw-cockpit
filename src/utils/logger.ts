/**
 * Console logging utilities with consistent prefix
 */

const PREFIX = '[MSW Demo Controls]';

/**
 * Log a warning message
 */
export function warn(message: string): void {
  console.warn(`${PREFIX} ${message}`);
}

/**
 * Log an error message
 */
export function error(message: string, err?: Error): void {
  if (err) {
    console.error(`${PREFIX} ${message}`, err);
  } else {
    console.error(`${PREFIX} ${message}`);
  }
}

/**
 * Log an info message
 */
export function info(message: string): void {
  console.info(`${PREFIX} ${message}`);
}
