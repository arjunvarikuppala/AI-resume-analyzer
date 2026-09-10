import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Target, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Users, 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  Compass,
  FileCheck2,
  Cpu,
  Layers
} from "lucide-react";

import ProductPreviewCard from "../components/ProductPreviewCard";
import PublicHeader from "../components/PublicHeader";
import { useAuthStore } from "../stores/authStore";

const heroMetrics = [
  { label: "Checks Per File", value: "24+ Metrics", icon: Target },
  { label: "Extraction Formats", value: "PDF & DOCX", icon: FileText },
  { label: "Dual Capabilities", value: "Applicant + Recruiter", icon: Users },
];

const featureCards = [
  {
    icon: Target,
    title: "ATS Compatibility Engine",
    copy: "Deep-scans headers, layout structures, and semantic keywords against real Applicant Tracking System scoring algorithms.",
    badge: "ATS Scored",
  },
  {
    icon: BrainCircuit,
    title: "AI Keyword & Skill Gap Matrix",
    copy: "Identifies essential hard and soft skills missing from your experience and suggests natural phrasing to close the gap.",
    badge: "Smart Diagnostics",
  },
  {
    icon: Building2,
    title: "Employer Talent Matching",
    copy: "Employers post jobs and let our semantic matching engine automatically rank and surface the top candidate resumes instantly.",
    badge: "Recruitment AI",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Upload Your Document",
    copy: "Drop your PDF or DOCX resume. Our high-precision parser extracts sections, dates, technologies, and achievements.",
  },
  {
    step: "02",
    title: "AI Deep Inspection",
    copy: "Gemini AI analyzes your bullet points, quantifies your impact, checks grammar/spelling, and grades ATS keyword density.",
  },
  {
    step: "03",
    title: "Apply Actionable Fixes",
    copy: "Revisit bullet point rewrites, add missing skills, tailor against target job descriptions, and watch your hiring rate climb.",
  },
];

const audiencePillars = [
  {
    role: "For Job Seekers",
    headline: "Land more interviews with a polished, parser-proof resume.",
    benefits: [
      "Instant ATS & readability score breakdown (0-100)",
      "Target Job Description matching for tailored applications",
      "Missing skill suggestions and bullet impact enhancements",
      "Saved history to benchmark revisions across drafts",
    ],
    cta: "Optimize My Resume",
    link: "/register",
    badge: "Candidate Toolkit",
  },
  {
    role: "For Employers & Recruiters",
    headline: "Source, rank, and hire top-tier candidates in minutes.",
    benefits: [
      "Create jobs with customizable required skill stacks",
      "Automated semantic candidate scoring against job specs",
      "One-click candidate shortlisting and direct resume review",
      "Ranked applicant leaderboards with match percentages",
    ],
    cta: "Start Hiring Faster",
    link: "/register",
    badge: "Recruiter Suite",
  },
];

const LandingPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const getDashboardLink = () => {
    if (!isAuthenticated) return "/register";
    return user?.role === "employer" ? "/employer" : "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-white text-slate-900 selection:bg-indigo-500 selection:text-white pb-16">
      <PublicHeader />

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
          {/* Subtle background glow */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-full max-w-4xl bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-emerald-100/40 blur-3xl pointer-events-none rounded-full" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Next-Gen AI Resume & Talent Intelligence</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                  Elevate your resume before <span className="gradient-text">recruiters review it.</span>
                </h1>
                <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
                  Instant ATS diagnostics, semantic keyword matching, impact phrase rewriting, and automated candidate ranking powered by modern AI.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition hover:scale-[1.02] hover:shadow-indigo-500/35"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Analysis"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#workflow"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Metric Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {heroMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 shadow-xs backdrop-blur-md flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{metric.value}</p>
                        <p className="text-[11px] font-medium text-slate-500 truncate">{metric.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Product Preview */}
            <div className="relative">
              <ProductPreviewCard />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1 text-xs font-bold text-indigo-700">
              <Cpu className="h-3.5 w-3.5" /> Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything needed to pass ATS screens & land offers.
            </h2>
            <p className="text-base text-slate-600">
              Traditional resume checks give vague advice. Our AI runs full semantic vector analysis to deliver deep, actionable improvements.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 border border-indigo-100 shadow-inner">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{card.copy}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-600 group cursor-pointer">
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Audience Split: Job Seeker vs Recruiter */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {audiencePillars.map((pillar) => (
              <div
                key={pillar.role}
                className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
                    {pillar.badge}
                  </span>
                  <h3 className="mt-4 text-2xl font-black text-slate-900">{pillar.role}</h3>
                  <p className="mt-2 text-sm text-slate-600">{pillar.headline}</p>

                  <div className="mt-6 space-y-3">
                    {pillar.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    to={pillar.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <span>{pillar.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step by Step Workflow */}
        <section id="workflow" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-slate-900 p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

            <div className="relative text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-300 border border-white/10">
                Simple 3-Step Iteration
              </span>
              <h2 className="text-3xl font-black sm:text-4xl">How AI Resume Analyzer Works</h2>
              <p className="text-slate-400 text-sm">
                Iterate, optimize, and submit applications with the confidence of an ATS-proven resume.
              </p>
            </div>

            <div className="relative grid gap-6 md:grid-cols-3">
              {workflowSteps.map((step) => (
                <div key={step.step} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="text-3xl font-black text-indigo-400 font-mono">{step.step}</div>
                  <h4 className="mt-4 text-xl font-bold text-white">{step.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to transform your job search?</h3>
              <p className="text-indigo-100 text-sm max-w-xl">
                Join thousands of candidates and recruiters using AI to match talent with ideal opportunities.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:scale-105"
              >
                {isAuthenticated ? "Open Workspace" : "Get Started Free"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pt-12 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} AI Resume Analyzer. Built for Job Seekers and High-Growth Teams.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
