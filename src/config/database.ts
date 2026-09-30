import fs from 'fs';
import path from 'path';

const dbFilePath = process.env.DB_PATH || path.join(__dirname, '../../skillbridge_store.json');

interface DatabaseStore {
  users: any[];
  student_profiles: any[];
  employer_profiles: any[];
  submissions: any[];
  skills: any[];
  submission_skills: any[];
  student_skills: any[];
  badges: any[];
  student_badges: any[];
  analysis_jobs: any[];
  notifications: any[];
  audit_logs: any[];
  challenges: any[];
  challenge_submissions: any[];
}

let store: DatabaseStore = {
  users: [],
  student_profiles: [],
  employer_profiles: [],
  submissions: [],
  skills: [],
  submission_skills: [],
  student_skills: [],
  badges: [],
  student_badges: [],
  analysis_jobs: [],
  notifications: [],
  audit_logs: [],
  challenges: [],
  challenge_submissions: []
};

function loadStore() {
  if (dbFilePath !== ':memory:' && fs.existsSync(dbFilePath)) {
    try {
      const data = fs.readFileSync(dbFilePath, 'utf-8');
      store = JSON.parse(data);
    } catch (e) {
      // default store
    }
  }
}

function saveStore() {
  if (dbFilePath !== ':memory:') {
    try {
      const dir = path.dirname(dbFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2));
    } catch (e) {
      console.error('Error writing store:', e);
    }
  }
}

loadStore();

