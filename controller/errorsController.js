const CustomError = require("./../utilites/CustomError");
const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "something went wrong, please try again later",
    });
  }
};

const castErrorHandler = (error) => {
  const msg = `you provided invalid ${error.value} for the ${error.path}`;
  return new CustomError(msg, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    devError(res, error);
  }else if (process.env.NODE_ENV === "production") {
    console.log(error);
    
    if (error.name === "CastError") {
      error = castErrorHandler(error);
      //console.log("if statement called");
      
    }
    prodError(res, error);
  }
};
