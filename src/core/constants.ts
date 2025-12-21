import type { Position, Theme } from './types.js';

/**
 * LocalStorage key for enable flag
 * Users must set this to 'true' to enable the controls
 */
export const ENABLE_FLAG_KEY = 'MSW_DEMO_CONTROLS_ENABLED';

/**
 * Default URL parameter name for simple mode
 */
export const DEFAULT_PARAM_NAME = 'scenario';

/**
 * Default position for the trigger button
 */
export const DEFAULT_POSITION: Position = 'bottom-right';

/**
 * Default theme
 */
export const DEFAULT_THEME: Theme = 'light';

/**
 * Default trigger button icon
 */
export const DEFAULT_TRIGGER_ICON = '🎭';

/**
 * Default trigger button label (for accessibility)
 */
export const DEFAULT_TRIGGER_LABEL = 'MSW Demo Controls';

/**
 * Default z-index for the controls
 */
export const DEFAULT_Z_INDEX = 999999;

/**
 * Container ID for the Shadow DOM host element
 */
export const CONTAINER_ID = 'msw-demo-controls-container';

/**
 * Default dimension ID for simple mode
 */
export const DEFAULT_DIMENSION_ID = 'scenario';

/**
 * Default dimension label for simple mode
 */
export const DEFAULT_DIMENSION_LABEL = 'Scenario';
