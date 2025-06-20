import { AuthResponse, CreateUserRequest, SignInRequest } from '@api';
import { BadRequest } from '../../exceptions/bad-request';
import { Unauthorized } from '../../exceptions/unauthorized';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserRepository } from '../../user-repository';
import { JwtService } from '../jwt-service/jwt.service';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

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
      const token = this.jwtService.generateToken({ id: userId });
      console.log('User successfully created');
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

    const token = this.jwtService.generateToken({ id: user.id });
    console.log('User successfully signed in');
    return new AuthResponse(token);
  }
}
