"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const challengeService_1 = require("../services/challengeService");
const router = (0, express_1.Router)();
// GET /challenges - List all coding challenges
router.get('/challenges', (req, res, next) => {
    try {
        const challenges = challengeService_1.ChallengeService.getChallenges();
        res.json(challenges);
    }
    catch (err) {
        next(err);
    }
});
// GET /challenges/:id - Get challenge details
router.get('/challenges/:id', (req, res, next) => {
    try {
        const challenge = challengeService_1.ChallengeService.getChallengeById(req.params.id);
        res.json(challenge);
    }
    catch (err) {
        next(err);
    }
});
// POST /challenges/:id/submit - Submit solution for a challenge
router.post('/challenges/:id/submit', auth_1.authenticateToken, (0, auth_1.requireRole)('student'), (req, res, next) => {
    try {
        const studentId = req.user.profileId;
        const challengeId = req.params.id;
        const { title, description, code_or_link } = req.body;
        if (!title || !description || !code_or_link) {
            return res.status(400).json({ error: 'title, description, and code_or_link are required' });
        }
        const result = challengeService_1.ChallengeService.submitChallengeSolution(studentId, challengeId, {
            title,
            description,
            code_or_link
        });
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
