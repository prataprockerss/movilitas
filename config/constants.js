const commonConstants = {
    DB: require("./dbTable"),
    RS_CONFIG: {
        length: 12,
        charset: "alphabetic",
    }, 
    MAX_LIMIT: 7, // Cached data limit 
    TTL : 10 // This Time is in Minute
};

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
