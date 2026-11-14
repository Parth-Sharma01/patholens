import fs from 'fs';
import path from 'path';

function generatePathogenSymbol(options = {}) {
  const { idPrefix = 'p', size = 100 } = options;
  const cx = 50, cy = 50;
  const numSpikes = 16;
  const spikes = [];
  
  for (let i = 0; i < numSpikes; i++) {
    const angle = (i * 360 / numSpikes) * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Base of spike at capsid rim
    const bx = Number((cx + 24 * cos).toFixed(2));
    const by = Number((cy + 24 * sin).toFixed(2));
    
    // Stem end
    const tx = Number((cx + 41 * cos).toFixed(2));
    const ty = Number((cy + 41 * sin).toFixed(2));
    
    // Knob sphere center
    const hx = Number((cx + 44 * cos).toFixed(2));
    const hy = Number((cy + 44 * sin).toFixed(2));
    
    spikes.push({ bx, by, tx, ty, hx, hy });
  }

  // Intermediate sub-nodules
  const nodules = [];
  for (let i = 0; i < numSpikes; i++) {
    const angle = ((i + 0.5) * 360 / numSpikes) * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = Number((cx + 31 * cos).toFixed(2));
    const ny = Number((cy + 31 * sin).toFixed(2));
    nodules.push({ nx, ny });
  }

  return { spikes, nodules };
}

const { spikes, nodules } = generatePathogenSymbol();

// 1. Standalone Icon SVG
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <defs>
    <radialGradient id="pathoCapsid" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="35%" stop-color="#e11d48" />
      <stop offset="75%" stop-color="#be123c" />
      <stop offset="100%" stop-color="#881337" />
    </radialGradient>
    <radialGradient id="pathoKnob" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fda4af" />
      <stop offset="45%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#9f1239" />
    </radialGradient>
    <filter id="pathoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#e11d48" flood-opacity="0.35" />
    </filter>
  </defs>
  <g filter="url(#pathoGlow)">
    <!-- Glycoprotein Spikes -->
${spikes.map(s => `    <line x1="${s.bx}" y1="${s.by}" x2="${s.tx}" y2="${s.ty}" stroke="#be123c" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="${s.hx}" cy="${s.hy}" r="4" fill="url(#pathoKnob)" />`).join('\n')}
    <!-- Secondary outer nodules -->
${nodules.map(n => `    <circle cx="${n.nx}" cy="${n.ny}" r="2.8" fill="#e11d48" opacity="0.9" />`).join('\n')}
    <!-- Main Capsid Body -->
    <circle cx="50" cy="50" r="26" fill="url(#pathoCapsid)" />
    <!-- Inner Texture Rings -->
    <circle cx="50" cy="50" r="19" stroke="#fda4af" stroke-width="1.6" stroke-dasharray="3.5 2.5" opacity="0.75" />
    <circle cx="50" cy="50" r="13" stroke="#ffe4e6" stroke-width="1.2" opacity="0.65" />
    <!-- Optical Lens & Aperture Center -->
    <circle cx="50" cy="50" r="7.5" fill="#ffe4e6" opacity="0.95" />
    <circle cx="50" cy="50" r="4" fill="#9f1239" />
    <circle cx="48.5" cy="48.5" r="1.5" fill="#ffffff" />
  </g>
