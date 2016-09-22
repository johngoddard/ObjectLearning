const MatrixOps = require('matrixops');
const clusterHelpers = require('./cluster_helpers.js');
const regressionHelpers = require('../regression/regression_helpers.js');

const kclustering = (objects, params, opts) => {

  const defaultOpts = {iter: 100, centroids: 3};
  let options = Object.assign({}, defaultOpts, opts);

  let normalizedInfo = regressionHelpers.getXFromParams(objects, params, false);
  let X = normalizedInfo.normalized;

  let centroids = _initializeCentroids(objects, options.centroids);
  let centMap;

  let i = 0;

  while(i < options.iter){
    centMap = findClosestCentroids(X, centroids);
    centroids = computeMeans(X, centMap, centroids);
    i++;
  }

  centMap = findClosestCentroids(X, centroids);

  const groups = mapObjectsToCentroid(centMap, objects, centroids, params);
  const findGroup = _makePlaceObj(normalizedInfo, groups, params);

  return {
    groups,
    findGroup
  };

};


function _makePlaceObj(normalizedInfo, centroidMap, params){
  return object => {
    let minCent = null;
    let minDist = null;
    let X = regressionHelpers.extractParams([object], params, false)[0];

    let Xnorm = X.map((attr, idx) => {
      return (attr - normalizedInfo.means[idx])/normalizedInfo.stdDevs[idx];
    });

    Object.keys(centroidMap).forEach(id => {
      let cent = params.map(param => {
        return centroidMap[id].centroid[param];
      });

      let centNorm = cent.map((attr, idx) => {
        return (attr - normalizedInfo.means[idx])/normalizedInfo.stdDevs[idx];
      });

      let dist = clusterHelpers.computeDist(Xnorm, centNorm);

      if((minDist !== 0 && !minDist) || dist < minDist){
        minDist = dist;
        minCent = id;
      }
    });

    return parseInt(minCent);
  };
}

const mapObjectsToCentroid = (centroidMap, objects, centroids, params) => {
  let X = regressionHelpers.extractParams(objects, params);

  let unNormalizedCents = computeMeans(X, centroidMap, centroids);
  let centroidObjectMap = [];

  unNormalizedCents.forEach((cent, idx) => {
    let centroidInfo = {id: idx, centroid: _formatCentroid(cent, params)};
    if(centroidMap[idx]){
      let objs = centroidMap[idx].map(objIdx => objects[objIdx]);
      centroidInfo.objects = objs;
    } else {
      centroidInfo.objects = [];
    }
    centroidObjectMap.push(centroidInfo);
  });

  let sorted = _sortCentroidMap(centroidObjectMap, centroids);

  let finalMap = {};
  for(let i = 0; i < sorted.length; i++){
    finalMap[i] = {centroid: centroidObjectMap[i].centroid, objects: centroidObjectMap[i].objects};
  }

  return finalMap;
};

function _sortCentroidMap(centroidMap, centroids){
  return centroidMap.sort((c1, c2) => {
    let cent1id = c1.id;
    let cent2id = c2.id;
    let total1 = centroids[cent1id].reduce((pre, curr) => pre + curr);
    let total2 = centroids[cent2id].reduce((pre, curr) => pre + curr);

    return total1 - total2;
  });
}

function _formatCentroid(centroid, params) {
  let formatted = {};
  params.forEach((param, idx) => {
    formatted[param] = centroid[idx];
  });

  return formatted;
}

const mapObjectsToCentroidNorm = (centroidMap, objects, centroids, X) => {

  let centroidObjectMap = [];

  centroids.forEach((cent, idx) => {
    let centroidInfo = {id: idx, centroid: cent};
    if(centroidMap[idx]){
      let objs = centroidMap[idx].map(objIdx => X[objIdx]);
      centroidInfo.objects = objs;
    } else {
      centroidInfo.objects = [];
    }
    centroidObjectMap.push(centroidInfo);
  });

  return centroidObjectMap;
};

const computeMeans = (X, centroidMap, centroids) => {
  let newCentroids = [];
  centroids.forEach((centroid, centIdx) => {

    if(!centroidMap[centIdx]){
      const shuffled = clusterHelpers.shuffle(X);
      newCentroids.push(shuffled[0]);
    } else {
      const objs = centroidMap[centIdx].map(idx => X[idx]);
      newCentroids.push(clusterHelpers.computeMean(objs));
    }
  });

  return newCentroids;
};

const findClosestCentroids = (X, centroids) => {
  let centroidIdx = {};

  X.forEach((row, rowIdx) => {
    let minDist = null;
    let minIdx = null;

    centroids.forEach((centroid, centIdx) => {
      let dist = clusterHelpers.computeDist(row, centroid);

      if((minDist !== 0 && !minDist) || dist < minDist){
        minDist = dist;
        minIdx = centIdx;
      }
    });

    if(centroidIdx[minIdx]) {
      centroidIdx[minIdx].push(rowIdx);
    } else{
      centroidIdx[minIdx] = [rowIdx];
    }
  });

  return centroidIdx;
};


const _initializeCentroids = (X, numCentroids) => {
  if(numCentroids > X.length){
    throw 'you cannot have more centroids than data points';
  }

  const shuffled = clusterHelpers.shuffle(X);
  const centroids = [];

  for(let i = 0; i < numCentroids; i++){
    centroids.push(shuffled[i]);
  }

  return centroids;
};


module.exports = {
  findClosestCentroids,
  computeMeans,
  kclustering
};
