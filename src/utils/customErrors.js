function CustomError(statusCode, message) {
  Error.call(this, message);
  this.message = message;
  this.status = statusCode;
}

CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = Error;

function DBError(error) {
  CustomError.call(this, 500, 'Internal Server Error');
  console.error('DBError: ', error.message);
}

DBError.prototype = Object.create(CustomError.prototype);
DBError.prototype.constructor = CustomError;

module.exports = { CustomError, DBError };
