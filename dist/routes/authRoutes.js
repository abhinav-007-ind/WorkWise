"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = require("../services/authService");
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => {
    try {
        const result = authService_1.AuthService.register(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
});
router.post('/login', (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = authService_1.AuthService.login(email, password);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
