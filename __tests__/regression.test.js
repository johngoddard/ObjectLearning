const regressor = require('../src/regression/regression.js');

test('gradient descent for small example', () => {
  let gradient = regressor.gradientDescentLinear([[1,2],[3,4]], [[5],[11]], [[1],[1]], .1);
  expect(gradient.map(el => [el[0].toFixed(4)])).toEqual([[(34/20).toFixed(4)], [(2).toFixed(4)]]);
});


test('computes cost when cost is 0', () => {
  expect(regressor.computeLinearCost([[1,2],[3,4]], [[3],[7]], [[1],[1]])).toEqual(0);
});

test('computes cost when cost is not 0', () => {
  expect(regressor.computeLinearCost([[1,2],[3,4]], [[5],[11]], [[1],[1]])).toEqual(5);
});


test('computes costs correctly', () => {
  let cost = regressor.computeLogisticCost([[1,2],[3,4]], [[0],[0]], [[0],[0]]);
  expect(Math.round(cost * 100) / 100).toEqual(.69);
});
