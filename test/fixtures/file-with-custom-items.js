// /* eslint-disable import/unambiguous -- Test file */

const use = function () {
  // Do something
};
const resources = [
  './test7.json'
];

await Promise.all([
  './test1.json',
  './test2.json'
].map((path) => {
  return fetch(path);
}));

use(resources);
