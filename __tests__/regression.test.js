let regressor = require('../src/regression/regression.js');
let Cat = require('../test_utils/cats.js');

const Student = require('../test_utils/students.js');

const students = [
  new Student(1500, 3.8, true),
  new Student(1200, 3.5, true),
  new Student(400, 1.2, false),
  new Student(900, 2.4, false),
  new Student(850, 2.6, true),
  new Student(950, 2.7, true),
  new Student(200, 1, false),
  new Student(1000, 3.0, true),
  new Student(1040, 2.6, true),
  new Student(760, 2.3, false),
  new Student(660, 2.5, false),
  new Student(720, 2.8, true),
];

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
  let gradient = regressor.gradientDescentLinear([[1,2],[3,4]], [[5],[11]], [[1],[1]], .1);
  expect(gradient.map(el => [el[0].toFixed(4)])).toEqual([[(34/20).toFixed(4)], [(2).toFixed(4)]]);
});


test('computes cost when cost is 0', () => {
  expect(regressor.computeLinearCost([[1,2],[3,4]], [[3],[7]], [[1],[1]])).toEqual(0);
});

test('computes cost when cost is not 0', () => {
  expect(regressor.computeLinearCost([[1,2],[3,4]], [[5],[11]], [[1],[1]])).toEqual(5);
});

test('Linear regression eval function predicts correctly for a 1 dimensional regression', () => {
  let regressedInfo = regressor.regression(cats1, ['height'], 'fluffiness', 'linear');
  let predictedVal = regressedInfo.evalObject(new Cat(4, 7, 0));
  expect(Math.round(predictedVal * 10) / 10).toEqual(8.00);
});

test('Linear regression eval function predicts correctly for a multi dimensional regression', () => {
  let regressedInfo = regressor.regression(cats2, ['height', 'weight'], 'fluffiness', 'linear');
  let predictedVal = regressedInfo.evalObject(new Cat(4, 5, 12));
  expect(Math.round(predictedVal * 10) / 10).toEqual(14.00);
});

test('Linear regression test function works for one dimensional regressions', () => {
  let regressedInfo = regressor.regression(cats1, 'height', 'fluffiness', 'linear');
  let testDiff = regressedInfo.testObjects([new Cat(4, 5, 7), new Cat(6, 5, 13)]);
  expect(Math.round(testDiff * 100) / 100).toEqual(.50);
});

test('Linear regression test function works for multi dimensional regressions', () => {
  let regressedInfo = regressor.regression(cats2, ['height', 'weight'], 'fluffiness', 'linear');
  let testDiff = regressedInfo.testObjects([new Cat(4, 5, 13), new Cat(6, 7, 21)]);
  expect(Math.round(testDiff * 100) / 100).toEqual(.50);
});

test('computes costs correctly', () => {
  let cost = regressor.computeLogisticCost([[1,2],[3,4]], [[0],[0]], [[0],[0]]);
  expect(Math.round(cost * 100) / 100).toEqual(.69);
});

test("Logistic regression eval function predicts correctly for 1 dimensional regression - high", () => {
  let regressedInfo = regressor.regression(students, ['SAT'], 'accepted', 'logistic');
  let predictedVal = regressedInfo.evalObject(new Student(1500, 3.8, false));
  expect(Math.round(predictedVal * 100) / 100 > .95).toBe(true);
});

test("Logistic regression eval function predicts correctly for 1 dimensional regression - low", () => {
  let regressedInfo = regressor.regression(students, ['SAT'], 'accepted', 'logistic');
  let predictedVal = regressedInfo.evalObject(new Student(100, 3.8, false));
  expect(Math.round(predictedVal * 100) / 100 < .05).toBe(true);
});

test("Logistic regression eval function predicts correctly for multi dimensional regression - high", () => {
  let regressedInfo = regressor.regression(students, ['SAT'], 'accepted', 'logistic');
  let predictedVal = regressedInfo.evalObject(new Student(1500, 3.8, false));
  expect(Math.round(predictedVal * 100) / 100 > .95).toBe(true);
});

test("Logistic regression eval function predicts correctly for multi dimensional regression - low", () => {
  let regressedInfo = regressor.regression(students, ['SAT', 'GPA'], 'accepted', 'logistic');
  let predictedVal = regressedInfo.evalObject(new Student(200, 1.2, false));
  expect(Math.round(predictedVal * 100) / 100 < .05).toBe(true);
});
