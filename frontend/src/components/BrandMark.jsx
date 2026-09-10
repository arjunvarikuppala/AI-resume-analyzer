import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const BrandMark = ({ compact = false, light = false, to = "/" }) => {
  const eyebrowClassName = light ? "text-indigo-200" : "text-indigo-600";
  const titleClassName = light ? "text-white" : "text-slate-900";

  return (
    <Link className="group inline-flex items-center gap-3" to={to}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
        <Sparkles className="h-5 w-5" />
      </div>

      <span className="flex flex-col">
        <span className={`text-[10px] font-extrabold uppercase tracking-[0.25em] ${eyebrowClassName}`}>
          Career AI Platform
        </span>
        <span className={`text-base font-extrabold tracking-tight sm:text-lg ${titleClassName}`}>
          {compact ? "ResumeAI" : "AI Resume Analyzer"}
        </span>
      </span>
    </Link>
  );
};

export default BrandMark;
