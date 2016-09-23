# ObjLearning

ObjLearning is module that lets you train lightweight machine learning regression and clustering models on the fly, using JavaScript syntax.

## Usage

To install ObjLearning, simply run:

```JavaScript
  npm install objlearning
```

### Linear Regression

You can run a normalized linear regression by running `ObjLearning#runLinearReg`:

```JavaScript
  const ObjLearning = require('objlearning');

  const cats = [
    {
      height: 1,
      weight: 2,
      fluffiness: 5
    },
    {
      height: 2,
      weight: 3,
      fluffiness: 5
    },
    {
      height: 5,
      weight: 6,
      fluffiness: 17
    },
  ]

  const regressionModel =
  ObjLearning.runLinearReg(
    cats,
    ['height', 'weight'],
    'fluffiness',
    {iter: 1000, alpha: .01}
  );
```
`runLinearReg` accepts the following parameters:
- An array of objects or a JavaScript objects
- An array attributes that specify the parameters the model should be trained on. Each object in the objects array must have have all of the specified attributes.
- A target parameter the model should try to predict. All objects in the array must the specified target attribute.
- An optional options array that can specify:
  - `iter`: the number of iterations of gradient descent that should be performed when training the model.
  - `alpha`: The constant alpha that should be used for each regression gradient descent step. Use this to tune the model. Values between .1 and .001 are recommended in most scenarios.

Running the regression returns an object with the following attributes:
- `theta`: an array with the normalized parameters for the models
- `evalObject`: a function that predicts the target attribute value for an object with the attributes the model was trained on
- `testObjects`: a function that accepts a test set of objects with the required parameter and target attributes and returns the square error per test object of the model
- `cost`: The square error per object for the model

Continuing from the example above:

```JavaScript
  const regressionModel = ObjLearning.runLinearReg(cats, ['height', 'weight'], 'fluffiness', {iter: 1000, alpha: .01});

  // model is approximately fluffiness = height + 2 * weight

  regressionModel.evaluate({height: 4, weight: 5})
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
  ])
  // => ~1
```

### Logistic Regression

You can run a normalized logistic regression by running `ObjLearning#runLogisticReg`:

```JavaScript
  const ObjLearning = require('objlearning');

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
  ObjLearning.runLogisticReg(
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
  const regressionModel = ObjLearning.runLogisticReg(students, ['SAT', 'GPA'], 'acceptedToCollege');

  regressionModel.evaluate({SAT: 430, GPA: 1.9});
  // => .00145...

  regressionModel.evaluate({SAT: 860, GPA: 2.5});
  // => .55366...

  regressionModel.evaluate({SAT: 1370, GPA: 3.8});
  // => .9968...
```

### k-means clustering

You can run normalized k-means clustering on a set of objects by running `ObjLearning#runKClustering`:

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
  ObjLearning.runKClustering(
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
- An optional options hash with the following arguments:
  - `maxIter`: The max number of times to run through the clustering analysis
  - `groups`: The number groups to cluster the objects into
  - `groupNames`: Names for the groups. Groups are sorted low to high according to total of the group average for the normalized model parameters. If no names are specified, the group names will default to 0, 1, 2...

`runKClustering` returns an object with the following attributes:
  - `groups`: An object of objects where each sub-object has the parameter averages and objects for each group.
  - `findGroup`: A function that accepts an object and returns the name of the cluster that the object would be part of

  Continuing the example above:

  ```JavaScript
    const clusteringModel = ObjLearning.runKClustering(students, ['SAT', 'GPA'], {maxIter: 100, groups: 3, groupNames: ['low', 'med', 'high']})

    clusteringModel.findGroup({SAT: 1600, GPA: 3.9})
    // => 'high'

    clusteringModel.groups;
    // =>
    {
      'low': {
        groupAvgs: { SAT: 350, GPA: 1.3999999999999997 },
        objects: [
          { SAT: 400, GPA: 1.2 },
          { SAT: 450, GPA: 1.9 },
          { SAT: 200, GPA: 1.1 }
        ]
      },
      'med': {
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
      'high': {
        groupAvgs: { SAT: 1333.3333333333333, GPA: 3.5666666666666664 },
        objects: [
          { SAT: 1500, GPA: 3.8 },
          { SAT: 1200, GPA: 3.5 },
          { SAT: 1300, GPA: 3.4 }
        ]
      }
    }
  ```
## Future directions

  ObjLearning is still relatively new, and there's a lot I'd like to do expand it going forward:
    - More learning model types: I'd like to expand the available models to include other common machine learning techniques like PCA, SVM, etc...
    - More powerful models: I'd also like to expand existing model functionality to make them more useful. E.g. For the regression model, I'd like it to be possible to apply additional techniques like feature mapping.
