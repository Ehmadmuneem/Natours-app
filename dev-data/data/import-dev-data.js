//This file script is totally independent of the rest of our express app and we'll run this completely seperately
//in the command line just to import our data from tours-simple-json to our atlas database.
const fs = require('fs');
const Tour = require('./../../models/models');
const mongoose = require('mongoose');
const { argv } = require('process');
require('dotenv').config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { useNewUrlParser: true }).then((con) => {
  // console.log(con.connection);
  console.log('Atlas database connected successfully.');
});

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//console.log(tours);

//IMPORT DATA INTO DATABASE
const importData = async function () {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL THE DATA FROM THE DATABASE
const deleteData = async function () {
  try {
    await Tour.deleteMany();
    console.log('Data collection sussfully deleted from the database');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
