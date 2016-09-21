let Regressor = require('./regression/regression.js');

module.exports = {
  trainLinearReg: (objects, params, target, options) => {
    return Regressor.regression(objects, params, target, 'linear', options);
  },
  trainLogisticReg: (objects, params, target, options) => {
    return Regressor.regression(objects, params, target, 'logistic', options);
  }
};
