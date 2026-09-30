"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerService = void 0;
const database_1 = require("../config/database");
class EmployerService {
    static searchCandidates(query) {
        const skillFilter = query.skill ? query.skill.toLowerCase() : null;
        const minPoints = query.minPoints ? Number(query.minPoints) : 0;
        const categoryFilter = query.category ? query.category.toLowerCase() : null;
        // Use the "FROM student_profiles sp JOIN student_skills ss" query which the engine handles
        const params = [minPoints];
        if (skillFilter) {
            params.push(`%${skillFilter}%`, `%${skillFilter}%`);
        }
        if (categoryFilter) {
            params.push(`%${categoryFilter}%`);
        }
        return database_1.db.prepare('FROM student_profiles sp JOIN student_skills ss').all(...params);
    }
}
exports.EmployerService = EmployerService;
