'use strict';

var MatrixOps = require('matrixops');
var regressionHelpers = require('./regression_helpers.js');

var regression = function regression(objects, params, target, type, options) {
  var regVariables = _getRegVariables(type);

  var defaultOpts = { alpha: regVariables.defaultAlpha, iter: 1000 };
  var opts = Object.assign({}, defaultOpts, options);
  var normalizedData = regressionHelpers.getXFromParams(objects, params, true);

  var X = normalizedData.normalized;
  var y = regressionHelpers.extractParams(objects, target, regVariables.logTarg);
  var theta = MatrixOps.zeroes(X[0].length);

  var i = 0;

  while (i < opts.iter) {
    theta = regVariables.stepFunction(X, y, theta, opts.alpha);
    i++;
  }

  var evalObject = _makeEvalFunction(theta, normalizedData, params, type);
  var testObjects = _makeTestFunction(theta, normalizedData, params, target, regVariables.costFunction);
  var cost = regVariables.costFunction(X, y, theta);

  return {
    theta: theta,
    evalObject: evalObject,
    testObjects: testObjects,
    cost: cost
  };
};

var _getRegVariables = function _getRegVariables(type) {
  if (type === 'linear') {
    return {
      stepFunction: gradientDescentLinear,
      costFunction: computeLinearCost,
      logTarg: false,
      defaultAlpha: .01
    };
  } else {
    return {
      stepFunction: gradientDescentLogistic,
      costFunction: computeLogisticCost,
      logTarg: true,
      defaultAlpha: .1
    };
  }
};

var gradientDescentLinear = function gradientDescentLinear(X, y, theta, alpha) {
  var h = MatrixOps.multiply(X, theta);
  var diff = MatrixOps.subtract(h, y);

  var Xtrans = MatrixOps.transpose(X);
  var tau = MatrixOps.multiply(Xtrans, diff);

  var gradientStep = MatrixOps.multiply(tau, alpha / y.length);

  return MatrixOps.subtract(theta, gradientStep);
};

var _makeTestFunction = function _makeTestFunction(theta, normalizedData, params, target, costFunction) {
  return function (testObjs) {
    var X = regressionHelpers.extractParams(testObjs, params);
    X = regressionHelpers.normalizeTestObjs(X, normalizedData);
    X = regressionHelpers.addOnes(X);

    var y = regressionHelpers.extractParams(testObjs, target);

    return costFunction(X, y, theta);
  };
};

var _makeEvalFunction = function _makeEvalFunction(theta, normalizedData, params, type) {
  return function (object) {
    var normalizedFeatures = _extractAttrFromObject(object, normalizedData, params);
    var predictedVal = MatrixOps.multiply(normalizedFeatures, theta)[0];

    return type === 'linear' ? predictedVal : _sigmoid(predictedVal);
  };
};

var computeLogisticCost = function computeLogisticCost(X, y, theta) {
  var h = MatrixOps.multiply(X, theta);
  h = MatrixOps.elementTransform(h, function (el) {
    return _sigmoid(el);
  });
  var yTrans = MatrixOps.transpose(y)[0];
  var hTrans = MatrixOps.transpose(h)[0];

  var costs = hTrans.map(function (predictedVal, idx) {
    return -yTrans[idx] * Math.log(hTrans[idx]) - (1 - yTrans[idx]) * Math.log(1 - hTrans[idx]);
  });

  return 1 / y.length * costs.reduce(function (pre, curr) {
    return pre + curr;
  }, 0);
};

var _sigmoid = function _sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
};

var computeLinearCost = function computeLinearCost(X, y, theta) {
  var h = MatrixOps.multiply(X, theta);
  var diff = MatrixOps.subtract(h, y);
  diff = MatrixOps.elementTransform(diff, function (el) {
    return Math.pow(el, 2);
  });

  return diff.reduce(function (pre, curr) {
    return pre + curr[0];
  }, 0) / y.length;
};

var gradientDescentLogistic = function gradientDescentLogistic(X, y, theta, alpha, type) {
  var h = MatrixOps.multiply(X, theta);
  h = MatrixOps.elementTransform(h, function (el) {
    return _sigmoid(el);
  });

  var diff = MatrixOps.subtract(h, y);

  var Xtrans = MatrixOps.transpose(X);
  var tau = MatrixOps.multiply(Xtrans, diff);

  var gradientStep = MatrixOps.multiply(tau, alpha / y.length);
  return MatrixOps.subtract(theta, gradientStep);
};

var _extractAttrFromObject = function _extractAttrFromObject(object, normalizedData, params) {
  if (!(params instanceof Array)) {
    params = [params];
  }
  var paramRow = [1];

  params.forEach(function (param, idx) {

    if (object.hasOwnProperty(param)) {
      var normalizedFeature = (object[param] - normalizedData.means[idx]) / normalizedData.stdDevs[idx];
      paramRow.push(normalizedFeature);
    } else {
      throw 'object does not have the necessary paramaters';
    };
  });

  return paramRow;
};

module.exports = {
  regression: regression,
  computeLinearCost: computeLinearCost,
  computeLogisticCost: computeLogisticCost,
  gradientDescentLinear: gradientDescentLinear,
  gradientDescentLogistic: gradientDescentLogistic
};