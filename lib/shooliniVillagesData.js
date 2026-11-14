/**
 * lib/shooliniVillagesData.js
 * Generates 225+ realistic household records across villages near Shoolini University (Solan, HP).
 * Grounded in Solan district epidemiological field observations and local health reports (The Tribune / Amar Ujala / Solan CMO advisories):
 * - Giri River Water Scheme & Ashwani Khad watershed seasonal contamination
 * - Reliance on natural mountain gravity springs (baolis/chashmas) in interior villages
 * - Seasonal monsoon/summer gastrointestinal surges in rural valley pockets
 */

import { calculateRisk } from './risk.js';

export const SHOOLINI_VILLAGES = [
  {
    name: 'Bajhol (Near Shoolini)',
    name_hi: 'बाजहोल (शूलिनी वि.वि. के समीप)',
    zone: 'Shoolini Campus Valley',
    waterSourceProfile: 'Mixed Municipal Piped & Natural Baolis',
    newsReport: 'Solan Jal Shakti Dept routine surveillance; occasional pipe siltation noted after heavy hill rains.',
    waterPipedPct: 0.68,
    boilPct: 0.58,
    hasFridgePct: 0.72,
    recentAlert: false,
  },
  {
    name: 'Sultanpur',
    name_hi: 'सुल्तानपुर',
    zone: 'Agricultural Giri Basin',
    waterSourceProfile: 'Giri River Pipeline & Stream Conduits',
    newsReport: 'Local health sub-centre reported seasonal diarrhoea clusters in downstream farm hamlets during post-monsoon runoff.',
    waterPipedPct: 0.50,
    boilPct: 0.40,
    hasFridgePct: 0.60,
    recentAlert: true,
  },
  {
    name: 'Ochghat',
    name_hi: 'ओचघाट',
    zone: 'Solan-Rajgarh Highway Corridor',
    waterSourceProfile: 'Community Baoli & Piped Tanks',
    newsReport: 'PHC Ochghat seasonal advisory: community storage tanks cleaned under rural sanitation drive.',
    waterPipedPct: 0.46,
    boilPct: 0.38,
    hasFridgePct: 0.55,
    recentAlert: false,
  },
  {
    name: 'Shamlesh',
    name_hi: 'शामलेष',
    zone: 'Bypass Transit Zone',
    waterSourceProfile: 'Open Wells, Piped Supply & Tankers',
    newsReport: 'Water tanker reliance during peak dry summer; chlorinated storage advised by district health authorities.',
    waterPipedPct: 0.42,
    boilPct: 0.32,
    hasFridgePct: 0.50,
    recentAlert: true,
  },
  {
    name: 'Nauni',
    name_hi: 'नौणी',
    zone: 'University & Research Belt',
    waterSourceProfile: 'Institutional Microfiltered Piped Supply',
    newsReport: 'Dr. YS Parmar University cluster; regular microbial testing shows consistently low bacterial counts.',
    waterPipedPct: 0.82,
    boilPct: 0.72,
    hasFridgePct: 0.80,
    recentAlert: false,
  },
  {
    name: 'Kumarhatti',
    name_hi: 'कुमारहट्टी',
    zone: 'NH-5 Highway Commercial Hub',
    waterSourceProfile: 'Piped Water Supply & Highway Wells',
    newsReport: 'High-density transit cluster; food vendor safety inspections conducted by food safety officers.',
    waterPipedPct: 0.62,
    boilPct: 0.52,
    hasFridgePct: 0.68,
    recentAlert: false,
  },
  {
    name: 'Dharampur',
    name_hi: 'धरमपुर',
    zone: 'Cantonment Border Belt',
    waterSourceProfile: 'Gravity Spring Baolis & Piped Water',
    newsReport: 'Traditional freshwater spring baolis tested for coliform levels following regional health audit.',
    waterPipedPct: 0.58,
    boilPct: 0.48,
    hasFridgePct: 0.62,
    recentAlert: false,
  },
  {
    name: 'Barog',
    name_hi: 'बड़ोग',
    zone: 'High Altitude Hill Ridge (1,560m)',
    waterSourceProfile: 'Gravity Mountain Water & Piped Network',
    newsReport: 'Low ambient temperature retards bacterial growth; clean hillside spring catchment with low gastro incidents.',
    waterPipedPct: 0.74,
    boilPct: 0.64,
    hasFridgePct: 0.72,
    recentAlert: false,
  },
  {
    name: 'Deothi',
    name_hi: 'देवठी',
    zone: 'Interior Sloped Valleys',
    waterSourceProfile: 'Untreated Mountain Streams & Baolis',
    newsReport: 'Village elders rely on traditional natural springs (chashmas); health camps report periodic amoebiasis cases.',
    waterPipedPct: 0.34,
    boilPct: 0.24,
    hasFridgePct: 0.40,
    recentAlert: true,
  },
  {
    name: 'Kotla',
    name_hi: 'कोटला',
    zone: 'Farming Valley Basin',
    waterSourceProfile: 'Borewells & Village Hand Pumps',
    newsReport: 'Livestock proximity to open kitchen courtyards highlighted in village health worker records.',
    waterPipedPct: 0.38,
    boilPct: 0.28,
    hasFridgePct: 0.44,
    recentAlert: false,
  },
  {
    name: 'Salogra',
    name_hi: 'सलोगड़ा',
    zone: 'Solan-Shimla Valley Track',
    waterSourceProfile: 'Valley Nallah Springs & Shallow Pumps',
    newsReport: 'Seasonal monsoon stream runoff historically prone to coliform contamination during July-August.',
    waterPipedPct: 0.48,
    boilPct: 0.38,
    hasFridgePct: 0.52,
    recentAlert: true,
  },
  {
    name: 'Saproon',
    name_hi: 'सप्रून',
    zone: 'Solan Town Outskirts',
    waterSourceProfile: 'Municipal Ashwani Piped & Domestic RO',
    newsReport: 'High RO filter adoption among suburban households; food-borne illnesses primarily tied to ambient street food.',
    waterPipedPct: 0.86,
    boilPct: 0.76,
    hasFridgePct: 0.88,
    recentAlert: false,
  },
  {
    name: 'Chambaghat',
    name_hi: 'चंबाघाट',
    zone: 'Industrial & Town Entry Gate',
    waterSourceProfile: 'Municipal Filtered & Commercial Purifiers',
    newsReport: 'Clean urban water infrastructure; minimal enteric pathogen spread in domestic water samples.',
    waterPipedPct: 0.80,
    boilPct: 0.70,
    hasFridgePct: 0.84,
    recentAlert: false,
  },
  {
    name: 'Kandaghat',
    name_hi: 'कंडाघाट',
    zone: 'Ashwani Khad River Watershed',
    waterSourceProfile: 'River Water Lifting Scheme & Local Piped',
    newsReport: 'Historical water safety landmark: strict continuous chlorination maintained following past hepatitis/jaundice news warnings.',
    waterPipedPct: 0.58,
    boilPct: 0.48,
    hasFridgePct: 0.62,
    recentAlert: false,
  },
  {
    name: 'Bhojnagar',
    name_hi: 'भोजनगर',
    zone: 'Remote Ridge Hinterland',
    waterSourceProfile: 'Open Forest Streams, Baolis & Wells',
    newsReport: 'Acute water accessibility challenges; local ASHA workers flagged high gastroenteritis incidence in unboiled spring users.',
    waterPipedPct: 0.26,
    boilPct: 0.18,
    hasFridgePct: 0.32,
    recentAlert: true,
  },
  {
    name: 'Koro',
    name_hi: 'कोरो',
    zone: 'Forest Fringe Rural Hamlet',
    waterSourceProfile: 'Natural Mountain Baolis & Seasonal Streams',
    newsReport: 'Domestic animals and open waste in close proximity to food preparation zones noted in health surveys.',
    waterPipedPct: 0.32,
    boilPct: 0.22,
    hasFridgePct: 0.38,
    recentAlert: true,
  },
  {
    name: 'Basal',
    name_hi: 'बासल',
    zone: 'Semi-Rural Solan Fringe',
    waterSourceProfile: 'Piped Water Supply & Community Taps',
    newsReport: 'Periodic supply rationing during early summer; water storage container hygiene awareness campaigns active.',
    waterPipedPct: 0.62,
    boilPct: 0.52,
    hasFridgePct: 0.66,
    recentAlert: false,
  },
  {
    name: 'Anji',
    name_hi: 'आंजी',
    zone: 'Terraced Hill Slopes',
    waterSourceProfile: 'Piped Water & Traditional Springs',
    newsReport: 'Hillside baoli water shared between farming households; clean handling protocols reinforced by Gram Panchayat.',
    waterPipedPct: 0.52,
    boilPct: 0.46,
    hasFridgePct: 0.58,
    recentAlert: false,
  },
  {
    name: 'Kather',
    name_hi: 'काथड़',
    zone: 'New Bus Stand Vicinity',
    waterSourceProfile: 'Municipal Piped Water & Borewells',
    newsReport: 'Semi-urban residential cluster; high awareness of water purification and covered storage.',
    waterPipedPct: 0.70,
    boilPct: 0.60,
    hasFridgePct: 0.74,
    recentAlert: false,
  },
  {
    name: 'Patti',
    name_hi: 'पट्टी',
    zone: 'Giri Riverbank Hamlet',
    waterSourceProfile: 'River Stream Direct Intake & Shallow Wells',
    newsReport: 'Direct riverbank usage during pipeline maintenance; district medical bulletin noted water-borne disease risk.',
    waterPipedPct: 0.30,
    boilPct: 0.20,
    hasFridgePct: 0.34,
    recentAlert: true,
  },
];

