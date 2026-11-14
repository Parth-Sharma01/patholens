import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FoodSafetyHub from '@/components/FoodSafetyHub';
import ProjectOverview from '@/components/ProjectOverview';
import RiskCalculator from '@/components/RiskCalculator';
import Dashboard from '@/components/Dashboard';
import EmergencySection from '@/components/EmergencySection';
import TeamSection from '@/components/TeamSection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import BioBackground from '@/components/BioBackground';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="relative min-h-screen transition-colors duration-300">
          <BioBackground />
          <div className="relative z-10">
            <Navbar />
            <Hero />
            <FoodSafetyHub />
            <ProjectOverview />
            <RiskCalculator />
            <Dashboard />
            <EmergencySection />
            <TeamSection />
            <Footer />
            <ChatWidget />
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
