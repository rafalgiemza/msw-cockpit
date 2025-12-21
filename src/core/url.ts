import type { NormalizedConfig, URLStrategy } from './types.js';
import type { StateManager } from './state.js';

/**
 * URL synchronizer for bidirectional state <-> URL sync
 * Listens to state changes and updates URL
 * Listens to browser navigation and updates state
 */
export class URLSynchronizer {
  private popstateListener: (() => void) | null = null;

  constructor(
    private state: StateManager,
    private config: NormalizedConfig
  ) {
    this.setupListeners();
  }

  /**
   * Set up bidirectional listeners
   */
  private setupListeners(): void {
    // Listen to state changes -> update URL
    this.state.onChange(() => {
      this.updateURL();
    });

    // Listen to browser navigation (back/forward) -> update state
    this.popstateListener = () => {
      this.syncFromURL();
    };
    window.addEventListener('popstate', this.popstateListener);
  }

  /**
   * Update URL with current state values
   */
  private updateURL(): void {
    const values = this.state.getValues();
    const url = new URL(window.location.href);

    // Update URL params for each dimension
    this.config.dimensions.forEach((dimension) => {
      const value = values[dimension.id];
      if (value) {
        url.searchParams.set(dimension.paramName, value);
      } else {
        url.searchParams.delete(dimension.paramName);
      }
    });

    // Apply URL update strategy
    const method = this.config.urlStrategy === 'push' ? 'pushState' : 'replaceState';
    window.history[method]({}, '', url.toString());
  }

  /**
   * Sync state from current URL params
   * Called on browser back/forward navigation
   */
  private syncFromURL(): void {
    const params = new URLSearchParams(window.location.search);
    this.state.setValuesFromURL(params);
  }

  /**
   * Clean up listeners
   */
  destroy(): void {
    if (this.popstateListener) {
      window.removeEventListener('popstate', this.popstateListener);
      this.popstateListener = null;
    }
  }
}
