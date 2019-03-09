const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const logger = require('../utils/logger');
const User = require('../models/User');
const Category = require('../models/Category');
const tokenService = require('../services/tokenService');
const testData = require('../utils/testData');
const baseUrl = '/api/categories';
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('Category', () => {
    let admin = null;

    before(async () => {
        try {
            await Category.deleteMany({});
            admin = new User(Object.assign(testData.getUser(), { isAdmin: true }));
            await admin.save();
        } catch (e) {
            logger.getLogger('error').error(e);
        }
    });

    describe('Create category', () => {
        it('should create a new category', async () => {
            const category = testData.getCategory();
            const res = await chai.request(app)
                .post(baseUrl)
                .send(category)
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('createdBy');
        });

        it('should not create category', async () => {

        })
    });

    describe('Get category', () => {
        let category = null;

        before(async () => {
            category = new Category(testData.getCategory());
            category.createdBy = admin;
            await category.save();
        });

        it('should return category', async () => {
            const res = await chai.request(app)
                .get(`${baseUrl}/${category._id}`);

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('object');
        });

        it('should return categories', async () => {
            const res = await chai.request(app)
                .get(baseUrl)

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('array');
        });
    });

    describe('Update category', () => {
        it('should update category', async () => {
            const category = new Category(testData.getCategory());
            category.createdBy = admin;
            await category.save();
            const updatedTitle = 'updatedTitle';

            const res = await chai.request(app)
                .put(`${baseUrl}/${category._id}`)
                .send({ title: updatedTitle })
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('title').which.equal(updatedTitle);
        });
    });

    describe('Delete category', () => {
        it('should delete category', async () => {
            const category = new Category(testData.getCategory());
            category.createdBy = admin;
            await category.save();

            const res = await chai.request(app)
                .delete(`${baseUrl}/${category._id}`)
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(204);
            res.body.should.to.be.empty;
        });
    });
});
