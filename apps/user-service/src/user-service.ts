import * as jwt from 'jsonwebtoken';
import { CreateUserRequest, SignInRequest } from './dto/user-request';
import { BadRequest } from './exceptions/bad-request';
import { Unauthorized } from './exceptions/unauthorized';
import { PasswordHelper } from './helpers/password.helper';
import { UserRepository } from './user-repository';
import { AuthResponse } from './dto/auth-response';

const JWT_SECRET = 'temp-secret-for-dev-work';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async signUp(
    createUserRequest: CreateUserRequest
  ): Promise<AuthResponse> {
    const { username, password } = createUserRequest;

    const passwordHash = PasswordHelper.hashPassword(password);
    try {
      const userId = await this.userRepository.createUser(
        username,
        passwordHash
      );
      const token = this.generateToken(userId);
      return new AuthResponse(token);
    } catch (e) {
      throw new BadRequest('Username already exists', e);
    }
  }

  public async signIn(signInRequest: SignInRequest): Promise<AuthResponse> {
    const { username, password } = signInRequest;

    const user = await this.userRepository.findUserByUsername(username);

    if (!user) {
      throw new BadRequest(`User ${username} not found`);
    }

    const isValidPassword = PasswordHelper.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Unauthorized();
    }

    const token = this.generateToken(user.id);

    return new AuthResponse(token);
  }

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });
  }
}
