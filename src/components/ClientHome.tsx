'use client';

import Hero from '@/components/sections/Hero';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { MegaDemos } from '@/components/sections/MegaDemos';
import { SecureObsBand } from '@/components/sections/SecureObsBand';
import type {
  Hero as HeroContent,
  About as AboutContent,
  Certification,
  Education,
  Experience as ExperienceItem,
  Project,
  Writeup,
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
  writeups: Writeup[];
  contactContent: ContactContent;
  socialLinks: SocialLink[];
};

export default function ClientHome({
  heroContent,
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
      <SecureObsBand />
      <MegaDemos />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Contact content={contactContent} socialLinks={socialLinks} />
    </main>
  );
}
