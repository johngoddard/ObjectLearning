const Regressor = require('./regression/regression.js');
const Clusterer = require('./clustering/k_clustering.js');

module.exports = {
  runLinearReg: (objects, params, target, options) => {
    return Regressor.regression(objects, params, target, 'linear', options);
  },
  runLogisticReg: (objects, params, target, options) => {
    return Regressor.regression(objects, params, target, 'logistic', options);
  },
  runKClustering: (objects, params, options) => {
    return Clusterer.kclustering(objects, params, options);
  }
};
