import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { SubmissionService } from '../services/submissionService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer file storage
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /submissions - Upload project work / link / file
router.post('/submissions', authenticateToken, requireRole('student'), upload.single('file'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.profileId!;
    const { title, type, description, github_url, visibility } = req.body;

    if (!title || !type || !description) {
      return res.status(400).json({ error: 'title, type, and description are required fields' });
    }

    const fileUrl = req.file ? req.file.path : req.body.file_url;

    const result = SubmissionService.createSubmission({
      student_id: studentId,
      title,
      type,
      description,
      github_url,
      file_url: fileUrl,
      visibility
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// GET /submissions/:id - Get submission details and AI analysis
router.get('/submissions/:id', (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const submission = SubmissionService.getSubmissionById(id);
    res.json(submission);
  } catch (err) {
    next(err);
  }
});

// POST /submissions/:id/analyze - Queue/trigger re-analysis
router.post('/submissions/:id/analyze', authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = SubmissionService.triggerReanalysis(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /submissions/:id/review - Request manual review
router.post('/submissions/:id/review', authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { notes } = req.body;
    const result = SubmissionService.submitManualReview(id, notes || 'Student requested human review of AI evaluation.');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
