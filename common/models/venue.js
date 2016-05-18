'use strict';
const Promise = require('bluebird');

module.exports = function (Venue) {

  Venue.remoteMethod('getVenue', {
    description: 'Get venue information',
    http: { path: '/venue/:venueId', verb: 'get' },
    returns: { type: 'object', arg: 'data' },
    accepts: [
      { arg: 'venueId', type: 'string', required: true, http: { source: 'path' } }
    ]
  });

};
