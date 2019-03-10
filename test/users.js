const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../app');
const logger = require('../utils/logger');
const User = require('../models/User');
const tokenService = require('../services/tokenService');
const baseUrl = '/api/users';
const testData = require('../utils/testData');

chai.use(chaiHttp);
chai.should();

describe('User', () => {
    let admin = null;

    before(async () => {
        try {
            await User.deleteMany({});
            admin = new User(Object.assign(testData.getUser(), { isAdmin: true }));
            await admin.save();
        } catch (e) {
            logger.getLogger('error').error(e);
        }
    });

    describe('Create user', () => {
        it('should create a new user', async () => {
            const user = testData.getUser();

            const res = await chai.request(app)
                .post(baseUrl)
                .attach('avatar', fs.readFileSync('test/data/images/avatar.png'), 'avatar.jpg')
                .type('form')
                .field('name', user.name)
                .field('email', user.email)
                .field('psw', user.psw)
                .field('confirmPsw', user.psw);

            res.should.have.status(201);
            res.should.be.json;
            res.should.have.header('x-auth-token');
            res.body.should.be.an('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('imgPath');
        });

        it('should not create user without email', async () => {

        });

        it('should not create user with differnt psw and comparePsw', async () => {

        });
    });

    describe('Get user', () => {
        let user = null;

        before(async () => {
            user = new User(testData.getUser());
            await user.save();
        });

        it('should return user info', async () => {
            const res = await chai.request(app)
                .get(`${baseUrl}/${user._id}`)
                .set('authorization', `Bearer ${tokenService.getToken(user)}`);

            res.should.have.status(200);
            res.should.be.json;
        });

        it('should return users', async () => {
            const res = await chai.request(app)
                .get(baseUrl)
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(200);
            res.should.be.json;
        });
    });

    describe('Update user', () => {
        let userData = null;
        let user = null;

        before(async () => {
            userData = testData.getUser();
            user = new User(userData);
            await user.save();
        });

        it('should update user', async () => {
            const name = 'New name';
            const res = await chai.request(app)
                .put(`${baseUrl}/${user._id}`)
                .send({
                    name
                })
                .set('authorization', `Bearer ${tokenService.getToken(user)}`);

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('name').which.equal(name);
        });

        it('should change user\'s password', async () => {
            const newPsw = '//newPsw';
            const res = await chai.request(app)
                .put(`${baseUrl}/${user._id}/changepsw`)
                .send({
                    currentPsw: userData.psw,
                    newPsw: newPsw,
                    confirmPsw: newPsw
                })
                .set('authorization', `Bearer ${tokenService.getToken(user)}`);

            res.should.have.status(204);
        });
    });

    describe('Delete user', () => {
        let user = null;

        before(async () => {
            user = new User(testData.getUser());
            await user.save();
        });

        it('should delete user', async () => {
            const res = await chai.request(app)
                .delete(`${baseUrl}/${user._id}`)
                .set('authorization', `Bearer ${tokenService.getToken(user)}`);

            res.should.have.status(204);
            res.body.should.to.be.empty;
        });
    });

    describe('User login', () => {
        it('should user login', async () => {
            const userData = testData.getUser();
            const user = new User(userData);
            await user.save();

            const res = await chai.request(app)
                .post(`${baseUrl}/signin`).send({
                    email: userData.email,
                    psw: userData.psw
                });

            res.should.have.status(200);
            res.should.have.header('x-auth-token');
        });
    });
});
