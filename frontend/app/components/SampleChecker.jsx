"use client";

import { useState, useEffect, useRef } from "react";
import {
  HiOutlineSearch,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const CLASS_META = {
  "1 - Seizure Activity": {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    icon: HiOutlineLightningBolt,
    severity: "Critical",
  },
  "2 - Tumor Area": {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: HiOutlineLightningBolt,
    severity: "Warning",
  },
  "3 - Healthy Area (Tumor Patient)": {
    color: "text-accent-tertiary",
    bg: "bg-accent-tertiary/10",
    border: "border-accent-tertiary/30",
    icon: HiOutlineShieldCheck,
    severity: "Moderate",
  },
  "4 - Eyes Closed (Healthy)": {
    color: "text-accent-primary",
    bg: "bg-accent-primary/10",
    border: "border-accent-primary/30",
    icon: HiOutlineShieldCheck,
    severity: "Normal",
  },
  "5 - Eyes Open (Healthy)": {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    icon: HiOutlineShieldCheck,
    severity: "Normal",
  },
};

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function SampleChecker({ results }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [sectionRef, sectionInView] = useInView();

  const handleSearch = (value) => {
    setQuery(value);
    setError("");
    setResult(null);

    if (!value) return;

    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > results.length) {
      setError(`Enter a number between 1 and ${results.length}`);
      return;
    }

    setResult(results[num - 1]);
  };

  const meta = result ? CLASS_META[result.Prediction_Label] : null;
  const Icon = meta?.icon || HiOutlineShieldCheck;

  return (
    <section id="lookup" ref={sectionRef} className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div
          className={`glass-card glow p-6 sm:p-8 transition-all duration-600 ease-out ${
            sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <HiOutlineSearch className="w-5 h-5 text-accent-primary" />
            Sample Lookup
          </h3>
          <p className="text-xs text-muted mt-1 mb-5">
            Enter a sample number to view its individual prediction
          </p>

          {/* Search bar */}
          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="number"
              min={1}
              max={results.length}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`Search sample (1 – ${results.length})`}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-2 border border-card-border
                text-foreground placeholder:text-muted text-sm
                focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-xs text-danger">{error}</p>
          )}

          {/* Result card */}
          {result && meta && (
            <div
              key={result.Sample_Number}
              className={`mt-5 rounded-xl border ${meta.border} ${meta.bg} p-5 transition-all duration-300 ease-out`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted uppercase tracking-wider">
                    Sample #{result.Sample_Number}
                  </p>
                  <p className={`text-lg font-bold ${meta.color} mt-0.5`}>
                    {result.Prediction_Label}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-muted">
                      Class{" "}
                      <span className="font-semibold text-foreground">
                        {result.Predicted_Class}
                      </span>
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg ${meta.bg} ${meta.color} font-medium`}
                    >
                      {meta.severity}
                    </span>
                    {result.Actual_Answer_Class !== undefined && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-muted">
                        Actual:{" "}
                        <span className="font-semibold text-foreground">
                          {result.Actual_Answer_Label}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
