"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineChip,
  HiOutlineShieldCheck,
} from "react-icons/hi";

export default function HeroSection({
  onPredict,
  isLoading,
  error,
  hasResults,
  onReset,
  fileName,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleSubmit = () => {
    if (selectedFile) {
      onPredict(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    onReset();
  };

  const features = [
    {
      icon: HiOutlineLightningBolt,
      title: "Real-time Analysis",
      desc: "Instant EEG classification powered by deep learning",
    },
    {
      icon: HiOutlineChip,
      title: "Hybrid CNN + SVM",
      desc: "State-of-the-art feature extraction with SVM classification",
    },
    {
      icon: HiOutlineShieldCheck,
      title: "5-Class Detection",
      desc: "Seizure, tumor, and healthy brain state identification",
    },
  ];

  return (
    <section
      id="upload"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="gradient-text glow-text">EEG Brain State</span>
            <br />
            <span className="text-foreground">Classifier</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted leading-relaxed">
            Upload your EEG dataset and let our hybrid{" "}
            <span className="text-accent-primary font-medium">CNN + SVM</span>{" "}
            model classify brain states in seconds. Detect seizures, tumors, and
            healthy activity with clinical-grade accuracy.
          </p>
        </div>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up-delayed">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card glow flex items-center gap-3 px-5 py-3 text-left hover:scale-105 transition-transform duration-300"
            >
              <f.icon className="w-6 h-6 text-accent-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {f.title}
                </p>
                <p className="text-xs text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Area */}
        <div className="mt-12 max-w-xl mx-auto animate-fade-in-up-delayed-2">
          {!hasResults ? (
            <div className="glass-card glow p-8">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`drop-zone-ring rounded-xl p-10 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 ${
                  isDragActive ? "active" : ""
                } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
              >
                <input {...getInputProps()} />

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isDragActive
                      ? "bg-accent-primary/20"
                      : "bg-accent-primary/10"
                  } transition-colors`}
                >
                  <HiOutlineCloudUpload
                    className={`w-8 h-8 ${
                      isDragActive ? "text-accent-primary" : "text-muted"
                    } transition-colors`}
                  />
                </div>

                {selectedFile ? (
                  <div className="flex items-center gap-2 text-sm">
                    <HiOutlineDocumentText className="w-5 h-5 text-accent-primary" />
                    <span className="text-foreground font-medium">
                      {selectedFile.name}
                    </span>
                    <span className="text-muted">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      {isDragActive
                        ? "Drop your CSV here"
                        : "Drag & drop your CSV file here"}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      or click to browse files
                    </p>
                  </div>
                )}
              </div>

              {/* Analyze button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isLoading}
                className="mt-6 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
                  bg-gradient-to-r from-accent-primary to-accent-secondary
                  hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  text-white cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Analyzing EEG Data…
                  </span>
                ) : (
                  "🧠 Run Prediction"
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            /* After results — show "file processed" banner */
            <div className="glass-card glow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                  <HiOutlineDocumentText className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {fileName}
                  </p>
                  <p className="text-xs text-muted">
                    Analysis complete — scroll down for results
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                  border border-accent-primary/30 text-accent-primary
                  hover:bg-accent-primary/10 transition-all cursor-pointer"
              >
                <HiOutlineRefresh className="w-4 h-4" />
                New Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
