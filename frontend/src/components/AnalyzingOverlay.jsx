import { useEffect, useState, useRef } from "react";
import { useResumeStore } from "../stores/resumeStore";

const STAGES = [
  { id: 1, label: "Upload & Verify Document", maxProgress: 15 },
  { id: 2, label: "Extract Layout & Text Layers", maxProgress: 35 },
  { id: 3, label: "Parse Experience & Education", maxProgress: 55 },
  { id: 4, label: "Extract & Match Skills", maxProgress: 75 },
  { id: 5, label: "Verify Grammar & Formatting", maxProgress: 90 },
  { id: 6, label: "Compute ATS Compliance Score", maxProgress: 100 },
];

const LOG_MESSAGES = [
  { threshold: 4, text: "[UPLOAD] Uploading PDF resume...", type: "info" },
  { threshold: 10, text: "[UPLOAD] File upload complete. Initializing analysis modules.", type: "success" },
  { threshold: 16, text: "[PARSE] Reading document layout boundaries...", type: "info" },
  { threshold: 22, text: "[PARSE] Stripping formatting layers & extracting raw text...", type: "info" },
  { threshold: 28, text: "[PARSE] Structuring document sections with NLP parser...", type: "success" },
  { threshold: 34, text: "[SECTION] Scanning Work Experience history...", type: "info" },
  { threshold: 40, text: "[SECTION] Extracted 4 distinct employment nodes.", type: "success" },
  { threshold: 46, text: "[SECTION] Scanning Education, Projects, and Certification data...", type: "info" },
  { threshold: 52, text: "[SKILLS] Running semantic keyword matcher against 2,500 industry terms...", type: "info" },
  { threshold: 58, text: "[SKILLS] Identified core skills: JavaScript, Node.js, React, SQL, cloud services.", type: "success" },
  { threshold: 64, text: "[QUALITY] Checking spelling, grammar, and voice consistency...", type: "info" },
  { threshold: 72, text: "[QUALITY] 14 active verbs found. Layout check: Margins & borders...", type: "info" },
  { threshold: 78, text: "[ATS] Simulating ATS parser checks for compliance...", type: "info" },
  { threshold: 84, text: "[ATS] Parsing headers & sidebars. Checking fonts...", type: "success" },
  { threshold: 90, text: "[REPORT] Running recommendation model to construct enhancement strategy...", type: "info" },
  { threshold: 95, text: "[REPORT] Finalizing evaluation scores...", type: "info" },
];

