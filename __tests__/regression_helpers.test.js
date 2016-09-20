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
