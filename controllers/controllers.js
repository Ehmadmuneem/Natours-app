const Tour = require('./../models/models.js');
const APIFeatures = require('./../utils/api-features.js');

//Now we no longer need to check the ID in every handler function.
exports.checkId = async (req, res, next, val) => {
  console.log(`Router Param middleware function id: ${val}`);
  const tour = await Tour.findById(val);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

//Alias middleware function for top 5 tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  // res.send('Welcome to top five cheap tours, ah haa');

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //EXCUTE QUERY
    let features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const tours = await features.query;
    //SEND RESPONSE

    res.status(200).json({
      status: 'Success',
      result: tours.length,
      requestedTime: requestedTime,
      data: {
        tours,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.send(err);
  }
};

exports.updateTour = async function (req, res) {
  try {
    const tour = await Tour.findOneAndUpdate(
      { _id: req.params.id }, //here we can also use req.body.params, req.body i,e withour passing the objects;
      { $set: req.body },
      { new: true }, //this will return the new updated doc in tour variable;
      { runValidators: true } //will run and update all the validators against tour schema
    );
    return res.status(200).json({
      status: 'Successfully updated',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.send(err);
  }
};

exports.deleteTour = async function (req, res) {
  try {
    const tour = await Tour.deleteOne({ _id: req.params.id });
    console.log(tour);
    res.status(200).json({
      status: 'Successfully deleted the document:',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.send(err);
  }
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
