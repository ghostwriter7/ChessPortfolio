import { CreateUserRequest, SignInRequest } from '../../dto/user-request';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserService } from './user.service';
import { UserRepository } from '../../user-repository';
import { AuthResponse } from '../../dto/auth-response';
import { JwtService } from '../jwt-service/jwt.service';
import { BadRequest } from '../../exceptions/bad-request';
import { Unauthorized } from '../../exceptions/unauthorized';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: {
    createUser: jest.SpyInstance;
    findUserByUsername: jest.SpyInstance;
  };
  let jwtService: { generateToken: jest.SpyInstance };

  beforeEach(() => {
    jwtService = { generateToken: jest.fn() };
    userRepository = { createUser: jest.fn(), findUserByUsername: jest.fn() };
    userService = new UserService(
      userRepository as unknown as UserRepository,
      jwtService as unknown as JwtService
    );
  });

  describe('signUp', () => {
    it('should save user and generate a JsonWebToken', async () => {
      const createUserRequest: CreateUserRequest = {
        password: 'test123',
        username: 'NewUser',
      };
      const userId = 100;
      const hashedPassword = '<PASSWORD>';
      const hashPasswordSpy = jest
        .spyOn(PasswordHelper, 'hashPassword')
        .mockReturnValue(hashedPassword);
      const dummyToken = 'dummy token';
      jwtService.generateToken.mockReturnValue(dummyToken);
      userRepository.createUser.mockReturnValue(userId);

      const authResponse = await userService.signUp(createUserRequest);

      expect(hashPasswordSpy).toHaveBeenCalledWith(createUserRequest.password);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        createUserRequest.username,
        hashedPassword
      );
      expect(authResponse).toEqual(new AuthResponse(dummyToken));
    });

    it('should throw an error when username already exists', async () => {
      const createUserRequest: CreateUserRequest = {
        password: 'test123',
        username: 'NewUser',
      };
      const error = new Error();
      userRepository.createUser.mockRejectedValue(error);

      await expect(userService.signUp(createUserRequest)).rejects.toThrow(
        new BadRequest('Username already exists', error)
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
        new BadRequest(`User ${signInRequest.username} not found`)
      );

      expect(userRepository.findUserByUsername).toHaveBeenCalledWith(
        signInRequest.username
      );
      expect(userRepository.findUserByUsername).toHaveBeenCalledTimes(1);
      expect(jwtService.generateToken).not.toHaveBeenCalled();
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
        new Unauthorized()
      );

      expect(verifyPasswordSpy).toHaveBeenCalledWith(
        signInRequest.password,
        '<HASH>'
      );
      expect(jwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should return a JsonWebToken when the user exists and the password is correct', async () => {
      const userId = 1;
      userRepository.findUserByUsername.mockResolvedValue({
        id: userId,
        passwordHash: '<HASH>',
      });
      jest.spyOn(PasswordHelper, 'verifyPassword').mockReturnValue(true);
      const dummyToken = 'dummy token';
      jwtService.generateToken.mockReturnValue(dummyToken);

      const authResponse = await userService.signIn(signInRequest);

      expect(authResponse).toEqual(new AuthResponse(dummyToken));
      expect(jwtService.generateToken).toHaveBeenCalledWith({ id: userId });
      expect(jwtService.generateToken).toHaveBeenCalledTimes(1);
    });
  });
});
