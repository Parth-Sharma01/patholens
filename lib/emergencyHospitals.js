/**
 * lib/emergencyHospitals.js
 * Comprehensive directory of emergency medical facilities, hospitals, and rural health centres
 * serving the Shoolini University and Solan district rural clusters.
 */

export const EMERGENCY_HELPLINES = [
  {
    name: 'State Emergency Ambulance',
    number: '108',
    tel: 'tel:108',
    desc: 'Free 24x7 Government Ambulance & Emergency Medical Response (All Himachal Pradesh)',
    type: 'primary',
  },
  {
    name: 'National Health Helpline',
    number: '104',
    tel: 'tel:104',
    desc: '24x7 Medical Consultation, Triage & Disease Outbreak Reporting',
    type: 'health',
  },
  {
    name: 'Emergency Police / Disaster / Fire',
    number: '112',
    tel: 'tel:112',
    desc: 'Unified National Emergency Helpline',
    type: 'unified',
  },
  {
    name: 'Shoolini Campus Emergency Desk',
    number: '+91 1792 308000',
    tel: 'tel:+911792308000',
    desc: 'Shoolini University Health Centre & Campus Ambulance (Bajhol)',
    type: 'campus',
  },
];

export const NEARBY_HOSPITALS = [
  {
    id: 'shoolini-health-centre',
    name: 'Shoolini University Health Centre & Dispensary',
    category: 'Campus Health Facility',
    distance: '0 - 2 km (Bajhol / Sultanpur area)',
    address: 'Shoolini University Campus, Bajhol, PO Sultanpur, Solan, HP 173229',
    phone: '+91 1792 308000',
    emergencyPhone: '+91 98160 55555',
    tel: 'tel:+911792308000',
    timing: '24x7 Emergency Services & Doctor on Standby',
    facilities: ['Emergency First Aid', 'Doctor on Call', 'Campus Ambulance', 'IV Hydration & ORS', 'Basic Diagnostic Lab'],
    villagesNearby: ['Bajhol (Near Shoolini)', 'Sultanpur', 'Ochghat', 'Nauni'],
    isCampus: true,
  },
  {
    id: 'regional-hospital-solan',
    name: 'Regional Hospital Solan (Civil Hospital)',
    category: 'District Government Hospital',
    distance: '~12 km from Shoolini University',
    address: 'Near Old DC Office, The Mall, Solan, HP 173212',
    phone: '01792-224145',
    emergencyPhone: '01792-223638',
    tel: 'tel:01792224145',
    timing: '24x7 Casualty & Emergency Ward',
    facilities: [
      '24x7 Emergency / Trauma Ward',
      'Intensive Care Unit (ICU)',
      'Pediatric Care & Rehydration Ward',
      'Govt. Blood Bank',
      'Pathological & Microbiological Lab',
      'Government Free Medicines & ORS Supply',
    ],
    villagesNearby: ['Solan Town', 'Kather', 'Saproon', 'Chambaghat', 'Basal', 'Salogra', 'Anji'],
    isTopReferral: true,
  },
  {
    id: 'mmu-hospital-kumarhatti',
    name: 'Maharishi Markandeshwar Medical College & Hospital (MMU)',
    category: 'Tertiary Care Super-Speciality Hospital',
    distance: '~16 km from Shoolini University (Kumarhatti)',
    address: 'Kumarhatti, Solan, Himachal Pradesh 173229',
    phone: '01792-268300',
    emergencyPhone: '01792-268301',
    tel: 'tel:01792268300',
    timing: '24x7 Super-Speciality Trauma & Emergency',
    facilities: [
      'State-of-the-Art Multi-Bed ICU & CCU',
      'Advanced Gastroenterology & Endoscopy',
      '24x7 Critical Care Ambulance Fleet',
      'Comprehensive Pediatric & Neonatal ICU',
      'Advanced Bacterial Culture & Stool Testing Labs',
    ],
    villagesNearby: ['Kumarhatti', 'Dharampur', 'Barog', 'Shamlesh', 'Bhojnagar'],
    isTopReferral: true,
  },
  {
    id: 'phc-ochghat',
    name: 'Primary Health Centre (PHC) Ochghat',
    category: 'Government Primary Health Post',
    distance: '~4 km from Shoolini University',
    address: 'Ochghat Village, Solan-Rajgarh Road, HP 173223',
    phone: '01792-252210',
    emergencyPhone: '108',
    tel: 'tel:01792252210',
    timing: '9:00 AM – 5:00 PM (Emergency 108 on call)',
    facilities: ['Outpatient Care (OPD)', 'Emergency ORS & Hydration', 'Primary Infection Treatment', 'Maternal & Child Health'],
    villagesNearby: ['Ochghat', 'Bajhol (Near Shoolini)', 'Sultanpur', 'Kotla'],
  },
  {
    id: 'chc-dharampur',
    name: 'Community Health Centre (CHC) Dharampur',
    category: 'Sub-Divisional Health Centre',
    distance: '~14 km from Shoolini / Kumarhatti junction',
    address: 'National Highway 5, Dharampur, Solan, HP 173209',
    phone: '01792-264022',
    emergencyPhone: '01792-264022',
    tel: 'tel:01792264022',
    timing: '24x7 Inpatient & Emergency Services',
    facilities: ['Emergency Ward', 'Inpatient Beds', 'Labor & Child Care', 'Direct Ambulance Dispatch'],
    villagesNearby: ['Dharampur', 'Kumarhatti', 'Barog', 'Bhojnagar'],
  },
  {
    id: 'phc-nauni',
    name: 'Primary Health Centre (PHC) Nauni',
    category: 'Rural Primary Health Centre',
    distance: '~6 km from Shoolini University',
    address: 'Near Dr. YS Parmar University Campus, Nauni, Solan, HP 173230',
    phone: '01792-252320',
    emergencyPhone: '108',
    tel: 'tel:01792252320',
    timing: 'Day OPD & Emergency Stabilisation',
    facilities: ['Primary Medical Care', 'Dehydration & Fever Management', 'Free ORS & Zinc Tablets', 'Referral Network'],
    villagesNearby: ['Nauni', 'Patti', 'Deothi', 'Koro'],
  },
  {
    id: 'chc-kandaghat',
    name: 'Civil Hospital / CHC Kandaghat',
    category: 'Sub-Divisional Civil Hospital',
    distance: '~18 km from Solan North (Shimla Highway)',
    address: 'Kandaghat, Solan, Himachal Pradesh 173215',
    phone: '01792-256124',
    emergencyPhone: '01792-256124',
    tel: 'tel:01792256124',
    timing: '24x7 Emergency Services',
    facilities: ['Emergency Casualty', 'General Medicine', 'Pathology Lab', 'Ambulance Station'],
    villagesNearby: ['Kandaghat', 'Salogra', 'Chambaghat'],
  },
];

