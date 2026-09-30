import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// GET /admin/audit-logs - View system audit logs
router.get('/admin/audit-logs', authenticateToken, requireRole('admin'), (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// POST /admin/submissions/:id/correction - Admin audited correction (PDF 2 spec)
router.post('/admin/submissions/:id/correction', authenticateToken, requireRole('admin'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const submissionId = req.params.id;
    const { skillId, newPoints, reason } = req.body;

    if (!skillId || newPoints === undefined || !reason) {
      return res.status(400).json({ error: 'skillId, newPoints, and reason are required' });
    }

    const now = new Date().toISOString();

    const correctionTx = db.transaction(() => {
      // Update submission_skills
      db.prepare(`
        UPDATE submission_skills SET points = ?, evidence = evidence || ' [Admin Correction: ' || ? || ']'
        WHERE submission_id = ? AND skill_id = ?
      `).run(newPoints, reason, submissionId, skillId);

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, created_at)
        VALUES (?, ?, 'ADMIN_CORRECTION_APPLIED', 'submission', ?, ?, ?)
      `).run('aud_' + crypto.randomBytes(8).toString('hex'), req.user!.userId, submissionId, JSON.stringify({ skillId, newPoints, reason }), now);
    });

    correctionTx();

    res.json({ message: 'Audited correction applied successfully', submission_id: submissionId });
  } catch (err) {
    next(err);
  }
});

export default router;
