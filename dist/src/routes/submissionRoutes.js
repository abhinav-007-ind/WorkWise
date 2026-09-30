"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const submissionService_1 = require("../services/submissionService");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Configure multer file storage
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});
// POST /submissions - Upload project work / link / file
router.post('/submissions', auth_1.authenticateToken, (0, auth_1.requireRole)('student'), upload.single('file'), (req, res, next) => {
    try {
        const studentId = req.user.profileId;
        const { title, type, description, github_url, visibility } = req.body;
        if (!title || !type || !description) {
            return res.status(400).json({ error: 'title, type, and description are required fields' });
        }
        const fileUrl = req.file ? req.file.path : req.body.file_url;
        const result = submissionService_1.SubmissionService.createSubmission({
            student_id: studentId,
            title,
            type,
            description,
            github_url,
            file_url: fileUrl,
            visibility
        });
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
});
// GET /submissions/:id - Get submission details and AI analysis
router.get('/submissions/:id', (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const submission = submissionService_1.SubmissionService.getSubmissionById(id);
        res.json(submission);
    }
    catch (err) {
        next(err);
    }
});
// POST /submissions/:id/analyze - Queue/trigger re-analysis
router.post('/submissions/:id/analyze', auth_1.authenticateToken, (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const result = submissionService_1.SubmissionService.triggerReanalysis(id);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
// POST /submissions/:id/review - Request manual review
router.post('/submissions/:id/review', auth_1.authenticateToken, (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { notes } = req.body;
        const result = submissionService_1.SubmissionService.submitManualReview(id, notes || 'Student requested human review of AI evaluation.');
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
