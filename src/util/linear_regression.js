let regressionHelpers = require('./regression_helpers.js');
let MatrixOps = require('matrixops');

let Cat = require('../test_utils/cats.js');
let cats = [new Cat(1, 10, 2), new Cat(5, 9, 10), new Cat(2, 10, 4), new Cat(3, 9, 6) ];

const linearRegress = (objects, params, target, options) => {

  let defaultOpts = {alpha: .03, iter: 1000};
  let opts = Object.assign({}, defaultOpts, options);

  let normalizedData = regressionHelpers.getXFromParams(objects, params);

  const X = normalizedData.normalized;
  const y = regressionHelpers.extractParams(objects, target);
  let theta = MatrixOps.zeroes(X[0].length);

  let i = 0;

  while( i <= opts.iter ){
    theta = gradientDescent(X, y, theta, opts.alpha);
    i++;
    // console.log(regressionHelpers.computeCost(X, y, theta));
  }

  let evalObject = _makeEvalFunction(theta, normalizedData, params);
  let testObjects = _makeTestFunction(theta, normalizedData, params, target);

  return {
    theta,
    evalObject,
    testObjects
  };
};


const _makeTestFunction = (normalizedData, theta, params, target) => {
  return testObjs => {
    let X = regressionHelpers.extractParams(testObjs, params);
    X = regressionHelpers.normalizeTestObjs(testObjs, normalizedData);
    X = regressionHelpers.addOnes(X);

    const y = regressionHelpers.extractParams(testObjs, target);

    return regressionHelpers.computeCost(X, y, theta);
  };
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
    }
  });

  return paramRow;
};


const gradientDescent = (X, y, theta, alpha) => {
  let h = MatrixOps.multiply(X, theta);
  let diff = MatrixOps.subtract(h, y);



  let Xtrans = MatrixOps.transpose(X);
  let tau = MatrixOps.multiply(Xtrans, diff);

  let gradientStep = MatrixOps.multiply(tau, (alpha / y.length));

  return MatrixOps.subtract(theta, gradientStep);
};

module.exports = {
  gradientDescent,
  linearRegress
};
