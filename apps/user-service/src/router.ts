import { Router } from 'express';
import { UserService } from './user-service';
import pool from './database';

const router = Router();
const userService = new UserService(pool);

router.post('/sign-in', (res, req) => {});

router.post('/sign-up', (res, req) => {});

export default router;
