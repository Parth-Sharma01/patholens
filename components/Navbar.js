'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Logo from '@/components/Logo';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ['food-safety', 'overview', 'calculator', 'dashboard', 'emergency', 'team'];
      const scrollPos = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { href: '#food-safety', label: lang === 'hi' ? 'खाद्य सुरक्षा' : 'Food Safety' },
    { href: '#overview', label: t('nav.overview', 'Overview') },
    { href: '#calculator', label: t('nav.calculator', 'Risk Calculator') },
    { href: '#dashboard', label: t('nav.dashboard', 'Dashboard') },
    { href: '#emergency', label: t('nav.emergency', 'Emergency & Hospitals') },
    { href: '#team', label: t('nav.team', 'Team') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800 shadow-md dark:shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group py-1"
            aria-label="PathoLens Home"
          >
            <Logo size="md" className="group-hover:scale-105 transition-transform" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => {
              const isActive = activeSection === l.href.replace('#', '');
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`px-3.5 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-white/10 font-bold'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {l.label}
                </a>
              );
            })}

            {/* Language Switcher Button */}
            <div className="ml-2 flex items-center bg-slate-100 dark:bg-gray-900/90 border border-slate-300 dark:border-gray-700/70 rounded-xl p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'hi'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Light / Dark Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/50 transition-all shadow-sm flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Clinical Lab Light Mode' : 'Switch to Bioluminescent Dark Mode'}
              aria-label="Toggle light or dark theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <a
              href="#calculator"
              className="ml-2 btn-primary text-xs px-3.5 py-2"
            >
              {t('nav.startAssessment', 'Start Assessment')}
            </a>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-gray-900 text-slate-700 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Mobile Language Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  lang === 'en' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-gray-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  lang === 'hi' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-gray-400'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <button
              className="p-2 rounded-lg text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer & backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative z-50 md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800 px-4 pb-4 shadow-xl"
            >
              {navLinks.map(l => {
                const isActive = activeSection === l.href.replace('#', '');
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex py-3 text-sm font-medium border-b border-slate-200/80 dark:border-gray-800/50 transition-colors ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 font-bold'
                        : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {l.label}
                  </a>
                );
              })}
              <a href="#calculator" onClick={() => setMenuOpen(false)} className="btn-primary mt-3 w-full justify-center">
                {t('nav.startAssessment', 'Start Assessment')}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}