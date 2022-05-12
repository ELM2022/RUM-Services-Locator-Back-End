const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/category', categoryController.getAllCategories);
router.get('/category/:cid', categoryController.getCategoryById);
router.post('/category', categoryController.addCategory);
router.put('/category/:cid', categoryController.updateCategory);
// router.delete('/category/:cid', categoryController.deleteCategoryById);
router.put('/category/:cid/delete', categoryController.deleteCategoryById);

module.exports = router;