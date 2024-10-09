module.exports = class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent constructor with the message

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "client fail" : "server error";
    this.isOperational = true;

    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this, this.constructor);
  }
}
