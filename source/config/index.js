"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import merge from "lodash.merge";
var merge = require("lodash.merge");
// Make sure NODE_ENV is set
process.env.NODE_ENV = process.env.NODE_ENV || "development";
var stage = process.env.STAGE || "local";
var envConfig;
if (stage === "production") {
    envConfig = require("./prod").default;
}
else if (stage === "testing") {
    envConfig = require("./testing").default;
}
else {
    envConfig = require("./local").default;
}
var config = merge({
    stage: stage,
    env: process.env.NODE_ENV,
    port: 3000,
    secrets: {
        dbUrl: process.env.DATABASE_URL,
        DataBase_Password: process.env.DATABASE_PASSWORD,
        jwt_secret: process.env.JWT_SECRET,
        jwt_expired_date: process.env.JWT_EXPIRES_IN,
        EmailUserName: process.env.EMAIL_USERNAME,
        EmailPassword: process.env.EMAIL_PASSWORD,
        EmailHost: process.env.EMAIL_HOST,
        EmailPort: process.env.EMAIL_PORT,
    },
});
exports.default = config;
