import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StateManager } from '../../src/core/state.js';
import type { NormalizedConfig } from '../../src/core/types.js';

const createMockConfig = (): NormalizedConfig => ({
  dimensions: [
    {
      id: 'scenario',
      label: 'Scenario',
      paramName: 'scenario',
      scenarios: [
        { id: 'default', label: 'Default' },
        { id: 'error', label: 'Error' },
      ],
    },
  ],
  urlStrategy: 'replace',
  ui: {
    position: 'bottom-right',
    theme: 'light',
    trigger: {
      label: 'MSW Demo Controls',
      icon: '🎭',
    },
    zIndex: 999999,
  },
});

describe('StateManager', () => {
  beforeEach(() => {
    // Reset URL before each test
    window.history.replaceState({}, '', '/');
  });

  it('should initialize empty state', () => {
    const config = createMockConfig();
    const state = new StateManager(config);

    const values = state.getValues();
    expect(values).toEqual({});
  });

  it('should initialize from URL params', () => {
    window.history.replaceState({}, '', '/?scenario=error');

    const config = createMockConfig();
    const state = new StateManager(config);

    const values = state.getValues();
    expect(values.scenario).toBe('error');
  });

  it('should apply scenario', () => {
    const config = createMockConfig();
    const state = new StateManager(config);

    state.applyScenario('scenario', 'error');

    const values = state.getValues();
    expect(values.scenario).toBe('error');
  });

  it('should notify listeners on change', () => {
    const config = createMockConfig();
    const state = new StateManager(config);
    const listener = vi.fn();

    state.onChange(listener);
    state.applyScenario('scenario', 'error');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        values: { scenario: 'error' },
      })
    );
  });

  it('should return unsubscribe function', () => {
    const config = createMockConfig();
    const state = new StateManager(config);
    const listener = vi.fn();

    const unsubscribe = state.onChange(listener);
    state.applyScenario('scenario', 'error');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    state.applyScenario('scenario', 'default');
    expect(listener).toHaveBeenCalledTimes(1); // Not called again
  });

  it('should handle multiple listeners', () => {
    const config = createMockConfig();
    const state = new StateManager(config);
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    state.onChange(listener1);
    state.onChange(listener2);
    state.applyScenario('scenario', 'error');

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('should isolate listener errors', () => {
    const config = createMockConfig();
    const state = new StateManager(config);
    const errorListener = vi.fn(() => {
      throw new Error('Listener error');
    });
    const goodListener = vi.fn();

    state.onChange(errorListener);
    state.onChange(goodListener);
    state.applyScenario('scenario', 'error');

    // Both listeners should be called despite error in first
    expect(errorListener).toHaveBeenCalled();
    expect(goodListener).toHaveBeenCalled();
  });

  it('should clean up listeners on destroy', () => {
    const config = createMockConfig();
    const state = new StateManager(config);
    const listener = vi.fn();

    state.onChange(listener);
    state.destroy();
    state.applyScenario('scenario', 'error');

    expect(listener).not.toHaveBeenCalled();
  });
});
