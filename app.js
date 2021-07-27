const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDatabase = require('./config/database');

const errorMiddleware = require('./middlewares/errors');

const ErrorHandler =  require('./utils/errorHandler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xssClean =require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const router = express.Router();


router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
  });

  router.get('/docs',function(req,res){
    res.sendFile(path.join(__dirname+'/docs.html'));
  });

// setting up config.env file  variable

dotenv.config({path: './config/config.env'});

//handling uncaught exception

process.on(`uncaughtException`,err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down due to uncaught exception')
    process.exit(1);
});

//connecting to database

connectDatabase();

//setup bpdy parser

app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

//setup secruity headers

app.use(helmet());

//setup body parser
app.use(express.json());

//set cookie parser

app.use(cookieParser());



//Sanitize data

app.use(mongoSanitize());

//prevent xss attacks

app.use(xssClean());

//prevent parameter pollution

app.use(hpp());


//Rate limiting

const limiter = rateLimit({
    windowMs : 10*60*1000, //10 min
    max : 100
});


//setup cors and accessible by other domains

app.use(cors());
app.use(limiter);

//importing routes

const meals = require('./routes/meals');
const auth = require('./routes/auth');
const user = require('./routes/user');

app.use('/api/v1',meals);
app.use('/api/v1',auth);
app.use('/api/v1',user);

// handle unhandled routes
app.all('*',(req,res,next)=>{
    next(new ErrorHandler(`${req.originalUrl} route not found`,404));

});

//middleware to handle errors

app.use(errorMiddleware);



   const PORT = process.env.PORT;
   const server = app.listen(PORT , () => {
    console.log(`Server Started at port ${process.env.PORT} in ${process.env.NODE_ENV} mode. `);
});

//handling unhandled promise rejection

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection.`);
    server.close(()=>{
        process.exit(1);
    })
});

