const crypto = require('crypto');
const bcrypt = require('bcrypt');

const getHashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

const isValidPassword = (password, hashPassw) => {
    return bcrypt.compare(password, hashPassw);
}

const generateAuthToken = () => {
    const auth_token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const auth_token_expires = new Date(Date.now() + 1800000); // 30 minutes
    // const auth_token_expires = new Date(Date.now() + 60000); // 1 minute (for testing)

    return {
        token: auth_token,
        expiration: auth_token_expires
    };
}

const generatePasswReset = () => {
    const reset_passw_token = crypto.randomBytes(6).toString("hex");
    const reset_passw_expires = new Date(Date.now() + 3600000); // 1 hour
    // const reset_passw_expires = new Date(Date.now() + 60000); // 1 minute (for testing)

    return {
        token: reset_passw_token,
        expiration: reset_passw_expires
    };
}

module.exports = {
    getHashPassword,
    isValidPassword,
    generateAuthToken,
    generatePasswReset
}