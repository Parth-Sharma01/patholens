'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microscope, Dna, ShieldAlert, Droplets, Flame,
  Thermometer, Bug, Activity, FileText, CheckCircle2,
  AlertTriangle, MapPin, School, Cpu, BookOpen, ChevronRight,
  Info, Sparkles, Layers, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import PathogenModel from '@/components/PathogenModel';

const PATHOGENS = [
  {
    id: 'ecoli',
    name: 'Escherichia coli',
    strain: 'O157:H7 & ETEC',
    type: 'Gram-negative rod bacterium',
    color: 'from-emerald-500 to-teal-600',
    image: '/assets/microbe-green.jpg',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
    vector: 'Untreated natural springs (chashma/baori), open runoff, and unwashed hands prior to food preparation.',
    incubation: '12 – 72 Hours',
    symptoms: 'Watery or bloody diarrhoea, severe abdominal cramping, low-grade fever, rapid dehydration.',
    prevention: '1-minute vigorous boiling, RO membrane filtration, 20-second handwashing with soap post-defecation.',
    riskSection: 'Section B (Water Safety) & Section A (Personal Hygiene)',
    solanContext: 'Prevalent in rural Solan during monsoon when rainwater seeps into natural hillside aquifers.',
  },
  {
    id: 'salmonella',
    name: 'Salmonella enterica',
    strain: 'Serovar Typhimurium / Enteritidis',
    type: 'Gram-negative flagellated rod',
    color: 'from-amber-500 to-orange-600',
    image: '/assets/pathogen-badge.jpg',
    badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
    vector: 'Cross-contamination from raw poultry/meat, cracked eggs, unwashed chopping surfaces, and housefly transfer.',
    incubation: '6 – 48 Hours',
    symptoms: 'Acute gastroenteritis, high fever, chills, persistent nausea, projectile vomiting, mucus-laden stools.',
    prevention: 'Cook food to core temperature >74°C, separate raw and cooked cutting boards, sanitize cooking utensils.',
    riskSection: 'Section C (Food Handling & Cooking)',
    solanContext: 'Common in roadside eateries and rural kitchens with shared meat and vegetable preparation areas.',
  },
  {
    id: 'cereus',
    name: 'Bacillus cereus',
    strain: 'Emetic & Diarrhoeal strains',
    type: 'Gram-positive spore-forming rod',
    color: 'from-rose-500 to-red-600',
    image: '/assets/salad-bowl.jpg',
    badgeClass: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
    vector: 'Cooked rice, lentils, and khichdi stored overnight at room temperature (Danger Zone 5°C – 60°C). Spores survive initial cooking.',
    incubation: '1 – 6 Hours (Emetic) / 8 – 16 Hours (Diarrhoeal)',
    symptoms: 'Sudden projectile vomiting (heat-stable cereulide toxin), subsequent explosive diarrhea and cramps.',
    prevention: 'Consume cooked grain dishes within 2 hours or chill below 5°C immediately. Reheat thoroughly to 100°C.',
    riskSection: 'Section D (Food Storage & Danger Zone)',
    solanContext: 'Identified as high hazard in rural households lacking refrigeration storing afternoon rice for dinner.',
  },
  {
    id: 'staph',
    name: 'Staphylococcus aureus',
    strain: 'Enterotoxigenic strains A-E',
    type: 'Gram-positive spherical cocci in clusters',
    color: 'from-purple-500 to-indigo-600',
    image: '/assets/indian-meal.jpg',
    badgeClass: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
    vector: 'Direct touch contamination from skin lesions, nasal droplets, or unwashed hands onto dairy, cooked meals, and sweets.',
    incubation: '30 Minutes – 6 Hours (Ultra Rapid)',
    symptoms: 'Violent vomiting, severe stomach spasms, subnormal body temperature, weakness without prolonged fever.',
    prevention: 'Never prepare food with exposed cuts or skin sores; wash hands thoroughly; avoid finger-tasting dishes.',
    riskSection: 'Section A (Personal Hygiene) & Section C (Cooking)',
    solanContext: 'High contamination vector in shared festive meals and artisanal milk handling across villages.',
  },
  {
    id: 'giardia',
    name: 'Giardia lamblia & Norovirus',
    strain: 'Flagellated Protozoa / Calcivirus',
    type: 'Waterborne protozoan cysts / Non-enveloped RNA virus',
    color: 'from-blue-500 to-cyan-600',
    image: '/assets/molecule.jpg',
    badgeClass: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60',
    vector: 'Shallow hand-pumps, unfiltered stream taps, open water containers without covers, person-to-person spread.',
    incubation: '1 – 14 Days (Giardia) / 12 – 48 Hours (Norovirus)',
    symptoms: 'Persistent watery/greasy diarrhea, severe abdominal distension, sulfurous burping, extreme fatigue.',
    prevention: 'Boil water for >1 min or apply chlorine tablets; tightly cover all stored water utensils; use long-handled ladles.',
    riskSection: 'Section B (Water Safety) & Section F (Illness History)',
    solanContext: 'Primary driver of repeated village gastrointestinal illness outbreaks during seasonal transition periods.',
  },
];

