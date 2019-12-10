class NotFoundError extends Error {
  constructor(message) {
    super(message || 'Not found');
    this.name = this.constructor.name;
    this.status = 404; // NOT FOUND
  }
}

module.exports = NotFoundError;
