'use strict';
const Promise = require('bluebird');
const httpError = require('http-errors');

module.exports = (Person) => {

  Person.addUser = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.username || !data.password || !data.wechat) {
        reject(httpError(400, 'sign with missing data.'));
      }
      Person.create({
        id: data.username,
        Username: data.username,
        Password: data.password,  // TODO: Password encryption
        Wechat: data.wechat
      }).then((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  };

  Person.deleteUser = (auth, data) => {
    //TODO: auth validation
    return new Promise((resolve, reject) => {
      Person.destroyById(data.username).then(function (res) {
        if (res.count == 1) {
          resolve(httpError(200, 'Account deleted.'));
        }
        reject(httpError(404, 'Account not found.'));
      });
    });
  };

  Person.remoteMethod('addUser', {
    description: 'sign up',
    http: { path: '/signup', verb: 'post' },
    returns: { type: 'object', arg: 'data' },
    accepts: [

      // { arg: 'auth', type: 'string', required: true, http: (ctx) => ctx.req.headers['Authorization'] },
      { arg: 'data', type: 'object', required: true }
    ]
  });

  Person.remoteMethod('deleteUser', {
    description: 'delete account',
    http: { path: '/delete', verb: 'post' },
    returns: { type: 'object', arg: 'data' },
    accepts: [
      { arg: 'auth', type: 'string', required: true, http: (ctx) => ctx.req.headers.authorization },
      { arg: 'data', type: 'object', required: true }
    ]
  });
};
