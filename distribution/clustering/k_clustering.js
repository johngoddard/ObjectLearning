'use strict';

var MatrixOps = require('matrixops');
var clusterHelpers = require('./cluster_helpers.js');
var regressionHelpers = require('../regression/regression_helpers.js');

var kclustering = function kclustering(objects, params, opts) {

  var defaultOpts = { maxIter: 100, groups: 3, groupNames: null };
  var options = Object.assign({}, defaultOpts, opts);

  var normalizedInfo = regressionHelpers.getXFromParams(objects, params, false);
  var X = normalizedInfo.normalized;

  var centroids = _initializeCentroids(X, options.groups);
  var centMap = void 0;

  var i = 0;

  while (i < options.maxIter) {
    centMap = findClosestCentroids(X, centroids);
    var newCentroids = computeMeans(X, centMap, centroids);

    if (_compareCentroids(centroids, newCentroids)) {
      break;
    }
    centroids = newCentroids;
    i++;
  }

  centMap = findClosestCentroids(X, centroids);

  var groups = mapObjectsToCentroid(centMap, objects, centroids, params, options);
  var findGroup = _makePlaceObj(normalizedInfo, groups, params, options);

  return {
    groups: groups,
    findGroup: findGroup
  };
};

function _makePlaceObj(normalizedInfo, centroidMap, params, options) {
  return function (object) {
    var minCent = null;
    var minDist = null;
    var X = regressionHelpers.extractParams([object], params, false)[0];

    var Xnorm = X.map(function (attr, idx) {
      return (attr - normalizedInfo.means[idx]) / normalizedInfo.stdDevs[idx];
    });

    Object.keys(centroidMap).forEach(function (id) {
      var cent = params.map(function (param) {
        return centroidMap[id].groupAvgs[param];
      });

      var centNorm = cent.map(function (attr, idx) {
        return (attr - normalizedInfo.means[idx]) / normalizedInfo.stdDevs[idx];
      });

      var dist = clusterHelpers.computeDist(Xnorm, centNorm);

      if (minDist !== 0 && !minDist || dist < minDist) {
        minDist = dist;
        minCent = id;
      }
    });

    return options.groupNames ? minCent : parseInt(minCent);
  };
}

var mapObjectsToCentroid = function mapObjectsToCentroid(centroidMap, objects, centroids, params, options) {
  var X = regressionHelpers.extractParams(objects, params);

  var unNormalizedCents = computeMeans(X, centroidMap, centroids);
  var centroidObjectMap = [];

  unNormalizedCents.forEach(function (cent, idx) {
    var centroidInfo = { id: idx, centroid: _formatCentroid(cent, params) };
    if (centroidMap[idx]) {
      var objs = centroidMap[idx].map(function (objIdx) {
        return objects[objIdx];
      });
      centroidInfo.objects = objs;
    } else {
      centroidInfo.objects = [];
    }
    centroidObjectMap.push(centroidInfo);
  });

  var sorted = _sortCentroidMap(centroidObjectMap, centroids);

  var finalMap = {};
  for (var i = 0; i < sorted.length; i++) {
    var key = options.groupNames ? options.groupNames[i] : i;
    finalMap[key] = { groupAvgs: centroidObjectMap[i].centroid, objects: centroidObjectMap[i].objects };
  }

  return finalMap;
};

function _sortCentroidMap(centroidMap, centroids) {
  return centroidMap.sort(function (c1, c2) {
    var cent1id = c1.id;
    var cent2id = c2.id;
    var total1 = centroids[cent1id].reduce(function (pre, curr) {
      return pre + curr;
    });
    var total2 = centroids[cent2id].reduce(function (pre, curr) {
      return pre + curr;
    });

    return total1 - total2;
  });
}

function _formatCentroid(centroid, params) {
  var formatted = {};
  params.forEach(function (param, idx) {
    formatted[param] = centroid[idx];
  });

  return formatted;
}

var mapObjectsToCentroidNorm = function mapObjectsToCentroidNorm(centroidMap, objects, centroids, X) {

  var centroidObjectMap = [];

  centroids.forEach(function (cent, idx) {
    var centroidInfo = { id: idx, centroid: cent };
    if (centroidMap[idx]) {
      var objs = centroidMap[idx].map(function (objIdx) {
        return X[objIdx];
      });
      centroidInfo.objects = objs;
    } else {
      centroidInfo.objects = [];
    }
    centroidObjectMap.push(centroidInfo);
  });

  return centroidObjectMap;
};

var computeMeans = function computeMeans(X, centroidMap, centroids) {
  var newCentroids = [];
  centroids.forEach(function (centroid, centIdx) {

    if (!centroidMap[centIdx]) {
      var shuffled = clusterHelpers.shuffle(X);
      newCentroids.push(shuffled[0]);
    } else {
      var objs = centroidMap[centIdx].map(function (idx) {
        return X[idx];
      });
      newCentroids.push(clusterHelpers.computeMean(objs));
    }
  });

  return newCentroids;
};

var findClosestCentroids = function findClosestCentroids(X, centroids) {
  var centroidIdx = {};

  X.forEach(function (row, rowIdx) {
    var minDist = null;
    var minIdx = null;

    centroids.forEach(function (centroid, centIdx) {
      var dist = clusterHelpers.computeDist(row, centroid);

      if (minDist !== 0 && !minDist || dist < minDist) {
        minDist = dist;
        minIdx = centIdx;
      }
    });

    if (centroidIdx[minIdx]) {
      centroidIdx[minIdx].push(rowIdx);
    } else {
      centroidIdx[minIdx] = [rowIdx];
    }
  });

  return centroidIdx;
};

var _initializeCentroids = function _initializeCentroids(X, numCentroids, params) {
  if (numCentroids > X.length) {
    throw 'you cannot have more centroids than data points';
  }

  var shuffled = clusterHelpers.shuffle(X);
  var centroids = [];

  for (var i = 0; i < numCentroids; i++) {
    centroids.push(shuffled[i]);
  }

  return centroids;
};

function _compareCentroids(oldCents, newCents) {
  var same = true;
  oldCents.forEach(function (row, rowIdx) {
    row.forEach(function (el, colIdx) {
      if (el !== newCents[rowIdx][colIdx]) {
        same = false;
      }
    });
  });

  return same;
}

module.exports = {
  findClosestCentroids: findClosestCentroids,
  computeMeans: computeMeans,
  kclustering: kclustering
};