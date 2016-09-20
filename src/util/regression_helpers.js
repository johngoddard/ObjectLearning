const extractParams = (objects, params) => {

  if(!(params instanceof Array)){
    params = [params];
  }

  let returnParams = [];

  objects.forEach(obj => {
    let objParams = [];
    params.forEach(param => {
      if(obj.hasOwnProperty(param)){
        objParams.push(obj[param]);
      } else {
        throw 'All objects must have specified paramaters';
      }
    });

    returnParams.push(objParams);
  });

  return returnParams;
};


module.exports = {
  extractParams: extractParams
};
