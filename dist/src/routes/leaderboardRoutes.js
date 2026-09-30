"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboardService_1 = require("../services/leaderboardService");
const router = (0, express_1.Router)();
// GET /leaderboard - Global XP leaderboard
router.get('/leaderboard', (req, res, next) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const leaderboard = leaderboardService_1.LeaderboardService.getGlobalLeaderboard(limit);
        res.json(leaderboard);
    }
    catch (err) {
        next(err);
    }
});
// GET /leaderboard/skill/:skill - Skill-specific leaderboard
router.get('/leaderboard/skill/:skill', (req, res, next) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const skillParam = Array.isArray(req.params.skill) ? req.params.skill[0] : req.params.skill;
        const leaderboard = leaderboardService_1.LeaderboardService.getSkillLeaderboard(skillParam, limit);
        res.json(leaderboard);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
