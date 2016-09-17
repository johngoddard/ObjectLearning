## Visual Evolution simulation

### Background

The goal of this project is to create a JavaScript utility library that makes it easier to perform matrix operations on multi-dimensional arrays, and then to build some light machine learning tools on top of that which allow you to perform various regressions and analyses on arrays of JavaScript object.

I see a few potential uses for the library:
- It'll make it easier for someone familiar with a math scripting language (like MATLAB) to do math in the browser.
- It'll make it possible to dynamically do some basic analysis on sets of objects in the browser

### Functionality & MVP  

The following are the core pieces of functionality:

- [ ] Library that allows users to create a Matrix object from an array of arrays and do basic matrix operations on them (adding, subtracting, multiplying, and doing   matrices, adding a scalar to a matrix, subtraction, multiplication, and element-wise opeartions)
- [ ] Linear regression that takes in an array of objects, an array of parameter attributes, and a target attribute
- [ ] Logistic regression that takes in an array of objects, an array of parameter attributes, and a target attribute
- [ ] K-means clustering that takes in an array of objects, and 2 parameter attributes as arguments

### Wireframes

This will be a single page app where the bulk of the space is taken up by the simulation canvas area. Controls on the left will allow the user to change certain simulation parameters. Charts on the bottom will update as the simulation runs. The charts will show populations and average fitness vs. generation.

![wireframes]

### Architecture and Technologies

This project will primarily use JavaScript and the Math library.

For matrix operations, I will create a `Matrix` class with the following methods:
- `Matrix#constructor`: Accepts an array or array of arrays and returns a new matrix object.
- `Matrix#add`: Accepts a number or another Matrix object. Adds the number as a scalar to each element in the matrix, or adds the two matrices depending on input type. Returns a new matrix object.
- `Matrix#subtract`: Accepts a number or another Matrix object. Subtracts the number as a scalar to each element in the matrix, or subtracts the two matrices depending on input type. Returns a new matrix object.
- `Matrix#multiply`: Accepts another matrix object. Verifies dimensionality and returns the product of the matrices as a new matrix object.
- `Matrix#dimensions`: Returns the dimensions of the matrix as an array ([rows, cols]).

For Linear regression, I will create a `LinearRegressor` class with the following methods:
-`LinearRegressor#train`: Accepts an array of JavaScript objects, an array of parameter attributes (attributes of the object), and the target attribute. Performs regression via gradient descent, and returns an object with keys for theta values for the parameters, and an `evaluate` function which does the following:
-`evaluate`: Accepts an object with the same attributes that were used to train the model, and returns the result of running that object's attribute values through the created model.

For Logistic regression, I will create a `LogisticRegressor` class with the following methods:
-`LogisticRegressor#train`: Accepts an array of JavaScript objects, an array of parameter attributes (attributes of the object), and the target attribute. Performs regression via gradient descent, and returns an object with keys for theta values for the parameters, and an `evaluate` function which does the following:
-`evaluate`: Accepts an object with the same attributes that were used to train the model, and returns the result of running that object's attribute values through the created model.

For k-means clustering, I will create a `Clusterer` class with the following methods:
-`Cluster#evaluate`: Accepts an array of JavaScript objects, 2 attributes, and number for `numClusters`. Performs iterative k-means clustering, and returns an array of `numClusters` arrays that contain the objects that were passed in broken down into the specified number of clusters.

### Implementation Timeline

**Day 1**: Figure out how to get an npm library up and running
- [ ] Set up skeleton for npm library
- [ ] Create `Matrix` class

**Day 2**: Finish `Matrix` class

- [ ] Implement all methods for `Matrix` class

**Day 3**: Implement linear regression

- [ ] Implement linear regression class
- [ ] Test to ensure accuracy

**Day 4**: Implement logistic regression

- [ ] Implement logistic regression class
- [ ] Test to ensure accuracy

**Day 5**: Implement k-means clustering

- [ ] Implement k-means clustering class
- [ ] Test to ensure accuracy


### Bonus features

Some anticipated future extensions include the following:

- [ ] More matrix operations (e.g. determinants, eigen values )
- [ ] More ML algorithms
- [ ] multi-dimensional k-clustering
