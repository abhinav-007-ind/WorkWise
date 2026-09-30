"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// GET /admin/audit-logs - View system audit logs
router.get('/admin/audit-logs', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), (req, res, next) => {
    try {
        const logs = database_1.db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
        res.json(logs);
    }
    catch (err) {
        next(err);
    }
});
// POST /admin/submissions/:id/correction - Admin audited correction (PDF 2 spec)
router.post('/admin/submissions/:id/correction', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), (req, res, next) => {
    try {
        const submissionId = req.params.id;
        const { skillId, newPoints, reason } = req.body;
        if (!skillId || newPoints === undefined || !reason) {
            return res.status(400).json({ error: 'skillId, newPoints, and reason are required' });
        }
        const now = new Date().toISOString();
        const correctionTx = database_1.db.transaction(() => {
            // Update submission_skills
            database_1.db.prepare(`
        UPDATE submission_skills SET points = ?, evidence = evidence || ' [Admin Correction: ' || ? || ']'
        WHERE submission_id = ? AND skill_id = ?
      `).run(newPoints, reason, submissionId, skillId);
            // Audit Log
            database_1.db.prepare(`
        INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, created_at)
        VALUES (?, ?, 'ADMIN_CORRECTION_APPLIED', 'submission', ?, ?, ?)
      `).run('aud_' + crypto_1.default.randomBytes(8).toString('hex'), req.user.userId, submissionId, JSON.stringify({ skillId, newPoints, reason }), now);
        });
        correctionTx();
        res.json({ message: 'Audited correction applied successfully', submission_id: submissionId });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
