import { db } from '../config/database';

export class EmployerService {
  static searchCandidates(query: { skill?: string; minPoints?: number; category?: string }) {
    const skillFilter = query.skill ? query.skill.toLowerCase() : null;
    const minPoints = query.minPoints ? Number(query.minPoints) : 0;
    const categoryFilter = query.category ? query.category.toLowerCase() : null;

    // Use the "FROM student_profiles sp JOIN student_skills ss" query which the engine handles
    const params: any[] = [minPoints];
    if (skillFilter) {
      params.push(`%${skillFilter}%`, `%${skillFilter}%`);
    }
    if (categoryFilter) {
      params.push(`%${categoryFilter}%`);
    }

    return db.prepare('FROM student_profiles sp JOIN student_skills ss').all(...params) as any[];
  }
}
