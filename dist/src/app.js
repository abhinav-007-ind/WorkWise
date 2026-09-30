"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const submissionRoutes_1 = __importDefault(require("./routes/submissionRoutes"));
const challengeRoutes_1 = __importDefault(require("./routes/challengeRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
const employerRoutes_1 = __importDefault(require("./routes/employerRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
// Initialize SQLite database schema and seed default taxonomy
(0, database_1.initDatabase)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Serve interactive backend web UI dashboard
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Mount API routes (supporting both /api/... and direct PDF endpoints)
app.use('/auth', authRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/', profileRoutes_1.default);
app.use('/api', profileRoutes_1.default);
app.use('/', submissionRoutes_1.default);
app.use('/api', submissionRoutes_1.default);
app.use('/api', challengeRoutes_1.default);
app.use('/api', leaderboardRoutes_1.default);
app.use('/', employerRoutes_1.default);
app.use('/api', employerRoutes_1.default);
app.use('/api', adminRoutes_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SkillBridge Backend API', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 SkillBridge Backend running at http://localhost:${PORT}`);
        console.log(`📊 Interactive Dashboard available at http://localhost:${PORT}`);
    });
}
exports.default = app;
