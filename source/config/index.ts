import merge = require("lodash.merge");

// make sure NODE_ENV is set
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const stage = process.env.STAGE || "local";
let envConfig;

if (stage === "production") {
  envConfig = require("./prod").default;
} else if (stage === "testing") {
  envConfig === require("./testing").default;
} else {
  envConfig === require("./local").default;
}

export default merge({
  stage,
  env: process.env.NODE_ENV,
  port: 3000,

  secrets: {
    dbUrl: process.env.DATABASE_URL,
    DataBase_Password: process.env.DATABASE_PASSWORD,
    jwt: process.env.JWT_SECRET,
    jwt_expired_date: process.env.JWT_EXPIRES_IN,
  },
});