export const db = {
  pragma: (str: string) => {},
  exec: (sql: string) => {},
  transaction: (fn: Function) => {
    return (...args: any[]) => {
      const result = fn(...args);
      saveStore();
      return result;
    };
  },
  prepare: (sql: string) => {
    const normalized = sql.replace(/\s+/g, ' ').trim();

    return {
      run: (...params: any[]) => {
        if (/^INSERT INTO users/i.test(normalized)) {
          const [id, email, password_hash, role, created_at] = params;
          store.users.push({ id, email, password_hash, role, status: 'active', created_at });
        } else if (/^INSERT INTO student_profiles/i.test(normalized)) {
          const [id, user_id, name, bio, education, headline, visibility, created_at] = params;
          store.student_profiles.push({ id, user_id, name, bio, education, headline, visibility, created_at });
        } else if (/^INSERT INTO employer_profiles/i.test(normalized)) {
          const [id, user_id, company_name, description, created_at] = params;
          store.employer_profiles.push({ id, user_id, company_name, description, created_at });
        } else if (/^INSERT INTO submissions/i.test(normalized)) {
          // params: (id, student_id, title, type, description, file_url, github_url, content_hash, visibility, created_at, updated_at)
          // status 'UPLOADED' is a SQL literal, not a param
          const [id, student_id, title, type, description, file_url, github_url, content_hash, visibility, created_at, updated_at] = params;
          store.submissions.push({ id, student_id, title, type, description, file_url: file_url || null, github_url: github_url || null, content_hash, status: 'UPLOADED', visibility: visibility || 'public', created_at, updated_at });
        } else if (/^INSERT OR IGNORE INTO skills/i.test(normalized)) {
          const [id, name, category, description] = params;
          if (!store.skills.find(s => s.id === id || s.name === name)) {
            store.skills.push({ id, name, category, description });
          }
        } else if (/^INSERT OR IGNORE INTO badges/i.test(normalized)) {
          const [id, name, description, icon_url, rule_type, threshold, skill_id] = params;
          if (!store.badges.find(b => b.id === id)) {
            store.badges.push({ id, name, description, icon_url, rule_type, threshold, skill_id });
          }
        } else if (/^INSERT OR IGNORE INTO challenges/i.test(normalized)) {
          const [id, title, description, category, difficulty, reward_xp, requirements] = params;
          if (!store.challenges.find(c => c.id === id)) {
            store.challenges.push({ id, title, description, category, difficulty, reward_xp, requirements });
          }
        } else if (/^INSERT INTO analysis_jobs/i.test(normalized)) {
          const [id, submission_id, model_version, started_at] = params;
          store.analysis_jobs.push({ id, submission_id, job_status: 'queued', model_version, started_at });
        } else if (/^UPDATE analysis_jobs/i.test(normalized)) {
          const jobId = params[params.length - 1];
          const job = store.analysis_jobs.find(j => j.id === jobId);
          if (job) {
            if (/job_status = 'processing'/i.test(normalized)) {
              job.job_status = 'processing';
              job.started_at = params[0];
            } else if (/job_status = 'completed'/i.test(normalized)) {
              job.job_status = 'completed';
              job.completed_at = params[0];
            } else if (/job_status = 'failed'/i.test(normalized)) {
              job.job_status = 'failed';
              job.error_message = params[0];
              job.completed_at = params[1];
            }
          }
        } else if (/^UPDATE submissions/i.test(normalized)) {
          const subId = params[params.length - 1];
          const sub = store.submissions.find(s => s.id === subId);
          if (sub) {
            // status may be a SQL literal (e.g. SET status = 'QUEUED', updated_at = ?)
            // or a parameter (e.g. SET status = ?, updated_at = ?)
            const literalMatch = normalized.match(/SET status = '([^']+)'/i);
            if (literalMatch) {
              // status is a SQL literal; params are (updated_at, id)
              sub.status = literalMatch[1];
              sub.updated_at = params[0];
            } else {
              // status is a param: (status, updated_at, id)
              sub.status = params[0];
              sub.updated_at = params[1];
            }
          }
        } else if (/^INSERT OR REPLACE INTO submission_skills/i.test(normalized)) {
          const [id, submission_id, skill_id, confidence, evidence, points, analysis_version] = params;
          const idx = store.submission_skills.findIndex(ss => ss.submission_id === submission_id && ss.skill_id === skill_id && ss.analysis_version === analysis_version);
          if (idx >= 0) {
            store.submission_skills[idx] = { id, submission_id, skill_id, confidence, evidence, points, analysis_version };
          } else {
            store.submission_skills.push({ id, submission_id, skill_id, confidence, evidence, points, analysis_version });
          }
        } else if (/^INSERT INTO student_skills/i.test(normalized)) {
          const [id, student_id, skill_id, total_points] = params;
          const existing = store.student_skills.find(ss => ss.student_id === student_id && ss.skill_id === skill_id);
          if (existing) {
            existing.total_points += total_points;
            existing.evidence_count += 1;
          } else {
            store.student_skills.push({ id, student_id, skill_id, total_points, evidence_count: 1 });
          }
        } else if (/^INSERT INTO notifications/i.test(normalized)) {
          const [id, studentId, title, message, created_at] = params;
          const student = store.student_profiles.find(sp => sp.id === studentId || sp.user_id === studentId);
          const user_id = student ? student.user_id : studentId;
          store.notifications.push({ id, user_id, type: 'INFO', title, message, created_at });
        } else if (/^INSERT INTO student_badges/i.test(normalized)) {
          const [id, student_id, badge_id, earned_at, evidence_submission_id] = params;
          store.student_badges.push({ id, student_id, badge_id, earned_at, evidence_submission_id });
        } else if (/^INSERT INTO audit_logs/i.test(normalized)) {
          const [id, actor_id, action, entity_type, entity_id, metadata, created_at] = params;
          store.audit_logs.push({ id, actor_id, action, entity_type, entity_id, metadata, created_at });
        } else if (/^INSERT INTO challenge_submissions/i.test(normalized)) {
          const [id, challenge_id, student_id, submission_id, status, score, feedback, created_at] = params;
          store.challenge_submissions.push({ id, challenge_id, student_id, submission_id, status, score, feedback, created_at });
        } else if (/^UPDATE student_profiles/i.test(normalized)) {
          const studentId = params[params.length - 1];
          const student = store.student_profiles.find(sp => sp.id === studentId);
          if (student) {
            if (normalized.includes('name = ?')) student.name = params[0];
            if (normalized.includes('bio = ?')) student.bio = params[normalized.includes('name = ?') ? 1 : 0];
          }
        } else if (/^UPDATE submission_skills/i.test(normalized)) {
          const [newPoints, reason, submissionId, skillId] = params;
          const item = store.submission_skills.find(ss => ss.submission_id === submissionId && ss.skill_id === skillId);
          if (item) {
            item.points = newPoints;
            item.evidence += ` [Admin Correction: ${reason}]`;
          }
        }

        saveStore();
        return { changes: 1 };
      },

      get: (...params: any[]) => {
        if (/FROM users WHERE email = \?/i.test(normalized)) {
          return store.users.find(u => u.email === params[0]);
        }
        if (/FROM student_profiles WHERE user_id = \?/i.test(normalized)) {
          return store.student_profiles.find(sp => sp.user_id === params[0]);
        }
        if (/FROM employer_profiles WHERE user_id = \?/i.test(normalized)) {
          return store.employer_profiles.find(ep => ep.user_id === params[0]);
        }
        if (/FROM student_profiles WHERE id = \? OR user_id = \?/i.test(normalized)) {
          return store.student_profiles.find(sp => sp.id === params[0] || sp.user_id === params[1] || sp.user_id === params[0]);
        }
        if (/FROM student_profiles WHERE id = \?/i.test(normalized)) {
          return store.student_profiles.find(sp => sp.id === params[0]);
        }
        if (/FROM submissions WHERE student_id = \? AND content_hash = \?/i.test(normalized)) {
          return store.submissions.find(s => s.student_id === params[0] && s.content_hash === params[1]);
        }
        if (/FROM submissions WHERE id = \?/i.test(normalized)) {
          const sub = store.submissions.find(s => s.id === params[0]);
          if (!sub) return undefined;
          const student = store.student_profiles.find(sp => sp.id === sub.student_id);
          return {
            ...sub,
            student_name: student ? student.name : 'Unknown',
            student_headline: student ? student.headline : ''
          };
        }
        if (/FROM analysis_jobs WHERE submission_id = \?/i.test(normalized)) {
          const jobs = store.analysis_jobs.filter(j => j.submission_id === params[0]);
          return jobs.length > 0 ? jobs[jobs.length - 1] : undefined;
        }
        if (/MAX\(analysis_version\) as max_v FROM submission_skills/i.test(normalized)) {
          const items = store.submission_skills.filter(ss => ss.submission_id === params[0]);
          if (items.length === 0) return { max_v: 1 };
          const max = Math.max(...items.map(i => i.analysis_version));
          return { max_v: max };
        }
        if (/SELECT total_points FROM student_skills WHERE student_id = \? AND skill_id = \?/i.test(normalized)) {
          const item = store.student_skills.find(ss => ss.student_id === params[0] && ss.skill_id === params[1]);
          return item ? { total_points: item.total_points } : null;
        }
        if (/SELECT COUNT\(\*\) as count FROM submissions WHERE student_id = \?/i.test(normalized)) {
          const count = store.submissions.filter(s => s.student_id === params[0] && ['SCORED', 'PUBLISHED', 'ANALYZED'].includes(s.status)).length;
          return { count };
        }
        if (/SELECT SUM\(total_points\) as total FROM student_skills WHERE student_id = \?/i.test(normalized)) {
          const total = store.student_skills.filter(ss => ss.student_id === params[0]).reduce((a, b) => a + b.total_points, 0);
          return { total };
        }
        if (/SELECT COUNT\(\*\) as count FROM challenge_submissions WHERE student_id = \?/i.test(normalized)) {
          const count = store.challenge_submissions.filter(cs => cs.student_id === params[0] && cs.status === 'passed').length;
          return { count };
        }
        if (/SELECT id FROM student_badges WHERE student_id = \? AND badge_id = \?/i.test(normalized)) {
          return store.student_badges.find(sb => sb.student_id === params[0] && sb.badge_id === params[1]);
        }
        if (/FROM challenges WHERE id = \?/i.test(normalized)) {
          return store.challenges.find(c => c.id === params[0]);
        }

        return undefined;
      },

      all: (...params: any[]) => {
        if (/FROM skills/i.test(normalized)) {
          return store.skills;
        }
        if (/FROM badges/i.test(normalized)) {
          return store.badges;
        }
        if (/FROM challenges/i.test(normalized)) {
          return store.challenges;
        }
        if (/FROM student_skills ss/i.test(normalized)) {
          const studentId = params[0];
          return store.student_skills
            .filter(ss => ss.student_id === studentId)
            .map(ss => {
              const skill = store.skills.find(s => s.id === ss.skill_id);
              return {
                ...ss,
                skill_name: skill ? skill.name : ss.skill_id,
                skill_category: skill ? skill.category : 'General',
                skill_description: skill ? skill.description : ''
              };
            });
        }
        if (/FROM student_badges sb/i.test(normalized)) {
          const studentId = params[0];
          return store.student_badges
            .filter(sb => sb.student_id === studentId)
            .map(sb => {
              const badge = store.badges.find(b => b.id === sb.badge_id);
              return {
                ...sb,
                badge_name: badge ? badge.name : sb.badge_id,
                badge_description: badge ? badge.description : '',
                icon_url: badge ? badge.icon_url : '🏆',
                rule_type: badge ? badge.rule_type : ''
              };
            });
        }
        if (/FROM submissions WHERE student_id = \?/i.test(normalized)) {
          return store.submissions.filter(s => s.student_id === params[0]);
        }
        if (/FROM submission_skills ss/i.test(normalized)) {
          const subId = params[0];
          return store.submission_skills
            .filter(ss => ss.submission_id === subId)
            .map(ss => {
              const skill = store.skills.find(s => s.id === ss.skill_id);
              return {
                ...ss,
                skill_name: skill ? skill.name : ss.skill_id,
                skill_category: skill ? skill.category : 'General'
              };
            });
        }
        if (/FROM student_profiles sp LEFT JOIN student_skills/i.test(normalized)) {
          return store.student_profiles.map(sp => {
            const total_xp = store.student_skills.filter(ss => ss.student_id === sp.id).reduce((a, b) => a + b.total_points, 0);
            const verified_submissions_count = store.submissions.filter(s => s.student_id === sp.id && ['SCORED', 'PUBLISHED', 'ANALYZED'].includes(s.status)).length;
            const badges_count = store.student_badges.filter(sb => sb.student_id === sp.id).length;
            return {
              student_id: sp.id,
              name: sp.name,
              headline: sp.headline,
              education: sp.education,
              total_xp,
              verified_submissions_count,
              badges_count
            };
          }).sort((a, b) => b.total_xp - a.total_xp);
        }
        if (/FROM student_skills ss JOIN student_profiles sp/i.test(normalized)) {
          const skillSearch = params[0].toLowerCase();
          const targetSkill = store.skills.find(s => s.id === skillSearch || s.name.toLowerCase() === skillSearch);
          if (!targetSkill) return [];

          return store.student_skills
            .filter(ss => ss.skill_id === targetSkill.id)
            .map(ss => {
              const student = store.student_profiles.find(sp => sp.id === ss.student_id);
              return {
                student_id: ss.student_id,
                name: student ? student.name : 'Student',
                headline: student ? student.headline : '',
                skill_name: targetSkill.name,
                skill_category: targetSkill.category,
                skill_points: ss.total_points,
                evidence_count: ss.evidence_count
              };
            }).sort((a, b) => b.skill_points - a.skill_points);
        }
        if (/FROM student_profiles sp JOIN student_skills ss/i.test(normalized)) {
          const minPoints = params[0] || 0;
          const skillSearch = params[1] ? params[1].toLowerCase() : null;

          const results: any[] = [];
          for (const ss of store.student_skills) {
            if (ss.total_points < minPoints) continue;
            const skill = store.skills.find(s => s.id === ss.skill_id);
            if (skillSearch && skill && !skill.name.toLowerCase().includes(skillSearch.replace(/%/g, '')) && !skill.id.toLowerCase().includes(skillSearch.replace(/%/g, ''))) {
              continue;
            }
            const student = store.student_profiles.find(sp => sp.id === ss.student_id);
            if (!student) continue;

            const badgesCount = store.student_badges.filter(sb => sb.student_id === student.id).length;

            results.push({
              student_id: student.id,
              name: student.name,
              headline: student.headline,
              bio: student.bio,
              education: student.education,
              matched_skill: skill ? skill.name : ss.skill_id,
              matched_category: skill ? skill.category : 'General',
              skill_points: ss.total_points,
              evidence_count: ss.evidence_count,
              badges_count: badgesCount
            });
          }
          return results.sort((a, b) => b.skill_points - a.skill_points);
        }
        if (/FROM audit_logs/i.test(normalized)) {
          return store.audit_logs;
        }

        return [];
      }
    };
  }
};

