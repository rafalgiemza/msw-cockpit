import { describe, it, expect, beforeEach } from 'vitest';
import { normalizeConfig } from '../../src/core/config.js';

describe('normalizeConfig', () => {
  beforeEach(() => {
    // Reset URL before each test
    window.history.replaceState({}, '', '/');
  });

  it('should handle zero-config', () => {
    const result = normalizeConfig();

    expect(result.dimensions).toHaveLength(1);
    expect(result.dimensions[0].paramName).toBe('scenario');
    expect(result.dimensions[0].id).toBe('scenario');
  });

  it('should normalize string array to scenarios', () => {
    const result = normalizeConfig({
      scenarios: ['default', 'error', 'loading'],
    });

    expect(result.dimensions).toHaveLength(1);
    expect(result.dimensions[0].scenarios).toHaveLength(3);
    expect(result.dimensions[0].scenarios[0].id).toBe('default');
    expect(result.dimensions[0].scenarios[0].label).toBe('Default');
  });

  it('should preserve rich scenario definitions', () => {
    const result = normalizeConfig({
      scenarios: [
        { id: 'error', label: 'Error State', icon: '❌', description: 'API error' },
      ],
    });

    expect(result.dimensions[0].scenarios[0].label).toBe('Error State');
    expect(result.dimensions[0].scenarios[0].icon).toBe('❌');
    expect(result.dimensions[0].scenarios[0].description).toBe('API error');
  });

  it('should use custom param name', () => {
    const result = normalizeConfig({
      scenarios: ['a', 'b'],
      paramName: 'mock',
    });

    expect(result.dimensions[0].paramName).toBe('mock');
  });

  it('should use default URL strategy', () => {
    const result = normalizeConfig({
      scenarios: ['a', 'b'],
    });

    expect(result.urlStrategy).toBe('replace');
  });

  it('should respect custom URL strategy', () => {
    const result = normalizeConfig({
      scenarios: ['a', 'b'],
      urlStrategy: 'push',
    });

    expect(result.urlStrategy).toBe('push');
  });

  it('should use default UI config', () => {
    const result = normalizeConfig({
      scenarios: ['a', 'b'],
    });

    expect(result.ui.position).toBe('bottom-right');
    expect(result.ui.theme).toBe('light');
    expect(result.ui.trigger.icon).toBe('🎭');
    expect(result.ui.zIndex).toBe(999999);
  });

  it('should respect custom UI config', () => {
    const result = normalizeConfig({
      scenarios: ['a', 'b'],
      ui: {
        position: 'top-left',
        trigger: {
          icon: '🎬',
        },
        zIndex: 5000,
      },
    });

    expect(result.ui.position).toBe('top-left');
    expect(result.ui.trigger.icon).toBe('🎬');
    expect(result.ui.zIndex).toBe(5000);
  });
});
