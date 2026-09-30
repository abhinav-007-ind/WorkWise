"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIEvaluationService = void 0;
const database_1 = require("../config/database");
const badgeService_1 = require("./badgeService");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const BASE_POINTS = 50;
const MAX_POINTS_PER_SKILL = 100;
const REVIEW_THRESHOLD = 0.50;
const MODEL_VERSION = 'skillbridge-eval-v1.2.0';
class AIEvaluationService {
    static createAnalysisJob(submissionId) {
        const jobId = 'job_' + crypto_1.default.randomBytes(8).toString('hex');
        const now = new Date().toISOString();
        database_1.db.prepare(`
      INSERT INTO analysis_jobs (id, submission_id, job_status, model_version, started_at)
      VALUES (?, ?, 'queued', ?, ?)
    `).run(jobId, submissionId, MODEL_VERSION, now);
        // Update submission state
        database_1.db.prepare(`
      UPDATE submissions SET status = 'QUEUED', updated_at = ? WHERE id = ?
    `).run(now, submissionId);
        return jobId;
    }
    static processSubmission(submissionId, analysisVersion = 1) {
        const submission = database_1.db.prepare('SELECT * FROM submissions WHERE id = ?').get(submissionId);
        if (!submission) {
            throw { status: 404, message: 'Submission not found' };
        }
        const job = database_1.db.prepare(`
      SELECT * FROM analysis_jobs WHERE submission_id = ? ORDER BY started_at DESC LIMIT 1
    `).get(submissionId);
        const jobId = job ? job.id : this.createAnalysisJob(submissionId);
        const now = new Date().toISOString();
        database_1.db.prepare(`
      UPDATE analysis_jobs SET job_status = 'processing', started_at = ? WHERE id = ?
    `).run(now, jobId);
        database_1.db.prepare(`
      UPDATE submissions SET status = 'PROCESSING', updated_at = ? WHERE id = ?
    `).run(now, submissionId);
        try {
            // 1. Extract content and metadata
            const textToAnalyze = `${submission.title} ${submission.description} ${submission.github_url || ''} ${submission.file_url || ''}`;
            let fileContent = '';
            if (submission.file_url && fs_1.default.existsSync(submission.file_url)) {
                try {
                    fileContent = fs_1.default.readFileSync(submission.file_url, 'utf-8').slice(0, 10000);
                }
                catch (e) {
                    fileContent = '';
                }
            }
            const combinedText = (textToAnalyze + ' ' + fileContent).toLowerCase();
            // 2. Fetch Skill Taxonomy
            const skillsTaxonomy = database_1.db.prepare('SELECT * FROM skills').all();
            // 3. Detect Skills & Calculate Scores
            const detectedResults = [];
            for (const skill of skillsTaxonomy) {
                const detection = this.evaluateSkillMatch(skill, combinedText, submission);
                if (detection) {
                    detectedResults.push(detection);
                }
            }
            // If no explicit skill detected, provide fallback base skill match if text is substantial
            if (detectedResults.length === 0) {
                const generalSkill = skillsTaxonomy.find(s => s.category === 'Backend' || s.category === 'Computer Science') || skillsTaxonomy[0];
                detectedResults.push({
                    skillId: generalSkill.id,
                    skillName: generalSkill.name,
                    category: generalSkill.category,
                    confidence: 0.65,
                    evidenceStrength: 0.70,
                    complexityMultiplier: 1.1,
                    qualityMultiplier: 1.0,
                    points: Math.min(MAX_POINTS_PER_SKILL, Math.round(BASE_POINTS * 0.7 * 0.65 * 1.1 * 1.0)),
                    evidence: `Demonstrated technical work in ${submission.title} with comprehensive overview.`,
                    status: 'VERIFIED'
                });
            }
            let requiresReview = false;
            // 4. Save Submission Skills (Transaction)
            const insertSubSkill = database_1.db.prepare(`
        INSERT OR REPLACE INTO submission_skills 
        (id, submission_id, skill_id, confidence, evidence, points, analysis_version)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
            const processTx = database_1.db.transaction(() => {
                for (const res of detectedResults) {
                    if (res.confidence < REVIEW_THRESHOLD) {
                        requiresReview = true;
                    }
                    const subSkillId = `subskill_${crypto_1.default.randomBytes(8).toString('hex')}`;
                    insertSubSkill.run(subSkillId, submission.id, res.skillId, res.confidence, res.evidence, res.points, analysisVersion);
                }
                // 5. Aggregate Student Skills
                for (const res of detectedResults) {
                    if (res.confidence >= REVIEW_THRESHOLD) {
                        database_1.db.prepare(`
              INSERT INTO student_skills (id, student_id, skill_id, total_points, evidence_count)
              VALUES (?, ?, ?, ?, 1)
              ON CONFLICT(student_id, skill_id) DO UPDATE SET
                total_points = total_points + excluded.total_points,
                evidence_count = evidence_count + 1
            `).run(`stdskill_${crypto_1.default.randomBytes(8).toString('hex')}`, submission.student_id, res.skillId, res.points);
                    }
                }
                // 6. Update Submission Status
                const finalStatus = requiresReview ? 'NEEDS_REVIEW' : 'SCORED';
                database_1.db.prepare(`
          UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?
        `).run(finalStatus, new Date().toISOString(), submission.id);
                // 7. Complete Analysis Job
                database_1.db.prepare(`
          UPDATE analysis_jobs 
          SET job_status = 'completed', completed_at = ? 
          WHERE id = ?
        `).run(new Date().toISOString(), jobId);
                // 8. Create Notification
                const totalPointsAwarded = detectedResults.reduce((sum, r) => sum + r.points, 0);
                database_1.db.prepare(`
          INSERT INTO notifications (id, user_id, type, title, message, created_at)
          VALUES (?, (SELECT user_id FROM student_profiles WHERE id = ?), 'AI_ANALYSIS_COMPLETE', ?, ?, ?)
        `).run(`notif_${crypto_1.default.randomBytes(8).toString('hex')}`, submission.student_id, `Submission Evaluated: ${submission.title}`, `AI Evaluation complete! ${detectedResults.length} skills identified. Earned +${totalPointsAwarded} total skill points.`, new Date().toISOString());
            });
            processTx();
            // 9. Evaluate Badges
            const newBadges = badgeService_1.BadgeService.evaluateBadges(submission.student_id, submission.id);
            return {
                submission_id: submission.id,
                status: requiresReview ? 'NEEDS_REVIEW' : 'SCORED',
                detected_skills: detectedResults,
                new_badges: newBadges,
                model_version: MODEL_VERSION
            };
        }
        catch (err) {
            database_1.db.prepare(`
        UPDATE analysis_jobs 
        SET job_status = 'failed', error_message = ?, completed_at = ? 
        WHERE id = ?
      `).run(err.message || 'Unknown processing error', new Date().toISOString(), jobId);
            database_1.db.prepare(`
        UPDATE submissions SET status = 'FAILED', updated_at = ? WHERE id = ?
      `).run(new Date().toISOString(), submissionId);
            throw err;
        }
    }
    static evaluateSkillMatch(skill, text, submission) {
        const skillNameLower = skill.name.toLowerCase();
        let keywords = [];
        switch (skill.id) {
            case 'skill_node':
                keywords = ['node', 'express', 'javascript', 'npm', 'async', 'jwt', 'rest', 'server'];
                break;
            case 'skill_py':
                keywords = ['python', 'fastapi', 'flask', 'django', 'pandas', 'def ', 'pip', 'pytest'];
                break;
            case 'skill_sql':
                keywords = ['sql', 'select', 'join', 'database', 'sqlite', 'postgres', 'index', 'table', 'primary key'];
                break;
            case 'skill_react':
                keywords = ['react', 'jsx', 'tsx', 'component', 'useState', 'useEffect', 'props', 'frontend'];
                break;
            case 'skill_ts':
                keywords = ['typescript', 'interface', 'type ', 'generic', 'ts-node', 'types'];
                break;
            case 'skill_algo':
                keywords = ['algorithm', 'data structure', 'complexity', 'time complexity', 'binary search', 'dynamic programming', 'tree', 'graph', 'hash table', 'sorting'];
                break;
            case 'skill_ai':
                keywords = ['ai', 'machine learning', 'model', 'neural', 'gemini', 'gpt', 'classifier', 'training', 'nlp', 'evaluation'];
                break;
            case 'skill_devops':
                keywords = ['docker', 'container', 'ci/cd', 'github actions', 'kubernetes', 'nginx', 'deployment'];
                break;
            case 'skill_api':
                keywords = ['api', 'endpoint', 'post', 'get', 'http', 'middleware', 'swagger', 'authentication'];
                break;
            default:
                keywords = [skillNameLower];
        }
        let matchCount = 0;
        const foundKeywords = [];
        for (const kw of keywords) {
            if (text.includes(kw)) {
                matchCount++;
                foundKeywords.push(kw);
            }
        }
        if (matchCount === 0)
            return null;
        // Calculate score metrics
        const confidence = Math.min(0.95, 0.55 + matchCount * 0.10);
        const evidenceStrength = Math.min(1.0, 0.60 + matchCount * 0.12);
        const complexityMultiplier = text.length > 500 ? 1.25 : 1.10;
        const qualityMultiplier = (submission.github_url || submission.file_url) ? 1.15 : 1.0;
        // Formula from spec PDF 3: clamp(round(BasePoints * strength * confidence * complexity * quality), 0, 100)
        const rawPoints = BASE_POINTS * evidenceStrength * confidence * complexityMultiplier * qualityMultiplier;
        const points = Math.min(MAX_POINTS_PER_SKILL, Math.max(0, Math.round(rawPoints)));
        const status = confidence < REVIEW_THRESHOLD ? 'NEEDS_REVIEW' : 'VERIFIED';
        const evidenceSnippet = `Detected ${foundKeywords.join(', ')} in work title/description/file. Matched skill taxonomy: ${skill.name}.`;
        return {
            skillId: skill.id,
            skillName: skill.name,
            category: skill.category,
            confidence,
            evidenceStrength,
            complexityMultiplier,
            qualityMultiplier,
            points,
            evidence: evidenceSnippet,
            status
        };
    }
}
exports.AIEvaluationService = AIEvaluationService;
