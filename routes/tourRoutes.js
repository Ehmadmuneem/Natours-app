const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/controllers');

//param midlleware function.
// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  //Chaining multiple middleware functions
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;