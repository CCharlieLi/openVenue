'use strict';

const chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();
const app = require('../server');
const request = require('supertest')(app);
const Person = app.models.Person;

describe('Person API', () => {
  describe('POST /signup', () => {
    it('should return 200 when sign up data', function (done) {
      request.post('/api/people/signup')
        .type('application/json')
        .send(JSON.stringify({
          data: {
            username: 'Charlie',
            password: '123456',
            wechat: '449217425'
          }
        }))
        .expect(200)
        .end((err, res) => {
          let data = res.body.data;
          data.id.should.be.equal('Charlie');
          data.Username.should.be.equal('Charlie');
          data.Password.should.be.equal('123456');
          data.Wechat.should.be.equal('449217425');
          done(err);
        });
    });

    it('should return 409 when sign up with duplicate data', function (done) {
      request.post('/api/people/signup')
        .type('application/json')
        .send(JSON.stringify({
          data: {
            username: 'Charlie',
            password: '123456',
            wechat: '449217425'
          }
        }))
        .expect(409)
        .end(done);
    });

    it('should return 400 when sign up with missing data', function (done) {
      request.post('/api/people/signup')
        .type('application/json')
        .send(JSON.stringify({
          data: {
            username: 'Charlie',
            password: '123456'
          }
        }))
        .expect(400)
        .end(done);
    });

    it('should return 400 when sign up with wrong format', function (done) {
      request.post('/api/people/signup')
        .type('application/json')
        .send(JSON.stringify({
          username: 'Charlie',
          password: '123456',
          wechat: '449217425'
        }))
        .expect(400)
        .end(done);
    });
  });

  describe('DELETE /delete', () => {
    it('should return 200 when delete user', function (done) {
      request.post('/api/people/delete')
        .type('application/json')
        .set('Authorization', 'Token token=blahblahblah')
        .send(JSON.stringify({
          data: {
            username: 'Charlie'
          }
        }))
        .expect(200)
        .end(done);
    });
  });
});
