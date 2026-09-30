# ⚡ WorkWise

### **Turn Your Work Into Proof of Skill.**

> **Don't just say you can do it. Show what you've built.**

WorkWise is an **AI-powered skill-evidence and talent discovery platform** that helps students and early-career professionals turn their real work into meaningful proof of their abilities.

Instead of relying only on **degrees, certificates, marks, or self-written resumes**, WorkWise focuses on what a person can actually demonstrate through their projects, assignments, designs, code, research, presentations, and other forms of work.

---

## 🎯 The Problem

A resume can say:

```text
"React Developer"
"Python Developer"
"Good Problem Solver"
```

But where is the proof?

Students often have skills but struggle to demonstrate them effectively. At the same time, employers have difficulty identifying capable entry-level talent from resumes alone.

This creates a gap between:

**What a candidate claims → What they can actually demonstrate**

WorkWise is built to close that gap.

---

# 💡 Our Approach

WorkWise follows a simple philosophy:

```text
             REAL WORK
                 ↓
              EVIDENCE
                 ↓
         DEMONSTRATED SKILLS
                 ↓
          SKILL POINTS + BADGES
                 ↓
          PROOF-OF-SKILL PROFILE
                 ↓
           TALENT DISCOVERY
```

The platform transforms a candidate's work into a structured representation of their demonstrated capabilities.

---

# 🧠 How WorkWise Works

### 01 — Build

The candidate creates projects, assignments, designs, code, research, presentations, and other practical work.

### 02 — Upload

Work can be added to the WorkWise profile as project files, documents, images, links, or other supported evidence.

### 03 — Analyze

The platform's planned AI layer analyzes the submitted work and identifies skills that the work demonstrates.

### 04 — Evidence

Skills are connected to evidence from the submitted project rather than existing only as self-declared profile tags.

### 05 — Grow

Demonstrated skills contribute to a candidate's skill profile, points, badges, and portfolio.

### 06 — Discover

Employers can explore candidates based on demonstrated skills and inspect their underlying projects and evidence.

---

# 🧩 Core Features

## 👨‍💻 Proof-of-Skill Profiles

Turn scattered projects into a structured skill profile.

Instead of:

> "I know React."

WorkWise aims to show:

> "Here is the project where I demonstrated React."

---

## 📂 Work Upload Engine

Candidates can build their evidence library with:

* Projects
* Assignments
* Code
* Designs
* Presentations
* Reports
* Research
* Project links
* Other practical work

---

## 🤖 AI Skill Analysis

The planned intelligence layer can analyze submitted work to identify potential demonstrated skills and connect them with supporting evidence.

Example:

```text
Project
│
├── React components
├── API integration
├── Authentication
├── Responsive UI
└── Database interaction
        ↓
Detected Skills
        ↓
React
API Integration
Authentication
UI Development
Database
```

---

## 🏆 Skill Points

WorkWise represents demonstrated skills through a points-based profile.

Example:

```text
React              420 pts
JavaScript         360 pts
UI Development     280 pts
API Integration    210 pts
Problem Solving    190 pts
```

> Points in the current prototype are demonstration data; production scoring can be connected to a backend and evidence-analysis engine.

---

## 🥇 Achievement Badges

Candidates can showcase achievements through visual badges such as:

* Frontend Builder
* React Developer
* Problem Solver
* Project Contributor
* UI Creator

Badges make progress easier to understand at a glance.

---

# 🏢 Employer Discovery

WorkWise also changes the way employers can explore early-career talent.

Instead of starting with:

```text
Degree → College → Resume
```

the platform emphasizes:

```text
Skills → Projects → Evidence → Candidate
```

Employers can:

* Search candidates
* Filter by skills
* Explore candidate profiles
* Review projects
* Inspect demonstrated skills
* Examine supporting evidence

---

# 🔍 Evidence-First Hiring

The core principle behind WorkWise is:

> **A skill becomes more meaningful when it is connected to evidence.**

For example:

```text
Skill
  ↓
React
  ↓
Project Evidence
  ↓
Reusable components
Routing
State management
API integration
  ↓
Demonstrated capability
```

This makes the candidate profile more than a list of keywords.

---

# 🌐 Portfolio That Builds Itself

WorkWise can transform a candidate's accumulated work into a professional portfolio.

```text
                  PROFILE
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      Skills      Projects      Badges
        │            │            │
        └────────────┼────────────┘
                     ↓
              PUBLIC PORTFOLIO
```

