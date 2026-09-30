"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const database_1 = require("../config/database");
const aiEvaluationService_1 = require("./aiEvaluationService");
const crypto_1 = __importDefault(require("crypto"));
class SubmissionService {
    static createSubmission(data) {
        const { student_id, title, type, description, github_url, file_url, visibility } = data;
        // Check student profile exists
        const student = database_1.db.prepare('SELECT id FROM student_profiles WHERE id = ?').get(student_id);
        if (!student) {
            throw { status: 404, message: 'Student profile not found' };
        }
        // Compute content hash to prevent exact duplicate submissions
        const contentToHash = `${title}:${description}:${github_url || ''}:${file_url || ''}`;
        const content_hash = crypto_1.default.createHash('sha256').update(contentToHash).digest('hex');
        const existing = database_1.db.prepare(`
      SELECT id FROM submissions WHERE student_id = ? AND content_hash = ?
    `).get(student_id, content_hash);
        if (existing) {
            throw { status: 400, message: 'A duplicate submission with identical content already exists.' };
        }
        const id = 'sub_' + crypto_1.default.randomBytes(8).toString('hex');
        const now = new Date().toISOString();
        database_1.db.prepare(`
      INSERT INTO submissions (id, student_id, title, type, description, file_url, github_url, content_hash, status, visibility, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPLOADED', ?, ?, ?)
    `).run(id, student_id, title, type, description, file_url || null, github_url || null, content_hash, visibility || 'public', now, now);
        // Audit Log
        database_1.db.prepare(`
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, (SELECT user_id FROM student_profiles WHERE id = ?), 'SUBMISSION_CREATED', 'submission', ?, ?, ?)
    `).run('aud_' + crypto_1.default.randomBytes(8).toString('hex'), student_id, id, JSON.stringify({ title, type }), now);
        // Create async analysis job & trigger processing
        aiEvaluationService_1.AIEvaluationService.createAnalysisJob(id);
        // Process evaluation synchronously/asynchronously
        const evalResult = aiEvaluationService_1.AIEvaluationService.processSubmission(id);
        return {
            submission: this.getSubmissionById(id),
            evaluation: evalResult
        };
    }
    static getSubmissionById(id) {
        const submission = database_1.db.prepare(`
      SELECT s.*, sp.name as student_name, sp.headline as student_headline
      FROM submissions s
      JOIN student_profiles sp ON s.student_id = sp.id
      WHERE s.id = ?
    `).get(id);
        if (!submission) {
            throw { status: 404, message: 'Submission not found' };
        }
        const detectedSkills = database_1.db.prepare(`
      SELECT ss.*, sk.name as skill_name, sk.category as skill_category
      FROM submission_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.submission_id = ?
      ORDER BY ss.points DESC
    `).all(id);
        const latestJob = database_1.db.prepare(`
      SELECT * FROM analysis_jobs WHERE submission_id = ? ORDER BY started_at DESC LIMIT 1
    `).get(id);
        return {
            ...submission,
            detected_skills: detectedSkills,
            latest_analysis_job: latestJob
        };
    }
    static getStudentSubmissions(studentId) {
        const submissions = database_1.db.prepare(`
      SELECT * FROM submissions WHERE student_id = ? ORDER BY created_at DESC
    `).all(studentId);
        return submissions.map(s => this.getSubmissionById(s.id));
    }
    static triggerReanalysis(id) {
        const submission = database_1.db.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
        if (!submission) {
            throw { status: 404, message: 'Submission not found' };
        }
        // Get current max analysis_version
        const currentVersionRow = database_1.db.prepare(`
      SELECT MAX(analysis_version) as max_v FROM submission_skills WHERE submission_id = ?
    `).get(id);
        const nextVersion = (currentVersionRow?.max_v || 1) + 1;
        aiEvaluationService_1.AIEvaluationService.createAnalysisJob(id);
        return aiEvaluationService_1.AIEvaluationService.processSubmission(id, nextVersion);
    }
    static submitManualReview(id, reviewerNotes) {
        const submission = database_1.db.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
        if (!submission) {
            throw { status: 404, message: 'Submission not found' };
        }
        const now = new Date().toISOString();
        database_1.db.prepare(`
      UPDATE submissions SET status = 'NEEDS_REVIEW', updated_at = ? WHERE id = ?
    `).run(now, id);
        database_1.db.prepare(`
      INSERT INTO audit_logs (id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, 'MANUAL_REVIEW_REQUESTED', 'submission', ?, ?, ?)
    `).run('aud_' + crypto_1.default.randomBytes(8).toString('hex'), id, JSON.stringify({ reviewerNotes }), now);
        return { message: 'Submission submitted for manual review successfully', submission_id: id };
    }
}
exports.SubmissionService = SubmissionService;
