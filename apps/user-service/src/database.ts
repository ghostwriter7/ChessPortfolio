import mysql, { PoolOptions } from 'mysql2/promise';

const options: PoolOptions = {
  host: 'localhost',
  port: 4500,
  user: 'user-srv',
  password: 'test',
  database: 'userdb',
  connectionLimit: 10,
};

const pool = mysql.createPool(options);

export async function initializeDatabase(): Promise<void> {
  const createUserTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  try {
    await pool.execute(createUserTableSQL);
  } catch (error) {
    console.error(error);
  }
}

export default pool;