Candidates can share their public profile with employers, mentors, or collaborators.

---

# 🛡️ RepairGrid Integration

WorkWise also includes the **RepairGrid Employer Verification Module** as part of the wider project ecosystem.

The employer-side ecosystem is designed around:

```text
Candidate
    ↓
Work Evidence
    ↓
Skill Profile
    ↓
Employer Discovery
    ↓
Verification
    ↓
Better Talent Visibility
```

RepairGrid is maintained within the same project repository as a dedicated module/sub-application.

---

# 🖥️ Product Experience

### Student Flow

```text
Landing
   ↓
Register
   ↓
Onboarding
   ↓
Dashboard
   ↓
Upload Work
   ↓
Analysis
   ↓
Skills + Evidence
   ↓
Points + Badges
   ↓
Portfolio
   ↓
Public Profile
```

### Employer Flow

```text
Employer Dashboard
        ↓
Candidate Search
        ↓
Skill Filters
        ↓
Candidate Profile
        ↓
Projects
        ↓
Skill Evidence
        ↓
Verification
```

---

# 🏗️ Architecture

```text
                         WORKWISE
                            │
             ┌──────────────┴──────────────┐
             │                             │
         CANDIDATE                     EMPLOYER
             │                             │
             ↓                             ↓
       Upload Work                  Discover Talent
             │                             │
             ↓                             ↓
      AI Skill Analysis              Skill Search
             │                             │
             ↓                             ↓
       Skill Evidence               Candidate View
             │                             │
             ↓                             ↓
      Points + Badges                 Verification
             │
             ↓
          Portfolio
```

---

# 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**

### UI & Styling

* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**

### Interaction & Visualization

* **Framer Motion**
* **Recharts**

### Routing

* **React Router**

---

# 📁 Project Structure

```text
WorkWise/
│
├── src/
│   ├── components/
│   │   ├── EmployerDiscovery.tsx
│   │   ├── HowItWorksFlow.tsx
│   │   ├── SkillProfileView.tsx
│   │   ├── WorkUploadEngine.tsx
│   │   ├── WorkWiseFooter.tsx
│   │   ├── WorkWiseHero.tsx
│   │   └── WorkWiseNavbar.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── repairgrid/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🔌 Designed for Future Expansion

The current frontend prototype uses mock data and services so the complete product experience can be demonstrated without requiring a production backend.

The architecture is designed so future services can replace the mock layer:

```text
Current Prototype

React UI
   ↓
Mock Services
   ↓
Mock Data


Future Product

React UI
   ↓
Backend API
   ↓
Database
   ↓
File Storage
   ↓
AI / Skill Analysis
   ↓
Verification
```

Potential service layers include:

```text
authService
projectService
skillService
badgeService
portfolioService
employerService
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* Git

installed on your system.

### Clone the repository

```bash
git clone https://github.com/abhinav-007-ind/WorkWise.git
cd WorkWise
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open the local development URL shown in your terminal.

---

# 🎬 Demo Story

Imagine a student named **Aarav**.

He doesn't have a long list of certificates.

But he has built:

```text
✓ E-commerce platform
✓ AI dashboard
✓ Portfolio website
✓ College management system
```

He uploads those projects to WorkWise.

The platform turns his work into:

```text
React
JavaScript
TypeScript
API Integration
UI Development
Problem Solving
```

His profile becomes a collection of **demonstrated capabilities backed by his work**.

An employer looking for a frontend developer can discover Aarav and inspect the projects behind those skills.

That's the WorkWise experience.

---

# 🌱 Vision

WorkWise aims to move talent discovery from:

> **"What does your resume say?"**

towards:

> **"What have you actually demonstrated?"**

The long-term vision is an ecosystem where students can build a **living proof-of-skill identity** throughout their education and early career.

Every project becomes more than a submission.

Every assignment can become evidence.

Every skill can have a story behind it.

---

# ⚡ The WorkWise Philosophy

```text
Don't just list skills.
                 ↓
Demonstrate them.

Don't just collect certificates.
                 ↓
Build things.

Don't just submit projects.
                 ↓
Turn them into evidence.

Don't just create a resume.
                 ↓
Build a proof-of-skill identity.
```

---

## 💙 WorkWise

### **Turn Your Work Into Proof of Skill.**

**Build. Prove. Discover.**
