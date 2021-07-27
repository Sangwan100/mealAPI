const express = require('express');
const router = express.Router();

//importing meals controller methods

const {
    getmeals,
    newMeal,
    updateMeal,
    deleteMeal
} = require('../controller/mealsController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

router.route('/meals').get(getmeals);

router.route('/meals/new').post(isAuthenticatedUser,authorizeRoles('creator','admin'),newMeal);

router.route('/meals/:id')
.put(isAuthenticatedUser,authorizeRoles('creator','admin'),updateMeal)
.delete(isAuthenticatedUser,authorizeRoles('creator','admin'),deleteMeal);

module.exports = router;