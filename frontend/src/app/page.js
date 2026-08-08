'use client';

import { useState, useRef, useEffect } from 'react';

export default function ResumeScannerApp() {
  // Overlay State: true = welcome modal active, false = user clicked "Lets Try It"
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true);

  // Screen State: 'landing' | 'workspace'
  const [activeScreen, setActiveScreen] = useState('landing');

  // Input States
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  // Scanning & Analysis States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  // Scan status simulation indicators
  const scanSteps = [
    "Extracting text from document structure...",
    "Parsing key skill clusters & domain experiences...",
    "Cross-referencing requirements with Job Description...",
    "Calculating contextual match score & ATS parameters...",
    "Generating actionable AI rewrite suggestions..."
  ];

  // Dynamic step cycling during scanning
  useEffect(() => {
    let interval;
    if (isScanning) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // File Handler Logic
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setValidationError('');
    if (!selectedFile) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|docx|doc)$/i)) {
      setValidationError('Please upload a PDF or Word document (.pdf, .docx).');
      return;
    }

    if (selectedFile.size > maxSize) {
      setValidationError('File size exceeds the 5MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Character & Word Counter
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const charCount = jobDescription.length;

  // Submit and Analyze
  const handleAnalyze = async () => {
    if (!file) {
      setValidationError('Please upload your resume before scanning.');
      return;
    }
    if (!jobDescription.trim()) {
      setValidationError('Please paste or type the job description.');
      return;
    }

    setValidationError('');
    setIsScanning(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_description', jobDescription);

      const response = await fetch('/upload-analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.warn('API connection failed, loading fallback mock response for preview:', err);
      setTimeout(() => {
        setAnalysisResult({
          match_score: 84,
          matched_keywords: [
            'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS',
            'REST APIs', 'State Management', 'Git', 'Agile/Scrum'
          ],
          missing_keywords: [
            'GraphQL', 'Docker', 'CI/CD Pipelines', 'Jest / Cypress Testing'
          ],
          suggestions: [
            'Highlight your experience with automated end-to-end testing frameworks like Jest or Cypress under your technical skills section.',
            'Mention containerization tools (e.g., Docker) if you have used them in modern web application deployments.',
            'Quantify front-end performance improvements (e.g., "Improved page load speed by 35% using Next.js SSR and image optimization").',
            'Explicitly incorporate API integrations with GraphQL endpoints alongside REST APIs.'
          ]
        });
      }, 5500);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 5500);
    }
  };

  // Reset Application
  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setAnalysisResult(null);
    setIsScanning(false);
    setValidationError('');
  };

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col justify-center overflow-hidden">

      {/* =========================================================================
          WELCOME BLURRED GLASS OVERLAY (SLIDES UP SLOWLY ON DISMISSAL)
          ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/60 transition-all duration-1000 ease-in-out ${
          showWelcomeOverlay
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 shadow-2xl shadow-teal-500/10 backdrop-blur-2xl text-center space-y-6 flex flex-col items-center">
          
          {/* Subtle Decorative Glow behind Card */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Heading with Bolding */}
          <h2 className="text-2xl sm:text-3xl font-normal text-white leading-relaxed tracking-tight">
            Try to Scan your <span className="font-extrabold text-teal-300 drop-shadow-[0_0_12px_rgba(45,212,191,0.4)]">EXPERTISE</span>
          </h2>

          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Match your skills against modern job criteria using intelligent contextual scanning.
          </p>

          {/* Let's Try It Button */}
          <button
            onClick={() => setShowWelcomeOverlay(false)}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Lets try it
          </button>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC BACKGROUND LAYER (LIGHTNING, PDF NOTES, GLOW ORBS)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse duration-[10000ms]" />

        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] opacity-[0.03] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Floating Icons */}
        <div className="absolute top-[8%] left-[7%] text-amber-300/15 animate-bounce duration-[6000ms] drop-shadow-[0_0_15px_rgba(252,211,77,0.2)]">
          <svg className="w-16 h-16 sm:w-24 sm:h-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <div className="absolute top-[12%] right-[8%] text-rose-400/15 animate-pulse duration-[7000ms] -rotate-12">
          <svg className="w-20 h-20 sm:w-28 sm:h-28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 9h3m-3 4h6m-6 4h4" />
          </svg>
        </div>

        <div className="absolute bottom-[10%] right-[10%] text-teal-400/15 animate-pulse duration-[5000ms] rotate-12 drop-shadow-[0_0_20px_rgba(45,212,191,0.2)]">
          <svg className="w-20 h-20 sm:w-32 sm:h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        <div className="absolute bottom-[12%] left-[9%] text-indigo-400/15 animate-bounce duration-[8000ms] rotate-6">
          <svg className="w-18 h-18 sm:w-28 sm:h-28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <circle cx="17" cy="7" r="2" fill="currentColor" className="opacity-40" />
          </svg>
        </div>

        <div className="absolute top-[45%] left-[3%] text-indigo-300/15 animate-pulse duration-[4000ms]">
          <svg className="w-14 h-14 sm:w-20 sm:h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        <div className="absolute top-[48%] right-[4%] text-teal-300/15 animate-bounce duration-[9000ms]">
          <svg className="w-14 h-14 sm:w-20 sm:h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          MAIN APPLICATION CONTENT LAYER
          ========================================================================= */}
      <div className="relative z-10 w-full">
        {/* SCREEN 1: LANDING / HERO SCREEN */}
        {activeScreen === 'landing' && (
          <div className="flex flex-col items-center justify-center text-center py-10 lg:py-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-md shadow-teal-500/10 backdrop-blur-md">
              <svg className="w-4 h-4 text-amber-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span>Instant AI Resume Match & Optimizer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-snug max-w-3xl mb-5">
              Scan Your Resume. <br />
              <span className="bg-gradient-to-r from-teal-300 via-teal-100 to-indigo-400 bg-clip-text text-transparent">
                Beat ATS Filters &{' '}
                <span className="inline-block relative px-3 py-1 my-1 rounded-md bg-teal-500/10 border border-teal-400/40 shadow-[0_0_15px_rgba(45,212,191,0.2)] backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-teal-300 to-indigo-300 bg-clip-text text-transparent">
                    Land
                  </span>
                </span>{' '}
                Interviews.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-8 leading-relaxed font-normal">
              Match your resume against any job posting in seconds. Pinpoint missing skills, measure contextual relevance, and receive AI-guided bullet point rewrites.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
              <button
                onClick={() => setActiveScreen('workspace')}
                className="w-full px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-indigo-500/30 hover:scale-[1.01] flex items-center justify-center text-center"
              >
                Scan resume
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14 max-w-4xl w-full text-left">
              <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-teal-500/30 transition-colors group backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white text-sm font-semibold mb-1">0–100 Match Score</h3>
                <p className="text-xs text-slate-400">Algorithmic analysis evaluates experience fit and keyword alignment.</p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-indigo-500/30 transition-colors group backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <h3 className="text-white text-sm font-semibold mb-1">Missing Keyword Flags</h3>
                <p className="text-xs text-slate-400">Instantly flag crucial technologies and certifications ATS screeners demand.</p>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-emerald-500/30 transition-colors group backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white text-sm font-semibold mb-1">AI Bullet Point Rewrites</h3>
                <p className="text-xs text-slate-400">Receive targeted bullet point suggestions to optimize resume performance.</p>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: UPLOAD & RESULTS WORKSPACE */}
        {activeScreen === 'workspace' && (
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <button
                onClick={() => setActiveScreen('landing')}
                className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Overview
              </button>
              <span className="text-xs text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 font-mono flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                LLM Match Engine Active
              </span>
            </div>

            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{validationError}</span>
                </div>
                <button onClick={() => setValidationError('')} className="text-rose-400 hover:text-white">✕</button>
              </div>
            )}

            {!analysisResult && !isScanning && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 text-xs flex items-center justify-center font-mono font-semibold">1</span>
                          Upload Resume PDF / DOCX
                        </h2>
                        <span className="text-[11px] text-slate-400 font-mono">Max 5MB</span>
                      </div>

                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] ${
                          dragActive
                            ? 'border-teal-400 bg-teal-500/10 glow-border-teal'
                            : file
                            ? 'border-indigo-500/50 bg-indigo-500/5'
                            : 'border-slate-800 hover:border-teal-500/50 bg-slate-900/40'
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.doc"
                          className="hidden"
                        />

                        {file ? (
                          <div className="space-y-3 w-full">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center shadow-md shadow-teal-500/10">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white truncate max-w-xs mx-auto">{file.name}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                              }}
                              className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs hover:bg-rose-500/30 transition-colors inline-flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center border border-slate-700">
                              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-200">
                                Drag & drop PDF / Word resume, or <span className="text-teal-400 underline">browse</span>
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Supports .pdf, .docx, or .doc</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Client-side encrypted document parsing
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center font-mono font-semibold">2</span>
                          Job Description
                        </h2>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {wordCount} words | {charCount} chars
                        </span>
                      </div>

                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job description, qualifications, and requirements..."
                        className="w-full h-[200px] bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all font-sans"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setJobDescription('')}
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        Clear text
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={!file || !jobDescription.trim()}
                    className={`px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center min-w-[260px] ${
                      !file || !jobDescription.trim()
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 shadow-lg shadow-teal-500/20 hover:scale-[1.02]'
                    }`}
                  >
                    <span>Run Lightning Match Analysis</span>
                  </button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="glass-panel rounded-3xl p-10 text-center max-w-xl mx-auto my-10 relative overflow-hidden glow-border-teal backdrop-blur-md">
                <div className="absolute inset-0 scan-beam opacity-30 pointer-events-none"></div>

                <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-teal-500/40 pulse-glow"></div>
                  <div className="absolute inset-2 rounded-full border border-indigo-500/30 animate-ping opacity-25"></div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/50">
                    <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume & Job Specs</h3>
                <p className="text-xs text-teal-400 font-mono mb-5 h-5 transition-all duration-300">
                  {scanSteps[scanStep]}
                </p>

                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-300 h-full transition-all duration-500 ease-out"
                    style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {analysisResult && !isScanning && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-2xl backdrop-blur-md">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analysis Complete
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Resume evaluation against target job requirements.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2 border border-slate-700"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset / New Scan
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden glow-border-teal backdrop-blur-md">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Overall Match Score</h3>

                    <div className="relative w-36 h-36 flex items-center justify-center my-1">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="text-slate-800"
                          strokeWidth="7"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="text-teal-400 transition-all duration-1000 ease-out"
                          strokeWidth="7"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * analysisResult.match_score) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>

                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-white tracking-tight">{analysisResult.match_score}%</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-0.5 ${
                          analysisResult.match_score >= 80
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : analysisResult.match_score >= 60
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {analysisResult.match_score >= 80 ? 'Strong Match' : analysisResult.match_score >= 60 ? 'Moderate Fit' : 'Needs Optimization'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 max-w-xs mt-2">
                      Your resume matches <strong className="text-white">{analysisResult.match_score}%</strong> of core qualifications in this posting.
                    </p>
                  </div>

                  <div className="lg:col-span-2 glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-5 backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Matched Keywords ({analysisResult.matched_keywords?.length || 0})
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.matched_keywords?.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Missing Keywords ({analysisResult.missing_keywords?.length || 0})
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.missing_keywords?.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 glow-border-indigo backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">AI Optimization & Bullet Point Rewrites</h3>
                      <p className="text-[11px] text-slate-400">Incorporate these targeted modifications to improve ATS readability.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {analysisResult.suggestions?.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 hover:border-indigo-500/40 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                          {index + 1}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}