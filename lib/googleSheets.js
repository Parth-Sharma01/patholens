/**
 * lib/googleSheets.js — Data Ingestion Pipeline & Analytics Engine
 * Integrates live Google Form CSV or 220+ Shoolini University Village Dataset.
 */

import { parseCSV } from './csv.js';
import { calculateRisk } from './risk.js';
import { generateShooliniDataset, SHOOLINI_VILLAGES } from './shooliniVillagesData.js';
import { getAll } from './assessmentsStore.js';

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = (parseInt(process.env.SHEET_CACHE_SECONDS) || 300) * 1000;

const QUESTION_PATTERNS = {
  // A. Hygiene
  handwashBeforeCooking: ['khana banane se pehle', 'haath wash karte hain', 'soap aur water se haath'],
  handwashDuringCooking: ['khana banate waqt', 'wajah se haath wash', 'cooking ke dauran'],
  handwashAfterToilet:   ['toilet use karne ke baad', 'toilet ke baad'],
  handwashAfterRawFood:  ['kachche food', 'meat, chicken', 'handle karne ke baad'],
  handCutsWounds:        ['cuts, wounds', 'haathon par cuts', 'sores hote hain'],
  hairCovering:          ['baal cover', 'dupatta/cap', 'cooking ke time baal'],
  handDryingMethod:      ['clean cloth/towel', 'dry karte hain', 'haath dry'],

  // B. Water Safety
  waterSource:           ['drinking water ka main source', 'main source kya hai', 'water source'],
  waterTreatment:        ['boil ya filter karte hain', 'use karne se pehle boil'],
  waterStorage:          ['kis tarah store karte hain', 'drinking water ko kis tarah store'],
  waterHandlingUtensil:  ['paani nikalne ke liye', 'clean utensil', 'glass koi clean'],
  waterContainerCleaning:['container ko regularly clean', 'storage container ko regularly'],
  cookingWaterSameSource:['khana banane ke liye use hone wala water', 'same source se aata hai'],

  // C. Food Handling & Cooking
  separateRawCooked:     ['raw aur cooked food ko preparation', 'alag rakhte hain'],
  crossContamKnifeBoard: ['same knife ya chopping board', 'knife ya chopping board'],
  washVegFruits:         ['vegetables aur fruits ko', 'khane ya cooking se pehle wash'],
  cookMeatEggsProperly:  ['meat/chicken/eggs ko properly cook', 'properly cook karke serve'],
  coverFoodCooking:      ['dust aur flies', 'makhiyon se bachane', 'food ko dust'],
  dishwashSoapLiquid:    ['utensils ko wash karne ke liye soap', 'dishwashing liquid'],
  boilMilk:              ['milk ko boil', 'doodh ubalna'],

  // D. Food Storage
  hasFridge:             ['refrigerator/fridge available', 'fridge available hai'],
  fridgeRawCookedSeparated: ['raw aur cooked food ko fridge mein alag', 'fridge mein alag'],
  roomTempStorageDuration: ['room temperature par generally kitni der', 'kitni der tak rakhte hain'],
  reheatLeftoversProperly: ['leftover food', 'properly reheat', 'garam karte hain'],
  coverLeftoverFood:     ['leftover food ko covered container', 'covered container mein store'],
  dryFoodStorageCovered: ['dry foods (atta, rice', 'covered place mein store'],
  consumeMouldyFood:     ['fungus/mould dikhai de', 'consume karte hain'],
  checkExpiryDate:       ['expiry date', 'spoilage check'],

  // E. Kitchen Environment
  fliesInKitchen:        ['flies/makhiyan kitni frequently', 'makhiyan kitni frequently'],
  wasteDisposalBin:      ['food waste/garbage usually kahan', 'garbage usually kahan'],
  petsNearKitchen:       ['pets/animals kitchen', 'pets kitchen'],

  // F. History
  recentDiarrhoea:       ['diarrhoea/loose motion hua tha', 'diarrhoea hua tha'],
  recentVomitingNausea:  ['vomiting (ulti)', 'nausea ya stomach pain', 'ulti'],
  multipleMembersIll:    ['2 ya usse zyada members', 'multiple members'],
  doctorTreatmentTaken:  ['doctor/health centre se treatment', 'treatment liya gaya'],
  foodWaterSuspected:    ['food ya water ko possible reason', 'possible reason maana'],

  // G. Contamination Perceptions
  perceivedCauses:       ['possible reasons kya ho sakte hain', 'food contamination ke possible reasons'],
};

