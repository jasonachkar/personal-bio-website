import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { LinksSection } from '@/components/sections/LinksSection';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SiemDashboard } from '@/features/siem/SiemDashboard';
import { GameHub } from '@/features/games/GameHub';
import { getProjects } from '@/lib/data-access/projects';
import { getGames } from '@/lib/data-access/games';

export default async function Home() {
  // Fetch data from Supabase
  const projects = await getProjects();
  const games = await getGames();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection projects={projects} />

      {/* SIEM Simulator Section */}
      <SectionContainer id="siem" background="default">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              SIEM Simulator
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
            <p className="mt-4 text-lg text-text-secondary">
              Interactive Security Operations Center dashboard with live threat detection and analysis
            </p>
          </div>
          <SiemDashboard />
        </div>
      </SectionContainer>

      {/* Game Hub Section */}
      <SectionContainer id="games" background="elevated">
        <div className="mx-auto max-w-7xl">
          <GameHub games={games} />
        </div>
      </SectionContainer>

      <LinksSection />
      <ContactSection />
    </>
  );
}
