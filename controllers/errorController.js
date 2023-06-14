const appError = require('./../utils/appError');

//FUNCTION WHEN YOU GIVE INVALID ID's
function handleCastErrDB(error) {
  const message = `Invalid path:${error.path}, value:${error.value}`;
  return new appError(message, 404);
}
//FUNCTION WHEN YOU USE DUPLICATE NAMES
function handleDuplicateFields(error) {
  const message = `Duplicate key error occoured: ${error.keyValue.name}`;
  return new appError(message, 404);
}

//FUNCTION USE WHEN YOU USE LIKE RATING's AVERAGE GREATER THAN MAX
function handleValidationErrDB(error) {
  let errors = Object.values(error.errors);

  errors = errors.map((el) => el.message);

  const message = `Invalid data input: ${errors.join('. ')}`;
  //OR YOU CAN SIMPLY WRITE THE BELOW LINE
  //const message = `Invalid Input Entered: ${error.message}`;
  return new appError(message, 404);
}

//HANDLING ERROR WHEN YOUR ARE IN DEVELOPEMENT
function devError(err, res) {
  res.status(err.statusCode).json({
    // newError: err.keyValue.name,
    // status: err.status,
    message: err.message,
    name: err.name,
    err,
    // resmessage: err.errors.ratingsAverage.message,
    // stack: err.stack,
  });
}

//HANDLING ERROR WHEN YOURE IN PRODUCTION
function prodError(err, res) {
  //OPERATIONAL ERROR:SEND MESSAGE TO CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      //   error: err,
      //stack: err.stack,
      //error: err,
    });
  }
  //PROGRAMMING OR OTHER UNKNOWN ERRORS:Dont leak error deatails to the client
  else {
    //1) log error
    console.error('ERROR');

    //2)sending generic message to the user
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
}

//THIS IS THE GLOBAL ERROR MIDDLEWARE FUNCTION TO HANDLE ALL THE ERROr
module.exports = function (err, req, res, next) {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  //WHEN WE ARE IN DEVELOPMENT
  if (process.env.NODE_ENV == 'development') {
    devError(err, res);
  }
  //WHEN WE ARE IN PRODUCTION
  else if (process.env.NODE_ENV == 'production') {
    //Not a good practice to overwrite the above error
    let error = { ...err };
    // let error;
    if (err.name === 'CastError') {
      error = handleCastErrDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateFields(error);
    } else if (err.name === 'ValidationError') {
      error = handleValidationErrDB(error);
    }
    prodError(error, res);
  }
  //WHEN WE SIMPLY USE: nodemon server.js, ie neither development nor production
  else {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
    });
  }
};
