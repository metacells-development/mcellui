'use client';

import { Hero, Features, Stats, Showcase, CTA } from '@/components/landing';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Stats />
      <Features />
      <Showcase />
      <CTA />
    </div>
  );
}
