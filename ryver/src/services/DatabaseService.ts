import mysql from 'mysql2/promise';

export class DatabaseService {
  private connection: mysql.Connection | undefined;

  constructor() {
    this.init();
  }

  private async init() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true,
      },
    });
  }

  public async getUser(userId: string) {
    if (!this.connection) {
      throw new Error('Database connection is not initialized');
    }
    const [rows] = await this.connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows;
  }
}
