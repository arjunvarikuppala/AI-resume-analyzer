const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex min-h-[180px] flex-col items-center justify-center gap-4 text-slate-500">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-coral" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default LoadingSpinner;

