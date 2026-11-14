'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Microscopic biology particle definitions
const MICROBES = [
  // Bacilli (rod-shaped bacteria)
  { type: 'bacillus', x: 8, y: 18, size: 44, rot: 35, duration: 16, delay: 0 },
  { type: 'bacillus', x: 88, y: 32, size: 52, rot: -25, duration: 22, delay: 2 },
  { type: 'bacillus', x: 78, y: 78, size: 48, rot: 50, duration: 19, delay: 4 },
  { type: 'bacillus', x: 15, y: 82, size: 38, rot: -45, duration: 18, delay: 1 },
  // Cocci (spherical bacteria clusters)
  { type: 'coccus', x: 22, y: 45, size: 36, rot: 0, duration: 14, delay: 3 },
  { type: 'coccus', x: 72, y: 15, size: 42, rot: 0, duration: 20, delay: 5 },
  { type: 'coccus', x: 84, y: 60, size: 32, rot: 0, duration: 17, delay: 2 },
  { type: 'coccus', x: 30, y: 75, size: 38, rot: 0, duration: 24, delay: 6 },
  // DNA Helix segments
  { type: 'dna', x: 92, y: 12, size: 30, rot: 15, duration: 25, delay: 1 },
  { type: 'dna', x: 5, y: 55, size: 28, rot: -30, duration: 21, delay: 4 },
  // Petri Dish concentric micro-reticles
  { type: 'petri', x: 50, y: 25, size: 180, rot: 0, duration: 40, delay: 0 },
  { type: 'petri', x: 25, y: 88, size: 140, rot: 0, duration: 35, delay: 3 },
];

export default function BioBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Bioluminescent culture glow orbs */}
      <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl animate-pulse-slow" />
      <div className="absolute top-[50%] right-[10%] w-[32rem] h-[32rem] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl animate-bio-drift" />
      <div className="absolute bottom-[10%] left-[30%] w-80 h-80 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl" />
      <div className="absolute top-[30%] right-[35%] w-72 h-72 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-3xl animate-pulse" />

      {/* Laboratory micro-grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(52,211,153,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,211,153,0.04)_1px,transparent_1px)]" />

      {/* Floating Microorganism Entities */}
      {MICROBES.map((m, i) => (
        <motion.div
          key={i}
          className="absolute text-brand-600/20 dark:text-brand-400/25"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 25 : -25), 0],
            y: [0, (i % 3 === 0 ? -30 : 25), 0],
            rotate: [m.rot, m.rot + (i % 2 === 0 ? 30 : -30), m.rot],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {m.type === 'bacillus' && (
            <svg viewBox="0 0 100 45" className="w-full h-full drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              {/* Rod-shaped bacterium with membrane & flagella */}
              <rect x="15" y="8" width="70" height="28" rx="14" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="2.5" />
              {/* Flagella strands */}
              <path d="M 15 22 Q 5 15 2 25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
              <path d="M 15 26 Q 8 35 3 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <path d="M 85 22 Q 95 15 98 25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
              {/* Internal nucleoid chromatin coils */}
              <path d="M 30 22 Q 40 16 50 22 T 70 22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.75" />
              <circle cx="38" cy="22" r="2" fill="currentColor" opacity="0.8" />
              <circle cx="62" cy="22" r="2" fill="currentColor" opacity="0.8" />
            </svg>
          )}

          {m.type === 'coccus' && (
            <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              {/* Clustered spherical bacteria (Staphylococcus / Enterococcus colony) */}
              <circle cx="24" cy="22" r="12" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" />
              <circle cx="38" cy="24" r="10" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="2" />
              <circle cx="28" cy="38" r="11" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" />
              <circle cx="40" cy="38" r="9" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="24" cy="22" r="4" fill="currentColor" opacity="0.7" />
              <circle cx="38" cy="24" r="3.5" fill="currentColor" opacity="0.7" />
              <circle cx="28" cy="38" r="3.5" fill="currentColor" opacity="0.7" />
            </svg>
          )}

          {m.type === 'dna' && (
            <svg viewBox="0 0 40 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
              {/* Double helix strand fragments */}
              <path d="M 10 10 Q 30 25 10 40 T 10 70 T 10 100" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
              <path d="M 30 10 Q 10 25 30 40 T 30 70 T 30 100" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
              {/* Base pair rungs */}
              <line x1="12" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="16" y1="32" x2="24" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="12" y1="48" x2="28" y2="48" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="16" y1="62" x2="24" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="12" y1="78" x2="28" y2="78" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="16" y1="92" x2="24" y2="92" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            </svg>
          )}

          {m.type === 'petri' && (
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-30 dark:opacity-25">
              {/* Microscope objective reticle & Petri dish calibration circle */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
              {/* Crosshair axis */}
              <line x1="100" y1="2" x2="100" y2="18" stroke="currentColor" strokeWidth="1.5" />
              <line x1="100" y1="182" x2="100" y2="198" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="100" x2="18" y2="100" stroke="currentColor" strokeWidth="1.5" />
              <line x1="182" y1="100" x2="198" y2="100" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="2.5" fill="currentColor" />
            </svg>
          )}
        </motion.div>
      ))}

      {/* Floating Micro-scale metric tags on screen perimeter */}
      <div className="hidden lg:flex flex-col gap-1 absolute top-24 left-6 text-[10px] font-mono text-emerald-600/40 dark:text-emerald-400/40 uppercase tracking-widest">
        <span>FIELD: 40X FLUORESCENCE</span>
        <span>PATHOGEN RES: 0.2 µm</span>
        <span>AGAR CULTURE: 37°C</span>
      </div>

      <div className="hidden lg:flex flex-col gap-1 absolute bottom-8 right-6 text-[10px] font-mono text-cyan-600/40 dark:text-cyan-400/40 text-right uppercase tracking-widest">
        <span>SOLAN BASIN CATCHMENT</span>
        <span>E. COLI / SALMONELLA SURVEILLANCE</span>
        <span>STATUS: LIVE INOCULATION MONITOR</span>
      </div>
    </div>
  );
}