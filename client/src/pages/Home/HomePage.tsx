import React from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { Hero } from '../../components/hero/Hero';
import { MarvelDcSplit } from '../../components/layout/MarvelDcSplit';
import { FeaturedProducts } from '../../components/product/FeaturedProducts';
import { WhyChooseUs } from '../../components/layout/WhyChooseUs';
import { CustomizerTeaser } from '../../components/layout/CustomizerTeaser';
import { Footer } from '../../components/layout/Footer';

export const HomePage: React.FC = () => {
  const handleLaunchCustomizer = () => {
    window.location.href = '/customizer';
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Landing Flow */}
      <main>
        {/* Cinematic Hero */}
        <Hero />

        {/* Marvel vs DC Split Collections */}
        <MarvelDcSplit />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Customizer Teaser with interactive 3D viewer */}
        <CustomizerTeaser onLaunchCustomizer={handleLaunchCustomizer} />
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
