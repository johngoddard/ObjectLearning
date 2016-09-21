let MatrixOps = require('matrixops');

const extractParams = (objects, params) => {

  if(!(params instanceof Array)){
    params = [params];
  }

  let returnParams = [];

  objects.forEach(obj => {
    let objParams = [];
    params.forEach(param => {
      if(obj.hasOwnProperty(param)){
        objParams.push(obj[param]);
      } else {
        throw 'All objects must have specified paramaters';
      }
    });

    returnParams.push(objParams);
  });

  return returnParams;
};

const calculateMean = (arr) => {
  let sum = arr.reduce((pre, curr) => pre + curr);
  return sum / arr.length;
}

const calculateSTD = (arr, mean) => {
  let sumDiff = arr.reduce((pre, curr) => {
    return pre + Math.pow((curr - mean), 2);
  }, 0);

  return Math.sqrt(sumDiff/arr.length);
}

const addOnes = arr => {
  return arr.map(row => [1, ...row]);
}

const normalizeFeatures = params => {
  let transpose = MatrixOps.transpose(params);

  let means = transpose.map(row => {
    return calculateMean(row);
  });

  let stdDevs = transpose.map((row, idx) => {
    return calculateSTD(row, means[idx]);
  });

  let normalized = params.map((row, idx) => {
    let newRow = MatrixOps.matrixElementCalc(row, means, (param, mean) => {
      return param - mean;
    });

    newRow = MatrixOps.matrixElementCalc(newRow, stdDevs, (param, stdDev) => {
      return param/stdDev;
    });

    return newRow;
  });

  return {means, stdDevs, normalized: addOnes(normalized)};
};

const getXFromParams = (objects, params) => {
  let X = extractParams(objects, params);
  return normalizeFeatures(X);
}


const computeCost = (X, y, theta) => {
  let h = MatrixOps.multiply(X, theta);
  let diff = MatrixOps.subtract(h, y);

  diff = MatrixOps.elementTransform(diff, el => Math.pow(el, 2));

  return (diff.reduce((pre, curr) => pre + curr[0], 0))/(2 * y.length);
};

const normalizeTestObjs = (testObjs, normalizedData) => {
  let newObjs = [];

  testObjs.forEach(row => {
    let newRow = [];
    row.forEach((attr, idx) => {
      newRow.push((attr - normalizedData.means[idx])/normalizedData.stdDevs[idx]);
    });

    newObjs.push(newRow);
  });

  return newObjs;
};

module.exports = {
  extractParams,
  calculateMean,
  calculateSTD,
  addOnes,
  getXFromParams,
  computeCost,
  normalizeFeatures,
  normalizeTestObjs
};
