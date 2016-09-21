let regressor = require('../src/util/logistic_regression.js');
let Cat = require('../test_utils/cats.js');

test('computes costs correctly', () => {
  let cost = regressor.computeLogisticCost([[1,2],[3,4]], [[0],[0]], [[0],[0]]);
  expect(Math.round(cost * 100) / 100).toEqual(.69);
});

// test('computes cost when cost is not 0', () => {
//   expect(regressor.computeCost([[1,2],[3,4]], [[5],[11]], [[1],[1]])).toEqual(5);
// });
