import { AuthResponse, CreateUserRequest, SignInRequest } from '@api';
import { Request, Router } from 'express';
import pool from './database';
import { UserService } from './services/user-service/user.service';
import { UserRepository } from './user-repository';
import { JwtService } from './services/jwt-service/jwt.service';

const router = Router();
const jwtService = new JwtService();
const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository, jwtService);

router.post(
  '/sign-up',
  async (req: Request<never, AuthResponse, CreateUserRequest>, res) => {
    const createUserRequest = req.body;

    const authResponse = await userService.signUp(createUserRequest);

    res.status(201).send(authResponse);
  }
);

router.post(
  '/sign-in',
  async (req: Request<never, AuthResponse, SignInRequest>, res) => {
    const signInRequest = req.body;

    const authResponse = await userService.signIn(signInRequest);

    res.status(200).send(authResponse);
  }
);

export default router;
