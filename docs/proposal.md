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
- `Matrix#add`: Accepts a number or another Matrix object. Adds the number as a scalar to each element in the matrix, or adds the two matrices depending on input type.
- `Matrix#subtract`: Accepts a number or another Matrix object. Subtracts the number as a scalar to each element in the matrix, or subtracts the two matrices depending on input type. 



### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running. Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 3 scripts outlined above.  Goals for the day:

- [x] Get a green bundle with `webpack`
- [x] Render a canvas with moving predators and pray.

**Day 2**: Handle collision and dying events in the simulation. Set up recording population / average speed data.

- [x] Complete the `predator.js` and `prey.js` classes, including inheritance models and AI for movement
- [x] Record data at every step (log it in console for now)

**Day 3**: Live updating graphs.

- [x] Learn highcharts API
- [x] Render graphs on the page with live updating population and average speed information.
- [x] Fine tune simulation initialization


**Day 4**: Add simulation controls.  Style the frontend, and add an introdution:

- [x] Create controls for simulation speed, mutation rate, and generation time
- [x] Syle objects
- [x] Add an information modal.


### Bonus features

There are many directions this cellular automata engine could eventually go.  Some anticipated updates are:

- [ ] Animated introduction
- [x] More simulation controls
- [ ] Evolving predators

[wireframes]: ./evolutionjs.png
