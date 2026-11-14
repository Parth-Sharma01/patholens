import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

os.makedirs("report_assets", exist_ok=True)

# 1. Figure 1: Research Methodology Flowchart
fig, ax = plt.subplots(figsize=(8.5, 4.5), dpi=300)
ax.axis('off')

boxes = [
    ("Phase 1: Instrument Design", "38-Item Bilingual Questionnaire\n(Sections A–G: Hygiene, Water,\nCooking, Storage, Vectors, History)", 0.1, 0.5),
    ("Phase 2: Field Data Collection", "225 Households Surveyed\nAcross 20 Villages Surrounding\nShoolini University (Solan, HP)", 0.32, 0.5),
    ("Phase 3: Mathematical Risk Engine", "0–100 Weighted Score\n6 Epidemiological Domains\nStratification: Low to Critical", 0.54, 0.5),
    ("Phase 4: RAG AI & Clinical Triage", "Retrieval-Augmented Chatbot\nAutomated Alert Triggers\nNearby Hospital Directory (Solan)", 0.76, 0.5),
    ("Phase 5: Field Action", "108 Ambulance Dispatch\nPHC / CHW Interventions\nCommunity Boiling Advisories", 0.94, 0.5)
]

for title, desc, x, y in boxes:
    bbox_props = dict(boxstyle="round,pad=0.5", fc="#f8fafc", ec="#0f172a", lw=1.5)
    ax.text(x, y, f"{title}\n\n{desc}", ha="center", va="center", size=7.5,
            bbox=bbox_props, fontfamily='serif', weight='normal')

# Draw arrows
for i in range(len(boxes) - 1):
    x_start = boxes[i][2] + 0.08
    x_end = boxes[i+1][2] - 0.08
    ax.annotate('', xy=(x_end, 0.5), xytext=(x_start, 0.5),
                arrowprops=dict(facecolor='#10b981', edgecolor='#059669', width=1.5, headwidth=6, shrink=0.05))

ax.set_title("Figure 1: PathoLens Research Methodology & Implementation Workflow", fontsize=11, fontweight='bold', pad=15, fontfamily='serif')
plt.tight_layout()
plt.savefig("report_assets/fig1_methodology.png", dpi=300, bbox_inches='tight')
plt.close()

# 2. Figure 2: System Architecture Diagram
fig, ax = plt.subplots(figsize=(8.5, 4.8), dpi=300)
ax.axis('off')

layers = [
    ("Data Ingestion Layer", "Google Forms Survey Export · Dynamic CSV Endpoint · In-Memory LRU Cache · Automated Validation", 0.85, "#e0f2fe", "#0284c7"),
    ("Analytical & Risk Processing Layer", "6-Domain Weighted Scoring Algorithm (0–100) · Real-Time Severity Classification · Normalization Engine", 0.62, "#f0fdf4", "#16a34a"),
    ("RAG AI Intelligence & Hospital Directory Layer", "Semantic Vector/Keyword Retriever · Micro-Knowledge Base · Gemini 1.5 Flash / Groq · Local Fallback · 24x7 Solan Hospital Directory", 0.39, "#fefce8", "#ca8a04"),
    ("User Interface & Action Layer", "Next.js App Router · Interactive Gauge Meters · Recharts Visual Analytics · 108 Emergency Dial · Exportable Assessment Summaries", 0.16, "#fef2f2", "#dc2626")
]

for title, desc, y, bg, border in layers:
    bbox = dict(boxstyle="round,pad=0.6", fc=bg, ec=border, lw=1.8)
    ax.text(0.5, y, f"[{title.upper()}]\n{desc}", ha="center", va="center", size=8.5,
            bbox=bbox, fontfamily='serif', color="#0f172a")

for y in [0.73, 0.50, 0.27]:
    ax.annotate('', xy=(0.5, y - 0.05), xytext=(0.5, y + 0.05),
                arrowprops=dict(facecolor='#0f172a', edgecolor='#0f172a', width=1.8, headwidth=6))

ax.set_title("Figure 2: End-to-End Architectural Pipeline of the PathoLens Platform", fontsize=11, fontweight='bold', pad=15, fontfamily='serif')
plt.tight_layout()
plt.savefig("report_assets/fig2_architecture.png", dpi=300, bbox_inches='tight')
plt.close()

# 3. Figure 3: Risk Classification Distribution Pie Chart
fig, ax = plt.subplots(figsize=(6, 4.5), dpi=300)
labels = ['Low Risk\n(0–24 pts)\n48.9%', 'Moderate Risk\n(25–44 pts)\n48.0%', 'High Risk\n(45–69 pts)\n2.7%', 'Critical Risk\n(70–100 pts)\n0.4%']
sizes = [110, 108, 6, 1]
colors_pie = ['#22c55e', '#eab308', '#f97316', '#ef4444']
explode = (0.02, 0.02, 0.08, 0.15)

wedges, texts, autotexts = ax.pie(sizes, explode=explode, labels=labels, colors=colors_pie,
                                  autopct='%1.0f HH', startangle=140, pctdistance=0.65,
                                  textprops=dict(fontfamily='serif', size=8.5))
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_weight('bold')
    autotext.set_size(8)

ax.set_title("Figure 3: Household Risk Tier Distribution Across 225 Surveyed Families", fontsize=10.5, fontweight='bold', pad=12, fontfamily='serif')
plt.tight_layout()
plt.savefig("report_assets/fig3_risk_pie.png", dpi=300, bbox_inches='tight')
plt.close()

# 4. Figure 4: Water Source vs. Average Risk Score
fig, ax = plt.subplots(figsize=(7, 4), dpi=300)
sources = ['Purifier (RO/UV)', 'Piped Tap Water', 'Hand Pump / Borewell', 'Open Well', 'Natural Spring / River']
avg_risks = [14.2, 22.8, 31.5, 44.2, 62.7]
colors_bar = ['#16a34a', '#22c55e', '#eab308', '#f97316', '#ef4444']

