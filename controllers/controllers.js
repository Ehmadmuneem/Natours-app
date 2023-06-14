const appError = require('../utils/appError.js');
const Tour = require('./../models/models.js');
const APIFeatures = require('./../utils/api-features.js');
const catchAsync = require('./../utils/catchAsync.js');

//Now we no longer need to check the ID in every handler function.
//NOW USED FOR NOW
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

//Alias middleware function for top 5 tours (Alias route)
exports.aliasTopTours = (req, res, next) => {
  //Passing queries to the route;
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  // res.send('Welcome to top five cheap tours, ah haa');

  next(); //go to getAllTours
};

//GETTING ALL TOURS
exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXCUTE QUERY
  let features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const tours = await features.query;
  //SEND RESPONSE

  return res.status(200).json({
    status: 'Success',
    result: tours.length,
    requestedTime: requestedTime,
    data: {
      tours,
    },
  });
});

//CREATING A TOUR
exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

  // try {
  // } catch (err) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

//GETTING A SINGLE TOUR
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //Creating an error, if when we have duplicate ids
  if (!tour) {
    const err = new appError(`Invalid ID: ${req.params.id}`, 404);

    return next(err);
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//UPDATE A TOUR
exports.updateTour = catchAsync(async function (req, res, next) {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, //this will return the new updated doc in tour variable;
      runValidators: true,
    } //will run and update all the validators against tour schema
  );

  if (!tour) {
    const err = new appError(`Invalid ID: ${req.params.id}`, 404);

    return next(err);
  }
  return res.status(200).json({
    status: 'Successfully updated',
    data: {
      tour: tour,
    },
  });
});

//DELETING A TOUR
exports.deleteTour = catchAsync(async function (req, res, next) {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  console.log(tour);
  if (!tour) {
    const err = new appError(`Invalid ID: ${req.params.id}`, 404);

    return next(err);
  }
  res.status(200).json({
    status: 'Tour deleted successfully:',
    data: {
      tour: tour,
    },
  });
});

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

exports.getTourStats = async function (req, res) {
  try {
    const stats = await Tour.aggregate([
      //Aggretation pipeline is used to process the data and return the result in the form of calculating the average, grouping, matching etc;
      {
        $match: { ratingsAverage: { $gte: 4 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // {
      //   $match: { _id: { $ne: 'EASY' } }, //this will exclude the easy group
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $match: {
          //For selecting or filtering the docs
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' }, //will return month form the given date
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          //Simply used to add the fields
          month: '$_id',
        },
      },
      {
        $project: {
          //Project is used to show or not to show the fields
          //here we simply hide the above id field inside the group method
          //0 for hide, 1 for show
          _id: 0,
        },
      },
      {
        $sort: {
          //Sort the below field in decending order
          numTourStarts: -1,
        },
      },
      {
        //this method limits the fields
        $limit: 12,
      },
    ]);
    //console.log(new Date(`${year}-01-25`));

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
