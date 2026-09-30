import { db } from '../config/database';

export class LeaderboardService {
  static getGlobalLeaderboard(limit: number = 50) {
    const leaderboard = db.prepare(`
      SELECT 
        sp.id as student_id,
        sp.name,
        sp.headline,
        sp.education,
        COALESCE(SUM(ss.total_points), 0) as total_xp,
        COUNT(DISTINCT sub.id) as verified_submissions_count,
        COUNT(DISTINCT sb.id) as badges_count
      FROM student_profiles sp
      LEFT JOIN student_skills ss ON sp.id = ss.student_id
      LEFT JOIN submissions sub ON sp.id = sub.student_id AND sub.status IN ('SCORED', 'PUBLISHED', 'ANALYZED')
      LEFT JOIN student_badges sb ON sp.id = sb.student_id
      WHERE sp.visibility = 'public'
      GROUP BY sp.id
      ORDER BY total_xp DESC, verified_submissions_count DESC
      LIMIT ?
    `).all(limit) as any[];

    return leaderboard.map((row, index) => ({
      rank: index + 1,
      ...row
    }));
  }

  static getSkillLeaderboard(skillIdOrName: string, limit: number = 50) {
    const leaderboard = db.prepare(`
      SELECT 
        sp.id as student_id,
        sp.name,
        sp.headline,
        s.name as skill_name,
        s.category as skill_category,
        ss.total_points as skill_points,
        ss.evidence_count
      FROM student_skills ss
      JOIN student_profiles sp ON ss.student_id = sp.id
      JOIN skills s ON ss.skill_id = s.id
      WHERE (s.id = ? OR LOWER(s.name) = LOWER(?)) AND sp.visibility = 'public'
      ORDER BY ss.total_points DESC
      LIMIT ?
    `).all(skillIdOrName, skillIdOrName, limit) as any[];

    return leaderboard.map((row, index) => ({
      rank: index + 1,
      ...row
    }));
  }
}
