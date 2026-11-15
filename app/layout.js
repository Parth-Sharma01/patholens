import './globals.css';

export const metadata = {
  title: 'PathoLens — Community Foodborne Pathogen Surveillance',
  description:
    'Empowering rural communities with real-time risk scoring, automated surveys, and AI-driven health insights. A Social Project by Team Udte Parinde (Group 4).',
  keywords: 'foodborne pathogen, rural health, risk assessment, food safety, PathoLens',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'PathoLens — Foodborne Pathogen Surveillance',
    description: 'Real-time community health surveillance and AI-powered risk assessment.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 dark:bg-gray-950 dark:text-gray-100 font-sans antialiased selection:bg-brand-500/30">
        {children}
      </body>
    </html>
  );
}
