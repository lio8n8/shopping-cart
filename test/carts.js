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
const expect = chai.expect;

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

            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('totalQty').which.equal(1);
            res.body.should.have.property('totalPrice').which.equal(product.price);
        });
    });

    describe('Get carts', () => {
        let cart = null;
        let user = null;

        before(async () => {
            user = new User(testData.getUser());
            await user.save();

            cart = new Cart({ user });
            await cart.save();
        });

        it('should return carts', async () => {

        });

        it('shoukd return cart', async () => {

        });
    });

    describe('Update cart', () => {
        let user = null;
        let cart = null;

        beforeEach(async () => {
            user = new User(testData.getUser());
            await user.save();

            cart = new Cart({ user });
            await cart.save();
        });

        it('should create new productLineItem', async () => {

        });

        it('should add product', async () => {

        });

        it('should remove product', async () => {

        });

        it('should remove productLineItem', async () => {

        });

        it('should reset cart', async () => {
            const res = await chai.request(app)
                .put(`${baseUrl}/${cart._id}/reset`)
                .set('authorization', `Bearer ${tokenService.getToken(user)}`);

            res.should.have.status(200);
            expect(cart.totalQty).to.equal(0);
            expect(cart.totalPrice).to.equal(0);
            expect(cart.user._id.toString()).to.equal(user._id.toString());
        });
    });

    describe('Remove cart', () => {

    })
});
