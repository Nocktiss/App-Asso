class TokenExpiredError extends Error {
  constructor(errors) {
    super("Expired JWT Token");

    this.errors = errors;

    this.name = "TokenExpiredError";

    Error.captureStackTrace && Error.captureStackTrace(this, TokenExpiredError);
  }
}

export default TokenExpiredError;
