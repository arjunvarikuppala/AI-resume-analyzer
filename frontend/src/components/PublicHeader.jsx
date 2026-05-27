import { Link } from "react-router-dom"

import BrandMark from "./BrandMark"
import { useAuthStore } from "../stores/authStore"

const navItems = [
  { href: "/#product", label: "Features" },
  { href: "/#workflow", label: "Workflow" },
]

const PublicHeader = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <header className="relative z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass-nav mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[22px] px-4 py-3 sm:px-5">
        <BrandMark compact to="/" />

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-ink"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link className="button-secondary hidden sm:inline-flex" to={isAuthenticated ? "/history" : "/login"}>
            {isAuthenticated ? "History" : "Sign in"}
          </Link>
          <Link className="button-primary" to={isAuthenticated ? "/dashboard" : "/register"}>
            {isAuthenticated ? "Open workspace" : "Start free"}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
