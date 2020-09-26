const commonConstants = {};

const dev = {
    ...commonConstants,
    DB_CONFIG: {
        HOST: "localhost",
        USERNAME: "root",
        PASSWORD: "Codename07@",
        DB: "movilitas",
    },
};
const prod = {
    ...commonConstants,
    // production config goes here
};
module.exports = process.env.NODE_ENV === "prod" ? prod : dev;
