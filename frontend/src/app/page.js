"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import {
  UploadCloud,
  FileText,
  ScanLine,
  Radar,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  ChevronDown,
  Loader2,
} from "lucide-react";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

function extFromName(name = "") {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
}

function bytesToSize(bytes = 0) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb > 999 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
}

// Try to pull structured keyword / remarks data out of whatever shape the API
// returns. Falls back gracefully so the UI never breaks on an unexpected payload.
function deriveKeywords(result) {
  if (!result) return { matched: [], missing: [] };
  const matched = result.matched_keywords || result.matchedKeywords || result.matched || [];
  const missing = result.missing_keywords || result.missingKeywords || result.missing || [];
  return {
    matched: Array.isArray(matched) ? matched : [],
    missing: Array.isArray(missing) ? missing : [],
  };
}

function deriveSuggestions(result) {
  const s = result?.suggestions || result?.remarks || result?.tips || [];
  return Array.isArray(s) ? s : s ? [s] : [];
}

function ScannerBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(94,234,212,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -left-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-teal-400/10 blur-[140px]" />
      <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-[140px]" />
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-300/60 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function ScoreDial({ value }) {
  const score = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone = score >= 75 ? "#5EEAD4" : score >= 45 ? "#FBBF24" : "#FB7185";

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="88"
          cy="88"
          r={radius}
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${tone}66)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`${mono.className} text-4xl font-medium text-white`}>{Math.round(score)}</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">ATS Match</span>
      </div>
    </div>
  );
}

