import type { NormalizedConfig } from '../core/types.js';
import type { StateManager } from '../core/state.js';
import { CONTAINER_ID } from '../core/constants.js';
import { getStyles } from './styles.js';
import { renderTriggerButton, renderModal } from './templates.js';

/**
 * UI Manager for Shadow DOM controls
 * Manages rendering, events, and lifecycle
 */
export class UIManager {
  private container: HTMLDivElement;
  private shadowRoot: ShadowRoot;
  private isModalOpen: boolean = false;
  private clickListener: ((e: Event) => void) | null = null;
  private escapeListener: ((e: KeyboardEvent) => void) | null = null;
  private themeObserver: MutationObserver | null = null;

  constructor(
    private state: StateManager,
    private config: NormalizedConfig,
    private onScenarioApply: (dimensionId: string, scenarioId: string) => void
  ) {
    this.container = this.createContainer();
    this.shadowRoot = this.createShadowRoot();
    this.injectStyles();
    this.render();
    this.attachEventListeners();
    this.syncTheme();
    this.watchThemeChanges();

    // Listen to state changes to update UI
    this.state.onChange(() => {
      this.updateUI();
    });
  }

  /**
   * Create container element in document body
   */
  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
    return container;
  }

  /**
   * Create shadow root for style isolation
   */
  private createShadowRoot(): ShadowRoot {
    return this.container.attachShadow({ mode: 'open' });
  }

  /**
   * Inject CSS styles into shadow root
   */
  private injectStyles(): void {
    try {
      // Try using Constructable Stylesheets (modern browsers)
      const styleSheet = new CSSStyleSheet();
      (styleSheet as any).replaceSync(getStyles());
      this.shadowRoot.adoptedStyleSheets = [styleSheet as CSSStyleSheet];
    } catch {
      // Fallback to style tag for older browsers
      const style = document.createElement('style');
      style.textContent = getStyles();
      this.shadowRoot.appendChild(style);
    }
  }

  /**
   * Render initial UI
   */
  private render(): void {
    this.shadowRoot.innerHTML = `
      ${renderTriggerButton(this.config)}
      ${renderModal(this.config, this.state.getValues(), this.isModalOpen)}
    `;
  }

  /**
   * Update UI when state changes
   */
  private updateUI(): void {
    const backdrop = this.shadowRoot.querySelector('.msw-backdrop');
    if (backdrop) {
      // Toggle open class
      if (this.isModalOpen) {
        backdrop.classList.add('open');
      } else {
        backdrop.classList.remove('open');
      }

      // Update modal body content with new state
      const modalBody = backdrop.querySelector('.msw-modal-body');
      if (modalBody) {
        const currentValues = this.state.getValues();
        modalBody.innerHTML = this.config.dimensions.map(dimension => {
          const activeId = currentValues[dimension.id] || null;
          return this.renderScenarioList(dimension, activeId);
        }).join('');
      }
    }
  }

  /**
   * Render scenario list for a dimension
   */
  private renderScenarioList(dimension: any, activeId: string | null): string {
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
        <h3 class="msw-dimension-label">${this.escapeHTML(dimension.label)}</h3>
        <div class="msw-scenario-list">
          ${dimension.scenarios.map((scenario: any) =>
            this.renderScenario(scenario, dimension.id, scenario.id === activeId)
          ).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render a single scenario button
   */
  private renderScenario(scenario: any, dimensionId: string, isActive: boolean): string {
    const activeClass = isActive ? ' active' : '';

    return `
      <button
        class="msw-scenario${activeClass}"
        data-dimension-id="${this.escapeHTML(dimensionId)}"
        data-scenario-id="${this.escapeHTML(scenario.id)}"
      >
        ${scenario.icon ? `<span class="msw-scenario-icon">${scenario.icon}</span>` : ''}
        <div class="msw-scenario-content">
          <span class="msw-scenario-label">${this.escapeHTML(scenario.label)}</span>
          ${scenario.description ? `<span class="msw-scenario-description">${this.escapeHTML(scenario.description)}</span>` : ''}
        </div>
      </button>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHTML(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Sync theme from parent document to shadow host
   */
  private syncTheme(): void {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme) {
      this.container.setAttribute('data-theme', theme);
    } else {
      this.container.removeAttribute('data-theme');
    }
  }

  /**
   * Watch for theme changes in parent document
   */
  private watchThemeChanges(): void {
    this.themeObserver = new MutationObserver(() => {
      this.syncTheme();
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  /**
   * Attach event listeners using event delegation
   */
  private attachEventListeners(): void {
    this.clickListener = (e: Event) => {
      const target = e.target as HTMLElement;

      // Trigger button click
      if (target.closest('[data-trigger]')) {
        this.openModal();
        return;
      }

      // Close button or backdrop click
      if (target.closest('[data-close]') || target.hasAttribute('data-backdrop')) {
        // Only close if clicking backdrop directly, not modal content
        if (target.hasAttribute('data-backdrop') || target.closest('[data-close]')) {
          this.closeModal();
        }
        return;
      }

      // Scenario button click
      const scenarioButton = target.closest('.msw-scenario');
      if (scenarioButton) {
        const dimensionId = scenarioButton.getAttribute('data-dimension-id');
        const scenarioId = scenarioButton.getAttribute('data-scenario-id');

        if (dimensionId && scenarioId) {
          this.onScenarioApply(dimensionId, scenarioId);
          this.closeModal();
        }
      }
    };

    this.shadowRoot.addEventListener('click', this.clickListener);
  }

  /**
   * Open the modal
   */
  private openModal(): void {
    this.isModalOpen = true;
    this.updateUI();

    // Add escape key listener
    this.escapeListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', this.escapeListener);

    // Focus first scenario button
    setTimeout(() => {
      const firstScenario = this.shadowRoot.querySelector('.msw-scenario') as HTMLElement;
      firstScenario?.focus();
    }, 100);
  }

  /**
   * Close the modal
   */
  private closeModal(): void {
    this.isModalOpen = false;
    this.updateUI();

    // Remove escape key listener
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
      this.escapeListener = null;
    }

    // Return focus to trigger button
    const trigger = this.shadowRoot.querySelector('[data-trigger]') as HTMLElement;
    trigger?.focus();
  }

  /**
   * Clean up and remove UI
   */
  destroy(): void {
    if (this.clickListener) {
      this.shadowRoot.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }

    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
      this.escapeListener = null;
    }

    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }

    this.container.remove();
  }
}
