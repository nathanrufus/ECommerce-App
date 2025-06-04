'use client';

import React, { ReactNode } from 'react';
import Loader from './Loader';

type Props = {
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode; // Optional: allow custom fallback UI
};

export default function LoadingWrapper({ loading, children, fallback }: Props) {
  if (loading) {
    return fallback || <Loader />;
  }
  return <>{children}</>;
}
