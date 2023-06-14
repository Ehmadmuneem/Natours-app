const mongoose = require('mongoose');
const dotenv = require('dotenv');
//UNCAUGHT EXCEPTION HANDLER, should be defined at the top of code
process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION: shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config();
const app = require('./app');

//console.log(process.env);
//console.log(process.env.PORT);

// Connecting cloud database mongoDB-ATLAS
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//process.env.DATABASE_LOCAL;

mongoose.connect(DB, { useNewUrlParser: true }).then((con) => {
  // console.log(con.connection);
  console.log('Atlas database connected.');
});
// .catch((err) => console.log('ERROR'));

//Connecting local database
// const DBLOCAL = process.env.DATABASE_LOCAL;
// mongoose
//   .connect(DBLOCAL, {
//     useNewUrlParser: true,
//   })
//   .then(function () {
//     console.log('local database connected successfully');
//   });

const port = 3000 || process.env.PORT;

var server = app.listen(port, function () {
  console.log(`server successfully connected on port ${port}`);
});

//Environment variables are global variables that are used to define the environment in which a node app is running.

//HANDLING ERRORS OUTSIDE EXPESS (Unhandled Rejection) e.g database connection problem
process.on('unhandledRejection', function (err) {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Shutting Down');

  //It is a good practice to give time to the server to handle the pending requests "server.close()"
  //Then inside the function we can use process.exit() in order to shut down the app;
  server.close(() => process.exit(1));
});
