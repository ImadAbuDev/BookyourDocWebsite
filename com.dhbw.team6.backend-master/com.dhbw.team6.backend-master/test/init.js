//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let assert = require('chai').assert;
let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiJWT = require('chai-jwt');
chai.use(chaiJWT);
let server = require('../dist/index').app;
let arrayContains = require('../dist/index').arrayContains;
let should = chai.should();


chai.use(chaiHttp);
  describe('Test arrayContains', () => {
    it('should return false if array empty', () => {
      assert.equal(arrayContains('test',[]), false);
    });
    it('should return false if needle empty', () => {
      assert.equal(arrayContains('',[]), false);
    });
    it('should return true if in array', () => {
      assert.equal(arrayContains('test',['test','test2']), true);
    });
    it('should return true if in array multiple times', () => {
      assert.equal(arrayContains('test',['test','test2','test']), true);
    });
    it('should return false if not in array', () => {
      assert.equal(arrayContains('test',['test3','test2']), false);
    });
  });
/*
  * Test the /GET init route
  */
  describe('/GET init', () => {
      it('should return token', (done) => {
        chai.request(server)
            .get('/init')
	    .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
		  res.body.should.have.property('token');
		  res.body.token.should.be.a.jwt;
              done();
            });
      }).timeout(1000);
  });
