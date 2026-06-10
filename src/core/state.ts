import type {
  NormalizedConfig,
  ScenarioState,
  StateListener,
  Unsubscribe,
} from './types.js';
import { LocalStorageSynchronizer } from './storage.js';

/**
 * State manager for scenario selection
 * Implements observer pattern for state changes
 */
export class StateManager {
  private values: Map<string, string> = new Map();
  private listeners: Set<StateListener> = new Set();

  constructor(private config: NormalizedConfig) {
    this.initialize();
  }

  /**
   * Initialize state from URL, localStorage, or defaults
   * Priority: URL > localStorage > default
   */
  private initialize(): void {
    const params = new URLSearchParams(window.location.search);
    const storedValues = LocalStorageSynchronizer.getInitialValues();

    this.config.dimensions.forEach((dimension) => {
      const urlValue = params.get(dimension.paramName);
      const storageValue = storedValues?.[dimension.id];
      const defaultValue = dimension.defaultValue;

      const value = urlValue || storageValue || defaultValue;
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
   * Set values from localStorage (without triggering onChange)
   * Used when syncing from other tabs via storage event
   */
  setValuesFromStorage(values: Record<string, string>): void {
    this.config.dimensions.forEach((dimension) => {
      const value = values[dimension.id];
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
        console.error('[MSW Cockpit] Error in onChange listener:', error);
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
