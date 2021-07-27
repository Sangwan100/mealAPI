const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type : String,
        require : [true, 'please enter your name']
    },

    email: {
        type : String,
        require: [true, 'please enter your email address'],
        unique: true,
        validate: [validator.isEmail , 'please enter valid email address'] 
    },
    role : {
        type: String,
        enum : {
            values : ['user','creator'],
            message : 'please select correct role'
        },
        default : 'user'
    },
    password : {
        type : String,
        require : [true,'Please enter the password for your account'],
        minlength : [8, 'Your password must be atleast 8 characters long'],
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date
});

//encrypting passwords before saving

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
});

//return JSON web Token

userSchema.methods.getJwtToken = function(){
   return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_TIME
    });
}

//compare user passoword with database password

userSchema.methods.comparePassword = async function(enterPassword) {
    return await bcrypt.compare(enterPassword,this.password);
    
}


//Genenertae password reset token

userSchema.methods.getResetPasswordToken = function() {
       //generate the token

       const resetToken = crypto.randomBytes(20).toString('hex');

       //hash and set to resetpassowrd token

       this.resetPasswordToken = crypto.createHash('sha256')
       .update(resetToken)
       .digest('hex');

       //set token expire time

       this.resetPasswordExpire = Date.now() + 30*60*1000;

       return resetToken;
}

module.exports = mongoose.model('User',userSchema);