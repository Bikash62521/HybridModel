"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  HiOutlineLightningBolt,
  HiOutlineEye,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from "react-icons/hi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const CLASS_COLORS = [
  { bg: "rgba(239, 68, 68, 0.7)", border: "#ef4444", label: "Seizure" },
  { bg: "rgba(249, 115, 22, 0.7)", border: "#f97316", label: "Tumor" },
  { bg: "rgba(234, 179, 8, 0.7)", border: "#eab308", label: "Healthy (T)" },
  { bg: "rgba(6, 182, 212, 0.7)", border: "#06b6d4", label: "Eyes Closed" },
  { bg: "rgba(99, 102, 241, 0.7)", border: "#6366f1", label: "Eyes Open" },
];

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

export default function ResultsDashboard({ results, summaryCounts }) {
  const labels = Object.keys(summaryCounts);
  const counts = Object.values(summaryCounts);
  const totalSamples = results.length;

  const dominantIdx = counts.indexOf(Math.max(...counts));
  const dominantClass = labels[dominantIdx];
  const seizureCount = counts[0] || 0;
  const seizurePct = ((seizureCount / totalSamples) * 100).toFixed(1);

  const hasActual = results[0]?.Actual_Answer_Class !== undefined;
  const accuracy = useMemo(() => {
    if (!hasActual) return null;
    const correct = results.filter(
      (r) => r.Predicted_Class === r.Actual_Answer_Class
    ).length;
    return ((correct / totalSamples) * 100).toFixed(1);
  }, [results, hasActual, totalSamples]);

  const [sectionRef, sectionInView] = useInView();

  const barData = {
    labels: labels.map((l) => l.replace(/^\d+ - /, "")),
    datasets: [
      {
        label: "Predictions",
        data: counts,
        backgroundColor: CLASS_COLORS.map((c) => c.bg),
        borderColor: CLASS_COLORS.map((c) => c.border),
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 11, 20, 0.9)",
        borderColor: "rgba(99, 102, 241, 0.3)",
        borderWidth: 1,
        titleColor: "#e8eaf6",
        bodyColor: "#a5b4fc",
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#6b7280", font: { size: 11 } },
        grid: { color: "rgba(99, 102, 241, 0.06)" },
        border: { display: false },
      },
    },
  };

  const doughnutData = {
    labels: labels.map((l) => l.replace(/^\d+ - /, "")),
    datasets: [
      {
        data: counts,
        backgroundColor: CLASS_COLORS.map((c) => c.bg),
        borderColor: "rgba(10, 11, 20, 0.8)",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 11, 20, 0.9)",
        borderColor: "rgba(99, 102, 241, 0.3)",
        borderWidth: 1,
        titleColor: "#e8eaf6",
        bodyColor: "#a5b4fc",
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  const statCards = [
    {
      label: "Total Samples",
      value: totalSamples.toLocaleString(),
      icon: HiOutlineChartBar,
      color: "text-accent-primary",
      bg: "bg-accent-primary/10",
    },
    {
      label: "Seizure Detected",
      value: `${seizureCount} (${seizurePct}%)`,
      icon: HiOutlineLightningBolt,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      label: "Dominant Class",
      value: dominantClass.replace(/^\d+ - /, ""),
      icon: HiOutlineShieldCheck,
      color: "text-accent-tertiary",
      bg: "bg-accent-tertiary/10",
    },
    ...(accuracy !== null
      ? [
          {
            label: "Model Accuracy",
            value: `${accuracy}%`,
            icon: HiOutlineEye,
            color: "text-success",
            bg: "bg-success/10",
          },
        ]
      : []),
  ];

  return (
    <section id="results" ref={sectionRef} className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section header */}
        <div
          className={`text-center transition-all duration-600 ease-out ${
            sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Analysis</span> Results
          </h2>
          <p className="text-muted text-sm mt-2">
            Comprehensive breakdown of EEG classification
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div
              key={i}
              className={`glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all duration-500 ease-out ${
                sectionInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}
              >
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Bar chart */}
          <div
            className={`lg:col-span-3 glass-card p-6 transition-all duration-600 ease-out delay-300 ${
              sectionInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Prediction Distribution
            </h3>
            <div className="h-64 sm:h-72">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Doughnut chart */}
          <div
            className={`lg:col-span-2 glass-card p-6 transition-all duration-600 ease-out delay-300 ${
              sectionInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Class Proportions
            </h3>
            <div className="h-52 sm:h-60 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
              {labels.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: CLASS_COLORS[i]?.border }}
                  />
                  <span className="text-muted truncate">
                    {label.replace(/^\d+ - /, "")}
                  </span>
                  <span className="ml-auto font-semibold text-foreground">
                    {counts[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