const DOMAINS = [
  {
    key: 'hygiene',
    title: 'A. Personal Hygiene & Handwashing',
    titleHi: 'क. व्यक्तिगत स्वच्छता एवं हाथ धोना',
    max: 20,
    icon: Droplets,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80',
    desc: 'Assesses critical handwashing windows (pre-cooking, post-defecation, before meals) and soap usage vs plain water rinse.',
    descHi: 'शौच के बाद, खाना पकाने से पहले और भोजन से पूर्व साबुन से हाथ धोने की आदतों का मूल्यांकन करता है।',
    pathogenRisk: 'E. coli, Shigella, S. aureus transmission from hands to foodstuffs.',
  },
  {
    key: 'water',
    title: 'B. Drinking Water Safety & Interventions',
    titleHi: 'ख. पेयजल सुरक्षा एवं उपचार के तरीके',
    max: 25,
    icon: ShieldCheck,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/80',
    desc: 'Evaluates raw water source (chashma, hand pump, tap, river) and recognizes valid safe treatments: RO, UV, Boiling, Chlorine, and Candle Filters with source penalty caps.',
    descHi: 'प्राकृतिक चश्मों, हैंडपंप, नल और नदी के पानी का विश्लेषण; आरओ, यूवी, उबालने और क्लोरीन की सुरक्षा की पुष्टि।',
    pathogenRisk: 'Waterborne coliforms, Giardia cysts, and Campylobacter jejuni.',
  },
  {
    key: 'cooking',
    title: 'C. Food Handling & Cooking Practices',
    titleHi: 'ग. भोजन पकाना एवं क्रॉस-कंटैमिनेशन',
    max: 20,
    icon: Flame,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80',
    desc: 'Focuses on core heating temperatures, re-cooking leftover curries, washing raw salad vegetables, and keeping raw/cooked utensils separated.',
    descHi: 'उचित तापमान पर पकाना, बची हुई सब्जियों को दोबारा उबालना और कच्चे व पके भोजन के बर्तनों को अलग रखना।',
    pathogenRisk: 'Salmonella cross-contact and undercooked bacterial survival.',
  },
  {
    key: 'storage',
    title: 'D. Food Storage & Danger Zone Exposure',
    titleHi: 'घ. भोजन भंडारण एवं तापमान खतरा',
    max: 15,
    icon: Thermometer,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80',
    desc: 'Measures time cooked food sits in the 5°C–60°C Danger Zone, availability of refrigeration, and safe covering of pantry containers.',
    descHi: 'पके भोजन को सामान्य कमरे के तापमान (5°C–60°C) पर रखने की अवधि और फ्रिज की उपलब्धता का विश्लेषण।',
    pathogenRisk: 'Bacillus cereus emetic toxin and Clostridium spore proliferation.',
  },
  {
    key: 'environment',
    title: 'E. Kitchen Vectors & Sanitation',
    titleHi: 'ङ. रसोई का वातावरण एवं कीड़े-मकोड़े',
    max: 10,
    icon: Bug,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/80',
    desc: 'Audits presence of houseflies, open dustbins, rodents, and close proximity of cattle sheds or poultry coops to the family cooking hearth.',
    descHi: 'रसोई में मक्खियों, खुले कचरे, चूहों और पशुशाला की निकटता का वैज्ञानिक मूल्यांकन।',
    pathogenRisk: 'Mechanical vector transfer of fecal microorganisms onto ready-to-eat food.',
  },
  {
    key: 'history',
    title: 'F. Household GI Illness Morbidity',
    titleHi: 'च. गैस्ट्रोइंटेस्टाइनल बीमारी का पारिवारिक इतिहास',
    max: 10,
    icon: Activity,
    color: 'text-red-500 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/80',
    desc: 'Records 30-day prevalence of watery diarrhoea, recurrent vomiting, severe cramps, and school/work absenteeism across all household members.',
    descHi: 'पिछले 30 दिनों में परिवार में दस्त, उल्टी और पेट दर्द की घटनाओं का महामारी विज्ञान रिकॉर्ड।',
    pathogenRisk: 'Active household cluster transmission and immediate dehydration hazard.',
  },
];

