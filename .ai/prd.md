# Product Requirements Document: MSW Scenarios

## Executive Summary

**Project Name:** Demo Controls
**Version:** 1.0  
**Last Updated:** December 20, 2024  
**Status:** Planning Phase

Demo Controlsis an open-source developer tool that provides a UI overlay for controlling Mock Service Worker (MSW) scenarios during live demos, presentations, and client meetings. It eliminates the need to manually modify URL parameters by providing an intuitive floating control panel.

## Problem Statement

### Current Pain Points

1. **Manual URL Manipulation**: Developers must manually type URL parameters (e.g., `?scenario=error`) during live demos, which is error-prone and unprofessional
2. **Context Switching**: Switching between demo scenarios requires breaking flow to edit URLs or code
3. **Client Perception**: Manual technical adjustments during presentations reduce credibility
4. **Complexity**: Managing multiple scenario dimensions (user type, data state, network conditions) becomes unwieldy with URL parameters alone

### Target Users

- **Primary**: Sales Engineers, Developer Advocates, Solutions Architects conducting live product demos
- **Secondary**: Frontend Developers doing client presentations, QA Engineers showcasing edge cases
- **Tertiary**: Technical Trainers, Conference Speakers demonstrating applications

## Goals & Success Metrics

### Primary Goals

1. Reduce demo scenario switching time from ~30 seconds to <3 seconds
2. Eliminate URL manipulation visibility during client-facing demos
3. Support complex multi-dimensional mock scenarios with simple UI
4. Maintain zero production risk through opt-in activation

### Success Metrics

- **Adoption**: 1,000+ GitHub stars within 6 months
- **Usage**: 500+ weekly npm downloads within 3 months
- **Engagement**: 20+ community contributions (issues, PRs, discussions) within 6 months
- **Quality**: <5% bug rate, 90%+ user satisfaction in surveys

### Non-Goals (Out of Scope for v1.0)

- Response logging/debugging (use browser DevTools)
- Network delay simulation (MSW already supports this)
- Request/response modification UI
- Browser extension version
- Headless/programmatic-only API
- Integration with testing frameworks

## User Stories

### Essential User Stories (Must Have)

**US-1: Enable Scenarios**

```
As a developer preparing for a demo
I want to enable mock controls with a single localStorage flag
So that I can quickly turn on/off the feature without code changes
```

**US-2: Simple Scenario Switching**

```
As a sales engineer during a live demo
I want to click a floating button and select a scenario
So that I can switch mock states without touching the URL
```

**US-2b: Hot-swap MSW Handlers**

```
As a developer using MSW
I want to pass my worker instance to setupMswCockpit
So that selecting a scenario immediately replaces active handlers via worker.use()
without requiring a page reload or URL round-trip
```

**US-3: Preset Combinations**

```
As a solutions architect demoing complex flows
I want to apply preset combinations of multiple scenarios
So that I can quickly show "happy path" vs "error state" without configuring each dimension
```

**US-4: Visual Feedback**

```
As a presenter during a demo
I want to see which scenario is currently active
So that I can confirm the correct mock state is applied
```

### Important User Stories (Should Have)

**US-5: Multi-Dimension Control**

```
As a developer with complex mock requirements
I want to control multiple independent scenario dimensions (user type, data state, network)
So that I can demonstrate various combinations during demos
```

**US-6: Keyboard Shortcuts**

```
As a power user conducting frequent demos
I want to toggle the control panel with a keyboard shortcut
So that I can quickly access controls without mouse interaction
```

**US-7: React Integration**

```
As a React developer
I want to use a React component or hook
So that the tool integrates naturally with my application stack
```

### Nice to Have User Stories

**US-8: Custom Theming**

```
As a developer with brand guidelines
I want to customize the control panel's appearance
So that it matches my application's design system
```

**US-9: Scenario Descriptions**

```
As a new team member learning the demo flow
I want to see descriptions for each scenario
So that I understand what each option does without asking
```

## Technical Requirements

### Architecture

**Technology Stack:**

- TypeScript for type safety and developer experience
- Vanilla JavaScript for core functionality (framework-agnostic)
- Shadow DOM for style encapsulation
- React wrapper as optional secondary export

**Package Structure:**

```
msw-cockpit/
├── src/
│   ├── core/           # State management, URL handling
│   ├── ui/             # DOM manipulation, rendering
│   ├── react/          # React-specific wrapper
│   └── index.ts        # Main entry point
├── examples/           # Demo applications
├── dist/               # Built artifacts
└── package.json
```

**Build System:**

- tsdown for bundling (ESM + CJS)
- TypeScript for type definitions
- Dual exports: core + react subpath