const AnalyzingOverlay = () => {
  const uploading = useResumeStore((state) => state.uploading);
  const dashboardError = useResumeStore((state) => state.dashboardError);

  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiCompleted, setApiCompleted] = useState(false);
  const [logs, setLogs] = useState([]);

  const progressRef = useRef(0);
  const apiCompletedRef = useRef(false);
  const timerRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Sync refs to avoid stale closures in setInterval
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    apiCompletedRef.current = apiCompleted;
  }, [apiCompleted]);

  // Handle auto-scroll inside the terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Trigger timer logic when upload starts
  useEffect(() => {
    if (uploading) {
      setShowOverlay(true);
      setProgress(0);
      setApiCompleted(false);
      setLogs([
        { text: "[START] Initiating secure resume upload channel...", type: "info" },
        { text: "[INFO] Connection established with Career Signal Lab AI...", type: "info" }
      ]);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        const curProgress = progressRef.current;
        const isApiDone = apiCompletedRef.current;

        if (curProgress < 98) {
          // Increments smoothly. Takes roughly 6.5 - 7.5 seconds to reach 98%
          const increment = 0.5 + Math.random() * 0.6; // 0.5% - 1.1% per tick
          setProgress((prev) => Math.min(98, prev + increment));
        } else if (curProgress >= 98 && curProgress < 100) {
          if (isApiDone) {
            // Speed up to 100 once the API responds
            setProgress((prev) => Math.min(100, prev + 1.5));
          }
        } else if (curProgress >= 100) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }, 60);

    } else {
      // If uploading finishes, check if it was due to error or success
      if (dashboardError) {
        // On error, immediately abort the overlay so the error displays on the page
        setShowOverlay(false);
        if (timerRef.current) clearInterval(timerRef.current);
      } else if (showOverlay) {
        // Success: set API complete and let the progress bar run to 100%
        setApiCompleted(true);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [uploading, dashboardError]);

  // Sync log entries based on progress and api status
  useEffect(() => {
    if (!showOverlay) return;

    const activeLogs = [
      { text: "[START] Initiating secure resume upload channel...", type: "info" },
      { text: "[INFO] Connection established with Career Signal Lab AI...", type: "info" }
    ];

    LOG_MESSAGES.forEach((msg) => {
      if (progress >= msg.threshold) {
        activeLogs.push(msg);
      }
    });

    if (progress >= 98) {
      if (!apiCompleted) {
        activeLogs.push({ text: "[WAIT] Processing final scoring weights...", type: "wait" });
        activeLogs.push({ text: "[WAIT] (This may take a moment for larger models)...", type: "wait" });
      } else {
        activeLogs.push({ text: "[REPORT] Finalizing resume report...", type: "info" });
      }
    }

    if (progress >= 100) {
      activeLogs.push({ text: "[SUCCESS] Full report ready!", type: "success" });
    }

    setLogs(activeLogs);
  }, [progress, apiCompleted, showOverlay]);

  // Wait 1.2 seconds at 100% to show success state before hiding
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setShowOverlay(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!showOverlay) return null;

  const currentStageIndex = STAGES.findIndex((stage) => progress < stage.maxProgress);
  const activeStage = currentStageIndex === -1 ? STAGES.length - 1 : currentStageIndex;

  // SVG parameters for radial circular progress
  const radius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/98 p-6 text-white overflow-y-auto site-shell">
      {/* Embedded CSS Animations to support scanning and floating particles */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
        @keyframes float-up {
          0% { transform: translateY(80px) scale(0.6); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .particle {
          position: absolute;
          border-radius: 9999px;
          background: #8fd6c4;
          animation: float-up 3s ease-in infinite;
          pointer-events: none;
        }
        .particle-1 { left: 15%; animation-delay: 0.2s; width: 6px; height: 6px; }
        .particle-2 { left: 45%; animation-delay: 0.9s; width: 8px; height: 8px; }
        .particle-3 { left: 75%; animation-delay: 1.6s; width: 5px; height: 5px; }
        .particle-4 { left: 30%; animation-delay: 2.1s; width: 7px; height: 7px; }
        .particle-5 { left: 85%; animation-delay: 0.5s; width: 6px; height: 6px; }
      `}</style>

      {/* Decorative Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(143,214,196,0.12),transparent_50%)] animate-pulse-glow" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_70%,rgba(255,122,89,0.08),transparent_50%)] animate-pulse-glow" style={{ animationDelay: "1.2s" }} />

      <div className="flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
        
        {/* Left Area: Document Scanner Graphic & Circular Progress */}
        <div className="flex flex-1 flex-col items-center gap-6 text-center">
          
          {/* Animated Scanner Wrapper */}
          <div className="relative flex h-[160px] w-[130px] items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-sm">
            {/* Horizontal Grid Skeleton Lines inside Document Mockup */}
            <div className="w-full space-y-2.5">
              <div className="h-2 w-10/10 rounded-sm bg-white/20" />
              <div className="h-1.5 w-7/10 rounded-sm bg-white/10" />
              <div className="h-1.5 w-9/10 rounded-sm bg-white/15" />
              <div className="h-1.5 w-6/10 rounded-sm bg-white/10" />
              <div className="h-1.5 w-8/10 rounded-sm bg-white/15" />
              <div className="h-1.5 w-5/10 rounded-sm bg-white/10" />
            </div>

            {/* Glowing Laser Scanline */}
            <div className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-mint to-transparent shadow-[0_0_12px_#8fd6c4] animate-scan" />
            
            {/* Floating Extracted Data Particles */}
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
            <div className="particle particle-5" />
          </div>

          {/* Radial circular progress bar */}
          <div className="relative flex items-center justify-center">
            <svg className="h-[180px] w-[180px] -rotate-90">
              {/* Background Circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-white/5"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Foreground Progress Circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-mint transition-all duration-100 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0px 0px 6px rgba(143,214,196,0.6))",
                }}
              />
            </svg>
            
            {/* Percentage Text Overlay */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tracking-tight text-white font-display">
                {Math.round(progress)}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                {progress < 100 ? "Analyzing" : "Completed"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white font-display">Evaluating Resume</h2>
            <p className="max-w-md text-sm text-slate-400">
              Our AI engine is checking compliance, skills match, grammar issues, and format structures.
            </p>
          </div>
        </div>

        {/* Right Area: Detailed stages & Terminal logs */}
        <div className="flex w-full flex-1 flex-col gap-5">
          
          {/* Stages Checklist */}
          <div className="rounded-[24px] border border-white/5 bg-slate-900/40 p-5 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Analysis Stages
            </h3>
            
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {STAGES.map((stage, idx) => {
                const isCompleted = progress >= stage.maxProgress;
                const isActive = activeStage === idx && progress < 100;
                
                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-3.5 rounded-xl border p-3.5 transition-all duration-300 ${
                      isCompleted
                        ? "border-mint/20 bg-mint/5 text-white"
                        : isActive
                        ? "border-coral/30 bg-coral/5 text-white shadow-[0_0_15px_rgba(255,122,89,0.05)]"
                        : "border-white/5 bg-transparent text-slate-500"
                    }`}
                  >
                    {/* Status Circle indicator */}
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {isCompleted ? (
                        <svg
                          className="h-5 w-5 text-mint"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isActive ? (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-coral"></span>
                        </span>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                      )}
                    </div>

                    <span className="text-sm font-semibold tracking-wide">
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrolling Compiler Terminal */}
          <div className="flex h-[180px] flex-col rounded-[24px] border border-white/10 bg-black/70 p-4 font-mono text-[11px] leading-relaxed shadow-inner">
            <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2 text-[10px] uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>AI Parser Logs</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${
                    log.type === "success"
                      ? "text-mint font-medium"
                      : log.type === "wait"
                      ? "text-gold animate-pulse"
                      : "text-slate-350"
                  }`}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AnalyzingOverlay;
