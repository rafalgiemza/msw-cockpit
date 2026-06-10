import type { NormalizedConfig } from "./types.js";
import type { StateManager } from "./state.js";

const STORAGE_KEY = "MSW_COCKPIT__SCENARIO";

/**
 * LocalStorage synchronizer for persisting state across tabs and sessions
 * Listens to state changes and updates localStorage
 * Listens to storage events from other tabs and updates state
 */
export class LocalStorageSynchronizer {
  private storageListener: ((event: StorageEvent) => void) | null = null;

  constructor(private state: StateManager, private config: NormalizedConfig) {
    this.setupListeners();
  }

  /**
   * Set up bidirectional listeners
   */
  private setupListeners(): void {
    // Listen to state changes -> update localStorage
    this.state.onChange(() => {
      this.updateStorage();
    });

    // Listen to storage events from other tabs -> update state
    this.storageListener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        this.syncFromStorage(event.newValue);
      }
    };
    window.addEventListener("storage", this.storageListener);
  }

  /**
   * Update localStorage with current state values
   */
  private updateStorage(): void {
    const values = this.state.getValues();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      console.error("[MSW Cockpit] Error saving to localStorage:", error);
    }
  }

  /**
   * Sync state from localStorage value
   * Called when storage event is received from another tab
   */
  private syncFromStorage(storageValue: string): void {
    try {
      const values = JSON.parse(storageValue) as Record<string, string>;
      this.state.setValuesFromStorage(values);
    } catch (error) {
      console.error(
        "[MSW Cockpit] Error parsing localStorage value:",
        error
      );
    }
  }

  /**
   * Get initial values from localStorage
   * Returns null if no stored values found
   */
  static getInitialValues(): Record<string, string> | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Record<string, string>;
      }
    } catch (error) {
      console.error(
        "[MSW Cockpit] Error reading from localStorage:",
        error
      );
    }
    return null;
  }

  /**
   * Clean up listeners
   */
  destroy(): void {
    if (this.storageListener) {
      window.removeEventListener("storage", this.storageListener);
      this.storageListener = null;
    }
  }
}