function resolveHeader(headers, patterns) {
  for (const h of headers) {
    const hl = h.toLowerCase().trim();
    if (patterns.some(p => hl.includes(p.toLowerCase()))) {
      return h;
    }
  }
  return null;
}

function normalizeChoice(val) {
  if (!val) return '';
  const s = val.toLowerCase().trim();
  if (s.includes('always') || s === 'yes' || s.includes('often') || s.includes('daily') || s.includes('covered container') || s.includes('clean glass')) return 'always';
  if (s.includes('sometimes') || s.includes('weekly') || s.includes('occasionally') || s.includes('2-4 hours') || s.includes('rarely')) return 'sometimes';
  if (s.includes('never') || s === 'no' || s.includes('open container') || s.includes('more than 4 hours') || s.includes('outside')) return 'never';
  if (s.includes('not applicable') || s.includes("don't know") || s.includes("don't remember")) return 'na';
  return s;
}

function parseRow(row, headerMapping) {
  const parsed = {};
  for (const [key, patterns] of Object.entries(QUESTION_PATTERNS)) {
    const header = headerMapping[key];
    const rawVal = header ? row[header] : '';
    parsed[key] = normalizeChoice(rawVal);
    parsed[`${key}_raw`] = rawVal;
  }

  parsed.village = row['Village'] || row['Village Name'] || row['Gram'] || row['Location'] || 'Surveyed Household';
  parsed.timestamp = row['Timestamp'] || new Date().toISOString();

  const wsRaw = (parsed.waterSource_raw || '').toLowerCase();
  if (wsRaw.includes('river') || wsRaw.includes('stream') || wsRaw.includes('spring')) parsed.waterSource = 'river';
  else if (wsRaw.includes('well')) parsed.waterSource = 'well';
  else if (wsRaw.includes('hand pump') || wsRaw.includes('borewell')) parsed.waterSource = 'hand_pump';
  else if (wsRaw.includes('tap') || wsRaw.includes('piped')) parsed.waterSource = 'tap';
  else if (wsRaw.includes('purifier') || wsRaw.includes('ro')) parsed.waterSource = 'purifier';
  else parsed.waterSource = 'tap';

  if (!parsed.soughtTreatment && parsed.doctorTreatmentTaken) {
    parsed.soughtTreatment = parsed.doctorTreatmentTaken;
  }
  if (!parsed.waterTreatmentMethod) {
    const wt = parsed.waterTreatment;
    if (wt === 'always' || wt === 'sometimes') {
      parsed.waterTreatmentMethod = ['boil'];
      parsed.waterTreatmentConsistency = wt;
    } else {
      parsed.waterTreatmentMethod = ['none'];
      parsed.waterTreatmentConsistency = 'never';
    }
  }

  return parsed;
}

