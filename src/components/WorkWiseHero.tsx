import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, FileCode, Layers, Eye, Users } from 'lucide-react';

interface HeroProps {
  onStartUpload: () => void;
  onExploreTalent: () => void;
  onViewHowItWorks: () => void;
}

export const WorkWiseHero: React.FC<HeroProps> = ({
  onStartUpload,
  onExploreTalent,
  onViewHowItWorks,
}) => {
  return (
    <section className="relative pt-12 pb-20 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2] to-[#F5EFEB] overflow-hidden">
      {/* Subtle warm ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#EADBCE]/50 via-[#F3E5D8]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Unboxed Metadata / Kicker (Zero-Pill Discipline) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-[#78716C] mb-6"
        >
          <span className="font-semibold text-[#C85A32]">WORKWISE TALENT PLATFORM</span>
          <span aria-hidden="true" className="text-[#D8C5B3]">·</span>
          <span>EVIDENCE-BACKED SKILLS</span>
          <span aria-hidden="true" className="text-[#D8C5B3]">·</span>
          <span className="text-[#1C1917] font-medium">FOR STUDENTS, GRADUATES & EMPLOYERS</span>
        </motion.div>

        {/* Marquee Headline */}
        <div className="max-w-4xl mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.06]"
            style={{ textWrap: 'balance' }}
          >
            Turn Your Work Into{' '}
            <span className="text-[#C85A32] italic font-serif">Proof of Skill.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#57534E] leading-relaxed max-w-2xl"
          >
            Traditional resumes show what you studied. WorkWise shows what you can actually build. Upload your real projects, codebases, designs, and research—our AI parses demonstrated evidence, calculates explainable skill points, and connects you directly with top employers.
          </motion.p>
        </div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartUpload}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#B24B25] text-white font-semibold text-sm sm:text-base shadow-sm transition-colors cursor-pointer"
          >
            <span>Upload Work & Get Skill Evidence</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreTalent}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#EADBCE] bg-white hover:bg-[#FAF7F2] text-[#1C1917] font-semibold text-sm sm:text-base transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#C85A32]" />
            <span>Discover Verified Candidates</span>
          </motion.button>
        </motion.div>

        {/* Core Proposition Demonstration Box: Evidence Before Claims */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="rounded-3xl border border-[#EADBCE] bg-[#F5EFEB] p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EADBCE]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#C85A32] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>FIRST PRINCIPLE: EVIDENCE BEFORE CLAIMS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1C1917]">
                A skill is never an arbitrary number. It is grounded in real artifact proof.
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#78716C]">
                PARSING ENGINES ACTIVE
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                AST + Heuristic Analysis
              </span>
            </div>
          </div>

          {/* Interactive Flow Illustration Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Real Work Uploaded */}
            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#78716C] mb-2">INPUT ARTIFACT</div>
                <div className="flex items-center gap-2.5 text-base font-display font-bold text-[#1C1917]">
                  <FileCode className="w-5 h-5 text-[#C85A32]" />
                  <span>E-Commerce Dashboard</span>
                </div>
                <p className="mt-2 text-xs text-[#57534E] leading-relaxed">
                  Source code repository, custom hooks, unit test suites, and schema definitions uploaded by student.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F5EFEB] text-[11px] font-mono text-[#78716C]">
                48 Files Analyzed · 2,840 Lines of Code
              </div>
            </div>

            {/* Step 2: AI Evidence Extraction */}
            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#78716C] mb-2">AI EVIDENCE EXTRACTION</div>
                <div className="flex items-center gap-2 text-base font-display font-bold text-[#1C1917]">
                  <Sparkles className="w-5 h-5 text-[#C85A32]" />
                  <span>Concrete Proof Verified</span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-[#1C1917]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Optimistic mutations via React 19</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Branded TypeScript union types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>WCAG AAA compliant tabular ledger</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F5EFEB] text-[11px] font-mono text-[#78716C]">
                Zero generic assertions · Line-by-line attribution
              </div>
            </div>

            {/* Step 3: Verified Points & Badges */}
            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#78716C] mb-2">OUTPUT PROFILE EVIDENCE</div>
                <div className="flex items-center gap-2 text-base font-display font-bold text-[#1C1917]">
                  <Layers className="w-5 h-5 text-[#C85A32]" />
                  <span>Demonstrated Skill Score</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono">
                      <span>React Architecture</span>
                      <span className="font-bold text-[#C85A32]">92 pts</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5EFEB] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#C85A32] rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono">
                      <span>TypeScript Strictness</span>
                      <span className="font-bold text-[#1C1917]">86 pts</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5EFEB] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#1C1917] rounded-full w-[86%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono">
                      <span>UI/UX Data Density</span>
                      <span className="font-bold text-[#8E7158]">78 pts</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5EFEB] rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#8E7158] rounded-full w-[78%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F5EFEB] text-[11px] font-mono text-emerald-700 font-medium">
                Badge Unlocked: Type-Safe Architect (Gold)
              </div>
            </div>
          </div>

          {/* Quantified Adjacency Proof Row */}
          <div className="mt-8 pt-6 border-t border-[#EADBCE] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="block text-2xl font-display font-extrabold text-[#1C1917]">94%</span>
              <span className="text-[#78716C]">Hiring managers trust evidence over resumes</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-extrabold text-[#C85A32]">100%</span>
              <span className="text-[#78716C]">Explainable skill point calculations</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-extrabold text-[#1C1917]">&lt;45s</span>
              <span className="text-[#78716C]">Automated multi-file evidence parsing</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-extrabold text-[#1C1917]">4,200+</span>
              <span className="text-[#78716C]">Student projects verified this semester</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
