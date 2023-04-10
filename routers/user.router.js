const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/read', userController.read);

router.get('/search', userController.search);

router.get('/locate', userController.locate);

router.post('/add', userController.add);

router.put('/edit/:id', userController.edit);

router.delete('/edit/:id', userController.deleteUser);

module.exports = router;
