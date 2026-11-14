'use client';
import React from 'react';
import { motion } from 'framer-motion';

/**
 * PathogenModel — Scientifically Accurate, Animated Vector Microbial Models
 * 
 * 1. ecoli: Gram-negative rod (bacillus) with undulating flagella and surface fimbriae
 * 2. salmonella: Slender rod with peritrichous flagella and outer LPS membrane
 * 3. cereus: Thick spore-forming rod with bright refractile internal endospore & exosporium
 * 4. staph: Golden-yellow spherical cocci clustered in a grape-like bunch (staphyloxanthin)
 * 5. giardia: Pear-shaped binucleate protozoan with dual nuclei "face" & 8 trailing flagella
 */

export default function PathogenModel({
  id = 'ecoli',
  size = 'md', // 'sm' (36px), 'md' (44px), 'lg' (80px), 'dossier' (260px)
  animated = true,
  className = '',
}) {
  const pixelSizes = {
    sm: 36,
    md: 44,
    lg: 80,
    dossier: 260,
  };

  const dim = pixelSizes[size] || pixelSizes.md;
  const isLarge = size === 'dossier' || size === 'lg';

  // Pathogen 1: Escherichia coli (Rod-shaped with flagella)
  if (id === 'ecoli') {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-visible select-none ${className}`}
        style={{ width: dim, height: dim }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="ecoliBody" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="80%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>
            <linearGradient id="ecoliGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="ecoliShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Undulating Flagella Tail 1 */}
          <motion.path
            d="M 28 50 C 18 42, 12 58, 4 48 C -2 40, -8 54, -14 46"
            fill="none"
            stroke="#34d399"
            strokeWidth={isLarge ? 2.5 : 2}
            strokeLinecap="round"
            opacity="0.85"
            animate={animated ? {
              d: [
                "M 28 50 C 18 42, 12 58, 4 48 C -2 40, -8 54, -14 46",
                "M 28 50 C 18 56, 12 42, 4 52 C -2 60, -8 44, -14 54",
                "M 28 50 C 18 42, 12 58, 4 48 C -2 40, -8 54, -14 46",
              ]
            } : undefined}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Undulating Flagella Tail 2 */}
          <motion.path
            d="M 30 58 C 20 66, 10 52, 0 62 C -8 70, -16 58, -22 66"
            fill="none"
            stroke="#10b981"
            strokeWidth={isLarge ? 2.2 : 1.8}
            strokeLinecap="round"
            opacity="0.75"
            animate={animated ? {
              d: [
                "M 30 58 C 20 66, 10 52, 0 62 C -8 70, -16 58, -22 66",
                "M 30 58 C 20 50, 10 64, 0 54 C -8 46, -16 62, -22 52",
                "M 30 58 C 20 66, 10 52, 0 62 C -8 70, -16 58, -22 66",
              ]
            } : undefined}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />

          {/* Undulating Flagella Tail 3 */}
          <motion.path
            d="M 32 42 C 22 32, 14 44, 2 36 C -6 28, -14 40, -20 32"
            fill="none"
            stroke="#059669"
            strokeWidth={isLarge ? 2.2 : 1.8}
            strokeLinecap="round"
            opacity="0.7"
            animate={animated ? {
              d: [
                "M 32 42 C 22 32, 14 44, 2 36 C -6 28, -14 40, -20 32",
                "M 32 42 C 22 46, 14 30, 2 42 C -6 50, -14 34, -20 44",
                "M 32 42 C 22 32, 14 44, 2 36 C -6 28, -14 40, -20 32",
              ]
            } : undefined}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />

          {/* Main Bacillus Capsule Body */}
          <g filter="url(#ecoliShadow)">
            <rect
              x="26"
              y="32"
              width="50"
              height="36"
              rx="18"
              fill="url(#ecoliBody)"
              stroke="#6ee7b7"
              strokeWidth="2"
            />

            {/* Inner Chromosomal DNA Nucleoid Coil */}
            <path
              d="M 36 50 Q 42 43, 48 50 T 60 50 T 68 50"
              fill="none"
              stroke="#a7f3d0"
              strokeWidth={isLarge ? 3 : 2}
              strokeLinecap="round"
              strokeDasharray="2 3"
              opacity="0.85"
            />

            {/* Surface Ribosomes / Protein Spots */}
            <circle cx="42" cy="40" r={isLarge ? 2.5 : 1.8} fill="#d1fae5" opacity="0.9" />
            <circle cx="58" cy="42" r={isLarge ? 2.8 : 2} fill="#d1fae5" opacity="0.9" />
            <circle cx="50" cy="58" r={isLarge ? 2.5 : 1.8} fill="#d1fae5" opacity="0.9" />
            <circle cx="64" cy="56" r={isLarge ? 2 : 1.5} fill="#a7f3d0" opacity="0.8" />
            <circle cx="35" cy="54" r={isLarge ? 2 : 1.5} fill="#a7f3d0" opacity="0.8" />

            {/* Pili / Fimbriae Hair Brushes */}
            {[
              { x1: 34, y1: 32, x2: 32, y2: 24 },
              { x1: 44, y1: 32, x2: 44, y2: 23 },
              { x1: 56, y1: 32, x2: 57, y2: 23 },
              { x1: 67, y1: 32, x2: 70, y2: 24 },
              { x1: 76, y1: 42, x2: 84, y2: 40 },
              { x1: 76, y1: 58, x2: 84, y2: 60 },
              { x1: 67, y1: 68, x2: 70, y2: 76 },
              { x1: 56, y1: 68, x2: 57, y2: 77 },
              { x1: 44, y1: 68, x2: 44, y2: 77 },
              { x1: 34, y1: 68, x2: 32, y2: 76 },
            ].map((p, idx) => (
              <line
                key={idx}
                x1={p.x1}
                y1={p.y1}
                x2={p.x2}
                y2={p.y2}
                stroke="#6ee7b7"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.75"
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }

  // Pathogen 2: Salmonella enterica (Flagellated rod with peritrichous tentacles)
  if (id === 'salmonella') {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-visible select-none ${className}`}
        style={{ width: dim, height: dim }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="salmBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
            <filter id="salmShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Radiating Peritrichous Flagella all around Salmonella */}
          {[
            { d: "M 25 36 C 14 26, 4 36, -8 24", color: "#f59e0b", dur: 2.1 },
            { d: "M 48 24 C 44 12, 54 2, 48 -8", color: "#fbbf24", dur: 2.5 },
            { d: "M 75 34 C 86 22, 94 30, 106 18", color: "#d97706", dur: 2.3 },
            { d: "M 82 50 C 94 48, 104 60, 114 52", color: "#f59e0b", dur: 2.7 },
            { d: "M 75 66 C 88 76, 96 68, 108 80", color: "#fbbf24", dur: 2.2 },
            { d: "M 48 76 C 52 88, 42 98, 48 108", color: "#d97706", dur: 2.6 },
            { d: "M 25 64 C 12 76, 4 66, -8 78", color: "#f59e0b", dur: 2.4 },
            { d: "M 18 50 C 6 52, -4 40, -14 48", color: "#fbbf24", dur: 2.8 },
          ].map((f, idx) => (
            <motion.path
              key={idx}
              d={f.d}
              fill="none"
              stroke={f.color}
              strokeWidth={isLarge ? 2.4 : 1.8}
              strokeLinecap="round"
              opacity="0.85"
              animate={animated ? {
                scale: [1, 1.06, 0.96, 1],
                rotate: [0, idx % 2 === 0 ? 5 : -5, 0],
              } : undefined}
              transition={{ duration: f.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Elongated Slender Capsule Body */}
          <g filter="url(#salmShadow)">
            <rect
              x="22"
              y="32"
              width="56"
              height="36"
              rx="18"
              fill="url(#salmBody)"
              stroke="#fde68a"
              strokeWidth="2.2"
            />

            {/* LPS Outer Membrane Glycoprotein Dots */}
            <circle cx="34" cy="42" r={isLarge ? 3 : 2} fill="#fef3c7" opacity="0.9" />
            <circle cx="50" cy="40" r={isLarge ? 3.5 : 2.2} fill="#fef3c7" opacity="0.95" />
            <circle cx="66" cy="42" r={isLarge ? 3 : 2} fill="#fef3c7" opacity="0.9" />
            <circle cx="40" cy="58" r={isLarge ? 3.2 : 2.2} fill="#fef3c7" opacity="0.95" />
            <circle cx="60" cy="58" r={isLarge ? 3.5 : 2.4} fill="#fde68a" opacity="0.9" />
            <circle cx="50" cy="50" r={isLarge ? 2.5 : 1.8} fill="#92400e" opacity="0.75" />

            {/* Inner virulence plasmid ring */}
            <circle
              cx="50"
              cy="50"
              r={isLarge ? 8 : 6}
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              opacity="0.8"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Pathogen 3: Bacillus cereus (Large spore-forming rod with bright oval endospore)
  if (id === 'cereus') {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-visible select-none ${className}`}
        style={{ width: dim, height: dim }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="cereusBody" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="45%" stopColor="#e11d48" />
              <stop offset="80%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <radialGradient id="sporeCore" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fecdd3" />
              <stop offset="75%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </radialGradient>
            <filter id="cereusShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#e11d48" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Loose Exosporium Outer Balloon Layer */}
          <motion.rect
            x="12"
            y="24"
            width="76"
            height="52"
            rx="26"
            fill="none"
            stroke="#fda4af"
            strokeWidth="1.6"
            strokeDasharray="4 3"
            opacity="0.65"
            animate={animated ? {
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            } : undefined}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main Thick Bacillus Rod */}
          <g filter="url(#cereusShadow)">
            <rect
              x="18"
              y="28"
              width="64"
              height="44"
              rx="22"
              fill="url(#cereusBody)"
              stroke="#fecdd3"
              strokeWidth="2.4"
            />

            {/* Central Refractile Spore (Heat-Resistant Endospore) */}
            <motion.ellipse
              cx="50"
              cy="50"
              rx={isLarge ? 16 : 12}
              ry={isLarge ? 12 : 9}
              fill="url(#sporeCore)"
              stroke="#ffe4e6"
              strokeWidth="2"
              animate={animated ? {
                scale: [1, 1.08, 1],
                opacity: [0.9, 1, 0.9],
              } : undefined}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Spore cortex highlight */}
            <ellipse
              cx="48"
              cy="48"
              rx={isLarge ? 10 : 7}
              ry={isLarge ? 6 : 4.5}
              fill="#ffffff"
              opacity="0.85"
            />

            {/* Paracrystalline Toxin Inclusions */}
            <polygon points="26,46 32,42 32,54 26,58" fill="#fda4af" opacity="0.9" />
            <polygon points="74,46 68,42 68,54 74,58" fill="#fda4af" opacity="0.9" />
          </g>
        </svg>
      </div>
    );
  }

  // Pathogen 4: Staphylococcus aureus (Golden grape-like clusters of spherical cocci)
  if (id === 'staph') {
    // Exact 14 cocci arranged in iconic "grape bunch" geometry
    const cocci = [
      { cx: 50, cy: 30, r: 10 },
      { cx: 38, cy: 38, r: 10.5 },
      { cx: 62, cy: 38, r: 10.5 },
      { cx: 28, cy: 50, r: 10 },
      { cx: 48, cy: 48, r: 11.5 },
      { cx: 72, cy: 50, r: 10 },
      { cx: 36, cy: 62, r: 10.5 },
      { cx: 58, cy: 62, r: 10.5 },
      { cx: 46, cy: 74, r: 10 },
      { cx: 64, cy: 74, r: 9 },
      { cx: 50, cy: 85, r: 8.5 },
      // Foreground depth cocci
      { cx: 44, cy: 44, r: 7.5, fg: true },
      { cx: 56, cy: 54, r: 8, fg: true },
    ];

    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-visible select-none ${className}`}
        style={{ width: dim, height: dim }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="staphGold" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </radialGradient>
            <radialGradient id="staphGlint" cx="25%" cy="25%" r="45%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </radialGradient>
            <filter id="staphShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ca8a04" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Golden Staphyloxanthin Halo */}
          <motion.circle
            cx="50"
            cy="54"
            r="38"
            fill="#eab308"
            opacity="0.18"
            animate={animated ? {
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.3, 0.15],
            } : undefined}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <g filter="url(#staphShadow)">
            {cocci.map((c, i) => (
              <g key={i}>
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="url(#staphGold)"
                  stroke="#fef08a"
                  strokeWidth="1.6"
                />
                {/* 3D Spherical Specular Reflection */}
                <circle
                  cx={c.cx - c.r * 0.35}
                  cy={c.cy - c.r * 0.35}
                  r={c.r * 0.35}
                  fill="#ffffff"
                  opacity="0.75"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  }

  // Pathogen 5: Giardia lamblia & Norovirus (Pear-shaped protozoan with face-like dual nuclei & flagella)
  if (id === 'giardia') {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-visible select-none ${className}`}
        style={{ width: dim, height: dim }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="giardiaBody" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="80%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>
            <radialGradient id="giardiaNucleus" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
            <filter id="giardiaShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#0284c7" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* 4 Pairs of Long Wavy Flagella */}
          {/* Anterior flagella pair */}
          <motion.path
            d="M 38 28 C 24 16, 12 28, 2 18"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 38 28 C 24 16, 12 28, 2 18",
                "M 38 28 C 24 24, 12 12, 2 24",
                "M 38 28 C 24 16, 12 28, 2 18",
              ]
            } : undefined}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 62 28 C 76 16, 88 28, 98 18"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 62 28 C 76 16, 88 28, 98 18",
                "M 62 28 C 76 24, 88 12, 98 24",
                "M 62 28 C 76 16, 88 28, 98 18",
              ]
            } : undefined}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Caudal trailing flagella pair at pointed tail */}
          <motion.path
            d="M 50 82 C 44 94, 56 106, 48 116"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 50 82 C 44 94, 56 106, 48 116",
                "M 50 82 C 56 94, 44 106, 52 116",
                "M 50 82 C 44 94, 56 106, 48 116",
              ]
            } : undefined}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 50 82 C 54 94, 42 104, 52 118"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={animated ? {
              d: [
                "M 50 82 C 54 94, 42 104, 52 118",
                "M 50 82 C 46 94, 58 104, 48 118",
                "M 50 82 C 54 94, 42 104, 52 118",
              ]
            } : undefined}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />

          {/* Pear-shaped (Tear-drop) Trophozoite Body */}
          <g filter="url(#giardiaShadow)">
            <path
              d="M 50 20 C 72 20, 78 45, 68 65 C 60 80, 52 82, 50 84 C 48 82, 40 80, 32 65 C 22 45, 28 20, 50 20 Z"
              fill="url(#giardiaBody)"
              stroke="#7dd3fc"
              strokeWidth="2"
            />

            {/* Ventral Adhesive Suction Disk Outline */}
            <path
              d="M 34 38 C 34 28, 66 28, 66 38 C 66 52, 34 52, 34 38 Z"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              opacity="0.8"
            />

            {/* Iconic Symmetrical Twin Nuclei ("Face / Eyes") */}
            <g>
              {/* Left Nucleus */}
              <ellipse cx="42" cy="40" rx="5.5" ry="7" fill="url(#giardiaNucleus)" stroke="#0369a1" strokeWidth="1" />
              <circle cx="42" cy="40" r="2.2" fill="#082f49" />
              <circle cx="41" cy="39" r="0.9" fill="#ffffff" />

              {/* Right Nucleus */}
              <ellipse cx="58" cy="40" rx="5.5" ry="7" fill="url(#giardiaNucleus)" stroke="#0369a1" strokeWidth="1" />
              <circle cx="58" cy="40" r="2.2" fill="#082f49" />
              <circle cx="57" cy="39" r="0.9" fill="#ffffff" />
            </g>

            {/* Central Axostyle (Median Body Spine) */}
            <line x1="50" y1="24" x2="50" y2="80" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
          </g>

          {/* Accompanying Small Norovirus Capsid Particles */}
          <circle cx="82" cy="62" r="5" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.2" opacity="0.9" />
          <circle cx="18" cy="62" r="4.5" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.2" opacity="0.9" />
        </svg>
      </div>
    );
  }

  return null;
}
