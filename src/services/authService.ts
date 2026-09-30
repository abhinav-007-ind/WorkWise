import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { generateToken } from '../middleware/auth';
import { User, StudentProfile, EmployerProfile, UserRole } from '../models/types';
import crypto from 'crypto';

export class AuthService {
  static register(data: {
    email: string;
    password: string;
    role: UserRole;
    name?: string;
    company_name?: string;
    bio?: string;
    education?: string;
    headline?: string;
  }) {
    const { email, password, role, name, company_name, bio, education, headline } = data;

    // Check existing email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      throw { status: 400, message: 'Email address already registered' };
    }

    const userId = 'usr_' + crypto.randomBytes(8).toString('hex');
    const passwordHash = bcrypt.hashSync(password, 10);
    const createdAt = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, role, status, created_at)
      VALUES (?, ?, ?, ?, 'active', ?)
    `);

    let profileId = '';

    const transaction = db.transaction(() => {
      insertUser.run(userId, email, passwordHash, role, createdAt);

      if (role === 'student') {
        profileId = 'std_' + crypto.randomBytes(8).toString('hex');
        const insertStudent = db.prepare(`
          INSERT INTO student_profiles (id, user_id, name, bio, education, headline, visibility, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'public', ?)
        `);
        insertStudent.run(profileId, userId, name || email.split('@')[0], bio || '', education || '', headline || 'Aspiring Tech Professional', createdAt);
      } else if (role === 'employer') {
        profileId = 'emp_' + crypto.randomBytes(8).toString('hex');
        const insertEmployer = db.prepare(`
          INSERT INTO employer_profiles (id, user_id, company_name, description, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);
        insertEmployer.run(profileId, userId, company_name || 'Tech Talent Employer', 'Registered employer looking for top verified student talent.', createdAt);
      }

      // Audit Log
      const auditId = 'aud_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, created_at)
        VALUES (?, ?, 'USER_REGISTERED', 'user', ?, ?, ?)
      `).run(auditId, userId, userId, JSON.stringify({ role, email }), createdAt);
    });

    transaction();

    const token = generateToken({
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

  static login(email: string, password: string) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    if (user.status !== 'active') {
      throw { status: 403, message: 'Account is suspended' };
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    let profileId: string | undefined = undefined;
    let profileData: any = null;

    if (user.role === 'student') {
      const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id) as StudentProfile | undefined;
      profileId = student?.id;
      profileData = student;
    } else if (user.role === 'employer') {
      const employer = db.prepare('SELECT * FROM employer_profiles WHERE user_id = ?').get(user.id) as EmployerProfile | undefined;
      profileId = employer?.id;
      profileData = employer;
    }

    const token = generateToken({
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