const VILLAGE_CLUSTERS = [
  { name: 'Bajhol (Near Shoolini)', tier: 'High/Moderate', riskDesc: 'Campus perimeter; mixed natural chashma & private borehole supply.', surveys: 24 },
  { name: 'Sultanpur', tier: 'Moderate', riskDesc: 'Semi-urban hub; high tap water reliance with seasonal chlorination drops.', surveys: 28 },
  { name: 'Ochghat', tier: 'Moderate/Low', riskDesc: 'Elevated agricultural valley; traditional stone baori spring usage.', surveys: 19 },
  { name: 'Nauni', tier: 'Low/Moderate', riskDesc: 'Horticultural belt; filtered tap water with intermittent spring top-up.', surveys: 22 },
  { name: 'Kumarhatti & Shamlesh', tier: 'High', riskDesc: 'Transit junction; multiple roadside migrant dwellings with open water storage.', surveys: 26 },
  { name: 'Dharampur & Barog', tier: 'Moderate', riskDesc: 'Hilltop ridge; pipe freezing in winter and surface runoff during rains.', surveys: 21 },
  { name: 'Kotla, Deothi & Salogra', tier: 'High', riskDesc: 'Remote agrarian clusters; limited refrigeration and hand-pump dependency.', surveys: 35 },
  { name: 'Kandaghat, Saproon & Bhojnagar', tier: 'Moderate/Critical', riskDesc: 'Valley catchment with reported monsoon diarrhoeal spikes.', surveys: 50 },
];

