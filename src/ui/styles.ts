/**
 * CSS-in-JS styles for Shadow DOM
 * All styles are scoped within the shadow root
 */
export function getStyles(): string {
  return `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      /* Light mode colors (default) */
      --modal-bg: #ffffff;
      --modal-border: #e0e0e0;
      --text-primary: #333333;
      --text-secondary: #666666;
      --hover-bg: #f0f0f0;
      --active-bg: #667eea22;
      --active-border: #667eea;
      --backdrop-bg: rgba(0, 0, 0, 0.5);
    }

    :host([data-theme="dark"]) {
      /* Dark mode colors */
      --modal-bg: #1a1f2e;
      --modal-border: #2d3548;
      --text-primary: #e4e4e7;
      --text-secondary: #a1a1aa;
      --hover-bg: #252d3d;
      --active-bg: #667eea44;
      --active-border: #8b9bff;
      --backdrop-bg: rgba(0, 0, 0, 0.7);
    }

    * {
      box-sizing: border-box;
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }

    /* Trigger Button */
    .msw-trigger {
      position: fixed;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      z-index: inherit;
    }

    .msw-trigger:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .msw-trigger:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    /* Modal Backdrop */
    .msw-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--backdrop-bg);
      z-index: inherit;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .msw-backdrop.open {
      display: flex;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Modal Container */
    .msw-modal {
      background: var(--modal-bg);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: scaleIn 0.3s ease;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Modal Header */
    .msw-modal-header {
      padding: 24px;
      border-bottom: 1px solid var(--modal-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .msw-modal-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* MSW Toggle */
    .msw-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      transition: opacity 0.2s ease, transform 0.1s ease;
    }

    .msw-toggle:hover {
      opacity: 0.85;
      transform: scale(1.04);
    }

    .msw-toggle:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    .msw-toggle--on {
      background: #dcfce7;
      color: #15803d;
    }

    .msw-toggle--off {
      background: #fee2e2;
      color: #dc2626;
    }

    :host([data-theme="dark"]) .msw-toggle--on {
      background: #14532d;
      color: #86efac;
    }

    :host([data-theme="dark"]) .msw-toggle--off {
      background: #7f1d1d;
      color: #fca5a5;
    }

    .msw-toggle-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .msw-toggle--on .msw-toggle-dot {
      background: #22c55e;
    }

    .msw-toggle--off .msw-toggle-dot {
      background: #ef4444;
    }

    .msw-handler-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .msw-handler {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--modal-border);
      border-radius: 8px;
      background: transparent;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }

    .msw-handler:hover {
      background: var(--hover-bg);
    }

    .msw-handler:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    .msw-handler-method {
      flex-shrink: 0;
      min-width: 44px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #dcfce7;
      color: #15803d;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
    }

    .msw-handler-path {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    .msw-handler--off .msw-handler-path {
      opacity: 0.55;
      text-decoration: line-through;
    }

    .msw-handler--off .msw-handler-method {
      background: #fee2e2;
      color: #dc2626;
    }

    .msw-handler-switch {
      flex-shrink: 0;
      width: 32px;
      height: 18px;
      border-radius: 9px;
      background: #22c55e;
      position: relative;
      transition: background 0.2s ease;
    }

    .msw-handler--off .msw-handler-switch {
      background: #9ca3af;
    }

    .msw-handler-knob {
      position: absolute;
      top: 2px;
      left: 16px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      transition: left 0.2s ease;
    }

    .msw-handler--off .msw-handler-knob {
      left: 2px;
    }

    .msw-modal-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .msw-modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-secondary);
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .msw-modal-close:hover {
      background: var(--hover-bg);
    }

    .msw-modal-close:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    /* Modal Body */
    .msw-modal-body {
      padding: 24px;
      overflow-y: auto;
    }

    /* Dimension Section */
    .msw-dimension {
      margin-bottom: 20px;
    }

    .msw-dimension:last-child {
      margin-bottom: 0;
    }

    .msw-dimension-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 12px 0;
    }

    /* Scenario List */
    .msw-scenario-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Scenario Button */
    .msw-scenario {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 2px solid var(--modal-border);
      border-radius: 8px;
      background: var(--modal-bg);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      width: 100%;
    }

    .msw-scenario:hover {
      background: var(--hover-bg);
    }

    .msw-scenario:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    .msw-scenario.active {
      background: var(--active-bg);
      border-color: var(--active-border);
    }

    .msw-scenario-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .msw-scenario-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .msw-scenario-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .msw-scenario-description {
      font-size: 12px;
      color: var(--text-secondary);
      opacity: 0.7;
    }

    /* Empty State */
    .msw-empty {
      padding: 40px 20px;
      text-align: center;
      color: var(--text-secondary);
    }

    .msw-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .msw-empty-message {
      font-size: 14px;
      margin: 0;
    }
  `;
}
