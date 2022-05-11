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
router.post('/login/validate/resend', accountController.tokenResend);
router.post('/recover', recoverPasswRules(), validateRoute, accountController.recoverPassword);
router.post('/reset/:token', resetPasswRules(), validateRoute, accountController.resetPassword);
router.get('/reset/:token', accountController.validatePasswReset);
router.post('/logout', accountController.logout);

module.exports = router;