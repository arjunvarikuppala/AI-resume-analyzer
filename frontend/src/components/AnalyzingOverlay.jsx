import { useEffect, useState, useRef } from "react";
import { useResumeStore } from "../stores/resumeStore";

const STATUS_MESSAGES = [
  { threshold: 0, text: "Uploading resume document..." },
  { threshold: 15, text: "Parsing text & layout structure..." },
  { threshold: 40, text: "Identifying key sections & credentials..." },
  { threshold: 65, text: "Evaluating skills against ATS standards..." },
  { threshold: 85, text: "Synthesizing scores & recommendations..." },
  { threshold: 98, text: "Finalizing report..." }
];

const AnalyzingOverlay = () => {
  const uploading = useResumeStore((state) => state.uploading);
  const dashboardError = useResumeStore((state) => state.dashboardError);
  const latestResume = useResumeStore((state) => state.latestResume);

  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiCompleted, setApiCompleted] = useState(false);

  const progressRef = useRef(0);
  const apiCompletedRef = useRef(false);
  const timerRef = useRef(null);

  // Sync refs to avoid stale closures in intervals
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    apiCompletedRef.current = apiCompleted;
  }, [apiCompleted]);

  // Sync upload/error states to show/hide overlay and mark API completion
  useEffect(() => {
    if (uploading) {
      setShowOverlay(true);
      setProgress(0);
      setApiCompleted(false);
    } else {
      if (dashboardError) {
        // Abort overlay immediately if there is a dashboard error
        setShowOverlay(false);
      } else if (showOverlay) {
        setApiCompleted(true);
      }
    }
  }, [uploading, dashboardError]);

  // Manage progress animation timer based on showOverlay state
  useEffect(() => {
    if (!showOverlay) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const curProgress = progressRef.current;
      const isApiDone = apiCompletedRef.current;

      if (curProgress >= 100) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        return;
      }

      if (isApiDone) {
        // Rapidly accelerate progress to 100% since API is done
        setProgress((prev) => Math.min(100, prev + 12.0));
      } else if (curProgress < 98) {
        // Increment progress smoothly (takes ~7.5 seconds to reach 98%)
        const increment = 0.5 + Math.random() * 0.6; // 0.5% - 1.1% per tick
        setProgress((prev) => Math.min(98, prev + increment));
      }
    }, 60);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showOverlay]);

  // Wait 2.0 seconds at 100% to display the success state before closing
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!showOverlay) return null;

  // Determine active status message based on current progress
  let activeMessage = "Analyzing resume...";
  for (let i = STATUS_MESSAGES.length - 1; i >= 0; i--) {
    if (progress >= STATUS_MESSAGES[i].threshold) {
      activeMessage = STATUS_MESSAGES[i].text;
      break;
    }
  }

  if (progress >= 98 && !apiCompleted) {
    activeMessage = "Compiling recommendations... almost ready...";
  } else if (progress >= 100) {
    const scoreVal = latestResume?.atsScore;
    activeMessage = scoreVal !== undefined
      ? `Analysis complete! ATS Score: ${scoreVal}%`
      : "Analysis complete! Loading dashboard...";
  }

  // SVG parameters for radial progress circle
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-white overflow-hidden"
      style={{ backgroundColor: "#102033" }}
    >
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.08); }
        }
        .bg-glow {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(143, 214, 196, 0.18) 0%, transparent 70%);
          filter: blur(25px);
          animation: pulse-glow 4s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Subtle ambient glowing background aura */}
      <div className="bg-glow" />

      <div className="flex flex-col items-center gap-8 relative z-10">
        
        {/* Radial progress ring container */}
        <div className="relative flex items-center justify-center">
          <svg className="h-[200px] w-[200px] -rotate-90">
            {/* Background tracking track circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-white/10"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active glowing progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-mint transition-all duration-100 ease-out"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                stroke: "#8fd6c4",
                filter: "drop-shadow(0px 0px 8px rgba(143, 214, 196, 0.75))",
              }}
            />
          </svg>

          {/* Central progress numbers / checkmark icon */}
          <div className="absolute flex flex-col items-center justify-center">
            {progress < 100 ? (
              <>
                <span className="text-4xl font-bold tracking-tight text-white font-display">
                  {Math.round(progress)}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                  Analyzing
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center animate-pulse">
                <span className="text-4xl font-extrabold tracking-tight text-[#8fd6c4] font-display">
                  {latestResume?.atsScore !== undefined ? `${latestResume.atsScore}%` : "100%"}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 mt-1">
                  ATS Score
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Assessment titles & dynamic helper subtitles */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white font-display tracking-tight">
            {progress < 100 ? "AI Assessment in Progress" : "Success!"}
          </h2>
          <p className="text-sm font-semibold text-[#8fd6c4] animate-pulse transition-all duration-300">
            {activeMessage}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AnalyzingOverlay;
