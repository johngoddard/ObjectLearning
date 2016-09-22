let clusterer = require('../src/clustering/k_clustering.js');

const Student = require('../test_utils/students.js');

const students = [
  new Student(1500, 3.8, true),
  new Student(1200, 3.5, true),
  new Student(1300, 3.4, true),
  new Student(400, 1.2, false),
  new Student(450, 1.9, false),
  new Student(900, 2.4, false),
  new Student(850, 2.6, true),
  new Student(950, 2.7, true),
  new Student(200, 1.1, false),
  new Student(1000, 3.0, true),
  new Student(1040, 2.6, true),
  new Student(760, 2.3, false),
  new Student(660, 2.5, false),
  new Student(720, 2.8, true),
];

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

test('#kclustering correctly clusters objects in 2 dimensions', () => {
  let clusteredInfo = clusterer.kclustering(students, ['SAT', 'GPA'], {maxIter: 100, centroids: 3});

  expect(clusteredInfo.groups[0].objects.length).toBe(3);
  expect(clusteredInfo.groups[1].objects.length).toBe(8);
  expect(clusteredInfo.groups[2].objects.length).toBe(3);
});

test('#kclustering correctly clusters objects in 2 dimensions, with names', () => {
  let clusteredInfo = clusterer.kclustering(students, ['SAT', 'GPA'], {maxIter: 100, centroids: 3, groupNames: ['low', 'med', 'high']});

  expect(clusteredInfo.groups['low'].objects.length).toBe(3);
  expect(clusteredInfo.groups['med'].objects.length).toBe(8);
  expect(clusteredInfo.groups['high'].objects.length).toBe(3);
});

test('#kclustering places new objects into the correct group', () => {
  let clusteredInfo = clusterer.kclustering(students, ['SAT', 'GPA'], {maxIter: 100, centroids: 3});
  let newStuLow = new Student(200, 1.4, false);
  let newStuHigh = new Student(1400, 3.7, true);


  expect(clusteredInfo.findGroup(newStuLow)).toBe(0);
  expect(clusteredInfo.findGroup(newStuHigh)).toBe(2);
});

test('#kclustering places new objects into the correct group, with names', () => {
  let clusteredInfo = clusterer.kclustering(students, ['SAT', 'GPA'], {maxIter: 100, centroids: 3, groupNames: ['low', 'med', 'high']});
  let newStuLow = new Student(200, 1.4, false);
  let newStuHigh = new Student(1400, 3.7, true);


  expect(clusteredInfo.findGroup(newStuLow)).toBe('low');
  expect(clusteredInfo.findGroup(newStuHigh)).toBe('high');
});
