const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/adminController');
const accountController = require('../controllers/accountController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { recoverPasswRules, resetPasswRules } = require('../middlewares/validationRules/accountValidation');

router.post('/login', 
    passport.authenticate('local'), accountController.login, (req, res) => {
        res.redirect('RUMSL/login-validate');
    });

router.post('/register', adminController.addAdmin);
router.post('/login/validate', accountController.validateLogin);
router.get('/login/validate/resend', accountController.login);
router.post('/recover', recoverPasswRules(), validateRoute, accountController.recoverPassword);
router.post('/reset/:token', resetPasswRules(), validateRoute, accountController.resetPassword);
router.get('/reset/:token', accountController.validatePasswReset);

router.get('/logout', (req, res, next) => {
    req.logout();
});

module.exports = router;