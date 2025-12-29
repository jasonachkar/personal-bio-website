'use client';

import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Certifications from '@/components/sections/Certifications';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Showcases from '@/components/sections/Showcases';
import Writeups from '@/components/sections/Writeups';
import Contact from '@/components/sections/Contact';
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
  aboutContent,
  certifications,
  education,
  experience,
  projects,
  writeups,
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
      <Certifications certifications={certifications} education={education} />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Showcases />
      <Writeups writeups={writeups} />
      <Contact content={contactContent} socialLinks={socialLinks} />
    </main>
  );
}
