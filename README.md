# object-learning

object-learning is module that trains lightweight machine learning regression and clustering models directly from JavaScript objects.

## Usage

To install ObjectLearning, simply run:

```JavaScript
  npm install object-learning
```

### Linear Regression

You can run a normalized linear regression by running `ObjectLearning#runLinearReg`:

```JavaScript
  const ObjectLearning = require('objlearning');

  const cats = [
    {
      height: 1,
      weight: 2,
      fluffiness: 5
    },
    {
      height: 2,
      weight: 3,
      fluffiness: 8
    },
    {
      height: 5,
      weight: 6,
      fluffiness: 17
    },
  ];

  const regressionModel =
  ObjectLearning.runLinearReg(
    cats,
    ['height', 'weight'],
    'fluffiness',
    {iter: 1000, alpha: .01}
  );
```
`runLinearReg` accepts the following parameters:
- An array of objects or class objects
- An array attributes that specify the parameters the model should be trained on. Each object in the objects array must have have all of the specified attributes.
- A target parameter the model should try to predict. All objects in the array must the specified target attribute.
- An optional options objects that can specify:
  - `iter`: the number of iterations of gradient descent that should be performed when training the model.
  - `alpha`: The constant alpha that should be used for each regression gradient descent step. Use this to tune the model. Values between .1 and .001 are recommended in most scenarios.

Running the regression returns an object with the following attributes:
- `theta`: an array with the normalized parameters for the trained model. Note that the first element in the array is the constant parameter, and the second element in the array will be the parameter for the first attribute and so on.
- `evalObject`: a function that predicts the value of the target attribute value for a new object. The new object must have all of the attributes that were used to train the model.
- `testObjects`: a function that accepts a test set of objects with the required parameter and target attributes and returns the square error per test object of the model. This is useful for evaluating the accuracy of the model on data that wasn't used to train the model.
- `cost`: The square error per object for the model

Continuing from the example above:

```JavaScript
  const regressionModel = ObjectLearning.runLinearReg(cats, ['height', 'weight'], 'fluffiness', {iter: 1000, alpha: .01});

  // model is approximately fluffiness = height + 2 * weight

  regressionModel.evalObject({height: 4, weight: 5});
  // => ~14

  regressionModel.test([
    {
      height: 1,
      weight: 2,
      fluffiness: 6
    },
    {
      height: 2,
      weight: 3,
      fluffiness: 7
    },
  ]);
  // => ~1
```

### Logistic Regression

You can run a normalized logistic regression by running `ObjectLearning#runLogisticReg`:

```JavaScript
  const ObjectLearning = require('objlearning');

  const students = [
    {SAT: 1500, GPA: 3.8, acceptedToCollege: true},
    {SAT: 1200, GPA: 3.5, acceptedToCollege: true},
    {SAT: 400, GPA: 1.2, acceptedToCollege: false},
    {SAT: 900, GPA: 2.4, acceptedToCollege: false},
    {SAT: 850, GPA: 2.6, acceptedToCollege: true},
    {SAT: 950, GPA: 2.7, acceptedToCollege: true},
    {SAT: 200, GPA: 1.0, acceptedToCollege: false},
    {SAT: 1000, GPA: 3.0, acceptedToCollege: true},
    {SAT: 1040, GPA: 2.6, acceptedToCollege: true},
    {SAT: 760, GPA: 2.3, acceptedToCollege: false},
    {SAT: 660, GPA: 2.5, acceptedToCollege: false},
    {SAT: 720, GPA: 2.8, acceptedToCollege: true}
  ];

  const regressionModel =
  ObjectLearning.runLogisticReg(
    students,
    ['SAT', 'GPA'],
    'acceptedToCollege'
  );
```

The parameters for the `runLogisticReg` are identical to the parameters for `runLinearReg` with one caveat:
- For each object, the value of the target attribute must be `true`, `false`, `1`, or `0`.

The model object returned by the regression has the same attributes as the model returned by the `runLinearReg`. Note the following differences:
- The `evalObject` function will now return a number between 0 and 1 that represents the probability that the target attribute for the test object will be 1 or true.
- The `testObjects` and `cost` properties use a cost function specific to logistic regression.  

Continuing the example of above:

