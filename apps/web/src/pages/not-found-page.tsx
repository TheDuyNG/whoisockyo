import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-20 text-center">
      <div>
        <p className="font-mono text-sm text-primary">404 / route_not_found</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Nothing lives at this address.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page may have moved, or the URL may be incomplete.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Return home
        </Link>
      </div>
    </main>
  );
}