### Core Features

#### Feature 1: Activation System

**Requirement:** Must be opt-in via localStorage flag to prevent accidental production deployment

**Implementation:**

```javascript
// Required to enable
localStorage.setItem("MSW_DEMO_CONTROLS_ENABLED", "true");
```

**Acceptance Criteria:**

- Controls do not render without localStorage flag
- Console message guides users on how to enable
- Flag can be toggled without page reload (destroys/recreates UI)

#### Feature 2: Configuration API

**Levels of Complexity:**

**Level 1 - Zero Config (Auto-detection):**

```typescript
setupMswCockpit();
// Scans for common URL params: scenario, mock, state
```

**Level 2 - Simple Array:**

```typescript
setupMswCockpit({
  scenarios: ["default", "empty", "error", "loading"],
});
```

**Level 3 - Rich Scenarios:**

```typescript
setupMswCockpit({
  scenarios: [
    {
      id: "error",
      label: "API Error",
      description: "Simulates 500 server error",
      icon: "❌",
    },
  ],
});
```

**Level 4 - With Hot-swap Worker:**

```typescript
const worker = setupWorker(...defaultHandlers);

setupMswCockpit({
  worker,
  scenarios: [
    { id: "default", label: "Default",    handlers: [defaultHandler] },
    { id: "error",   label: "API Error",  handlers: [errorHandler], icon: "❌" },
    { id: "empty",   label: "Empty List", handlers: [emptyHandler] },
  ],
});
```

When `worker` is provided, selecting a scenario immediately calls `worker.use(...scenario.handlers)`. Scenarios without `handlers` call `worker.resetHandlers()` to restore defaults. URL sync still runs alongside for bookmarkable state.

**Level 5 - Multi-Dimension:**

```typescript
setupMswCockpit({
  dimensions: [
    {
      id: 'user',
      label: 'User Type',
      paramName: 'user',
      scenarios: [...]
    },
    {
      id: 'data',
      label: 'Data State',
      paramName: 'data',
      scenarios: [...]
    }
  ]
});
```

**Level 6 - Presets:**

```typescript
setupMswCockpit({
  dimensions: [...],
  presets: [
    {
      id: 'happy-path',
      label: '✅ Happy Path',
      values: { user: 'premium', data: 'full' }
    }
  ]
});
```

#### Feature 3: UI Components

**Trigger Button:**

- Floating button (56x56px) with customizable position
- Default: bottom-right corner
- Positions: top-left, top-right, bottom-left, bottom-right
- Customizable icon (default: 🎭)
- Hover effect with scale transform
- High z-index (999999) to stay above app content

**Modal Overlay:**

- Click outside to close
- Semi-transparent backdrop (rgba(0,0,0,0.5))
- Centered modal with max-width 500px
- Smooth fade-in animation (300ms)
- Scroll support for long scenario lists

**Scenario List:**

- Radio button UI for single selection per dimension
- Visual active state with color accent
- Support for icons/emojis
- Optional descriptions for each scenario
- Grouped by dimension (if multi-dimension)

**Preset Buttons:**

- Full-width buttons with hover effects
- Displayed above dimension controls
- Shows icon, label, and description
- One-click to apply multiple scenarios

#### Feature 4: Hot-swap Worker Integration

**Requirement:** When a worker is provided, selecting a scenario must immediately replace active MSW handlers without a page reload.

**Implementation:**

```typescript
const worker = setupWorker(...defaultHandlers);

setupMswCockpit({
  worker,
  scenarios: [
    { id: 'default', label: 'Default', handlers: [defaultHandler] },
    { id: 'error',   label: 'Error',   handlers: [errorHandler] },
  ],
});
```

**Behavior:**

- `worker` is optional — omitting it keeps the existing URL-only mode
- On scenario selection: if `handlers` is a non-empty array, calls `worker.use(...handlers)`
- On scenario selection: if `handlers` is absent or empty, calls `worker.resetHandlers()` to restore original handlers
- URL sync still runs alongside for bookmarkable/shareable state
- At init, `worker` is validated: must expose `use()` and `resetHandlers()` — returns `null` with a console error if not

**Worker type (no MSW peer dependency required):**

```typescript
interface MswWorker {
  use: (...handlers: any[]) => void;
  resetHandlers: (...handlers: any[]) => void;
}
```

**Acceptance Criteria:**

- Selecting a scenario with `handlers` calls `worker.use(...handlers)` synchronously
- Selecting a scenario without `handlers` calls `worker.resetHandlers()`
- Passing an object without `use`/`resetHandlers` logs an error and returns `null`
- Omitting `worker` entirely preserves URL-only behavior unchanged

