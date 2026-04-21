class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. copy query
    let queryObj = { ...this.queryString };

    // 2. Remove unwated field
    const removeFields = ["keyword", "page", "limit", "sort", "fields"];
    removeFields.forEach((field) => delete queryObj[field]);

    // 3. convert operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    // 4. build query
    this.query = this.query.find(queryObj);

    // 5. Search
    if (this.queryString.keyword) {
      this.query = this.query.find({
        name: {
          $regex: this.queryString.keyword,
          $options: "i",
        },
      });
    }

    return this;
  }

  sort() {
    if(this.queryString.sort){
    let sorting = this.queryString.sort.split(",").join(" ");
    this.query = this.query.sort(sorting);
    } else {
        this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if(this.queryString.fields){
    let selectedFields = this.queryString.fields.split(",").join(" ");
    this.query = this.query.select(selectedFields);
    } else {
        this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    let page = Number(this.queryString.page) || 1;
    let limit = Number(this.queryString.limit) || 5;

    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}


module.exports = APIFeatures;



// // 1. copy query
//     let queryObj = { ...req.query };

//     // 2. Remove unwated field
//     const removeFields = ["keyword", "page", "limit", "sort", "fields"];
//     removeFields.forEach((field) => delete queryObj[field]);

//     // 3. convert operators
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     queryObj = JSON.parse(queryStr);

//     // 4. build query
//     let query = Product.find(queryObj);

//     // 5. Search
//     if (req.query.keyword) {
//       query = query.find({
//         name: {
//           $regex: req.query.keyword,
//           $options: "i",
//         },
//       });
//     }

//     // Pagination
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 5;

//     let skip = (page - 1) * limit;

//     const totalProducts = await Product.countDocuments();

//     if (skip >= totalProducts) {
//       return res.status(404).json({
//         status: "fail",
//         message: "This Page does not exist",
//       });
//     }

//     query = query.skip(skip).limit(limit);

//     //  Sorting
//     console.log(req.query);

//     let sorting = req.query.sort.split(",").join(" ");

//     query = query.sort(sorting);

//     // Limiting fields

//     let selectedFields = req.query.fields.split(",").join(" ");

//     query = query.select(selectedFields);