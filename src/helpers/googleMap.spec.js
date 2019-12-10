const { calculateDistance } = require('./googleMap');

describe('calculateDistance', () => {
  it('should correctly calculate distance for two valid coordinates', async () => {
    const origin = ['-6.185700799999999', '106.8111084'];
    const destination = ['-6.2073402', '106.7976586'];
    const distance = await calculateDistance(origin, destination);

    expect(distance).toBe(4594);
  });

  it('should return null for two invalid coordinates', async () => {
    const origin = ['200', '200'];
    const destination = ['0', '0'];
    const distance = await calculateDistance(origin, destination);

    expect(distance).toBe(null);
  });

  it('should throw an Error when API Key is not provided', async () => {
    const origin = ['-6.185700799999999', '106.8111084'];
    const destination = ['-6.2073402', '106.7976586'];

    await expect(calculateDistance(origin, destination, 'invalid_key'))
      .rejects.toThrowError(Error);
  });
});
