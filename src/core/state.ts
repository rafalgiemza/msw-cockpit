import type {
  NormalizedConfig,
  ScenarioState,
  StateListener,
  Unsubscribe,
} from './types.js';

/**
 * State manager for scenario selection
 * Implements observer pattern for state changes
 */
export class StateManager {
  private values: Map<string, string> = new Map();
  private listeners: Set<StateListener> = new Set();

  constructor(private config: NormalizedConfig) {
    this.initializeFromURL();
  }

  /**
   * Initialize state from URL parameters
   * URL params have highest priority
   */
  private initializeFromURL(): void {
    const params = new URLSearchParams(window.location.search);

    this.config.dimensions.forEach((dimension) => {
      const urlValue = params.get(dimension.paramName);
      const defaultValue = dimension.defaultValue;

      const value = urlValue || defaultValue;
      if (value) {
        this.values.set(dimension.id, value);
      }
    });
  }

  /**
   * Apply a scenario for a specific dimension
   */
  applyScenario(dimensionId: string, scenarioId: string): void {
    this.values.set(dimensionId, scenarioId);
    this.notify();
  }

  /**
   * Get current state values
   */
  getValues(): Record<string, string> {
    return Object.fromEntries(this.values);
  }

  /**
   * Get complete current state with URL
   */
  getState(): ScenarioState {
    return {
      values: this.getValues(),
      url: window.location.href,
    };
  }

  /**
   * Set values from URL (without triggering onChange)
   * Used when syncing from browser navigation
   */
  setValuesFromURL(params: URLSearchParams): void {
    this.config.dimensions.forEach((dimension) => {
      const value = params.get(dimension.paramName);
      if (value) {
        this.values.set(dimension.id, value);
      } else {
        this.values.delete(dimension.id);
      }
    });
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  onChange(listener: StateListener): Unsubscribe {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notify(): void {
    const state = this.getState();

    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error('[MSW Demo Controls] Error in onChange listener:', error);
      }
    });
  }

  /**
   * Clean up all listeners
   */
  destroy(): void {
    this.listeners.clear();
  }
}
