import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { label: 'GitHub', href: 'https://github.com/jasonachkar', Icon: Github },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jason-achkar-diab', Icon: Linkedin },
    { label: 'Email', href: 'mailto:jasonachkardiab@gmail.com', Icon: Mail },
  ];

  return (
    <footer className="border-t border-border bg-background-card py-10">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
        <div>
          <p className="font-semibold text-text-primary">Jason Achkar Diab</p>
          <p className="mt-1 text-sm text-text-muted">
            DevSecOps · Cloud Security · Application Security — Montreal, QC (open to remote)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-lg border border-border bg-background-elevated p-2 text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          © {currentYear} Jason Achkar Diab · Built with Next.js, TypeScript &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
