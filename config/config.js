require("dotenv").config();
const config = {
    db: {
        url: process.env.MONGO_URL,
    },

    application: {
        port: 4600,
    },

    auth: {
        jwtSecret: process.env.JWT_SECRET,
    },
};
module.exports = config;
