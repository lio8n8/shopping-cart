const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const logger = require('../utils/logger');
const User = require('../models/User');
const baseUrl = '/api/users';
const testData = require('../utils/testData');

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
        it('should create a new user', async () => {
            const user = testData.getUser();
            user.confirmPsw = user.psw;
            const res = await chai.request(app)
                .post(baseUrl)
                .send(user);

            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('_id');
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
                .get(`${baseUrl}/${user._id}`);

            res.should.have.status(200);
            res.should.be.json;
        });

        it('should return users', async () => {
            const res = await chai.request(app)
                .get(baseUrl);

            res.should.have.status(200);
            res.should.be.json;
        });
    });

    describe('Update user', () => {
        let user = null;

        before(async () => {
            user = new User(testData.getUser());
            await user.save();
        });

        it('should update user', async () => {
            const name = 'New name';
            const res = await chai.request(app)
                .put(`${baseUrl}/${user._id}`)
                .send({
                    name
                });

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('name').which.equal(name);
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
                .delete(`${baseUrl}/${user._id}`);

            res.should.have.status(204);
            res.body.should.to.be.empty;
        });
    });
});
