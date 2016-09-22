const clusterer = require('../src/clustering/k_clustering.js');


test('#findClosestCentroids finds the closest centroids', () => {
  let objs = [
    [1,2],
    [4,4],
    [7,7]
  ];

  let centroids = [
    [1,1],
    [5,5],
    [8,8]
  ];

  expect(clusterer.findClosestCentroids(objs, centroids)).toEqual({0: [0], 1: [1], 2: [2]});
});

test('#findClosestCentroids finds the closest centroids for multi dimensional arrays', () => {
  let objs = [
    [1,2,2],
    [4,4,4],
    [5,5,5],
    [7,7,7],
    [8,8,8]
  ];

  let centroids = [
    [1,1,2],
    [5,5,5],
    [8,8,8]
  ];

  expect(clusterer.findClosestCentroids(objs, centroids)).toEqual({0: [0], 1: [1,2], 2: [3,4]});
});

test('#computeMeans computes the means for each centroid correctly', () => {
  let objs = [
    [2,2,2],
    [4,4,4],
    [7,7,7],
    [9,9,9]
  ];

  let centroids = [
    [4,4,4],
    [8,8,8]
  ];

  let centroidMap = {
    0: [0,1],
    1: [2,3]
  };

  expect(clusterer.computeMeans(objs, centroidMap, centroids)).toEqual([[3,3,3], [8,8,8]]);
});
