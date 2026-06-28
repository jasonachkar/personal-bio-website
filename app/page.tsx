import { Contact } from '@/components/sections/Contact';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { Hero } from '@/components/sections/Hero';
import { LabsStrip } from '@/components/sections/LabsStrip';
import { SecondaryProjects } from '@/components/sections/SecondaryProjects';
import { SecureObsSection } from '@/components/sections/SecureObsSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SecureObsSection />
      <LabsStrip />
      <ExperienceTimeline />
      <SecondaryProjects />
      <Contact />
    </>
  );
}
