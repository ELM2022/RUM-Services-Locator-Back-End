const db = require('../configs/db').pool;
const { getHashPassword, generateAuthToken, generatePasswReset } = require('../utils/passwordUtils');
const { emailVerification, emailPasswReset, emailResetConfirmation } = require('../services/emailService');

const login = async (req, res) => {
    try {
        req.session.token = generateAuthToken();
        await emailVerification(req).then(() => {
            // FOR TESTING PURPOSES
            res.redirect('http://localhost:3000/RUMSL/login-validate');
        });

    } catch (error) {
        console.log(error);
    }
}

const validateLogin = async(req, res) => {
    try {
        const sessToken = req.session.token;
        const formToken = req.body.token;

        if (sessToken === formToken) {
            res.status(200).json("Login validated.");
            
        } else {
            res.status(404).json("Login failed: incorrect token.");
        }

    } catch (error) {
        console.log(error);
    }
}

const recoverPassword = async(req, res) => {
    try {
        const admin_email = req.body.admin_email;
        await db.promise().query("SELECT * FROM Administrator WHERE admin_email = ?", [admin_email])
        .then(async (result) => {
            if (result[0] !== undefined) {
                const admin = result[0][0];
                const password_reset = generatePasswReset();
                admin.reset_passw_token = password_reset.token;
                admin.reset_passw_expires = password_reset.expiration;
    
                await db.promise().query("UPDATE Administrator SET ? WHERE admin_id = ?", [admin, admin.admin_id])
                .then(() => {
                    emailPasswReset(admin.admin_email, admin.reset_passw_token);
                })
                .catch(error => res.status(500).json({ message: error.message }));

            } else {
                res.status(401).json("Admin email not found.");
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));

        // const [result] = await db.promise().query("SELECT * FROM Administrator WHERE admin_email = ?", [admin_email]);

        // if (result !== undefined) {
        //     const admin = result[0];
        //     const password_reset = generatePasswReset();
        //     admin.reset_passw_token = password_reset.token;
        //     admin.reset_passw_expires = password_reset.expiration;

        //     await db.promise().query("UPDATE Administrator SET ? WHERE admin_id = ?", [admin, admin.admin_id])
        //     .then(() => {
        //         emailPasswReset(admin.admin_email, admin.reset_passw_token);
        //     })
        //     .catch(err => res.status(500).json({ message: err.message }));

        // }
        // else {
        //     res.status(401).json("Admin email not found.");
        // }

    } catch (error) {
        console.log(error);
    }
}

const validatePasswReset = async(req, res) => {
    try {
        await db.promise().query("SELECT * FROM Administrator WHERE reset_passw_token = ? AND reset_passw_expires >= ?", [req.params.token, new Date(Date.now())])
        .then(result => {
            if (result[0] !== undefined) {
                // res.status(200).json("Password reset validated.");

                // FOR TESTING PURPOSES
                const form = `<h1>Reset Password Page</h1><form method="POST" action="http://localhost:3000/RUMSL/reset/${req.params.token}">\
                Enter Password:<br><input type="password" name="admin_password">\
                <br>Confirm Password:<br><input type="password" name="confirm_password">\
                <br><br><input type="submit" value="Submit"></form>`;

                res.send(form);

            } else {
                res.status(401).json("Password reset token is invalid or has expired.");
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));

    } catch (error) {
        console.log(error);
    }
}

const resetPassword = async(req, res) => {
    try {
        await db.promise().query("SELECT * FROM Administrator WHERE reset_passw_token = ? AND reset_passw_expires >= ?", [req.params.token, new Date(Date.now())])
        .then(async (result) => {
            if (result[0] !== undefined) {
                const admin = result[0][0];
                admin.admin_password = getHashPassword(req.body.admin_password);
                admin.reset_passw_token = undefined;
                admin.reset_passw_expires = undefined;

                await db.promise().query("UPDATE Administrator SET ? WHERE admin_id = ?", [admin, admin.admin_id])
                .then(() => {
                    emailResetConfirmation(admin.admin_email);
                })
                .catch(error => res.status(500).json({ message: error.message }));

            } else {
                res.status(401).json("Password reset token is invalid or has expired.");
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    login,
    validateLogin,
    recoverPassword,
    validatePasswReset,
    resetPassword
}