export default function ProjectOverview() {
  const [activeTab, setActiveTab] = useState('pathogens');
  const [selectedPathogen, setSelectedPathogen] = useState(PATHOGENS[0]);
  const { lang, t } = useLanguage();

  return (
    <section id="overview" className="scroll-mt-16 py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 mb-3 shadow-xs">
            <School className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>SHOOLINI UNIVERSITY · SOCIAL PROJECT GROUP-4 (UDTE PARINDE)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lang === 'hi' ? 'परियोजना वैज्ञानिक रूपरेखा एवं रोगजनक विश्लेषण' : 'Project Scientific Framework & Pathogen Vectors'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-3 leading-relaxed">
            {lang === 'hi'
              ? 'सोलन जिले के 20 ग्रामीण गांवों और 225+ परिवारों में खाद्य जनित सूक्ष्मजीवों, जल संदूषण और बहु-कारकीय जोखिम का जमीनी स्तर पर अध्ययन।'
              : 'A micro-surveillance framework investigating foodborne bacteria, water contamination, and multi-domain compounding hazards across 225+ surveyed households in Solan District (HP).'}
          </p>

          {/* Interactive Navigation Pills */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm max-w-2xl mx-auto">
            {[
              { id: 'pathogens', label: lang === 'hi' ? '🧫 लक्षित रोगाणु' : '🧫 Target Pathogens', icon: Microscope },
              { id: 'domains', label: lang === 'hi' ? '📊 6 डोमेन' : '📊 6 Survey Domains', icon: Layers },
              { id: 'model', label: lang === 'hi' ? '📐 गुणन मॉडल' : '📐 Compounding Model', icon: Cpu },
              { id: 'villages', label: lang === 'hi' ? '📍 20 क्लस्टर' : '📍 20 Surveyed Clusters', icon: MapPin },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Targeted Pathogens */}
        {activeTab === 'pathogens' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left: Pathogen selector list */}
            <div className="lg:col-span-4 space-y-2.5">
              <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-brand-500" />
                {lang === 'hi' ? 'अध्ययन किए गए खाद्य जनित बैक्टीरिया:' : 'Investigated Foodborne Microbes:'}
              </p>
              {PATHOGENS.map(p => {
                const isSel = selectedPathogen.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPathogen(p)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSel
                        ? 'bg-white dark:bg-gray-900 border-brand-500 shadow-md ring-1 ring-brand-500/30'
                        : 'bg-white/70 dark:bg-gray-900/50 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-visible border border-slate-200 dark:border-gray-700/80 shrink-0 bg-slate-900/95 flex items-center justify-center p-1 shadow-sm">
                        <PathogenModel id={p.id} size="sm" animated={isSel} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white italic block leading-tight">
                          {p.name}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono mt-0.5">
                          {p.strain}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${isSel ? 'text-brand-500 translate-x-1' : 'text-slate-400 dark:text-gray-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right: Pathogen Detailed Dossier Card with BIG Animated Visualizer */}
            <div className="lg:col-span-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-gray-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-gray-700/80 bg-slate-900/95 flex items-center justify-center p-1 shrink-0 shadow-md">
                      <PathogenModel id={selectedPathogen.id} size="sm" animated={true} />
                    </div>
                    <div>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${selectedPathogen.badgeClass}`}>
                        {selectedPathogen.type}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white italic mt-1 leading-tight">
                        {selectedPathogen.name}
                      </h3>
                      <p className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                        PathoLens Strain Profile: {selectedPathogen.strain}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider font-semibold block">
                      Incubation Period
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-700 inline-block mt-1">
                      ⏱️ {selectedPathogen.incubation}
                    </span>
                  </div>
                </div>

                {/* Main Content Layout with BIG Animated Showcase */}
                <div className="grid lg:grid-cols-12 gap-8 items-center mb-6">
                  {/* Left: Clinical and Field Specs */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Bug className="w-3.5 h-3.5 text-rose-500" /> Rural Transmission Vector
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                        {selectedPathogen.vector}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-500" /> Clinical Presentation
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                        {selectedPathogen.symptoms}
                      </p>
                    </div>

                    {/* Shoolini / Solan Field Context */}
                    <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80">
                      <p className="text-xs font-bold text-brand-800 dark:text-brand-300 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        Shoolini Rural Solan Field Observation:
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                        {selectedPathogen.solanContext}
                      </p>
                    </div>
                  </div>

                  {/* Right: BIG Animated Pathogen Visualizer (User Requested!) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                      {/* Bioluminescent Pulsating Aura */}
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.35, 0.7, 0.35],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/25 via-emerald-400/20 to-teal-500/20 blur-2xl"
                      />

                      {/* Rotating Outer Reticle Rings */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 rounded-full border border-dashed border-brand-500/30 dark:border-brand-400/30 pointer-events-none"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-6 rounded-full border border-dotted border-emerald-500/20 pointer-events-none"
                      />

                      {/* Floating Microbial Biological Vector Model Container */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 2, -2, 0],
                        }}
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-brand-300 dark:border-brand-500/50 shadow-2xl bg-slate-950 flex items-center justify-center p-3 group cursor-pointer"
                      >
                        <PathogenModel id={selectedPathogen.id} size="dossier" animated={true} />

                        {/* Scanline & Glint Overlay */}
                        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                          LIVE BIOLOGICAL MODEL
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center text-white text-[10px] font-semibold bg-black/75 backdrop-blur-xs py-1 px-2 rounded-xl border border-white/10">
                          🔬 Morphology: {selectedPathogen.type}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Prevention Protocol Bottom Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-slate-600 dark:text-gray-300 font-medium">
                      <strong>Prevention:</strong> {selectedPathogen.prevention}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 whitespace-nowrap">
                    Mapped to: {selectedPathogen.riskSection}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: The 6 Research Domains */}
        {activeTab === 'domains' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {DOMAINS.map(d => {
              const Icon = d.icon;
              return (
                <div
                  key={d.key}
                  className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:border-brand-400 dark:hover:border-brand-600 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${d.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300">
                        Max: {d.max} pts
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                      {lang === 'hi' ? d.titleHi : d.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
                      {lang === 'hi' ? d.descHi : d.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-gray-800/80">
                    <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400">
                      ⚡ <strong>Pathogen Link:</strong> {d.pathogenRisk}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Tab 3: Multiplicative Compounding Hazard Model */}
        {activeTab === 'model' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-xl"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  EPIDEMIOLOGICAL MATHEMATICAL LOGIC
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Why Multiplicative Compounding Outperforms Additive Sums
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  In traditional additive risk scoring, a household consuming untreated river water heavily contaminated with <em>E. coli</em> could still be marked "Low Risk" simply because they wash their hands and have a clean kitchen.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  Our project replaces linear addition with a <strong>Multiplicative Compounding Model</strong>. If water hazard reaches 100%, total risk compounds severely toward Critical, accurately modeling the biological reality of single-point pathogen exposure.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 font-mono text-xs text-slate-800 dark:text-gray-200 space-y-1 overflow-x-auto">
                  <p className="text-brand-600 dark:text-brand-400 font-bold">R_total = 100 × ( 1 - ∏ [ 1 - h_i ] )</p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">Where h_i = s_i / m_i (Section penalty points / Section maximum)</p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">Sections sum to exactly 100 max: 20 + 25 + 20 + 15 + 10 + 10</p>
                </div>
              </div>

              <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-2">
                    ❌ Flawed Additive Model
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-gray-300 space-y-2">
                    <li>• River water: 8 / 25 pts</li>
                    <li>• Safe cooking & storage: 0 pts</li>
                    <li>• Total = 8/100 (False "Low Risk")</li>
                    <li className="text-[11px] text-red-600 dark:text-red-400 font-semibold pt-1">
                      ⚠️ Ignores life-threatening microbial load in raw untreated water.
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                    ✅ PathoLens Compounding Model
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-gray-300 space-y-2">
                    <li>• Water hazard compounds directly</li>
                    <li>• Source + Treatment sensitivity</li>
                    <li>• Consistent RO/Boil caps penalty</li>
                    <li className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                      🛡️ Realistically predicts outbreaks and routes critical households to 108.
                    </li>
                  </ul>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-gray-300 font-semibold">
                    Cutoffs: Critical ≥ 70 · High ≥ 45 · Moderate ≥ 25 · Low &lt; 25
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    100% Deterministic
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: 20 Surveyed Rural Clusters (Solan) */}
        {activeTab === 'villages' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {VILLAGE_CLUSTERS.map((v, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400">
                      Cluster {i + 1}
                    </span>
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                      {v.surveys} Surveys
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                    {v.name}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed mb-3">
                    {v.riskDesc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-wider font-semibold">
                    Observed Tier:
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {v.tier}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
