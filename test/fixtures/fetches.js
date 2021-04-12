'use strict';

(async () => {
await Promise.all([
  './test1.json',
  './test2.json'
].map((path) => {
  return fetch(path);
}));
})();
