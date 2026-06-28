'use client';

import Hero from '@/components/sections/Hero';
import Flagship from '@/components/sections/Flagship';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Certifications from '@/components/sections/Certifications';
import Showcases from '@/components/sections/Showcases';
import Writeups from '@/components/sections/Writeups';
import Contact from '@/components/sections/Contact';
import type {
  Hero as HeroContent,
  Certification,
  Education,
  Experience as ExperienceItem,
  Project,
  SecureObs,
  Skills as SkillsContent,
  Writeup,
  Contact as ContactContent,
  SocialLink,
} from '@/lib/schemas';

type ClientHomeProps = {
  heroContent: HeroContent;
  secureObs: SecureObs;
  skills: SkillsContent;
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
  secureObs,
  skills,
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
      <Flagship content={secureObs} secondaryProjects={projects} />
      <Experience experience={experience} />
      <Skills content={skills} />
      <Certifications certifications={certifications} education={education} />
      <Showcases />
      <Writeups writeups={writeups} />
      <Contact content={contactContent} socialLinks={socialLinks} />
    </main>
  );
}
