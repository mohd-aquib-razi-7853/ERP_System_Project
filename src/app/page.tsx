"use client"
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Feature';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/Cta';

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}