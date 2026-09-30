import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const WorkWiseFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#EADBCE] text-[#57534E] py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#EADBCE]">
          {/* Brand & Purpose */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#C85A32] flex items-center justify-center text-white font-display font-bold text-xs">
                W
              </div>
              <span className="text-xl font-display font-extrabold tracking-tight text-[#1C1917]">
                WorkWise
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed max-w-sm">
              The AI-powered skill-evidence and talent discovery platform turning real projects, code, designs, and research into verifiable, explainable proof of skill.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#C85A32]">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence before claims.</span>
            </div>
          </div>

          {/* Student & Candidate Links */}
          <div className="md:col-span-3 space-y-2 text-xs font-mono">
            <div className="font-bold text-[#1C1917] mb-3">FOR CANDIDATES</div>
            <div>
              <button
                onClick={() => onNavigate('upload')}
                className="hover:text-[#1C1917] hover:underline cursor-pointer"
              >
                Upload Work Artifacts
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('profile')}
                className="hover:text-[#1C1917] hover:underline cursor-pointer"
              >
                Skill Transcript & Badges
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="hover:text-[#1C1917] hover:underline cursor-pointer"
              >
                Scoring Formula Rubric
              </button>
            </div>
            <div>
              <span className="text-[#A8A29E]">Student Portfolio Sharing</span>
            </div>
          </div>

          {/* Employer & Verification Links */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div className="space-y-2 text-xs font-mono">
              <div className="font-bold text-[#1C1917] mb-3">FOR EMPLOYERS</div>
              <div>
                <button
                  onClick={() => onNavigate('discovery')}
                  className="hover:text-[#1C1917] hover:underline cursor-pointer"
                >
                  Candidate Discovery Search
                </button>
              </div>
              <div>
                <span className="text-[#A8A29E]">Verify Candidate Hash</span>
              </div>
              <div>
                <span className="text-[#A8A29E]">University Partner Integration</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 self-start inline-flex items-center gap-1.5 text-xs font-mono text-[#C85A32] hover:underline cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#78716C]">
          <div>
            © {new Date().getFullYear()} WorkWise Platform. Evidence before claims.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Security & AST Integrity</span>
            <span>contact@workwise.dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
