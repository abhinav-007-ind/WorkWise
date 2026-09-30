"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static register(data) {
        const { email, password, role, name, company_name, bio, education, headline } = data;
        // Check existing email
        const existing = database_1.db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            throw { status: 400, message: 'Email address already registered' };
        }
        const userId = 'usr_' + crypto_1.default.randomBytes(8).toString('hex');
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        const createdAt = new Date().toISOString();
        const insertUser = database_1.db.prepare(`
      INSERT INTO users (id, email, password_hash, role, status, created_at)
      VALUES (?, ?, ?, ?, 'active', ?)
    `);
        let profileId = '';
        const transaction = database_1.db.transaction(() => {
            insertUser.run(userId, email, passwordHash, role, createdAt);
            if (role === 'student') {
                profileId = 'std_' + crypto_1.default.randomBytes(8).toString('hex');
                const insertStudent = database_1.db.prepare(`
          INSERT INTO student_profiles (id, user_id, name, bio, education, headline, visibility, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'public', ?)
        `);
                insertStudent.run(profileId, userId, name || email.split('@')[0], bio || '', education || '', headline || 'Aspiring Tech Professional', createdAt);
            }
            else if (role === 'employer') {
                profileId = 'emp_' + crypto_1.default.randomBytes(8).toString('hex');
                const insertEmployer = database_1.db.prepare(`
          INSERT INTO employer_profiles (id, user_id, company_name, description, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);
                insertEmployer.run(profileId, userId, company_name || 'Tech Talent Employer', 'Registered employer looking for top verified student talent.', createdAt);
            }
            // Audit Log
            const auditId = 'aud_' + crypto_1.default.randomBytes(8).toString('hex');
            database_1.db.prepare(`
        INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, created_at)
        VALUES (?, ?, 'USER_REGISTERED', 'user', ?, ?, ?)
      `).run(auditId, userId, userId, JSON.stringify({ role, email }), createdAt);
        });
        transaction();
        const token = (0, auth_1.generateToken)({
            userId,
            email,
            role,
            profileId
        });
        return {
            token,
            user: {
                id: userId,
                email,
                role,
                profileId
            }
        };
    }
    static login(email, password) {
        const user = database_1.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            throw { status: 401, message: 'Invalid email or password' };
        }
        if (user.status !== 'active') {
            throw { status: 403, message: 'Account is suspended' };
        }
        const isValidPassword = bcryptjs_1.default.compareSync(password, user.password_hash);
        if (!isValidPassword) {
            throw { status: 401, message: 'Invalid email or password' };
        }
        let profileId = undefined;
        let profileData = null;
        if (user.role === 'student') {
            const student = database_1.db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
            profileId = student?.id;
            profileData = student;
        }
        else if (user.role === 'employer') {
            const employer = database_1.db.prepare('SELECT * FROM employer_profiles WHERE user_id = ?').get(user.id);
            profileId = employer?.id;
            profileData = employer;
        }
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
            profileId
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profileId,
                profile: profileData
            }
        };
    }
}
exports.AuthService = AuthService;
