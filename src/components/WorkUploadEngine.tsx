import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectSubmission, SkillEvidence } from '../types';
import { UploadCloud, FileCode, CheckCircle2, Sparkles, ArrowRight, Link as LinkIcon, RefreshCw, Eye, ShieldCheck, ChevronRight, Info } from 'lucide-react';

interface WorkUploadEngineProps {
  onWorkAnalyzed: (newProject: ProjectSubmission) => void;
  onViewProfile: () => void;
}

const PRESET_SAMPLE_PROJECTS = [
  {
    title: 'E-Commerce Dashboard & Inventory OS',
    type: 'Source Code & Full-Stack' as const,
    format: 'ZIP / Repo' as const,
    fileCount: 48,
    skillsCount: 4,
    description: 'TypeScript React 19 app with optimistic mutations, warehouse inventory sync, and unit tests.',
  },
  {
    title: 'PulseCare Telehealth Design System',
    type: 'UI/UX Design & Prototype' as const,
    format: 'Figma Design' as const,
    fileCount: 32,
    skillsCount: 3,
    description: 'WCAG AAA compliant patient interface, multi-tier design tokens, and inclusive typography.',
  },
  {
    title: 'Distributed Key-Value Raft Engine in Go',
    type: 'Source Code & Full-Stack' as const,
    format: 'ZIP / Repo' as const,
    fileCount: 36,
    skillsCount: 4,
    description: 'Consensus protocol with leader elections, atomic log replication, and snapshotting.',
  },
  {
    title: 'FlashLinear Sparse Attention Benchmark',
    type: 'Research & Technical Report' as const,
    format: 'PDF Paper' as const,
    fileCount: 16,
    skillsCount: 3,
    description: 'Peer-reviewed research manuscript analyzing O(N) memory scaling in transformer models.',
  },
];

