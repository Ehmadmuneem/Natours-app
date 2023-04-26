const fs = require('fs');
const Tour = require('./../models/models.js');

const testTour = new Tour({
  name: 'The Snow adventure',
  price: 989,
});
// testTour
//   .save()
//   .then(function (doc) {
//     console.log(doc);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}./../dev-data/data/tours-simple.json`)
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missng name or price',
//     });
//   }
//   next();
};
//Now we no longer need to check the ID in every handler function.
// exports.checkId = (req, res, next, val) => {
//   console.log(`Param middleware function id: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid ID',
//     });
//   }
//   next();
// };

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tours.length,
    requestedTime: req.requestedTime,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  //console.log(req.body);

};

exports.getTour = (req, res) => {

};

exports.updateTour = function (req, res) {

};

exports.deleteTour = function (req, res) {

};

exports.getAllUsers = function (req, res) {
  res.status(500).json({
    status: 'Internal Server Error!',
    message: 'This route is not yet defined.',
  });
};

exports.createUser = function (req, res) {
  res.status(500).json({
    status: 'Internal Server Error!',
    message: 'This route is not yet defined.',
  });
};

exports.getUser = function (req, res) {
  res.status(500).json({
    status: 'Internal Server Error!',
    message: 'This route is not yet defined.',
  });
};

exports.updateUser = function (req, res) {
  res.status(500).json({
    status: 'Internal Server Error!',
    message: 'This route is not yet defined.',
  });
};

exports.deleteUser = function (req, res) {
  res.status(500).json({
    status: 'Internal Server Error!',
    message: 'This route is not yet defined.',
  });
};