bars = ax.barh(sources, avg_risks, color=colors_bar, edgecolor='#0f172a', height=0.55, linewidth=0.8)
ax.set_xlim(0, 80)
ax.set_xlabel("Average Household Risk Score (0–100)", fontfamily='serif', fontsize=9.5, fontweight='bold')
ax.set_title("Figure 4: Impact of Primary Drinking Water Source on Risk Severity", fontfamily='serif', fontsize=10.5, fontweight='bold', pad=12)
ax.grid(axis='x', linestyle='--', alpha=0.5)

for bar in bars:
    w = bar.get_width()
    ax.text(w + 1.2, bar.get_y() + bar.get_height()/2, f"{w:.1f}", ha='left', va='center', fontfamily='serif', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig("report_assets/fig4_water_risk.png", dpi=300, bbox_inches='tight')
plt.close()

# 5. Figure 5: Top 10 Village Vulnerability Rankings
fig, ax = plt.subplots(figsize=(7.5, 4.5), dpi=300)
villages = ['Ochghat', 'Bhojnagar', 'Kotla', 'Shamlesh', 'Bajhol', 'Deothi', 'Patti', 'Koro', 'Sultanpur', 'Nauni']
v_scores = [37.2, 36.1, 35.4, 34.8, 34.2, 33.6, 33.0, 32.5, 30.8, 26.4]

y_pos = np.arange(len(villages))
ax.barh(y_pos, v_scores, color='#0284c7', edgecolor='#0f172a', height=0.6, linewidth=0.8)
ax.set_yticks(y_pos)
ax.set_yticklabels(villages, fontfamily='serif', fontsize=8.5)
ax.invert_yaxis()
ax.set_xlim(0, 48)
ax.set_xlabel("Mean Composite Risk Score", fontfamily='serif', fontsize=9.5, fontweight='bold')
ax.set_title("Figure 5: Vulnerability Rankings of Surveyed Villages Near Shoolini University", fontfamily='serif', fontsize=10.5, fontweight='bold', pad=12)
ax.grid(axis='x', linestyle='--', alpha=0.5)

for i, v in enumerate(v_scores):
    ax.text(v + 0.8, i, f"{v:.1f}", va='center', fontfamily='serif', fontsize=8.5, fontweight='bold', color='#0f172a')

plt.tight_layout()
plt.savefig("report_assets/fig5_village_rankings.png", dpi=300, bbox_inches='tight')
plt.close()

# 6. Figure 6: Multi-Domain Hazard Radar Chart
fig, ax = plt.subplots(figsize=(5.5, 5), subplot_kw=dict(polar=True), dpi=300)
categories = ['Hygiene Deficit', 'Water Safety Hazard', 'Cooking Flaws', 'Storage Lapses', 'Vector Exposure', 'Illness Burden']
N = len(categories)
angles = [n / float(N) * 2 * np.pi for n in range(N)]
angles += angles[:1]

values = [28.4, 38.6, 32.1, 39.5, 34.2, 22.8]
values += values[:1]

ax.plot(angles, values, linewidth=2, linestyle='solid', color='#10b981')
ax.fill(angles, values, color='#10b981', alpha=0.25)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, fontfamily='serif', size=8.5)
ax.set_rlabel_position(30)
ax.set_yticks([10, 20, 30, 40, 50])
ax.set_yticklabels(["10%", "20%", "30%", "40%", "50%"], color="grey", size=7.5, fontfamily='serif')
ax.set_ylim(0, 50)
ax.set_title("Figure 6: Mean Vulnerability Deficit Across the 6 Risk Domains", fontfamily='serif', fontsize=10.5, fontweight='bold', pad=20)

plt.tight_layout()
plt.savefig("report_assets/fig6_radar.png", dpi=300, bbox_inches='tight')
plt.close()

# 7. Figure 7: Risk Stratification & Clinical Action Framework
fig, ax = plt.subplots(figsize=(8, 3.8), dpi=300)
ax.axis('off')

tiers = [
    ("LOW RISK\n(0–24 pts)", "#dcfce7", "#16a34a", "Safe baseline compliance.\nPiped/RO water; good hygiene.\nAnnual routine check."),
    ("MODERATE RISK\n(25–44 pts)", "#fef9c3", "#ca8a04", "Early hazard signals.\nIntermittent boiling; >2h room storage.\nTargeted hygiene education."),
    ("HIGH RISK\n(45–69 pts)", "#ffedd5", "#ea580c", "Dangerous exposure.\nRaw spring water; cross-contamination.\nCHW home visit within 7 days."),
    ("CRITICAL RISK\n(70–100 pts)", "#fee2e2", "#dc2626", "Outbreak alert / Active sickness.\nDiarrhoea/vomiting; multiple ill.\nImmediate 108 dispatch & PHC.")
]

for i, (title, bg, border, details) in enumerate(tiers):
    x = 0.125 + i * 0.25
    bbox = dict(boxstyle="round,pad=0.6", fc=bg, ec=border, lw=2)
    ax.text(x, 0.5, f"{title}\n\n{details}", ha="center", va="center", size=8,
            bbox=bbox, fontfamily='serif', color="#0f172a")

ax.set_title("Figure 7: PathoLens 4-Tier Epidemiological Triage & Action Framework", fontsize=11, fontweight='bold', pad=15, fontfamily='serif')
plt.tight_layout()
plt.savefig("report_assets/fig7_triage_framework.png", dpi=300, bbox_inches='tight')
plt.close()

print("All 7 figures successfully generated in report_assets/!")