function computeAnalytics(households, isLive) {
  const total = households.length;

  const villageMetaMap = {};
  if (Array.isArray(SHOOLINI_VILLAGES)) {
    SHOOLINI_VILLAGES.forEach(v => {
      villageMetaMap[v.name] = v;
    });
  }

  const enriched = households.map(h => {
    const meta = villageMetaMap[h.village] || {};
    return {
      ...h,
      name_hi: meta.name_hi || h.village,
      zone: meta.zone || 'Solan Rural Zone',
      newsReport: meta.newsReport || 'Standard periodic rural surveillance in Solan district.',
      recentAlert: !!meta.recentAlert,
      risk: calculateRisk(h),
    };
  });

  const riskDist = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
  enriched.forEach(h => {
    riskDist[h.risk.level] = (riskDist[h.risk.level] || 0) + 1;
  });

  // Untreated water count
  const untreatedCount = enriched.filter(h => h.waterTreatment === 'never').length;

  // Cross contamination count
  const crossContamCount = enriched.filter(h => h.crossContamKnifeBoard === 'yes').length;

  // Illness prevalence (reported diarrhoea or vomiting in past 3 months)
  const illnessCount = enriched.filter(h => h.recentDiarrhoea === 'yes' || h.recentVomitingNausea === 'yes').length;

  // High risk percentage (High + Critical)
  const highRiskCount = (riskDist.High || 0) + (riskDist.Critical || 0);

  // Group by village
  const byVillage = {};
  enriched.forEach(h => {
    const v = h.village || 'Unknown';
    if (!byVillage[v]) byVillage[v] = { scores: [], households: 0, criticalCount: 0 };
    byVillage[v].scores.push(h.risk.total);
    byVillage[v].households++;
    if (h.risk.level === 'Critical' || h.risk.level === 'High') {
      byVillage[v].criticalCount++;
    }
  });

  const villages = Object.entries(byVillage).map(([name, { scores, households, criticalCount }]) => {
    const meta = villageMetaMap[name] || {};
    return {
      name,
      name_hi: meta.name_hi || name,
      zone: meta.zone || 'Solan Rural Zone',
      waterSourceProfile: meta.waterSourceProfile || 'Mixed Rural Springs & Wells',
      newsReport: meta.newsReport || 'Standard periodic rural surveillance in Solan district.',
      recentAlert: !!meta.recentAlert,
      households,
      criticalCount,
      avgRisk: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    };
  }).sort((a, b) => b.avgRisk - a.avgRisk);

  // Water source breakdown
  const waterSources = {};
  enriched.forEach(h => {
    const src = h.waterSource || 'other';
    if (!waterSources[src]) waterSources[src] = { scores: [], count: 0 };
    waterSources[src].scores.push(h.risk.total);
    waterSources[src].count++;
  });

  const waterSourceBreakdown = Object.entries(waterSources).map(([source, { scores, count }]) => ({
    source: source.replace('_', ' ').toUpperCase(),
    count,
    avgRisk: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  })).sort((a, b) => b.avgRisk - a.avgRisk);

  // Detailed risk drivers / symptom breakdown
  const symptomPrevalence = [
    { name: 'Diarrhoea in Last 3 Mo', count: enriched.filter(h => h.recentDiarrhoea === 'yes').length },
    { name: 'Vomiting / Stomach Ache', count: enriched.filter(h => h.recentVomitingNausea === 'yes').length },
    { name: 'Same Knife (Raw & Cooked)', count: crossContamCount },
    { name: 'Cooked Food > 4h at Room Temp', count: enriched.filter(h => h.roomTempStorageDuration === 'more_4h').length },
    { name: 'Flies in Cooking Area', count: enriched.filter(h => h.fliesInKitchen === 'often').length },
    { name: 'No Soap Handwash Prior Cooking', count: enriched.filter(h => h.handwashBeforeCooking === 'never').length },
  ];

  // Domain score averages (0-100 normalized)
  const domainAverages = {
    hygiene: Math.round((enriched.reduce((acc, h) => acc + (h.risk?.breakdown?.hygiene?.score || 0), 0) / (total * 20)) * 100),
    water: Math.round((enriched.reduce((acc, h) => acc + (h.risk?.breakdown?.water?.score || 0), 0) / (total * 25)) * 100),
    cooking: Math.round((enriched.reduce((acc, h) => acc + (h.risk?.breakdown?.cooking?.score || 0), 0) / (total * 20)) * 100),
    storage: Math.round((enriched.reduce((acc, h) => acc + (h.risk?.breakdown?.storage?.score || 0), 0) / (total * 15)) * 100),
    environment: Math.round((enriched.reduce((acc, h) => acc + (h.risk?.breakdown?.environment?.score || 0), 0) / (total * 10)) * 100),
    history: Math.round((enriched.reduce((acc, h) => acc + (h.risk?.breakdown?.history?.score || 0), 0) / (total * 10)) * 100),
  };

  return {
    isLive,
    totalHouseholds: total,
    totalVillages: Object.keys(byVillage).length,
    untreatedWaterPct: total ? Math.round((untreatedCount / total) * 100) : 0,
    highRiskPct: total ? Math.round((highRiskCount / total) * 100) : 0,
    illnessPrevalencePct: total ? Math.round((illnessCount / total) * 100) : 0,
    crossContamPct: total ? Math.round((crossContamCount / total) * 100) : 0,
    riskDistribution: riskDist,
    symptomPrevalence,
    waterSourceBreakdown,
    villageRankings: villages,
    domainAverages,
    enrichedHouseholds: enriched,
    fetchedAt: new Date().toISOString(),
  };
}