#### Feature 5: State Management

**URL Synchronization:**

- Read current state from URL params on initialization
- Update URL when scenario changes
- Support two strategies: `replace` (default) or `push` (history)
- Watch for browser back/forward button (popstate event)

**Persistence:**

```typescript
persistence: {
  enabled: true,
  key: 'msw-demo-state',
  scope: 'session' | 'persistent'
}
```

- Optional localStorage/sessionStorage persistence
- Restore state on page reload
- Separate from enable flag

**Change Notifications:**

```typescript
onChange: (state: ScenarioState) => {
  console.log("Scenario changed:", state);
};
```

- Callback fired on every scenario change
- Provides current state object
- Useful for analytics, logging, debugging

#### Feature 6: React Integration

**Component API:**

```tsx
import { MockControls } from 'msw-cockpit/react';

<MockControls
  scenarios={[...]}
  presets={[...]}
  onChange={(state) => console.log(state)}
/>
```

**Hook API:**

```tsx
import { useMockControls } from 'msw-cockpit/react';

const { state, applyScenario, applyPreset } = useMockControls({
  scenarios: [...]
});
```

**Requirements:**

- React 16.8+ (hooks support)
- Peer dependency (optional)
- Properly cleanup on unmount
- TypeScript types included

### Non-Functional Requirements

#### Performance

- Bundle size: <15KB gzipped (core), <20KB with React
- Initial render: <100ms
- Scenario switch: <50ms
- No impact on host application performance
- Tree-shakeable exports

#### Security

- No production deployment risk (localStorage guard)
- Shadow DOM prevents CSS conflicts
- No eval() or unsafe innerHTML
- No external dependencies beyond React (peer)

#### Accessibility

- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for screen readers
- Focus management in modal
- Keyboard shortcut (configurable, e.g., Ctrl+Shift+M)
- Sufficient color contrast (WCAG AA)

#### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- No IE11 support

#### Developer Experience

- Full TypeScript support with exported types
- Clear error messages
- Helpful console warnings
- Comprehensive JSDoc comments
- Zero required configuration (optional customization)

## API Specification

### Core API

```typescript
function setupMswCockpit(
  config?: MockControlsConfig
): MockControlsInstance | null;

interface MswWorker {
  use: (...handlers: any[]) => void;
  resetHandlers: (...handlers: any[]) => void;
}

interface MockControlsConfig {
  // Hot-swap worker (optional — URL-only mode if omitted)
  worker?: MswWorker;

  // Simple mode
  scenarios?: Array<string | ScenarioDefinition>;
  paramName?: string;

  // Advanced mode
  dimensions?: DimensionDefinition[];
  presets?: PresetDefinition[];

  // Behavior
  onChange?: (state: ScenarioState) => void;
  onApplyScenario?: (values: Record<string, string>) => void;
  urlStrategy?: "replace" | "push" | "custom";
  persistence?: PersistenceConfig;

  // UI
  ui?: UIConfig;
  position?: Position;
}

interface ScenarioDefinition {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
  visible?: () => boolean;
  handlers?: any[]; // MSW RequestHandler[] — applied via worker.use() on selection
}

interface DimensionDefinition {
  id: string;
  label: string;
  paramName: string;
  scenarios: ScenarioDefinition[];
  defaultValue?: string;
}

interface PresetDefinition {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  values: Record<string, string>;
}

interface PersistenceConfig {
  enabled: boolean;
  key?: string;
  scope?: "session" | "persistent";
}

interface UIConfig {
  position?: Position;
  theme?: "light" | "dark" | "auto";
  trigger?: {
    label?: string;
    icon?: string;
  };
  hotkey?: string;
  zIndex?: number;
}

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface ScenarioState {
  values: Record<string, string>;
  url: string;
}

interface MockControlsInstance {
  controller: MockController;
  applyScenario: (dimensionId: string, scenarioId: string) => void;
  applyPreset: (presetId: string) => void;
  getState: () => ScenarioState;
  onChange: (callback: (state: ScenarioState) => void) => () => void;
  destroy: () => void;
}
```

### React API

```typescript
// Component
function MockControls(props: MockControlsConfig): null;

// Hook
function useMockControls(config: MockControlsConfig): {
  state: ScenarioState | null;
  applyScenario?: (dimensionId: string, scenarioId: string) => void;
  applyPreset?: (presetId: string) => void;
};
```

## Design Specifications

### Visual Design

**Color Palette:**

