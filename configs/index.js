module.exports = {
    // Server configs
    NODE_JS_ENV: process.env.NODE_JS_ENV,
    NODE_JS_HOST: process.env.NODE_JS_HOST,
    NODE_JS_PORT: process.env.NODE_JS_PORT,

    // DB configs
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,

    ACCESS_CONTROL_ALLOWED_ORIGIN: process.env.ACCESS_CONTROL_ALLOWED_ORIGIN,

    // Token configs
    JSON_WEBTOKEN_SECRET: process.env.JSON_WEBTOKEN_SECRET,
    JSON_WEBTOKEN_EXPIRATION: process.env.JSON_WEBTOKEN_EXPIRATION,

    LIMIT: 100
};
