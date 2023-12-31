const express = require('express');
const authController = require('./authController'); 

const router = express.Router();

router.route('/signup')
    .post(authController.signup);
router.route('/login')
    .post(authController.login);

    router.route('/')
    .get(authController.getAllUsers);


module.exports = router;

