class SubmissionError extends Error {
  constructor(errors) {
    super("Submit Validation Failed");

    this.errors = errors;

    this.name = "SubmissionError";

    Error.captureStackTrace && Error.captureStackTrace(this, SubmissionError);
  }
}

export default SubmissionError;
