/**
 * lib/riskVideos.js — Configuration for Risk-Level Educational & Emergency Videos
 *
 * To add your videos:
 * Option A (Local Video File):
 *   Drop your .mp4 or .webm files into the `public/videos/` directory:
 *     - public/videos/moderate-risk.mp4
 *     - public/videos/high-risk.mp4
 *     - public/videos/critical-risk.mp4
 *
 * Option B (YouTube / External URL):
 *   Set `youtubeId` or `src` to an external URL below.
 */

export const RISK_VIDEOS = {
  Moderate: {
    title: 'Moderate Risk: Preventive Food Safety & Water Handling',
    subtitle: 'Safe holding temperatures, boiling practices, and container hygiene for rural households',
    src: '/videos/Moderate_risk.mp4',
    youtubeId: '', // Optional: e.g. "dQw4w9WgXcQ" or leave empty to use local mp4
    badge: 'Moderate Risk Advisory',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderClass: 'border-amber-500/30',
    keyPoints: [
      'Boil or microfilter all drinking water prior to storage',
      'Limit cooked food holding at room temperature to under 2 hours',
      'Regularly scrub and sanitize water storage containers weekly',
    ],
  },
  High: {
    title: 'High Risk: Pathogen Containment & Vector Control',
    subtitle: 'Preventing cross-contamination, safe handling of raw produce, and fly-proofing',
    src: '/videos/High_risk.mp4',
    youtubeId: '',
    badge: 'High Risk Intervention',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    borderClass: 'border-orange-500/40',
    keyPoints: [
      'Cease using raw untreated river/stream water immediately',
      'Segregate raw meat/egg cutting boards from ready-to-eat foods',
      'Ensure 20-second soap handwashing before preparing family meals',
    ],
  },
  Critical: {
    title: 'Critical Risk: Acute Emergency Medical Protocol & Dehydration Care',
    subtitle: 'Immediate clinical referral, ORS therapy, and cluster outbreak prevention',
    src: '/videos/Critically_high_risk.mp4',
    youtubeId: '',
    badge: '🚨 Critical Emergency Protocol',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderClass: 'border-rose-500/50 shadow-rose-950/50',
    keyPoints: [
      'Begin immediate Oral Rehydration Salts (ORS) administration in boiled water',
      'Dial 108 Emergency Ambulance or visit Regional Hospital Solan / nearest PHC',
      'Isolate contaminated food/water source and report to local ASHA/health worker',
    ],
  },
};
