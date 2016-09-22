let MatrixOps = require('matrixops');

const LOG_TARGETS = [true, false, 1, 0, '1', '0'];

const extractParams = (objects, params, logisticTarget) => {

  if(!(params instanceof Array)){
    params = [params];
  }

  let returnParams = [];

  objects.forEach(obj => {
    let objParams = [];
    params.forEach(param => {
      if(obj.hasOwnProperty(param)){
        if(logisticTarget && !LOG_TARGETS.includes(obj[param])){
          throw 'Not a valid target value for logistic regression';
        }else if(logisticTarget){
          objParams.push(_logisticVal(obj[param]));
        } else{
          objParams.push(obj[param]);
        }
      } else {
        throw 'All objects must have specified paramaters';
      }
    });

    returnParams.push(objParams);
  });

  return returnParams;
};

const _logisticVal = val => {
  if(val === true || val === 1 || val === '1'){
    return 1;
  } else {
    return 0;
  }
};

const calculateMean = (arr) => {
  let sum = arr.reduce((pre, curr) => pre + curr);
  return sum / arr.length;
};

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
  normalizeFeatures,
  normalizeTestObjs
};
