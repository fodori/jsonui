## [0.10.0] - 2026-05-16

### Added

- Initial public release of JSONUI
- Core JSON-to-React rendering engine
- Store with logical path resolution
- Modifier ($modifier) and Action ($action) systems
- Slot-based children rendering ($children, $child\*)
- React component bindings via @jsonui/react
- JSONata expression support
- Comprehensive TypeScript support

### Features

- `@jsonui/core`: Framework-agnostic rendering pipeline
- `@jsonui/react`: React component library
- Built-in components (View, Text, Edit, etc.)
- Storybook documentation
- Full test coverage with Vitest

### Changed

- functions split to modifiers and actions
- Significant modifications
- check the new usage on https://www.jsonui.org/

### Fixed

- modifiers used sync jsonata, now we use full async solution with the latest version os jsonata.
