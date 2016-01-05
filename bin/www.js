
GLOBAL._ = require('lodash'); // BAD PRACTICE but necessary and harmless in this case.
_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

var t = _.template(str);
console.log(t(require('../src/conf/hapi-conf')));
require('../src/server.js');