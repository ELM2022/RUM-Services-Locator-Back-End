const passport = require('passport');
const db = require('./db').pool;
const LocalStrategy = require('passport-local').Strategy;

const isValidPassword = require('../utils/passwordUtils').isValidPassword;

const verifyCallback = (username, password, callback) => {
    db.query(
        "SELECT * FROM Administrator WHERE admin_email = ?", 
        [username], 
        (error, admin) => {
            if (error) { 
                return callback(error); 
            }
            if (admin[0] === undefined) { 
                return callback(null, false, {message: "Incorrect username or password."}); 
            }

            isValidPassword(password, admin[0].admin_password).then((isValid) => {
                if (isValid) {
                    return callback(null, admin[0]);
                }
                else {
                    return callback(null, false, {message: "Incorrect username or password."});
                }
            });

    });
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((admin, callback) => {
    callback(null, admin.admin_id);
});

passport.deserializeUser((adminId, callback) => {
    console.log('Deserialize user: ', adminId);
    db.query(
        "SELECT * FROM Administrator WHERE admin_id = ?",
        [adminId],
        (error, admin) => {
            if (error) {
                callback(error);
            }
            if (admin) {
                callback(null, admin[0]);
            }
        }
    );
});