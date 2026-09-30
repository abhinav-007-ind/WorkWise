import React from 'react';
import { motion } from 'motion/react';
import { ViewRole } from '../types';
import { UploadCloud, Users, Briefcase, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeRole: ViewRole;
  onRoleChange: (role: ViewRole) => void;
  onUploadClick: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const WorkWiseNavbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  onUploadClick,
  onNavigate,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADBCE] py-3.5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark adhering strictly to Top Bar Contract */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C85A32] flex items-center justify-center text-white font-display font-extrabold text-sm shadow-xs group-hover:bg-[#B24B25] transition-colors">
              W
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight text-[#1C1917]">
              WorkWise
            </span>
          </a>
        </div>

        {/* Zone 2: 4-6 Clean navigation text links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`hover:text-[#1C1917] hover:underline underline-offset-8 decoration-[#C85A32] transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'how-it-works' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Ecosystem Flow
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className={`hover:text-[#1C1917] hover:underline underline-offset-8 decoration-[#C85A32] transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'upload' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Evidence Engine
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`hover:text-[#1C1917] hover:underline underline-offset-8 decoration-[#C85A32] transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'profile' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Skill Profile
          </button>
          <button
            onClick={() => {
              onRoleChange('employer');
              onNavigate('discovery');
            }}
            className={`hover:text-[#1C1917] hover:underline underline-offset-8 decoration-[#C85A32] transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'discovery' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Employer Discovery
          </button>
        </nav>

        {/* Zone 3: Interactive Role Switcher + Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Role Toggle Switcher */}
          <div className="flex p-1 bg-[#F5EFEB] border border-[#EADBCE] rounded-xl text-xs font-medium">
            <button
              onClick={() => onRoleChange('student')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeRole === 'student'
                  ? 'bg-white text-[#1C1917] shadow-xs font-semibold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden sm:inline">Student / Candidate</span>
              <span className="sm:hidden">Student</span>
            </button>
            <button
              onClick={() => {
                onRoleChange('employer');
                onNavigate('discovery');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeRole === 'employer'
                  ? 'bg-white text-[#1C1917] shadow-xs font-semibold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden sm:inline">Employer</span>
              <span className="sm:hidden">Employer</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUploadClick}
            className="px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#C85A32] hover:bg-[#B24B25] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Work</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
