'use strict';

var Regressor = require('./regression/regression.js');

module.exports = {
  trainLinearReg: function trainLinearReg(objects, params, target, options) {
    return Regressor.regression(objects, params, target, 'linear', options);
  },
  trainLogisticReg: function trainLogisticReg(objects, params, target, options) {
    return Regressor.regression(objects, params, target, 'logistic', options);
  }
};