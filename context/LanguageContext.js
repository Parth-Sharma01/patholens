'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key, fallback) => fallback || key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('patholens_language');
      if (saved === 'hi' || saved === 'en') {
        setLang(saved);
      }
    } catch (e) {
      // Ignore localStorage error if cookies disabled
    }
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('patholens_language', newLang);
    } catch (e) {}
  };

  const toggleLang = () => {
    changeLang(lang === 'en' ? 'hi' : 'en');
  };

  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let cur = translations[lang];
    for (const k of keys) {
      if (cur && cur[k] !== undefined) {
        cur = cur[k];
      } else {
        // Fallback to english translation if missing in target language
        let fallbackCur = translations.en;
        for (const fk of keys) {
          if (fallbackCur && fallbackCur[fk] !== undefined) {
            fallbackCur = fallbackCur[fk];
          } else {
            return fallback || path;
          }
        }
        return fallbackCur || fallback || path;
      }
    }
    return cur;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
