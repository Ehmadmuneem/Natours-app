class APIFeatures {
  constructor(query, queryString) {
    //query=Tour.find(),queryString=req.query
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; //this is because when we delete fields from queryObj, req.query will remain same
    const excludedFields = ['page', 'sort', 'page', 'limit', 'fields'];

    excludedFields.forEach(function (el) {
      delete queryObj[el]; //will delete all the queries of page, sort, limit and fields in query object
    });

    // 2) Advance filtering, using comparision operators;

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(req.query);
    // console.log(queryStr);
    //let query=Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString);
      const sortStr = this.queryString.sort.split(',').join(' ');
      console.log(sortStr);

      // query = query.sort(sortStr);
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  fields() {
    // 4)Field limiting
    if (this.queryString.fields) {
      const fieldStr = this.queryString.fields.split(',').join(' ');

      // query = query.select(fieldStr);
      this.query = this.query.select(fieldStr);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    // 5) Pagination
    const page = this.queryString.page * 1 || 1; //Page number a user wants to get
    const limit = this.queryString.limit * 1 || 3; //Number of results or docs a user wants to seek;
    //console.log(req.query);
    const skip = (page - 1) * limit;
    //console.log(skip);
    //  query = query.skip(skip).limit(limit);
    this.query = this.query.skip(skip).limit(limit);
    return this;

    //If requested page is not available;
    //  if (req.query.page) {
    //    const numTours = await Tour.countDocuments();
    //    if (skip >= numTours) throw new Error('This page does not exist');
    //  }
  }
}

module.exports = APIFeatures;
