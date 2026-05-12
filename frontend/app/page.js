"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ResultsDashboard from "./components/ResultsDashboard";
import SampleChecker from "./components/SampleChecker";
import ResultsTable from "./components/ResultsTable";
import Footer from "./components/Footer";

export default function Home() {
  const [results, setResults] = useState(null);
  const [summaryCounts, setSummaryCounts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

  const handlePredict = async (file) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSummaryCounts(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("csv_file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.full_results);
      setSummaryCounts(data.summary_counts);
    } catch (err) {
      setError(
        err.message ||
          "Failed to connect to the prediction server. Is api.py running?"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSummaryCounts(null);
    setError(null);
    setFileName("");
  };

  return (
    <>
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <HeroSection
            onPredict={handlePredict}
            isLoading={isLoading}
            error={error}
            hasResults={!!results}
            onReset={handleReset}
            fileName={fileName}
          />

          {results && summaryCounts && (
            <div className="space-y-8 pb-16">
              <ResultsDashboard
                results={results}
                summaryCounts={summaryCounts}
              />

              <SampleChecker results={results} />

              <ResultsTable results={results} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
