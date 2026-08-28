import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { LoadingSkeleton } from '@/components/ui/async-state';
import { useAuth } from '@/providers/auth-context';

export function ProtectedRoute() {
  const { admin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
