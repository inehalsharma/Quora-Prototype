'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../index.js'); // Our node express app

describe('API endpoint /colors', function() {
  this.timeout(5001); // How long to wait for a response (ms)

  before(function() {

  });

  after(function() {

  });

  // GET - List all courses
  it('should return all session', function() {
    return chai.request(app)
      .get('/studentquizview')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });



  it('should return all profile', function() {
    return chai.request(app)
      .get('/getprofile')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });

  it('should return all list student per courses', function() {
    return chai.request(app)
      .get('/liststudentcourses')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });

  it('should return all list students assignment', function() {
    return chai.request(app)
      .get('/liststudentassignment')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });
  it('should return all assignment submitted', function() {
    return chai.request(app)
      .get('/studentassignmentview')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });
  
});