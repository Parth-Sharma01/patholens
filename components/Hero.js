'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, MapPin, Users, Droplets, TrendingUp, ChevronDown, Ambulance, Microscope } from 'lucide-react';
import Logo from '@/components/Logo';
import { useLanguage } from '@/context/LanguageContext';

const PARTICLE_COUNT = 18;

function MetricBadge({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl px-5 py-4 flex items-center gap-4 min-w-[170px] border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-none"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [metrics, setMetrics] = useState(null);
  const [particles, setParticles] = useState([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    // Generate particles on client-side mount only to prevent SSR hydration mismatch
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 8 + 6,
      }))
    );

    const loadMetrics = () => {
      fetch('/api/survey-data')
        .then(r => r.json())
        .then(d => setMetrics(d))
        .catch(() => {});
    };
    loadMetrics();
    window.addEventListener('patholens:assessment-saved', loadMetrics);
    return () => window.removeEventListener('patholens:assessment-saved', loadMetrics);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-16"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(6,182,212,0.06)_0%,transparent_60%)]" />

      {/* Animated bio particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-brand-500/25 dark:bg-brand-400/20 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -35, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Reticle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              <span className="badge bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400 border border-brand-300 dark:border-brand-700/50">
                🏫 Shoolini University • Group-4
              </span>
              <span className="badge bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 border border-purple-700/50">
                🧫 Foodborne Pathogen Surveillance
              </span>
              <span className="badge bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700/50">
                📐 Multiplicative Hazard Model
              </span>
            </motion.div>

            {/* Headline with Brand Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="py-1"
            >
              <h1 className="sr-only">PathoLens — Food Safety & Pathogen Surveillance</h1>
              <Logo size="xl" className="leading-tight drop-shadow-sm" />
            </motion.div>

            {/* Human-Centered Editorial Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug"
            >
              {lang === 'hi' ? 'भोजन को पहचानें, जोखिम की गणना करें।' : 'Know Your Food. Calculate Your Risk.'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 text-base sm:text-lg text-brand-700 dark:text-brand-400 font-semibold"
            >
              {lang === 'hi'
                ? 'सोलन के 20 ग्रामीण क्लस्टरों के 225+ परिवारों पर आधारित वास्तविक जैव-निगरानी'
                : 'Community-scale epidemiological surveillance across 20 Solan rural clusters'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed max-w-lg"
            >
              {t('hero.subtitle', 'Ground-level epidemiological assessment analyzing personal hygiene, drinking water safety, food storage, kitchen vectors, and gastrointestinal illness across 225+ households in rural Solan.')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <a href="#calculator" className="btn-primary text-xs sm:text-sm px-6 py-3 shadow-md shadow-brand-900/20">
                <Shield className="w-4 h-4" />
                {t('hero.btnCalculate', 'Assess Household Risk')}
              </a>
              <a href="#food-safety" className="btn-outline text-xs sm:text-sm px-5 py-3 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                <span className="text-base leading-none">🥗</span>
                {lang === 'hi' ? 'खाद्य सुरक्षा गाइड' : 'Food Safety Guide'}
              </a>
              <a href="#dashboard" className="btn-outline text-xs sm:text-sm px-4 py-3">
                <TrendingUp className="w-4 h-4" />
                {t('hero.btnExplore', 'Explore Live Data')}
              </a>
              <a href="#emergency" className="btn-outline text-xs sm:text-sm px-4 py-3 border-red-500/40 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
                <Ambulance className="w-4 h-4 text-red-500" />
                {t('emergency.dial108Btn', 'Emergency 108')}
              </a>
            </motion.div>

            {/* Data status indicator */}
            {metrics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500 font-mono"
              >
                <div className={`w-2 h-2 rounded-full ${metrics.isLive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                {metrics.isLive
                  ? `Live surveillance feed · Updated ${new Date(metrics.fetchedAt).toLocaleTimeString()}`
                  : 'Calibrated Shoolini Village Research Cohort (225 HH)'}
              </motion.div>
            )}
          </div>

          {/* Right: Metric badges + illustration */}
          <div className="flex flex-col gap-6">
            {/* Visual graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-white/95 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 p-6 sm:p-7 shadow-xl dark:shadow-2xl transition-colors duration-200"
            >
              {/* Top Banner Bar (Matching Mockup 1: "PATHOLENS: FOOD SAFETY, SECURED.") */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-gray-800/80">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-500 dark:text-gray-400 uppercase">
                  PATHOLENS: FOOD SAFETY, SECURED.
                </span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
              </div>

              {/* Visual risk dial */}
              <div className="flex flex-col items-center pt-2 pb-1">
                {/* Status pill badge on top */}
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-500/40 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    🔬 20 VILLAGE SOLAN COHORT
                  </span>
                </div>

                {/* Gauge Arch */}
                <div className="relative w-64 h-36 flex items-center justify-center">
                  <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="riskGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="35%" stopColor="#eab308" />
                        <stop offset="70%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                      <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    {/* Background track arc */}
                    <path
                      d="M 25 110 A 75 75 0 0 1 175 110"
                      fill="none"
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    {/* Gradient risk arc */}
                    <path
                      d="M 25 110 A 75 75 0 0 1 175 110"
                      fill="none"
                      stroke="url(#riskGradHero)"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="235.6"
                      strokeDashoffset={235.6 - ((metrics?.highRiskPct || 3) / 100) * 235.6}
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />

                    {/* Needle Indicator */}
                    {(() => {
                      const pct = Math.max(0, Math.min(100, metrics?.highRiskPct ?? 3));
                      const angle = -180 + (pct / 100) * 180;
                      const rad = (angle * Math.PI) / 180;
                      const cx = 100, cy = 110, r = 60;
                      const nx = cx + r * Math.cos(rad);
                      const ny = cy + r * Math.sin(rad);
                      return (
                        <g filter="url(#needleShadow)">
                          <line
                            x1={cx}
                            y1={cy}
                            x2={nx}
                            y2={ny}
                            className="stroke-slate-800 dark:stroke-slate-100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            style={{ transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                          />
                          <circle cx={cx} cy={cy} r="6.5" fill="#10b981" />
                          <circle cx={cx} cy={cy} r="3" className="fill-slate-900 dark:fill-slate-950" />
                        </g>
                      );
                    })()}
                    {/* Value rendered directly inside SVG coordinate space */}
                    <text
                      x="100"
                      y="84"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-900 dark:fill-white font-extrabold text-3xl"
                      fontSize="36"
                      fontWeight="900"
                      letterSpacing="-0.5"
                    >
                      {metrics?.highRiskPct ?? 0}
                      <tspan fill="#10b981" fontSize="20" fontWeight="700" dx="2">%</tspan>
                    </text>
                  </svg>
                </div>

                {/* Subtitle positioned safely BELOW the dial */}
                <div className="text-center mt-2 mb-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('hero.liveDialTitle', 'High-Risk Households')}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-500">
                    {t('hero.liveDialSub', 'Solan District • Shoolini University Cluster')}
                  </p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { label: t('hero.statSurveys', 'Surveys'), value: metrics?.totalHouseholds ?? '—', color: 'text-brand-600 dark:text-brand-400' },
                  { label: t('hero.statVillages', 'Villages'), value: metrics?.totalVillages ?? '—', color: 'text-purple-600 dark:text-purple-400' },
                  { label: t('hero.statCritical', 'Critical'), value: metrics?.riskDistribution?.Critical ?? '—', color: 'text-red-600 dark:text-red-400' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-slate-100 dark:bg-gray-800/50 border border-slate-200/60 dark:border-transparent">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick Best Practices Thumbnails Ribbon (From Mockups 1 & 4) */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                    Food Safety Best Practices
                  </span>
                  <a href="#food-safety" className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    View All 6 →
                  </a>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { img: '/assets/handwash.jpg', label: 'Clean Hands' },
                    { img: '/assets/salad-bowl.jpg', label: 'Fresh Food' },
                    { img: '/assets/surface-clean.jpg', label: 'Clean Slabs' },
                    { img: '/assets/lab-technician.jpg', label: 'Safe Cooking' },
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href="#food-safety"
                      className="group flex flex-col items-center p-2 rounded-2xl bg-slate-50/90 dark:bg-gray-800/40 border border-slate-200/80 dark:border-gray-800 hover:border-brand-500/60 dark:hover:border-brand-500/60 hover:shadow-md transition-all text-center"
                    >
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 mb-1.5 shadow-xs">
                        <img
                          src={item.img}
                          alt={item.label}
                          className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo-icon.svg';
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 leading-tight">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Metric badges row */}
            <div className="flex flex-wrap gap-3">
              <MetricBadge icon={Users} label={t('hero.statSurveys', 'Total Surveys')} value={metrics?.totalHouseholds} color="bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400" delay={0.5} />
              <MetricBadge icon={MapPin} label={t('hero.statVillages', 'Villages')} value={metrics?.totalVillages} color="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400" delay={0.6} />
              <MetricBadge icon={Droplets} label={t('hero.statPurified', 'Untreated Water')} value={metrics ? `${metrics.untreatedWaterPct}%` : null} color="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400" delay={0.7} />
              <MetricBadge icon={AlertTriangle} label={t('hero.liveDialTitle', 'High-Risk HH')} value={metrics ? `${metrics.highRiskPct}%` : null} color="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400" delay={0.8} />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 dark:text-gray-600"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>
    </section>
  );
}