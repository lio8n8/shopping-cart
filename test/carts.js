const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const logger = require('../utils/logger');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const tokenService = require('../services/tokenService');
const testData = require('../utils/testData');
const baseUrl = '/api/carts';

chai.use(chaiHttp);
chai.should();

describe('Cart', () => {
    before(async () => {
        try {
            await Cart.deleteMany({});
        } catch (e) {
            logger.getLogger('error').error(e);
        }
    });

    describe('Create cart', () => {
        it('should create cart and add product', async () => {
            const user = new User(testData.getUser());
            const product = new Product(testData.getProduct());
            await user.save();
            await product.save();

            const res = await chai.request(app)
                .post(baseUrl)
                .send({ product })
                .set('authorization', `Bearer ${tokenService.getToken(user)}`);
        });
    });
});
