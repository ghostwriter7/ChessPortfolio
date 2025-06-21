import { Pool, RowDataPacket } from 'mysql2/promise';
import { User } from './model/user';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';
import { SqlException } from './exceptions/sql-exception';

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  public async createUser(
    username: string,
    passwordHash: string
  ): Promise<number> {
    const sql = `INSERT INTO users (username, password)
                 VALUES (?, ?)`;

    try {
      const [row] = await this.pool.execute(sql, [username, passwordHash]);
      return (row as ResultSetHeader).insertId;
    } catch (e) {
      const exceptionCode =
        e.code === 'ER_DUP_ENTRY'
          ? SqlException.UNIQUE_VIOLATION
          : SqlException.UNKNOWN_ERROR;
      throw new SqlException(e.message, exceptionCode);
    }
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    const sql = `SELECT *
                 FROM users
                 WHERE username = ?`;

    const [queryResult] = await this.pool.execute(sql, [username]);

    const rows = queryResult as RowDataPacket[];

    if (rows.length > 1)
      throw new Error('Query did not return a single result');

    const [user] = rows;

    if (user) {
      return new User(user.id, user.username, user.password);
    }

    return null;
  }

  public async findUserById(userId: number): Promise<User | null> {
    const sql = `SELECT *
                 FROM users
                 WHERE id = ?`;

    const [queryResult] = await this.pool.execute(sql, [userId]);

    const rows = queryResult as RowDataPacket[];

    if (rows.length > 1)
      throw new Error('Query did not return a single result');

    const [user] = rows;

    if (user) {
      return new User(user.id, user.username, user.password);
    }

    return null;
  }
}
