import type {
  MockControlsConfig,
  NormalizedConfig,
  NormalizedScenario,
  NormalizedDimension,
  ScenarioDefinition,
} from './types.js';
import {
  DEFAULT_PARAM_NAME,
  DEFAULT_POSITION,
  DEFAULT_THEME,
  DEFAULT_TRIGGER_ICON,
  DEFAULT_TRIGGER_LABEL,
  DEFAULT_Z_INDEX,
  DEFAULT_DIMENSION_ID,
  DEFAULT_DIMENSION_LABEL,
} from './constants.js';

/**
 * Normalize a scenario definition
 * Converts both string and object formats to NormalizedScenario
 */
function normalizeScenario(scenario: string | ScenarioDefinition): NormalizedScenario {
  if (typeof scenario === 'string') {
    return {
      id: scenario,
      label: scenario.charAt(0).toUpperCase() + scenario.slice(1),
    };
  }

  return {
    id: scenario.id,
    label: scenario.label,
    description: scenario.description,
    icon: scenario.icon,
  };
}

/**
 * Detect scenarios from current URL parameters
 * Scans for common scenario param names
 */
function detectScenariosFromURL(): NormalizedDimension {
  const params = new URLSearchParams(window.location.search);
  const commonParams = ['scenario', 'mock', 'state'];

  // Check for common param names
  for (const paramName of commonParams) {
    const value = params.get(paramName);
    if (value) {
      return {
        id: DEFAULT_DIMENSION_ID,
        label: DEFAULT_DIMENSION_LABEL,
        paramName,
        scenarios: [
          { id: value, label: value.charAt(0).toUpperCase() + value.slice(1) },
        ],
      };
    }
  }

  // No URL params found, return empty scenarios with default param name
  return {
    id: DEFAULT_DIMENSION_ID,
    label: DEFAULT_DIMENSION_LABEL,
    paramName: DEFAULT_PARAM_NAME,
    scenarios: [],
  };
}

/**
 * Normalize configuration into a consistent internal format
 * Handles all complexity levels from zero-config to rich scenarios
 */
export function normalizeConfig(config?: MockControlsConfig): NormalizedConfig {
  // Level 1: Zero-config - auto-detect from URL
  if (!config || (!config.scenarios && !config.paramName)) {
    const dimension = detectScenariosFromURL();

    return {
      dimensions: [dimension],
      urlStrategy: config?.urlStrategy || 'replace',
      onChange: config?.onChange,
      ui: {
        position: config?.ui?.position || DEFAULT_POSITION,
        theme: config?.ui?.theme || DEFAULT_THEME,
        trigger: {
          label: config?.ui?.trigger?.label || DEFAULT_TRIGGER_LABEL,
          icon: config?.ui?.trigger?.icon || DEFAULT_TRIGGER_ICON,
        },
        zIndex: config?.ui?.zIndex || DEFAULT_Z_INDEX,
      },
    };
  }

  // Level 2+: Has scenarios array or paramName
  const scenarios = config.scenarios || [];
  const paramName = config.paramName || DEFAULT_PARAM_NAME;

  const dimension: NormalizedDimension = {
    id: DEFAULT_DIMENSION_ID,
    label: DEFAULT_DIMENSION_LABEL,
    paramName,
    scenarios: scenarios.map(normalizeScenario),
  };

  return {
    dimensions: [dimension],
    urlStrategy: config.urlStrategy || 'replace',
    onChange: config.onChange,
    ui: {
      position: config.ui?.position || DEFAULT_POSITION,
      theme: config.ui?.theme || DEFAULT_THEME,
      trigger: {
        label: config.ui?.trigger?.label || DEFAULT_TRIGGER_LABEL,
        icon: config.ui?.trigger?.icon || DEFAULT_TRIGGER_ICON,
      },
      zIndex: config.ui?.zIndex || DEFAULT_Z_INDEX,
    },
  };
}
