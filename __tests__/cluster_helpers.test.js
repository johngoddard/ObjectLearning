const helpers = require('../src/clustering/cluster_helpers.js');

test('#shuffle shuffles an array', () => {
  const arr = [[1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6,3], [8,4]];
  const shuffled = helpers.shuffle(arr);
  expect(shuffled).not.toEqual(arr);
  expect(shuffled.length).toBe(7);
});

test('#computMean computes the means of the columns of an array', () => {
  const matrix = [
    [1,2,3],
    [1,2,3],
    [1,2,3],
  ];

  expect(helpers.computeMean(matrix)).toEqual([1,2,3]);
});
