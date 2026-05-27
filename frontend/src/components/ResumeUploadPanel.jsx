import { useRef, useState } from "react";

import { useResumeStore } from "../stores/resumeStore";

const acceptedExtensions = [".pdf", ".docx"];

const ResumeUploadPanel = () => {
  const uploadResume = useResumeStore((state) => state.uploadResume);
  const loading = useResumeStore((state) => state.uploading);
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
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

    await uploadResume(selectedFile);
    setSelectedFile(null);

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

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Scores combine sections, grammar, spelling, formatting, and technical keywords.
        </p>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Analyzing..." : "Upload and analyze"}
        </button>
      </div>
    </form>
  );
};

export default ResumeUploadPanel;

