import {
  CreateUserRequest,
  EMAIL_NOTIFICATION_REQUESTED,
  loggerFactory,
  SignInRequest,
} from '@api';
import { TokenPayload } from '../../dtos/token-payload';
import { TokensWithUsername } from '../../dtos/tokens';
import { BadRequestException } from '../../exceptions/bad-request-exception';
import { ForbiddenException } from '../../exceptions/forbidden-exception';
import { InternalServerException } from '../../exceptions/internal-server-exception';
import { SqlException } from '../../exceptions/sql-exception';
import { UnauthorizedException } from '../../exceptions/unauthorized-exception';
import { PasswordHelper } from '../../helpers/password.helper';
import { User } from '../../model/user';
import { UserRepository } from '../../user-repository';
import { BrokerService } from '../broker/broker.service';
import { JwtService } from '../jwt/jwt.service';

export class UserService {
  private readonly logger = loggerFactory({ service: UserService.name });

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly brokerService: BrokerService
  ) {}

  public async signUp(createUserRequest: CreateUserRequest): Promise<number> {
    const { username, password, email } = createUserRequest;

    const passwordHash = PasswordHelper.hashPassword(password);
    try {
      const userId = await this.userRepository.createUser(
        username,
        email,
        passwordHash
      );

      const verificationToken = this.jwtService.generateToken(
        {
          userId,
          type: 'verification',
        },
        '2d'
      );

      await this.brokerService.send(
        EMAIL_NOTIFICATION_REQUESTED,
        userId.toString(),
        {
          email,
          subject: 'Welcome To Chess Portfolio',
          message: `
          Welcome to Chess Portfolio.
          Please click on the link below to verify your email address.
          <a href="http://localhost:4201/api/auth/verify/${verificationToken}">Verify email</a>
          `,
        }
      );

      return userId;
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

    this.verifyUserExists(user, username);
    this.verifyUserIsActive(user);

    if (!PasswordHelper.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException();
    }

    const tokens = this.jwtService.generateAuthTokens(user.id);
    this.logger.info('User successfully signed in');
    return { ...tokens, username: user.username };
  }

  public async refreshTokens(
    refreshToken: string
  ): Promise<TokensWithUsername> {
    const { userId } = this.jwtService.verifyToken<TokenPayload>(refreshToken);

    const user = await this.userRepository.findUserById(userId);

    this.verifyUserExists(user, userId);
    this.verifyUserIsActive(user);

    const tokens = this.jwtService.generateAuthTokens(user.id);
    this.logger.info(`Tokens refreshed for ${user.username}`);
    return { ...tokens, username: user.username };
  }

  public async verifyEmail(token: string): Promise<void> {
    const { userId, type } = this.jwtService.verifyToken<TokenPayload>(token);

    if (type !== 'verification') {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userRepository.findUserById(userId);

    this.verifyUserExists(user, userId);
    this.verifyUserIsInactive(user);

    return this.userRepository.activateUser(userId);
  }

  private verifyUserExists(
    user: User | null,
    identifier: string | number
  ): void {
    if (!user) {
      throw new BadRequestException(`User ${identifier} not found`);
    }
  }

  private verifyUserIsActive(user: User): void {
    if (!user.active) {
      throw new ForbiddenException('User is not active');
    }
  }

  private verifyUserIsInactive(user: User): void {
    if (user.active) {
      throw new ForbiddenException('User is already active');
    }
  }
}
