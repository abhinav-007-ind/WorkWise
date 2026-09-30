import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import submissionRoutes from './routes/submissionRoutes';
import challengeRoutes from './routes/challengeRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import employerRoutes from './routes/employerRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

// Initialize SQLite database schema and seed default taxonomy
initDatabase();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve interactive backend web UI dashboard
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes (supporting both /api/... and direct PDF endpoints)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/', profileRoutes);
app.use('/api', profileRoutes);

app.use('/', submissionRoutes);
app.use('/api', submissionRoutes);

app.use('/api', challengeRoutes);
app.use('/api', leaderboardRoutes);
app.use('/', employerRoutes);
app.use('/api', employerRoutes);

app.use('/api', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkillBridge Backend API', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 SkillBridge Backend running at http://localhost:${PORT}`);
    console.log(`📊 Interactive Dashboard available at http://localhost:${PORT}`);
  });
}

export default app;
