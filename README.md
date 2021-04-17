# find-es-resources

This project is meant to help assist you find resource files within parsed
JavaScript. *It currently has very limited support for syntactic structures*
*where the resource files can be found. See the list below.*

A main use case is to supply it to
[workbox-build](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build)
so as to be able to build a service-worker which caches the files that your
application fetches, etc.

## Presently supported AST for detection

Because we wish to avoid grabbing strings which are not file resources, we
need to whitelist the JavaScript structures where we can expect to find
files (and we can't follow variables everywhere--literals are expected to be
found at a predictable location).

The intent is to expand this gradually as we find a need ourselves. PRs are
welcome (with tests) for supporting other types of structures.

*You should just need to add a method to [`src/queries.js`](./src/queries.js).*

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


## Install

```shell
npm i find-es-resources
```

## See also

- [find-resources](https://www.npmjs.com/package/find-resources) - For resource
    discovery within parsed HTML and CSS

## Changelog

The changelog can be found on [CHANGES.md](./CHANGES.md).

## Authors and license

[Brett Zamir](http://brett-zamir.me/) and
[contributors](https://github.com/brettz9/find-es-resources/graphs/contributors).

MIT License, see the included [LICENSE-MIT.tx](LICENSE-MIT.txt) file.