```JavaScript
  const regressionModel = ObjectLearning.runLogisticReg(students, ['SAT', 'GPA'], 'acceptedToCollege');

  regressionModel.evalObject({SAT: 430, GPA: 1.9});
  // => .00145...

  regressionModel.evalObject({SAT: 860, GPA: 2.5});
  // => .55366...

  regressionModel.evalObject({SAT: 1370, GPA: 3.8});
  // => .9968...
```

### k-means clustering

You can run normalized k-means clustering on a set of objects by running `ObjectLearning#runKClustering`:

```JavaScript
  const students = [
    {SAT: 1500, GPA: 3.8},
    {SAT: 1200, GPA: 3.5},
    {SAT: 1300, GPA: 3.4},
    {SAT: 400, GPA: 1.2},
    {SAT: 900, GPA: 2.4},
    {SAT: 850, GPA: 2.6},
    {SAT: 950, GPA: 2.7},
    {SAT: 200, GPA: 1.0},
    {SAT: 1000, GPA: 3.0},
    {SAT: 1040, GPA: 2.6},
    {SAT: 760, GPA: 2.3},
    {SAT: 660, GPA: 2.5},
    {SAT: 720, GPA: 2.8}
  ];

  const clusteringModel =
  ObjectLearning.runKClustering(
    students,
    ['SAT', 'GPA'],
    {
      maxIter: 100,
      groups: 3,
      groupNames: ['low', 'med', 'high']
    }
  );
```

`runKClustering` accepts the following parameters:
- An array of objects or class objects
- An array of attributes containing the parameters for the clustering
- An optional options object with the following attributes:
  - `maxIter`: The max number of times to run through the clustering analysis
  - `groups`: The number groups to cluster the objects into
  - `groupNames`: Names for the groups. Groups are sorted low to high according to total of the group average for the normalized model parameters. If no names are specified, the group names will default to 0, 1, 2...

`runKClustering` returns an object with the following attributes:
  - `groups`: An object of objects where each sub-object has the parameter averages and objects for each group.
  - `findGroup`: A function that accepts an object and returns the name of the group that the object would be part of

  Continuing the example above:

```JavaScript
  const clusteringModel = ObjectLearning.runKClustering(students, ['SAT', 'GPA'], {maxIter: 100, groups: 3, groupNames: ['low', 'med', 'high']});

  clusteringModel.findGroup({SAT: 1600, GPA: 3.9});
  // => 'high'

  clusteringModel.groups;
  // =>
  [
    {
      groupName: 'low'
      groupAvgs: { SAT: 300, GPA: 1.1 },
      objects: [
        { SAT: 400, GPA: 1.2 },
        { SAT: 200, GPA: 1.0 }
      ]
    },
    {
      groupName: 'med'
      groupAvgs: { SAT: 860, GPA: 2.6125 },
      objects: [
        { SAT: 900, GPA: 2.4 },
        { SAT: 850, GPA: 2.6},
        { SAT: 950, GPA: 2.7},
        { SAT: 1000, GPA: 3.0},
        { SAT: 1040, GPA: 2.6},
        { SAT: 760, GPA: 2.3 },
        { SAT: 660, GPA: 2.5 },
        { SAT: 720, GPA: 2.8}
      ]
    },
    {
      groupName: 'high'
      groupAvgs: { SAT: 1333.3333333333333, GPA: 3.5666666666666664 },
      objects: [
        { SAT: 1500, GPA: 3.8 },
        { SAT: 1200, GPA: 3.5 },
        { SAT: 1300, GPA: 3.4 }
      ]
    }
  ]
```

## Model implementation details

### Linear regression

The `#runLinearReg` function performs linear regression via gradient descent. First, the values for the target attributes are extracted from the objects array and normalized such that each attribute will have a mean of 0 and a standard deviation of 1.

The normalized data is then read into a 2-dimensional array, `X`, where each row represents the attributes for a given object. A columns of ones is added to the beginning of this 'matrix' to represent a constant parameter. An array of parameters, `theta`, is then initialized as an array of zeroes.

The regression then runs for a set number of steps, which can be controlled with the `iter` attribute in the options hash passed into `#runLinearReg`. For each step, gradient descent is performed, and `theta` is updated to the return value of the gradient descent function as follows:

