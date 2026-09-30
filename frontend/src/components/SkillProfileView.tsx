import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateProfile, ProjectSubmission, SkillEvidence } from '../types';
import { Award, CheckCircle2, Download, ExternalLink, Github, Linkedin, MapPin, GraduationCap, ShieldCheck, Sparkles, Copy, Check, ChevronRight } from 'lucide-react';

interface SkillProfileViewProps {
  profile: CandidateProfile;
  onUploadMore: () => void;
}

export const SkillProfileView: React.FC<SkillProfileViewProps> = ({
  profile,
  onUploadMore,
}) => {
  const [selectedSkillProof, setSelectedSkillProof] = useState<SkillEvidence | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [transcriptDownloaded, setTranscriptDownloaded] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`https://workwise.dev/@${profile.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadTranscript = () => {
    setTranscriptDownloaded(true);
    setTimeout(() => setTranscriptDownloaded(false), 3000);
  };

  return (
    <section id="profile" className="py-24 bg-[#FAF7F2] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#C85A32] mb-3">
          <span>03</span>
          <span aria-hidden="true">·</span>
          <span>CANDIDATE EVIDENCE PROFILE</span>
          <span aria-hidden="true">·</span>
          <span>PORTFOLIO TRANSCRIPT</span>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-10 shadow-xs mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#EADBCE] shadow-xs"
                />
                {profile.openToWork && (
                  <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-600 text-white rounded-full border-2 border-white">
                    OPEN TO WORK
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1C1917]">
                    {profile.name}
                  </h2>
                  <span className="text-xs font-mono text-[#78716C]">
                    @{profile.username}
                  </span>
                  <span title="Verified Evidence">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-[#C85A32]">
                  {profile.headline}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#78716C] font-mono">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span>{profile.institution} · {profile.course}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{profile.location}</span>
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#57534E] max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>

            {/* Score & Actions */}
            <div className="flex flex-col items-start lg:items-end justify-between self-stretch gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EADBCE]">
              <div className="text-left lg:text-right">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917] tabular-nums">
                  {profile.totalSkillPoints}
                </div>
                <div className="text-xs font-mono text-[#C85A32] font-semibold">
                  TOTAL VERIFIED SKILL POINTS
                </div>
                <div className="text-[11px] text-[#78716C] font-mono mt-0.5">
                  Backed by {profile.projects.length} analyzed artifacts
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 text-xs font-mono border border-[#EADBCE] rounded-lg hover:border-[#1C1917] text-[#1C1917] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share Proof Link'}</span>
                </button>

                <button
                  onClick={handleDownloadTranscript}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#C85A32] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{transcriptDownloaded ? 'Transcript Prepared!' : 'Download Verified Transcript'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Top Skills + Unlocked Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Top Skills Matrix (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCE] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE] mb-6">
              <div>
                <span className="text-xs font-mono text-[#78716C]">SKILL MASTERY MATRIX</span>
                <h3 className="text-lg font-display font-bold text-[#1C1917]">
                  Demonstrated Capabilities
                </h3>
              </div>
              <span className="text-xs font-mono text-[#C85A32]">
                Ranked by real evidence
              </span>
            </div>

            <div className="space-y-4">
              {profile.topSkills.map((skill, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADBCE]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-[#1C1917]">{skill.name}</span>
                    <span className="font-mono font-extrabold text-[#C85A32] tabular-nums">
                      {skill.points} pts
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#EADBCE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C85A32] to-[#D97746] rounded-full transition-all"
                      style={{ width: `${skill.points}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-[#78716C] mt-1.5">
                    <span>Domain: {skill.category}</span>
                    <span>
                      {skill.points >= 90 ? 'Mastery Level' : skill.points >= 80 ? 'Advanced Level' : 'Proficient Level'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Unlocked Showcase (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCE] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE] mb-6">
                <div>
                  <span className="text-xs font-mono text-[#78716C]">VERIFIED HONORS</span>
                  <h3 className="text-lg font-display font-bold text-[#1C1917]">
                    Unlocked Skill Badges ({profile.badges.length})
                  </h3>
                </div>
                <Award className="w-5 h-5 text-[#C85A32]" />
              </div>

              <div className="space-y-3">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#EADBCE] flex items-center justify-center text-[#C85A32] shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917]">{badge.name}</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                          {badge.tier}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                        {badge.description}
                      </p>
                      <div className="mt-1.5 text-[10px] font-mono text-[#78716C]">
                        Earned via: {badge.sourceProject} · {badge.unlockedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EADBCE] mt-6">
              <button
                onClick={onUploadMore}
                className="w-full py-2.5 text-xs font-semibold bg-[#F5EFEB] hover:bg-[#EADBCE] text-[#1C1917] rounded-xl transition-colors text-center cursor-pointer"
              >
                + Upload Another Project to Earn More Badges
              </button>
            </div>
          </div>
        </div>

        {/* Real Projects & Evidence Submissions Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-[#78716C]">PROVEN WORK REPOSITORY</span>
              <h3 className="text-2xl font-display font-bold text-[#1C1917]">
                Demonstrated Projects & Evidence
              </h3>
            </div>
            <button
              onClick={onUploadMore}
              className="text-xs font-mono font-semibold text-[#C85A32] hover:underline cursor-pointer"
            >
              + Submit New Work
            </button>
          </div>

          <div className="space-y-6">
            {profile.projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-8 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EADBCE]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#78716C] mb-1">
                      <span>{proj.workType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.format}</span>
                      <span aria-hidden="true">·</span>
                      <span>Verified {proj.uploadedAt}</span>
                    </div>
                    <h4 className="text-xl font-display font-bold text-[#1C1917]">
                      {proj.title}
                    </h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#57534E] max-w-3xl leading-relaxed">
                      {proj.summary}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end shrink-0">
                    <div className="text-2xl font-display font-extrabold text-[#C85A32] tabular-nums">
                      +{proj.totalPoints} pts
                    </div>
                    <div className="text-[11px] font-mono text-[#78716C]">
                      Verification Hash: {proj.verificationHash.substring(0, 12)}...
                    </div>
                  </div>
                </div>

                {/* Extracted Skills List */}
                <div className="mt-6">
                  <div className="text-xs font-mono text-[#78716C] mb-3">
                    DEMONSTRATED SKILLS EXTRACTED FROM THIS ARTIFACT
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {proj.detectedSkills.map((sk) => (
                      <div
                        key={sk.id}
                        onClick={() => setSelectedSkillProof(sk)}
                        className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EADBCE] hover:border-[#C85A32] transition-colors cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-[#1C1917] group-hover:text-[#C85A32] transition-colors">
                            {sk.skillName}
                          </span>
                          <span className="text-xs font-mono font-extrabold text-[#C85A32]">
                            {sk.points} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57534E] line-clamp-2 mt-1">
                          {sk.evidenceSummary}
                        </p>
                        <div className="mt-2 text-[10px] font-mono text-[#C85A32] flex items-center gap-1 font-semibold">
                          <span>Inspect proof snippet</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proof Snippet Modal */}
      <AnimatePresence>
        {selectedSkillProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white border border-[#EADBCE] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div>
                <div className="text-xs font-mono text-[#C85A32] mb-1">
                  EXPLAINABLE PROOF VERIFICATION
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1C1917]">
                  {selectedSkillProof.skillName} ({selectedSkillProof.points} Points)
                </h3>
                <p className="text-xs text-[#78716C] mt-1 font-mono">
                  From: {selectedSkillProof.sourceProjectTitle}
                </p>
              </div>

              <div className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#EADBCE] space-y-2">
                <div className="text-xs font-mono text-[#78716C]">EXACT AST EVIDENCE DETECTED</div>
                <div className="p-3 bg-white border border-[#EADBCE] rounded-lg text-xs font-mono text-[#1C1917]">
                  {selectedSkillProof.proofDetails.astOrPatternEvidence}
                </div>
                <div className="text-[11px] font-mono text-[#78716C]">
                  Location: {selectedSkillProof.proofDetails.fileLocation}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-[#78716C] mb-2">SCORING AUDIT BREAKDOWN</div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between p-2 bg-[#FAF7F2] rounded-md">
                    <span>Architectural Complexity:</span>
                    <span className="font-bold">{selectedSkillProof.proofDetails.calculationFormula.architecturalComplexity} pts</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#FAF7F2] rounded-md">
                    <span>Testing & Reliability:</span>
                    <span className="font-bold">{selectedSkillProof.proofDetails.calculationFormula.bestPracticesAndTesting} pts</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#FAF7F2] rounded-md">
                    <span>Problem Solving Depth:</span>
                    <span className="font-bold">{selectedSkillProof.proofDetails.calculationFormula.problemSolvingDepth} pts</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#FAF7F2] rounded-md">
                    <span>Documentation & Git:</span>
                    <span className="font-bold">{selectedSkillProof.proofDetails.calculationFormula.documentationAndGit} pts</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#EADBCE]">
                <button
                  onClick={() => setSelectedSkillProof(null)}
                  className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-white rounded-lg hover:bg-[#C85A32] transition-colors cursor-pointer"
                >
                  Close Proof
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
