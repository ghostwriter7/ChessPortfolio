export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly email: string,
    public readonly active: boolean
  ) {}

  public static builder(): UserBuilder {
    return new UserBuilder();
  }
}

class UserBuilder {
  private id: number | null = null;
  private username: string | null = null;
  private email: string | null = null;
  private active = false;
  private password: string | null = null;

  public withId(id: number): UserBuilder {
    this.id = id;
    return this;
  }

  public withUsername(username: string): UserBuilder {
    this.username = username;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  public withActive(active: boolean): UserBuilder {
    this.active = active;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.password = password;
    return this;
  }

  public build(): User {
    if (!this.id || !this.username || !this.email) {
      throw new Error('User is not complete');
    }

    return new User(
      this.id,
      this.username,
      this.password,
      this.email,
      this.active
    );
  }
}
