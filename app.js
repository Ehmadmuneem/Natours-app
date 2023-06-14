const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
} else {
  console.log(process.env.NODE_ENV);
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(function (req, res, next) {
  requestedTime = new Date().toISOString();
  console.log(requestedTime);

  next();
});

//CUSTOM MIDDLEWARE
// app.use(function (req, res, next) {
//   console.log('Hello, Welcome from the middleware!');
//   next();
// });

//ROUTES
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

//HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find the ${req.originalUrl} route
  //    on this server!`,
  // });
  // console.log(req.originalUrl);

  //OR
  //DEFINING AN ERROR
  // const err = new Error(
  //   `Cant find the ${req.originalUrl} route on this server, HAHAHAHAHA!` //This is err.message
  // );
  // err.status = 'fail';
  // err.statusCode = 400;
  //next(err);
  //OR

  //creating a error constructor  object
  const err = new AppError(
    `Cant find the ${req.originalUrl} route on this server`,
    400
  );
  //console.log(err.message, err.status, err.statusCode);

  next(err);

  //Whenever we pass anything inside a next function, express will skip all other middlewares and will go to the error handling middleware.
});

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// 4) WE START THE SERVER :

module.exports = app;
