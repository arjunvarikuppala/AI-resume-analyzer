const scoreItems = [
  { label: "Resume score", value: 88 },
  { label: "ATS score", value: 84 },
  { label: "Skill match", value: 76 },
  { label: "Formatting", value: 91 },
]

const ProductPreviewCard = ({ compact = false }) => (
  <section className={`preview-shell ${compact ? "p-5" : "p-6 sm:p-7"}`}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="section-title">Preview Analysis</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">Simple score summary</h3>
        <p className="mt-2 max-w-lg text-sm leading-7 text-slate-600">
          A clean view of the main resume signals with a few practical next steps.
        </p>
      </div>
      <span className="pill">Sample result</span>
    </div>

    <div className={`mt-6 grid gap-4 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
      {scoreItems.map((item) => (
        <div key={item.label} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-ink">{item.value}</p>
            </div>
            <span className="text-sm font-semibold text-emerald-600">Good</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    <div className={`mt-6 grid gap-4 ${compact ? "" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
      <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-5">
        <p className="text-sm font-semibold text-ink">What needs attention</p>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <li>Quantify project impact with outcomes or measurable results.</li>
          <li>Add missing role-specific skills where they are genuinely used.</li>
          <li>Tighten wording in longer bullet points for faster scanning.</li>
        </ul>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
        <p className="text-sm font-semibold text-ink">Why teams use it</p>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <p>Fast upload flow for repeat resume revisions.</p>
          <p>Separate ATS, writing, and structure feedback.</p>
          <p>Saved history for comparing multiple drafts.</p>
        </div>
      </div>
    </div>
  </section>
)

export default ProductPreviewCard
