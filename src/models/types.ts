export type UserRole = 'student' | 'employer' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  bio?: string;
  education?: string;
  headline?: string;
  visibility: 'public' | 'private';
  created_at: string;
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  description?: string;
  created_at: string;
}

export type SubmissionType = 'project' | 'assignment' | 'code' | 'design' | 'challenge';
export type SubmissionStatus = 
  | 'DRAFT' 
  | 'UPLOADED' 
  | 'VALIDATING' 
  | 'QUEUED' 
  | 'PROCESSING' 
  | 'ANALYZED' 
  | 'SCORED' 
  | 'PUBLISHED' 
  | 'REJECTED' 
  | 'FAILED' 
  | 'NEEDS_REVIEW';

export interface Submission {
  id: string;
  student_id: string;
  title: string;
  type: SubmissionType;
  description: string;
  file_url?: string;
  github_url?: string;
  content_hash?: string;
  status: SubmissionStatus;
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface SubmissionSkill {
  id: string;
  submission_id: string;
  skill_id: string;
  confidence: number;
  evidence: string;
  points: number;
  analysis_version: number;
  skill_name?: string;
  skill_category?: string;
}

export interface StudentSkill {
  id: string;
  student_id: string;
  skill_id: string;
  total_points: number;
  evidence_count: number;
  skill_name?: string;
  skill_category?: string;
}

export type BadgeRuleType = 'total_skill_points' | 'submission_count' | 'challenge_completion' | 'category_points';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rule_type: BadgeRuleType;
  threshold: number;
  skill_id?: string;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
  evidence_submission_id?: string;
  badge_name?: string;
  badge_description?: string;
  icon_url?: string;
}

export interface AnalysisJob {
  id: string;
  submission_id: string;
  job_status: 'queued' | 'processing' | 'completed' | 'failed';
  model_version: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward_xp: number;
  requirements: string;
  created_at: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  student_id: string;
  submission_id: string;
  status: 'passed' | 'failed' | 'evaluating';
  score: number;
  feedback: string;
  created_at: string;
  challenge_title?: string;
}

export interface SkillScoreResult {
  skillId: string;
  skillName: string;
  category: string;
  confidence: number;
  evidenceStrength: number;
  complexityMultiplier: number;
  qualityMultiplier: number;
  points: number;
  evidence: string;
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';
}
