import { Pool, RowDataPacket } from 'mysql2/promise';
import { User } from './model/user';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  public async createUser(
    username: string,
    passwordHash: string
  ): Promise<number> {
    const sql = `INSERT INTO users (username, password)
                 VALUES (?, ?)`;

    const [row] = await this.pool.execute(sql, [username, passwordHash]);
    return (row as ResultSetHeader).insertId;
  }

  public async findUserByUsername(username: string): Promise<User> {
    const sql = `SELECT *
                 FROM users
                 WHERE username = ?`;

    const [queryResult] = await this.pool.execute(sql, [username]);

    const rows = queryResult as RowDataPacket[];

    if (rows.length > 1)
      throw new Error('Query did not return a single result');

    const [user] = rows;

    return new User(user.id, user.username, user.password);
  }
}
