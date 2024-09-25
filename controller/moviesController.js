/* Route handler functions */
const Movie = require("./../models/moviesModel");

exports.createMovie = async (req, res) => {
  try {
    
    
    const movie = await Movie.create();
    res.status(201).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    // console.log(req.query);
    // let excludeFields = ['sort', 'page', 'field', 'group'];
    // let queryObj = {...req.query};
    // excludeFields.forEach(field => delete queryObj[field])
    //console.log(queryObj);
    

    // Filtering Logic
    let queryString = JSON.stringify(req.query)
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, ((match)=> `$${match}`));
    const queryObject = JSON.parse(queryString);
    
    let query = Movie.find(queryObject)
    // Sorting Logic
    let query1 = Movie.find()

    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ')
      console.log(sortBy);
      query = query1.sort(sortBy)
      
    }

    // Select fields (inclusion and exclusion)

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ')
      console.log(fields);
      
      query1 = query1.select(fields)
    }

    const movies = await query1


    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error.message,
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.find({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      movie,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
