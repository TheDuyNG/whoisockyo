import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Download, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProjectCard } from '@/components/public/project-card';
import { Badge } from '@/components/ui/badge';
import { buttonClassName } from '@/components/ui/button-styles';
import { Card } from '@/components/ui/card';
import { ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { queryKeys } from '@/lib/query-keys';
import { portfolioService } from '@/services/portfolio.service';

const categoryLabels: Record<string, string> = {
  LANGUAGE: 'Languages',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  DEVOPS: 'DevOps',
  TOOL: 'Tools',
};

export default function HomePage() {
  const portfolioQuery = useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: portfolioService.getPortfolio,
  });

  if (portfolioQuery.isLoading) {
    return (
      <div className="container-shell section-space">
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (portfolioQuery.isError || !portfolioQuery.data) {
    return (
      <div className="container-shell section-space">
        <ErrorState
          message="The portfolio could not be loaded."
          onRetry={() => void portfolioQuery.refetch()}
        />
      </div>
    );
  }

  const { profile, projects, experience, skills, socialLinks } = portfolioQuery.data;
  const groupedSkills = Object.entries(
    skills.reduce<Record<string, typeof skills>>((groups, skill) => {
      groups[skill.category] = [...(groups[skill.category] ?? []), skill];
      return groups;
    }, {}),
  );
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4);

  return (
    <>
      <section className="container-shell flex min-h-[calc(100vh-4rem)] items-center py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
              {profile?.availabilityStatus === 'AVAILABLE'
                ? 'Available for selected opportunities'
                : 'Currently focused on active work'}
            </div>
            <p className="mb-4 font-mono text-sm text-primary">
              &gt; whois {profile?.name ?? 'ockyo'}_
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {profile?.headline ?? 'Building dependable digital products.'}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
              {profile?.shortBio ??
                'A full-stack developer shaping clear, fast, and maintainable experiences.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/projects" className={buttonClassName({ size: 'lg' })}>
                Explore my work <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className={buttonClassName({ size: 'lg', variant: 'secondary' })}>
                Start a conversation
              </Link>
              {profile?.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClassName({ size: 'lg', variant: 'ghost' })}
                >
                  <Download className="h-4 w-4" /> Résumé
                </a>
              ) : null}
            </div>
          </div>

          <Card className="relative overflow-hidden p-6 lg:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 bg-primary/10 blur-3xl" />
            <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">identity.ts</span>
            </div>
            <pre className="overflow-x-auto font-mono text-xs leading-7 sm:text-sm">
              <code>
                <span className="text-primary">const</span> developer = {'{'}
                {'\n'} name: <span className="text-amber-500">'{profile?.name ?? 'Ockyo'}'</span>,
                {'\n'} role: <span className="text-amber-500">'Full-stack Developer'</span>,{'\n'}{' '}
                location: <span className="text-amber-500">'{profile?.location ?? 'Remote'}'</span>,
                {'\n'} values: [<span className="text-amber-500">'clarity'</span>,{' '}
                <span className="text-amber-500">'craft'</span>,{' '}
                <span className="text-amber-500">'reliability'</span>],
                {'\n'} building: <span className="text-primary">true</span>,{'\n'}
                {'}'};{'\n\n'}
                <span className="text-muted-foreground">
                  // thoughtful systems, polished details
                </span>
                {'\n'}
                <span className="text-primary">export default</span> developer;
                <span className="ml-1 inline-block h-4 w-1.5 animate-blink bg-primary align-middle" />
              </code>
            </pre>
          </Card>
        </div>
      </section>

      <section id="about" className="section-space border-y border-border bg-card/35">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="technical-label">01 / About</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Engineering with intent.
            </h2>
          </div>
          <div className="space-y-8 text-base leading-8 text-muted-foreground">
            <p className="text-xl leading-9 text-foreground">{profile?.bio}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="p-5">
                <p className="technical-label mb-3">Philosophy</p>
                <p>{profile?.philosophy || 'Build the clearest solution that can evolve.'}</p>
              </Card>
              <Card className="p-5">
                <p className="technical-label mb-3">Current focus</p>
                <p>{profile?.currentFocus || 'Polished products and dependable systems.'}</p>
              </Card>
            </div>
            {profile?.location ? (
              <p className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" /> {profile.location}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section id="experience" className="container-shell section-space">
        <p className="technical-label">02 / Experience</p>
        <div className="mt-10 border-l border-border">
          {experience.map((entry) => (
            <article
              key={entry.id}
              className="relative grid gap-3 pb-12 pl-7 last:pb-0 md:grid-cols-[0.3fr_0.7fr]"
            >
              <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  {new Date(entry.startDate).getFullYear()} —{' '}
                  {entry.isCurrent
                    ? 'Present'
                    : entry.endDate
                      ? new Date(entry.endDate).getFullYear()
                      : ''}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{entry.position}</h3>
                <p className="mt-1 text-sm text-primary">{entry.company}</p>
                <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                  {entry.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.technologies.map((technology) => (
                    <Badge key={technology}>{technology}</Badge>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="section-space border-y border-border bg-card/35">
        <div className="container-shell">
          <p className="technical-label">03 / Capabilities</p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Tools chosen for the problem, not the trend.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedSkills.map(([category, categorySkills]) => (
              <Card key={category} className="p-5">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {categoryLabels[category] ?? category}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <Badge key={skill.id} className="bg-background text-foreground">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-space">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="technical-label">04 / Selected work</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Recent projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            View every project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4)).map(
            (project) => (
              <ProjectCard key={project.id} project={project} />
            ),
          )}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-shell section-space text-center">
          <p className="technical-label">05 / Contact</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Have a difficult problem worth solving?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
            I’m always interested in thoughtful products, ambitious engineering work, and good
            conversations.
          </p>
          <Link to="/contact" className={buttonClassName({ size: 'lg', className: 'mt-8' })}>
            Let’s talk <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-8 flex justify-center gap-5 text-sm text-muted-foreground">
            {socialLinks.map((socialLink) => (
              <a
                key={socialLink.id}
                href={socialLink.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {socialLink.platform}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
