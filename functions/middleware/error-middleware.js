
function errorTypeHandler(err, req, res, next) {
  if (err instanceof Error)
    return next(err);
  else
    return next(new Error(err));
}

function errorCodeHandler(err, req, res, next) {
  if (err.message === 'Unauthorized')
    err.statusCode = 403;
  else if (err.message === 'No data')
    err.statusCode = 400;

  return next(err);
}

// error handling middlewear
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  return res.status(err.statusCode || err.code || 500).send({
    error: err.message
  });
}

module.exports = [errorTypeHandler, errorCodeHandler, errorHandler];