// Seeded pseudorandom generator for deterministic, repeatable dataset
function pseudoRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateShooliniDataset(totalCount = 225) {
  const dataset = [];
  let seed = 42;

  const rand = () => {
    seed += 1;
    return pseudoRandom(seed);
  };

  for (let i = 1; i <= totalCount; i++) {
    const villageMeta = SHOOLINI_VILLAGES[i % SHOOLINI_VILLAGES.length];
    const r1 = rand();
    const r2 = rand();
    const r3 = rand();
    const r4 = rand();
    const r5 = rand();
    const r6 = rand();
    const r7 = rand();
    const r8 = rand();
    const r9 = rand();
    const r10 = rand();

    // Water source influenced by village profile
    let waterSource;
    if (r1 < villageMeta.waterPipedPct * 0.35) waterSource = 'purifier';
    else if (r1 < villageMeta.waterPipedPct) waterSource = 'tap';
    else if (r1 < 0.75) waterSource = 'hand_pump';
    else if (r1 < 0.90) waterSource = 'well';
    else waterSource = 'river';

    // Water treatment
    let waterTreatment;
    if (r2 < villageMeta.boilPct) waterTreatment = 'always';
    else if (r2 < villageMeta.boilPct + 0.3) waterTreatment = 'sometimes';
    else waterTreatment = 'never';

    // Storage
    const waterStorage = r3 < 0.72 ? 'covered' : 'open';
    const waterHandlingUtensil = r4 < 0.65 ? 'clean_utensil' : (r4 < 0.85 ? 'sometimes' : 'direct_hand');
    const waterContainerCleaning = r5 < 0.5 ? 'daily' : (r5 < 0.8 ? 'weekly' : 'occasionally');

    // Hygiene
    const handwashBeforeCooking = r6 < 0.55 ? 'always' : (r6 < 0.85 ? 'sometimes' : 'never');
    const handwashDuringCooking = r7 < 0.45 ? 'always' : (r7 < 0.80 ? 'sometimes' : 'never');
    const handwashAfterToilet = r8 < 0.75 ? 'always' : (r8 < 0.92 ? 'sometimes' : 'never');
    const handwashAfterRawFood = r9 < 0.60 ? 'always' : (r9 < 0.85 ? 'sometimes' : 'never');
    const handCutsWounds = r10 < 0.7 ? 'never' : (r10 < 0.9 ? 'sometimes' : 'often');
    const hairCovering = rand() < 0.4 ? 'always' : (rand() < 0.75 ? 'sometimes' : 'never');
    const handDryingMethod = rand() < 0.55 ? 'always' : 'sometimes';

    // Cooking & handling
    const separateRawCooked = rand() < 0.5 ? 'always' : (rand() < 0.8 ? 'sometimes' : 'never');
    const crossContamKnifeBoard = rand() < 0.4 ? 'yes' : (rand() < 0.65 ? 'sometimes' : 'no');
    const washVegFruits = rand() < 0.85 ? 'always' : 'sometimes';
    const cookMeatEggsProperly = rand() < 0.8 ? 'always' : 'sometimes';
    const coverFoodCooking = rand() < 0.65 ? 'always' : (rand() < 0.88 ? 'sometimes' : 'never');
    const dishwashSoapLiquid = rand() < 0.85 ? 'always' : 'sometimes';
    const boilMilk = rand() < 0.9 ? 'always' : 'sometimes';

    // Storage & fridge
    const hasFridge = rand() < villageMeta.hasFridgePct ? 'yes' : 'no';
    const fridgeRawCookedSeparated = hasFridge === 'yes' ? (rand() < 0.6 ? 'always' : 'sometimes') : 'no_refrigerator';
    let roomTempStorageDuration;
    if (hasFridge === 'yes') {
      roomTempStorageDuration = rand() < 0.6 ? 'less_2h' : (rand() < 0.9 ? '2_4h' : 'more_4h');
    } else {
      roomTempStorageDuration = rand() < 0.25 ? 'less_2h' : (rand() < 0.65 ? '2_4h' : 'more_4h');
    }
    const reheatLeftoversProperly = rand() < 0.6 ? 'always' : (rand() < 0.85 ? 'sometimes' : 'never');
    const coverLeftoverFood = rand() < 0.7 ? 'always' : 'sometimes';
    const dryFoodStorageCovered = rand() < 0.85 ? 'always' : 'sometimes';
    const consumeMouldyFood = rand() < 0.8 ? 'no' : (rand() < 0.95 ? 'sometimes' : 'yes');
    const checkExpiryDate = rand() < 0.7 ? 'always' : (rand() < 0.9 ? 'sometimes' : 'never');

    // Environment
    const fliesInKitchen = rand() < 0.25 ? 'rarely' : (rand() < 0.65 ? 'sometimes' : 'often');
    const wasteDisposalBin = rand() < 0.45 ? 'covered' : (rand() < 0.8 ? 'open' : 'outside');
    const petsNearKitchen = rand() < 0.35 ? 'never' : (rand() < 0.7 ? 'sometimes' : 'often');

    // Recent Illness
    // Correlates with water quality and village outbreak risk from local news
    const villageAlertFactor = villageMeta.recentAlert ? 0.25 : 0.05;
    const waterRiskScore = waterSource === 'river' ? 0.45 : (waterTreatment === 'never' ? 0.35 : 0.08);
    const hygieneRiskScore = handwashBeforeCooking === 'never' ? 0.25 : 0.05;
    const illnessProb = Math.min(waterRiskScore + hygieneRiskScore + villageAlertFactor, 0.75);

    const hadIllness = rand() < illnessProb;
    const recentDiarrhoea = hadIllness && rand() < 0.68 ? 'yes' : 'no';
    const recentVomitingNausea = hadIllness && rand() < 0.62 ? 'yes' : 'no';
    const multipleMembersIll = hadIllness && rand() < 0.45 ? 'yes' : 'no';
    const foodWaterSuspected = hadIllness ? (rand() < 0.7 ? 'yes' : 'sometimes') : 'no';
    const soughtTreatment = hadIllness ? (rand() < 0.65 ? 'yes' : 'no') : 'na';

    // Water treatment method
    let waterTreatmentMethod;
    if (waterTreatment === 'never') {
      waterTreatmentMethod = ['none'];
    } else if (waterSource === 'purifier') {
      waterTreatmentMethod = ['ro', 'uv'];
    } else if (rand() < 0.4) {
      waterTreatmentMethod = ['ro'];
    } else if (rand() < 0.7) {
      waterTreatmentMethod = ['boil'];
    } else {
      waterTreatmentMethod = ['filter'];
    }

    const waterTreatmentConsistency = waterTreatment;
    const cookingWaterSameSource = rand() < 0.8 ? 'yes' : 'sometimes';

    const household = {
      id: `SHL-${1000 + i}`,
      village: villageMeta.name,
      village_hi: villageMeta.name_hi,
      zone: villageMeta.zone,
      newsReport: villageMeta.newsReport,
      recentAlert: villageMeta.recentAlert,
      householdSize: Math.floor(rand() * 6) + 3,
      timestamp: new Date(Date.now() - (totalCount - i) * 3600 * 1000 * 4).toISOString(),
      waterSource,
      waterTreatment,
      waterTreatmentMethod,
      waterTreatmentConsistency,
      cookingWaterSameSource,
      waterStorage,
      waterHandlingUtensil,
      waterContainerCleaning,
      handwashBeforeCooking,
      handwashDuringCooking,
      handwashAfterToilet,
      handwashAfterRawFood,
      handCutsWounds,
      hairCovering,
      handDryingMethod,
      separateRawCooked,
      crossContamKnifeBoard,
      washVegFruits,
      cookMeatEggsProperly,
      coverFoodCooking,
      dishwashSoapLiquid,
      boilMilk,
      hasFridge,
      fridgeRawCookedSeparated,
      roomTempStorageDuration,
      reheatLeftoversProperly,
      coverLeftoverFood,
      dryFoodStorageCovered,
      consumeMouldyFood,
      checkExpiryDate,
      fliesInKitchen,
      wasteDisposalBin,
      petsNearKitchen,
      recentDiarrhoea,
      recentVomitingNausea,
      multipleMembersIll,
      soughtTreatment,
      foodWaterSuspected,
    };

    dataset.push(household);
  }

  return dataset;
}
