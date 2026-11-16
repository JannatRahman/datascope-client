'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  LineChart,
  Lock,
  Mail,
  Sparkles,
  Bell,
  Moon,
} from 'lucide-react';
import { useGetMeQuery } from '../../api/endpoints/auth.api';
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from '../../api/endpoints/preferences.api';

export default function ProfilePage() {
  const { data: meData, isLoading: meLoading, refetch: refetchMe } = useGetMeQuery();
  const { data: prefData, refetch: refetchPrefs } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();

  const user = meData?.user;
  const roleName = user?.roleName || 'Viewer';

  // Profile update form state
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const name = nameOverride ?? user?.name ?? '';
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preferences form state
  const [densityOverride, setDensityOverride] = useState<string | null>(null);
  const [pageSizeOverride, setPageSizeOverride] = useState<number | null>(null);
  const density = densityOverride ?? prefData?.data?.tableDensity ?? 'comfortable';
  const pageSize = pageSizeOverride ?? prefData?.data?.defaultPageSize ?? 25;
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);
  const [themePref, setThemePref] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'system';
    const t = window.localStorage.getItem('datascope_theme_pref');
    return t === 'light' || t === 'dark' || t === 'system' ? t : 'system';
  });
  const [notifyPref, setNotifyPref] = useState<'all' | 'important' | 'none'>(() => {
    if (typeof window === 'undefined') return 'all';
    const n = window.localStorage.getItem('datascope_notify_pref');
    return n === 'all' || n === 'important' || n === 'none' ? n : 'all';
  });

  const handleSaveThemeNotificationPrefs = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('datascope_theme_pref', themePref);
    window.localStorage.setItem('datascope_notify_pref', notifyPref);
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('datascope_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

      const res = await fetch(`${apiUrl}/api/v1/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      setProfileMsg({ type: 'success', text: 'Profile name updated successfully!' });
      refetchMe();
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: unknown) {
      setProfileMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error updating profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setPasswordSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('datascope_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

      const res = await fetch(`${apiUrl}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Incorrect current password');
      }

      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 3000);
    } catch (err: unknown) {
      setPasswordMsg({ type: 'error', text: err instanceof Error ? err.message : 'Password update failed' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSaving(true);
    try {
      await updatePreferences({ tableDensity: density, defaultPageSize: pageSize }).unwrap();
      handleSaveThemeNotificationPrefs();
      refetchPrefs();
    } catch {
      alert('Failed to save preferences');
    } finally {
      setPrefSaving(false);
    }
  };

  const roleMeta: Record<
    string,
    { badgeClass: string; icon: typeof Shield; description: string; destination: string; label: string; permissions: string[] }
  > = {
    Administrator: {
      badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      icon: Shield,
      description: 'Platform Administrator with comprehensive governance and management rights.',
      destination: '/admin',
      label: 'Admin Console',
      permissions: [
        'User management & role assignments',
        'Dataset access control & memberships',
        'System audit & activity trail monitoring',
        'Query performance telemetry & cluster health',
        'Data exploration, filtering & background exports',
      ],
    },
    'Data Analyst': {
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: LineChart,
      description: 'Data Analyst with high-throughput query and export capabilities.',
      destination: '/analyst',
      label: 'Analyst Dashboard',
      permissions: [
        'Dataset exploration across all accessible datasets',
        'Creation and sharing of custom Saved Views',
        'Search history tracking & query replay',
        'Real-data analytics & distribution metrics',
        'Bounded-memory background CSV and JSON exports',
      ],
    },
    Viewer: {
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Eye,
      description: 'Standard Viewer with read-only exploration entitlements.',
      destination: '/viewer',
      label: 'Viewer Portal',
      permissions: [
        'Read-only exploration of assigned datasets',
        'Server-side search, filtering and sorting',
        'Discovery and viewing of views shared with you',
        'Personal UI and display density preferences',
      ],
    },
  };

  const currentRole = roleMeta[roleName] ?? roleMeta.Viewer;
  const RoleIcon = currentRole.icon;

  if (meLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb / Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <User className="h-4 w-4" />
              <span>Identity & Security</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              User Profile & Role Verification
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage your personal credentials, verify assigned permissions, and configure display settings.
            </p>
          </div>
          <Link
            href={currentRole.destination}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition"
          >
            <RoleIcon className="h-4 w-4" />
            <span>Open {currentRole.label}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: Role Verification Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Role</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${currentRole.badgeClass}`}>
                  {roleName}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <RoleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{roleName} Account</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Verified by PostgreSQL RBAC</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {currentRole.description}
              </p>

              {/* Verified Capabilities */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Verified Capabilities:</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  {currentRole.permissions.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={currentRole.destination}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <span>Go to {currentRole.label}</span>
                </Link>
              </div>
            </div>

            {/* Account Metadata Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">System Metadata</h4>
              <div className="space-y-2 text-slate-600 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Account ID</span>
                  <span className="font-mono text-slate-700 truncate max-w-[140px]">{user?.id || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Auth Provider</span>
                  <span className="font-medium text-slate-700">Better Auth 1.7</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Session Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Authenticated
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Primary Role ID</span>
                  <span className="font-mono text-slate-700 truncate max-w-[140px]">{user?.roleId || 'Auto (Viewer)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: Profile Edit, Password Change & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                <span>Personal Information</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your display name visible across activity logs and shared views.
              </p>

              <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setNameOverride(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Email Address (Read-only)</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2.5 pl-9 pr-3 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {profileMsg && (
                  <div
                    className={`rounded-lg p-3 text-xs flex items-center gap-2 ${
                      profileMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {profileMsg.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-60 transition"
                  >
                    {profileSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-600" />
                <span>Security & Password</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your account password managed by Better Auth credential encryption.
              </p>

              <form onSubmit={handleChangePassword} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    className={`rounded-lg p-3 text-xs flex items-center gap-2 ${
                      passwordMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {passwordMsg.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-60 transition"
                  >
                    {passwordSaving ? 'Updating Password…' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Display & Table Preferences */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-600" />
                <span>Display & Data Explorer Preferences</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Personalized settings stored in PostgreSQL `user_preferences`.
              </p>

              <form onSubmit={handleSavePreferences} className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700">Table Density</label>
                    <select
                      value={density}
                      onChange={(e) => setDensityOverride(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                    >
                      <option value="compact">Compact (Higher row density)</option>
                      <option value="comfortable">Comfortable (Standard)</option>
                      <option value="spacious">Spacious (Larger padding)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700">Default Page Size</label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSizeOverride(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                    >
                      <option value={10}>10 records per page</option>
                      <option value={25}>25 records per page</option>
                      <option value={50}>50 records per page</option>
                      <option value={100}>100 records per page</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-indigo-600" />
                    Theme preferences
                  </h4>
                  <select
                    value={themePref}
                    onChange={(e) => setThemePref(e.target.value as 'light' | 'dark' | 'system')}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="system">System default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-indigo-600" />
                    Notification preferences
                  </h4>
                  <select
                    value={notifyPref}
                    onChange={(e) => setNotifyPref(e.target.value as 'all' | 'important' | 'none')}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="all">All notifications</option>
                    <option value="important">Important only</option>
                    <option value="none">None</option>
                  </select>
                </div>

                {prefSaved && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Preferences updated successfully!</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={prefSaving}
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-60 transition"
                  >
                    {prefSaving ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
