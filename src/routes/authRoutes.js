const express = require('express');
const passport = require('passport');
const router = express.Router();

const adminController = require('../controllers/adminController');
const accountController = require('../controllers/accountController');
const { validateRoute } = require('../middlewares/validateMiddleware');
const { loginTokenRules, recoverPasswRules, resetPasswRules } = require('../middlewares/validationRules/accountValidation');
const { adminPostRules } = require('../middlewares/validationRules/adminValidation');

router.post('/login', passport.authenticate('local'), accountController.login);
router.post('/register', adminPostRules(), validateRoute, adminController.addAdmin);
router.post('/login/validate', loginTokenRules(), validateRoute, accountController.validateLogin);
router.get('/login/validate/resend', accountController.login);
router.post('/recover', recoverPasswRules(), validateRoute, accountController.recoverPassword);
router.post('/reset/:token', resetPasswRules(), validateRoute, accountController.resetPassword);
router.get('/reset/:token', accountController.validatePasswReset);

router.get('/logout', (req, res) => {
    req.logout();
    // res.status(200).json("Administrator logged out.");
    res.redirect('http://localhost:3000/Login_Screen');
});

module.exports = router;