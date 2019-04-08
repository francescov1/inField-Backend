'use strict';

// error handling middlewear
function errorHandler(err, req, res, next) {

  if (err.name === "ValidationError") {
    let message = "";
    for (let key in err.errors) {
      // temp fix for double errors
      // TODO: handle htis better
      if (message !== err.errors[key].message + " ")
        message += err.errors[key].message + " ";
    }

    err.message = message.trim();
    err.type = "NotAllowedError";
    err.status = 405;
  }

  console.error(err.stack);
  var status = err.status || err.statusCode || err.code;
  return res.status(status >= 100 && status < 600 ? status : 500).send({
    error: {
      type: err.type || err.name,
      message: err.message
    }
  });
}

module.exports = [errorHandler];
