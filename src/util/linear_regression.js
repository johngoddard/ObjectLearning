let regressionHelpers = require('./regression_helpers.js');
let MatrixOps = require('matrixops');

const linearRegress = (objects, params, target, options) => {

  let defaultOpts = {alpha: .01, iter: 1000};
  let opts = Object.assign({}, defaultOpts, options);

  let normalizedData = regressionHelpers.getXFromParams(objects, params);

  const X = normalizedData.normalized;
  const y = regressionHelpers.extractParams(objects, target);
  let theta = MatrixOps.zeroes(X[0].length);

  let i = 0;

  while( i <= opts.iter ){
    theta = gradientDescent(X, y, theta, opts.alpha);
    i++;
  }

  let evalObject = _makeEvalFunction(theta, normalizedData, params);
  let testObjects = _makeTestFunction(theta, normalizedData, params, target);
  let cost = computeCost(X, y, theta);

  return {
    theta,
    evalObject,
    testObjects,
    cost
  };
};

const gradientDescent = (X, y, theta, alpha) => {
  let h = MatrixOps.multiply(X, theta);
  let diff = MatrixOps.subtract(h, y);

  let Xtrans = MatrixOps.transpose(X);
  let tau = MatrixOps.multiply(Xtrans, diff);

  let gradientStep = MatrixOps.multiply(tau, (alpha / y.length));

  return MatrixOps.subtract(theta, gradientStep);
};


const _makeTestFunction = (theta, normalizedData, params, target) => {
  return testObjs => {
    let X = regressionHelpers.extractParams(testObjs, params);
    X = regressionHelpers.normalizeTestObjs(X, normalizedData);
    X = regressionHelpers.addOnes(X);

    const y = regressionHelpers.extractParams(testObjs, target);

    return computeCost(X, y, theta);
  };
};

const computeCost = (X, y, theta) => {
  let h = MatrixOps.multiply(X, theta);
  let diff = MatrixOps.subtract(h, y);

  diff = MatrixOps.elementTransform(diff, el => Math.pow(el, 2));

  return (diff.reduce((pre, curr) => pre + curr[0], 0))/(2 * y.length);
};


const _makeEvalFunction = (theta, normalizedData, params) => {
  return object => {
    let normalizedFeatures = _extractAttrFromObject(object, normalizedData, params);
    return MatrixOps.multiply(normalizedFeatures, theta)[0];
  };
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
  linearRegress,
  computeCost,
  gradientDescent
};
