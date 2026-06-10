import { useRef, useState } from "react";

import { useResumeStore } from "../stores/resumeStore";

const acceptedExtensions = [".pdf", ".docx"];

const ResumeUploadPanel = () => {
  const uploadResume = useResumeStore((state) => state.uploadResume);
  const loading = useResumeStore((state) => state.uploading);
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [customKey, setCustomKey] = useState(() => localStorage.getItem("custom_gemini_api_key") || "");

  const handleKeyChange = (value) => {
    setCustomKey(value);
    if (value.trim()) {
      localStorage.setItem("custom_gemini_api_key", value.trim());
    } else {
      localStorage.removeItem("custom_gemini_api_key");
    }
  };

  const validateFile = (file) => {
    if (!file) {
      return "Select a PDF or DOCX file to continue.";
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!acceptedExtensions.includes(extension)) {
      return "Only PDF and DOCX resumes are supported.";
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

    await uploadResume(selectedFile, jobDescription);
    setSelectedFile(null);
    setJobDescription("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <form className="panel flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-title">Resume Upload</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Analyze a fresh resume</h2>
        </div>
        <span className="pill">PDF / DOCX</span>
      </div>

      <div
        className={`rounded-[28px] border-2 border-dashed p-6 transition ${
          dragging
            ? "border-coral bg-coral/5"
            : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
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
        <div className="flex flex-col gap-4 text-sm text-slate-600">
          <p className="text-base font-semibold text-ink">
            Drop your resume here or browse from your device.
          </p>
          <p>
            The analyzer checks formatting consistency, spelling, grammar, skill coverage,
            missing sections, and ATS readiness.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="button-primary"
              onClick={() => inputRef.current?.click()}
            >
              Choose file
            </button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={(event) => updateFile(event.target.files?.[0] || null)}
            />
            {selectedFile ? (
              <div className="rounded-2xl border border-mint/50 bg-mint/10 px-4 py-3 font-medium text-slate-700">
                {selectedFile.name}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-500">
                No file selected
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="jobDescription" className="text-sm font-semibold text-slate-700">
          Job Description (Optional)
        </label>
        <textarea
          id="jobDescription"
          placeholder="Paste the target job description here to compare and get tailoring recommendations..."
          className="w-full min-h-[120px] rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-slate-300 focus:ring-1 focus:ring-slate-300"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-700 select-none hover:text-ink transition">
            <span className="flex items-center gap-1.5">🔑 Custom Gemini API Key (Optional)</span>
            <span className="text-xs text-slate-400 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              If the server's default Gemini key is expired or overloaded, you can provide your own. It will be stored in your browser's local storage and used directly for your analyses.
            </p>
            <input
              type="password"
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-300 focus:ring-1 focus:ring-slate-300"
              value={customKey}
              onChange={(e) => handleKeyChange(e.target.value)}
            />
            {customKey && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                ✓ Custom API key is active.
              </p>
            )}
          </div>
        </details>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Google Gemini AI matches your resume with the job description for ATS readiness.
        </p>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Analyzing..." : "Upload and analyze"}
        </button>
      </div>
    </form>
  );
};

export default ResumeUploadPanel;

