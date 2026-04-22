import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { BenefitsGrid } from '../components/BenefitsGrid';
import { FeaturedProducts } from '../components/FeaturedProducts';

export default function Landing() {
  return (
    <div className="landing-wrapper">
      <HeroSection />
      <div style={{ padding: '2rem 0', background: 'var(--bg-secondary)' }}>
        <BenefitsGrid />
      </div>
      <FeaturedProducts />
    </div>
  );
}
