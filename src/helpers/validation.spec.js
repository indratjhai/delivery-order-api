const { isValidLatitude, isValidLongitude, isIntegerString } = require('../helpers/validation');

describe('isValidLatitude', () => {
  it('should return true for correct latitude', async () => {
    expect(isValidLatitude('90.00000')).toBe(true);
  });
  it('should return false for incorrect latitude', async () => {
    expect(isValidLatitude('100.00000')).toBe(false);
    expect(isValidLatitude('abc100.00000')).toBe(false);
  });
});

describe('isValidLongitude', () => {
  it('should return true for correct latitude', async () => {
    expect(isValidLongitude('180.00000')).toBe(true);
  });
  it('should return false for incorrect latitude', async () => {
    expect(isValidLongitude('200.00000')).toBe(false);
    expect(isValidLongitude('abc200.00000')).toBe(false);
  });
});

describe('isIntegerString', () => {
  it('should return true for integer string', async () => {
    expect(isIntegerString('123')).toBe(true);
  });
  it('should return false for non-integer string', async () => {
    expect(isIntegerString('123.00')).toBe(false);
    expect(isIntegerString('abc123')).toBe(false);
  });
});
