const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/category', categoryController.getAllCategories);
router.get('/category/:cid', categoryController.getCategoryById);
router.post('/category', categoryController.addCategory);

module.exports = router;