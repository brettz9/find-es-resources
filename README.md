# find-es-resources

**This project is not yet functional!**

This project is meant to help assist you find resource files within parsed
JavaScript.

A main use case is to supply it to [workbox-build](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build)
so as to be able to build a service-worker which caches the files that your
application fetches, etc.

## Presently supported AST for detection

Because we wish to avoid grabbing strings which are not file resources, we
need to whitelist the locations where we can expect to find files. PRs are
welcome (with tests) for other structures.

- `fetch` (e.g., for polyglot usage, ala `node-fetch`) - Literals within
    an array *directly* supplied to a `map` call which returns the result of
    a `fetch` call:

```js
(async () => {
await Promise.all([
  './test1.json',
  './test2.json'
].map((path) => {
  return fetch(path);
}));
})();
```

## See also

- [find-resources](https://www.npmjs.com/package/find-resources) - For resource
    discovery within parsed HTML and CSS

## Install

```shell
npm i find-es-resources
```

## Changelog

The changelog can be found on [CHANGES.md](./CHANGES.md).

## Authors and license

[Brett Zamir](http://brett-zamir.me/) and [contributors](https://github.com/brettz9/find-es-resources/graphs/contributors).

MIT License, see the included [LICENSE-MIT.tx](LICENSE-MIT.txt) file.
