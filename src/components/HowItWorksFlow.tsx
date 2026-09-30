import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, UploadCloud, Cpu, FileSearch, CheckCircle2, Award, Briefcase, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

const ECOSYSTEM_STEPS = [
  {
    step: '01',
    title: 'Create Verified Profile',
    icon: UserPlus,
    description: 'Students and early-career candidates establish a profile featuring education, course of study, and links.',
  },
  {
    step: '02',
    title: 'Upload Real Work Artifacts',
    icon: UploadCloud,
    description: 'Submit source code repos, design prototypes, assignments, PDF papers, slide decks, and data models.',
  },
  {
    step: '03',
    title: 'AI AST & Heuristic Parsing',
    icon: Cpu,
    description: 'WorkWise parses the raw artifacts to analyze structural integrity, architectural patterns, and depth.',
  },
  {
    step: '04',
    title: 'Concrete Evidence Extraction',
    icon: FileSearch,
    description: 'Identifies specific proof lines: custom hook state flows, type-safe unions, and test assertions.',
  },
  {
    step: '05',
    title: 'Explainable Points Calculation',
    icon: CheckCircle2,
    description: 'Points awarded using transparent formulas: Complexity (30%), Testing (25%), Problem Solving (25%), Git (20%).',
  },
  {
    step: '06',
    title: 'Badges Awarded & Portfolio Updated',
    icon: Award,
    description: 'Milestone honors unlocked (e.g. Type-Safe Architect). Profile transcript regenerates with verification hashes.',
  },
  {
    step: '07',
    title: 'Employer Discovery & Evidence Review',
    icon: Briefcase,
    description: 'Hiring managers filter candidates by verified skills and review line-by-line evidence before interviewing.',
  },
];

export const HowItWorksFlow: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(2);

  return (
    <section id="how-it-works" className="py-24 bg-[#FAF7F2] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C85A32] mb-3">
            <span>01</span>
            <span aria-hidden="true">·</span>
            <span>END-TO-END ECOSYSTEM</span>
            <span aria-hidden="true">·</span>
            <span>THE EVIDENCE PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1C1917]">
            How WorkWise Bridges the Degree-to-Skill Gap
          </h2>
          <p className="mt-4 text-[#57534E] text-base sm:text-lg leading-relaxed">
            From the moment work is submitted to when an employer reviews line-by-line proof: the complete journey from student project to verified professional evidence.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {ECOSYSTEM_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                  isActive
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md scale-102'
                    : 'bg-[#F5EFEB] border-[#EADBCE] text-[#57534E] hover:border-[#D8C5B3] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#C85A32]' : 'text-[#78716C]'}`}>
                    {item.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C85A32]' : 'text-[#78716C]'}`} />
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-[#1C1917]'}`}>
                    {item.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Focused Step Spotlight Card */}
        <div className="bg-[#F5EFEB] rounded-3xl border border-[#EADBCE] p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#EADBCE] flex items-center justify-center text-[#C85A32] shadow-xs shrink-0">
                {React.createElement(ECOSYSTEM_STEPS[activeStepIndex].icon, { className: 'w-7 h-7' })}
              </div>
              <div>
                <div className="text-xs font-mono text-[#C85A32] mb-1">
                  PHASE {ECOSYSTEM_STEPS[activeStepIndex].step} OF 07
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1C1917]">
                  {ECOSYSTEM_STEPS[activeStepIndex].title}
                </h3>
                <p className="mt-2 text-sm text-[#57534E] max-w-2xl leading-relaxed">
                  {ECOSYSTEM_STEPS[activeStepIndex].description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : ECOSYSTEM_STEPS.length - 1))}
                className="px-3 py-2 text-xs font-mono border border-[#EADBCE] bg-white rounded-lg hover:border-[#1C1917] transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStepIndex((prev) => (prev < ECOSYSTEM_STEPS.length - 1 ? prev + 1 : 0))}
                className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#C85A32] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Next Phase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
