import { CreateUserRequest, SignInRequest } from '@api';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserService } from './user.service';
import { UserRepository } from '../../user-repository';
import { JwtService } from '../jwt-service/jwt.service';
import { BadRequestException } from '../../exceptions/bad-request-exception';
import { UnauthorizedException } from '../../exceptions/unauthorized-exception';
import { User } from '../../model/user';
import * as jwt from 'jsonwebtoken';
import { SqlException } from '../../exceptions/sql-exception';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: {
    createUser: jest.SpyInstance;
    findUserByUsername: jest.SpyInstance;
    findUserById: jest.SpyInstance;
  };
  let jwtService: {
    generateAuthTokens: jest.SpyInstance;
    verifyToken: jest.SpyInstance;
  };

  beforeEach(() => {
    jwtService = { generateAuthTokens: jest.fn(), verifyToken: jest.fn() };
    userRepository = {
      createUser: jest.fn(),
      findUserByUsername: jest.fn(),
      findUserById: jest.fn(),
    };
    userService = new UserService(
      userRepository as unknown as UserRepository,
      jwtService as unknown as JwtService
    );
  });

  const tokens = { accessToken: 'access token', refreshToken: 'refresh token' };

  describe('signUp', () => {
    it('should save user and generate access and refresh tokens', async () => {
      const createUserRequest: CreateUserRequest = {
        password: 'test123',
        username: 'NewUser',
      };
      const userId = 100;
      const hashedPassword = '<PASSWORD>';
      const hashPasswordSpy = jest
        .spyOn(PasswordHelper, 'hashPassword')
        .mockReturnValue(hashedPassword);

      jwtService.generateAuthTokens.mockReturnValue(tokens);
      userRepository.createUser.mockReturnValue(userId);

      const response = await userService.signUp(createUserRequest);

      expect(hashPasswordSpy).toHaveBeenCalledWith(createUserRequest.password);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        createUserRequest.username,
        hashedPassword
      );
      expect(response).toEqual({
        ...tokens,
        username: createUserRequest.username,
      });
    });

    it('should throw an error when username already exists', async () => {
      const createUserRequest: CreateUserRequest = {
        password: 'test123',
        username: 'NewUser',
      };
      userRepository.createUser.mockImplementation(() => {
        throw new SqlException('duplicate', SqlException.UNIQUE_VIOLATION);
      });

      await expect(userService.signUp(createUserRequest)).rejects.toThrow(
        new BadRequestException('Username already exists')
      );
    });
  });

  describe('signIn', () => {
    const signInRequest: SignInRequest = {
      username: 'test',
      password: '<PASSWORD>',
    };

    it('should throw an exception when the user does not exist', async () => {
      await expect(userService.signIn(signInRequest)).rejects.toThrow(
        new BadRequestException(`User ${signInRequest.username} not found`)
      );

      expect(userRepository.findUserByUsername).toHaveBeenCalledWith(
        signInRequest.username
      );
      expect(userRepository.findUserByUsername).toHaveBeenCalledTimes(1);
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it('should throw an exception when the password is incorrect', async () => {
      userRepository.findUserByUsername.mockResolvedValue({
        id: 1,
        passwordHash: '<HASH>',
      });
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

    it('should return access and refresh tokens when the user exists and the password is correct', async () => {
      const userId = 1;
      userRepository.findUserByUsername.mockResolvedValue({
        id: userId,
        username: signInRequest.username,
        passwordHash: '<HASH>',
      });
      jest.spyOn(PasswordHelper, 'verifyPassword').mockReturnValue(true);
      jwtService.generateAuthTokens.mockReturnValue(tokens);

      const response = await userService.signIn(signInRequest);

      expect(response).toEqual({ ...tokens, username: signInRequest.username });
      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(userId);
      expect(jwtService.generateAuthTokens).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshTokens', () => {
    const token = 'access token';
    const userId = 100;

    it('should generate access and refresh tokens when the refresh token is valid', async () => {
      jwtService.verifyToken.mockReturnValue({ userId: userId });
      userRepository.findUserById.mockReturnValue(
        new User(userId, 'test', 'test')
      );
      jwtService.generateAuthTokens.mockReturnValue(tokens);

      const response = await userService.refreshTokens(token);

      expect(jwtService.verifyToken).toHaveBeenCalledWith(token);
      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(userId);
      expect(response).toEqual({ ...tokens, username: 'test' });
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
  });
});
