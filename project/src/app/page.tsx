import ClientHome from '@/components/ClientHome';
import {
  getHero,
  getAbout,
  getCertifications,
  getEducation,
  getExperience,
  getProjects,
  getWriteups,
  getContact,
  getSocial,
} from '@/lib/content';

export default function Home() {
  const heroContent = getHero();
  const aboutContent = getAbout();
  const certifications = getCertifications();
  const education = getEducation();
  const experience = getExperience();
  const projects = getProjects();
  const writeups = getWriteups();
  const contactContent = getContact();
  const socialLinks = getSocial();

  return (
    <ClientHome
      heroContent={heroContent}
      aboutContent={aboutContent}
      certifications={certifications}
      education={education}
      experience={experience}
      projects={projects}
      writeups={writeups}
      contactContent={contactContent}
      socialLinks={socialLinks}
    />
  );
}
