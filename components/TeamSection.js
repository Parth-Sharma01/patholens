'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Users, School, Crown } from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/team';
import { useLanguage } from '@/context/LanguageContext';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const BG_GRADIENTS = [
  'from-emerald-700 to-emerald-950',
  'from-purple-700 to-purple-950',
  'from-blue-700 to-blue-950',
  'from-orange-700 to-orange-950',
  'from-pink-700 to-pink-950',
  'from-indigo-700 to-indigo-950',
];

function TeamCard({ member, index }) {
  const [imgError, setImgError] = useState(false);
  const fallbackGrad = BG_GRADIENTS[index % BG_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div
        className={`h-full flex flex-col justify-between p-5 rounded-2xl transition-all duration-300 relative ${
          member.isLeader
            ? 'bg-slate-900/90 border border-amber-500/40 ring-1 ring-amber-500/30 hover:border-amber-400/70 shadow-lg shadow-amber-950/20'
            : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-sm'
        }`}
      >
        {member.isLeader && (
          <div className="absolute -top-2.5 right-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/90 border border-amber-500/50 rounded-full px-2.5 py-0.5 shadow-sm z-10">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Leader</span>
          </div>
        )}

        {/* Top Content: Avatar, Role Badge, Name, Description */}
        <div className="flex flex-col items-center text-center">
          {/* Uniform square avatar container */}
          <div
            className={`relative w-20 h-20 rounded-xl overflow-hidden mb-4 mx-auto shrink-0 transition-all duration-300 ${
              member.isLeader
                ? 'ring-2 ring-amber-500/60 shadow-md shadow-amber-950/40'
                : 'ring-1 ring-slate-800 hover:ring-slate-700'
            }`}
          >
            {!imgError && member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${fallbackGrad} flex items-center justify-center`}>
                <span className="text-xl font-bold text-white tracking-wider">{getInitials(member.name)}</span>
              </div>
            )}
          </div>

          {/* Role Badge: Standardized dark pill styling with non-wrapping text */}
          <div className="mb-3 flex justify-center w-full">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap inline-block ${
                member.isLeader
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700'
              }`}
            >
              {member.badge}
            </span>
          </div>

          {/* Member Name */}
          <h3 className="text-base font-bold text-white leading-tight flex items-center justify-center gap-1">
            {member.name}
          </h3>

          {/* Member Role Description */}
          <p className="text-xs text-slate-400 mt-1.5 leading-snug max-w-[170px]">
            {member.role}
          </p>
        </div>

        {/* Pinned Bottom Link: LinkedIn Profile or Contributor tag */}
        <div className="pt-4 mt-3 border-t border-slate-800/80 flex justify-center">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium group/link"
              aria-label={`${member.name} on LinkedIn`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400 group-hover/link:text-emerald-400 transition-colors shrink-0" />
              <span>LinkedIn Profile</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-normal">
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Team Contributor</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const { lang, t } = useLanguage();

  return (
    <section id="team" className="scroll-mt-16 py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4"
          >
            <School className="w-4 h-4 text-emerald-400" />
            {lang === 'hi' ? 'शूलिनी विश्वविद्यालय • सोशल प्रोजेक्ट ग्रुप-4' : 'Shoolini University • Social Project Group-4'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title text-3xl sm:text-4xl font-extrabold text-white"
          >
            {lang === 'hi' ? 'मिलिए ' : 'Meet '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              {lang === 'hi' ? 'उड़ते परिंदे' : 'Udte Parinde'}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto text-center mt-3 text-slate-400 max-w-2xl text-xs sm:text-sm"
          >
            {lang === 'hi'
              ? 'डेटा-संचालित निगरानी के माध्यम से सामुदायिक स्वास्थ्य सुधार के लिए समर्पित शोधकर्ताओं, इंजीनियरों और फील्ड कार्यकर्ताओं का एक बहुविषयक दल।'
              : 'A multidisciplinary team of researchers, engineers, and field workers committed to improving community health through data-driven surveillance.'}
          </motion.p>
        </div>

        {/* 12-Member Grid (2 rows x 6 columns on desktop, responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-stretch">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* Academic Project Affiliation Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center max-w-3xl mx-auto shadow-sm">
          <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
            Faculty of Bioengineering and Food Technology · School of Bioengineering and Food Technology
          </p>
          <p className="text-xs text-slate-400">
            Shoolini University of Biotechnology and Management Sciences, Solan (HP) — 173229
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-emerald-400">
            <span>• Course: B.Tech Bioinformatics and Food Technology (2025–2029)</span>
            <span>• Field Study: 20 Solan Rural Clusters</span>
            <span>• Survey Cohort: 225+ Households</span>
          </div>
        </div>
      </div>
    </section>
  );
}