export async function getSurveyData() {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;
  let households = [];
  let isLive = false;

  try {
    if (csvUrl && csvUrl.startsWith('http')) {
      const res = await fetch(csvUrl, { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      const text = await res.text();
      const rows = parseCSV(text);
      if (!rows.length) throw new Error('Empty CSV');

      const headers = Object.keys(rows[0]);
      const headerMapping = {};
      for (const [key, patterns] of Object.entries(QUESTION_PATTERNS)) {
        headerMapping[key] = resolveHeader(headers, patterns);
      }

      households = rows.map(r => parseRow(r, headerMapping));
      isLive = true;
    } else {
      throw new Error('No sheet URL configured');
    }
  } catch (err) {
    // Generate full dataset of 220+ households across Shoolini University villages
    households = generateShooliniDataset(225);
    isLive = false;
  }

  // Merge live user assessments submitted via the website when a village is selected
  let userHouseholds = [];
  try {
    const stored = getAll();
    userHouseholds = stored
      .filter(rec => {
        if (!rec.village) return false;
        const v = rec.village.trim().toLowerCase();
        return v !== 'none' && v !== 'survey household' && v !== '';
      })
      .map((rec, idx) => ({
        ...rec,
        id: rec.id?.startsWith('SHL-') ? rec.id : `LIVE-${String(1001 + idx)}`,
        village: rec.village,
        waterSource: rec.waterSource || 'tap',
        waterTreatment: rec.waterTreatmentConsistency || (Array.isArray(rec.waterTreatmentMethod) && rec.waterTreatmentMethod.includes('none') ? 'never' : 'always'),
        waterStorage: rec.waterStorage || 'covered',
        waterHandlingUtensil: rec.waterHandlingUtensil || 'clean_utensil',
        handwashBeforeCooking: rec.handwashBeforeCooking || 'always',
        crossContamKnifeBoard: rec.crossContamKnifeBoard || 'no',
        roomTempStorageDuration: rec.roomTempStorageDuration || 'less_2h',
        fliesInKitchen: rec.fliesInKitchen || 'rarely',
        recentDiarrhoea: rec.recentDiarrhoea || 'no',
        recentVomitingNausea: rec.recentVomitingNausea || 'no',
        isLiveSubmission: true,
      }));
  } catch (e) {
    userHouseholds = [];
  }

  const combinedHouseholds = [...userHouseholds, ...households];
  const analytics = computeAnalytics(combinedHouseholds, isLive || userHouseholds.length > 0);
  _cache = analytics;
  _cacheTime = now;
  return analytics;
}

export function invalidateSurveyCache() {
  _cache = null;
  _cacheTime = 0;
}
