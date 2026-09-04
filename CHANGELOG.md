# Changelog

## 3.0.0

### Fixed
- `AnyAttribute` no longer crashes when a wrapped child unmounts (ref callbacks
  fire with `null` on detach; this is now handled instead of pushed into the
  internal node list).
- `AnyAttribute` no longer crashes when the `attributes` prop is omitted.
- `asObject`/`asString` wrapper detection no longer relies on a closure's
  `Function.name`, which is not guaranteed to survive minification. Detection
  now uses an internal marker that is minification-safe.
- Falsy/boolean children (e.g. `{condition && <div/>}`) no longer throw.

### Changed (non-breaking)
- Attributes now reactively update (and remove keys no longer present) when
  the `attributes` prop changes on an already-mounted element, instead of
  only being applied once at mount.
- Setting an attribute's value to `undefined` or `null` now removes the
  attribute instead of writing the literal string `"undefined"`/`"null"`.
- A `console.warn` is now emitted in development when `AnyAttribute` wraps a
  plain function component that isn't wrapped in `React.forwardRef` (React
  will refuse the injected ref in that case).

### Added
- `useAnyAttributes(attributes)` hook: an alternative to the `AnyAttribute`
  wrapper component that returns a ref callback, for attaching custom
  attributes to a single element (including inside function components that
  can't otherwise receive an injected ref).
- `asBoolean(value)` helper: opt-in, HTML-idiomatic boolean attribute
  handling (`true` → present/empty-string attribute, `false` → attribute
  removed). Plain (unwrapped) boolean values keep their previous,
  stringified (`"true"`/`"false"`) behavior for backward compatibility.
- ESM build output (`lib/esm`), exposed via the `module` field and an
  `exports` map, alongside the existing CommonJS build.
- `peerDependencies` on `react`/`react-dom` (`^16.3.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`).
- `playground/` — a small Vite app for interactively trying the library.
- CI workflow (build, lint, test on Node 20/22).

### Toolchain
- Replaced Enzyme with `@testing-library/react` for tests.
- Replaced `tslint` (deprecated) with ESLint (flat config) + `typescript-eslint`.
- Upgraded `typescript` to `^5.9.3`, `react`/`react-dom` (dev/test target) to
  `^19.2.8`, `jest` to `^30.5.1`.
