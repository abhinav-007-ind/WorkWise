"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
process_1.default.env.NODE_ENV = 'test';
process_1.default.env.DB_PATH = ':memory:';
const app_1 = __importDefault(require("../src/app"));
const supertest_1 = __importDefault(require("supertest"));
async function runTests() {
    console.log('🧪 Starting SkillBridge Backend Integration Test Suite...\n');
    let studentToken = '';
    let studentProfileId = '';
    let submissionId = '';
    try {
        // 1. Register Student
        console.log('1. Registering student user...');
        const regRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            email: 'alex.rivera@test.com',
            password: 'Password123!',
            role: 'student',
            name: 'Alex Rivera',
            headline: 'Full Stack & Backend Developer',
            bio: 'CS Student specializing in Node.js & Python'
        });
        if (regRes.status !== 201)
            throw new Error(`Register failed: ${JSON.stringify(regRes.body)}`);
        studentToken = regRes.body.token;
        studentProfileId = regRes.body.user.profileId;
        console.log('✅ Student registered successfully. Token generated.\n');
        // 2. Login
        console.log('2. Authenticating via /auth/login...');
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: 'alex.rivera@test.com', password: 'Password123!' });
        if (loginRes.status !== 200)
            throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
        console.log('✅ Login authenticated.\n');
        // 3. Get Student Profile
        console.log('3. Fetching student profile via /students/me...');
        const profRes = await (0, supertest_1.default)(app_1.default)
            .get('/students/me')
            .set('Authorization', `Bearer ${studentToken}`);
        if (profRes.status !== 200 || profRes.body.name !== 'Alex Rivera') {
            throw new Error(`Profile fetch failed: ${JSON.stringify(profRes.body)}`);
        }
        console.log('✅ Student profile retrieved correctly.\n');
        // 4. Upload Work & AI Evaluation
        console.log('4. Uploading work & executing AI Evaluation Engine...');
        const subRes = await (0, supertest_1.default)(app_1.default)
            .post('/submissions')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
            title: 'Distributed API Rate Limiter in Node.js & TypeScript',
            type: 'project',
            description: 'Built a high performance sliding window rate limiter in Node.js, Express, TypeScript, and SQL database storage. Applied complexity optimization and async queuing.',
            github_url: 'https://github.com/alexrivera/node-rate-limiter'
        });
        if (subRes.status !== 201)
            throw new Error(`Submission failed: ${JSON.stringify(subRes.body)}`);
        submissionId = subRes.body.submission.id;
        console.log(`✅ Work uploaded (ID: ${submissionId}).`);
        console.log(`🤖 AI Skills Detected:`, subRes.body.evaluation.detected_skills.map((s) => `${s.skillName} (+${s.points} pts, conf ${(s.confidence * 100).toFixed(0)}%)`).join(', '));
        console.log('\n');
        // 5. Fetch Submission details
        console.log('5. Inspecting submission via /submissions/:id...');
        const detailRes = await (0, supertest_1.default)(app_1.default).get(`/submissions/${submissionId}`);
        if (detailRes.status !== 200 || detailRes.body.detected_skills.length === 0) {
            throw new Error(`Submission detail failed: ${JSON.stringify(detailRes.body)}`);
        }
        console.log('✅ Submission detail and AI analysis job verified.\n');
        // 6. Trigger Re-analysis
        console.log('6. Triggering AI Re-analysis version via /submissions/:id/analyze...');
        const reanalRes = await (0, supertest_1.default)(app_1.default)
            .post(`/submissions/${submissionId}/analyze`)
            .set('Authorization', `Bearer ${studentToken}`);
        if (reanalRes.status !== 200)
            throw new Error(`Re-analysis failed: ${JSON.stringify(reanalRes.body)}`);
        console.log('✅ AI Re-analysis completed.\n');
        // 7. Verify Skills & Badges
        console.log('7. Verifying updated student skills & badges...');
        const skillsRes = await (0, supertest_1.default)(app_1.default).get('/students/me/skills').set('Authorization', `Bearer ${studentToken}`);
        const badgesRes = await (0, supertest_1.default)(app_1.default).get('/students/me/badges').set('Authorization', `Bearer ${studentToken}`);
        console.log(`✅ Skills count: ${skillsRes.body.length}, Badges earned: ${badgesRes.body.length}\n`);
        // 8. Challenge Submission
        console.log('8. Submitting coding challenge solution via /api/challenges/:id/submit...');
        const chRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/challenges/ch_rate_limiter/submit')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
            title: 'Token Bucket Solution',
            description: 'Implements sliding window token bucket rate limiting in Node.js',
            code_or_link: 'function rateLimiter(req, res, next) { /* token bucket algorithm */ }'
        });
        if (chRes.status !== 201 || chRes.body.status !== 'passed') {
            throw new Error(`Challenge submission failed: ${JSON.stringify(chRes.body)}`);
        }
        console.log(`✅ Challenge passed! Awarded +${chRes.body.score_awarded} XP.\n`);
        // 9. Leaderboard
        console.log('9. Checking global leaderboard via /api/leaderboard...');
        const leadRes = await (0, supertest_1.default)(app_1.default).get('/api/leaderboard');
        if (leadRes.status !== 200 || leadRes.body.length === 0)
            throw new Error(`Leaderboard failed: ${JSON.stringify(leadRes.body)}`);
        console.log(`✅ Global Leaderboard rank #1: ${leadRes.body[0].name} (${leadRes.body[0].total_xp} Total XP)\n`);
        // 10. Employer Search
        console.log('10. Employer searching candidates via /employers/candidates?skill=Node.js...');
        const empRes = await (0, supertest_1.default)(app_1.default).get('/employers/candidates?skill=Node.js');
        if (empRes.status !== 200 || empRes.body.length === 0)
            throw new Error(`Employer search failed: ${JSON.stringify(empRes.body)}`);
        console.log(`✅ Candidates found: ${empRes.body.length} (Top candidate: ${empRes.body[0].name})\n`);
        // 11. Request Manual Review
        console.log('11. Requesting manual human review via /submissions/:id/review...');
        const revRes = await (0, supertest_1.default)(app_1.default)
            .post(`/submissions/${submissionId}/review`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ notes: 'Requesting review for full score eligibility' });
        if (revRes.status !== 200)
            throw new Error(`Manual review failed: ${JSON.stringify(revRes.body)}`);
        console.log('✅ Manual review submitted successfully.\n');
        console.log('🎉 ALL SKILLBRIDGE BACKEND E2E TESTS PASSED SUCCESSFULLY! 🚀');
        process_1.default.exit(0);
    }
    catch (err) {
        console.error('❌ Test failed:', err.message);
        process_1.default.exit(1);
    }
}
runTests();
