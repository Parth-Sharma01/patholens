'use client';
import React from 'react';

/**
 * PathogenSymbol — Vector Spiked Microbe Glyph replacing the 'o' in PathoLens
 * High-definition SVG with 16 glycoprotein spikes, textured capsid, and optical lens aperture.
 */
export function PathogenSymbol({ size = 28, className = '' }) {
  // Pre-calculated 16 spikes for perfect vector sharpness and 0 runtime math
  const spikes = [
    { bx: 74, by: 50, tx: 91, ty: 50, hx: 94, hy: 50 },
    { bx: 72.17, by: 59.18, tx: 87.89, ty: 65.69, hx: 90.66, hy: 66.84 },
    { bx: 66.97, by: 66.97, tx: 78.99, ty: 78.99, hx: 81.11, hy: 81.11 },
    { bx: 59.18, by: 72.17, tx: 65.69, ty: 87.89, hx: 66.84, hy: 90.66 },
    { bx: 50, by: 74, tx: 50, ty: 91, hx: 50, hy: 94 },
    { bx: 40.82, by: 72.17, tx: 34.31, ty: 87.89, hx: 33.16, hy: 90.66 },
    { bx: 33.03, by: 66.97, tx: 21.01, ty: 78.99, hx: 18.89, hy: 81.11 },
    { bx: 27.83, by: 59.18, tx: 12.11, ty: 65.69, hx: 9.34, hy: 66.84 },
    { bx: 26, by: 50, tx: 9, ty: 50, hx: 6, hy: 50 },
    { bx: 27.83, by: 40.82, tx: 12.11, ty: 34.31, hx: 9.34, hy: 33.16 },
    { bx: 33.03, by: 33.03, tx: 21.01, ty: 21.01, hx: 18.89, hy: 18.89 },
    { bx: 40.82, by: 27.83, tx: 34.31, ty: 12.11, hx: 33.16, hy: 9.34 },
    { bx: 50, by: 26, tx: 50, ty: 9, hx: 50, hy: 6 },
    { bx: 59.18, by: 27.83, tx: 65.69, ty: 12.11, hx: 66.84, hy: 9.34 },
    { bx: 66.97, by: 33.03, tx: 78.99, ty: 21.01, hx: 81.11, hy: 18.89 },
    { bx: 72.17, by: 40.82, tx: 87.89, ty: 34.31, hx: 90.66, hy: 33.16 },
  ];

  const nodules = [
    { nx: 79.46, by: 56.05 }, { nx: 71.92, by: 71.92 }, { nx: 56.05, by: 79.46 }, { nx: 43.95, by: 79.46 },
    { nx: 28.08, by: 71.92 }, { nx: 20.54, by: 56.05 }, { nx: 20.54, by: 43.95 }, { nx: 28.08, by: 28.08 },
    { nx: 43.95, by: 20.54 }, { nx: 56.05, by: 20.54 }, { nx: 71.92, by: 28.08 }, { nx: 79.46, by: 43.95 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block overflow-visible shrink-0 transition-transform duration-300 ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="plCapsid" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="35%" stopColor="#e11d48" />
          <stop offset="75%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <radialGradient id="plKnob" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="45%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
        <filter id="plGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#e11d48" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#plGlow)">
        {/* Radiating Spikes */}
        {spikes.map((s, idx) => (
          <React.Fragment key={idx}>
            <line x1={s.bx} y1={s.by} x2={s.tx} y2={s.ty} stroke="#be123c" strokeWidth="3.6" strokeLinecap="round" />
            <circle cx={s.hx} cy={s.hy} r="4.2" fill="url(#plKnob)" />
          </React.Fragment>
        ))}
        {/* Nodules */}
        {nodules.map((n, idx) => (
          <circle key={`nod-${idx}`} cx={n.nx} cy={n.by} r="2.8" fill="#e11d48" opacity="0.9" />
        ))}
        {/* Spherical Capsid */}
        <circle cx="50" cy="50" r="26" fill="url(#plCapsid)" />
        {/* Inner concentric rings */}
        <circle cx="50" cy="50" r="19" stroke="#fda4af" strokeWidth="1.6" strokeDasharray="3.5 2.5" opacity="0.75" />
        <circle cx="50" cy="50" r="13" stroke="#ffe4e6" strokeWidth="1.2" opacity="0.65" />
        {/* Optical Lens & Aperture Center */}
        <circle cx="50" cy="50" r="7.5" fill="#ffe4e6" opacity="0.95" />
        <circle cx="50" cy="50" r="4" fill="#9f1239" />
        <circle cx="48.5" cy="48.5" r="1.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

/**
 * PathoLensLogo — Brand Logo combining refined "Path" + Spiked Pathogen Glyph ("o") + "Lens"
 * Exactly matching the user's logo design with ultra-high resolution vector refinement.
 */
export default function Logo({ size = 'md', className = '', showText = true }) {
  const sizeMap = {
    sm: { icon: 20, text: 'text-lg', gap: 'gap-0' },
    md: { icon: 24, text: 'text-xl', gap: 'gap-0' },
    lg: { icon: 34, text: 'text-3xl sm:text-4xl', gap: 'gap-0' },
    xl: { icon: 46, text: 'text-4xl sm:text-5xl lg:text-6xl', gap: 'gap-0' },
  };

  const config = sizeMap[size] || sizeMap.md;

  if (!showText) {
    return <PathogenSymbol size={config.icon} className={className} />;
  }

  return (
    <span className={`inline-flex items-center font-extrabold tracking-tight select-none ${config.text} ${className}`}>
      {/* "Path" */}
      <span className="text-slate-900 dark:text-white transition-colors duration-200">
        Path
      </span>

      {/* Spiked Microbe replacing "o" */}
      <span className="inline-flex items-center justify-center -mx-[1px] relative top-[0.5px]">
        <PathogenSymbol size={config.icon} className="hover:rotate-45 transition-transform duration-500" />
      </span>

      {/* "Lens" */}
      <span className="text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
        Lens
      </span>
    </span>
  );
}
