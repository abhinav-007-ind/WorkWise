"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const process_1 = __importDefault(require("process"));
process_1.default.env.NODE_ENV = 'test';
process_1.default.env.DB_PATH = ':memory:';
const app_1 = __importDefault(require("../src/app"));
describe('SkillBridge Backend E2E Test Suite', () => {
    let studentToken;
    let studentProfileId;
    let submissionId;
    it('1. POST /auth/register - Should register a new student user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            email: 'johndoe@test.com',
            password: 'Password123!',
            role: 'student',
            name: 'John Doe',
            headline: 'Backend Developer',
            bio: 'Passionate about databases and Node.js'
        });
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.role).toBe('student');
        expect(res.body.user.profileId).toBeDefined();
        studentToken = res.body.token;
        studentProfileId = res.body.user.profileId;
    });
    it('2. POST /auth/login - Should authenticate student user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: 'johndoe@test.com',
            password: 'Password123!'
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    it('3. GET /students/me - Should return authenticated student profile', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/students/me')
            .set('Authorization', `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('John Doe');
        expect(res.body.skills).toBeDefined();
        expect(res.body.badges).toBeDefined();
    });
    it('4. POST /submissions - Should upload project work and trigger AI evaluation', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/submissions')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
            title: 'High Performance Rate Limiter in Node.js & TypeScript',
            type: 'project',
            description: 'Implemented token bucket algorithm using Node.js, Express, TypeScript, and SQL database storage. Calculated time complexity and concurrency safety.',
            github_url: 'https://github.com/johndoe/rate-limiter'
        });
        expect(res.status).toBe(201);
        expect(res.body.submission).toBeDefined();
        expect(res.body.submission.id).toBeDefined();
        expect(res.body.evaluation).toBeDefined();
        expect(res.body.evaluation.detected_skills.length).toBeGreaterThan(0);
        submissionId = res.body.submission.id;
    });
    it('5. GET /submissions/:id - Should fetch submission and AI analysis details', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/submissions/${submissionId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(submissionId);
        expect(res.body.detected_skills.length).toBeGreaterThan(0);
        expect(res.body.latest_analysis_job).toBeDefined();
    });
    it('6. POST /submissions/:id/analyze - Should trigger AI re-analysis version', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/submissions/${submissionId}/analyze`)
            .set('Authorization', `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(res.body.submission_id).toBe(submissionId);
        expect(res.body.status).toBeDefined();
    });
    it('7. GET /students/me/skills & /badges - Should reflect updated skill points and badges', async () => {
        const skillsRes = await (0, supertest_1.default)(app_1.default)
            .get('/students/me/skills')
            .set('Authorization', `Bearer ${studentToken}`);
        expect(skillsRes.status).toBe(200);
        expect(Array.isArray(skillsRes.body)).toBe(true);
        const badgesRes = await (0, supertest_1.default)(app_1.default)
            .get('/students/me/badges')
            .set('Authorization', `Bearer ${studentToken}`);
        expect(badgesRes.status).toBe(200);
        expect(Array.isArray(badgesRes.body)).toBe(true);
    });
    it('8. POST /api/challenges/:id/submit - Should evaluate challenge submission', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/challenges/ch_rate_limiter/submit')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
            title: 'My Token Bucket Solution',
            description: 'Implemented sliding window rate limiter logic in Node.js',
            code_or_link: 'function rateLimiter(req, res, next) { /* sliding window token bucket */ }'
        });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('passed');
        expect(res.body.score_awarded).toBeGreaterThan(0);
    });
    it('9. GET /api/leaderboard - Should return global XP rankings', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/leaderboard');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].total_xp).toBeGreaterThan(0);
    });
    it('10. GET /employers/candidates - Should return candidate matching skill filter', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/employers/candidates?skill=Node.js');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
    it('11. POST /submissions/:id/review - Should submit manual review request', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/submissions/${submissionId}/review`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ notes: 'Requesting review for full score eligibility' });
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('manual review');
    });
});
