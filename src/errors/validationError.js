class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 422; // UNPROCESSABLE ENTITY
  }
}

module.exports = ValidationError;
