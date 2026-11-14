'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall, ShieldAlert, MapPin, Clock, Stethoscope,
  Ambulance, AlertTriangle, ExternalLink, CheckCircle2, ChevronRight
} from 'lucide-react';
import {
  EMERGENCY_HELPLINES, NEARBY_HOSPITALS, CRITICAL_TRIAGE_ACTIONS, getHospitalsForVillage
} from '@/lib/emergencyHospitals';
import RiskVideoPlayer from '@/components/RiskVideoPlayer';
import { useLanguage } from '@/context/LanguageContext';

export default function EmergencySection() {
  const [selectedVillage, setSelectedVillage] = useState('All');
  const { lang, t } = useLanguage();

  const filteredHospitals = selectedVillage === 'All'
    ? NEARBY_HOSPITALS
    : getHospitalsForVillage(selectedVillage);

  const villageOptions = [
    'All',
    'Bajhol (Near Shoolini)',
    'Sultanpur',
    'Ochghat',
    'Shamlesh',
    'Nauni',
    'Kumarhatti',
    'Dharampur',
    'Barog',
    'Deothi',
    'Kotla',
    'Salogra',
    'Saproon',
    'Chambaghat',
    'Kandaghat',
    'Bhojnagar',
    'Koro',
    'Basal',
    'Anji',
    'Kather',
    'Patti',
  ];

  return (
    <section id="emergency" className="scroll-mt-16 py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 animate-ping" />
              {t('emergency.badge', 'CRITICAL MEDICAL RESPONSE & HOSPITAL NETWORK')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('emergency.title', 'Emergency Care & Nearby Hospitals')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-2 max-w-2xl">
              {t('emergency.subtitle', 'Instant 24x7 medical directory, ambulance response, and clinical centers serving Shoolini University, Solan town, and all 20 surveyed rural clusters.')}
            </p>
          </div>

          {/* Quick Helpline Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:108"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/20 dark:shadow-red-900/30 transition-all"
            >
              <Ambulance className="w-4 h-4" />
              <span>{t('emergency.dial108Btn', 'Call 108 Ambulance')}</span>
            </a>
            <a
              href="tel:104"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 hover:border-brand-500 text-slate-800 dark:text-gray-200 font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>{lang === 'hi' ? 'स्वास्थ्य हेल्पलाइन 104' : 'Helpline 104'}</span>
            </a>
          </div>
        </div>

        {/* 24x7 Helplines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {EMERGENCY_HELPLINES.map((h, i) => (
            <motion.a
              key={i}
              href={h.tel}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 hover:border-red-500/50 shadow-sm dark:shadow-none transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">{h.name}</span>
                  <PhoneCall className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:text-red-500 transition-colors" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors">
                  {h.number}
                </p>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-2 leading-relaxed">{h.desc}</p>
            </motion.a>
          ))}
        </div>

        {/* Village Proximity Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 shadow-sm dark:shadow-none mb-8">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-brand-500 dark:text-brand-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'अपने गांव के नजदीकी स्वास्थ्य केंद्र खोजें' : 'Find Closest Healthcare Center for Your Village'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                {lang === 'hi' ? 'सोलन जिले में गांव की दूरी के अनुसार अस्पताल खोजें' : 'Filter hospitals by village proximity in Solan District'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-gray-400 hidden sm:inline">
              {t('emergency.filterVillage', 'Select Village:')}
            </span>
            <select
              value={selectedVillage}
              onChange={e => setSelectedVillage(e.target.value)}
              className="select text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white w-48 sm:w-60 focus:border-brand-500 outline-none"
            >
              {villageOptions.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital Directory Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredHospitals.map(h => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-6 rounded-3xl bg-white dark:bg-gray-900/70 border flex flex-col justify-between shadow-sm dark:shadow-none transition-all ${
                h.isTopReferral
                  ? 'border-brand-500/50 shadow-lg shadow-brand-500/10 dark:shadow-brand-950/20 ring-1 ring-brand-500/30'
                  : 'border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
                    {h.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-500 dark:text-brand-400" /> 24x7
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">{h.name}</h3>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {h.distance}
                </p>
                <p className="text-xs text-slate-600 dark:text-gray-400 mb-4 leading-relaxed">{h.address}</p>

                {/* Key Facilities */}
                <div className="space-y-1 mb-5">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                    {lang === 'hi' ? 'उपलब्ध सुविधाएं' : 'Facilities'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {h.facilities.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-transparent">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-gray-800/80 flex gap-2">
                <a
                  href={`tel:${h.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 btn-primary justify-center text-xs py-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> {lang === 'hi' ? 'कॉल करें' : 'Call'}: {h.phone}
                </a>
                {h.emergencyPhone && h.emergencyPhone !== h.phone && (
                  <a
                    href={`tel:${h.emergencyPhone.replace(/[^0-9+]/g, '')}`}
                    className="btn-outline text-xs px-2.5 py-2 border-red-500/40 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                    title={`Emergency Line: ${h.emergencyPhone}`}
                  >
                    {lang === 'hi' ? 'आपातकालीन' : 'Emergency'}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Critical Triage & Immediate First-Aid Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-50 via-white to-slate-50 dark:from-red-950/40 dark:via-gray-900 dark:to-gray-950 border border-red-200 dark:border-red-900/50 shadow-xl dark:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/60 border border-red-300 dark:border-red-700 flex items-center justify-center text-red-600 dark:text-red-300 flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('emergency.triageTitle', 'Emergency Protocol for Critical Foodborne Illness & Outbreaks')}
              </h3>
              <p className="text-xs sm:text-sm text-red-700 dark:text-red-300/80">
                {t('emergency.triageSub', 'Mandatory frontline action when severe diarrhoea, projectile vomiting, or multiple sick household members occur.')}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CRITICAL_TRIAGE_ACTIONS.map(action => (
              <div
                key={action.step}
                className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-slate-200 dark:border-gray-800/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-xl bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700/60 text-red-700 dark:text-red-300 font-bold text-xs flex items-center justify-center mb-3">
                    0{action.step}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1.5">
                    {lang === 'hi' && action.title_hi ? action.title_hi : action.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed">
                    {lang === 'hi' && action.desc_hi ? action.desc_hi : action.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-gray-400">
            <span>
              {lang === 'hi'
                ? 'मरीज के अत्यधिक निर्जलीकरण या बेहोशी की स्थिति में देर न करें: तुरंत 108 पर एम्बुलेंस बुलाएं।'
                : 'In case of severe patient dehydration or unconsciousness, do not delay: immediately dispatch an ambulance via 108.'}
            </span>
            <a
              href="tel:108"
              className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold underline"
            >
              {lang === 'hi' ? '108 आपातकालीन एम्बुलेंस को अभी कॉल करें' : 'Dial 108 Emergency Ambulance Now'}{' '}
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Video Protocol Guides */}
        <div className="mt-12">
          <RiskVideoPlayer initialLevel="Critical" showLevelTabs={true} />
        </div>
      </div>
    </section>
  );
}