export const WorkUploadEngine: React.FC<WorkUploadEngineProps> = ({
  onWorkAnalyzed,
  onViewProfile,
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState<ProjectSubmission['workType']>('Source Code & Full-Stack');
  const [projectUrl, setProjectUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [extractedProject, setExtractedProject] = useState<ProjectSubmission | null>(null);
  const [selectedEvidenceForDetail, setSelectedEvidenceForDetail] = useState<SkillEvidence | null>(null);

  const startAnalysis = (sampleIdx?: number) => {
    const idx = sampleIdx !== undefined ? sampleIdx : selectedPreset ?? 0;
    const blueprint = PRESET_SAMPLE_PROJECTS[idx];

    setIsAnalyzing(true);
    setAnalysisStage(1);
    setExtractedProject(null);

    // Multi-stage realistic AI parsing sequence
    setTimeout(() => {
      setAnalysisStage(2); // AST & Context extraction
    }, 1100);

    setTimeout(() => {
      setAnalysisStage(3); // Skill point calculation
    }, 2200);

    setTimeout(() => {
      setAnalysisStage(4); // Badges & transcript compilation

      const generatedProject: ProjectSubmission = {
        id: `proj-${Date.now()}`,
        title: projectTitle || blueprint.title,
        workType: blueprint.type,
        format: blueprint.format,
        uploadedAt: 'Just Now',
        summary: blueprint.description,
        repoOrDocUrl: projectUrl || 'https://github.com/student/sample-work',
        demoUrl: 'https://preview-verification.workwise.dev',
        filesAnalyzedCount: blueprint.fileCount,
        totalPoints: 215,
        verificationHash: `WW-HASH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SHA256`,
        unlockedBadgeIds: ['badge-ts-architect', 'badge-test-rigor'],
        detectedSkills: [
          {
            id: `sk-1-${Date.now()}`,
            skillName: blueprint.type.includes('Design') ? 'WCAG AAA Accessibility' : 'React 19 Architecture',
            category: blueprint.type.includes('Design') ? 'UI/UX Design' : 'Frontend',
            points: 92,
            maxPoints: 100,
            level: 'Mastery',
            evidenceSummary: 'Clean custom hook lifecycles, optimistic state updates, zero superfluous renders, and clean separation of concerns.',
            sourceProjectTitle: projectTitle || blueprint.title,
            proofDetails: {
              astOrPatternEvidence: 'Custom hooks with useOptimistic and memoized dependency trees across 14 modules.',
              fileLocation: 'src/hooks/useCartSync.ts:42-88',
              calculationFormula: {
                architecturalComplexity: 28,
                bestPracticesAndTesting: 24,
                problemSolvingDepth: 22,
                documentationAndGit: 18,
              },
            },
          },
          {
            id: `sk-2-${Date.now()}`,
            skillName: blueprint.type.includes('Design') ? 'Design Token System' : 'TypeScript Strict Type Safety',
            category: blueprint.type.includes('Design') ? 'UI/UX Design' : 'Frontend',
            points: 86,
            maxPoints: 100,
            level: 'Advanced',
            evidenceSummary: 'Discriminated union typings for all business events with zero `any` fallback types and strict compiler flags.',
            sourceProjectTitle: projectTitle || blueprint.title,
            proofDetails: {
              astOrPatternEvidence: 'Exhaustive discriminated union switch dispatchers and generic branded identifiers.',
              fileLocation: 'src/types/domain.d.ts:18-54',
              calculationFormula: {
                architecturalComplexity: 26,
                bestPracticesAndTesting: 23,
                problemSolvingDepth: 21,
                documentationAndGit: 16,
              },
            },
          },
          {
            id: `sk-3-${Date.now()}`,
            skillName: 'Problem Solving & Architecture',
            category: 'Engineering Practices',
            points: 82,
            maxPoints: 100,
            level: 'Advanced',
            evidenceSummary: 'Implemented modular domain boundary separation with clear repository data-access layers.',
            sourceProjectTitle: projectTitle || blueprint.title,
            proofDetails: {
              astOrPatternEvidence: 'Hexagonal / Ports-and-Adapters layer isolating UI from backend API contracts.',
              fileLocation: 'src/core/services/inventoryService.ts:10-72',
              calculationFormula: {
                architecturalComplexity: 25,
                bestPracticesAndTesting: 21,
                problemSolvingDepth: 20,
                documentationAndGit: 16,
              },
            },
          },
          {
            id: `sk-4-${Date.now()}`,
            skillName: 'Git Hygiene & Test Coverage',
            category: 'Engineering Practices',
            points: 74,
            maxPoints: 100,
            level: 'Proficient',
            evidenceSummary: 'Conventional atomic commits with automated GitHub Actions CI testing pipeline and 88% branch coverage.',
            sourceProjectTitle: projectTitle || blueprint.title,
            proofDetails: {
              astOrPatternEvidence: '28 atomic commits matching conventional commit format with passing Vitest suites.',
              fileLocation: '.github/workflows/verify.yml:1-32',
              calculationFormula: {
                architecturalComplexity: 20,
                bestPracticesAndTesting: 20,
                problemSolvingDepth: 18,
                documentationAndGit: 16,
              },
            },
          },
        ],
      };

      setExtractedProject(generatedProject);
      setIsAnalyzing(false);
      onWorkAnalyzed(generatedProject);
    }, 3200);
  };

  return (
    <section id="upload" className="py-24 bg-[#FAF7F2] border-t border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C85A32] mb-3">
              <span>02</span>
              <span aria-hidden="true">·</span>
              <span>AI EVIDENCE ENGINE</span>
              <span aria-hidden="true">·</span>
              <span>ARTIFACT EXTRACTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1C1917]">
              Upload Work & Extract Evidence
            </h2>
            <p className="mt-3 text-[#57534E] text-base sm:text-lg max-w-xl">
              Submit your real project files, repositories, Figma links, or papers. Our engine parses the work and calculates demonstrated skill points with full proof transparency.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-mono text-[#78716C] bg-[#F5EFEB] px-4 py-2 rounded-xl border border-[#EADBCE]">
            SUPPORTED: PDF, DOCX, ZIP, PPTX, FIGMA, GITHUB
          </div>
        </div>

        {/* Main Grid: Upload Zone + Blueprint Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload Box & Sample Blueprints (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Interactive Drag & Drop Area */}
            <div className="bg-[#F5EFEB] border-2 border-dashed border-[#D8C5B3] hover:border-[#C85A32] rounded-3xl p-8 sm:p-10 text-center transition-colors group relative overflow-hidden">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProjectTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                    startAnalysis(0);
                  }
                }}
              />

              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#EADBCE] flex items-center justify-center text-[#C85A32] shadow-xs group-hover:scale-105 transition-transform mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-lg sm:text-xl font-display font-bold text-[#1C1917]">
                Drag and drop your project files here
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#57534E]">
                Upload ZIP code archive, PDF research report, design presentation, or docx.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-[#78716C]">
                <span className="px-2.5 py-1 bg-white rounded-md border border-[#EADBCE]">Max 50MB</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-[#EADBCE]">AST Parser</span>
                <span className="px-2.5 py-1 bg-white rounded-md border border-[#EADBCE]">Private & Encrypted</span>
              </div>
            </div>

            {/* Direct URL Input (GitHub or Figma) */}
            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-xs">
              <label className="block text-xs font-mono text-[#78716C] mb-2">
                OR CONNECT VIA REPOSITORY / FIGMA URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://github.com/username/project or Figma link"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg focus:outline-none focus:border-[#C85A32] text-[#1C1917]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => startAnalysis(0)}
                  disabled={isAnalyzing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#C85A32] rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  Analyze Repo
                </button>
              </div>
            </div>

            {/* Quick-Test Real Project Blueprints */}
            <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#78716C]">
                  PRE-LOADED CANDIDATE ARTIFACTS (ONE-CLICK SIMULATION)
                </span>
                <span className="text-xs font-mono text-[#C85A32]">Select to test</span>
              </div>

              <div className="space-y-2.5">
                {PRESET_SAMPLE_PROJECTS.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedPreset(idx);
                      setProjectTitle(sample.title);
                      startAnalysis(idx);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedPreset === idx
                        ? 'bg-[#F5EFEB] border-[#C85A32]'
                        : 'bg-[#FAF7F2] border-[#EADBCE] hover:border-[#D8C5B3]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#1C1917]">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-0.5">
                        {sample.format} · {sample.fileCount} files · {sample.skillsCount} skills detected
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C85A32]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Live Parsing Sequence / Extracted Evidence Cards (6 cols) */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-8 rounded-3xl border border-[#EADBCE] shadow-xs min-h-[520px] flex flex-col justify-between">
            {/* Header */}
            <div className="pb-5 border-b border-[#EADBCE] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#78716C]">REAL-TIME AI EVIDENCE RUNTIME</span>
                <h3 className="text-xl font-display font-bold text-[#1C1917] mt-0.5">
                  {isAnalyzing
                    ? 'Extracting Demonstrated Skills...'
                    : extractedProject
                    ? 'Extracted Skill Evidence'
                    : 'Awaiting Work Artifact'}
                </h3>
              </div>

              {extractedProject && (
                <span className="px-2.5 py-1 text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Evidence</span>
                </span>
              )}
            </div>

            {/* State A: Analyzing Animation */}
            {isAnalyzing && (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-20 h-20">
                  <div className="w-20 h-20 rounded-full border-4 border-[#EADBCE] border-t-[#C85A32] animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#C85A32] animate-pulse" />
                </div>

                <div className="space-y-2 max-w-sm">
                  <div className="text-sm font-display font-bold text-[#1C1917]">
                    {analysisStage === 1 && '1/4 Parsing File Structure & AST Syntax...'}
                    {analysisStage === 2 && '2/4 Identifying Architectural & Engineering Patterns...'}
                    {analysisStage === 3 && '3/4 Calculating Explainable Skill Points...'}
                    {analysisStage === 4 && '4/4 Unlocking Verified Badges & Proof Hashes...'}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    Scanning modules, analyzing commit frequency, verifying test suites, and extracting concrete evidence lines.
                  </p>
                </div>
              </div>
            )}

            {/* State B: Results Display */}
            {!isAnalyzing && extractedProject && (
              <div className="py-4 space-y-5 flex-1">
                {/* Project Summary Banner */}
                <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EADBCE] flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#78716C] mb-1">
                      {extractedProject.workType} · {extractedProject.format}
                    </div>
                    <div className="text-sm font-display font-bold text-[#1C1917]">
                      {extractedProject.title}
                    </div>
                    <p className="text-xs text-[#57534E] mt-1">
                      {extractedProject.summary}
                    </p>
                  </div>
                  <div className="text-right pl-4">
                    <div className="text-xl font-display font-extrabold text-[#C85A32] tabular-nums">
                      +{extractedProject.totalPoints}
                    </div>
                    <div className="text-[10px] font-mono text-[#78716C]">
                      Skill Pts
                    </div>
                  </div>
                </div>

                {/* Detected Skills Breakdown */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716C] mb-3">
                    <span>DEMONSTRATED SKILLS & CALCULATED EVIDENCE</span>
                    <span>Click skill for proof formula</span>
                  </div>

                  <div className="space-y-2.5">
                    {extractedProject.detectedSkills.map((skill) => (
                      <div
                        key={skill.id}
                        onClick={() => setSelectedEvidenceForDetail(skill)}
                        className="p-3.5 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] hover:border-[#C85A32] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1C1917] group-hover:text-[#C85A32] transition-colors">
                              {skill.skillName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#EADBCE] rounded text-[#78716C]">
                              {skill.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#1C1917] tabular-nums">
                              {skill.points} pts
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#78716C] group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                          {skill.evidenceSummary}
                        </p>

                        <div className="mt-2 text-[11px] font-mono text-[#78716C] flex items-center gap-1.5">
                          <span className="text-[#C85A32]">Evidence File:</span>
                          <span className="truncate">{skill.proofDetails.fileLocation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges Unlocked in this Submission */}
                <div className="pt-2">
                  <div className="text-xs font-mono text-[#78716C] mb-2">
                    BADGES UNLOCKED THROUGH THIS ARTIFACT
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-xs font-mono bg-[#F5EFEB] border border-[#EADBCE] rounded-lg text-[#1C1917] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Type-Safe Architect (Gold)</span>
                    </span>
                    <span className="px-3 py-1.5 text-xs font-mono bg-[#F5EFEB] border border-[#EADBCE] rounded-lg text-[#1C1917] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>High-Integrity Testing (Silver)</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* State C: Empty Placeholder */}
            {!isAnalyzing && !extractedProject && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#78716C]">
                  <FileCode className="w-6 h-6" />
                </div>
                <div className="text-sm font-display font-semibold text-[#1C1917]">
                  No work uploaded yet
                </div>
                <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                  Drag and drop files or choose one of the sample blueprints on the left to watch how AI extracts verifiable proof of skill.
                </p>
                <button
                  type="button"
                  onClick={() => startAnalysis(0)}
                  className="px-4 py-2 text-xs font-semibold bg-[#C85A32] text-white rounded-lg hover:bg-[#B24B25] transition-colors cursor-pointer"
                >
                  Test Sample Extraction
                </button>
              </div>
            )}

            {/* Footer Action Bar */}
            {extractedProject && (
              <div className="pt-5 border-t border-[#EADBCE] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-[#78716C]">
                  Hash: {extractedProject.verificationHash}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startAnalysis(0)}
                    className="px-3 py-2 text-xs font-mono text-[#57534E] hover:text-[#1C1917] border border-[#EADBCE] rounded-lg transition-colors cursor-pointer"
                  >
                    Re-Analyze
                  </button>
                  <button
                    onClick={onViewProfile}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#C85A32] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View in My Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Point Calculation Deep-Dive Modal */}
      <AnimatePresence>
        {selectedEvidenceForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white border border-[#EADBCE] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-[#C85A32] mb-1">
                    EXPLAINABLE SKILL EVIDENCE AUDIT
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#1C1917]">
                    {selectedEvidenceForDetail.skillName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-display font-extrabold text-[#C85A32] tabular-nums">
                    {selectedEvidenceForDetail.points}
                  </span>
                  <span className="text-xs text-[#78716C] font-mono block">/ 100 max</span>
                </div>
              </div>

              {/* Concrete Proof Details */}
              <div className="bg-[#F5EFEB] p-4 rounded-xl border border-[#EADBCE] space-y-2">
                <div className="text-xs font-mono text-[#78716C]">CONCRETE AST / SYNTAX PATTERN DETECTED</div>
                <div className="text-xs font-mono font-medium text-[#1C1917] bg-white p-3 rounded-lg border border-[#EADBCE]">
                  {selectedEvidenceForDetail.proofDetails.astOrPatternEvidence}
                </div>
                <div className="text-[11px] font-mono text-[#78716C]">
                  Location: {selectedEvidenceForDetail.proofDetails.fileLocation}
                </div>
              </div>

              {/* Point Calculation Rubric Breakdown */}
              <div>
                <div className="text-xs font-mono text-[#78716C] mb-3">
                  HOW THE {selectedEvidenceForDetail.points} POINTS WERE CALCULATED
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono p-2 bg-[#FAF7F2] rounded-lg">
                    <span>Architectural Complexity (Max 30)</span>
                    <span className="font-bold text-[#1C1917]">
                      {selectedEvidenceForDetail.proofDetails.calculationFormula.architecturalComplexity} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono p-2 bg-[#FAF7F2] rounded-lg">
                    <span>Best Practices & Testing (Max 25)</span>
                    <span className="font-bold text-[#1C1917]">
                      {selectedEvidenceForDetail.proofDetails.calculationFormula.bestPracticesAndTesting} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono p-2 bg-[#FAF7F2] rounded-lg">
                    <span>Problem Solving Depth (Max 25)</span>
                    <span className="font-bold text-[#1C1917]">
                      {selectedEvidenceForDetail.proofDetails.calculationFormula.problemSolvingDepth} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono p-2 bg-[#FAF7F2] rounded-lg">
                    <span>Documentation & Git Hygiene (Max 20)</span>
                    <span className="font-bold text-[#1C1917]">
                      {selectedEvidenceForDetail.proofDetails.calculationFormula.documentationAndGit} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EADBCE] flex justify-end">
                <button
                  onClick={() => setSelectedEvidenceForDetail(null)}
                  className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-white rounded-lg hover:bg-[#C85A32] transition-colors cursor-pointer"
                >
                  Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
