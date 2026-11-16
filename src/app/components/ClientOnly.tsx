'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

const subscribeToMount = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMounted,
    getServerMounted,
  );

  return mounted ? <>{children}</> : <>{fallback}</>;
}
