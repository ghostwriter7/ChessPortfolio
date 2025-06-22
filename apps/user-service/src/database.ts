import mysql, { PoolOptions } from 'mysql2/promise';

const options: PoolOptions = {
  host: 'mysql',
  port: 3306,
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
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      active BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.execute(createUserTableSQL);
  } catch (error) {
    console.error('Database initialization failed:');
    console.error(error);
  }
}

export default pool;
