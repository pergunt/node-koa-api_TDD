process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../src/server/index');
const sinon = require('sinon');
const queries = require('../../src/server/db/queries/users');
const passport = require('../../src/server/auth');
const store = require('../../src/server/session');
const helpers = require('../../src/server/routes/_helpers');

chai.use(chaiHttp);


describe('routes : auth --stubbed', () => {
  beforeEach(() => {
    this.ensureAuthenticated = sinon.stub(helpers, 'ensureAuthenticated').returns(() => {});
    this.store = sinon.stub(store, 'set');
    this.authenticate = sinon.stub(passport, 'authenticate').returns(() => {});
    this.serialize = sinon.stub(passport, 'serializeUser').returns(() => {});
    this.deserialize = sinon.stub(passport, 'deserializeUser').returns(() => {});
    this.serialize.yields(null, { id: 1 });
    this.deserialize.yields(null, { id: 1 });
  });

  afterEach(() => {
    this.authenticate.restore();
    this.serialize.restore();
    this.deserialize.restore();
    this.store.restore();
    this.ensureAuthenticated.restore();
  });
  describe('POST /auth/register', () => {
    beforeEach(() => {
      const user = [
        {
          id: 1,
          username: 'michael',
          password: 'something'
        }
      ];
      this.query = sinon.stub(queries, 'addUser').resolves(user);
      this.authenticate.yields(null, { id: 1 });
    });
    afterEach(() => {
      this.query.restore();
    });
    it('should register a new user', (done) => {
      chai.request(server)
        .post('/auth/register')
        .send({
          username: 'michael',
          password: 'herman'
        })
        .end((err, res) => {
          res.redirects[0].should.contain('/auth/status');
          done();
        });
    });
  });
  describe('POST /auth/login', () => {
    beforeEach(() => {
      this.authenticate.yields(null, { id: 1 });
    });
    it('should login a user', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'jeremy',
          password: 'johnson'
        })
        .end((err, res) => {
          res.redirects[0].should.contain('/auth/status');
          done();
        });
    });
  });
  describe('POST /auth/login', () => {
    beforeEach(() => {
      this.authenticate.yields(null, false);
    });
    it('should not login a user if the password is incorrect', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'jeremy',
          password: 'notcorrect'
        })
        .end((err, res) => {
          res.redirects.length.should.eql(0);
          res.status.should.eql(400);
          res.type.should.eql('application/json');
          res.body.status.should.eql('error');
          done();
        });
    });
  });
  describe('GET /auth/status', () => {
    beforeEach(() => {
      this.ensureAuthenticated.returns(true);
    });
    it('should render the status view', (done) => {
      chai.request(server)
        .get('/auth/status')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<p>You are authenticated.</p>');
          done();
        });
    });
  });

  describe('GET /auth/login', () => {
    beforeEach(() => {
      this.ensureAuthenticated.returns(true);
    });
    it('should render the status view if the user is logged in', (done) => {
      chai.request(server)
        .get('/auth/login')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(1);
          res.redirects[0].should.contain('/auth/status');
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<p>You are authenticated.</p>');
          done();
        });
    });
  });
  describe('GET /auth/login', () => {
    beforeEach(() => {
      this.ensureAuthenticated.returns(false);
    });
    it('should render the login view if a user is not logged in', (done) => {
      chai.request(server)
        .get('/auth/login')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('text/html');
          res.text.should.contain('<h1>Login</h1>');
          res.text.should.contain(
            '<p><button type="submit">Log In</button></p>');
          done();
        });
    });
  });
});
