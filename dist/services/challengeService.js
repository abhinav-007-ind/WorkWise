"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeService = void 0;
const database_1 = require("../config/database");
const submissionService_1 = require("./submissionService");
const crypto_1 = __importDefault(require("crypto"));
class ChallengeService {
    static getChallenges() {
        return database_1.db.prepare('SELECT * FROM challenges ORDER BY created_at DESC').all();
    }
    static getChallengeById(id) {
        const challenge = database_1.db.prepare('SELECT * FROM challenges WHERE id = ?').get(id);
        if (!challenge) {
            throw { status: 404, message: 'Challenge not found' };
        }
        return challenge;
    }
    static submitChallengeSolution(studentId, challengeId, solutionData) {
        const challenge = this.getChallengeById(challengeId);
        // Create a submission of type 'challenge'
        const result = submissionService_1.SubmissionService.createSubmission({
            student_id: studentId,
            title: `[Challenge Solution] ${challenge.title}`,
            type: 'challenge',
            description: `${solutionData.description}\n\nSolution Details:\n${solutionData.code_or_link}`,
            github_url: solutionData.code_or_link.startsWith('http') ? solutionData.code_or_link : undefined
        });
        const submissionId = result.submission.id;
        const isPassed = result.evaluation.status === 'SCORED';
        const csId = 'chsub_' + crypto_1.default.randomBytes(8).toString('hex');
        const now = new Date().toISOString();
        const score = isPassed ? challenge.reward_xp : 0;
        const feedback = isPassed
            ? `Successfully completed "${challenge.title}"! Demonstrated required problem-solving capabilities. Earned +${score} XP.`
            : `Challenge submission received. Current score is pending manual code review.`;
        database_1.db.prepare(`
      INSERT INTO challenge_submissions (id, challenge_id, student_id, submission_id, status, score, feedback, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(csId, challengeId, studentId, submissionId, isPassed ? 'passed' : 'failed', score, feedback, now);
        return {
            challenge_submission_id: csId,
            challenge: challenge.title,
            status: isPassed ? 'passed' : 'failed',
            score_awarded: score,
            feedback,
            submission_details: result
        };
    }
}
exports.ChallengeService = ChallengeService;