```JavaScript

  theta = gradientDescentLinear(X, y, theta, alpha);

  function gradientDescentLinear(X, y, theta, alpha){
    let h = MatrixOps.multiply(X, theta);
    let diff = MatrixOps.subtract(h, y);

    let Xtrans = MatrixOps.transpose(X);
    let tau = MatrixOps.multiply(Xtrans, diff);

    let gradientStep = MatrixOps.multiply(tau, (alpha / y.length));

    return MatrixOps.subtract(theta, gradientStep);
  };
```

In the gradient descent function:
- `h` is a column vector that represents the hypothesis, defined as the target value for each object as predicted by the current `theta` values
- `diff` is the difference between those predicted values and the actual target value for each object (stored in the column vector `y`)
- `tau` is the result of multiplying a row representing each object's value for a given attribute by the model error, `diff`. It essentially measures the amount each attribute and corresponding theta parameter is contributing to the error of the model.  
- `tau` is then scaled by a factor of `alpha` divided by the number of objects. This scaled amount is then subtracted from theta. Note that as the regression runs, these steps should get smaller and smaller since the error, and thus `tau`, should be decreasing if a linear relationship does in fact exist in the data.

Note that the `matrixops` module is used for convenience for matrix operations.

The final values for theta are available in the object returned by `runLinearReg`, and they're closed over by the `evalObject` and `testObjects` functions returned by the regression. Note that the 2 returned functions also close over the original means and standard deviations from the data, so that new test objects can be normalized accurately.

### Logistic regression

The `runLogisticReg` function works very similarly to the `runLinearReg` function. One of the primary differences is when the hypothesis is computed in the `gradientDescentLogistic` function, the result of multiplying each objects attributes by the current `theta` values is run through the sigmoid function:

```JavaScript
  function _sigmoid(z) {
    return (1/(1 + Math.exp(-z)));
  };
```

This outputs a number a between 0 (very large negative z values) and 1 (very large positive z values), which is crucial because all of the target values in `y` are 0 or 1. Similarly, the `evalObject` and `testObjects` function run their outputs through the sigmoid function as well.

### K-means Clustering

The `runKClustering` function also starts off by extracting the model parameters from the array of objects, normalizing them, and storing them in a matrix `X`. K-means clustering is an unsupervised learning model, so there is no target parameter.

`centroids` are initialized to start at the location of random points in the data set `X`

The clustering algorithm is run for up to `maxIter` steps, which is an option that can be specified in the options object. Each step, each object is first assigned to the nearest cluster centroid:

```JavaScript
  function findClosestCentroids(X, centroids) => {
    let centroidObjectMap = {};

    X.forEach((row, rowIdx) => {
      const closestCentroidIdx = _findClosestCentroid(row, centroids);

      if(centroidObjectMap[closestCentroidIdx]) {
        centroidObjectMap[closestCentroidIdx].push(rowIdx);
      } else{
        centroidObjectMap[closestCentroidIdx] = [rowIdx];
      }
    });

    return centroidObjectMap;
  };
```

Next, the `centroids` are updated to be the average of the data points that they are closest centroids for:

```JavaScript
  function computeMeans(X, centroidMap, centroids){
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
```
Note that centroids are randomly re-initialized if they are not the closest centroid for any data point. Since each step in the clustering algorithm is deterministic, the algorithm stops if the new set of centroids in a given set equals the previous set of centroids.

The `groups` returned by the model are sorted by the sum of their normalized attributes, which might be useful in certain circumstances (for instance you might have 2 dimensional data with a linear-ish relationship).

The `findGroup` function returned by the model accepts an object, normalizes it, and finds its closest normalized centroid, returning the centroid's group name.

### Learn more

If you're interested in learning more, I highly recommend [Andrew Ng's machine learning course][classLink] on Coursera.

## Future directions

ObjectLearning is still relatively new, and there's a lot I'd like to do expand it going forward:
  - More learning model types: I'd like to expand the available models to include other common machine learning techniques like PCA, SVM, etc...
  - More powerful models: I'd also like to expand existing model functionality to make them more useful. E.g. For the regression model, I'd like it to be possible to apply additional techniques like feature mapping.


[classLink]: https://www.coursera.org/learn/machine-learning
