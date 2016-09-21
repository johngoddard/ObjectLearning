let regressor = require('../src/util/linear_regression.js');
let Cat = require('../src/test_utils/cats.js');

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


test('gradient descent for small example', () => {
  let gradient = regressor.gradientDescent([[1,2],[3,4]], [[5],[11]], [[1],[1]], .1);
  expect(gradient.map(el => [el[0].toFixed(4)])).toEqual([[(34/20).toFixed(4)], [(2).toFixed(4)]]);
});

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