export const CRITICAL_TRIAGE_ACTIONS = [
  {
    step: '1',
    title: 'Immediate Oral Rehydration',
    title_hi: 'तत्काल ओरल रिहाइड्रेशन (ORS)',
    desc: 'Administer WHO standard ORS dissolved in boiled and cooled water. Alternate with clean rice kanji or coconut water. Avoid plain untreated water.',
    desc_hi: 'उबले और ठंडे पानी में घुला WHO प्रमाणित ORS दें। सादा बिना उबला पानी न दें।',
    priority: 'high',
  },
  {
    step: '2',
    title: 'Monitor Red Flag Symptoms',
    title_hi: 'गंभीर लक्षणों की निगरानी',
    desc: 'High fever (>101°F), blood or mucus in stool, continuous vomiting >6 hours, extreme lethargy, or sunken eyes indicate immediate medical need.',
    desc_hi: 'तेज बुखार, मल में खून, लगातार उल्टी, अत्यधिक कमजोरी या धंसी हुई आंखें दिखने पर तुरंत अस्पताल ले जाएं।',
    priority: 'critical',
  },
  {
    step: '3',
    title: 'Quarantine Suspect Food & Water',
    title_hi: 'संदिग्ध भोजन व पानी को अलग करें',
    desc: 'Stop consumption of suspect food and water source immediately. Inform neighbours if a common village baoli/tank was used.',
    desc_hi: 'संदिग्ध खाद्य या जल का सेवन तुरंत रोकें। यदि सार्वजनिक बावड़ी/नल का उपयोग किया हो तो पड़ोसियों को भी सूचित करें।',
    priority: 'high',
  },
  {
    step: '4',
    title: 'Dial Emergency Transport',
    title_hi: 'आपातकालीन एम्बुलेंस 108 पर कॉल करें',
    desc: 'Dial 108 for free government emergency ambulance. For Shoolini campus residents, dispatch campus ambulance from Bajhol health desk.',
    desc_hi: 'मुफ्त सरकारी एम्बुलेंस के लिए 108 डायल करें। शूलिनी परिसर के लिए हेल्थ सेंटर संपर्क नंबर पर कॉल करें।',
    priority: 'critical',
  },
];

export function getHospitalsForVillage(villageName) {
  if (!villageName) return NEARBY_HOSPITALS;
  const filtered = NEARBY_HOSPITALS.filter(h =>
    h.villagesNearby?.some(v => v.toLowerCase().includes(villageName.toLowerCase()))
  );
  return filtered.length ? filtered : NEARBY_HOSPITALS;
}
