const db = require('../configs/db').pool;
const { getHashPassword, generateAuthToken, generatePasswReset } = require('../utils/passwordUtils');
const { emailVerification, emailPasswReset, emailResetConfirmation } = require('../services/emailService');
const { isValidPassword } = require('../utils/passwordUtils');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        db.query("SELECT * FROM Administrator WHERE admin_email = ?", [username], 
        (error, result) => {
            if (error) throw error;
            if (result[0] !== undefined) {
                const admin = result[0];
                isValidPassword(password, admin.admin_password).then((isValid) => {
                    if (isValid) {
                        const authentication = generateAuthToken();
                        admin.auth_token = authentication.token;
                        admin.auth_token_expires = authentication.expiration;
                        req.session.data = admin;

                        db.query("UPDATE Administrator SET ? WHERE admin_id = ?", [admin, admin.admin_id],
                        (error, result) => {
                            if (error) throw error;
                            emailVerification(req).then(() => {
                                res.status(200).json("Successful administrator login request.");
                            });
                        });

                    } else {
                        res.status(404).json("Incorrect username or password.");
                    }
                });
            } else {
                res.status(404).json("Incorrect username or password.");
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const createAuthentication = (admin) => {
    try {
        const authentication = generateAuthToken();
        admin.auth_token = authentication.token;
        admin.auth_token_expires = authentication.expiration;
        req.session.data = req.user;
        console.log(req.session);

        db.query("UPDATE Administrator SET ? WHERE admin_id = ?", [admin, admin.admin_id],
        (error, result) => {
            if (error) throw error;
            emailVerification(req).then(() => {
                res.status(200).json("Successful administrator login request.");
            });
        });

    } catch (error) {
        console.log(error);
    }
}

const validateLogin = async (req, res) => {
    try {
        // console.log(req.user);
        // console.log(req.session);
        console.log(req.session.data);
        // console.log(req._passport);
        if (req.session.data !== undefined) {
            const data = req.session.data;
            await db.promise().query("SELECT * FROM Administrator WHERE admin_id = ?", [data.admin_id])
            .then((result) => {
            const admin = result[0][0];
                if (admin !== undefined) {
                    
                    const sessToken = admin.auth_token;
                    const sessTokenExpiration = new Date(admin.auth_token_expires);
                    // const formToken = req.body.token;
                    const formToken = req.body.token;

                    if (sessTokenExpiration > new Date(Date.now())) {
                        if (sessToken === formToken) {
                            // res.status(200).json("Login validated.");
                            res.status(200).json({
                                token: sessToken,
                                admin_id: data.admin_id,
                                admin_email: data.admin_email
                            });
                            
                        } else {
                            res.status(400).json("Login failed: incorrect token.");
                        }
                    }
                    else {
                        res.status(400).json("Login failed: expired authentication token.");
                    }

                } else {
                    res.status(404).json("Administrator account not found.");
                }
            })
            .catch(error => console.log(error));
        } else {
            res.status(400).json("Session is undefined");
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
                    emailPasswReset(admin.admin_email, admin.reset_passw_token).then(() => {
                        res.status(200).json("Password recovery requested.");
                    });
                })
                .catch(error => res.status(500).json({ message: error.message }));

            } else {
                res.status(401).json("Admin email not found.");
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));

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
                res.redirect(`http://localhost:3000/Password_Reset/${req.params.token}`);

                // FOR TESTING PURPOSES
                // const form = `<h1>Reset Password Page</h1><form method="POST" action="http://localhost:3000/RUMSL/reset/${req.params.token}">\
                // Enter Password:<br><input type="password" name="admin_password">\
                // <br>Confirm Password:<br><input type="password" name="confirm_password">\
                // <br><br><input type="submit" value="Submit"></form>`;

                // res.send(form);

            } else {
                res.status(400).json("Password reset token is invalid or has expired.");
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
                admin.admin_password = getHashPassword(req.body.administrator.admin_password);
                admin.reset_passw_token = undefined;
                admin.reset_passw_expires = undefined;

                await db.promise().query("UPDATE Administrator SET ? WHERE admin_id = ?", [admin, admin.admin_id])
                .then(() => {
                    emailResetConfirmation(admin.admin_email).then(() => {
                        res.status(200).json("Password reset successful.");
                    });
                })
                .catch(error => res.status(500).json({ message: error.message }));

            } else {
                res.status(400).json("Password reset token is invalid or has expired.");
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));

    } catch (error) {
        console.log(error);
    }
}

const logout = async (req, res) => {

    await db.promise().query("UPDATE Administrator SET auth_token = ?, auth_token_expires = ? WHERE admin_id = ?", [null, null, req.user.admin_id])
    .then(() => {
        req.logout();
        res.redirect('http://localhost:3000/Login_Screen');
    })
    .catch(error => res.status(500).json({ message: error.message }));

}

module.exports = {
    login,
    validateLogin,
    recoverPassword,
    validatePasswReset,
    resetPassword,
    logout
}