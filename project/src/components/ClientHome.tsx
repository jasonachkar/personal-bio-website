'use client';

import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications';
import SocLive from '@/components/sections/SocLive';
import MitreHeatmap from '@/components/sections/MitreHeatmap';
import ThreatIntel from '@/components/sections/ThreatIntel';
import Writeups from '@/components/sections/Writeups';
import Contact from '@/components/sections/Contact';
import type {
  Hero as HeroContent,
  About as AboutContent,
  Certification,
  Education,
  Experience as ExperienceItem,
  Project,
  Contact as ContactContent,
  SocialLink,
} from '@/lib/schemas';

type ClientHomeProps = {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  certifications: Certification[];
  education: Education[];
  experience: ExperienceItem[];
  projects: Project[];
  contactContent: ContactContent;
  socialLinks: SocialLink[];
};

export default function ClientHome({
  heroContent,
  aboutContent,
  certifications,
  education,
  experience,
  projects,
  contactContent,
  socialLinks,
}: ClientHomeProps) {
  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="relative">
      <Hero onNavigate={scrollTo} content={heroContent} />
      <About content={aboutContent} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Certifications certifications={certifications} education={education} />
      <SocLive />
      <MitreHeatmap />
      <ThreatIntel />
      <Writeups />
      <Contact content={contactContent} socialLinks={socialLinks} />
    </main>
  );
}
