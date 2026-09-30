import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { ChallengeService } from '../services/challengeService';

const router = Router();

// GET /challenges - List all coding challenges
router.get('/challenges', (req, res, next) => {
  try {
    const challenges = ChallengeService.getChallenges();
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

// GET /challenges/:id - Get challenge details
router.get('/challenges/:id', (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const challenge = ChallengeService.getChallengeById(id);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

// POST /challenges/:id/submit - Submit solution for a challenge
router.post('/challenges/:id/submit', authenticateToken, requireRole('student'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.profileId!;
    const challengeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, description, code_or_link } = req.body;

    if (!title || !description || !code_or_link) {
      return res.status(400).json({ error: 'title, description, and code_or_link are required' });
    }

    const result = ChallengeService.submitChallengeSolution(studentId, challengeId, {
      title,
      description,
      code_or_link
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
