/**
 * scripts/test-risk.js — Acceptance Test Suite for Multiplicative Risk Model
 */

import { calculateRisk, SECTION_MAX, RISK_WEIGHTS, RISK_COLORS } from '../lib/risk.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log('--- Running Multiplicative Risk Model Acceptance Tests ---');

// Baseline perfect household
const perfectHousehold = {
  // A. Hygiene
  handwashBeforeCooking: 'always',
  handwashDuringCooking: 'always',
  handwashAfterToilet: 'always',
  handwashAfterRawFood: 'always',
  handCutsWounds: 'never',
  hairCovering: 'always',
  handDryingMethod: 'always',

  // B. Water
  waterSource: 'purifier',
  waterTreatmentMethod: ['ro'],
  waterTreatmentConsistency: 'always',
  waterStorage: 'covered',
  waterHandlingUtensil: 'clean_utensil',
  waterContainerCleaning: 'daily',
  cookingWaterSameSource: 'yes',

  // C. Cooking
  separateRawCooked: 'always',
  crossContamKnifeBoard: 'no',
  washVegFruits: 'always',
  cookMeatEggsProperly: 'always',
  coverFoodCooking: 'always',
  dishwashSoapLiquid: 'always',
  boilMilk: 'always',

  // D. Storage
  hasFridge: 'yes',
  fridgeRawCookedSeparated: 'always',
  roomTempStorageDuration: 'less_2h',
  reheatLeftoversProperly: 'always',
  coverLeftoverFood: 'always',
  dryFoodStorageCovered: 'always',
  consumeMouldyFood: 'no',
  checkExpiryDate: 'always',

  // E. Environment
  fliesInKitchen: 'never',
  wasteDisposalBin: 'covered',
  petsNearKitchen: 'never',

  // F. History
  recentDiarrhoea: 'no',
  recentVomitingNausea: 'no',
  multipleMembersIll: 'no',
  soughtTreatment: 'yes',
  foodWaterSuspected: 'no',
};

// Test 1: Perfect household → total === 0, level === 'Low'
console.log('\nTest 1: Perfect household');
const res1 = calculateRisk(perfectHousehold);
assert(res1.total === 0, `Total should be 0 (got ${res1.total})`);
assert(res1.level === 'Low', `Level should be 'Low' (got ${res1.level})`);
assert(res1.unanswered.length === 0, `Unanswered should be empty (got ${res1.unanswered.length})`);
assert(res1.model === 'multiplicative', `Model should be 'multiplicative' (got ${res1.model})`);

// Test 2: River water + never treat, everything else perfect → level is 'High' or 'Critical'
console.log('\nTest 2: River water + never treat, everything else perfect');
const res2 = calculateRisk({
  ...perfectHousehold,
  waterSource: 'river',
  waterTreatmentMethod: ['none'],
  waterTreatmentConsistency: 'never',
});
assert(
  res2.level === 'High' || res2.level === 'Critical',
  `Level should be 'High' or 'Critical' (got total=${res2.total}, level=${res2.level})`
);

// Test 3: River water but consistent RO treatment, everything else perfect → total <= 10, level === 'Low'
console.log('\nTest 3: River water but consistent RO treatment, everything else perfect');
const res3 = calculateRisk({
  ...perfectHousehold,
  waterSource: 'river',
  waterTreatmentMethod: ['ro'],
  waterTreatmentConsistency: 'always',
});
assert(res3.total <= 10, `Total should be <= 10 (got ${res3.total})`);
assert(res3.level === 'Low', `Level should be 'Low' (got ${res3.level})`);

// Test 4: River water + consistent boiling, everything else perfect → same result as test 3
console.log('\nTest 4: River water + consistent boiling, everything else perfect');
const res4 = calculateRisk({
  ...perfectHousehold,
  waterSource: 'river',
  waterTreatmentMethod: ['boil'],
  waterTreatmentConsistency: 'always',
});
assert(res4.total === res3.total, `Total should match Test 3 (${res3.total}) (got ${res4.total})`);
assert(res4.level === res3.level, `Level should match Test 3 (${res3.level}) (got ${res4.level})`);
assert(res4.total <= 10, `Total should be <= 10 (got ${res4.total})`);
assert(res4.level === 'Low', `Level should be 'Low' (got ${res4.level})`);

