'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Database,
  TableProperties,
  LogOut,
  User,
  Shield,
  LineChart,
  Eye,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  ChevronDown,
  UserCheck,
  Home,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useGetMeQuery } from '../../api/endpoints/auth.api';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '../../api/endpoints/notifications.api';

const subscribeToMount = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

export function AppNavbar() {
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMounted,
    getServerMounted,
  );

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-500/20">
              <Database className="h-4 w-4" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Data<span className="text-indigo-600">Scope</span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  return <AppNavbarContent />;
}

function AppNavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: meData } = useGetMeQuery(undefined, { skip: !session });

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Notification Queries & Mutations
  const { data: notifData } = useGetNotificationsQuery(undefined, { skip: !session, pollingInterval: 10000 });
  const { data: unreadData } = useGetUnreadCountQuery(undefined, { skip: !session, pollingInterval: 10000 });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const notifications = notifData?.data || [];
  const unreadCount = unreadData?.data?.unreadCount || 0;

  const roleName = meData?.user?.roleName ?? 'Viewer';

  // Logout handler: Clears tokens and redirects directly to homepage (/)
  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('datascope_token');
      sessionStorage.clear();
    }
    await signOut();
    router.replace('/');
  };

  // Build role-specific primary dashboard link
  const getRoleDashboardLink = () => {
    if (roleName === 'Administrator') {
      return { label: 'Admin Console', href: '/admin', icon: Shield };
    }
    if (roleName === 'Data Analyst') {
      return { label: 'Analyst Dashboard', href: '/analyst', icon: LineChart };
    }
    return { label: 'Viewer Portal', href: '/viewer', icon: Eye };
  };

  const roleLink = getRoleDashboardLink();

  // Navigation Links including explicit Home link
  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    roleLink,
    { label: 'Dataset Library', href: '/datasets', icon: Database },
    { label: 'Data Explorer', href: '/explorer', icon: TableProperties },
  ];

  const roleBadgeColors: Record<string, string> = {
    Administrator: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Data Analyst': 'bg-blue-100 text-blue-700 border-blue-200',
    Viewer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo: Links directly to homepage (/) */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
            title="Return to DataScope Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-500/20">
              <Database className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Data<span className="text-indigo-600">Scope</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                Unified Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-100/80 p-1 border border-slate-200/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs font-bold border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-3">
          {/* Home Icon Shortcut */}
          <Link
            href="/"
            title="Go to Homepage"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 p-3.5 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllRead()}
                        disabled={isMarkingAll}
                        className="text-[11px] font-medium text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n: { id: string; title: string; message: string; isRead: boolean; createdAt: string }) => (
                      <div
                        key={n.id}
                        className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                          n.isRead ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/40 hover:bg-indigo-50/60'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!n.isRead && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="p-1 text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotif(n.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu with Role Badge */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1.5 pr-3 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                  {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                    {session.user.name || 'User'}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {roleName}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Account Dropdown */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-fadeIn">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                        {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{session.user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Access Level</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${roleBadgeColors[roleName] || roleBadgeColors.Viewer}`}>
                        <UserCheck className="h-3 w-3" />
                        {roleName}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      href="/"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <Home className="h-4 w-4 text-slate-400" />
                      Platform Homepage
                    </Link>

                    <Link
                      href={roleLink.href}
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <roleLink.icon className="h-4 w-4 text-indigo-600" />
                      {roleLink.label}
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      My Profile & Preferences
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/40">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out (Redirect to Home)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
