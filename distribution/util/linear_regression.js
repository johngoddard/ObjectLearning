'use strict';

var regressionHelpers = require('./regression_helpers.js');
var MatrixOps = require('matrixops');

var linearRegress = function linearRegress(objects, params, target, options) {

  var defaultOpts = { alpha: .01, iter: 1000 };
  var opts = Object.assign({}, defaultOpts, options);

  var normalizedData = regressionHelpers.getXFromParams(objects, params);

  var X = normalizedData.normalized;

  console.log(X);
  
  var y = regressionHelpers.extractParams(objects, target);
  var theta = MatrixOps.zeroes(X[0].length);

  var i = 0;

  while (i <= opts.iter) {
    theta = regressionHelpers.gradientDescent(X, y, theta, opts.alpha);
    i++;
  }

  var evalObject = _makeEvalFunction(theta, normalizedData, params);
  var testObjects = _makeTestFunction(theta, normalizedData, params, target);
  var cost = regressionHelpers.computeCost(X, y, theta);

  return {
    theta: theta,
    evalObject: evalObject,
    testObjects: testObjects,
    cost: cost
  };
};

var _makeTestFunction = function _makeTestFunction(theta, normalizedData, params, target) {
  return function (testObjs) {
    var X = regressionHelpers.extractParams(testObjs, params);
    X = regressionHelpers.normalizeTestObjs(X, normalizedData);
    X = regressionHelpers.addOnes(X);

    var y = regressionHelpers.extractParams(testObjs, target);

    return regressionHelpers.computeCost(X, y, theta);
  };
};

var _makeEvalFunction = function _makeEvalFunction(theta, normalizedData, params) {
  return function (object) {
    var normalizedFeatures = _extractAttrFromObject(object, normalizedData, params);
    return MatrixOps.multiply(normalizedFeatures, theta)[0];
  };
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
    }
  });

  return paramRow;
};

module.exports = {
  linearRegress: linearRegress
};
