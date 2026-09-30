export interface SkillEvidence {
  id: string;
  skillName: string;
  category: 'Frontend' | 'Backend & Systems' | 'UI/UX Design' | 'Engineering Practices' | 'Data & Research';
  points: number;
  maxPoints: number;
  level: 'Foundational' | 'Proficient' | 'Advanced' | 'Mastery';
  evidenceSummary: string;
  sourceProjectTitle: string;
  proofDetails: {
    astOrPatternEvidence: string;
    fileLocation: string;
    calculationFormula: {
      architecturalComplexity: number;
      bestPracticesAndTesting: number;
      problemSolvingDepth: number;
      documentationAndGit: number;
    };
  };
}

export interface Badge {
  id: string;
  name: string;
  tier: 'Diamond' | 'Gold' | 'Silver';
  category: string;
  description: string;
  unlockedAt: string;
  sourceProject: string;
  iconName: string;
}

export interface ProjectSubmission {
  id: string;
  title: string;
  workType: 'Source Code & Full-Stack' | 'UI/UX Design & Prototype' | 'Data Science & ML' | 'Research & Technical Report';
  format: 'ZIP / Repo' | 'Figma Design' | 'PDF Paper' | 'Interactive WebApp';
  uploadedAt: string;
  summary: string;
  repoOrDocUrl?: string;
  demoUrl?: string;
  filesAnalyzedCount: number;
  detectedSkills: SkillEvidence[];
  unlockedBadgeIds: string[];
  totalPoints: number;
  verificationHash: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  headline: string;
  institution: string;
  course: string;
  gradYear: string;
  location: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  totalSkillPoints: number;
  openToWork: boolean;
  projects: ProjectSubmission[];
  badges: Badge[];
  topSkills: { name: string; points: number; category: string }[];
}

export type ViewRole = 'student' | 'employer';
