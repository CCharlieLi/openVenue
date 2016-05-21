'use strict';

const chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();
const app = require('../server');
const request = require('supertest')(app);
const Person = app.models.Person;
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
          data.should.have.ownProperty('id_token');
          done(err);
        });
    });

    it('should return 409 when sign up with duplicate data', function (done) {
      request.post('/venues/addvenue')
        .type('application/json')
        .send(data)
        .expect(409)
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
