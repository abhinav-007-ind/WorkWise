import { db } from '../config/database';
import { Submission, SubmissionType } from '../models/types';
import { AIEvaluationService } from './aiEvaluationService';
import crypto from 'crypto';
import fs from 'fs';

export class SubmissionService {
  static createSubmission(data: {
    student_id: string;
    title: string;
    type: SubmissionType;
    description: string;
    github_url?: string;
    file_url?: string;
    visibility?: 'public' | 'private';
  }) {
    const { student_id, title, type, description, github_url, file_url, visibility } = data;

    // Check student profile exists
    const student = db.prepare('SELECT id FROM student_profiles WHERE id = ?').get(student_id);
    if (!student) {
      throw { status: 404, message: 'Student profile not found' };
    }

    // Compute content hash to prevent exact duplicate submissions
    const contentToHash = `${title}:${description}:${github_url || ''}:${file_url || ''}`;
    const content_hash = crypto.createHash('sha256').update(contentToHash).digest('hex');

    const existing = db.prepare(`
      SELECT id FROM submissions WHERE student_id = ? AND content_hash = ?
    `).get(student_id, content_hash) as any;

    if (existing) {
      throw { status: 400, message: 'A duplicate submission with identical content already exists.' };
    }

    const id = 'sub_' + crypto.randomBytes(8).toString('hex');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO submissions (id, student_id, title, type, description, file_url, github_url, content_hash, status, visibility, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPLOADED', ?, ?, ?)
    `).run(id, student_id, title, type, description, file_url || null, github_url || null, content_hash, visibility || 'public', now, now);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, (SELECT user_id FROM student_profiles WHERE id = ?), 'SUBMISSION_CREATED', 'submission', ?, ?, ?)
    `).run('aud_' + crypto.randomBytes(8).toString('hex'), student_id, id, JSON.stringify({ title, type }), now);

    // Create async analysis job & trigger processing
    AIEvaluationService.createAnalysisJob(id);

    // Process evaluation synchronously/asynchronously
    const evalResult = AIEvaluationService.processSubmission(id);

    return {
      submission: this.getSubmissionById(id),
      evaluation: evalResult
    };
  }

  static getSubmissionById(id: string) {
    const submission = db.prepare(`
      SELECT * FROM submissions WHERE id = ?
    `).get(id) as any;

    if (!submission) {
      throw { status: 404, message: 'Submission not found' };
    }

    const detectedSkills = db.prepare(`
      SELECT ss.*, sk.name as skill_name, sk.category as skill_category
      FROM submission_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.submission_id = ?
      ORDER BY ss.points DESC
    `).all(id);

    const latestJob = db.prepare(`
      SELECT * FROM analysis_jobs WHERE submission_id = ? ORDER BY started_at DESC LIMIT 1
    `).get(id);

    return {
      ...submission,
      detected_skills: detectedSkills,
      latest_analysis_job: latestJob
    };
  }

  static getStudentSubmissions(studentId: string) {
    const submissions = db.prepare(`
      SELECT * FROM submissions WHERE student_id = ? ORDER BY created_at DESC
    `).all(studentId) as Submission[];

    return submissions.map(s => this.getSubmissionById(s.id));
  }

  static triggerReanalysis(id: string) {
    const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(id) as Submission | undefined;
    if (!submission) {
      throw { status: 404, message: 'Submission not found' };
    }

    // Get current max analysis_version
    const currentVersionRow = db.prepare(`
      SELECT MAX(analysis_version) as max_v FROM submission_skills WHERE submission_id = ?
    `).get(id) as any;

    const nextVersion = (currentVersionRow?.max_v || 1) + 1;

    AIEvaluationService.createAnalysisJob(id);
    return AIEvaluationService.processSubmission(id, nextVersion);
  }

  static submitManualReview(id: string, reviewerNotes: string) {
    const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(id) as Submission | undefined;
    if (!submission) {
      throw { status: 404, message: 'Submission not found' };
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE submissions SET status = 'NEEDS_REVIEW', updated_at = ? WHERE id = ?
    `).run(now, id);

    db.prepare(`
      INSERT INTO audit_logs (id, action, entity_type, entity_id, metadata, created_at)
      VALUES (?, 'MANUAL_REVIEW_REQUESTED', 'submission', ?, ?, ?)
    `).run('aud_' + crypto.randomBytes(8).toString('hex'), id, JSON.stringify({ reviewerNotes }), now);

    return { message: 'Submission submitted for manual review successfully', submission_id: id };
  }
}
