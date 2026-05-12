"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  HiOutlineDownload,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFilter,
} from "react-icons/hi";

const PAGE_SIZE_OPTIONS = [25, 50, 100];

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

export default function ResultsTable({ results }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filterClass, setFilterClass] = useState("all");
  const [sectionRef, sectionInView] = useInView();

  const classOptions = useMemo(() => {
    const unique = [...new Set(results.map((r) => r.Prediction_Label))];
    return unique.sort();
  }, [results]);

  const filtered = useMemo(() => {
    if (filterClass === "all") return results;
    return results.filter((r) => r.Prediction_Label === filterClass);
  }, [results, filterClass]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const hasActual = results[0]?.Actual_Answer_Class !== undefined;

  const downloadCSV = () => {
    if (!results.length) return;
    const headers = Object.keys(results[0]);
    let csv = headers.join(",") + "\n";
    results.forEach((row) => {
      csv += headers.map((h) => `"${row[h]}"`).join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "neurosentry_predictions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`glass-card overflow-hidden transition-all duration-600 ease-out ${
            sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-card-border/50">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Full Results
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {filtered.length.toLocaleString()} samples
                {filterClass !== "all" && " (filtered)"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Class filter */}
              <div className="relative flex items-center">
                <HiOutlineFilter className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                <select
                  value={filterClass}
                  onChange={(e) => {
                    setFilterClass(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-4 py-2 rounded-lg bg-surface-2 border border-card-border text-xs text-foreground
                    focus:outline-none focus:ring-2 focus:ring-accent-primary/40 appearance-none cursor-pointer"
                >
                  <option value="all">All Classes</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/^\d+ - /, "")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page size */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-surface-2 border border-card-border text-xs text-foreground
                  focus:outline-none focus:ring-2 focus:ring-accent-primary/40 cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} rows
                  </option>
                ))}
              </select>

              {/* Download */}
              <button
                onClick={downloadCSV}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium
                  bg-gradient-to-r from-accent-primary to-accent-secondary text-white
                  hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition cursor-pointer"
              >
                <HiOutlineDownload className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-card-border/50">
                  <th className="text-left px-5 py-3 text-muted font-medium uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left px-5 py-3 text-muted font-medium uppercase tracking-wider">
                    Predicted Class
                  </th>
                  <th className="text-left px-5 py-3 text-muted font-medium uppercase tracking-wider">
                    Prediction
                  </th>
                  {hasActual && (
                    <>
                      <th className="text-left px-5 py-3 text-muted font-medium uppercase tracking-wider">
                        Actual Class
                      </th>
                      <th className="text-left px-5 py-3 text-muted font-medium uppercase tracking-wider">
                        Match
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => {
                  const isSeizure =
                    row.Prediction_Label === "1 - Seizure Activity";
                  const isMatch =
                    hasActual &&
                    row.Predicted_Class === row.Actual_Answer_Class;

                  return (
                    <tr
                      key={row.Sample_Number}
                      className={`border-b border-card-border/20 transition-colors hover:bg-white/[0.02] table-row-alt ${
                        isSeizure ? "seizure-row" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-muted font-mono">
                        {row.Sample_Number}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                            isSeizure
                              ? "bg-danger/15 text-danger"
                              : "bg-accent-primary/10 text-accent-primary"
                          }`}
                        >
                          {row.Predicted_Class}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-3 font-medium ${
                          isSeizure ? "text-danger" : "text-foreground"
                        }`}
                      >
                        {row.Prediction_Label.replace(/^\d+ - /, "")}
                      </td>
                      {hasActual && (
                        <>
                          <td className="px-5 py-3 text-muted">
                            {row.Actual_Answer_Label?.replace(/^\d+ - /, "")}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`text-xs font-semibold ${
                                isMatch ? "text-success" : "text-danger"
                              }`}
                            >
                              {isMatch ? "✓" : "✗"}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-card-border/50">
            <p className="text-xs text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-card-border text-muted
                  hover:text-foreground hover:bg-surface-2 transition
                  disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-card-border text-muted
                  hover:text-foreground hover:bg-surface-2 transition
                  disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
