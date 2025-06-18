import { Request, Router } from 'express';
import { UserService } from './user-service';
import pool from './database';
import { UserRepository } from './user-repository';
import { CreateUserRequest, SignInRequest } from './dto/user-request';
import { AuthResponse } from './dto/auth-response';

const router = Router();
const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository);

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
