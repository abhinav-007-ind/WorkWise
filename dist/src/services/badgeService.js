"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
const database_1 = require("../config/database");
const crypto_1 = __importDefault(require("crypto"));
class BadgeService {
    static evaluateBadges(studentId, triggerSubmissionId) {
        const badges = database_1.db.prepare('SELECT * FROM badges').all();
        const newlyAwardedBadges = [];
        const getStudentSkillTotal = database_1.db.prepare(`
      SELECT total_points FROM student_skills WHERE student_id = ? AND skill_id = ?
    `);
        const getStudentSubmissionsCount = database_1.db.prepare(`
      SELECT COUNT(*) as count FROM submissions WHERE student_id = ? AND status IN ('SCORED', 'PUBLISHED', 'ANALYZED')
    `);
        const getStudentTotalXP = database_1.db.prepare(`
      SELECT SUM(total_points) as total FROM student_skills WHERE student_id = ?
    `);
        const getStudentChallengeCompletions = database_1.db.prepare(`
      SELECT COUNT(*) as count FROM challenge_submissions WHERE student_id = ? AND status = 'passed'
    `);
        const isAlreadyAwarded = database_1.db.prepare(`
      SELECT id FROM student_badges WHERE student_id = ? AND badge_id = ?
    `);
        const insertStudentBadge = database_1.db.prepare(`
      INSERT INTO student_badges (id, student_id, badge_id, earned_at, evidence_submission_id)
      VALUES (?, ?, ?, ?, ?)
    `);
        const insertNotification = database_1.db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, created_at)
      VALUES (?, (SELECT user_id FROM student_profiles WHERE id = ?), 'BADGE_AWARDED', ?, ?, ?)
    `);
        for (const badge of badges) {
            if (isAlreadyAwarded.get(studentId, badge.id)) {
                continue; // Already earned
            }
            let eligible = false;
            if (badge.rule_type === 'total_skill_points' && badge.skill_id) {
                const row = getStudentSkillTotal.get(studentId, badge.skill_id);
                if (row && row.total_points >= badge.threshold) {
                    eligible = true;
                }
            }
            else if (badge.rule_type === 'submission_count') {
                const row = getStudentSubmissionsCount.get(studentId);
                if (row && row.count >= badge.threshold) {
                    eligible = true;
                }
            }
            else if (badge.rule_type === 'category_points') {
                const row = getStudentTotalXP.get(studentId);
                if (row && row.total >= badge.threshold) {
                    eligible = true;
                }
            }
            else if (badge.rule_type === 'challenge_completion') {
                const row = getStudentChallengeCompletions.get(studentId);
                if (row && row.count >= badge.threshold) {
                    eligible = true;
                }
            }
            if (eligible) {
                const sbId = 'stdbadge_' + crypto_1.default.randomBytes(8).toString('hex');
                const now = new Date().toISOString();
                insertStudentBadge.run(sbId, studentId, badge.id, now, triggerSubmissionId || null);
                // Notify
                const notifId = 'notif_' + crypto_1.default.randomBytes(8).toString('hex');
                insertNotification.run(notifId, studentId, `🏆 Badge Earned: ${badge.name}`, `Congratulations! You've unlocked the badge "${badge.name}" — ${badge.description}`, now);
                newlyAwardedBadges.push(badge);
            }
        }
        return newlyAwardedBadges;
    }
}
exports.BadgeService = BadgeService;
