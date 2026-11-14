import { Heart } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo size="md" />
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-500 leading-relaxed mb-1.5">
              Village-Level Foodborne Pathogen Surveillance & Compounding Risk Modeling.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
              Shoolini University of Biotechnology & Management Sciences · Solan, HP
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-gray-400 uppercase tracking-wide mb-3">Sections</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-gray-500">
              {['#food-safety', '#overview', '#calculator', '#dashboard', '#emergency', '#team'].map(href => (
                <li key={href}>
                  <a href={href} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors capitalize">
                    {href === '#food-safety'
                      ? 'Food Safety Guide'
                      : href === '#emergency'
                      ? 'Emergency Hospitals'
                      : href.replace('#', '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-gray-400 uppercase tracking-wide mb-3">Built With</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-gray-500">
              {['Next.js 14 (App Router)', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Google Gemini AI', 'Google Sheets API'].map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 dark:text-gray-500">
            © {new Date().getFullYear()} PathoLens · Team <span className="font-semibold text-slate-800 dark:text-gray-300">Udte Parinde</span> · Social Project Group-4
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for rural community health
          </p>
        </div>
      </div>
    </footer>
  );
}