- Primary Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Background (Light): `#ffffff`
- Background (Dark): `#1e1e1e`
- Text (Light): `#333333`
- Text (Dark): `#e0e0e0`
- Border (Light): `#e0e0e0`
- Border (Dark): `#333333`
- Active State: `#667eea22` (with `#667eea` border)
- Hover Background (Light): `#f0f0f0`
- Hover Background (Dark): `#2a2a2a`

**Typography:**

- Font Family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Modal Title: 20px, weight 600
- Section Labels: 14px, weight 600
- Scenario Labels: 14px, weight 500
- Descriptions: 12px, opacity 0.7

**Spacing:**

- Button Padding: 12px 16px
- Modal Padding: 24px
- Section Margin: 20px bottom
- Scenario Margin: 4px bottom

**Animations:**

- Fade In: 300ms ease
- Button Hover: scale(1.1), 300ms ease
- Modal Scale: 0.9 → 1.0, 300ms ease

**Shadows:**

- Button: `0 4px 12px rgba(0, 0, 0, 0.15)`
- Button Hover: `0 6px 16px rgba(0, 0, 0, 0.2)`
- Modal: `0 20px 60px rgba(0, 0, 0, 0.3)`

### Interaction Design

**Trigger Button:**

- Click: Opens modal
- Hover: Scales to 1.1x with shadow increase
- Keyboard: Hotkey toggles modal (default: Ctrl+Shift+M)

**Modal:**

- Click outside: Closes modal
- Escape key: Closes modal
- Click close button: Closes modal

**Scenario Selection:**

- Click scenario: Applies immediately, updates URL, shows active state
- Hover: Background color change
- Keyboard navigation: Tab through options, Enter to select

**Preset Selection:**

- Click preset: Applies all values, updates URL and UI
- Hover: Border color change, slight translate right (4px)

## Documentation Requirements

### README.md Structure

1. **Hero Section**

   - Project logo/badge
   - One-line description
   - Key features (3-5 bullets)
   - Installation command
   - Demo GIF/video

2. **Quick Start**

   - Enable localStorage flag
   - Basic example (5 lines)
   - Link to live demo

3. **Installation**

   - npm, yarn, pnpm commands
   - CDN option (future)

4. **Usage Examples**

   - Simple scenario array
   - Rich scenarios with descriptions
   - Multi-dimension control
   - Presets
   - React component
   - React hook

5. **API Reference**

   - Configuration options table
   - TypeScript types
   - Return value documentation

6. **Advanced Usage**

   - Custom URL handling
   - Persistence configuration
   - Conditional scenarios
   - Theming

7. **Best Practices**

   - When to use presets vs dimensions
   - Naming conventions for scenarios
   - Demo workflow tips

8. **FAQ**

   - Why localStorage flag?
   - Browser compatibility
   - Bundle size impact
   - MSW integration patterns

9. **Contributing**

   - Link to CONTRIBUTING.md
   - Development setup
   - Testing approach

10. **License**
    - MIT License

### Additional Documentation

**CONTRIBUTING.md:**

- Development setup instructions
- Code style guidelines
- PR process
- Testing requirements

**CHANGELOG.md:**

- Versioning strategy (semantic versioning)
- Release notes format
- Migration guides for breaking changes

**Examples Directory:**

- `vanilla-simple/` - Basic string array
- `vanilla-advanced/` - Multi-dimension with presets
- `react-demo/` - Full React integration
- `e-commerce-demo/` - Real-world scenario

## Testing Strategy

### Unit Tests

- Controller logic (state management, URL handling)
- Config normalization
- Persistence layer
- Event listeners

### Integration Tests

- UI rendering
- User interactions (clicks, keyboard)
- URL synchronization
- React component/hook lifecycle

### Manual Testing Checklist

- [ ] Enable/disable via localStorage works
- [ ] All position options render correctly
- [ ] Modal opens/closes with all methods (click, ESC, outside)
- [ ] URL updates on scenario change
- [ ] Browser back/forward button syncs state
- [ ] Keyboard shortcuts work
- [ ] Persistence saves/restores state
- [ ] React component unmounts cleanly
- [ ] Shadow DOM isolates styles
- [ ] Mobile responsiveness
- [ ] Dark/light themes
- [ ] Long scenario lists scroll properly

### Browser Testing Matrix

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android)

## Release Plan

### Phase 1: MVP (v0.1.0) - Weeks 1-3

**Scope:**

- Core controller with URL sync
- Basic UI with trigger button + modal
- Simple scenario array support
- LocalStorage enable flag
- Vanilla JS only
- Basic documentation

**Deliverables:**

- Working npm package
- 1 example app (vanilla-simple)
- README with quick start
- GitHub repository with issues enabled

### Phase 2: Enhancement (v0.2.0) - Weeks 4-5

