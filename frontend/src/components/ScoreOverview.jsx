const ScoreOverview = ({ resume }) => {
  const scores = resume?.sectionScores || {};

  return (
    <section className="panel flex flex-col gap-6">
      <div>
        <p className="section-title">Score Overview</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">{resume.fileName}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
        {[
          { label: "Resume Score", value: resume.score },
          { label: "ATS Score", value: resume.atsScore },
          { label: "Sections", value: scores.sections ?? 0 },
          { label: "Grammar", value: scores.grammar ?? 0 },
          { label: "Spelling", value: scores.spelling ?? 0 },
          { label: "Skills", value: scores.skills ?? 0 },
          { label: "Formatting", value: scores.formatting ?? 0 },
        ].map((item) => (
          <div key={item.label} className="metric-tile">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold text-ink">{item.value}</p>
              <div className="h-2 w-20 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-coral via-gold to-mint"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScoreOverview;
