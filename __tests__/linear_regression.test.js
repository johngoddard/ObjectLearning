let regressor = require('../src/util/linear_regression.js');
let Cat = require('../test_utils/cats.js');

let cats1 = [
  new Cat(1, 10, 2),
  new Cat(2, 10, 4),
  new Cat(3, 9, 6),
  new Cat(5, 9, 10)
];

let cats2 = [
  new Cat(1, 2, 5),
  new Cat(2, 3, 8),
  new Cat(3, 4, 11),
  new Cat(5, 6, 17)
];


test('Linear regression eval function predicts correctly for a 1 dimensional regression', () => {
  let regressedInfo = regressor.linearRegress(cats1, ['height'], 'fluffiness');
  let predictedVal = regressedInfo.evalObject(new Cat(4, 7, 0));
  expect(Math.round(predictedVal * 10) / 10).toEqual(8.00);
});

test('Linear regression eval function predicts correctly for a multi dimensional regression', () => {
  let regressedInfo = regressor.linearRegress(cats2, ['height', 'weight'], 'fluffiness');
  let predictedVal = regressedInfo.evalObject(new Cat(4, 5, 12));
  expect(Math.round(predictedVal * 10) / 10).toEqual(14.00);
});

test('Linear regression test function works for one dimensional regressions', () => {
  let regressedInfo = regressor.linearRegress(cats1, 'height', 'fluffiness');
  let testDiff = regressedInfo.testObjects([new Cat(4, 5, 7), new Cat(6, 5, 13)]);
  expect(Math.round(testDiff * 100) / 100).toEqual(.50);
});

test('Linear regression test function works for multi dimensional regressions', () => {
  let regressedInfo = regressor.linearRegress(cats2, ['height', 'weight'], 'fluffiness');
  let testDiff = regressedInfo.testObjects([new Cat(4, 5, 13), new Cat(6, 7, 21)]);
  expect(Math.round(testDiff * 100) / 100).toEqual(.50);
});
