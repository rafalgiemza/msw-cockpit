# 🎭 MSW Demo Controls

> UI overlay for controlling Mock Service Worker (MSW) scenarios during live demos and presentations

[![npm version](https://img.shields.io/npm/v/msw-demo-controls)](https://www.npmjs.com/package/msw-demo-controls)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/msw-demo-controls)](https://bundlephobia.com/package/msw-demo-controls)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Zero Configuration** - Auto-detects scenarios from URL parameters
- 🎨 **Beautiful UI** - Floating control panel with smooth animations
- 🔒 **Production Safe** - Requires localStorage flag to prevent accidental deployment
- 📦 **Lightweight** - Only 3.88 KB gzipped
- 🌐 **Framework Agnostic** - Works with any JavaScript framework
- ⌨️ **Accessible** - Full keyboard navigation and screen reader support
- 🎭 **Shadow DOM** - Completely isolated from your app's styles

## 📦 Installation

```bash
npm install msw-demo-controls
```

```bash
yarn add msw-demo-controls
```

```bash
pnpm add msw-demo-controls
```

## 🚀 Quick Start

### 1. Enable the Controls

MSW Demo Controls requires a localStorage flag to prevent accidental production deployment. Open your browser console and run:

```javascript
localStorage.setItem("MSW_DEMO_CONTROLS_ENABLED", "true");
```

Then reload the page.

### 2. Initialize in Your App

```javascript
import { enableMockControls } from 'msw-demo-controls';

// Simple array of scenarios
enableMockControls({
  scenarios: ['default', 'error', 'loading']
});
```

### 3. Use the Controls

Look for the floating 🎭 button in the bottom-right corner of your page. Click it to open the scenario selector and switch between different mock states!

## 📖 Usage Examples

### Zero Configuration (Auto-detect)

```javascript
import { enableMockControls } from 'msw-demo-controls';

// Automatically detects scenario from URL (?scenario=error, ?mock=loading, etc.)
enableMockControls();
```

### Simple String Array

```javascript
enableMockControls({
  scenarios: ['default', 'error', 'loading', 'empty']
});
```

### Rich Scenarios with Icons and Descriptions

```javascript
enableMockControls({
  scenarios: [
    {
      id: 'default',
      label: 'Default State',
      icon: '✅',
      description: 'Normal API responses'
    },
    {
      id: 'error',
      label: 'Error State',
      icon: '❌',
      description: 'Simulates 500 server error'
    },
    {
      id: 'loading',
      label: 'Slow Loading',
      icon: '⏳',
      description: 'Delayed responses (3s)'
    },
    {
      id: 'empty',
      label: 'Empty State',
      icon: '📭',
      description: 'No data returned'
    }
  ]
});
```

### With onChange Callback

```javascript
enableMockControls({
  scenarios: ['default', 'error', 'loading'],
  onChange: (state) => {
    console.log('Scenario changed:', state);
    // { values: { scenario: 'error' }, url: 'http://...' }
  }
});
```

### Custom URL Parameter Name

```javascript
enableMockControls({
  scenarios: ['default', 'error'],
  paramName: 'mock' // Uses ?mock=error instead of ?scenario=error
});
```

### Custom Button Position

```javascript
enableMockControls({
  scenarios: ['default', 'error'],
  ui: {
    position: 'top-left' // Options: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  }
});
```

### Custom Trigger Icon

```javascript
enableMockControls({
  scenarios: ['default', 'error'],
  ui: {
    trigger: {
      icon: '🎬',
      label: 'Demo Controls'
    }
  }
});
```

### Programmatic Control

```javascript
const controls = enableMockControls({
  scenarios: ['default', 'error', 'loading']
});

if (controls) {
  // Apply a scenario programmatically
  controls.applyScenario('scenario', 'error');

  // Get current state
  const state = controls.getState();
  console.log(state);

  // Subscribe to changes
  const unsubscribe = controls.onChange((state) => {
    console.log('Changed:', state);
  });

  // Cleanup when done
  unsubscribe();
  controls.destroy();
}
```

## 🔧 API Reference

### `enableMockControls(config?: MockControlsConfig): MockControlsInstance | null`

Main function to enable the controls. Returns `null` if not enabled or browser not supported.

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scenarios` | `Array<string \| ScenarioDefinition>` | `[]` | Array of scenario IDs or rich scenario objects |
| `paramName` | `string` | `'scenario'` | URL parameter name |
| `urlStrategy` | `'replace' \| 'push'` | `'replace'` | How to update the URL (`replace` doesn't add history entries) |
| `onChange` | `(state: ScenarioState) => void` | `undefined` | Callback fired when scenario changes |
| `ui` | `UIConfig` | See below | UI customization options |

#### UI Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ui.position` | `Position` | `'bottom-right'` | Button position (`'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`) |
| `ui.theme` | `Theme` | `'light'` | UI theme (`'light'` or `'dark'`) |
| `ui.trigger.icon` | `string` | `'🎭'` | Custom icon for trigger button |
| `ui.trigger.label` | `string` | `'MSW Demo Controls'` | Accessibility label |
| `ui.zIndex` | `number` | `999999` | Z-index for the controls |

#### ScenarioDefinition

```typescript
interface ScenarioDefinition {
  id: string;              // Unique identifier
  label: string;           // Display label
  description?: string;    // Optional description
  icon?: string;           // Optional icon/emoji
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

1. **URL Synchronization**: Scenarios are synced to URL parameters in real-time
2. **Browser Navigation**: Back/forward buttons work as expected
3. **State Management**: Internal state management with observer pattern
4. **Shadow DOM**: UI is completely isolated from your app's styles
5. **Accessibility**: Full keyboard navigation and ARIA labels

## 🔒 Production Safety

The controls **will not render** without the localStorage flag:

```javascript
localStorage.setItem("MSW_DEMO_CONTROLS_ENABLED", "true");
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
import { enableMockControls, type MockControlsConfig } from 'msw-demo-controls';

const config: MockControlsConfig = {
  scenarios: ['default', 'error']
};

enableMockControls(config);
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
