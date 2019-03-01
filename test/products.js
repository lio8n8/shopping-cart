const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const logger = require('../utils/logger');
const Product = require('../models/Product');
const baseUrl = '/api/products';
// const auth = require('../services/auth');
// const faker = require('../services/faker');

chai.use(chaiHttp);
chai.should();

describe('Product', () => {
    before(async () => {
        try {
            await Product.deleteMany({});
        } catch (e) {
            logger.getLogger('error').error(e);
        }
    });


    describe('Get product', () => {
        it('should return product', async () => {

        });
    });

    describe('Get products', () => {
        it('should return products', async () => {

        });
    });
});
