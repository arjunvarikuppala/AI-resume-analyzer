import { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  FileText, 
  Layers, 
  TrendingUp, 
  BrainCircuit, 
  Check, 
  ArrowRight 
} from "lucide-react";

const previewTabs = [
  { id: "score", label: "Executive Score" },
  { id: "ats", label: "ATS Keywords" },
  { id: "writing", label: "Impact Fixes" },
];

const ProductPreviewCard = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState("score");

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition hover:shadow-indigo-500/10 lg:p-8">
      {/* Decorative gradient blur */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/15 to-sky-400/15 blur-3xl pointer-events-none" />

      {/* Top Bar simulating a modern macOS / SaaS window */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-400/80" />
          <div className="h-3 w-3 rounded-full bg-amber-400/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-xs text-slate-400 font-semibold">senior_fullstack_resume.pdf</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Audit Complete</span>
        </div>
      </div>

      {/* Interactive Tab Switcher */}
      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/60">
        {previewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === tab.id
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "score" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Score Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Overall</span>
                <p className="mt-1 text-3xl font-black text-indigo-900">88<span className="text-xs text-indigo-500 font-medium">/100</span></p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">ATS Pass</span>
                <p className="mt-1 text-3xl font-black text-emerald-900">92<span className="text-xs text-emerald-500 font-medium">%</span></p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Formatting</span>
                <p className="mt-1 text-3xl font-black text-sky-900">95<span className="text-xs text-sky-500 font-medium">%</span></p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Impact</span>
                <p className="mt-1 text-3xl font-black text-amber-900">74<span className="text-xs text-amber-500 font-medium">%</span></p>
              </div>
            </div>

            {/* Quick Summary list */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>AI Executive Feedback:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Resume has strong technical coverage with React, Node.js, and AWS. Quantifying performance metrics in your recent role will push score past 95+.
              </p>
            </div>
          </div>
        )}

        {activeTab === "ats" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Detected ATS Keywords (Matched 14/16)
              </span>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["TypeScript", "React 19", "Microservices", "Docker", "REST API", "Tailwind CSS", "MongoDB"].map((kw) => (
                  <span key={kw} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/80 shadow-xs">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Recommended Keywords to Add
              </span>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["CI/CD Pipelines", "System Design", "Kubernetes"].map((kw) => (
                  <span key={kw} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 shadow-xs">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "writing" && (
          <div className="space-y-3 animate-fadeIn text-xs">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">Weak Bullet</span>
                <span className="text-slate-400">Before</span>
              </div>
              <p className="text-slate-500 line-through">"Responsible for building frontend features and fixing bugs."</p>
              
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">AI Improved</span>
                <span className="text-emerald-600 font-bold">High Impact</span>
              </div>
              <p className="text-slate-800 font-medium">"Architected 12+ responsive React workflows, slashing page load times by 38% for 45k monthly active users."</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Pill / Guarantee */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <BrainCircuit className="h-4 w-4 text-indigo-600" /> Powered by Gemini Flash 1.5 AI
        </span>
        <span className="font-semibold text-indigo-600">Takes &lt; 5 seconds</span>
      </div>
    </section>
  );
};

export default ProductPreviewCard;
