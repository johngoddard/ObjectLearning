'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var MatrixOps = require('matrixops');

var extractParams = function extractParams(objects, params) {

  if (!(params instanceof Array)) {
    params = [params];
  }

  var returnParams = [];

  objects.forEach(function (obj) {
    var objParams = [];
    params.forEach(function (param) {
      if (obj.hasOwnProperty(param)) {
        objParams.push(obj[param]);
      } else {
        throw 'All objects must have specified paramaters';
      }
    });

    returnParams.push(objParams);
  });

  return returnParams;
};

var calculateMean = function calculateMean(arr) {
  var sum = arr.reduce(function (pre, curr) {
    return pre + curr;
  });
  return sum / arr.length;
};

var calculateSTD = function calculateSTD(arr, mean) {
  var sumDiff = arr.reduce(function (pre, curr) {
    return pre + Math.pow(curr - mean, 2);
  }, 0);

  return Math.sqrt(sumDiff / arr.length);
};

var addOnes = function addOnes(arr) {
  return arr.map(function (row) {
    return [1].concat(_toConsumableArray(row));
  });
};

var normalizeFeatures = function normalizeFeatures(params) {
  var transpose = MatrixOps.transpose(params);

  var means = transpose.map(function (row) {
    return calculateMean(row);
  });

  var stdDevs = transpose.map(function (row, idx) {
    return calculateSTD(row, means[idx]);
  });

  var normalized = params.map(function (row, idx) {
    var newRow = MatrixOps.matrixElementCalc(row, means, function (param, mean) {
      return param - mean;
    });

    newRow = MatrixOps.matrixElementCalc(newRow, stdDevs, function (param, stdDev) {
      return param / stdDev;
    });

    return newRow;
  });

  return { means: means, stdDevs: stdDevs, normalized: addOnes(normalized) };
};

var getXFromParams = function getXFromParams(objects, params) {
  var X = extractParams(objects, params);
  return normalizeFeatures(X);
};

var computeCost = function computeCost(X, y, theta) {
  var h = MatrixOps.multiply(X, theta);
  var diff = MatrixOps.subtract(h, y);

  diff = MatrixOps.elementTransform(diff, function (el) {
    return Math.pow(el, 2);
  });

  return diff.reduce(function (pre, curr) {
    return pre + curr[0];
  }, 0) / (2 * y.length);
};

var normalizeTestObjs = function normalizeTestObjs(testObjs, normalizedData) {
  var newObjs = [];

  testObjs.forEach(function (row) {
    var newRow = [];
    row.forEach(function (attr, idx) {
      newRow.push((attr - normalizedData.means[idx]) / normalizedData.stdDevs[idx]);
    });

    newObjs.push(newRow);
  });

  return newObjs;
};

var gradientDescent = function gradientDescent(X, y, theta, alpha) {
  var h = MatrixOps.multiply(X, theta);
  var diff = MatrixOps.subtract(h, y);

  var Xtrans = MatrixOps.transpose(X);
  var tau = MatrixOps.multiply(Xtrans, diff);

  var gradientStep = MatrixOps.multiply(tau, alpha / y.length);

  return MatrixOps.subtract(theta, gradientStep);
};

module.exports = {
  extractParams: extractParams,
  calculateMean: calculateMean,
  calculateSTD: calculateSTD,
  addOnes: addOnes,
  getXFromParams: getXFromParams,
  computeCost: computeCost,
  normalizeFeatures: normalizeFeatures,
  normalizeTestObjs: normalizeTestObjs,
  gradientDescent: gradientDescent
};