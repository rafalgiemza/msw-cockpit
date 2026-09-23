# 🎭 MSW Cockpit

> UI overlay for controlling Mock Service Worker (MSW) scenarios during live demos and presentations

[![npm version](https://img.shields.io/npm/v/msw-cockpit)](https://www.npmjs.com/package/msw-cockpit)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/msw-cockpit)](https://bundlephobia.com/package/msw-cockpit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔄 **Hot-swap** - Instantly switches MSW handlers without page reload
- 🎨 **Beautiful UI** - Floating control panel with smooth animations
- 🔒 **Production Safe** - Requires localStorage flag to prevent accidental deployment
- 📦 **Lightweight** - Only 5 KB gzipped
- 🌐 **Framework Agnostic** - Works with any JavaScript framework
- ⌨️ **Accessible** - Full keyboard navigation and screen reader support
- 🎭 **Shadow DOM** - Completely isolated from your app's styles

## 📦 Installation

```bash
npm install msw-cockpit
```

```bash
yarn add msw-cockpit
```

```bash
pnpm add msw-cockpit
```

## 🚀 Quick Start

### 1. Enable the Controls

MSW Cockpit requires a localStorage flag to prevent accidental production deployment. Open your browser console and run:

```javascript
localStorage.setItem("MSW_COCKPIT__ENABLED", "true");
```

Then reload the page.

### 2. Initialize in Your App

```javascript
import { setupWorker } from "msw/browser";
import { setupMswCockpit } from "msw-cockpit";

const worker = setupWorker(...defaultHandlers);

setupMswCockpit({
  worker,
  scenarios: [
    { id: "default", label: "Default", handlers: [defaultHandler] },
    { id: "error", label: "Error State", handlers: [errorHandler], icon: "❌" },
    {
      id: "loading",
      label: "Slow Loading",
      handlers: [loadingHandler],
      icon: "⏳",
    },
  ],
});

await worker.start();
```

### 3. Use the Controls

Look for the floating 🎭 button in the bottom-right corner of your page. Click it to open the scenario selector and switch between different mock states!

## 📖 Usage Examples

### Simple String Array

When scenario IDs match your MSW handler file names, a string array is the shortest form. Selecting a scenario still hot-swaps the matching `handlers` if you add them later.

```javascript
setupMswCockpit({
  worker,
  scenarios: ["default", "error", "loading", "empty"],
});
```

### Rich Scenarios with Icons and Descriptions

```javascript
setupMswCockpit({
  worker,
  scenarios: [
    {
      id: "default",
      label: "Default State",
      icon: "✅",
      description: "Normal API responses",
      handlers: [defaultHandler],
    },
    {
      id: "error",
      label: "Error State",
      icon: "❌",
      description: "Simulates 500 server error",
      handlers: [errorHandler],
    },
    {
      id: "loading",
      label: "Slow Loading",
      icon: "⏳",
      description: "Delayed responses (3s)",
      handlers: [loadingHandler],
    },
    {
      id: "empty",
      label: "Empty State",
      icon: "📭",
      description: "No data returned",
      handlers: [emptyHandler],
    },
  ],
});
```

### With onChange Callback

```javascript
setupMswCockpit({
  worker,
  scenarios: ["default", "error", "loading"],
  onChange: (state) => {
    console.log("Scenario changed:", state);
    // { values: { scenario: 'error' }, url: 'http://...' }
  },
});
```

### Custom URL Parameter Name

```javascript
setupMswCockpit({
  worker,
  scenarios: ["default", "error"],
  paramName: "mock", // Uses ?mock=error instead of ?scenario=error
});
```

### Custom Button Position

```javascript
setupMswCockpit({
  worker,
  scenarios: ["default", "error"],
  ui: {
    position: "top-left", // Options: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  },
});
```

### Custom Trigger Icon

```javascript
setupMswCockpit({
  worker,
  scenarios: ["default", "error"],
  ui: {
    trigger: {
      icon: "🎬",
      label: "Demo Controls",
    },
  },
});
```

### Programmatic Control

```javascript
const controls = setupMswCockpit({
  worker,
  scenarios: ["default", "error", "loading"],
});

if (controls) {
  // Apply a scenario programmatically
  controls.applyScenario("scenario", "error");

  // Get current state
  const state = controls.getState();
  console.log(state);

  // Subscribe to changes
  const unsubscribe = controls.onChange((state) => {
    console.log("Changed:", state);
  });

  // Cleanup when done
  unsubscribe();
  controls.destroy();
}
```

## 🔧 API Reference

### `setupMswCockpit(config: MockControlsConfig): MockControlsInstance | null`

Main function to enable the controls. Returns `null` if not enabled or browser not supported.

#### Configuration Options

| Option        | Type                                  | Default      | Description                                                   |
| ------------- | ------------------------------------- | ------------ | ------------------------------------------------------------- |
| `worker`      | `MswWorker`                           | **required** | MSW worker returned by `setupWorker()`                        |
| `scenarios`   | `Array<string \| ScenarioDefinition>` | `[]`         | Array of scenario IDs or rich scenario objects                |
| `paramName`   | `string`                              | `'scenario'` | URL parameter name                                            |
| `urlStrategy` | `'replace' \| 'push'`                 | `'replace'`  | How to update the URL (`replace` doesn't add history entries) |
| `onChange`    | `(state: ScenarioState) => void`      | `undefined`  | Callback fired when scenario changes                          |
| `ui`          | `UIConfig`                            | See below    | UI customization options                                      |

#### UI Configuration

| Option             | Type       | Default          | Description                                                                      |
| ------------------ | ---------- | ---------------- | -------------------------------------------------------------------------------- |
| `ui.position`      | `Position` | `'bottom-right'` | Button position (`'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`) |
| `ui.theme`         | `Theme`    | `'light'`        | UI theme (`'light'` or `'dark'`)                                                 |
| `ui.trigger.icon`  | `string`   | `'🎭'`           | Custom icon for trigger button                                                   |
| `ui.trigger.label` | `string`   | `'MSW Cockpit'`  | Accessibility label                                                              |
| `ui.zIndex`        | `number`   | `999999`         | Z-index for the controls                                                         |

#### ScenarioDefinition

```typescript
interface ScenarioDefinition {
  id: string; // Unique identifier
  label: string; // Display label
  description?: string; // Optional description
  icon?: string; // Optional icon/emoji
  handlers?: any[]; // MSW RequestHandlers applied via worker.use()
}
```

#### MockControlsInstance

```typescript
interface MockControlsInstance {
  applyScenario(dimensionId: string, scenarioId: string): void;
  getState(): ScenarioState;
  onChange(callback: (state: ScenarioState) => void): () => void;
  destroy(): void;
}
```

## 🎯 How It Works

1. **Hot-swap**: Selecting a scenario calls `worker.use(...scenario.handlers)` to override MSW handlers instantly
2. **URL Synchronization**: Active scenario is synced to URL parameters for bookmarkable state
3. **Browser Navigation**: Back/forward buttons work as expected
4. **State Management**: Internal state management with observer pattern
5. **Shadow DOM**: UI is completely isolated from your app's styles
6. **Accessibility**: Full keyboard navigation and ARIA labels

## 🔒 Production Safety

The controls **will not render** without the localStorage flag:

```javascript
localStorage.setItem("MSW_COCKPIT__ENABLED", "true");
```

This prevents accidentally shipping demo controls to production. The library will log a helpful warning if the flag is not set.

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

The library uses modern browser features (Shadow DOM, URL API) and will show a clear error message if the browser is not supported.

## 📝 TypeScript Support

Full TypeScript definitions are included:

```typescript
import { setupMswCockpit, type MockControlsConfig } from "msw-cockpit";

const config: MockControlsConfig = {
  worker,
  scenarios: ["default", "error"],
};

setupMswCockpit(config);
```

## 🎬 Example

See the [examples/vanilla-simple](./examples/vanilla-simple) directory for a complete working example.

To run the example:

```bash
cd examples/vanilla-simple
npx serve .
```

Then visit `http://localhost:3000`, enable the controls in the console, and reload.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Check bundle size
npm run size

# Type check
npm run type-check

# Run tests
npm test
```

## 📄 License

MIT © 2024

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Use Cases

Perfect for:

- **Sales Demos**: Quickly switch between different scenarios during client presentations
- **Developer Advocates**: Demonstrate error handling and edge cases at conferences
- **Solutions Architects**: Show various system states without code changes
- **Training**: Teach teams about error handling and state management
- **QA**: Manual testing of different scenarios

## 🔗 Related Projects

- [MSW (Mock Service Worker)](https://mswjs.io) - API mocking library that this tool is designed to work with

---

**Made with ❤️ for demo day heroes everywhere** 🎭
