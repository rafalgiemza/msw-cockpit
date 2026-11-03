import type {
  NormalizedConfig,
  MockControlsInstance,
  MswWorker,
  HandlerInfo,
  ScenarioState,
  StateListener,
  Unsubscribe,
} from "./types.js";
import { StateManager } from "./state.js";
import { URLSynchronizer } from "./url.js";
import { LocalStorageSynchronizer } from "./storage.js";
import { HandlerRegistry } from "./handlers.js";
import { UIManager } from "../ui/ui-manager.js";

/**
 * Main controller that orchestrates all components
 * Manages state, URL sync, localStorage sync, and UI
 */
export class MockController implements MockControlsInstance {
  private stateManager: StateManager;
  private urlSync: URLSynchronizer;
  private storageSync: LocalStorageSynchronizer;
  private uiManager: UIManager;
  private config: NormalizedConfig;
  private worker: MswWorker | undefined;
  private handlerRegistry: HandlerRegistry | undefined;
  readonly hasMswToggle: boolean;

  constructor(config: NormalizedConfig) {
    this.config = config;
    this.worker = config.worker;
    this.hasMswToggle = !!(
      this.worker &&
      typeof this.worker.start === 'function' &&
      typeof this.worker.stop === 'function'
    );

    this.stateManager = new StateManager(config);

    if (this.worker && typeof this.worker.listHandlers === 'function') {
      const registry = new HandlerRegistry(this.worker);
      if (registry.list().length > 0) {
        this.handlerRegistry = registry;
        this.stateManager.pruneDisabledHandlers(registry.list().map((h) => h.id));
      }
    }
    this.urlSync = new URLSynchronizer(this.stateManager, config);
    this.storageSync = new LocalStorageSynchronizer(this.stateManager, config);

    this.uiManager = new UIManager(
      this.stateManager,
      config,
      this.applyScenario.bind(this),
      this.hasMswToggle ? this.toggleMsw.bind(this) : undefined,
      this.handlerRegistry
        ? { handlers: this.handlerRegistry.list(), onToggle: (id) => this.toggleHandler(id) }
        : undefined,
    );

    // Restore persisted scenario / handler switches before the first request
    this.syncWorker();

    if (config.onChange) {
      this.stateManager.onChange(config.onChange);
    }
  }

  /**
   * Apply a scenario for a specific dimension
   */
  applyScenario(dimensionId: string, scenarioId: string): void {
    this.stateManager.applyScenario(dimensionId, scenarioId);
    this.syncWorker();
  }

  getHandlers(): HandlerInfo[] {
    return this.handlerRegistry?.list() ?? [];
  }

  toggleHandler(handlerId: string, enabled?: boolean): void {
    if (!this.handlerRegistry?.list().some((h) => h.id === handlerId)) return;
    this.stateManager.toggleHandler(handlerId, enabled);
    this.syncWorker();
  }

  /**
   * Rebuild the worker's handlers from scratch:
   * base handlers (minus switched-off ones), then the active scenario's on top.
   */
  private syncWorker(): void {
    if (!this.worker) return;
    if (this.handlerRegistry) {
      this.handlerRegistry.apply(this.stateManager.getDisabledHandlers());
    } else {
      this.worker.resetHandlers();
    }

    const values = this.stateManager.getValues();
    for (const dimension of this.config.dimensions) {
      const scenarioId = values[dimension.id];
      if (!scenarioId) continue;
      const scenario = dimension.scenarios.find((s) => s.id === scenarioId);
      if (scenario?.handlers?.length) {
        this.worker.use(...scenario.handlers);
        break;
      }
    }
  }

  toggleMsw(): void {
    if (!this.hasMswToggle || !this.worker) return;
    const worker = this.worker;
    const currentlyEnabled = this.stateManager.getMswEnabled();
    if (currentlyEnabled) {
      worker.stop!();
      this.stateManager.setMswEnabled(false);
    } else {
      worker.start!().then(() => {
        this.syncWorker();
        this.stateManager.setMswEnabled(true);
      }).catch((err: unknown) => {
        console.error('[MSW Cockpit] Failed to start MSW worker:', err);
        this.stateManager.setMswEnabled(false);
      });
    }
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
    this.storageSync.destroy();
    this.stateManager.destroy();
  }
}
