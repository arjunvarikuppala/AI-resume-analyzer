const AnalysisListCard = ({ title, subtitle, items, emptyMessage, renderItem }) => (
  <section className="panel-muted flex flex-col gap-4">
    <div>
      <p className="section-title">{subtitle}</p>
      <h3 className="mt-2 text-xl font-semibold text-ink">{title}</h3>
    </div>

    {items?.length ? (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
            {renderItem ? renderItem(item) : <p className="text-sm text-slate-700">{item}</p>}
          </li>
        ))}
      </ul>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
        {emptyMessage}
      </div>
    )}
  </section>
);

export default AnalysisListCard;

