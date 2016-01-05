var www = require("./www.js");
var compiled = _.template('hello {{user}}!');
console.log(compiled({ 'user': 'fred' }));