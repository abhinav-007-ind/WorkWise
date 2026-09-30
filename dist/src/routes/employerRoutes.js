"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employerService_1 = require("../services/employerService");
const router = (0, express_1.Router)();
// GET /employers/candidates?skill=...&minPoints=...&category=...
router.get('/employers/candidates', (req, res, next) => {
    try {
        const { skill, minPoints, category } = req.query;
        const candidates = employerService_1.EmployerService.searchCandidates({
            skill: skill,
            minPoints: minPoints ? Number(minPoints) : undefined,
            category: category
        });
        res.json(candidates);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
