const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');

//console.log(process.env);
//console.log(process.env.PORT);

// Connecting cloud database mongoDB-ATLAS
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { useNewUrlParser: true }).then((con) => {
  // console.log(con.connection);
  console.log('Atlas database connected.');
});

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

app.listen(port, function () {
  console.log('server running on port ' + port);
});

//Environment variables are global variables that are used to define the environment in which a node app is running.
