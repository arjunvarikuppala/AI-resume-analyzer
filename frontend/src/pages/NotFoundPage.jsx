import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6">
    <section className="panel w-full text-center">
      <p className="section-title">404</p>
      <h1 className="mt-2 text-4xl font-semibold text-ink">Page not found</h1>
      <p className="mt-4 text-sm text-slate-600">
        The page you requested does not exist or is no longer available.
      </p>
      <Link className="button-primary mt-6" to="/dashboard">
        Go to dashboard
      </Link>
    </section>
  </div>
);

export default NotFoundPage;
