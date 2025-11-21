import { aboutCopy } from '../../data/about';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';

const About = () => (
  <Section id="about" accent>
    <SectionHeader eyebrow="About" title={aboutCopy.title} subtitle={aboutCopy.paragraphs[0]} />
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <div className="space-y-4 text-slate-300">
          {aboutCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Card>
      <Card>
        <div className="space-y-3">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-primary">Focus Areas</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              {aboutCopy.focusAreas.map((area) => (
                <li key={area}>• {area}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-primary">Current stack</div>
            <p className="mt-2 text-sm text-slate-300">{aboutCopy.stack}</p>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

export default About;
