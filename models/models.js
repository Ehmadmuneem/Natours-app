const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String, //type of the name object
      required: [true, 'A tour must have a name'], //required set to true, returns error if name is not submitted
      unique: true, //unique feild set to true, i,e name feild should be unique and different
      trim: true, //All the white space in the end and the begining will be cut down
      //VALIDATORS, words only for sitrings
      maxlength: [40, 'Tour name should not have more than 40 characters.'],
      minlength: [10, 'Tour name should have more than 10 characters'],
      //Using inbuilt validator
      //validate: [validator.isAlpha, 'Tour must contain only the characters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty '],
      //ENUM VALIDATOR words only for strings.
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be only easy or medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      //min and max validators words only for numbers and dates.
      min: [1, 'Ratings Average must be above 0'],
      max: [5, 'Ratings Average must be below or equal to 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //Custom validator to check that the price discount should be less than the acutal price
      validate: {
        //CUSTOM VALIDATOR
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than the price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true, // All the white space in the begining and in the end will be cut down
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      select: false, //if we want to hide the createdAt field when we want to get tours
      default: Date.now(), //will give us a timestamp in milliseconds, that is immediately converted to current date
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Virtual properties are the fields that we define in our schema model, they ll not be saved into the database-
//in order to save some space there
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//PRE DOCUMENT MIDDLEWARE, will trigger before the saving of the document
// tourSchema.pre('save', function (next) {
//   console.log(this);
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

//POST DOCUMENT MIDDLEWARE, will trigger after the saving of the document
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//PRE QUERY MIDDLEWARE, will trigger before every find method
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); //will return all the tours with with secretTour field false
  this.start = Date.now(); //gives you the time in milliseconds since 1970
  next();
});

//POST QUERY MIDDLEWARE, will trigger after every find method
tourSchema.post(/^find/, function (docs, next) {
  //console.log(docs);
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

//AGGREATION PRE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //this will filter the only tours where secretTour is set to false.
  //unshift() method is used to add the feild and here we add another $match method to the aggregate pipeline.
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
