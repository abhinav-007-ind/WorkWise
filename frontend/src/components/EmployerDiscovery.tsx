import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateProfile } from '../types';
import { EXPLORE_CANDIDATES } from '../data/mockData';
import { Search, Filter, ShieldCheck, Sparkles, MapPin, GraduationCap, ArrowUpRight, CheckCircle2, Bookmark, Mail, X, Check } from 'lucide-react';

export const EmployerDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<string[]>([]);
  const [interviewModalCandidate, setInterviewModalCandidate] = useState<CandidateProfile | null>(null);
  const [interviewMessage, setInterviewMessage] = useState('');
  const [interviewSent, setInterviewSent] = useState(false);

  const skillFilterOptions = [
    'All',
    'React',
    'TypeScript',
    'Distributed Systems',
    'UI/UX Design',
    'PyTorch',
    'Go',
  ];

  const filteredCandidates = EXPLORE_CANDIDATES.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.institution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill =
      selectedSkillFilter === 'All' ||
      candidate.topSkills.some((s) => s.name.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

    return matchesSearch && matchesSkill;
  });

  const toggleSaveCandidate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCandidates((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendInterview = (e: React.FormEvent) => {
    e.preventDefault();
    setInterviewSent(true);
    setTimeout(() => {
      setInterviewSent(false);
      setInterviewModalCandidate(null);
      setInterviewMessage('');
    }, 2000);
  };

  return (
    <section id="discovery" className="py-24 bg-[#F5EFEB] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C85A32] mb-3">
              <span>04</span>
              <span aria-hidden="true">·</span>
              <span>EMPLOYER TALENT PORTAL</span>
              <span aria-hidden="true">·</span>
              <span>EVIDENCE SEARCH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1C1917]">
              Discover Verified Talent
            </h2>
            <p className="mt-3 text-[#57534E] text-base sm:text-lg max-w-xl">
              Source junior and early-career candidates based on real demonstrated skill points and project evidence, not keywords on a resume.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-mono text-[#78716C] bg-[#FAF7F2] px-4 py-2 rounded-xl border border-[#EADBCE]">
            {filteredCandidates.length} CANDIDATES MATCHING PROOF FILTERS
          </div>
        </div>

        {/* Search Bar & Skill Filter Chips */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#EADBCE] shadow-xs mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
              <input
                type="text"
                placeholder="Search candidates by name, university, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#C85A32] text-[#1C1917]"
              />
            </div>

            {/* Quick Skill Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-mono text-[#78716C] mr-1 hidden md:inline">SKILL:</span>
              {skillFilterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedSkillFilter(opt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedSkillFilter === opt
                      ? 'bg-[#1C1917] text-white'
                      : 'bg-white text-[#57534E] border border-[#EADBCE] hover:border-[#D8C5B3]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCandidates.map((candidate) => {
            const isSaved = savedCandidates.includes(candidate.id);
            return (
              <motion.div
                key={candidate.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-white rounded-3xl border border-[#EADBCE] p-6 sm:p-7 shadow-xs hover:border-[#C85A32] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#EADBCE]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-display font-bold text-[#1C1917] group-hover:text-[#C85A32] transition-colors">
                            {candidate.name}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-xs text-[#78716C] font-mono">
                          {candidate.gradYear} · {candidate.course}
                        </div>
                        <div className="text-xs text-[#57534E] mt-0.5 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-[#C85A32]" />
                          <span>{candidate.institution}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleSaveCandidate(candidate.id, e)}
                      title={isSaved ? 'Remove from Saved' : 'Save Candidate'}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                        isSaved
                          ? 'bg-[#C85A32] border-[#C85A32] text-white'
                          : 'border-[#EADBCE] text-[#78716C] hover:text-[#1C1917] bg-[#FAF7F2]'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-[#57534E] leading-relaxed line-clamp-2">
                    {candidate.headline}
                  </p>

                  {/* Top Demonstrated Skills Pills with Points */}
                  <div className="mt-5 space-y-2">
                    <div className="text-xs font-mono text-[#78716C]">
                      PROVEN SKILL POINTS (EXTRACTED FROM REAL ARTIFACTS)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {candidate.topSkills.slice(0, 4).map((sk, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] flex items-center justify-between"
                        >
                          <span className="text-xs font-medium text-[#1C1917] truncate max-w-[130px]">
                            {sk.name}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#C85A32] tabular-nums">
                            {sk.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Total Score & Action Links */}
                <div className="mt-6 pt-4 border-t border-[#EADBCE] flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="text-[#78716C]">TOTAL SCORE: </span>
                    <span className="font-bold text-[#1C1917] tabular-nums">
                      {candidate.totalSkillPoints} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInterviewModalCandidate(candidate);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#1C1917] hover:bg-[#C85A32] text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Request Interview
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C85A32] group-hover:underline">
                      <span>Inspect Evidence</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Candidate Full Evidence Inspection Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#EADBCE] rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Candidate Info */}
              <div className="flex items-start gap-4 pr-12">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#EADBCE]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-display font-bold text-[#1C1917]">
                      {selectedCandidate.name}
                    </h3>
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-xs text-[#78716C] font-mono mt-0.5">
                    {selectedCandidate.institution} · {selectedCandidate.course}
                  </div>
                  <p className="text-xs text-[#57534E] mt-2">
                    {selectedCandidate.bio}
                  </p>
                </div>
              </div>

              {/* Demonstrated Projects Section */}
              <div className="mt-8 pt-6 border-t border-[#EADBCE]">
                <h4 className="text-xs font-mono text-[#78716C] mb-4">
                  VERIFIED PROJECTS & CONCRETE EVIDENCE
                </h4>

                <div className="space-y-4">
                  {selectedCandidate.projects.map((proj) => (
                    <div key={proj.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADBCE]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-mono text-[#78716C]">
                            {proj.workType} · {proj.format}
                          </div>
                          <h5 className="text-base font-display font-bold text-[#1C1917] mt-0.5">
                            {proj.title}
                          </h5>
                          <p className="text-xs text-[#57534E] mt-1">
                            {proj.summary}
                          </p>
                        </div>
                        <span className="text-base font-display font-extrabold text-[#C85A32] tabular-nums shrink-0 ml-4">
                          +{proj.totalPoints} pts
                        </span>
                      </div>

                      {/* Evidence Lines */}
                      <div className="mt-3 pt-3 border-t border-[#EADBCE] space-y-1.5">
                        {proj.detectedSkills.map((sk) => (
                          <div key={sk.id} className="text-xs flex items-start justify-between gap-2">
                            <span className="font-semibold text-[#1C1917]">{sk.skillName}:</span>
                            <span className="text-[#57534E] flex-1 truncate">{sk.evidenceSummary}</span>
                            <span className="font-mono font-bold text-[#C85A32] shrink-0">{sk.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 pt-5 border-t border-[#EADBCE] flex items-center justify-between">
                <div className="text-xs font-mono text-[#78716C]">
                  Total Score: {selectedCandidate.totalSkillPoints} pts
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="px-4 py-2 text-xs font-semibold border border-[#EADBCE] text-[#57534E] rounded-lg hover:text-[#1C1917] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setInterviewModalCandidate(selectedCandidate);
                      setSelectedCandidate(null);
                    }}
                    className="px-5 py-2 text-xs font-semibold bg-[#C85A32] hover:bg-[#B24B25] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Request Technical Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {interviewModalCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-[#EADBCE] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <h3 className="text-xl font-display font-bold text-[#1C1917]">
                Connect with {interviewModalCandidate.name}
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Invite this candidate for a technical conversation based on their verified skill evidence in {interviewModalCandidate.topSkills[0]?.name}.
              </p>

              {interviewSent ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-[#1C1917]">Invitation Dispatched!</div>
                  <div className="text-xs text-[#78716C]">
                    {interviewModalCandidate.name} will be notified with your inquiry.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendInterview} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono text-[#78716C] mb-1">
                      TARGET ROLE / TEAM
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue="Junior Full-Stack Engineer"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#78716C] mb-1">
                      PERSONALIZED NOTE RE: VERIFIED EVIDENCE
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="We were impressed by your custom hook state synchronization in the E-Commerce Dashboard..."
                      value={interviewMessage}
                      onChange={(e) => setInterviewMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setInterviewModalCandidate(null)}
                      className="px-3 py-2 text-xs font-mono text-[#78716C]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-[#C85A32] hover:bg-[#B24B25] text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Send Direct Invitation
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
