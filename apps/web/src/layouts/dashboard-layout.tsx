import {
  BriefcaseBusiness,
  ChevronRight,
  ExternalLink,
  FolderKanban,
  Gauge,
  Link2,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { cn } from '@/lib/cn';
import { useAuth } from '@/providers/auth-context';

const navigationItems = [
  { label: 'Overview', href: '/dashboard', icon: Gauge, exact: true },
  { label: 'Profile', href: '/dashboard/profile', icon: UserRound },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { label: 'Experience', href: '/dashboard/experience', icon: BriefcaseBusiness },
  { label: 'Skills', href: '/dashboard/skills', icon: Sparkles },
  { label: 'Social links', href: '/dashboard/social-links', icon: Link2 },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = navigationItems.find((item) =>
    item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href),
  );

  async function handleSignOut(): Promise<void> {
    try {
      await signOut();
      void navigate('/login', { replace: true });
    } catch {
      toast.error('Sign out failed. Please try again.');
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link to="/dashboard" className="font-mono text-sm font-semibold">
          <span className="text-primary">&gt;</span> admin<span className="text-primary">_</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground',
                  isActive && 'bg-muted font-medium text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-2 truncate px-3 text-xs text-muted-foreground">{admin?.email}</div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative h-full w-72 border-r border-border bg-card">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-3"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </Button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Dashboard</span>
              {currentPage?.label !== 'Overview' ? (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{currentPage?.label}</span>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className={buttonClassName({ variant: 'ghost', size: 'sm' })}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View site</span>
            </a>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
