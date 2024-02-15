class NotRightError extends Error {
  constructor(message) {
    super(`Error 401: ${message}`);
    this.statusCode = 401;
  }
}
module.exports = NotRightError;
