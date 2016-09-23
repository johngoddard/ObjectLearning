'use strict';

var MatrixOps = require('matrixops');

var shuffle = function shuffle(matrix) {
  var dup = MatrixOps.elementTransform(matrix, function (el) {
    return el;
  });

  for (var i = matrix.length - 1; i > 0; i--) {
    var randIdx = Math.floor(Math.random() * (i + 1));
    var _ref = [dup[randIdx], dup[i - 1]];
    dup[i - 1] = _ref[0];
    dup[randIdx] = _ref[1];
  }

  return dup;
};

var computeDist = function computeDist(obj, centroid) {
  var dist = MatrixOps.subtract(obj, centroid);
  dist = MatrixOps.elementTransform(dist, function (el) {
    return Math.pow(el, 2);
  });
  return dist.reduce(function (accum, curr) {
    return accum + curr;
  }, 0);
};

var computeMean = function computeMean(array) {
  var arrayTrans = MatrixOps.transpose(array);
  return arrayTrans.map(function (row) {
    var sum = row.reduce(function (pre, curr) {
      return pre + curr;
    }, 0);
    return sum / row.length;
  });
};

module.exports = {
  shuffle: shuffle,
  computeDist: computeDist,
  computeMean: computeMean
};