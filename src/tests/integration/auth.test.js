/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');

const app = require('../../server/index');
const User = require('../../models/user.model');

const sandbox = sinon.createSandbox();

describe('Authentication API', () => {
  let dbUser;
  let user;

  beforeEach(async () => {
    dbUser = {
      email: 'santino@bank.com',
      password: 'mypassword',
      role: 'admin',
    };

    user = {
      email: 'aroh.santino@gmail.com',
      password: '123456',
      role: 'guest',
    };

    await User.remove({});
    await User.create(dbUser);
  });

  afterEach(() => sandbox.restore());

  describe('POST /auth/register', () => {
    it('should register a new User when request is ok', () => {
      return request(app)
        .post('/auth/register')
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          delete user.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(user);
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should return an accessToken when email and password matches', () => {
      return request(app)
        .post('/auth/login')
        .send(dbUser)
        .expect(httpStatus.OK)
        .then((res) => {
          delete dbUser.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(dbUser);
        });
    });
  });
  
  });
