import { useRef, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { useResumeStore } from "../stores/resumeStore";

const acceptedExtensions = [".pdf", ".docx"];

const ResumeUploadPanel = () => {
  const uploadResume = useResumeStore((state) => state.uploadResume);
  const loading = useResumeStore((state) => state.uploading);
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const validateFile = (file) => {
    if (!file) {
      return "Select a PDF or DOCX file to continue.";
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!acceptedExtensions.includes(extension)) {
      return "Only PDF and DOCX resumes are supported.";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "File size exceeds 5MB limit.";
    }

    return "";
  };

  const updateFile = (file) => {
    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      return;
    }

    await uploadResume(selectedFile, jobDescription.trim() || undefined);
    setSelectedFile(null);
    setJobDescription("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <form className="panel flex flex-col gap-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <span className="pill-indigo">
            <Sparkles className="h-3.5 w-3.5" />
            AI Resume Scanner
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">
            Analyze a new resume version
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill">PDF</span>
          <span className="pill">DOCX</span>
          <span className="pill !bg-slate-100/60 !text-slate-500">Max 5MB</span>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`relative flex flex-col items-center justify-center rounded-[22px] border-2 border-dashed p-8 text-center transition-all duration-300 ${
          dragging
            ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
            : selectedFile
            ? "border-emerald-300 bg-emerald-50/20"
            : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-slate-50/80"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          updateFile(event.dataTransfer.files?.[0] || null);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={(event) => updateFile(event.target.files?.[0] || null)}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
              <FileText className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">
                Drag and drop your resume here, or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                >
                  browse files
                </button>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supports Adobe PDF and Microsoft Word (.docx) formats
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Target Job Description Accordion (Optional Tailoring) */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowJobDesc(!showJobDesc)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-100/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-4 w-4 text-indigo-600" />
            <span>Tailor against a Target Job Description (Optional)</span>
          </div>
          {showJobDesc ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {showJobDesc && (
          <div className="border-t border-slate-200/80 p-5 bg-white space-y-2">
            <p className="text-xs text-slate-500">
              Paste the target job description or requirements below. The AI will evaluate keyword match percentage, missing skills, and provide custom tailoring tips.
            </p>
            <textarea
              className="field min-h-[110px] text-xs font-mono"
              placeholder="Paste job description, required qualifications, and key responsibilities here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          Powered by Google Gemini 2.5/3.0 AI for rigorous ATS and grammar evaluation.
        </p>
        <button
          type="submit"
          className="button-primary w-full sm:w-auto px-8"
          disabled={loading || !selectedFile}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Analyzing Resume...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Upload & Analyze</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ResumeUploadPanel;


