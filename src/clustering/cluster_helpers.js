const MatrixOps = require('matrixops');

const shuffle = matrix => {
  let dup = MatrixOps.elementTransform(matrix, el => el);

  for(let i = matrix.length - 1; i > 0; i--){
    const randIdx = Math.floor(Math.random() * (i + 1));
    [dup[i-1], dup[randIdx]] = [dup[randIdx], dup[i-1]];
  }

  return dup;
};

const computeDist = (obj, centroid) => {
  let dist = MatrixOps.subtract(obj, centroid);
  dist = MatrixOps.elementTransform(dist, el => Math.pow(el, 2));
  return dist.reduce((accum, curr) => accum + curr, 0);
};

const computeMean = array => {
  let arrayTrans = MatrixOps.transpose(array);
  return arrayTrans.map(row => {
    let sum = row.reduce((pre, curr) => pre + curr, 0);
    return sum / row.length;
  });
};

module.exports = {
  shuffle,
  computeDist,
  computeMean
};
