import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { ProfileService } from '../services/profileService';

const router = Router();

// GET /students/me - Get current authenticated student profile
router.get('/students/me', authenticateToken, requireRole('student'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.profileId;
    if (!studentId) {
      return res.status(404).json({ error: 'Student profile not found for user' });
    }
    const profile = ProfileService.getStudentProfile(studentId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /students/me - Update profile details
router.put('/students/me', authenticateToken, requireRole('student'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.profileId!;
    const updated = ProfileService.updateStudentProfile(studentId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /students/me/skills - Get detailed skill profile
router.get('/students/me/skills', authenticateToken, requireRole('student'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.profileId!;
    const profile = ProfileService.getStudentProfile(studentId);
    res.json(profile.skills);
  } catch (err) {
    next(err);
  }
});

// GET /students/me/badges - Get earned badges
router.get('/students/me/badges', authenticateToken, requireRole('student'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.profileId!;
    const profile = ProfileService.getStudentProfile(studentId);
    res.json(profile.badges);
  } catch (err) {
    next(err);
  }
});

// GET /portfolio/:identifier - Public shareable portfolio
router.get('/portfolio/:identifier', (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const identifier = Array.isArray(req.params.identifier) ? req.params.identifier[0] : req.params.identifier;
    const portfolio = ProfileService.getPublicPortfolio(identifier);
    res.json(portfolio);
  } catch (err) {
    next(err);
  }
});

export default router;
