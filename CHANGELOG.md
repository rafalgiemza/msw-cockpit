# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-21

### Added

- Initial MVP release
- Core functionality:
  - localStorage activation flag for production safety
  - Floating trigger button with customizable position
  - Modal overlay for scenario selection
  - URL synchronization (replace strategy)
  - Simple scenario array support
  - Shadow DOM UI isolation
- Configuration options:
  - Zero-config mode (auto-detect from URL)
  - Simple string array scenarios
  - Rich scenarios with icons and descriptions
  - Custom URL parameter names
  - UI customization (position, icon, z-index)
  - onChange callback for state changes
- Features:
  - Bidirectional URL synchronization
  - Browser back/forward button support
  - Keyboard navigation (Tab, Enter, Escape)
  - Click outside to close modal
  - Focus management
  - ARIA labels for accessibility
- Developer experience:
  - Full TypeScript support
  - Comprehensive JSDoc comments
  - Helpful console warnings
  - Browser compatibility checks
- Bundle size: 3.88 KB gzipped (well under 15 KB target)
- Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Complete documentation with examples
- Vanilla JS example app

### Documentation

- Comprehensive README with quick start guide
- API reference with all configuration options
- TypeScript type definitions
- Usage examples for common scenarios
- MIT License
- Changelog

[0.1.0]: https://github.com/yourusername/msw-demo-controls/releases/tag/v0.1.0
