'use strict';
const Promise = require('bluebird');
const httpError = require('http-errors');
const utils = require('../utils');

module.exports = (Venue) => {

  Venue.addVenue = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.username || !data.password || !data.wechat || !data.venueName ||
       !data.other || !data.coordinate || !data.geoHash) {
        reject(httpError(400, 'sign with missing data.'));
      }
    	Venue.updateOrCreate({
        id: data.geoHash,
        Username: data.username,
        Password: data.password,  // TODO: Password encryption
        Wechat: data.wechat,
        VenueName: data.venueName,
        Other: data.other,
        Coordinate: data.coordinate
      }).then((res) => {
        resolve({
          id_token: utils.createToken(data.password)
        });
      }, (err) => {
        reject(err);
      });
    });
  };

  Venue.findVenue = (data) => {
    if (!data.geoHash) {
      reject(httpError(400, 'sign with missing data.'));
    }
    return new Promise((resolve, reject) => {
      Venue.findById(data.geoHash).then(function (res) {
        if (res) {
          resolve({
            username: res.Username,
            wechat: res.Wechat,
            geoHash: res.id,
            venueName: res.VenueName,
            other: res.Other,
            coordinate: JSON.parse(res.Coordinate)
          });
        }
        reject(httpError(404));
      });
    });
  };

  Venue.findAllVenues = () => {
    return new Promise((resolve, reject) => {
      Venue.find().then(function (res) {
	    	let ret = res.map((re) => {
	        return {
	          username: re.Username,
	          wechat: re.Wechat,
	          geoHash: re.id,
	          venueName: re.VenueName,
	          other: re.Other,
	          coordinate: JSON.parse(re.Coordinate)
	        };
	      });
        resolve(ret);
      });
    });
  };

  Venue.deleteVenue = (data) => {
  	if (!data.password || !data.geoHash) {
      reject(httpError(400, 'sign with missing data.'));
    }
    return new Promise((resolve, reject) => {
      Venue.findById(data.geoHash).then(function (res) {
        if (res.Password === data.password.toString()) {
          Venue.destroyById(data.geoHash).then(function (re) {
            if (re.count === 1) {
              resolve(httpError(200, 'Venue deleted.'));
            }
          });
        } else {
          reject(httpError(404, 'Account not found.'));
        }
      });
    });
  };

  Venue.remoteMethod('addVenue', {
    description: 'add venue',
    http: { path: '/addvenue', verb: 'post' },
    returns: { type: 'object', arg: 'data' },
    accepts: [

      // { arg: 'auth', type: 'string', required: true, http: (ctx) => ctx.req.headers['Authorization'] },
      { arg: 'data', type: 'object', required: true }
    ]
  });

  Venue.remoteMethod('findVenue', {
    description: 'find one venue',
    http: { path: '/findvenue', verb: 'post' },
    returns: { type: 'object', arg: 'data' },
    accepts: [

      // { arg: 'auth', type: 'string', required: true, http: (ctx) => ctx.req.headers.authorization },
      { arg: 'data', type: 'object', required: true }
    ]
  });

  Venue.remoteMethod('findAllVenues', {
    description: 'find all venues',
    http: { path: '/findallvenues', verb: 'get' },
    returns: { type: 'object', arg: 'data' }
  });

  Venue.remoteMethod('deleteVenue', {
    description: 'delete venue',
    http: { path: '/deletevenue', verb: 'post' },
    returns: { type: 'object', arg: 'data' },
    accepts: [

      // { arg: 'auth', type: 'string', required: true, http: (ctx) => ctx.req.headers.authorization },
      { arg: 'data', type: 'object', required: true }
    ]
  });
};
