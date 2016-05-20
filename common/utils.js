const jwt = require('jsonwebtoken');
const app = require('../server/server');

exports.createToken = (pwd) => {
  var token = jwt.sign(pwd, app.get('secretKey'));
  return token;
};