</svg>`;

// 2. Full Wordmark SVG (Dark Mode: White "Path", Crimson Pathogen, Emerald "Lens")
const wordmarkDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 80" width="340" height="80" fill="none">
  <defs>
    <radialGradient id="wmPathoCapsid" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="35%" stop-color="#e11d48" />
      <stop offset="75%" stop-color="#be123c" />
      <stop offset="100%" stop-color="#881337" />
    </radialGradient>
    <radialGradient id="wmPathoKnob" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fda4af" />
      <stop offset="45%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#9f1239" />
    </radialGradient>
    <linearGradient id="wmLensGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="wmGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#e11d48" flood-opacity="0.3" />
    </filter>
  </defs>
  <!-- Text: Path -->
  <text x="10" y="55" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="800" fill="#ffffff" letter-spacing="-1">Path</text>
  
  <!-- Pathogen Glyph replacing 'o' (Center: x=138, y=41, scale: 0.6) -->
  <g transform="translate(111, 14) scale(0.54)" filter="url(#wmGlow)">
${spikes.map(s => `    <line x1="${s.bx}" y1="${s.by}" x2="${s.tx}" y2="${s.ty}" stroke="#be123c" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="${s.hx}" cy="${s.hy}" r="4" fill="url(#wmPathoKnob)" />`).join('\n')}
${nodules.map(n => `    <circle cx="${n.nx}" cy="${n.ny}" r="2.8" fill="#e11d48" opacity="0.9" />`).join('\n')}
    <circle cx="50" cy="50" r="26" fill="url(#wmPathoCapsid)" />
    <circle cx="50" cy="50" r="19" stroke="#fda4af" stroke-width="1.6" stroke-dasharray="3.5 2.5" opacity="0.75" />
    <circle cx="50" cy="50" r="13" stroke="#ffe4e6" stroke-width="1.2" opacity="0.65" />
    <circle cx="50" cy="50" r="7.5" fill="#ffe4e6" opacity="0.95" />
    <circle cx="50" cy="50" r="4" fill="#9f1239" />
    <circle cx="48.5" cy="48.5" r="1.5" fill="#ffffff" />
  </g>
  
  <!-- Text: Lens -->
  <text x="174" y="55" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="800" fill="url(#wmLensGrad)" letter-spacing="-1">Lens</text>
</svg>`;

// 3. Full Wordmark SVG (Light Mode: Slate-900 "Path", Crimson Pathogen, Emerald "Lens")
const wordmarkLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 80" width="340" height="80" fill="none">
  <defs>
    <radialGradient id="wmlPathoCapsid" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="35%" stop-color="#e11d48" />
      <stop offset="75%" stop-color="#be123c" />
      <stop offset="100%" stop-color="#881337" />
    </radialGradient>
    <radialGradient id="wmlPathoKnob" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fda4af" />
      <stop offset="45%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#9f1239" />
    </radialGradient>
    <linearGradient id="wmlLensGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="wmlGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#e11d48" flood-opacity="0.25" />
    </filter>
  </defs>
  <!-- Text: Path -->
  <text x="10" y="55" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="800" fill="#0f172a" letter-spacing="-1">Path</text>
  
  <!-- Pathogen Glyph replacing 'o' (Center: x=138, y=41, scale: 0.54) -->
  <g transform="translate(111, 14) scale(0.54)" filter="url(#wmlGlow)">
${spikes.map(s => `    <line x1="${s.bx}" y1="${s.by}" x2="${s.tx}" y2="${s.ty}" stroke="#be123c" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="${s.hx}" cy="${s.hy}" r="4" fill="url(#wmlPathoKnob)" />`).join('\n')}
${nodules.map(n => `    <circle cx="${n.nx}" cy="${n.ny}" r="2.8" fill="#e11d48" opacity="0.9" />`).join('\n')}
    <circle cx="50" cy="50" r="26" fill="url(#wmlPathoCapsid)" />
    <circle cx="50" cy="50" r="19" stroke="#fda4af" stroke-width="1.6" stroke-dasharray="3.5 2.5" opacity="0.75" />
    <circle cx="50" cy="50" r="13" stroke="#ffe4e6" stroke-width="1.2" opacity="0.65" />
    <circle cx="50" cy="50" r="7.5" fill="#ffe4e6" opacity="0.95" />
    <circle cx="50" cy="50" r="4" fill="#9f1239" />
    <circle cx="48.5" cy="48.5" r="1.5" fill="#ffffff" />
  </g>
  
  <!-- Text: Lens -->
  <text x="174" y="55" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="800" fill="url(#wmlLensGrad)" letter-spacing="-1">Lens</text>
</svg>`;

const pubDir = 'C:/Users/parth/.gemini/antigravity/scratch/patholens/public';
fs.writeFileSync(path.join(pubDir, 'logo-icon.svg'), iconSvg);
fs.writeFileSync(path.join(pubDir, 'logo.svg'), wordmarkDarkSvg);
fs.writeFileSync(path.join(pubDir, 'logo-light.svg'), wordmarkLightSvg);
fs.writeFileSync(path.join(pubDir, 'logo-dark.svg'), wordmarkDarkSvg);
fs.writeFileSync(path.join(pubDir, 'favicon.svg'), iconSvg);

console.log('Successfully generated vector logos in public/: logo-icon.svg, logo.svg, logo-light.svg, logo-dark.svg, favicon.svg');
