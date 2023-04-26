const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(function (req, res, next) {
  req.requestedTime = new Date().toISOString();
  console.log(req.requestedTime);
  next();
});

// app.use(function (req, res, next) {
//   console.log('Hello, Welcome from the middleware!');
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) WE START THE SERVER :

module.exports = app;
