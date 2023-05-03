const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String, //type of the name object
    required: [true, 'A tour must have a name'], //required set to true, returns error if name is not submitted
    unique: true, //unique feild set to true, i,e name feild should be unique and different
    trim: true, //All the white space in the end and the begining will be cut down
  },
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
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
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
});

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
