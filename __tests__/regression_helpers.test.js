let helpers = require('../src/util/regression_helpers.js');
let Cat = require('../src/test_utils/cats.js');

let cats = [new Cat(1, 10, 100), new Cat(2, 5, 50)];
let objs = [{height: 1, weight: 10, bmi: 10}, {height: 2, weight: 5, bmi: 2.5}];

test('extracts parameters from objects', () => {
  expect(helpers.extractParams(objs, ['height', 'weight'])).toEqual([[1,10],[2,5]]);
});

test('extracts parameters from class objects', () => {
  expect(helpers.extractParams(cats, ['height', 'weight'])).toEqual([[1,10],[2,5]]);
});

test('extracts target param from objects', () => {
  expect(helpers.extractParams(objs, 'bmi')).toEqual([[10],[2.5]]);
});

test('extracts target param from class objects', () => {
  expect(helpers.extractParams(cats, 'fluffiness')).toEqual([[100],[50]]);
});

test('calculateMean', () => {
  expect(helpers.calculateMean([1,2,3])).toBe(2);
});

test('calculateSTD', () => {
  expect(helpers.calculateSTD([1,2,3], 2)).toBe(Math.sqrt(2/3));
});

test('calculateSTD', () => {
  expect(helpers.calculateSTD([2,4], 3)).toBe(1);
});

test('add ones to array', () => {
  expect(helpers.addOnes([[1,2],[3,4]])).toEqual([[1,1,2],[1,3,4]]);
})

test('normalizes features', () => {
  expect(helpers.normalizeFeatures([[1,2], [3,4]]).normalized).toEqual([[1,-1,-1],[1,1,1]]);
});

test('computes cost when cost is 0', () => {
  expect(helpers.computeCost([[1,2],[3,4]], [[3],[7]], [[1],[1]])).toEqual(0);
});

test('computes cost when cost is not 0', () => {
  expect(helpers.computeCost([[1,2],[3,4]], [[5],[11]], [[1],[1]])).toEqual(5);
});

test('gradient descent for small example', () => {
  let gradient = helpers.gradientDescent([[1,2],[3,4]], [[5],[11]], [[1],[1]], .1);
  expect(gradient.map(el => [el[0].toFixed(4)])).toEqual([[(34/20).toFixed(4)], [(2).toFixed(4)]]);
});
