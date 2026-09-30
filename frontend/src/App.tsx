/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkWiseNavbar } from './components/WorkWiseNavbar';
import { WorkWiseHero } from './components/WorkWiseHero';
import { HowItWorksFlow } from './components/HowItWorksFlow';
import { WorkUploadEngine } from './components/WorkUploadEngine';
import { SkillProfileView } from './components/SkillProfileView';
import { EmployerDiscovery } from './components/EmployerDiscovery';
import { WorkWiseFooter } from './components/WorkWiseFooter';
import { INITIAL_USER_PROFILE } from './data/mockData';
import { CandidateProfile, ProjectSubmission, ViewRole } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeRole, setActiveRole] = useState<ViewRole>('student');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [userProfile, setUserProfile] = useState<CandidateProfile>(INITIAL_USER_PROFILE);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWorkAnalyzed = (newProject: ProjectSubmission) => {
    setUserProfile((prev) => {
      const updatedProjects = [newProject, ...prev.projects];
      const addedPoints = newProject.totalPoints;
      return {
        ...prev,
        projects: updatedProjects,
        totalSkillPoints: prev.totalSkillPoints + addedPoints,
      };
    });

    setRecentNotification(`Work analyzed! +${newProject.totalPoints} verified skill points added to ${userProfile.name}'s profile.`);
    setTimeout(() => {
      setRecentNotification(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] selection:bg-[#EADBCE] selection:text-[#C85A32]">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {recentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-800 text-xs font-mono"
          >
            <Sparkles className="w-4 h-4 text-[#C85A32]" />
            <span>{recentNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <WorkWiseNavbar
        activeRole={activeRole}
        onRoleChange={(role) => setActiveRole(role)}
        onUploadClick={() => handleNavigate('upload')}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      <main>
        {/* Hero Section */}
        <WorkWiseHero
          onStartUpload={() => handleNavigate('upload')}
          onExploreTalent={() => {
            setActiveRole('employer');
            handleNavigate('discovery');
          }}
          onViewHowItWorks={() => handleNavigate('how-it-works')}
        />

        {/* 01. Ecosystem Flow (How It Works) */}
        <HowItWorksFlow />

        {/* 02. Interactive AI Evidence Engine & Work Upload */}
        <WorkUploadEngine
          onWorkAnalyzed={handleWorkAnalyzed}
          onViewProfile={() => handleNavigate('profile')}
        />

        {/* 03. Live Verified Skill Profile & Portfolio */}
        <SkillProfileView
          profile={userProfile}
          onUploadMore={() => handleNavigate('upload')}
        />

        {/* 04. Employer Talent Discovery Portal */}
        <EmployerDiscovery />
      </main>

      {/* Quiet Footer */}
      <WorkWiseFooter onNavigate={handleNavigate} />
    </div>
  );
}