// ---------- Landing card ----------
function LandingCard({ onContinue }) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-20"
    >
      {/* Dedicated glow sitting directly behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-[2rem] border border-white/15 bg-white/[0.07] px-12 py-14 text-center shadow-2xl backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-300/20 bg-teal-400/15">
          <Radar className="text-teal-300" size={28} />
        </div>
        <h1 className={`${display.className} mt-8 text-4xl font-semibold tracking-tight text-white`}>
          Resume Scanner
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-7 text-slate-400">
          Match your resume against any job description and get a clear,
          actionable ATS report in seconds.
        </p>
        <button
          onClick={onContinue}
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 py-3.5 text-[15px] font-medium text-slate-950 shadow-lg shadow-teal-500/20 transition-all duration-300 hover:shadow-teal-400/30 active:scale-[0.98]"
        >
          Continue
          <ArrowRight size={16} />
        </button>
        <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Free · No sign-up required
        </p>
      </motion.div>
    </motion.div>
  );
}

// ---------- Main workspace ----------
function Workspace({ onBack }) {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const inputRef = useRef(null);

  const { matched, missing } = useMemo(() => deriveKeywords(result), [result]);
  const suggestions = useMemo(() => deriveSuggestions(result), [result]);
  const canAnalyze = resume && jobDescription.trim() && !loading;

  const handleFile = (file) => {
    if (file) setResume(file);
  };

  const handleAnalyze = async () => {
    if (!resume) {
      alert("Please upload your resume.");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("http://127.0.0.1:8000/upload-analyze", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText);

      const data = JSON.parse(responseText);
      setResult(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="workspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-32 pt-10"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div
          className={`${mono.className} inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-teal-200`}
        >
          <Radar size={12} />
          Live scan
        </div>
      </div>

      {/* Main heading */}
      <div className="mx-auto mt-10 max-w-2xl text-center">
        <h1 className={`${display.className} text-4xl font-semibold tracking-tight text-white sm:text-[2.75rem]`}>
          Let's scan your resume
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7 text-slate-400">
          Upload your resume, paste the job description, and hit Analyze in the
          corner whenever you're ready.
        </p>
      </div>

      {/* Intake cards */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Upload card */}
        <div className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300/25 hover:bg-white/[0.05]">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/15">
              <UploadCloud className="text-teal-300" size={17} />
            </div>
            <h2 className="text-[15px] font-medium text-white">Your resume</h2>
          </div>

          {!resume ? (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
                dragActive
                  ? "scale-[1.01] border-teal-300 bg-teal-400/10"
                  : "border-white/15 hover:border-teal-300/50 hover:bg-white/[0.03]"
              }`}
            >
              <ScanLine
                size={36}
                className={`transition-transform duration-300 group-hover:scale-105 ${
                  dragActive ? "text-teal-300" : "text-slate-400"
                }`}
              />
              <p className="mt-4 text-sm font-medium text-white">Drop your resume here</p>
              <p className="mt-1 text-xs text-slate-400">or click to browse</p>
              <p className={`${mono.className} mt-4 text-[11px] tracking-wide text-slate-500`}>
                PDF · DOC · DOCX · TXT
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-1 items-center justify-between rounded-2xl border border-teal-400/25 bg-teal-400/[0.06] p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${mono.className} flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-[10px] font-medium text-teal-200`}
                >
                  {extFromName(resume.name)}
                </div>
                <div>
                  <p className="max-w-[200px] truncate text-sm font-medium text-white">{resume.name}</p>
                  <p className="text-xs text-slate-400">{bytesToSize(resume.size)}</p>
                </div>
              </div>
              <button
                onClick={() => setResume(null)}
                aria-label="Remove resume"
                className="rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Job description card */}
        <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300/25 hover:bg-white/[0.05]">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/15">
              <FileText className="text-teal-300" size={17} />
            </div>
            <h2 className="text-[15px] font-medium text-white">Job description</h2>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job posting here — the more complete it is, the sharper the match."
            className="w-full flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-teal-300/50 focus:bg-black/30 focus:ring-2 focus:ring-teal-300/25"
          />
          <p className={`${mono.className} mt-3 text-right text-[11px] text-slate-500`}>
            {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl"
          >
            {result.success === false ? (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5">
                <div className="mb-2 flex items-center gap-2 text-rose-300">
                  <AlertTriangle size={18} />
                  <h3 className="text-base font-medium">Scan failed</h3>
                </div>
                <pre className={`${mono.className} overflow-x-auto whitespace-pre-wrap text-xs text-rose-200`}>
                  {result.error}
                </pre>
              </div>
            ) : (
              <>
                <div className="mb-7 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/15">
                    <Radar className="text-teal-300" size={17} />
                  </div>
                  <h2 className="text-xl font-medium text-white">Scan report</h2>
                </div>

                <div className="grid gap-7 lg:grid-cols-[auto_1fr]">
                  <div className="flex justify-center">
                    <ScoreDial value={result.score} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {matched.length > 0 && (
                      <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.05] p-5">
                        <div className="mb-3 flex items-center gap-2 text-teal-300">
                          <CheckCircle2 size={15} />
                          <span className="text-xs font-medium uppercase tracking-wider">Matched keywords</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {matched.map((kw, i) => (
                            <span
                              key={`${kw}-${i}`}
                              className="rounded-full bg-teal-400/15 px-2.5 py-1 text-xs text-teal-200 transition-colors duration-200 hover:bg-teal-400/25"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {missing.length > 0 && (
                      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
                        <div className="mb-3 flex items-center gap-2 text-amber-300">
                          <AlertTriangle size={15} />
                          <span className="text-xs font-medium uppercase tracking-wider">Missing keywords</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {missing.map((kw, i) => (
                            <span
                              key={`${kw}-${i}`}
                              className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs text-amber-200 transition-colors duration-200 hover:bg-amber-400/25"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remarks / suggestion points */}
                    {suggestions.length > 0 && (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:col-span-2">
                        <div className="mb-3 flex items-center gap-2 text-slate-200">
                          <ClipboardList size={15} />
                          <span className="text-xs font-medium uppercase tracking-wider">Remarks & suggestions</span>
                        </div>
                        <ul className="space-y-2.5 text-sm leading-6 text-slate-300">
                          {suggestions.map((s, i) => (
                            <li key={i} className="flex gap-2.5">
                              <span className="mt-0.5 text-teal-300">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowRaw((v) => !v)}
                  className="mt-7 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 transition-colors duration-200 hover:text-slate-300"
                >
                  <ChevronDown size={13} className={`transition-transform duration-300 ${showRaw ? "rotate-180" : ""}`} />
                  {showRaw ? "Hide" : "View"} raw response
                </button>
                <AnimatePresence>
                  {showRaw && (
                    <motion.pre
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`${mono.className} mt-3 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-5 text-xs text-slate-400`}
                    >
                      {JSON.stringify(result, null, 2)}
                    </motion.pre>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Analyze button — bottom right */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: canAnalyze
            ? [
                "0 0 0px rgba(94,234,212,0.35)",
                "0 0 22px rgba(94,234,212,0.35)",
                "0 0 0px rgba(94,234,212,0.35)",
              ]
            : "none",
        }}
        transition={canAnalyze ? { boxShadow: { duration: 2.4, repeat: Infinity } } : {}}
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        whileHover={{ scale: canAnalyze ? 1.03 : 1 }}
        whileTap={{ scale: canAnalyze ? 0.97 : 1 }}
        className={`fixed bottom-7 right-7 z-20 flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors duration-300 ${
          canAnalyze
            ? "bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950"
            : "cursor-not-allowed bg-white/10 text-slate-500"
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            Analyze
            <ArrowRight size={16} />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

export default function Home() {
  const [stage, setStage] = useState("landing"); // "landing" | "workspace"

  return (
    <main
      className={`${display.variable} ${mono.variable} ${body.variable} ${body.className} relative min-h-screen w-full overflow-hidden bg-[#060911]`}
    >
      <ScannerBackdrop />
      <AnimatePresence mode="wait">
        {stage === "landing" ? (
          <LandingCard key="landing" onContinue={() => setStage("workspace")} />
        ) : (
          <Workspace key="workspace" onBack={() => setStage("landing")} />
        )}
      </AnimatePresence>
    </main>
  );
}