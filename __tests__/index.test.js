const ObjLearner = require('../src/index.js');
const Cat = require('../test_utils/cats.js');
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

const students1 = [
  new Student(1500, 3.8, true),
  new Student(1200, 3.5, true),
  new Student(400, 1.2, false),
  new Student(900, 2.4, false),
  new Student(850, 2.6, true),
  new Student(950, 2.7, true),
  new Student(200, 1.0, false),
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

let errCats = [
  new Cat(1, 2, 6),
  new Cat(2, 3, 7),
]


test('#kclustering correctly clusters objects in 2 dimensions', () => {
  let clusteredInfo = ObjLearner.runKClustering(students, ['SAT', 'GPA'], {maxIter: 100, groups: 3});

  expect(clusteredInfo.groups[0].objects.length).toBe(3);
  expect(clusteredInfo.groups[1].objects.length).toBe(8);
  expect(clusteredInfo.groups[2].objects.length).toBe(3);
});

test('#kclustering correctly clusters objects in 2 dimensions, with names', () => {
  let clusteredInfo = ObjLearner.runKClustering(students, ['SAT', 'GPA'], {maxIter: 100, groups: 3, groupNames: ['low', 'med', 'high']});

  expect(clusteredInfo.groups['low'].objects.length).toBe(3);
  expect(clusteredInfo.groups['med'].objects.length).toBe(8);
  expect(clusteredInfo.groups['high'].objects.length).toBe(3);
});

test('#runKClustering places new objects into the correct group', () => {
  let clusteredInfo = ObjLearner.runKClustering(students, ['SAT', 'GPA'], {maxIter: 100, groups: 3});
  let newStuLow = new Student(200, 1.4, false);
  let newStuHigh = new Student(1400, 3.7, true);

  expect(clusteredInfo.findGroup(newStuLow)).toBe(0);
  expect(clusteredInfo.findGroup(newStuHigh)).toBe(2);
});

test('#runKClustering places new objects into the correct group, with names', () => {
  let clusteredInfo = ObjLearner.runKClustering(students, ['SAT', 'GPA'], {maxIter: 100, groups: 3, groupNames: ['low', 'med', 'high']});
  let newStuLow = new Student(200, 1.4, false);
  let newStuHigh = new Student(1400, 3.7, true);


  expect(clusteredInfo.findGroup(newStuLow)).toBe('low');
  expect(clusteredInfo.findGroup(newStuHigh)).toBe('high');
});

test('Linear regression eval function predicts correctly for a 1 dimensional regression', () => {
  let regressedInfo = ObjLearner.runLinearReg(cats1, ['height'], 'fluffiness');
  let predictedVal = regressedInfo.evalObject(new Cat(4, 7, 0));
  expect(Math.round(predictedVal * 10) / 10).toEqual(8.00);
});

test('Linear regression eval function predicts correctly for a multi dimensional regression', () => {
  let regressedInfo = ObjLearner.runLinearReg(cats2, ['height', 'weight'], 'fluffiness');
  let predictedVal = regressedInfo.evalObject(new Cat(4, 5, 12));
  expect(Math.round(predictedVal * 10) / 10).toEqual(14.00);
});

test('Linear regression test correctly returns error of test set', () => {
  let regressedInfo = ObjLearner.runLinearReg(cats2, ['height', 'weight'], 'fluffiness');
  let testCost = regressedInfo.testObjects(errCats);
  expect(Math.round(testCost * 10) / 10).toEqual(1);
});

test('Linear regression test function works for one dimensional regressions', () => {
  let regressedInfo = ObjLearner.runLinearReg(cats1, 'height', 'fluffiness');
  let testDiff = regressedInfo.testObjects([new Cat(4, 5, 7), new Cat(6, 5, 13)]);
  expect(Math.round(testDiff * 100) / 100).toEqual(1);
});

test('Linear regression test function works for multi dimensional regressions', () => {
  let regressedInfo = ObjLearner.runLinearReg(cats2, ['height', 'weight'], 'fluffiness');
  let testDiff = regressedInfo.testObjects([new Cat(4, 5, 13), new Cat(6, 7, 21)]);
  expect(Math.round(testDiff * 100) / 100).toEqual(1);
});

test("Logistic regression eval function predicts correctly for 1 dimensional regression - high", () => {
  let regressedInfo = ObjLearner.runLogisticReg(students1, ['SAT'], 'accepted');
  let predictedVal = regressedInfo.evalObject(new Student(1500, 3.8, false));
  expect(predictedVal > .95).toBe(true);
});

test("Logistic regression eval function predicts correctly for 1 dimensional regression - low", () => {
  let regressedInfo = ObjLearner.runLogisticReg(students1, ['SAT'], 'accepted');
  let predictedVal = regressedInfo.evalObject(new Student(100, 3.8, false));
  expect(predictedVal < .05).toBe(true);
});

test("Logistic regression eval function predicts correctly for multi dimensional regression - high", () => {
  let regressedInfo = ObjLearner.runLogisticReg(students1, ['SAT'], 'accepted');
  let predictedVal = regressedInfo.evalObject(new Student(1500, 3.8, false));
  expect(predictedVal > .95).toBe(true);
});

test("Logistic regression eval function predicts correctly for multi dimensional regression - low", () => {
  let regressedInfo = ObjLearner.runLogisticReg(students1, ['SAT', 'GPA'], 'accepted');
  let predictedVal = regressedInfo.evalObject(new Student(200, 1.2, false));
  expect(predictedVal < .05).toBe(true);
});

test("Logistic regression eval function predicts correctly for multi dimensional regression - mid", () => {
  let regressedInfo = ObjLearner.runLogisticReg(students1, ['SAT', 'GPA'], 'accepted');
  let predictedVal = regressedInfo.evalObject(new Student(860, 2.5, false));
  expect((predictedVal > .4 && predictedVal < .6)).toBe(true);
});
