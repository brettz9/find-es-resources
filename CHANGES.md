# CHANGES for `find-es-resources`

## 3.0.1

- Fix: Properly utilize `singleFiles`

## 3.0.0

### User-facing

- Enhancement: Allow CLI to avoid saving file/`output`
- Enhancement: Support multiple inputs/globs (and `noGlobs` option);
    support `cwd` and `singleFiles`; multiple HTML inputs
- npm: Update `es-file-traverse` (major)

## 2.0.1

- Fix: Type of `queryModule`

## 2.0.0

- Breaking change: Drop `queryOptions` in favor of directly passing in
    `queryModule`

## 1.3.0

- Enhancement: Support CSS input files

## 1.2.0

- Enhancement: Sort files for deterministic behavior

## 1.1.4
## 1.1.3

- Fix: Ensure items still unique after `removeBasePath`

## 1.1.2

- Fix: Exclude `data:` links and images

## 1.1.1

- Fix: Ensure `saveESResources` is passing on `htmlInput` option

## 1.1.0

- Enhancement: Add `htmlInput` option
- Fix: Use `path.resolve` instead of `path.join` to check relative to cwd. for
    `queryModule`, `package.json` (and new `htmlInput`)

## 1.0.1

- Fix: Absent `removeBasePath` or `addBasePath`

## 1.0.0

- Breaking change: Uses native ESM with `exports`
- Breaking change: Exports named `findESResources` and additional
    `saveESResources`
- Breaking change: Expects ESM for `queryModule` option
- Enhancement: Add binary
- Enhancement: Switch to native ESM
- npm: Update `es-file-traverse` (minor)
- npm: Update devDeps.

## 0.3.0

- Enhancement: Support `queryOptions` object argument with `queryModule`
    property to add to queries
- Fix: Avoid chance for `file` or `callback` being overridden.
- npm: Update devDeps.

## 0.2.1

- npm: Update `es-file-traverse`
- npm: Update devDeps.

## 0.2.0

- Enhancement: Adds `es-file-traverse` option for customizing its behavior
- Testing (WIP): Add test (fails, but works on its own)

## 0.1.0

- Initial commit
