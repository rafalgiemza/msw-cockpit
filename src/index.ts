/**
 * MSW Demo Controls
 * UI overlay for controlling MSW scenarios during live demos
 */

export { enableMockControls } from './enable.js';

// Export types for TypeScript users
export type {
  Position,
  Theme,
  URLStrategy,
  ScenarioDefinition,
  UIConfig,
  ScenarioState,
  StateListener,
  Unsubscribe,
  MockControlsConfig,
  MockControlsInstance,
} from './core/types.js';

// Export constants for advanced users
export { ENABLE_FLAG_KEY } from './core/constants.js';
