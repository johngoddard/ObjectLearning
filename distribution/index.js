'use strict';

var Regressor = require('./regression/regression.js');
var Clusterer = require('./clustering/k_clustering.js');

module.exports = {
  runLinearReg: function runLinearReg(objects, params, target, options) {
    return Regressor.regression(objects, params, target, 'linear', options);
  },
  runLogisticReg: function runLogisticReg(objects, params, target, options) {
    return Regressor.regression(objects, params, target, 'logistic', options);
  },
  runKClustering: function runKClustering(objects, params, options) {
    return Clusterer.kclustering(objects, params, options);
  }
};
