"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const profileService_1 = require("../services/profileService");
const router = (0, express_1.Router)();
// GET /students/me - Get current authenticated student profile
router.get('/students/me', auth_1.authenticateToken, (0, auth_1.requireRole)('student'), (req, res, next) => {
    try {
        const studentId = req.user.profileId;
        if (!studentId) {
            return res.status(404).json({ error: 'Student profile not found for user' });
        }
        const profile = profileService_1.ProfileService.getStudentProfile(studentId);
        res.json(profile);
    }
    catch (err) {
        next(err);
    }
});
// PUT /students/me - Update profile details
router.put('/students/me', auth_1.authenticateToken, (0, auth_1.requireRole)('student'), (req, res, next) => {
    try {
        const studentId = req.user.profileId;
        const updated = profileService_1.ProfileService.updateStudentProfile(studentId, req.body);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
// GET /students/me/skills - Get detailed skill profile
router.get('/students/me/skills', auth_1.authenticateToken, (0, auth_1.requireRole)('student'), (req, res, next) => {
    try {
        const studentId = req.user.profileId;
        const profile = profileService_1.ProfileService.getStudentProfile(studentId);
        res.json(profile.skills);
    }
    catch (err) {
        next(err);
    }
});
// GET /students/me/badges - Get earned badges
router.get('/students/me/badges', auth_1.authenticateToken, (0, auth_1.requireRole)('student'), (req, res, next) => {
    try {
        const studentId = req.user.profileId;
        const profile = profileService_1.ProfileService.getStudentProfile(studentId);
        res.json(profile.badges);
    }
    catch (err) {
        next(err);
    }
});
// GET /portfolio/:username - Public shareable portfolio
router.get('/portfolio/:identifier', (req, res, next) => {
    try {
        const portfolio = profileService_1.ProfileService.getPublicPortfolio(req.params.identifier);
        res.json(portfolio);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
