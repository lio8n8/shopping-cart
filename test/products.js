const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const logger = require('../utils/logger');
const Product = require('../models/Product');
const User = require('../models/User');
const tokenService = require('../services/tokenService');
const baseUrl = '/api/products';
const testData = require('../utils/testData');

chai.use(chaiHttp);
chai.should();

describe('Product', () => {
    let admin = null;

    before(async () => {
        try {
            admin = new User(Object.assign(testData.getUser(), { isAdmin: true }));
            await admin.save();
            await Product.deleteMany({});
        } catch (e) {
            logger.getLogger('error').error(e);
        }
    });

    describe('Create product', () => {
        it('should return a new product', async () => {
            const product = testData.getProduct();
            const res = await chai.request(app)
                .post(baseUrl)
                .send(product)
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('_id');
        });
    });

    describe('Get product', () => {
        let product = null;

        before(async () => {
            product = new Product(testData.getProduct());
            await product.save();
        });

        it('should return product', async () => {
            const res = await chai.request(app)
                .get(`${baseUrl}/${product._id}`);

            res.should.have.status(200);
            res.should.be.json;
        });

        it('should return products', async () => {
            const res = await chai.request(app)
                .get(baseUrl);

            res.should.have.status(200);
            res.should.be.json;
        });
    });

    describe('Update product', () => {
        let product = null;

        before(async () => {
            product = new Product(testData.getProduct());
            await product.save();
        });

        it('should update product', async () => {
            const title = 'Updated title';
            const res = await chai.request(app)
                .put(`${baseUrl}/${product._id}`)
                .send({
                    title
                })
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('title').which.equal(title);
        });

        it('should not update product', async () => {

        });
    });

    describe('Delete product', () => {
        let product = null;

        before(async () => {
            product = new Product(testData.getProduct());
            await product.save();
        });

        it('should delete product', async () => {
            const res = await chai.request(app)
                .delete(`${baseUrl}/${product._id}`)
                .set('authorization', `Bearer ${tokenService.getToken(admin)}`);

            res.should.have.status(204);
            res.body.should.to.be.empty;
        });
    });
});
