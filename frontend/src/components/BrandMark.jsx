import { Link } from "react-router-dom"

const BrandMark = ({ compact = false, light = false, to = "/" }) => {
  const iconClassName = light
    ? "border-white/20 bg-white/10 text-white"
    : "border-emerald-200/70 bg-white/80 text-emerald-600"
  const eyebrowClassName = light ? "text-white/60" : "text-slate-500"
  const titleClassName = light ? "text-white" : "text-ink"

  return (
    <Link className="inline-flex items-center gap-3" to={to}>
      <div
        className={`grid h-11 w-11 place-items-center rounded-2xl border backdrop-blur ${iconClassName}`}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 9.5C5.5 7.567 7.067 6 9 6H11.648C12.852 6 13.979 6.584 14.672 7.567L16 9.449L17.328 7.567C18.021 6.584 19.148 6 20.352 6H23C24.933 6 26.5 7.567 26.5 9.5V9.5C26.5 10.729 25.893 11.878 24.878 12.572L16 18.643L7.122 12.572C6.107 11.878 5.5 10.729 5.5 9.5V9.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M9 23.5H23"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </div>

      <span className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-[0.28em] ${eyebrowClassName}`}>
          Career Signal Lab
        </span>
        <span
          className={`text-lg font-semibold ${titleClassName}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {compact ? "Resume Analyzer" : "AI Resume Analyzer"}
        </span>
      </span>
    </Link>
  )
}

export default BrandMark
