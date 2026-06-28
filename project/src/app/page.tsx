import ClientHome from '@/components/ClientHome';
import {
  getHero,
  getCertifications,
  getEducation,
  getExperience,
  getProjects,
  getSecureObs,
  getSkills,
  getWriteups,
  getContact,
  getSocial,
} from '@/lib/content';

export default function Home() {
  const heroContent = getHero();
  const secureObs = getSecureObs();
  const skills = getSkills();
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
      secureObs={secureObs}
      skills={skills}
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
