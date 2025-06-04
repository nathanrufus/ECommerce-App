'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '../ui/Loader';

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // adjust as needed

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        children
      )}
    </>
  );
}
