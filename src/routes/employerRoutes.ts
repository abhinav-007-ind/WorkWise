import { Router, Request, Response, NextFunction } from 'express';
import { EmployerService } from '../services/employerService';

const router = Router();

// GET /employers/candidates?skill=...&minPoints=...&category=...
router.get('/employers/candidates', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skill, minPoints, category } = req.query;
    const candidates = EmployerService.searchCandidates({
      skill: skill as string,
      minPoints: minPoints ? Number(minPoints) : undefined,
      category: category as string
    });
    res.json(candidates);
  } catch (err) {
    next(err);
  }
});

export default router;
