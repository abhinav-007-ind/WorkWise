import { db } from '../config/database';
import crypto from 'crypto';

export class BadgeService {
  static evaluateBadges(studentId: string, triggerSubmissionId?: string) {
    const badges = db.prepare('SELECT * FROM badges').all() as any[];
    const newlyAwardedBadges: any[] = [];

    const getStudentSkillTotal = db.prepare(`
      SELECT total_points FROM student_skills WHERE student_id = ? AND skill_id = ?
    `);

    const getStudentSubmissionsCount = db.prepare(`
      SELECT COUNT(*) as count FROM submissions WHERE student_id = ? AND status IN ('SCORED', 'PUBLISHED', 'ANALYZED')
    `);

    const getStudentTotalXP = db.prepare(`
      SELECT SUM(total_points) as total FROM student_skills WHERE student_id = ?
    `);

    const getStudentChallengeCompletions = db.prepare(`
      SELECT COUNT(*) as count FROM challenge_submissions WHERE student_id = ? AND status = 'passed'
    `);

    const isAlreadyAwarded = db.prepare(`
      SELECT id FROM student_badges WHERE student_id = ? AND badge_id = ?
    `);

    const insertStudentBadge = db.prepare(`
      INSERT INTO student_badges (id, student_id, badge_id, earned_at, evidence_submission_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertNotification = db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, created_at)
      VALUES (?, (SELECT user_id FROM student_profiles WHERE id = ?), 'BADGE_AWARDED', ?, ?, ?)
    `);

    for (const badge of badges) {
      if (isAlreadyAwarded.get(studentId, badge.id)) {
        continue; // Already earned
      }

      let eligible = false;

      if (badge.rule_type === 'total_skill_points' && badge.skill_id) {
        const row = getStudentSkillTotal.get(studentId, badge.skill_id) as any;
        if (row && row.total_points >= badge.threshold) {
          eligible = true;
        }
      } else if (badge.rule_type === 'submission_count') {
        const row = getStudentSubmissionsCount.get(studentId) as any;
        if (row && row.count >= badge.threshold) {
          eligible = true;
        }
      } else if (badge.rule_type === 'category_points') {
        const row = getStudentTotalXP.get(studentId) as any;
        if (row && row.total >= badge.threshold) {
          eligible = true;
        }
      } else if (badge.rule_type === 'challenge_completion') {
        const row = getStudentChallengeCompletions.get(studentId) as any;
        if (row && row.count >= badge.threshold) {
          eligible = true;
        }
      }

      if (eligible) {
        const sbId = 'stdbadge_' + crypto.randomBytes(8).toString('hex');
        const now = new Date().toISOString();
        insertStudentBadge.run(sbId, studentId, badge.id, now, triggerSubmissionId || null);

        // Notify
        const notifId = 'notif_' + crypto.randomBytes(8).toString('hex');
        insertNotification.run(
          notifId,
          studentId,
          `🏆 Badge Earned: ${badge.name}`,
          `Congratulations! You've unlocked the badge "${badge.name}" — ${badge.description}`,
          now
        );

        newlyAwardedBadges.push(badge);
      }
    }

    return newlyAwardedBadges;
  }
}
