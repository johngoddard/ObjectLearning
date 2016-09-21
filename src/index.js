let Regressor = require('./util/logistic_regression.js');

module.exports = {
  trainLinearReg: (objects, params, target, options) => {
    return Regressor.regression(objects, params, target, 'linear', options);
  },
  trainLogisticReg: (objects, params, target, options) => {
    return Regressor.regression(objects, params, target, 'logistic', options);
  }
};