**Scope:**

- Rich scenarios with icons/descriptions
- Multi-dimension support
- Presets functionality
- Keyboard shortcuts
- Persistence layer
- Dark/light theme

**Deliverables:**

- Enhanced examples
- API documentation
- Video demo (2-3 minutes)

### Phase 3: React Support (v0.3.0) - Week 6

**Scope:**

- React component wrapper
- useMockControls hook
- React TypeScript example
- React-specific documentation

**Deliverables:**

- React subpath export
- React example app
- React integration guide

### Phase 4: Polish (v1.0.0) - Weeks 7-8

**Scope:**

- Accessibility improvements (ARIA, keyboard nav)
- Performance optimizations
- Comprehensive error handling
- Extended browser testing
- Community feedback integration

**Deliverables:**

- Full test coverage (>80%)
- CONTRIBUTING.md
- Migration guide (if needed)
- Blog post/announcement

## Marketing & Community Strategy

### Launch Channels

1. **Reddit**: r/reactjs, r/javascript, r/webdev
2. **Twitter/X**: Tag @mswjs, tech influencers
3. **Dev.to**: Tutorial article
4. **Hacker News**: Show HN post
5. **Product Hunt**: Product launch
6. **Discord/Slack**: MSW community, React community

### Content Strategy

- Launch blog post with use cases
- 60-second demo video
- Twitter thread with GIFs
- Integration guide for popular frameworks
- Case study from beta tester

### Community Building

- GitHub Discussions enabled
- Issue templates (bug report, feature request)
- PR template with checklist
- Code of conduct
- Good first issue labels
- Monthly release notes

## Risk Assessment

### Technical Risks

| Risk                                    | Probability | Impact | Mitigation                                        |
| --------------------------------------- | ----------- | ------ | ------------------------------------------------- |
| Shadow DOM compatibility issues         | Low         | Medium | Fallback to scoped CSS, browser testing           |
| Bundle size bloat                       | Medium      | Medium | Strict size budget, tree-shaking, code review     |
| URL manipulation conflicts with routers | Medium      | High   | Document router integrations, custom URL strategy |
| Z-index wars with host apps             | Medium      | Low    | Very high default z-index (999999), configurable  |
| TypeScript type complexity              | Low         | Low    | Start simple, iterate based on feedback           |

### Product Risks

| Risk                                     | Probability | Impact   | Mitigation                                            |
| ---------------------------------------- | ----------- | -------- | ----------------------------------------------------- |
| Low adoption (niche use case)            | Medium      | High     | Focus on demo/sales engineer communities, great docs  |
| Maintenance burden from feature requests | High        | Medium   | Clear scope boundaries, "headless later" roadmap      |
| Accidental production deployment         | Low         | Critical | Strong localStorage guard, warning messages, docs     |
| Better alternative emerges               | Low         | Medium   | Fast iteration, community engagement, MSW integration |
| MSW API changes break integration        | Low         | High     | Follow MSW closely, version compatibility matrix      |

## Open Questions

1. **Naming**: Is "MSW Scenarios" the right name, or should it be more generic (e.g., "Demo Scenario Switcher")?
2. **MSW Dependency**: Should we have MSW as a peer dependency or keep it completely decoupled?
3. **Icon/Logo**: What visual identity represents the project best?
4. **Premium Features**: Should there be a "pro" version with advanced features, or keep it 100% free?
5. **Telemetry**: Should we collect anonymous usage stats (opt-in) to guide development?

## Appendix

### Glossary

- **Scenario**: A specific mock state (e.g., "error", "empty", "loading")
- **Dimension**: An independent axis of scenario control (e.g., "user type", "data state")
- **Preset**: A pre-configured combination of scenarios across multiple dimensions
- **Shadow DOM**: Browser API for style/DOM encapsulation
- **MSW**: Mock Service Worker - library for mocking HTTP requests

### References

- MSW Documentation: https://mswjs.io
- Next.js DevTools (UI inspiration): https://nextjs.org
- React Shadow DOM: https://github.com/Wildhoney/ReactShadow
- TypeScript Best Practices: https://typescript-eslang.io

### Version History

- v1.0 (2024-12-20): Initial PRD based on project planning discussion
- v1.1 (2026-06-10): Added hot-swap worker integration (Feature 4); renamed entry point to `setupMswCockpit`; added `MswWorker` interface and `handlers` field on `ScenarioDefinition`; renumbered features 4→5 (State Management) and 4→6 (React Integration)

---

**Document Owner**: Open Source Maintainer  
**Last Reviewed**: June 10, 2026  
**Next Review**: Post-MVP feedback (Week 4)
