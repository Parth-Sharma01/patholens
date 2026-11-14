/**
 * lib/risk.js — Multiplicative Compounding Risk Scoring Model (0–100)
 * Calibrated for Village-Level Food-Borne Illness Assessment & Surveillance.
 *
 * Mathematical Model:
 *   R_total = 100 * (1 - \prod_{i=1}^6 (1 - h_i))
 *   where h_i = s_i / m_i
 *   s_i = summed penalty points in section i (clamped to m_i)
 *   m_i = maximum points for section i (sum of m_i = 100)
 */

export const SECTION_MAX = {
  hygiene: 20,
  water: 25,
  cooking: 20,
  storage: 15,
  environment: 10,
  history: 10,
};

export const RISK_WEIGHTS = {
  // A. Personal Hygiene (20 pts max)
  handwashBeforeCooking: {
    section: 'hygiene',
    max: 4,
    options: { always: 0, sometimes: 2.5, never: 4 },
  },
  handwashDuringCooking: {
    section: 'hygiene',
    max: 3,
    options: { always: 0, sometimes: 2, never: 3 },
  },
  handwashAfterToilet: {
    section: 'hygiene',
    max: 5,
    options: { always: 0, sometimes: 3, never: 5 },
  },
  handwashAfterRawFood: {
    section: 'hygiene',
    max: 3,
    options: { always: 0, sometimes: 2, never: 3, na: 0 },
  },
  handCutsWounds: {
    section: 'hygiene',
    max: 2,
    options: { never: 0, sometimes: 1, often: 2 },
  },
  hairCovering: {
    section: 'hygiene',
    max: 1.5,
    options: { always: 0, sometimes: 0.75, never: 1.5 },
  },
  handDryingMethod: {
    section: 'hygiene',
    max: 1.5,
    options: { always: 0, sometimes: 0.75, never: 1.5 },
  },

  // B. Water Safety (25 pts max)
  waterSource: {
    section: 'water',
    max: 8,
    options: { purifier: 0, tap: 2, hand_pump: 4, well: 6, river: 8 },
  },
  waterTreatmentMethod: {
    section: 'water',
    max: 7,
    options: { ro: 0, uv: 0, boil: 0, chlorine: 0, filter: 0, cloth: 7, none: 7 },
  },
  waterTreatmentConsistency: {
    section: 'water',
    max: 7,
    options: { always: 0, sometimes: 3.5, never: 7 },
  },
  waterStorage: {
    section: 'water',
    max: 4,
    options: { covered: 0, open: 4, other: 2 },
  },
  waterHandlingUtensil: {
    section: 'water',
    max: 3,
    options: { always: 0, clean_utensil: 0, yes: 0, sometimes: 1.5, never: 3, direct_hand: 3, no: 3 },
  },
  waterContainerCleaning: {
    section: 'water',
    max: 2,
    options: { daily: 0, weekly: 0.5, occasionally: 1.5, never: 2 },
  },
  cookingWaterSameSource: {
    section: 'water',
    max: 1,
    options: { yes: 0, sometimes: 0.5, no: 1 },
  },

  // C. Food Handling & Cooking (20 pts max)
  separateRawCooked: {
    section: 'cooking',
    max: 4,
    options: { always: 0, sometimes: 2, never: 4 },
  },
  crossContamKnifeBoard: {
    section: 'cooking',
    max: 4,
    options: { no: 0, sometimes: 2, yes: 4 },
  },
  washVegFruits: {
    section: 'cooking',
    max: 3,
    options: { always: 0, yes: 0, sometimes: 1.5, never: 3, no: 3 },
  },
  cookMeatEggsProperly: {
    section: 'cooking',
    max: 3,
    options: { always: 0, sometimes: 1.5, never: 3, na: 0 },
  },
  coverFoodCooking: {
    section: 'cooking',
    max: 3,
    options: { always: 0, sometimes: 1.5, never: 3, na: 0 },
  },
  dishwashSoapLiquid: {
    section: 'cooking',
    max: 2,
    options: { always: 0, sometimes: 1, never: 2 },
  },
  boilMilk: {
    section: 'cooking',
    max: 1,
    options: { always: 0, sometimes: 0.5, never: 1, na: 0 },
  },

  // D. Food Storage & Refrigeration (15 pts max)
  hasFridge: {
    section: 'storage',
    max: 2,
    options: { yes: 0, no: 2 },
  },
  fridgeRawCookedSeparated: {
    section: 'storage',
    max: 2,
    options: { always: 0, yes: 0, sometimes: 1, never: 2, no: 2, no_refrigerator: 0, na: 0 },
  },
  roomTempStorageDuration: {
    section: 'storage',
    max: 4,
    options: { less_2h: 0, '2_4h': 2, more_4h: 4, dont_know: 2 },
  },
  reheatLeftoversProperly: {
    section: 'storage',
    max: 3,
    options: { always: 0, sometimes: 1.5, never: 3, na: 0 },
  },
  coverLeftoverFood: {
    section: 'storage',
    max: 2,
    options: { always: 0, sometimes: 1, never: 2, na: 0 },
  },
  dryFoodStorageCovered: {
    section: 'storage',
    max: 1,
    options: { always: 0, sometimes: 0.5, never: 1 },
  },
  consumeMouldyFood: {
    section: 'storage',
    max: 1,
    options: { no: 0, sometimes: 0.5, yes: 1 },
  },
  checkExpiryDate: {
    section: 'storage',
    max: 1,
    options: { always: 0, sometimes: 0.5, never: 1, na: 0 },
  },

  // E. Kitchen Environment & Vectors (10 pts max)
  fliesInKitchen: {
    section: 'environment',
    max: 4,
    options: { never: 0, rarely: 1, sometimes: 2.5, often: 4 },
  },
  wasteDisposalBin: {
    section: 'environment',
    max: 3,
    options: { covered: 0, open: 2, outside: 3, other: 1.5 },
  },
  petsNearKitchen: {
    section: 'environment',
    max: 3,
    options: { never: 0, no: 0, no_pets: 0, rarely: 1, sometimes: 2, often: 3, yes: 3 },
  },

  // F. Food-Borne Illness History (10 pts max)
  recentDiarrhoea: {
    section: 'history',
    max: 3,
    options: { no: 0, dont_know: 1, yes: 3 },
  },
  recentVomitingNausea: {
    section: 'history',
    max: 3,
    options: { no: 0, dont_know: 1, yes: 3 },
  },
  multipleMembersIll: {
    section: 'history',
    max: 2,
    options: { no: 0, dont_know: 1, yes: 2 },
  },
  soughtTreatment: {
    section: 'history',
    max: 1,
    options: { yes: 0, no: 1, dont_know: 0.5, na: 0 },
  },
  foodWaterSuspected: {
    section: 'history',
    max: 1,
    options: { no: 0, not_sure: 0.5, dont_know: 0.5, yes: 1 },
  },
};

