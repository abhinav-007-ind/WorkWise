import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
