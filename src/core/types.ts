/**
 * Minimal MSW worker interface required for hot-swap
 * Compatible with MSW's SetupWorker without importing from MSW
 */
export interface MswWorker {
  use: (...handlers: any[]) => void;
  resetHandlers: (...handlers: any[]) => void;
}

/**
 * Position of the floating trigger button
 */
export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Theme mode for the UI
 */
export type Theme = 'light' | 'dark';

/**
 * URL update strategy
 */
export type URLStrategy = 'replace' | 'push';

/**
 * Scenario definition with optional metadata
 */
export interface ScenarioDefinition {
  /** Unique identifier for the scenario */
  id: string;
  /** Display label for the scenario */
  label: string;
  /** Optional description shown in the UI */
  description?: string;
  /** Optional icon/emoji to display */
  icon?: string;
  /** MSW RequestHandler[] applied via worker.use() when this scenario is selected */
  handlers?: any[];
}

/**
 * UI configuration options
 */
export interface UIConfig {
  /** Position of the trigger button */
  position?: Position;
  /** Theme for the UI */
  theme?: Theme;
  /** Trigger button customization */
  trigger?: {
    /** Custom label for the trigger button */
    label?: string;
    /** Custom icon for the trigger button */
    icon?: string;
  };
  /** Custom z-index for the UI */
  zIndex?: number;
}

/**
 * Current scenario state
 */
export interface ScenarioState {
  /** Map of dimension ID to scenario ID */
  values: Record<string, string>;
  /** Current URL with applied params */
  url: string;
}

/**
 * State change listener callback
 */
export type StateListener = (state: ScenarioState) => void;

/**
 * Unsubscribe function returned by onChange
 */
export type Unsubscribe = () => void;

/**
 * Main configuration for MSW Cockpit
 * Supports both simple array and rich scenario definitions
 */
export interface MockControlsConfig {
  /**
   * MSW worker instance for hot-swapping handlers on scenario change.
   * Must expose use() and resetHandlers() — pass the value returned by setupWorker().
   */
  worker?: MswWorker;

  /**
   * Simple array of scenario IDs or rich scenario definitions
   * Examples:
   * - ['default', 'error', 'loading']
   * - [{ id: 'error', label: 'Error State', icon: '❌' }]
   */
  scenarios?: Array<string | ScenarioDefinition>;

  /**
   * URL parameter name for simple mode
   * @default 'scenario'
   */
  paramName?: string;

  /**
   * URL update strategy
   * @default 'replace'
   */
  urlStrategy?: URLStrategy;

  /**
   * Callback fired when scenario changes
   */
  onChange?: StateListener;

  /**
   * UI configuration options
   */
  ui?: UIConfig;
}

/**
 * Normalized scenario definition (internal use)
 * All scenario definitions are converted to this format
 */
export interface NormalizedScenario {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  handlers?: any[];
}

/**
 * Normalized dimension definition (internal use)
 * For MVP, there's always exactly one dimension
 */
export interface NormalizedDimension {
  id: string;
  label: string;
  paramName: string;
  scenarios: NormalizedScenario[];
  defaultValue?: string;
}

/**
 * Normalized configuration (internal use)
 * All config formats are normalized to this structure
 */
export interface NormalizedConfig {
  dimensions: NormalizedDimension[];
  urlStrategy: URLStrategy;
  onChange?: StateListener;
  worker?: MswWorker;
  ui: {
    position: Position;
    theme: Theme;
    trigger: {
      label: string;
      icon: string;
    };
    zIndex: number;
  };
}

/**
 * Mock Controls instance returned by enableMockControls()
 */
export interface MockControlsInstance {
  /**
   * Apply a scenario for a specific dimension
   * @param dimensionId - ID of the dimension
   * @param scenarioId - ID of the scenario to apply
   */
  applyScenario: (dimensionId: string, scenarioId: string) => void;

  /**
   * Get the current state
   */
  getState: () => ScenarioState;

  /**
   * Subscribe to state changes
   * @param callback - Function to call when state changes
   * @returns Unsubscribe function
   */
  onChange: (callback: StateListener) => Unsubscribe;

  /**
   * Destroy the controls and clean up
   */
  destroy: () => void;
}
