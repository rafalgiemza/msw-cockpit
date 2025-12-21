import type {
  NormalizedConfig,
  MockControlsInstance,
  ScenarioState,
  StateListener,
  Unsubscribe,
} from './types.js';
import { StateManager } from './state.js';
import { URLSynchronizer } from './url.js';
import { UIManager } from '../ui/ui-manager.js';

/**
 * Main controller that orchestrates all components
 * Manages state, URL sync, and UI
 */
export class MockController implements MockControlsInstance {
  private stateManager: StateManager;
  private urlSync: URLSynchronizer;
  private uiManager: UIManager;

  constructor(private config: NormalizedConfig) {
    // Create state manager
    this.stateManager = new StateManager(config);

    // Create URL synchronizer
    this.urlSync = new URLSynchronizer(this.stateManager, config);

    // Create UI manager
    this.uiManager = new UIManager(
      this.stateManager,
      config,
      this.applyScenario.bind(this)
    );

    // Call user's onChange if provided
    if (config.onChange) {
      this.stateManager.onChange(config.onChange);
    }
  }

  /**
   * Apply a scenario for a specific dimension
   */
  applyScenario(dimensionId: string, scenarioId: string): void {
    this.stateManager.applyScenario(dimensionId, scenarioId);
  }

  /**
   * Get the current state
   */
  getState(): ScenarioState {
    return this.stateManager.getState();
  }

  /**
   * Subscribe to state changes
   */
  onChange(callback: StateListener): Unsubscribe {
    return this.stateManager.onChange(callback);
  }

  /**
   * Destroy the controller and clean up all resources
   */
  destroy(): void {
    this.uiManager.destroy();
    this.urlSync.destroy();
    this.stateManager.destroy();
  }
}
