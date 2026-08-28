import { useQuery } from '@tanstack/react-query';
import {
  BriefcaseBusiness,
  FolderKanban,
  MessageSquare,
  Radio,
  Sparkles,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/dashboard/page-header';
import { ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Card } from '@/components/ui/card';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

const metricDefinitions = [
  {
    key: 'totalProjects',
    label: 'Total projects',
    icon: FolderKanban,
    href: '/dashboard/projects',
  },
  { key: 'featuredProjects', label: 'Featured projects', icon: Star, href: '/dashboard/projects' },
  {
    key: 'publishedProjects',
    label: 'Published projects',
    icon: Radio,
    href: '/dashboard/projects',
  },
  { key: 'totalSkills', label: 'Skills', icon: Sparkles, href: '/dashboard/skills' },
  {
    key: 'experienceEntries',
    label: 'Experience entries',
    icon: BriefcaseBusiness,
    href: '/dashboard/experience',
  },
  {
    key: 'unreadMessages',
    label: 'Unread messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
  },
] as const;

export default function DashboardHomePage() {
  const metricsQuery = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: adminService.getDashboardMetrics,
  });

  return (
    <>
      <PageHeader title="Overview" description="A live summary of your portfolio content." />
      {metricsQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
      {metricsQuery.isError ? (
        <ErrorState
          message="Dashboard metrics could not be loaded."
          onRetry={() => void metricsQuery.refetch()}
        />
      ) : null}
      {metricsQuery.data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metricDefinitions.map((metric) => {
            const Icon = metric.icon;
            return (
              <Link key={metric.key} to={metric.href}>
                <Card className="p-5 transition hover:border-primary/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight">
                        {metricsQuery.data[metric.key]}
                      </p>
                    </div>
                    <span className="rounded-xl border border-border bg-muted p-2.5 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : null}
      <Card className="mt-8 p-6">
        <p className="technical-label">System status</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <div>
            <p className="text-sm font-medium">Content API connected</p>
            <p className="text-xs text-muted-foreground">
              Metrics above reflect stored portfolio data.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
