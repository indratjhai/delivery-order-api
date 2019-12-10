const mysql = require('mysql2/promise');

class ModelBase {
  static async getConnection() {
    if (!ModelBase.connection) {
      // create the default connection to database
      ModelBase.connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: 3306,
        connectTimeout: 5000,
      });
    }

    return ModelBase.connection;
  }
}

module.exports = ModelBase;
