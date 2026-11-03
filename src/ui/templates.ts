import type { NormalizedConfig, NormalizedDimension, NormalizedScenario } from '../core/types.js';
import type { Position, HandlerInfo } from '../core/types.js';

export interface HandlerPanel {
  handlers: HandlerInfo[];
  onToggle: (handlerId: string) => void;
}

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
 * Render the per-handler on/off list
 */
export function renderHandlerList(handlers: HandlerInfo[], disabledIds: string[]): string {
  if (handlers.length === 0) return '';
  const disabled = new Set(disabledIds);

  return `
    <div class="msw-dimension">
      <h3 class="msw-dimension-label">Handlers</h3>
      <div class="msw-handler-list">
        ${handlers.map(handler => {
          const on = !disabled.has(handler.id);
          return `
            <button
              class="msw-handler${on ? '' : ' msw-handler--off'}"
              role="switch"
              aria-checked="${on}"
              data-handler-id="${escapeHTML(handler.id)}"
              title="${on ? 'Mocked — click to use the real network' : 'Real network — click to mock'}"
            >
              ${handler.method ? `<span class="msw-handler-method">${escapeHTML(handler.method)}</span>` : ''}
              <span class="msw-handler-path">${escapeHTML(handler.path)}</span>
              <span class="msw-handler-switch"><span class="msw-handler-knob"></span></span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Scenario dimensions worth rendering: drop the "no scenarios" placeholder
 * when the handler list is the main content
 */
export function visibleDimensions(config: NormalizedConfig, hasHandlers: boolean): NormalizedDimension[] {
  return hasHandlers ? config.dimensions.filter(d => d.scenarios.length > 0) : config.dimensions;
}

/**
 * Render the MSW on/off toggle pill
 */
function renderMswToggle(mswEnabled: boolean): string {
  const onOff = mswEnabled ? 'ON' : 'OFF';
  return `
    <button
      class="msw-toggle ${mswEnabled ? 'msw-toggle--on' : 'msw-toggle--off'}"
      data-msw-toggle
      aria-label="${mswEnabled ? 'Disable MSW' : 'Enable MSW'}"
      title="${mswEnabled ? 'Click to disable MSW (real network requests)' : 'Click to enable MSW (mocked requests)'}"
    >
      <span class="msw-toggle-dot"></span>
      <span class="msw-toggle-label">MSW ${onOff}</span>
    </button>
  `;
}

/**
 * Render the modal overlay
 */
export function renderModal(
  config: NormalizedConfig,
  currentValues: Record<string, string>,
  isOpen: boolean,
  hasMswToggle: boolean = false,
  mswEnabled: boolean = true,
  handlerPanel?: HandlerPanel,
  disabledHandlers: string[] = [],
): string {
  const openClass = isOpen ? ' open' : '';

  return `
    <div class="msw-backdrop${openClass}" style="z-index: ${config.ui.zIndex};" data-backdrop>
      <div class="msw-modal" role="dialog" aria-modal="true" aria-labelledby="msw-modal-title">
        <div class="msw-modal-header">
          <h2 id="msw-modal-title" class="msw-modal-title">MSW Cockpit</h2>
          <div class="msw-modal-header-actions">
            ${hasMswToggle ? renderMswToggle(mswEnabled) : ''}
            <button class="msw-modal-close" aria-label="Close" data-close>
              ✕
            </button>
          </div>
        </div>
        <div class="msw-modal-body">
          ${visibleDimensions(config, !!handlerPanel).map(dimension =>
            renderScenarioList(dimension, currentValues[dimension.id] || null)
          ).join('')}
          ${handlerPanel ? renderHandlerList(handlerPanel.handlers, disabledHandlers) : ''}
        </div>
      </div>
    </div>
  `;
}
