const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const logger = require('../utils/logger');
const User = require('../models/User');
const baseUrl = '/api/users';
// const auth = require('../services/auth');
// const faker = require('../services/faker');

chai.use(chaiHttp);
chai.should();

describe('User', () => {
    before(async () => {
        try {
            await User.deleteMany({});
        } catch (e) {
            logger.getLogger('error').error(e);
        }
    });

    describe('Create user', () => {
        it('should create user', async () => {

        });

        it('should not create user without email', async () => {

        });

        it('should not create user with differnt psw and comparePsw', async () => {

        });
    });

    describe('Get user', () => {
        it('should return user info', async () => {

        });
    });

    describe('Update user', () => {
        it('should update user', async () => {

        });
    });
});
