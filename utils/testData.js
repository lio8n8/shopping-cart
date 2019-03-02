const faker = require('faker');

module.exports.getUser = () => {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        psw: faker.internet.password()
    };
};

module.exports.getProduct = () => {
    return {
        name: faker.commerce.productName(),
        title: faker.lorem.sentence(),
        description: faker.lorem.text(),
        shortDescription: faker.lorem.paragraph(),
        price: faker.commerce.price()
    };
};
