const mealModel = require('../models/mealModel');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');
//get all meals => /api/v1/meals

exports.getmeals = catchAsyncErrors(async (req, res, next) => {

    const apiFilters = new APIFilters(mealModel.find(), req.query)
       .filter()
       .limitFields()
       .searchByQuery();
   
           

    const meals = await apiFilters.query;
    res.status(200).json({
        success: true,
        results: meals.length,
        data: meals
    });
});

//create a new meal =>  /api/v1/meals/new

exports.newMeal = catchAsyncErrors(async (req, res, next) => {

    //Adding user to body

    req.body.user = req.user.id;

    const meal = await mealModel.create(req.body);

    res.status(200).json({
        success: true,
        message: 'meal is created',
        data : meal
    });

});



//updating the meals => /api/v1/meals/:id

exports.updateMeal = catchAsyncErrors(async (req, res, next) => {
    let meal = await mealModel.findById(req.params.id);

    if (!meal) {
        return next(new ErrorHandler('meal not found', 404));


        // return next(new ErrorHandler('meal not found' , 404));
    }

    //check if the user is owner
    if(meal.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`User(${req.user.id}) is not allowed to update this job.`))
    }

    meal = await mealModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'meal is updated',
        data: meal
    });
});

//delete  meal =>  /api/v1/:id

exports.deleteMeal = catchAsyncErrors(async (req, res, next) => {
    let meal = await mealModel.findById(req.params.id);

    if (!meal) {
        return next(new ErrorHandler('meal not found', 404));
    }


     //check if the user is owner
     if(meal.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorHandler(`User(${req.user.id}) is not allowed to update this job.`))
    }

    meal = await mealModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'meal deleted successfully'
    })
});


