import { CreateUserRequest } from '../../dto/user-request';
import { PasswordHelper } from '../../helpers/password.helper';
import { UserService } from './user.service';
import { UserRepository } from '../../user-repository';
import { AuthResponse } from '../../dto/auth-response';
import { JwtService } from '../jwt-service/jwt.service';
import { BadRequest } from '../../exceptions/bad-request';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: { createUser: jest.SpyInstance };
  let jwtService: { generateToken: jest.SpyInstance };

  beforeEach(() => {
    jwtService = { generateToken: jest.fn() };
    userRepository = { createUser: jest.fn() };
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
});
