"use client";

import { useState } from "react";
import { HiOutlineBeaker, HiOutlineMenu, HiOutlineX } from "react-icons/hi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-card-border/50 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg">
              <HiOutlineBeaker className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Neuro</span>
              <span className="text-foreground">Sentry</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-muted">
            <a href="#upload" className="hover:text-foreground transition-colors">
              Upload
            </a>
            <a href="#results" className="hover:text-foreground transition-colors">
              Results
            </a>
            <a href="#lookup" className="hover:text-foreground transition-colors">
              Sample Lookup
            </a>
            <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-primary/15 text-accent-primary border border-accent-primary/20">
              v2.0
            </span>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-muted hover:text-foreground transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-card-border/50 px-4 py-4 space-y-3 text-sm text-muted">
          <a href="#upload" className="block hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Upload
          </a>
          <a href="#results" className="block hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Results
          </a>
          <a href="#lookup" className="block hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            Sample Lookup
          </a>
        </div>
      )}
    </nav>
  );
}
