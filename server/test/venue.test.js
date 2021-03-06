'use strict';

const chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();
const app = require('../server');
const request = require('supertest')(app);
const Venue = app.models.Venue;

const data = JSON.stringify({
  data: {
    geoHash: '123456a',
    username: 'Charlie',
    password: '123456',
    wechat: '449217425',
    venueName: 'qwwe',
    other: '123',
    coordinate: {
      lng: 120,
      lat: 31
    }
  }
});

const fdata = JSON.stringify({
  data: {
    geoHash: '123456a',
    username: 'Charlie',
    password: '1234567',
    wechat: '449217425',
    venueName: 'qwwe',
    other: '123',
    coordinate: {
      lng: 120,
      lat: 31
    }
  }
});

const brokenData = JSON.stringify({
  data: {
    username: 'Charlie',
    password: '123456',
    venueName: 'qwwe',
    other: '123'
  }
});

describe('Venue API', () => {
  describe('Add Venue', () => {
    it('should return 200 when sign up data', function (done) {
      request.post('/venues/addvenue')
        .type('application/json')
        .send(data)
        .expect(200)
        .end((err, res) => {
          let data = res.body.data;
          data.Password.should.be.equal('');
          data.should.have.ownProperty('id');
          data.should.have.ownProperty('Username');
          data.should.have.ownProperty('VenueName');
          data.should.have.ownProperty('id_token');
          done(err);
        });
    });

    it('should return 200 when update data', function (done) {
      request.post('/venues/addvenue')
        .type('application/json')
        .send(data)
        .expect(200)
        .end((err, res) => {
          let data = res.body.data;
          data.Password.should.be.equal('');
          data.should.have.ownProperty('id');
          data.should.have.ownProperty('Username');
          data.should.have.ownProperty('VenueName');
          data.should.have.ownProperty('id_token');
          done(err);
        });
    });

    it('should return 403 update with wrong password', function (done) {
      request.post('/venues/addvenue')
        .type('application/json')
        .send(fdata)
        .expect(403)
        .end(done);
    });

    it('should return 400 when sign up with missing data', function (done) {
      request.post('/venues/addvenue')
        .type('application/json')
        .send(brokenData)
        .expect(400)
        .end(done);
    });

    it('should return 400 when sign up with wrong format', function (done) {
      request.post('/venues/addvenue')
        .type('application/json')
        .send(JSON.stringify({
          username: 'Charlie',
          password: '123456',
          wechat: '449217425',
          venueName: 'qwwe',
          other: '123'
        }))
        .expect(400)
        .end(done);
    });
  });

  describe('Find Venue', () => {
    // beforeEach('Flush redis', (done) => {
    //   Venue.getConnector().connect().call('flushall').then(function () {
    //     done();
    //   }, done);
    // });

    // after('Flush redis', (done) => {
    //   Venue.getConnector().connect().call('flushall').then(function () {
    //     done();
    //   }, done);
    // });

    it('should return 200 when find a saved venue', function (done) {
      request.post('/venues/findvenue')
        .type('application/json')
        .send(JSON.stringify({
          data: {
            geoHash: '123456a'
          }
        }))
        .expect(200)
        .end((err, res) => {
          let data = res.body.data;
          data.username.should.be.equal('Charlie');
          done(err);
        });
    });

    it('should return 200 when find all saved venue', function (done) {
      request.get('/venues/findallvenues')
        .expect(200)
        .end((err, res) => {
          let data = res.body.data;
          data.should.be.Array;
          done(err);
        });
    });
  });

  describe('DELETE Venue', () => {
    // beforeEach('Flush redis', (done) => {
    //   Venue.getConnector().connect().call('flushall').then(function () {
    //     done();
    //   }, done);
    // });

    // after('Flush redis', (done) => {
    //   Venue.getConnector().connect().call('flushall').then(function () {
    //     done();
    //   }, done);
    // });

    it('should return 200 when delete venue', function (done) {
      request.post('/venues/deletevenue')
        .type('application/json')

        // .set('Authorization', 'Token token=blahblahblah')
        .send(JSON.stringify({
          data: {
            geoHash: '123456a',
            venueName: 'qwwe',
            password: '123456'
          }
        }))
        .expect(200)
        .end(done);
    });
  });
});
