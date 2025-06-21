import { CreateUserRequest, SignInRequest } from '@api';
import { BadRequestException } from '../../exceptions/bad-request-exception';
import { UnauthorizedException } from '../../exceptions/unauthorized-exception';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserRepository } from '../../user-repository';
import { JwtService } from '../jwt-service/jwt.service';
import { Tokens } from '../../dtos/tokens';
import { TokenPayload } from '../../dtos/token-payload';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  public async signUp(createUserRequest: CreateUserRequest): Promise<Tokens> {
    const { username, password } = createUserRequest;

    const passwordHash = PasswordHelper.hashPassword(password);
    try {
      const userId = await this.userRepository.createUser(
        username,
        passwordHash
      );
      const tokens = this.jwtService.generateAuthTokens(userId);
      console.log('User successfully created');
      return tokens;
    } catch (e) {
      throw new BadRequestException('Username already exists', e);
    }
  }

  public async signIn(signInRequest: SignInRequest): Promise<Tokens> {
    const { username, password } = signInRequest;

    const user = await this.userRepository.findUserByUsername(username);

    if (!user) {
      throw new BadRequestException(`User ${username} not found`);
    }

    const isValidPassword = PasswordHelper.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    const tokens = this.jwtService.generateAuthTokens(user.id);
    console.log('User successfully signed in');
    return tokens;
  }

  public async refreshTokens(refreshToken: string): Promise<Tokens> {
    const { userId } = this.jwtService.verifyToken<TokenPayload>(refreshToken);

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new BadRequestException(`User ${userId} not found`);
    }

    const tokens = this.jwtService.generateAuthTokens(user.id);
    console.log(`Tokens refreshed for ${user.username}`);
    return tokens;
  }
}