const SAFE_WATER_METHODS = new Set(['ro', 'uv', 'boil', 'chlorine', 'filter']);
const VALID_WATER_METHODS = new Set(['ro', 'uv', 'boil', 'chlorine', 'filter', 'cloth', 'none']);

/**
 * Calculates risk score (0-100) using a multiplicative compounding model
 * and returns section breakdown and unanswered fields.
 */
export function calculateRisk(data = {}) {
  const unanswered = [];

  // Initialize section raw scores
  const rawScores = {
    hygiene: 0,
    water: 0,
    cooking: 0,
    storage: 0,
    environment: 0,
    history: 0,
  };

  // Helper to validate and score standard single-choice fields
  const scoreField = (fieldName) => {
    const config = RISK_WEIGHTS[fieldName];
    if (!config) return 0;
    const val = data[fieldName];
    if (val === undefined || val === null || val === '') {
      unanswered.push(fieldName);
      return 0;
    }
    if (config.options[val] !== undefined) {
      return config.options[val];
    }
    // Unrecognised answer
    unanswered.push(fieldName);
    return 0;
  };

  // --- Section A: Hygiene ---
  rawScores.hygiene += scoreField('handwashBeforeCooking');
  rawScores.hygiene += scoreField('handwashDuringCooking');
  rawScores.hygiene += scoreField('handwashAfterToilet');
  rawScores.hygiene += scoreField('handwashAfterRawFood');
  rawScores.hygiene += scoreField('handCutsWounds');
  rawScores.hygiene += scoreField('hairCovering');
  rawScores.hygiene += scoreField('handDryingMethod');

  // --- Section B: Water ---
  // 1. Water Source
  const waterSourcePoints = scoreField('waterSource');

  // 2. Water Treatment Method (multi-select array)
  let treatmentPoints = 0;
  let hasSafeMethod = false;
  const methods = data.waterTreatmentMethod;

  if (!Array.isArray(methods) || methods.length === 0) {
    unanswered.push('waterTreatmentMethod');
  } else {
    const allValid = methods.every(m => VALID_WATER_METHODS.has(m));
    if (!allValid) {
      unanswered.push('waterTreatmentMethod');
    } else {
      hasSafeMethod = methods.some(m => SAFE_WATER_METHODS.has(m));
      const onlyUnsafe = methods.every(m => m === 'cloth' || m === 'none');

      // Consistency check
      const consistency = data.waterTreatmentConsistency;
      const validConsistency = ['always', 'sometimes', 'never'].includes(consistency);

      if (hasSafeMethod) {
        if (consistency === 'always') treatmentPoints = 0;
        else if (consistency === 'sometimes') treatmentPoints = 3.5;
        else if (consistency === 'never') treatmentPoints = 7;
        else treatmentPoints = 0; // consistency missing or invalid
      } else if (onlyUnsafe) {
        treatmentPoints = 7;
      } else {
        treatmentPoints = 0;
      }
    }
  }

  // 3. Water Treatment Consistency field check
  const consistencyVal = data.waterTreatmentConsistency;
  if (consistencyVal === undefined || consistencyVal === null || consistencyVal === '') {
    unanswered.push('waterTreatmentConsistency');
  } else if (!['always', 'sometimes', 'never'].includes(consistencyVal)) {
    unanswered.push('waterTreatmentConsistency');
  }

  // Epidemiological adjustment:
  // If a household has an effective water purification method (RO, UV, boiling, chlorine, filter)
  // and consistently treats drinking water ('always'), pathogens in raw intake are effectively neutralised.
  // The combined raw water penalty is capped at 2 (the equivalent of municipal piped tap water).
  // This guarantees that a river-sourced household that consistently purifies water does not receive
  // an inflated risk score (total <= 10, 'Low'), preventing penalisation of households taking proper precautions.
  let rawWaterPenalty = waterSourcePoints + treatmentPoints;
  if (hasSafeMethod && data.waterTreatmentConsistency === 'always') {
    rawWaterPenalty = Math.min(rawWaterPenalty, 2);
  }

  rawScores.water += rawWaterPenalty;
  rawScores.water += scoreField('waterStorage');
  rawScores.water += scoreField('waterHandlingUtensil');
  rawScores.water += scoreField('waterContainerCleaning');
  rawScores.water += scoreField('cookingWaterSameSource');

  // --- Section C: Cooking ---
  rawScores.cooking += scoreField('separateRawCooked');
  rawScores.cooking += scoreField('crossContamKnifeBoard');
  rawScores.cooking += scoreField('washVegFruits');
  rawScores.cooking += scoreField('cookMeatEggsProperly');
  rawScores.cooking += scoreField('coverFoodCooking');
  rawScores.cooking += scoreField('dishwashSoapLiquid');
  rawScores.cooking += scoreField('boilMilk');

  // --- Section D: Storage ---
  rawScores.storage += scoreField('hasFridge');
  rawScores.storage += scoreField('fridgeRawCookedSeparated');
  rawScores.storage += scoreField('roomTempStorageDuration');
  rawScores.storage += scoreField('reheatLeftoversProperly');
  rawScores.storage += scoreField('coverLeftoverFood');
  rawScores.storage += scoreField('dryFoodStorageCovered');
  rawScores.storage += scoreField('consumeMouldyFood');
  rawScores.storage += scoreField('checkExpiryDate');

  // --- Section E: Environment ---
  rawScores.environment += scoreField('fliesInKitchen');
  rawScores.environment += scoreField('wasteDisposalBin');
  rawScores.environment += scoreField('petsNearKitchen');

  // --- Section F: History ---
  rawScores.history += scoreField('recentDiarrhoea');
  rawScores.history += scoreField('recentVomitingNausea');
  rawScores.history += scoreField('multipleMembersIll');
  rawScores.history += scoreField('soughtTreatment');
  rawScores.history += scoreField('foodWaterSuspected');

  // Build breakdown with clamped scores and hazard percentages
  const breakdown = {};
  let compoundingProduct = 1.0;

  for (const [key, max] of Object.entries(SECTION_MAX)) {
    const raw = rawScores[key] || 0;
    const clampedScore = Math.min(raw, max);
    const score = Number(clampedScore.toFixed(1));
    const hazard = Number(((score / max) * 100).toFixed(1));
    breakdown[key] = { score, max, hazard };

    const h_i = score / max;
    compoundingProduct *= (1 - h_i);
  }

  // Multiplicative Compounding Formula:
  // R_total = 100 * (1 - \prod (1 - h_i))
  let total = Math.round(100 * (1 - compoundingProduct));
  total = Math.min(Math.max(total, 0), 100);

  const level =
    total >= 70 ? 'Critical' :
    total >= 45 ? 'High' :
    total >= 25 ? 'Moderate' :
    'Low';

  return {
    total,
    level,
    breakdown,
    unanswered,
    model: 'multiplicative',
  };
}

export const RISK_COLORS = {
  Low: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    hex: '#10b981',
  },
  Moderate: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    hex: '#f59e0b',
  },
  High: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/40',
    hex: '#f97316',
  },
  Critical: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    hex: '#f43f5e',
  },
};
