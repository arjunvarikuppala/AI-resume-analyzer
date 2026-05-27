import { Link } from "react-router-dom"

import ProductPreviewCard from "../components/ProductPreviewCard"
import PublicHeader from "../components/PublicHeader"
import { useAuthStore } from "../stores/authStore"

const heroMetrics = [
  { label: "Checks", value: "19+" },
  { label: "File types", value: "PDF, DOCX" },
  { label: "History", value: "Saved per account" },
]

const featureCards = [
  {
    title: "ATS-ready checks",
    copy: "Review structure and keyword signals before a recruiter or parser sees the file.",
  },
  {
    title: "Practical feedback",
    copy: "Focus on missing skills, wording issues, and section gaps without digging through noise.",
  },
  {
    title: "Version history",
    copy: "Keep earlier analyses available so improvements stay visible across multiple drafts.",
  },
]

const workflowSteps = [
  {
    title: "Upload a resume",
    copy: "Start with a PDF or DOCX file and let the app extract the content automatically.",
  },
  {
    title: "Read the results",
    copy: "See the scores, missing skills, writing issues, and formatting feedback in one place.",
  },
  {
    title: "Revise and compare",
    copy: "Upload the next version later and compare how the resume improves over time.",
  },
]

const LandingPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="site-shell min-h-screen pb-14">
      <PublicHeader />

      <main>
        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
          <div className="relative grid items-center gap-10 lg:grid-cols-[0.94fr_1.06fr]">
            <div className="space-y-8">
              <span className="pill !border-emerald-200/70 !bg-emerald-50/80 !text-emerald-700">
                Production-ready resume review
              </span>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-semibold text-ink sm:text-6xl lg:text-[4.7rem]">
                  Check resume quality before you apply.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  AI Resume Analyzer gives you a simple review of ATS fit, structure, spelling,
                  grammar, and skill coverage so the next revision is easier to make.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="button-primary" to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Open my dashboard" : "Start free analysis"}
                </Link>
                <a className="button-secondary" href="#workflow">
                  See the workflow
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="stat-chip">
                    <p className="text-lg font-bold text-ink">{metric.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="marketing-card max-w-2xl p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-ink">
                      Upload once, get clear next steps.
                    </h2>
                    <p className="max-w-xl text-sm leading-7 text-slate-600">
                      Use the secure dashboard to upload a resume, review the analysis, and return
                      later with a better version.
                    </p>
                  </div>

                  <Link className="button-primary whitespace-nowrap" to={isAuthenticated ? "/dashboard" : "/login"}>
                    {isAuthenticated ? "Upload now" : "Sign in to upload"}
                  </Link>
                </div>
              </div>
            </div>

            <ProductPreviewCard />
          </div>
        </section>

        <section id="product" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <p className="section-title">Features</p>
            <h2 className="text-4xl font-semibold text-ink sm:text-5xl">
              Simple pages, useful feedback, real workflow.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              The app is designed to stay straightforward while still giving enough detail to
              improve a resume with confidence.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map((card, index) => (
              <article key={card.title} className="feature-card">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
                  0{index + 1}
                </span>
                <h2 className="mt-5 text-2xl font-semibold text-ink">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              <p className="section-title">Workflow</p>
              <h2 className="max-w-2xl text-4xl font-semibold text-ink sm:text-5xl">
                Built for quick iterations instead of one-off uploads.
              </h2>
              <p className="max-w-xl text-base leading-8 text-slate-600">
                The product flow is designed to help you upload, review, adjust, and upload again
                without losing track of how the resume improved over time.
              </p>
            </div>

            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <article key={step.title} className="timeline-step">
                  <div className="timeline-number">0{index + 1}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="cta-band overflow-hidden rounded-[30px] px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="section-title !text-white/[0.55]">Start refining</p>
                <h2 className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
                  Ready to review your next resume?
                </h2>
                <p className="max-w-2xl text-base leading-8 text-white/[0.72]">
                  Create an account, upload a file, and use the saved analysis history to keep each
                  new version more intentional than the last one.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="button-secondary !border-white/[0.15] !bg-white/10 !text-white" to={isAuthenticated ? "/dashboard" : "/login"}>
                  {isAuthenticated ? "View dashboard" : "Log in"}
                </Link>
                <Link className="rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5" to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Upload another resume" : "Create account"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
