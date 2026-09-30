import { Router, Request, Response, NextFunction } from 'express';
import { LeaderboardService } from '../services/leaderboardService';

const router = Router();

// GET /leaderboard - Global XP leaderboard
router.get('/leaderboard', (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const leaderboard = LeaderboardService.getGlobalLeaderboard(limit);
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
});

// GET /leaderboard/skill/:skill - Skill-specific leaderboard
router.get('/leaderboard/skill/:skill', (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const skillParam = Array.isArray(req.params.skill) ? req.params.skill[0] : req.params.skill;
    const leaderboard = LeaderboardService.getSkillLeaderboard(skillParam, limit);
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
});

export default router;
