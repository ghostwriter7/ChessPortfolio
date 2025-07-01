import {
  CreateUserRequest,
  EMAIL_NOTIFICATION_REQUESTED,
  SignInRequest,
} from '@api';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserService } from './user.service';
import { UserRepository } from '../../user-repository';
import { JwtService } from '../jwt/jwt.service';
import { BadRequestException } from '../../exceptions/bad-request-exception';
import { UnauthorizedException } from '../../exceptions/unauthorized-exception';
import { User } from '../../model/user';
import * as jwt from 'jsonwebtoken';
import { SqlException } from '../../exceptions/sql-exception';
import { ForbiddenException } from '../../exceptions/forbidden-exception';
import { BrokerService } from '@api';

describe('UserService', () => {
  let userService: UserService;
  let brokerService: {
    send: jest.SpyInstance;
  };
  let userRepository: {
    createUser: jest.SpyInstance;
    findUserByUsernameOrEmail: jest.SpyInstance;
    findUserById: jest.SpyInstance;
  };
  let jwtService: {
    generateToken: jest.SpyInstance;
    generateAuthTokens: jest.SpyInstance;
    verifyToken: jest.SpyInstance;
  };

  beforeEach(() => {
    jwtService = {
      generateToken: jest.fn(),
      generateAuthTokens: jest.fn(),
      verifyToken: jest.fn(),
    };
    userRepository = {
      createUser: jest.fn(),
      findUserByUsernameOrEmail: jest.fn(),
      findUserById: jest.fn(),
    };
    brokerService = { send: jest.fn() };
    userService = new UserService(
      userRepository as unknown as UserRepository,
      jwtService as unknown as JwtService,
      brokerService as unknown as BrokerService
    );
  });

  const tokens = { accessToken: 'access token', refreshToken: 'refresh token' };

  describe('signUp', () => {
    const createUserRequest: CreateUserRequest = {
      password: 'test123',
      username: 'NewUser',
      email: 'test@test.com',
    };

    it('should save user', async () => {
      const userId = 100;
      const hashedPassword = '<PASSWORD>';
      const hashPasswordSpy = jest
        .spyOn(PasswordHelper, 'hashPassword')
        .mockReturnValue(hashedPassword);
      const verificationToken = 'dummy verification token';
      jwtService.generateToken.mockReturnValue(verificationToken);

      userRepository.createUser.mockReturnValue(userId);

      const response = await userService.signUp(createUserRequest);

      expect(brokerService.send).toHaveBeenCalledWith(
        EMAIL_NOTIFICATION_REQUESTED,
        userId.toString(),
        {
          email: createUserRequest.email,
          message: expect.stringContaining(verificationToken),
        }
      );
      expect(jwtService.generateToken).toHaveBeenCalledWith(
        { userId, type: 'verification' },
        '2d'
      );
      expect(hashPasswordSpy).toHaveBeenCalledWith(createUserRequest.password);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        createUserRequest.username,
        createUserRequest.email,
        hashedPassword
      );
      expect(response).toEqual(userId);
    });

    it('should throw an error when username already exists', async () => {
      userRepository.createUser.mockImplementation(() => {
        throw new SqlException('duplicate', SqlException.UNIQUE_VIOLATION);
      });

      await expect(userService.signUp(createUserRequest)).rejects.toThrow(
        new BadRequestException('User exists')
      );
    });
  });

  const userId = 100;

  const anyActiveUser = User.builder()
    .withId(userId)
    .withActive(true)
    .withUsername('test')
    .withPassword('<HASH>')
    .withEmail('test@test.com')
    .build();

  describe('signIn', () => {
    const signInRequest: SignInRequest = {
      username: 'test',
      password: '<PASSWORD>',
    };

    it('should throw an exception when the user does not exist', async () => {
      await expect(userService.signIn(signInRequest)).rejects.toThrow(
        new BadRequestException(`User ${signInRequest.username} not found`)
      );

      expect(userRepository.findUserByUsernameOrEmail).toHaveBeenCalledWith(
        signInRequest.username
      );
      expect(userRepository.findUserByUsernameOrEmail).toHaveBeenCalledTimes(1);
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it('should throw an exception when the user exists but is inactive', async () => {
      userRepository.findUserByUsernameOrEmail.mockReturnValue({
        ...anyActiveUser,
        active: false,
      });

      await expect(userService.signIn(signInRequest)).rejects.toThrow(
        new ForbiddenException('User is not active')
      );

      expect(userRepository.findUserByUsernameOrEmail).toHaveBeenCalledWith(
        signInRequest.username
      );
      expect(userRepository.findUserByUsernameOrEmail).toHaveBeenCalledTimes(1);
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it('should throw an exception when the password is incorrect', async () => {
      userRepository.findUserByUsernameOrEmail.mockResolvedValue(anyActiveUser);
      const verifyPasswordSpy = jest
        .spyOn(PasswordHelper, 'verifyPassword')
        .mockReturnValue(false);

      await expect(userService.signIn(signInRequest)).rejects.toThrow(
        new UnauthorizedException()
      );

      expect(verifyPasswordSpy).toHaveBeenCalledWith(
        signInRequest.password,
        '<HASH>'
      );
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it('should return access and refresh tokens when the user exists, is active and the password is correct', async () => {
      userRepository.findUserByUsernameOrEmail.mockResolvedValue(anyActiveUser);
      jest.spyOn(PasswordHelper, 'verifyPassword').mockReturnValue(true);
      jwtService.generateAuthTokens.mockReturnValue(tokens);

      const response = await userService.signIn(signInRequest);

      expect(response).toEqual({ ...tokens, username: signInRequest.username });
      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(
        anyActiveUser.id
      );
      expect(jwtService.generateAuthTokens).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshTokens', () => {
    const token = 'access token';

    it('should generate access and refresh tokens when the refresh token is valid', async () => {
      jwtService.verifyToken.mockReturnValue({ userId: anyActiveUser.id });
      userRepository.findUserById.mockReturnValue(anyActiveUser);
      jwtService.generateAuthTokens.mockReturnValue(tokens);

      const response = await userService.refreshTokens(token);

      expect(jwtService.verifyToken).toHaveBeenCalledWith(token);
      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(userId);
      expect(response).toEqual({ ...tokens, username: anyActiveUser.username });
    });

    it('should throw an exception when the token is invalid', async () => {
      jwtService.verifyToken.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('any error');
      });

      await expect(userService.refreshTokens(token)).rejects.toThrow(
        new jwt.JsonWebTokenError('any error')
      );

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it('should throw an exception when the user is not found', async () => {
      jwtService.verifyToken.mockReturnValue({ userId });
      userRepository.findUserById.mockReturnValue(null);

      await expect(userService.refreshTokens(token)).rejects.toThrow(
        new BadRequestException(`User ${userId} not found`)
      );

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it('should throw an exception when the user exists but is inactive', async () => {
      jwtService.verifyToken.mockReturnValue({ userId });
      userRepository.findUserById.mockReturnValue({
        ...anyActiveUser,
        active: false,
      });

      await expect(userService.refreshTokens(token)).rejects.toThrow(
        new ForbiddenException('User is not active')
      );

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });
  });
});
