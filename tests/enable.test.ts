import { describe, it, expect, beforeEach } from 'vitest';
import { setupMswCockpit } from '../src/enable.js';

describe('setupMswCockpit autoEnable', () => {
  beforeEach(() => localStorage.clear());

  it('sets the enable flag by default', () => {
    setupMswCockpit();
    expect(localStorage.getItem('MSW_COCKPIT__ENABLED')).toBe('true');
  });

  it('does not set the flag when autoEnable is false', () => {
    setupMswCockpit({ autoEnable: false });
    expect(localStorage.getItem('MSW_COCKPIT__ENABLED')).toBeNull();
  });
});
