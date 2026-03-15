import React from 'react';
import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import FeatureCards from './FeatureCards';
import HowItWorks from './HowItWorks';
import PricingSection from './PricingSection';
import LandingFooter from './LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white antialiased">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeatureCards />
        <HowItWorks />
        <PricingSection />
        <LandingFooter />
      </main>
    </div>
  );
}
