import { SectionContainer } from '@/components/layout/SectionContainer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getLinks } from '@/lib/data-access/links';
import { ExternalLink, Download, FileText, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Icon mapping - extend as needed
const iconMap: Record<string, any> = {
  Github: ExternalLink,
  Linkedin,
  Download,
  FileText,
  Mail,
  Twitter,
};

export async function LinksSection() {
  const links = await getLinks();

  return (
    <SectionContainer id="links" background="elevated">
      <AnimatedSection>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              Connect With Me
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
          </div>

          {links.length === 0 ? (
            <div className="rounded-lg border border-border bg-background-card p-8 text-center">
              <ExternalLink className="mx-auto mb-4 h-12 w-12 text-text-muted" />
              <p className="text-text-secondary">
                No links added yet. Add social and resume links to your Supabase database!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link, index) => {
                const Icon = iconMap[link.icon_name] || ExternalLink;

                return (
                  <AnimatedSection key={link.id} delay={index * 0.05}>
                    <a
                      href={link.url}
                      target={link.type !== 'email' ? '_blank' : undefined}
                      rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 text-left"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1">{link.label}</span>
                        {link.type === 'resume_download' && (
                          <Download className="h-4 w-4 text-text-muted" />
                        )}
                        {!['resume_download', 'email'].includes(link.type) && (
                          <ExternalLink className="h-4 w-4 text-text-muted" />
                        )}
                      </Button>
                    </a>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
