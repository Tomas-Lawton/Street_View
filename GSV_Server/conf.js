// conf.js
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});
module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'localhost',
    USR: process.env.USR || 'root',
    PASSWORD: process.env.PASSWORD || 'password',
    DB: process.env.DB || 'hoggsfgr_test_node'
}
