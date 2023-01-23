const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  // 'isError' is for RTKQuery in the frontend to handle any unexpected error
  res.status(status).json({ message: err.message, isError: true });
};

module.exports = errorHandler;
