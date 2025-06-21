import { CreateUserRequest, SignInRequest } from '@api';
import { BadRequestException } from '../../exceptions/bad-request-exception';
import { UnauthorizedException } from '../../exceptions/unauthorized-exception';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserRepository } from '../../user-repository';
import { JwtService } from '../jwt-service/jwt.service';
import { TokensWithUsername } from '../../dtos/tokens';
import { TokenPayload } from '../../dtos/token-payload';
import { SqlException } from '../../exceptions/sql-exception';
import { InternalServerException } from '../../exceptions/internal-server-exception';
import { ForbiddenException } from '../../exceptions/forbidden-exception';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  public async signUp(createUserRequest: CreateUserRequest): Promise<number> {
    const { username, password, email } = createUserRequest;

    const passwordHash = PasswordHelper.hashPassword(password);
    try {
      return await this.userRepository.createUser(
        username,
        email,
        passwordHash
      );
    } catch (e) {
      if (
        e instanceof SqlException &&
        e.code === SqlException.UNIQUE_VIOLATION
      ) {
        throw new BadRequestException('User exists');
      }
      throw new InternalServerException();
    }
  }

  public async signIn(
    signInRequest: SignInRequest
  ): Promise<TokensWithUsername> {
    const { username, password } = signInRequest;

    const user = await this.userRepository.findUserByUsernameOrEmail(username);

    if (!user) {
      throw new BadRequestException(`User ${username} not found`);
    }

    if (!user.active) {
      throw new ForbiddenException('User is not active');
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
    return { ...tokens, username: user.username };
  }

  public async refreshTokens(
    refreshToken: string
  ): Promise<TokensWithUsername> {
    const { userId } = this.jwtService.verifyToken<TokenPayload>(refreshToken);

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new BadRequestException(`User ${userId} not found`);
    }

    if (!user.active) {
      throw new ForbiddenException('User is not active');
    }

    const tokens = this.jwtService.generateAuthTokens(user.id);
    console.log(`Tokens refreshed for ${user.username}`);
    return { ...tokens, username: user.username };
  }
}
