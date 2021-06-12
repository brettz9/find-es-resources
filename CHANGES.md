# CHANGES for `find-es-resources`

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
