const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    updatePassword,
    updateUser,
    deleteUser,
    getUsers,
    deleteUserAdmin
} = require('../controller/userController');
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth');

router.use(isAuthenticatedUser);

router.route('/me').get(getUserProfile);

router.route('/password/update').put(updatePassword);
router.route('/me/update').put(updateUser);
router.route('/me/delete').delete(deleteUser);

//admins only route

router.route('/users').get( authorizeRoles('admin'),getUsers);
router.route('/user/:id').delete( authorizeRoles('admin'),deleteUserAdmin);

module.exports = router;