import { db } from '../config/database';
import { StudentProfile, StudentSkill, StudentBadge, Submission } from '../models/types';

export class ProfileService {
  static getStudentProfile(studentId: string) {
    const student = db.prepare(`
      SELECT * FROM student_profiles WHERE id = ? OR user_id = ?
    `).get(studentId, studentId) as any;

    if (!student) {
      throw { status: 404, message: 'Student profile not found' };
    }

    // Get aggregated skills
    const skills = db.prepare(`
      SELECT ss.id, ss.student_id, ss.skill_id, ss.total_points, ss.evidence_count,
             s.name as skill_name, s.category as skill_category, s.description as skill_description
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.id
      WHERE ss.student_id = ?
      ORDER BY ss.total_points DESC
    `).all(student.id) as any[];

    // Get earned badges
    const badges = db.prepare(`
      SELECT sb.id, sb.student_id, sb.badge_id, sb.earned_at, sb.evidence_submission_id,
             b.name as badge_name, b.description as badge_description, b.icon_url, b.rule_type
      FROM student_badges sb
      JOIN badges b ON sb.badge_id = b.id
      WHERE sb.student_id = ?
      ORDER BY sb.earned_at DESC
    `).all(student.id) as any[];

    // Get verified submissions
    const submissions = db.prepare(`
      SELECT * FROM submissions
      WHERE student_id = ?
      ORDER BY created_at DESC
    `).all(student.id) as Submission[];

    // Calculate Total XP / Points
    const totalXP = skills.reduce((acc, s) => acc + (s.total_points || 0), 0);

    return {
      ...student,
      total_xp: totalXP,
      skills,
      badges,
      submissions_count: submissions.length,
      submissions
    };
  }

  static updateStudentProfile(studentId: string, data: {
    name?: string;
    bio?: string;
    education?: string;
    headline?: string;
    visibility?: 'public' | 'private';
  }) {
    const existing = db.prepare('SELECT id FROM student_profiles WHERE id = ?').get(studentId);
    if (!existing) {
      throw { status: 404, message: 'Student profile not found' };
    }

    const name = data.name !== undefined ? data.name : undefined;
    const bio = data.bio !== undefined ? data.bio : undefined;
    const education = data.education !== undefined ? data.education : undefined;
    const headline = data.headline !== undefined ? data.headline : undefined;
    const visibility = data.visibility !== undefined ? data.visibility : undefined;

    const fields: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (bio !== undefined) { fields.push('bio = ?'); params.push(bio); }
    if (education !== undefined) { fields.push('education = ?'); params.push(education); }
    if (headline !== undefined) { fields.push('headline = ?'); params.push(headline); }
    if (visibility !== undefined) { fields.push('visibility = ?'); params.push(visibility); }

    if (fields.length > 0) {
      params.push(studentId);
      db.prepare(`UPDATE student_profiles SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    }

    return this.getStudentProfile(studentId);
  }

  static getPublicPortfolio(identifier: string) {
    const profile = this.getStudentProfile(identifier);
    if (profile.visibility === 'private') {
      throw { status: 403, message: 'This student portfolio is set to private' };
    }

    // Return sanitized portfolio view
    return {
      name: profile.name,
      headline: profile.headline,
      bio: profile.bio,
      education: profile.education,
      total_xp: profile.total_xp,
      skills: profile.skills.map((s: any) => ({
        skill: s.skill_name,
        category: s.skill_category,
        total_points: s.total_points,
        evidence_count: s.evidence_count
      })),
      badges: profile.badges,
      verified_submissions: profile.submissions
        .filter((s: Submission) => s.status === 'PUBLISHED' || s.status === 'SCORED' || s.status === 'ANALYZED')
        .map((s: Submission) => ({
          id: s.id,
          title: s.title,
          type: s.type,
          description: s.description,
          github_url: s.github_url,
          status: s.status,
          created_at: s.created_at
        }))
    };
  }
}
