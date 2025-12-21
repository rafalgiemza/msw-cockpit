import type { NormalizedConfig, NormalizedDimension, NormalizedScenario } from '../core/types.js';
import type { Position } from '../core/types.js';

/**
 * Get position styles for trigger button
 */
function getPositionStyles(position: Position): string {
  const positions = {
    'top-left': 'top: 20px; left: 20px;',
    'top-right': 'top: 20px; right: 20px;',
    'bottom-left': 'bottom: 20px; left: 20px;',
    'bottom-right': 'bottom: 20px; right: 20px;',
  };
  return positions[position];
}

/**
 * Render the floating trigger button
 */
export function renderTriggerButton(config: NormalizedConfig): string {
  const { position, trigger, zIndex } = config.ui;

  return `
    <button
      class="msw-trigger"
      style="${getPositionStyles(position)} z-index: ${zIndex};"
      aria-label="${trigger.label}"
      data-trigger
    >
      ${trigger.icon}
    </button>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Render a single scenario button
 */
function renderScenario(
  scenario: NormalizedScenario,
  dimensionId: string,
  isActive: boolean
): string {
  const activeClass = isActive ? ' active' : '';

  return `
    <button
      class="msw-scenario${activeClass}"
      data-dimension-id="${escapeHTML(dimensionId)}"
      data-scenario-id="${escapeHTML(scenario.id)}"
    >
      ${scenario.icon ? `<span class="msw-scenario-icon">${scenario.icon}</span>` : ''}
      <div class="msw-scenario-content">
        <span class="msw-scenario-label">${escapeHTML(scenario.label)}</span>
        ${scenario.description ? `<span class="msw-scenario-description">${escapeHTML(scenario.description)}</span>` : ''}
      </div>
    </button>
  `;
}

/**
 * Render scenario list for a dimension
 */
function renderScenarioList(dimension: NormalizedDimension, activeId: string | null): string {
  if (dimension.scenarios.length === 0) {
    return `
      <div class="msw-empty">
        <div class="msw-empty-icon">🎭</div>
        <p class="msw-empty-message">No scenarios configured. Add scenarios to your config.</p>
      </div>
    `;
  }

  return `
    <div class="msw-dimension">
      <h3 class="msw-dimension-label">${escapeHTML(dimension.label)}</h3>
      <div class="msw-scenario-list">
        ${dimension.scenarios.map(scenario =>
          renderScenario(scenario, dimension.id, scenario.id === activeId)
        ).join('')}
      </div>
    </div>
  `;
}

/**
 * Render the modal overlay
 */
export function renderModal(
  config: NormalizedConfig,
  currentValues: Record<string, string>,
  isOpen: boolean
): string {
  const openClass = isOpen ? ' open' : '';

  return `
    <div class="msw-backdrop${openClass}" style="z-index: ${config.ui.zIndex};" data-backdrop>
      <div class="msw-modal" role="dialog" aria-modal="true" aria-labelledby="msw-modal-title">
        <div class="msw-modal-header">
          <h2 id="msw-modal-title" class="msw-modal-title">MSW Demo Controls</h2>
          <button class="msw-modal-close" aria-label="Close" data-close>
            ✕
          </button>
        </div>
        <div class="msw-modal-body">
          ${config.dimensions.map(dimension =>
            renderScenarioList(dimension, currentValues[dimension.id] || null)
          ).join('')}
        </div>
      </div>
    </div>
  `;
}