// Test 5: All worst answers → total === 100, level === 'Critical'
console.log('\nTest 5: All worst answers');
const worstHousehold = {
  // A. Hygiene
  handwashBeforeCooking: 'never',
  handwashDuringCooking: 'never',
  handwashAfterToilet: 'never',
  handwashAfterRawFood: 'never',
  handCutsWounds: 'often',
  hairCovering: 'never',
  handDryingMethod: 'never',

  // B. Water
  waterSource: 'river',
  waterTreatmentMethod: ['none'],
  waterTreatmentConsistency: 'never',
  waterStorage: 'open',
  waterHandlingUtensil: 'never',
  waterContainerCleaning: 'never',
  cookingWaterSameSource: 'no',

  // C. Cooking
  separateRawCooked: 'never',
  crossContamKnifeBoard: 'yes',
  washVegFruits: 'never',
  cookMeatEggsProperly: 'never',
  coverFoodCooking: 'never',
  dishwashSoapLiquid: 'never',
  boilMilk: 'never',

  // D. Storage
  hasFridge: 'no',
  fridgeRawCookedSeparated: 'never',
  roomTempStorageDuration: 'more_4h',
  reheatLeftoversProperly: 'never',
  coverLeftoverFood: 'never',
  dryFoodStorageCovered: 'never',
  consumeMouldyFood: 'yes',
  checkExpiryDate: 'never',

  // E. Environment
  fliesInKitchen: 'often',
  wasteDisposalBin: 'outside',
  petsNearKitchen: 'often',

  // F. History
  recentDiarrhoea: 'yes',
  recentVomitingNausea: 'yes',
  multipleMembersIll: 'yes',
  soughtTreatment: 'no',
  foodWaterSuspected: 'yes',
};
const res5 = calculateRisk(worstHousehold);
assert(res5.total === 100, `Total should be 100 (got ${res5.total})`);
assert(res5.level === 'Critical', `Level should be 'Critical' (got ${res5.level})`);

// Test 6: Empty object → total === 0, unanswered.length equals the number of scored fields
console.log('\nTest 6: Empty object');
const res6 = calculateRisk({});
const totalScoredFields = Object.keys(RISK_WEIGHTS).length;
assert(res6.total === 0, `Total should be 0 (got ${res6.total})`);
assert(res6.level === 'Low', `Level should be 'Low' (got ${res6.level})`);
assert(
  res6.unanswered.length === totalScoredFields,
  `Unanswered count should equal number of scored fields (${totalScoredFields}) (got ${res6.unanswered.length})`
);

// Test 7: One field set to an invalid string → that field appears in unanswered, no crash
console.log('\nTest 7: One field set to an invalid string');
let res7;
let threw = false;
try {
  res7 = calculateRisk({
    ...perfectHousehold,
    handwashBeforeCooking: 'invalid_xyz_response',
  });
} catch (e) {
  threw = true;
}
assert(!threw, 'Should not throw an error');
assert(
  res7.unanswered.includes('handwashBeforeCooking'),
  `'handwashBeforeCooking' should be in unanswered (got ${JSON.stringify(res7.unanswered)})`
);
assert(res7.total === 0, `Total should be 0 (got ${res7.total})`);

// Test 8: Section maxima → sum of SECTION_MAX values equals 100
console.log('\nTest 8: Section maxima sum equals 100');
const sumMax = Object.values(SECTION_MAX).reduce((a, b) => a + b, 0);
assert(sumMax === 100, `Sum of SECTION_MAX must be 100 (got ${sumMax})`);

console.log(`\n========================================`);
console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
