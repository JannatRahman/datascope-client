'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  TableProperties,
  Search,
  Bookmark,
  Clock,
  LineChart,
  Users,
  Settings,
  Shield,
} from 'lucide-react';
import { ClientOnly } from '../components/ClientOnly';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useGetMeQuery } from '../api/endpoints/auth.api';

function Sidebar() {
  const pathname = usePathname();
  // Always resolve the role from the API (Bearer token / cookie). Do not gate on
  // `useSession()` — it can lag or be null while a valid API session exists,
  // which previously caused Administrators to be shown as "Viewer".
  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const roleName = meData?.user?.roleName ?? (meLoading ? 'Loading…' : 'Viewer');

  const isAdmin = roleName === 'Administrator';
  const isAnalyst = roleName === 'Data Analyst' || isAdmin;

  const overviewHref =
    roleName === 'Administrator' ? '/admin' : roleName === 'Data Analyst' ? '/analyst' : '/viewer';

  const navItems: { label: string; href: string; icon: React.ElementType; show: boolean }[] = [
    { label: 'Overview', href: overviewHref, icon: LayoutDashboard, show: true },
    { label: 'Dataset Library', href: '/datasets', icon: Database, show: true },
    { label: 'Data Explorer', href: '/explorer', icon: TableProperties, show: true },
    { label: 'Advanced Search', href: '/explorer', icon: Search, show: true },
    { label: 'Saved Views', href: isAdmin ? '/admin' : isAnalyst ? '/analyst' : '/viewer', icon: Bookmark, show: true },
    { label: 'Search History', href: isAnalyst ? '/analyst' : '/viewer', icon: Clock, show: true },
    { label: 'Analytics', href: isAnalyst ? '/analyst' : '/viewer', icon: LineChart, show: isAnalyst },
    { label: 'User Management', href: '/admin', icon: Users, show: isAdmin },
    { label: 'Dataset Management', href: '/admin', icon: Database, show: isAdmin },
    { label: 'Settings', href: '/profile', icon: Settings, show: true },
  ];

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white">
      <div className="flex h-full flex-col">
        <div className="px-4 py-4 border-b border-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
          {navItems
            .filter((i) => i.show)
            .map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href) && item.label === 'Overview') ||
                (item.label === 'Data Explorer' && pathname.startsWith('/explorer')) ||
                (item.label === 'Dataset Library' && pathname.startsWith('/datasets'));
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              Role
            </div>
            <p className="mt-1 text-slate-500">{roleName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AppNavbar />
        <div className="flex flex-1 mx-auto w-full max-w-7xl">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </ClientOnly>
  );
}
