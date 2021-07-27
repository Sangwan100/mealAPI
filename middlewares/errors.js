const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) => {
    
    err.statusCode = err.statusCode || 500 ;


    if(process.env.NODE_ENV === 'development'){
        res.status(err.statusCode).json({
            success : false,
            error : err,
            errMessage : err.message,
            stack : err.stack
        });

    }

    if(process.env.NODE_ENV === 'production'){
       
        
        let error = {...err};
       

        error.message =  err.message;

        //wrong mongoose object id error

        if(err.name === 'CastError'){
            const message = `Resource not found . Invalid : ${err.path}`;
            error = new ErrorHandler(message,404);
        }

        //handling mongoose validation error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message ,400);
        }

        //handles mongoose duplicate key error

        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
            error = new ErrorHandler(message,400);
        }

        //handling wrong Jwt token error

        if(err.name === 'JsonWebTokenError'){
            const message = 'Json Web Token is invalid.try again. ';
            error = new ErrorHandler(message,500);
        }

        //handling expired jwt token error

        if(err.name === 'TokenExpiredError'){
            const message = 'Json web token is expired.try again.';
            error = new ErrorHandler(message ,500);
        }

        res.status(error.statusCode).json({
            success: false,
            message : error.message || 'Internal Server Error'
        });

    }

}