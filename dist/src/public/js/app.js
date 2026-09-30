document.addEventListener('DOMContentLoaded', () => {
  let token = localStorage.getItem('skillbridge_token') || null;
  let currentUser = JSON.parse(localStorage.getItem('skillbridge_user') || 'null');
  let currentAuthTab = 'login';

  // UI Elements
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const tabTitle = document.getElementById('tabTitle');
  const tabSubtitle = document.getElementById('tabSubtitle');
  const authModalBtn = document.getElementById('authModalBtn');
  const authModal = document.getElementById('authModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const authForm = document.getElementById('authForm');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const registerFields = document.getElementById('registerFields');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userRoleDisplay = document.getElementById('userRoleDisplay');
  const userAvatar = document.getElementById('userAvatar');
  const seedDemoBtn = document.getElementById('seedDemoBtn');

  // Navigation Tabs Logic
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;

      navItems.forEach(n => n.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');

      updateHeaderTitles(tab);
      loadTabContent(tab);
    });
  });

  function updateHeaderTitles(tab) {
    const titles = {
      dashboard: { title: 'Overview & Digital Skill Profile', sub: 'Real-time skill point calculation, evidence verification, and digital badge tracking' },
      upload: { title: 'Upload Project / Work Evidence', sub: 'AI will validate, parse evidence, calculate skill scores, and award badges' },
      'ai-eval': { title: 'AI Evaluation Engine & Formula Inspector', sub: 'Inspect confidence bounds, evidence snippets, complexity multipliers, and state machine' },
      challenges: { title: 'Interactive Challenges & Solution Verification', sub: 'Solve coding and architecture challenges to earn verified skill points' },
      leaderboard: { title: 'SkillBridge Global & Category Leaderboards', sub: 'Rankings powered by verified evidence points and badge counts' },
      employer: { title: 'Employer Candidate Discovery & Filtering', sub: 'Search verified student profiles by skill points and proven project evidence' },
      'api-tester': { title: 'REST API Specification Explorer', sub: 'Verify endpoint sketch implementations matching SkillBridge Database Schema' }
    };
    if (titles[tab]) {
      tabTitle.textContent = titles[tab].title;
      tabSubtitle.textContent = titles[tab].sub;
    }
  }

  // Auth Modal toggling
  authModalBtn.addEventListener('click', () => {
    if (currentUser) {
      // Logout
      localStorage.removeItem('skillbridge_token');
      localStorage.removeItem('skillbridge_user');
      token = null;
      currentUser = null;
      updateUserUI();
      loadTabContent('dashboard');
    } else {
      authModal.classList.add('open');
    }
  });

  closeAuthModal.addEventListener('click', () => authModal.classList.remove('open'));

  tabLoginBtn.addEventListener('click', () => setAuthMode('login'));
  tabRegisterBtn.addEventListener('click', () => setAuthMode('register'));

  function setAuthMode(mode) {
    currentAuthTab = mode;
    if (mode === 'login') {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      registerFields.classList.add('hidden');
      authSubmitBtn.textContent = 'Login to SkillBridge';
    } else {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      registerFields.classList.remove('hidden');
      authSubmitBtn.textContent = 'Create SkillBridge Account';
    }
  }

  // Auth Submit
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
      let endpoint = currentAuthTab === 'login' ? '/auth/login' : '/auth/register';
      let payload = { email, password };

      if (currentAuthTab === 'register') {
        payload.role = document.getElementById('authRole').value;
        payload.name = document.getElementById('authName').value || email.split('@')[0];
        payload.headline = document.getElementById('authHeadline').value || 'Student Developer';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      token = data.token;
      currentUser = data.user;

      localStorage.setItem('skillbridge_token', token);
      localStorage.setItem('skillbridge_user', JSON.stringify(currentUser));

      authModal.classList.remove('open');
      updateUserUI();
      loadTabContent('dashboard');
      alert(`Welcome, ${currentUser.profile?.name || currentUser.email}!`);
    } catch (err) {
      alert(err.message);
    }
  });

  function updateUserUI() {
    if (currentUser) {
      userNameDisplay.textContent = currentUser.profile?.name || currentUser.email.split('@')[0];
      userRoleDisplay.textContent = `${currentUser.role.toUpperCase()} • ${currentUser.profileId ? currentUser.profileId.slice(0, 8) : ''}`;
      userAvatar.textContent = (currentUser.profile?.name || currentUser.email)[0].toUpperCase();
      authModalBtn.textContent = 'Logout';
    } else {
      userNameDisplay.textContent = 'Not Authenticated';
      userRoleDisplay.textContent = 'Click to Register / Login';
      userAvatar.textContent = 'G';
      authModalBtn.textContent = 'Login / Register';
    }
  }

  // Seed Demo Data
  seedDemoBtn.addEventListener('click', async () => {
    try {
      seedDemoBtn.disabled = true;
      seedDemoBtn.textContent = '🌱 Seeding Demo Users & Submissions...';

      // 1. Register student Alex
      const alexRes = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `alex_${Date.now()}@student.edu`,
          password: 'Password123!',
          role: 'student',
          name: 'Alex Rivera',
          headline: 'Full-Stack Developer & Cloud Architect',
          bio: 'CS Student passionate about Node.js microservices and AI skill engines.'
        })
      });
      const alexData = await alexRes.json();
      token = alexData.token;
      currentUser = alexData.user;
      localStorage.setItem('skillbridge_token', token);
      localStorage.setItem('skillbridge_user', JSON.stringify(currentUser));

      // 2. Upload Sample Node.js Work
      await fetch('/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Distributed API Rate Limiter in Node.js & TypeScript',
          type: 'project',
          description: 'Built a high-performance token bucket rate limiting middleware in Node.js, Express, and TypeScript. Implemented async sliding window memory caching, SQL database logging, and unit tests using Jest.',
          github_url: 'https://github.com/alexrivera/node-rate-limiter'
        })
      });

      // 3. Upload Sample Python AI Work
      await fetch('/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Automated Feature Extraction Model in Python',
          type: 'code',
          description: 'Developed a Python data processing pipeline with Pandas, NumPy, and Scikit-Learn. Extracted feature metrics and trained a model for text classification.',
          github_url: 'https://github.com/alexrivera/python-feature-extraction'
        })
      });

      updateUserUI();
      loadTabContent('dashboard');
      alert('Success! Seeded sample student (Alex Rivera), 2 verified submissions, detected skills, and badges!');
    } catch (err) {
      alert('Seeding error: ' + err.message);
    } finally {
      seedDemoBtn.disabled = false;
      seedDemoBtn.textContent = '🌱 Seed Demo Data';
    }
  });

  // Load Tab Content Routing
  async function loadTabContent(tab) {
    if (tab === 'dashboard') {
      await loadDashboardData();
    } else if (tab === 'challenges') {
      await loadChallenges();
    } else if (tab === 'leaderboard') {
      await loadLeaderboard();
    } else if (tab === 'employer') {
      await searchCandidates();
    }
  }

  async function loadDashboardData() {
    if (!token || !currentUser || currentUser.role !== 'student') {
      document.getElementById('skillsListContainer').innerHTML = `<div class="empty-state">Please login as a Student to view your skill profile and submissions.</div>`;
      document.getElementById('badgesGridContainer').innerHTML = `<div class="empty-state">Please login as a Student to view earned badges.</div>`;
      document.getElementById('recentSubmissionsBody').innerHTML = `<tr><td colspan="6" class="text-center">Please login as a Student</td></tr>`;
      return;
    }

    try {
      const res = await fetch('/students/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      document.getElementById('totalXpDisplay').textContent = `${data.total_xp} XP`;
      document.getElementById('badgesCountDisplay').textContent = `${data.badges ? data.badges.length : 0} Badges`;
      document.getElementById('submissionsCountDisplay').textContent = `${data.submissions_count} Submissions`;

      // Render Skills
      const skillsContainer = document.getElementById('skillsListContainer');
      if (data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = data.skills.map(s => `
          <div class="skill-row">
            <div class="skill-info">
              <span class="skill-name">${s.skill_name}</span>
              <span class="skill-cat">${s.skill_category} • ${s.evidence_count} evidence items</span>
            </div>
            <span class="skill-points">+${s.total_points} PTS</span>
          </div>
        `).join('');
      } else {
        skillsContainer.innerHTML = `<div class="empty-state">No skills evaluated yet. Upload a project to start!</div>`;
      }

      // Render Badges
      const badgesContainer = document.getElementById('badgesGridContainer');
      if (data.badges && data.badges.length > 0) {
        badgesContainer.innerHTML = data.badges.map(b => `
          <div class="badge-card">
            <div class="badge-icon-large">${b.icon_url || '🏆'}</div>
            <div class="badge-name">${b.badge_name}</div>
            <div class="badge-desc">${b.badge_description}</div>
          </div>
        `).join('');
      } else {
        badgesContainer.innerHTML = `<div class="empty-state">No badges earned yet. Reach 100+ skill points to unlock!</div>`;
      }

      // Render Submissions Table
      const subsBody = document.getElementById('recentSubmissionsBody');
      if (data.submissions && data.submissions.length > 0) {
        subsBody.innerHTML = data.submissions.map(sub => `
          <tr>
            <td><strong>${sub.title}</strong></td>
            <td><span class="badge-tag">${sub.type}</span></td>
            <td><span class="status-tag status-${sub.status}">${sub.status}</span></td>
            <td>${sub.detected_skills ? sub.detected_skills.map(sk => sk.skill_name).join(', ') : 'In Queue'}</td>
            <td><strong>+${sub.detected_skills ? sub.detected_skills.reduce((a, b) => a + b.points, 0) : 0}</strong></td>
            <td>
              <button class="btn btn-sm btn-outline view-eval-btn" data-id="${sub.id}">Inspect AI</button>
            </td>
          </tr>
        `).join('');

        document.querySelectorAll('.view-eval-btn').forEach(b => {
          b.addEventListener('click', () => {
            inspectSubmissionEval(b.dataset.id);
            document.querySelector('[data-tab="ai-eval"]').click();
          });
        });
      } else {
        subsBody.innerHTML = `<tr><td colspan="6" class="text-center">No submissions yet</td></tr>`;
      }

    } catch (err) {
      console.error(err);
    }
  }

  // Work Upload Form Handler
  const workUploadForm = document.getElementById('workUploadForm');
  workUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token || !currentUser) {
      alert('Please login or seed demo data first');
      return;
    }

    try {
      const title = document.getElementById('uploadTitle').value;
      const type = document.getElementById('uploadType').value;
      const visibility = document.getElementById('uploadVisibility').value;
      const github_url = document.getElementById('uploadGithubUrl').value;
      const description = document.getElementById('uploadDescription').value;
      const fileInput = document.getElementById('uploadFile');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('visibility', visibility);
      formData.append('github_url', github_url);
      formData.append('description', description);
      if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
      }

      const res = await fetch('/submissions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`Submission uploaded! AI Evaluation status: ${data.evaluation.status}. Skills detected: ${data.evaluation.detected_skills.length}`);
      workUploadForm.reset();
      document.querySelector('[data-tab="dashboard"]').click();
    } catch (err) {
      alert('Upload error: ' + err.message);
    }
  });

  // Inspect Submission Evaluation
  async function inspectSubmissionEval(submissionId) {
    const container = document.getElementById('latestEvalContainer');
    try {
      const res = await fetch(`/submissions/${submissionId}`);
      const sub = await res.json();
      if (!res.ok) throw new Error(sub.error);

      container.innerHTML = `
        <div class="eval-detail-card mt-4">
          <div class="flex-between">
            <h4>${sub.title}</h4>
            <span class="status-tag status-${sub.status}">${sub.status}</span>
          </div>
          <p class="text-muted mt-2">${sub.description}</p>
          <div class="meta-row flex gap-4 mt-2">
            <span><strong>Model Version:</strong> ${sub.latest_analysis_job?.model_version || 'v1.2.0'}</span>
            <span><strong>Content Hash:</strong> <code>${sub.content_hash ? sub.content_hash.slice(0, 16) : 'N/A'}...</code></span>
          </div>

          <h4 class="mt-4">Detected Skills & Score Formula Trace</h4>
          <div class="skills-eval-grid mt-2">
            ${sub.detected_skills && sub.detected_skills.length > 0 ? sub.detected_skills.map(sk => `
              <div class="skill-eval-item p-3 glass-card mt-2">
                <div class="flex-between">
                  <span class="skill-name"><strong>${sk.skill_name}</strong> (${sk.skill_category})</span>
                  <span class="skill-points">+${sk.points} Points</span>
                </div>
                <div class="meta-row text-sm mt-1">
                  <span>Confidence: ${(sk.confidence * 100).toFixed(0)}%</span> • 
                  <span>Evidence Snippet: <em>"${sk.evidence}"</em></span>
                </div>
              </div>
            `).join('') : '<div class="empty-state">No skills detected.</div>'}
          </div>

          <div class="mt-4">
            <button class="btn btn-secondary btn-sm" id="triggerReanalyzeBtn" data-id="${sub.id}">🔄 Trigger Re-analysis Version</button>
            <button class="btn btn-outline btn-sm" id="requestReviewBtn" data-id="${sub.id}">🙋 Request Human Review</button>
          </div>
        </div>
      `;

      document.getElementById('triggerReanalyzeBtn').addEventListener('click', async (e) => {
        const res = await fetch(`/submissions/${e.target.dataset.id}/analyze`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const d = await res.json();
        alert('Re-analysis completed! Status: ' + d.status);
        inspectSubmissionEval(submissionId);
      });

      document.getElementById('requestReviewBtn').addEventListener('click', async (e) => {
        const res = await fetch(`/submissions/${e.target.dataset.id}/review`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ notes: 'Student requested manual human verification' })
        });
        const d = await res.json();
        alert(d.message);
        inspectSubmissionEval(submissionId);
      });

    } catch (err) {
      container.innerHTML = `<div class="empty-state">Error loading evaluation: ${err.message}</div>`;
    }
  }

  // Load Challenges
  async function loadChallenges() {
    const container = document.getElementById('challengesGridContainer');
    try {
      const res = await fetch('/api/challenges');
      const challenges = await res.json();

      container.innerHTML = challenges.map(ch => `
        <div class="glass-card flex-col flex-between">
          <div>
            <div class="flex-between">
              <span class="badge-tag">${ch.category}</span>
              <span class="badge-pill highlight">${ch.difficulty} • +${ch.reward_xp} XP</span>
            </div>
            <h4 class="mt-2">${ch.title}</h4>
            <p class="text-sm text-muted mt-1">${ch.description}</p>
            <div class="requirements-box mt-2 text-xs">
              <strong>Requirements:</strong> ${ch.requirements}
            </div>
          </div>
          <button class="btn btn-primary btn-block mt-4 submit-ch-btn" data-id="${ch.id}" data-title="${ch.title}">
            🚀 Submit Challenge Solution
          </button>
        </div>
      `).join('');

      document.querySelectorAll('.submit-ch-btn').forEach(b => {
        b.addEventListener('click', () => {
          const solution = prompt(`Enter code or GitHub link for "${b.dataset.title}":`, `// Implemented solution in Node.js or Python\nfunction solve() {\n  // Code implementation\n}`);
          if (solution) {
            submitChallenge(b.dataset.id, b.dataset.title, solution);
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="empty-state">Failed to load challenges</div>`;
    }
  }

  async function submitChallenge(challengeId, title, code) {
    if (!token) {
      alert('Please login or seed demo student first');
      return;
    }
    try {
      const res = await fetch(`/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Solution for ${title}`,
          description: `Solution code submission for ${title}`,
          code_or_link: code
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      alert(`Challenge submission evaluated! Status: ${d.status}. Awarded: +${d.score_awarded} XP! Feedback: ${d.feedback}`);
      loadTabContent('dashboard');
    } catch (err) {
      alert('Challenge error: ' + err.message);
    }
  }

  // Leaderboard
  const filterSelect = document.getElementById('leaderboardFilterSelect');
  filterSelect.addEventListener('change', loadLeaderboard);

  async function loadLeaderboard() {
    const body = document.getElementById('leaderboardBody');
    const selected = filterSelect.value;
    try {
      const endpoint = selected === 'global' ? '/api/leaderboard' : `/api/leaderboard/skill/${encodeURIComponent(selected)}`;
      const res = await fetch(endpoint);
      const rows = await res.json();

      body.innerHTML = rows.map(r => `
        <tr>
          <td><strong>#${r.rank}</strong></td>
          <td><strong>${r.name}</strong></td>
          <td>${r.headline || 'Student Developer'}</td>
          <td><strong style="color: var(--accent-amber)">${r.total_xp || r.skill_points || 0} XP</strong></td>
          <td>${r.verified_submissions_count || r.evidence_count || 0}</td>
          <td>${r.badges_count || 0} Badges</td>
        </tr>
      `).join('');
    } catch (err) {
      body.innerHTML = `<tr><td colspan="6" class="text-center">Failed to load leaderboard</td></tr>`;
    }
  }

  // Employer Search
  document.getElementById('employerSearchBtn').addEventListener('click', searchCandidates);

  async function searchCandidates() {
    const container = document.getElementById('candidatesContainer');
    const skill = document.getElementById('employerSkillInput').value;
    const minPoints = document.getElementById('employerMinPointsInput').value;

    try {
      const res = await fetch(`/employers/candidates?skill=${encodeURIComponent(skill)}&minPoints=${minPoints}`);
      const candidates = await res.json();

      if (candidates.length === 0) {
        container.innerHTML = `<div class="empty-state">No matching student candidates found with specified skill points filter.</div>`;
        return;
      }

      container.innerHTML = candidates.map(c => `
        <div class="glass-card mt-2">
          <div class="flex-between">
            <div>
              <h4>${c.name}</h4>
              <p class="text-sm text-muted">${c.headline}</p>
            </div>
            <span class="skill-points">+${c.skill_points} PTS in ${c.matched_skill}</span>
          </div>
          <div class="meta-row mt-2 text-xs">
            <span>Category: <strong>${c.matched_category}</strong></span> • 
            <span>Verified Evidence: <strong>${c.evidence_count} items</strong></span> • 
            <span>Badges: <strong>${c.badges_count}</strong></span>
          </div>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = `<div class="empty-state">Search error</div>`;
    }
  }

  // Initial load
  updateUserUI();
  loadTabContent('dashboard');
});
