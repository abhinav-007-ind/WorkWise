"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerService = void 0;
const database_1 = require("../config/database");
class EmployerService {
    static searchCandidates(query) {
        const skill = query.skill ? `%${query.skill}%` : null;
        const minPoints = query.minPoints ? Number(query.minPoints) : 0;
        const category = query.category ? `%${query.category}%` : null;
        let sql = `
      SELECT DISTINCT
        sp.id as student_id,
        sp.name,
        sp.headline,
        sp.bio,
        sp.education,
        s.name as matched_skill,
        s.category as matched_category,
        ss.total_points as skill_points,
        ss.evidence_count,
        (SELECT COUNT(*) FROM student_badges sb WHERE sb.student_id = sp.id) as badges_count
      FROM student_profiles sp
      JOIN student_skills ss ON sp.id = ss.student_id
      JOIN skills s ON ss.skill_id = s.id
      WHERE sp.visibility = 'public' AND ss.total_points >= ?
    `;
        const params = [minPoints];
        if (skill) {
            sql += ` AND (LOWER(s.name) LIKE LOWER(?) OR LOWER(s.id) LIKE LOWER(?))`;
            params.push(skill, skill);
        }
        if (category) {
            sql += ` AND LOWER(s.category) LIKE LOWER(?)`;
            params.push(category);
        }
        sql += ` ORDER BY ss.total_points DESC`;
        const candidates = database_1.db.prepare(sql).all(...params);
        return candidates;
    }
}
exports.EmployerService = EmployerService;
