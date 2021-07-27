const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const APIFilters = require('../utils/apiFilters');

//get current user profile  => /api/v1/me

exports.getUserProfile = catchAsyncErrors( async(req,res,next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        data : user
    });
});

//update current user password => /api/v1/password/update

exports.updatePassword = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id).select('+password');

    //check previous user password

    const isMatched = await user.comparePassword(req.body.currentPassword);
    if(!isMatched) {
        return next(new ErrorHandler('old password is incorrect',401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

});


//update current user data => /api/v1/me/update

exports.updateUser = catchAsyncErrors( async (req,res,next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        new : true,
        runValidator : true,
        useFindAndModify : false
    });

    res.status(200).json({
        success : true,
        data : user
    })
});


//delete current user => /api/v1/me/delete

exports.deleteUser = catchAsyncErrors( async (req,res,next) => {

    const users = await User.findByIdAndDelete(req.body.id);

    res.cookie('token','none',{
        expires : new Date(Date.now()),
        httpOnly : true
    });

    res.status(200).json({
        success : true,
        message : 'Your account has been deleted'
    });
});

//adding controller methods that only accessable by admins

//show all user => /api/v1/users

exports.getUsers = catchAsyncErrors( async (req,res,next) => {

    const apiFilters = new APIFilters(User.find(),req.query)
    .filter()
    .limitFields()
    .searchByQuery();

    const users = await apiFilters.query;

    res.status(200).json({
        success : true,
        result : users.length,
        data : users
    });

});

//Delete user (admin) => /api/v1/user/:id

exports.deleteUserAdmin = catchAsyncErrors( async (req,res,next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next( new ErrorHandler(`User not found with id: ${req.params.id}`,404));

    }

    // deleteUser(user.id,user.role);
    // user.remove();

    res.status(200).json({
        success : true,
        message : 'User is deleted by admin'
    });
});