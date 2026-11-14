'use client';
import { useState, useRef, useEffect } from 'react';
import { RISK_VIDEOS } from '@/lib/riskVideos';
import { Play, AlertTriangle, Video, Info, Film, ShieldAlert, Sparkles, ExternalLink, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RiskVideoPlayer({ initialLevel = 'Moderate', showLevelTabs = true }) {
  const [activeLevel, setActiveLevel] = useState(
    ['Moderate', 'High', 'Critical'].includes(initialLevel) ? initialLevel : 'Moderate'
  );
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (['Moderate', 'High', 'Critical'].includes(initialLevel)) {
      setActiveLevel(initialLevel);
      setVideoError(false);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [initialLevel]);

  const videoConfig = RISK_VIDEOS[activeLevel] || RISK_VIDEOS.Moderate;

  const handleTabChange = (lvl) => {
    setActiveLevel(lvl);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-gray-900/90 border border-slate-200 dark:border-gray-800 ${videoConfig.borderClass} text-left shadow-lg dark:shadow-xl transition-all duration-300`}>
      {/* Header and Level Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-gray-700/60">
            <Film className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {t('emergency.videoTitle', 'Community Guidance & Awareness Video')}
              </h4>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${videoConfig.badgeClass}`}>
                {videoConfig.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              {videoConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Tab switchers to preview Moderate, High, and Critical videos */}
        {showLevelTabs && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 self-start sm:self-auto">
            {['Moderate', 'High', 'Critical'].map((lvl) => {
              const isSelected = activeLevel === lvl;
              const col =
                lvl === 'Critical' ? 'text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-950/40' :
                lvl === 'High' ? 'text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-500/50 bg-orange-50 dark:bg-orange-950/40' :
                'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-950/40';
              const label = lang === 'hi'
                ? (lvl === 'Moderate' ? 'मध्यम' : lvl === 'High' ? 'उच्च' : 'गंभीर')
                : lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleTabChange(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                    isSelected ? col : 'text-slate-500 dark:text-gray-400 border-transparent hover:text-slate-800 dark:hover:text-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Container */}
      <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video border border-slate-300 dark:border-gray-800 mb-4 flex items-center justify-center">
        {videoConfig.youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoConfig.youtubeId}`}
            title={videoConfig.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={videoConfig.src}
            ref={videoRef}
            controls
            preload="metadata"
            className="w-full h-full object-contain"
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoError(false)}
          >
            <source src={videoConfig.src} type="video/mp4" />
            <source src={videoConfig.src.replace('.mp4', '.webm')} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Informative placeholder if video file hasn't been placed in /public/videos yet */}
        {videoError && (
          <div className="absolute inset-0 bg-slate-950/95 dark:bg-gray-950/95 p-6 flex flex-col items-center justify-center text-center space-y-3 z-10">
            <div className="p-3 rounded-full bg-brand-950/80 border border-brand-500/40 text-brand-300">
              <Video className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                Insert Your {activeLevel} Risk Video File
              </h5>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Copy your video into the project folder at:
              </p>
              <code className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-brand-300 text-xs font-mono">
                public{videoConfig.src}
              </code>
            </div>
            <p className="text-[11px] text-gray-500">
              Supported formats: <code>.mp4</code> or <code>.webm</code>. You can also configure a YouTube ID in <code>lib/riskVideos.js</code>.
            </p>
          </div>
        )}
      </div>

      {/* Recommended Protocols Checklist corresponding to video */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 text-xs space-y-2 mb-3">
        <p className="font-semibold text-slate-700 dark:text-gray-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" /> {lang === 'hi' ? 'प्रमुख वीडियो मुख्य बिंदु एवं सिफारिशें:' : 'Key Video Highlights & Recommendations:'}
        </p>
        <ul className="space-y-1 text-slate-600 dark:text-gray-300 text-xs list-disc pl-4">
          {videoConfig.keyPoints.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      </div>

      {/* More Solutions External Verified Links */}
      <div className="pt-3 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="text-slate-500 dark:text-gray-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" /> {lang === 'hi' ? 'अधिक समाधान एवं दिशानिर्देश:' : 'More Solutions & Guidelines:'}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://share.google/z6lwNJKpZUWuvEbeS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-[11px] font-medium transition-colors"
          >
            CDC Food Safety Manual <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://share.google/ZOqiUbKEsB2oSsVv3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium transition-colors"
          >
            खाद्य स्वच्छता दिशानिर्देश (हिंदी) <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