export function initDatabase() {
  seedDefaultData();
}

function seedDefaultData() {
  const initialSkills = [
    { id: 'skill_node', name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript runtime for building scalable network applications.' },
    { id: 'skill_py', name: 'Python', category: 'Backend', description: 'High-level programming language for web, data analysis, and AI.' },
    { id: 'skill_sql', name: 'SQL & Database Design', category: 'Backend', description: 'Relational database querying, schema design, and query optimization.' },
    { id: 'skill_react', name: 'React.js', category: 'Frontend', description: 'Modern component-based UI web framework.' },
    { id: 'skill_ts', name: 'TypeScript', category: 'Frontend', description: 'Strongly typed programming language that builds on JavaScript.' },
    { id: 'skill_algo', name: 'Data Structures & Algorithms', category: 'Computer Science', description: 'Algorithmic efficiency, time/space complexity optimization, and problem solving.' },
    { id: 'skill_ai', name: 'Machine Learning & AI', category: 'AI/ML', description: 'Building and evaluating AI models, NLP, and feature extraction.' },
    { id: 'skill_devops', name: 'Docker & DevOps', category: 'DevOps', description: 'Containerization, CI/CD pipelines, and cloud architecture.' },
    { id: 'skill_api', name: 'REST API Architecture', category: 'Backend', description: 'Designing clean, secure, and robust HTTP APIs.' }
  ];

  for (const s of initialSkills) {
    db.prepare('INSERT OR IGNORE INTO skills (id, name, category, description) VALUES (?, ?, ?, ?)').run(s.id, s.name, s.category, s.description);
  }

  const initialBadges = [
    { id: 'badge_py_master', name: 'Python Pathfinder', description: 'Earned 100+ skill points in Python.', icon_url: '🐍', rule_type: 'total_skill_points', threshold: 100, skill_id: 'skill_py' },
    { id: 'badge_sql_wizard', name: 'Database Architect', description: 'Earned 100+ skill points in SQL & Database Design.', icon_url: '🗄️', rule_type: 'total_skill_points', threshold: 100, skill_id: 'skill_sql' },
    { id: 'badge_fullstack', name: 'Full-Stack Catalyst', description: 'Upload 3 verified projects across frontend and backend.', icon_url: '⚡', rule_type: 'submission_count', threshold: 3, skill_id: null },
    { id: 'badge_algo_ace', name: 'Algorithm Ace', description: 'Complete a Medium or Hard coding challenge.', icon_url: '🏆', rule_type: 'challenge_completion', threshold: 1, skill_id: 'skill_algo' },
    { id: 'badge_point_500', name: 'Century Scholar', description: 'Reach 500 total XP points across all skill categories.', icon_url: '🌟', rule_type: 'category_points', threshold: 500, skill_id: null }
  ];

  for (const b of initialBadges) {
    db.prepare('INSERT OR IGNORE INTO badges (id, name, description, icon_url, rule_type, threshold, skill_id) VALUES (?, ?, ?, ?, ?, ?, ?)').run(b.id, b.name, b.description, b.icon_url, b.rule_type, b.threshold, b.skill_id);
  }

  const initialChallenges = [
    {
      id: 'ch_rate_limiter',
      title: 'Build an API Token Bucket Rate Limiter',
      description: 'Implement a thread-safe or async sliding window / token bucket rate limiter in Node.js or Python to handle 10,000 req/min.',
      category: 'Backend',
      difficulty: 'Medium',
      reward_xp: 150,
      requirements: 'Must contain code implementation, concurrency control, sliding window/token bucket logic, and error response handling.'
    },
    {
      id: 'ch_sql_optimize',
      title: 'High-Scale SQL Query & Indexing Optimization',
      description: 'Optimize a slow 10-million row e-commerce order query by designing composite indexes, CTEs, and query restructuring.',
      category: 'Backend',
      difficulty: 'Hard',
      reward_xp: 250,
      requirements: 'Include EXPLAIN ANALYZE evidence, schema indexing strategy, and benchmark results.'
    },
    {
      id: 'ch_react_state',
      title: 'Real-Time Dynamic Data Dashboard',
      description: 'Build a responsive React application visualizing live metrics streaming with dark mode glassmorphism theme.',
      category: 'Frontend',
      difficulty: 'Easy',
      reward_xp: 100,
      requirements: 'Clean component decomposition, state management, and CSS design system.'
    }
  ];

  for (const c of initialChallenges) {
    db.prepare('INSERT OR IGNORE INTO challenges (id, title, description, category, difficulty, reward_xp, requirements) VALUES (?, ?, ?, ?, ?, ?, ?)').run(c.id, c.title, c.description, c.category, c.difficulty, c.reward_xp, c.requirements);
  }
}
