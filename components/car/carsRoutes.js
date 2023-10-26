const express = require('express');
const carsController = require('./../Controllers/carsController');
const authController = require('./../Controllers/authController');

const router = express.Router();



router.route('/')
    .get(carsController.getAllCars)
    .post(authController.protect, carsController.regCar)

router.route('/:id')
    .get(carsController.getCar)
    .patch(authController.protect, carsController.updateCar)
    .delete(authController.protect, carsController.deleteCar)
    .put(authController.protect, authController.restrict('admin'), carsController.updateCar)



module.exports = router;













module.exports = router;


