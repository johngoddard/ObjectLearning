const MatrixOps = require('matrixops');
const regressionHelpers = require('./regression_helpers.js');

const regression = (objects, params, target, type, options) => {
  const regVariables = _getRegVariables(type);

  let defaultOpts = {alpha: regVariables.defaultAlpha, iter: 1000};
  let opts = Object.assign({}, defaultOpts, options);
  let normalizedData = regressionHelpers.getXFromParams(objects, params, true);

  const X = normalizedData.normalized;
  const y = regressionHelpers.extractParams(objects, target, regVariables.logTarg);
  let theta = MatrixOps.zeroes(X[0].length);

  let i = 0;

  while( i < opts.iter ){
    theta = regVariables.stepFunction(X, y, theta, opts.alpha);
    i++;
  }

  let evalObject = _makeEvalFunction(theta, normalizedData, params, type);
  let testObjects = _makeTestFunction(theta, normalizedData, params, target, regVariables.costFunction);
  let cost = regVariables.costFunction(X, y, theta);

  return {
    theta,
    evalObject,
    testObjects,
    cost
  };
};

const _getRegVariables = type => {
  if(type === 'linear'){
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

const gradientDescentLinear = (X, y, theta, alpha) => {
  let h = MatrixOps.multiply(X, theta);
  let diff = MatrixOps.subtract(h, y);

  let Xtrans = MatrixOps.transpose(X);
  let tau = MatrixOps.multiply(Xtrans, diff);

  let gradientStep = MatrixOps.multiply(tau, (alpha / y.length));

  return MatrixOps.subtract(theta, gradientStep);
};

const _makeTestFunction = (theta, normalizedData, params, target, costFunction) => {
  return testObjs => {
    let X = regressionHelpers.extractParams(testObjs, params);
    X = regressionHelpers.normalizeTestObjs(X, normalizedData);
    X = regressionHelpers.addOnes(X);

    const y = regressionHelpers.extractParams(testObjs, target);

    return costFunction(X, y, theta);
  };
};

const _makeEvalFunction = (theta, normalizedData, params, type) => {
  return object => {
    let normalizedFeatures = _extractAttrFromObject(object, normalizedData, params);
    let predictedVal = MatrixOps.multiply(normalizedFeatures, theta)[0];

    return type === 'linear' ? predictedVal : _sigmoid(predictedVal);
  };
};

const computeLogisticCost = (X, y, theta) => {
  let h = MatrixOps.multiply(X, theta);
  h = MatrixOps.elementTransform(h, el => _sigmoid(el));
  let yTrans = MatrixOps.transpose(y)[0];
  let hTrans = MatrixOps.transpose(h)[0];

  let costs = hTrans.map((predictedVal, idx) => {
    return (-yTrans[idx]*Math.log(hTrans[idx]) - (1 - yTrans[idx])*Math.log(1 - hTrans[idx]));
  });

  return (1/y.length)*costs.reduce((pre, curr) => pre + curr, 0);
};

const _sigmoid = z => {
  return (1/(1 + Math.exp(-z)));
};

const computeLinearCost = (X, y, theta) => {
  let h = MatrixOps.multiply(X, theta);
  let diff = MatrixOps.subtract(h, y);

  diff = MatrixOps.elementTransform(diff, el => Math.pow(el, 2));

  return (diff.reduce((pre, curr) => pre + curr[0], 0))/(y.length);
};

const gradientDescentLogistic = (X, y, theta, alpha, type) => {
  let h = MatrixOps.multiply(X, theta);
  h = MatrixOps.elementTransform(h, el => _sigmoid(el));

  let diff = MatrixOps.subtract(h, y);

  let Xtrans = MatrixOps.transpose(X);
  let tau = MatrixOps.multiply(Xtrans, diff);

  let gradientStep = MatrixOps.multiply(tau, (alpha / y.length));
  return MatrixOps.subtract(theta, gradientStep);
};

const _extractAttrFromObject = (object, normalizedData, params) => {
  if(!(params instanceof Array)){
    params = [params];
  }
  let paramRow = [1];

  params.forEach((param, idx) => {

    if(object.hasOwnProperty(param)){
      let normalizedFeature = (object[param] - normalizedData.means[idx])/normalizedData.stdDevs[idx];
      paramRow.push(normalizedFeature);
    } else{
      throw 'object does not have the necessary paramaters';
    };
  });

  return paramRow;
};

module.exports = {
  regression,
  computeLinearCost,
  computeLogisticCost,
  gradientDescentLinear,
  gradientDescentLogistic
}
