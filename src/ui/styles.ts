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
