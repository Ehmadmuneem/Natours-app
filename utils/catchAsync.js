//USING CATCH ASYNC FUNCTION IN ORDER TO GET RID OF TRY CATCH METHODS BLOCKS IN CONTROLLER HANDLERS
module.exports = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(function (err) {
      next(err);
      //This error will be directed to the global error handling middleware function present in app.js file
    });
  };
};
