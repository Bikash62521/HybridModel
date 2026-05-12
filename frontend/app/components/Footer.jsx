"use client";

import { HiOutlineHeart } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <span>Built with</span>
          <HiOutlineHeart className="w-3.5 h-3.5 text-danger" />
          <span>
            using <span className="text-foreground font-medium">CNN + SVM</span>{" "}
            Hybrid Model
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-1 rounded-md bg-accent-primary/10 text-accent-primary font-medium">
            Next.js
          </span>
          <span className="px-2.5 py-1 rounded-md bg-accent-secondary/10 text-accent-secondary font-medium">
            TailwindCSS
          </span>
          <span className="px-2.5 py-1 rounded-md bg-accent-tertiary/10 text-accent-tertiary font-medium">
            Flask
          </span>
        </div>
        <p>© {new Date().getFullYear()} NeuroSentry</p>
      </div>
    </footer>
  );
}
