'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Droplets, Flame, Snowflake, AlertTriangle, CheckCircle2,
  ChevronRight, Sparkles, Search, Info, Thermometer, Bug, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import PathogenModel from '@/components/PathogenModel';

export default function FoodSafetyHub() {
  const { lang, t } = useLanguage();
  const [selectedPractice, setSelectedPractice] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Food Safety Best Practices (Directly inspired by user reference mockups)
  const PRACTICES = [
    {
      id: 'hands',
      title: 'Clean Hands',
      titleHi: 'हाथों की स्वच्छता',
      subtitle: '20-second soap scrub before touching food',
      subtitleHi: 'खाना छूने से पहले 20 सेकंड साबुन से धोएं',
      image: '/assets/handwash.jpg',
      badge: 'Critical 80% Reduction',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
      description:
        'Vigorous 20-second handwashing with soap under running water eliminates 99.4% of transient enteric pathogens including E. coli and Salmonella. In rural Solan, washing with plain water without soap was observed in 38% of households, allowing bacteria to transfer directly onto raw vegetables and cooking utensils.',
      solanInsight: '38% of surveyed households rinsed with plain water only; switching to soap drops diarrheal risk by 47%.',
      tips: [
        'Lather backs of hands, between fingers, and under nails.',
        'Always wash post-defecation, before food prep, and after handling raw meat.',
        'Dry with a clean cloth or air dry; avoid wiping on soiled clothing.',
      ],
      impactDomain: 'Section A: Personal Hygiene (-18 Risk Pts)',
    },
    {
      id: 'surface',
      title: 'Sanitize Surfaces',
      titleHi: 'सफाई व कीटाणुशोधन',
      subtitle: 'Disinfect cutting boards & slabs',
      subtitleHi: 'कटिंग बोर्ड और स्लैब को कीटाणुरहित करें',
      image: '/assets/surface-clean.jpg',
      badge: 'Cross-Contamination Barrier',
      badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/40',
      description:
        'Food preparation surfaces, knives, and chopping boards can harbor persistent microbial biofilms. Cross-contamination between raw meats and ready-to-eat salads is one of the highest drivers of food poisoning outbreaks in home kitchens.',
      solanInsight: 'Wooden boards without sanitization showed 4.2x higher microbial biofilm persistence.',
      tips: [
        'Use separate cutting boards for raw meat/poultry and fresh produce/dairy.',
        'Wash surfaces with warm soapy water immediately after prepping raw food.',
        'Sanitize countertops periodically with mild vinegar or chlorine solution.',
      ],
      impactDomain: 'Section E: Kitchen Environment (-15 Risk Pts)',
    },
    {
      id: 'cooking',
      title: 'Thorough Cooking',
      titleHi: 'भरपूर पकाना (>74°C)',
      subtitle: 'Heat destroys 99% of vegetative bacteria',
      subtitleHi: 'तापमान 99% बैक्टीरिया को नष्ट करता है',
      image: '/assets/lab-technician.jpg',
      badge: 'Thermal Sterilization',
      badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40',
      description:
        'Cooking foods to an internal core temperature of 74°C (165°F) completely inactivates vegetative Salmonella, E. coli O157:H7, and Campylobacter. For stews, lentils, and curries, bring to a full rolling boil before serving.',
      solanInsight: 'Undercooked festive meats or quick-reheated curries account for 52% of acute gastro episodes in rural clusters.',
      tips: [
        'Ensure thick curries and meats are bubbling hot all the way through.',
        'Boil mountain stream water for at least 1 full minute before drinking.',
        'Reheat stored leftovers to steaming hot (>74°C), never just lukewarm.',
      ],
      impactDomain: 'Section C: Food Handling & Cooking (-22 Risk Pts)',
    },
    {
      id: 'storage',
      title: 'Safe Cold Storage',
      titleHi: 'सुरक्षित प्रशीतन (<4°C)',
      subtitle: 'Halt bacterial division in the danger zone',
      subtitleHi: 'डेंजर ज़ोन (5°C–60°C) से भोजन को बचाएं',
      image: '/assets/salad-bowl.jpg',
      badge: 'Danger Zone Shield',
      badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40',
      description:
        'The danger zone between 5°C and 60°C allows bacteria like Bacillus cereus and Staphylococcus to double every 20 minutes. Storing cooked rice, lentils, or milk overnight at room temperature in mountain kitchens produces heat-stable enterotoxins that cannot be cooked out.',
      solanInsight: '48% of surveyed households left afternoon rice at room temp for dinner; 18 households reported emetic vomiting.',
      tips: [
        'Refrigerate cooked perishables within 2 hours of preparation.',
        'Store ready-to-eat foods on the top shelf, raw meats covered on bottom.',
        'Never consume cooked rice or pulses left at room temperature overnight.',
      ],
      impactDomain: 'Section D: Food Storage (-18 Risk Pts)',
    },
    {
      id: 'water',
      title: 'Mountain Water Safety',
      titleHi: 'पहाड़ी पेयजल सुरक्षा',
      subtitle: 'Boil or filter natural spring chashma',
      subtitleHi: 'प्राकृतिक चश्मों और बाओड़ी के पानी को उबालें',
      image: '/assets/handwash.jpg',
      badge: 'Hydro-Barrier',
      badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/40',
      description:
        'In rural Solan, natural hill springs (chashma and baori) receive seasonal runoff containing livestock coliforms and protozoan cysts (Giardia, Cryptosporidium). Unfiltered direct consumption causes recurrent seasonal diarrhea across whole village clusters.',
      solanInsight: '62% of households drink directly from chashma/tanks without boiling or membrane filtration.',
      tips: [
        'Boil daily drinking water for at least 60 seconds.',
        'Keep water storage pots tightly covered with clean lids and dedicated ladles.',
        'Clean domestic storage tanks (sintex) every 3 months with mild bleaching powder.',
      ],
      impactDomain: 'Section B: Water Safety (-25 Risk Pts)',
    },
    {
      id: 'freshness',
      title: 'Freshness & Recall Checks',
      titleHi: 'ताजगी व खराबी की जांच',
      subtitle: 'Inspect odor, slime, mold & integrity',
      subtitleHi: 'गंध, चिपचिपाहट और फफूंद की तुरंत जांच करें',
      image: '/assets/fresh-produce.jpg',
      badge: 'Quality Control',
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/40',
      description:
        'Sensory inspection of fresh produce, milk, and canned goods prevents ingestion of deteriorated foods. Bulging cans, rancid smell in oils, sour odor in dairy, or slimy surface on poultry indicate severe bacterial spoilage.',
      solanInsight: 'Purchasing unsealed, discount packaged foods from roadside stalls correlated with repeated cluster cases.',
      tips: [
        'Discard any canned product with bulging, dented seams, or rust.',
        'Wash fresh vegetables thoroughly in clean potable water before consumption.',
        'Reject milk that curdles upon gentle heating; it indicates high bacterial load.',
      ],
      impactDomain: 'Section F: Illness Prevention & Habits (-12 Risk Pts)',
    },
  ];

  // Food categories matrix from mockups (Vegetables, Meats, Dairy, Grains, Canned)
  const FOOD_ITEMS = [
    {
      id: 'veg',
      name: 'Fresh Vegetables & Leafy Greens',
      nameHi: 'ताजी सब्जियां व पत्तेदार साग',
      category: 'produce',
      pathogenId: 'ecoli',
      risk: 'Moderate Risk',
      riskColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/60',
      pathogens: ['E. coli', 'Norovirus', 'Listeria'],
      image: '/assets/fresh-produce.jpg',
      source: 'Runoff from mountain slopes, animal manure, unwashed hands.',
      prevention: 'Wash thoroughly under clean potable water; peel or cook.',
      solanStat: 'Raw salads prepared with unwashed spring water showed high coliform counts in 14 villages.',
    },
    {
      id: 'meat',
      name: 'Raw Poultry & Butchered Meats',
      nameHi: 'कच्चा चिकन व मांस',
      category: 'meats',
      pathogenId: 'salmonella',
      risk: 'High Risk',
      riskColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700/60',
      pathogens: ['Salmonella', 'Campylobacter', 'C. perfringens'],
      image: '/assets/surface-clean.jpg',
      source: 'Internal animal viscera, non-refrigerated roadside stalls.',
      prevention: 'Never wash under open splashing tap; cook to >74°C internal core temp.',
      solanStat: '92% of households prepare meat and vegetables on the same kitchen platform.',
    },
    {
      id: 'dairy',
      name: 'Unboiled Milk, Curd & Sweets',
      nameHi: 'कच्चा दूध, दही व पारंपरिक मिठाइयां',
      category: 'dairy',
      pathogenId: 'staph',
      risk: 'High Risk',
      riskColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700/60',
      pathogens: ['Staphylococcus aureus', 'Listeria', 'Brucella'],
      image: '/assets/indian-meal.jpg',
      source: 'Bovine udder flora, unpasteurized milk handling, bare hand mixing.',
      prevention: 'Bring raw milk to a rolling boil; consume curd within 24h or refrigerate.',
      solanStat: 'Direct consumption of raw goat/cow milk caused recurrent gastric distress in 12% of surveyed farms.',
    },
    {
      id: 'rice',
      name: 'Cooked Rice, Khichdi & Leftover Dals',
      nameHi: 'पका हुआ चावल, खिचड़ी व बची हुई दाल',
      category: 'grains',
      pathogenId: 'cereus',
      risk: 'Moderate Risk (Overnight)',
      riskColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/60',
      pathogens: ['Bacillus cereus (Emetic & Diarrhoeal)'],
      image: '/assets/salad-bowl.jpg',
      source: 'Spore-forming Bacillus survives initial boiling and blooms at room temperature.',
      prevention: 'Eat within 2 hours or chill below 4°C immediately. Reheat to boiling.',
      solanStat: 'Afternoon leftover rice kept at room temperature was the #1 cause of sudden vomiting spells.',
    },
    {
      id: 'canned',
      name: 'Sealed, Packaged & Canned Goods',
      nameHi: 'सील बंद व डिब्बाबंद खाद्य पदार्थ',
      category: 'packaged',
      pathogenId: 'giardia',
      risk: 'Low Risk',
      riskColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/60',
      pathogens: ['Clostridium botulinum (only in damaged cans)'],
      image: '/assets/molecule.jpg',
      source: 'Dented seams, punctured vacuum seals, expired batches.',
      prevention: 'Inspect can seal; reject bulging, leaking, or rusted cans.',
      solanStat: 'Commercial sealed goods showed minimal microbial risk when FSSAI seal is intact.',
    },
  ];

  const filteredFoods = FOOD_ITEMS.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesQuery =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.pathogens.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const activeP = PRACTICES[selectedPractice];

  return (
    <section id="food-safety" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200 dark:border-gray-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-600/40 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{lang === 'hi' ? 'खाद्य सुरक्षा एवं रोगजनक निगरानी' : 'FOOD SAFETY & PATHOGEN SURVEILLANCE'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lang === 'hi' ? 'अपने भोजन को पहचानें, जोखिम कम करें।' : 'Know Your Food. Reduce Your Risk.'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'शूलिनी विश्वविद्यालय के 20 ग्रामीण क्लस्टरों के अध्ययन पर आधारित व्यवहारिक खाद्य सुरक्षा नियम एवं बैक्टीरिया प्रसार रोकथाम गाइड।'
                : 'Field-tested community hygiene pillars, daily food vulnerability matrix, and pathogen containment practices derived from 225+ Shoolini rural households.'}
            </p>
          </div>

          {/* Quick link button to calculator */}
          <a
            href="#calculator"
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-900/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'hi' ? 'व्यक्तिगत जोखिम की जांच करें' : 'Check My Household Score'}</span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </a>
        </div>

        {/* 6 Food Safety Best Practices — Horizontal Scroll / Grid (Mockup Style) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              {lang === 'hi' ? 'खाद्य सुरक्षा के 6 मुख्य नियम' : '6 Core Food Safety Best Practices'}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-gray-500 font-medium">
              {lang === 'hi' ? 'विस्तार देखने के लिए किसी भी नियम पर क्लिक करें' : 'Click any pillar to inspect field guidelines'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PRACTICES.map((p, idx) => {
              const isSelected = selectedPractice === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPractice(idx)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                    isSelected
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200/80 dark:border-gray-800 bg-slate-100 dark:bg-gray-800 shrink-0">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 font-mono">0{idx + 1}</span>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white'}`}>
                      {lang === 'hi' ? p.titleHi : p.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 line-clamp-1 mt-1">
                      {lang === 'hi' ? p.subtitleHi : p.subtitle}
                    </p>
                  </div>

                  {/* Active dot indicator */}
                  {isSelected && (
                    <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Expanded Practice Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeP.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900/90 border border-brand-200 dark:border-brand-900/50 shadow-xl shadow-brand-950/5 relative overflow-hidden"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${activeP.badgeColor}`}>
                      {activeP.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                      {activeP.impactDomain}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {lang === 'hi' ? activeP.titleHi : activeP.title} — {lang === 'hi' ? activeP.subtitleHi : activeP.subtitle}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                    {activeP.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span><strong>{lang === 'hi' ? 'सोलन फील्ड निष्कर्ष' : 'Solan Rural Field Finding'}:</strong> {activeP.solanInsight}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-gray-300">
                      {lang === 'hi' ? 'कार्यवाही योग्य सुरक्षा उपाय' : 'Actionable Safety Guidelines'}:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {activeP.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200/80 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
                    {/* Pulsating Ambient Glow */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.65, 0.35] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-2 rounded-3xl bg-brand-500/20 dark:bg-brand-400/25 blur-2xl pointer-events-none"
                    />

                    {/* Big Floating Illustrated Card */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-brand-300 dark:border-brand-500/50 shadow-2xl bg-white dark:bg-gray-800 group"
                    >
                      <img
                        src={activeP.image}
                        alt={activeP.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/logo-icon.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Floating Microbe Sticker in Corner (From Mockup 1) */}
                      <motion.div
                        animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-white/80 dark:border-gray-900 shadow-lg bg-slate-950 flex items-center justify-center p-0.5"
                      >
                        <PathogenModel id="ecoli" size="sm" animated={true} />
                      </motion.div>

                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold text-center bg-black/65 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
                        ✨ PathoLens Field Protocol #{selectedPractice + 1}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Part B: Food Category Risk Matrix (Directly from Mockup 1 & 4) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'लोकप्रिय खाद्य श्रेणियां व रोगजनक संवेदनशीलता' : 'Popular Food Categories & Pathogen Matrix'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-0.5">
                {lang === 'hi' ? 'दैनिक उपभोग के खाद्य पदार्थों में बैक्टीरिया के जोखिम स्तर और सुरक्षा उपाय।' : 'Vulnerability rating, bacterial vectors, and prevention guidelines across daily food groups.'}
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'सब्जी, चिकन, दूध खोजें...' : 'Search food or pathogen...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 w-44 sm:w-56"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-gray-800 p-1 rounded-xl">
                {[
                  { id: 'all', label: lang === 'hi' ? 'सभी' : 'All' },
                  { id: 'produce', label: lang === 'hi' ? 'सब्जियां' : 'Produce' },
                  { id: 'meats', label: lang === 'hi' ? 'मांस' : 'Meats' },
                  { id: 'dairy', label: lang === 'hi' ? 'दूध/डेयरी' : 'Dairy' },
                  { id: 'grains', label: lang === 'hi' ? 'अनाज' : 'Grains' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeCategory === tab.id
                        ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Food Cards Grid with BIG Animated Images */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map(food => (
              <div
                key={food.id}
                className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all flex flex-col justify-between shadow-sm hover:shadow-xl group overflow-hidden"
              >
                <div>
                  {/* BIG Visual Banner with Floating Microbe Sticker (From Mockup 1) */}
                  <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-gray-800 bg-slate-100 dark:bg-gray-800 mb-4">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo-icon.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Risk Badge in top corner */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-md backdrop-blur-xs ${food.riskColor} bg-white/90 dark:bg-gray-950/90`}>
                        {food.risk}
                      </span>
                    </div>

                    {/* Animated Floating Microbe Model Sticker (Directly from Mockup 1) */}
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        rotate: [0, 8, -8, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full border-2 border-white/90 dark:border-gray-900 shadow-xl bg-slate-950 flex items-center justify-center p-0.5"
                    >
                      <PathogenModel id={food.pathogenId || 'ecoli'} size="sm" animated={true} />
                    </motion.div>

                    {/* Bottom Category Label */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-bold drop-shadow-md">
                      {lang === 'hi' ? food.nameHi : food.name}
                    </div>
                  </div>

                  {/* Pathogen Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {food.pathogens.map((path, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700"
                      >
                        <Bug className="w-2.5 h-2.5 text-rose-500" />
                        {path}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-gray-400 mb-2 leading-relaxed">
                    <strong className="text-slate-800 dark:text-gray-200">{lang === 'hi' ? 'संक्रमण का जरिया' : 'Contamination Vector'}:</strong> {food.source}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-gray-800 mt-3 space-y-2">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>{lang === 'hi' ? 'रोकथाम' : 'Prevention'}:</strong> {food.prevention}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-500 italic bg-slate-50 dark:bg-gray-950/60 p-2 rounded-xl border border-slate-200/50 dark:border-gray-800/80">
                    "{food.solanStat}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}