const ModelBase = require('./modelBase');

class Order extends ModelBase {
  static get STATUS_UNASSIGNED() { return 'UNASSIGNED'; }

  static get STATUS_TAKEN() { return 'TAKEN'; }

  constructor(data) {
    super();

    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get distance() {
    return this.data.distance;
  }

  get status() {
    return this.data.status;
  }

  static async find(id) {
    const connection = await Order.getConnection();
    const [rows] = await connection.execute(
      `SELECT
                id,
                ST_X(origin) AS origin_lat,
                ST_Y(origin) AS origin_long,
                ST_X(destination) AS destination_lat,
                ST_Y(destination) AS destination_long,
                distance,
                status
            FROM orders
            WHERE id = ?`,
      [id],
    );

    if (rows[0]) {
      return new Order(rows[0]);
    }

    return null;
  }

  static async all(options) {
    const { page, limit } = options;
    const startOffset = (page * limit) - limit;

    const connection = await Order.getConnection();

    const [rows] = await connection.execute(
      `SELECT
                id,
                ST_X(origin) AS origin_lat,
                ST_Y(origin) AS origin_long,
                ST_X(destination) AS destination_lat,
                ST_Y(destination) AS destination_long,
                distance,
                status
            FROM orders
            LIMIT ?, ?`,
      [startOffset, limit],
    );

    return rows.map((row) => new Order(row));
  }

  static async create(origin, destination, distance) {
    const [originLat, originLon] = origin;
    const [destinationLat, destinationLon] = destination;

    const connection = await Order.getConnection();
    const [{ insertId }] = await connection.execute(
      `INSERT INTO orders
                (origin, destination, distance, status) VALUES
                (POINT(?, ?), POINT(?, ?), ?, ?)`,
      [
        originLat,
        originLon,
        destinationLat,
        destinationLon,
        distance,
        Order.STATUS_UNASSIGNED,
      ],
    );

    return insertId;
  }

  async take() {
    const connection = await Order.getConnection();
    const [{ affectedRows }] = await connection.execute(
      `UPDATE orders
      SET status = ?
      WHERE id = ? AND status = ?`, // Only update if status is still UNASSIGNED
      [
        Order.STATUS_TAKEN,
        this.id,
        Order.STATUS_UNASSIGNED,
      ],
    );

    return affectedRows;
  }
}

module.exports = Order;
