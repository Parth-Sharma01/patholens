'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Download, Search, RefreshCw, AlertCircle, Wifi, WifiOff, MapPin, ShieldAlert, Droplets, CheckCircle2, AlertTriangle, Newspaper } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const RISK_PALETTE = {
  Low: '#22c55e', Moderate: '#eab308', High: '#f97316', Critical: '#ef4444',
};

const CHART_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#14b8a6'];

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title text-2xl sm:text-3xl font-extrabold"
      >
        {title}
      </motion.h2>
      {subtitle && <p className="section-subtitle text-xs sm:text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color = 'text-brand-500 dark:text-brand-400', badge, badgeColor }) {
  const defaultBadgeColor = color.includes('red')
    ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30'
    : 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-500/30';

  return (
    <div className="card p-5 rounded-2xl flex flex-col justify-between shadow-sm dark:shadow-none min-h-[142px]">
      <div className="flex items-start justify-between gap-2.5 mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider leading-snug">{label}</span>
        <div className="flex items-center shrink-0">
          {badge ? (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap ${badgeColor || defaultBadgeColor}`}>
              {Icon && <Icon className="w-3 h-3 shrink-0" />}
              <span>{badge}</span>
            </span>
          ) : (
            Icon && <Icon className={`w-5 h-5 ${color} opacity-80 shrink-0`} />
          )}
        </div>
      </div>
      <div>
        <p className={`text-3xl sm:text-4xl font-extrabold ${color} tracking-tight`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark rounded-xl px-4 py-3 shadow-2xl border border-slate-200 dark:border-gray-700/60 bg-white/95 dark:bg-gray-950/95">
      <p className="text-xs font-bold text-slate-900 dark:text-gray-200 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-medium flex items-center gap-2" style={{ color: p.color || p.fill }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-slate-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">{typeof p.value === 'number' ? (p.value % 1 === 0 ? p.value : p.value.toFixed(1)) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [selectedVillage, setSelectedVillage] = useState('All');
  const { lang, t } = useLanguage();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/survey-data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleAssessmentSaved = () => {
      fetchData();
    };
    window.addEventListener('patholens:assessment-saved', handleAssessmentSaved);
    return () => window.removeEventListener('patholens:assessment-saved', handleAssessmentSaved);
  }, []);

  // Filtered table rows
  const filteredRows = useMemo(() => {
    if (!data?.enrichedHouseholds) return [];
    return data.enrichedHouseholds.filter(h => {
      const matchSearch = !search ||
        h.village?.toLowerCase().includes(search.toLowerCase()) ||
        h.name_hi?.toLowerCase().includes(search.toLowerCase()) ||
        h.waterSource?.toLowerCase().includes(search.toLowerCase()) ||
        h.id?.toLowerCase().includes(search.toLowerCase());
      const matchRisk = filterRisk === 'All' || h.risk?.level === filterRisk;
      const matchVillage = selectedVillage === 'All' || h.village === selectedVillage;
      return matchSearch && matchRisk && matchVillage;
    });
  }, [data, search, filterRisk, selectedVillage]);

  // CSV export
  const exportCSV = () => {
    if (!filteredRows.length) return;
    const headers = [
      'Household ID', 'Village', 'Village (Hindi)', 'Water Source', 'Water Treatment', 'Handwash Before Cooking',
      'Cross-Contam Knife', 'Food >4h Room Temp', 'Flies in Kitchen', 'Recent Diarrhoea',
      'Risk Score', 'Risk Level'
    ];
    const rows = filteredRows.map(h => [
      h.id || '—', h.village, h.name_hi || h.village, h.waterSource, h.waterTreatment, h.handwashBeforeCooking,
      h.crossContamKnifeBoard, h.roomTempStorageDuration, h.fliesInKitchen, h.recentDiarrhoea,
      h.risk?.total, h.risk?.level,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'shoolini_patholens_data.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const riskDistData = data ? Object.entries(data.riskDistribution).map(([name, count]) => ({
    name: lang === 'hi' ? (name === 'Low' ? 'कम' : name === 'Moderate' ? 'मध्यम' : name === 'High' ? 'उच्च' : 'गंभीर') : name,
    count,
    percentage: Math.round((count / data.totalHouseholds) * 100),
    fill: RISK_PALETTE[name]
  })) : [];

  const radarData = data?.domainAverages ? [
    { subject: lang === 'hi' ? 'स्वच्छता' : 'Hygiene Risk', score: data.domainAverages.hygiene, fullMark: 100 },
    { subject: lang === 'hi' ? 'जल खतरा' : 'Water Hazard', score: data.domainAverages.water, fullMark: 100 },
    { subject: lang === 'hi' ? 'पकाने की कमी' : 'Cooking Deficit', score: data.domainAverages.cooking, fullMark: 100 },
    { subject: lang === 'hi' ? 'भंडारण त्रुटि' : 'Storage Flaws', score: data.domainAverages.storage, fullMark: 100 },
    { subject: lang === 'hi' ? 'कीट जोखिम' : 'Vector Exposure', score: data.domainAverages.environment, fullMark: 100 },
    { subject: lang === 'hi' ? 'बीमारी भार' : 'Illness Burden', score: data.domainAverages.history, fullMark: 100 },
  ] : [];

  const waterRiskData = data?.waterSourceBreakdown || [];
  const topVillages = (data?.villageRankings?.slice(0, 10) || []).map(v => ({
    ...v,
    displayName: lang === 'hi' && v.name_hi ? v.name_hi : v.name,
  }));

  return (
    <section id="dashboard" className="scroll-mt-16 py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-gray-900/60 border-t border-b border-slate-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <SectionHeader
            title={t('dashboard.title', 'Epidemiological Surveillance Dashboard')}
            subtitle={t('dashboard.subtitle', 'Live epidemiological analytics based on 220+ households surveyed across villages surrounding Shoolini University (Solan, HP).')}
          />
          <div className="flex items-center gap-3 self-start sm:self-center">
            {data && (
              <div className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border bg-brand-100 dark:bg-brand-900/30 border-brand-300 dark:border-brand-700/50 text-brand-700 dark:text-brand-300">
                <Wifi className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                <span>{data.isLive ? (lang === 'hi' ? 'लाइव शीट डेटा' : 'Live Sheet Data') : (lang === 'hi' ? 'शूलिनी कोहोर्ट (220+ परिवार)' : 'Shoolini Cohort (220+ HH)')}</span>
              </div>
            )}
            <button onClick={fetchData} disabled={loading} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {lang === 'hi' ? 'रिफ्रेश' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{lang === 'hi' ? 'डेटा लोड करने में त्रुटि:' : 'Failed to load data:'} {error}</span>
            <button onClick={fetchData} className="ml-auto text-xs underline">{lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-72">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                {lang === 'hi' ? 'शूलिनी विश्वविद्यालय ग्राम सर्वेक्षण डेटा संकलित किया जा रहा है...' : 'Aggregating Shoolini University village surveys...'}
              </p>
            </div>
          </div>
        ) : data && (
          <div className="space-y-8">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={lang === 'hi' ? 'सर्वेक्षित परिवार' : 'Surveyed Households'}
                value={data.totalHouseholds}
                sub={lang === 'hi' ? `${data.totalVillages} ग्रामीण क्षेत्रों में` : `Across ${data.totalVillages} local rural clusters`}
                icon={MapPin}
                color="text-brand-600 dark:text-brand-400"
              />
              <StatCard
                label={lang === 'hi' ? 'निगरानी वाले गांव' : 'Villages Monitored'}
                value={data.totalVillages}
                sub={lang === 'hi' ? 'बाजहोल, सुल्तानपुर, ओचघाट, नौणी आदि' : 'Bajhol, Sultanpur, Ochghat, Nauni, etc.'}
                icon={CheckCircle2}
                color="text-purple-600 dark:text-purple-400"
              />
              <StatCard
                label={lang === 'hi' ? 'उच्च / गंभीर जोखिम' : 'High / Critical Risk'}
                value={`${data.highRiskPct}%`}
                sub={lang === 'hi' ? `${data.riskDistribution.High + data.riskDistribution.Critical} संवेदनशील परिवार` : `${data.riskDistribution.High + data.riskDistribution.Critical} vulnerable households`}
                icon={ShieldAlert}
                color="text-red-600 dark:text-red-400"
                badge={lang === 'hi' ? 'अस्पताल रेफरल' : 'Hospital Referral'}
              />
              <StatCard
                label={lang === 'hi' ? 'असुरक्षित जल' : 'Untreated Water'}
                value={`${data.untreatedWaterPct}%`}
                sub={lang === 'hi' ? 'बिना उबाले/फिल्टर सीधा सेवन' : 'Drink directly without boiling/filter'}
                icon={Droplets}
                color="text-amber-600 dark:text-amber-400"
              />
            </div>

            {/* Row 1: Risk Distribution Bar + Domain Radar */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Risk Distribution Bar Chart */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'जोखिम प्रोफाइल वितरण' : 'Risk Profile Distribution'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {lang === 'hi' ? '220+ शूलिनी ग्रामीण परिवारों में जोखिम वर्गीकरण' : 'Categorization across 220+ Shoolini village households'}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-400 bg-brand-100 dark:bg-brand-950/80 border border-brand-300 dark:border-brand-800 px-2 py-0.5 rounded-full">
                    Algorithm 0–100
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={riskDistData} barSize={42}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name={lang === 'hi' ? 'परिवार' : 'Households'} radius={[8, 8, 0, 0]}>
                      {riskDistData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart: 6 Core Risk Domains */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'मल्टी-डोमेन खतरा रडार' : 'Multi-Domain Hazard Radar'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {lang === 'hi' ? '6 सर्वेक्षण आयामों में औसत संवेदनशीलता' : 'Average vulnerability across the 6 survey dimensions'}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 px-2 py-0.5 rounded-full">
                    {lang === 'hi' ? 'डोमेन गंभीरता' : 'Domain Severity'}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid stroke="#cbd5e1" className="dark:stroke-gray-700" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name={lang === 'hi' ? 'खतरा %' : 'Deficit %'} dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.45} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Village Rankings + Water Source Risk */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top 10 Village Vulnerability Rankings */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'शीर्ष ग्राम संवेदनशीलता सूचकांक' : 'Top Village Vulnerability Index'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {lang === 'hi' ? 'औसत पारिवारिक जोखिम स्कोर के आधार पर' : 'Ranked by average household risk score'}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-gray-400">Solan District, HP</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topVillages} barSize={20} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis type="category" dataKey="displayName" tick={{ fill: '#64748b', fontSize: 11 }} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgRisk" name={lang === 'hi' ? 'औसत जोखिम स्कोर' : 'Avg Risk Score'} radius={[0, 6, 6, 0]}>
                      {topVillages.map((v, i) => (
                        <Cell key={i} fill={v.avgRisk > 55 ? '#ef4444' : v.avgRisk > 40 ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Water Source Risk Gradient */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'जल स्रोत बनाम संदूषण स्कोर' : 'Water Source vs. Contamination Score'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {lang === 'hi' ? 'घरेलू पेयजल स्रोत के आधार पर औसत जोखिम' : 'Average risk score by primary household drinking supply'}
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={waterRiskData} barSize={34}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" vertical={false} />
                    <XAxis dataKey="source" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgRisk" name={lang === 'hi' ? 'औसत जोखिम' : 'Avg Risk'} radius={[8, 8, 0, 0]}>
                      {waterRiskData.map((entry, i) => (
                        <Cell key={i} fill={entry.avgRisk > 60 ? '#ef4444' : entry.avgRisk > 35 ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Village Environmental Surveillance & News Alerts */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 mb-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    {lang === 'hi' ? 'स्थानीय महामारी विज्ञान समाचार एवं पर्यावरणीय संदर्भ' : 'Local Health News & Environmental Risk Context'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'सोलन ग्रामीण क्लस्टर: क्षेत्रीय जल व स्वास्थ्य समाचार निगरानी' : 'Solan Rural Clusters: Regional Catchment & News Reports'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400">
                    {lang === 'hi'
                      ? 'जल शक्ति विभाग, प्राथमिक स्वास्थ्य केंद्र ओचघाट और गिरी नदी जलग्रहण क्षेत्र से संबंधित जमीनी समाचार एवं जल स्रोत प्रोफाइल।'
                      : 'Grounded by Jal Shakti Dept advisories, PHC Ochghat reports, and Giri/Ashwani river catchment incidents.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800/50">
                    {data.villageRankings?.filter(v => v.recentAlert).length} {lang === 'hi' ? 'सक्रिय चेतावनियां' : 'Active Advisories'}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                {data.villageRankings?.map((v) => {
                  const isSelected = selectedVillage === v.name;
                  const isHi = lang === 'hi';
                  return (
                    <div
                      key={v.name}
                      onClick={() => setSelectedVillage(isSelected ? 'All' : v.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 shadow-md'
                          : v.recentAlert
                            ? 'bg-amber-50/70 dark:bg-gray-950/70 border-amber-300 dark:border-amber-500/40 hover:border-amber-400'
                            : 'bg-white dark:bg-gray-950/50 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {isHi && v.name_hi ? v.name_hi : v.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            v.avgRisk > 55 ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800/60' :
                            v.avgRisk > 35 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60' :
                            'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                          }`}>
                            {v.avgRisk}/100 {isHi ? 'जोखिम' : 'Risk'}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-600 dark:text-brand-400 mb-1">{v.zone}</p>
                        <p className="text-[11px] text-slate-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {v.newsReport}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 dark:text-gray-400 truncate max-w-[150px]">💧 {v.waterSourceProfile}</span>
                        <span className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                          {isSelected ? (isHi ? 'चयन हटाएं' : 'Clear filter') : (isHi ? 'डेटा देखें →' : 'Filter HH →')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Top Risk Drivers & Survey Responses Table */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {lang === 'hi' ? `सर्वेक्षण रिकॉर्ड एक्सप्लोरर (${filteredRows.length} परिवार)` : `Survey Response Explorer (${filteredRows.length} Households)`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    {lang === 'hi' ? 'गांव या जोखिम स्तर से फ़िल्टर करें, रिकॉर्ड खोजें या सीएसवी डाउनलोड करें।' : 'Filter by village or risk classification, search records, or download full CSV.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Village dropdown filter */}
                  <select
                    className="select py-1.5 px-3 text-xs w-44"
                    value={selectedVillage}
                    onChange={e => setSelectedVillage(e.target.value)}
                  >
                    <option value="All">{lang === 'hi' ? `सभी गांव (${data.totalVillages})` : `All Villages (${data.totalVillages})`}</option>
                    {data.villageRankings?.map(v => (
                      <option key={v.name} value={v.name}>
                        {lang === 'hi' && v.name_hi ? v.name_hi : v.name}
                      </option>
                    ))}
                  </select>

                  {/* Risk filter */}
                  <div className="flex gap-1 bg-slate-100 dark:bg-gray-950 p-1 rounded-xl border border-slate-300 dark:border-gray-800">
                    {['All', 'Low', 'Moderate', 'High', 'Critical'].map(r => (
                      <button
                        key={r}
                        onClick={() => setFilterRisk(r)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          filterRisk === r
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {lang === 'hi'
                          ? (r === 'All' ? 'सभी' : r === 'Low' ? 'कम' : r === 'Moderate' ? 'मध्यम' : r === 'High' ? 'उच्च' : 'गंभीर')
                          : r}
                      </button>
                    ))}
                  </div>

                  {/* Search box */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
                    <input
                      className="input pl-8 py-1.5 text-xs w-36 sm:w-44"
                      placeholder={t('dashboard.searchPlaceholder', 'Search ID, village...')}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <button onClick={exportCSV} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>

              {/* Mobile Table Swipe Hint */}
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mb-2 sm:hidden flex items-center gap-1.5 font-mono">
                <span>⇄</span>
                <span>{lang === 'hi' ? 'सभी 9 कॉलम देखने के लिए टेबल को बाएं-दाएं स्वाइप करें' : 'Swipe table horizontally to inspect all survey fields'}</span>
              </p>

              {/* Responsive Table */}
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-xl border border-slate-200 dark:border-gray-800/80">
                <table className="w-full text-xs text-left">
                  <thead className="sticky top-0 bg-slate-100/95 dark:bg-gray-950/95 border-b border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'परिवार कोड' : 'HH Code'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'गांव' : 'Village'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'जल स्रोत' : 'Water Source'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'जल उपचार' : 'Boil / Filter'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'चाकू संदूषण' : 'Cross-Contam'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'मक्खियां' : 'Flies'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'बीमारी (3 माह)' : 'Illness (3 Mo)'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'स्कोर' : 'Score'}</th>
                      <th className="py-2.5 px-3">{lang === 'hi' ? 'जोखिम स्तर' : 'Risk Level'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-gray-800/60">
                    {filteredRows.slice(0, 100).map((h, i) => {
                      const level = h.risk?.level;
                      const badgeStyle = {
                        Low: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700/50',
                        Moderate: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50',
                        High: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700/50',
                        Critical: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50',
                      }[level] || 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-400';

                      const displayVillage = lang === 'hi' && h.name_hi ? h.name_hi : h.village;

                      return (
                        <tr key={h.id || i} className={`transition-colors ${h.isLiveSubmission ? 'bg-emerald-50/70 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40' : 'hover:bg-slate-50 dark:hover:bg-gray-800/40'}`}>
                          <td className="py-2.5 px-3 font-mono font-medium text-brand-600 dark:text-brand-400">
                            <span className="inline-flex items-center gap-1.5">
                              {h.id || `HH-${i + 1}`}
                              {h.isLiveSubmission && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-sans font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-400/50">
                                  LIVE
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            <span className="flex items-center gap-1.5">
                              {displayVillage}
                              {h.recentAlert && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Recent local water advisory" />
                              )}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-gray-300 capitalize">{h.waterSource?.replace('_', ' ')}</td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-gray-300 capitalize">{h.waterTreatment}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${h.crossContamKnifeBoard === 'yes' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'text-slate-500 dark:text-gray-400'}`}>
                              {h.crossContamKnifeBoard === 'yes' ? (lang === 'hi' ? 'हां (एक ही चाकू)' : 'Yes (Same Knife)') : (lang === 'hi' ? 'नहीं' : 'No')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 capitalize text-slate-700 dark:text-gray-300">{h.fliesInKitchen}</td>
                          <td className="py-2.5 px-3">
                            {h.recentDiarrhoea === 'yes' || h.recentVomitingNausea === 'yes' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                                {lang === 'hi' ? 'दर्ज' : 'Reported'}
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-gray-500">{lang === 'hi' ? 'कोई नहीं' : 'None'}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{h.risk?.total}/100</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                              {lang === 'hi'
                                ? (level === 'Low' ? 'कम' : level === 'Moderate' ? 'मध्यम' : level === 'High' ? 'उच्च' : 'गंभीर')
                                : level}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-gray-500">
                <span>
                  {lang === 'hi'
                    ? `${filteredRows.length} में से ${Math.min(filteredRows.length, 100)} प्रविष्टियां प्रदर्शित`
                    : `Displaying ${Math.min(filteredRows.length, 100)} of ${filteredRows.length} filtered entries`}
                </span>
                <span>
                  {lang === 'hi'
                    ? 'शूलिनी विश्वविद्यालय ग्राम महामारी विज्ञान अध्ययन हेतु कैलिब्रेटेड डेटा'
                    : 'Data calibrated for Shoolini University Village Epidemiology Study'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
