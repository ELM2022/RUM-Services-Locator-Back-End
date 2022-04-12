const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const devConfig = {
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSW,
    port: process.env.LOCAL_DB_PORT,
    database: process.env.LOCAL_DB,
};

const prodConfig = {
    port: process.env.AZURE_DB_PORT,
    host: process.env.AZURE_DB_HOST,
    user: process.env.AZURE_DB_USER,
    password: process.env.AZURE_DB_PASSW,
    database: process.env.AZURE_DB,
    connectionLimit: process.env.AZURE_DB_CONN_LIM,
}

const pool = mysql.createPool(devConfig);

// const pool = mysql.createPool(
//     process.env.NODE_ENV === "production" ? prodConfig : devConfig
// );

module.exports = {
    pool,
    devConfig,
    prodConfig
};