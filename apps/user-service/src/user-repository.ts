import { Pool, RowDataPacket } from 'mysql2/promise';
import { User } from './model/user';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader';
import { SqlException } from './exceptions/sql-exception';

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  public async activateUser(userId: number): Promise<void> {
    const sql = `UPDATE users
                 SET active = TRUE
                 WHERE id = ?`;

    await this.pool.execute(sql, [userId]);
  }

  public async createUser(
    username: string,
    email: string,
    passwordHash: string
  ): Promise<number> {
    const sql = `INSERT INTO users (username, email, password)
                 VALUES (?, ?, ?)`;

    try {
      const [row] = await this.pool.execute(sql, [
        username,
        email,
        passwordHash,
      ]);
      return (row as ResultSetHeader).insertId;
    } catch (e) {
      const exceptionCode =
        e.code === 'ER_DUP_ENTRY'
          ? SqlException.UNIQUE_VIOLATION
          : SqlException.UNKNOWN_ERROR;
      throw new SqlException(e.message, exceptionCode);
    }
  }

  public async findUserByUsernameOrEmail(
    usernameOrEmail: string
  ): Promise<User | null> {
    const sql = `SELECT *
                 FROM users
                 WHERE username = ?
                    OR email = ?`;

    const [queryResult] = await this.pool.execute(sql, [
      usernameOrEmail,
      usernameOrEmail,
    ]);

    const rows = queryResult as RowDataPacket[];

    if (rows.length > 1)
      throw new Error('Query did not return a single result');

    const [user] = rows;

    return user ? this.createUserFromRow(user) : null;
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

    return user ? this.createUserFromRow(user) : null;
  }

  private createUserFromRow(row: RowDataPacket): User {
    return User.builder()
      .withId(row.id)
      .withUsername(row.username)
      .withEmail(row.email)
      .withActive(row.active)
      .withPassword(row.password)
      .build();
  }
}
