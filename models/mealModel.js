const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema ({
       mealName : {
           type : String,
           required : [true , 'Please specify meal Name']
       },

       cookingTime : {
           type: Number,
           required : [true, 'Please enter cookingTime']
        },
        mealIngredients : {
            type : String,
            required: [true, 'Please enter mealIngriedents']
        },
        mealProcess : {
            type : String , 
            required : [true, 'Please enter mealProcess']
        },

        user : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : true
        }
});

module.exports = mongoose.model('meal' , mealSchema);