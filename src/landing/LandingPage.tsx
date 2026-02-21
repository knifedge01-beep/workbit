import { LandingNav } from './components/LandingNav'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { CTASection } from './components/CTASection'
import { PricingSection } from './components/PricingSection'
import { Footer } from './components/Footer'
import './landing.css'

export function LandingPage() {
  return (
    <div className="landing">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  )
}
