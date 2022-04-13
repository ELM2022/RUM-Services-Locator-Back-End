const express = require('express');
const router = express.Router();

const isAuthorized = require('../middlewares/authMiddleware').isAuthorized;

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/RUMSL/register">register</a></p>');
});

router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="login">\
                    Enter Email:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Email:<br><input type="text" name="admin_email">\
                    <br>Enter Password:<br><input type="password" name="admin_password">\
                    <br>Enter First Name:<br><input type="text" name="admin_name">\
                    <br>Enter Last Name:<br><input type="text" name="admin_last_name">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

router.get('/protected-route', isAuthorized, (req, res, next) => {
    res.send(req.user);
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/RUMSL/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('Login failed.');
});

router.get('/login-validate-failure', (req, res, next) => {
    res.send('You entered the wrong token.');
});

router.get('/login-validate', (req, res, next) => {

    const form = '<h1>Validate Login Page</h1><form method="POST" action="login/validate">\
                    Enter Token:<br><input type="text" name="token">\
                    <br><br><input type="submit" value="Submit"></form>\
                    <br><br><p><a href="/RUMSL/login/validate/resend">Resend token</a></p>';

    res.send(form);

});

module.exports = router;