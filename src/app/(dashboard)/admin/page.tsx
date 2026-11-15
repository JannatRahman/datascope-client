'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Database,
  Shield,
  Activity,
  Layers,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  Zap,
  Lock,
  UserCheck,
  CheckCircle2,
  X,
  Sliders,
  Server,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { AppNavbar } from '../../components/layout/AppNavbar';
import {
  PlatformUser,
  useGetAdminOverviewQuery,
  useGetAdminUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAdminRolesQuery,
  useGetAdminPermissionsQuery,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useGetAdminDatasetsQuery,
  useAddDatasetMemberMutation,
  useRemoveDatasetMemberMutation,
  useGetActivityLogsQuery,
  useGetPerformanceLogsQuery,
} from '../../api/endpoints/admin.api';
import { useGetMeQuery } from '../../api/endpoints/auth.api';

export default function AdminPage() {
  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const isAdmin = meData?.user?.roleName === 'Administrator';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'roles' | 'datasets' | 'logs' | 'performance'
  >('overview');

  // Overview Query
  const {
    data: overviewData,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useGetAdminOverviewQuery(undefined, { skip: !isAdmin });

  // Users Query & State
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const { data: usersData, refetch: refetchUsers } = useGetAdminUsersQuery(
    { q: userSearch, page: userPage, pageSize: 15 },
    { skip: !isAdmin },
  );
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Create User Modal
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  // User Dataset Membership Modal
  const [membershipUser, setMembershipUser] = useState<PlatformUser | null>(null);

  // Roles & Permissions Query & State
  const { data: rolesData, refetch: refetchRoles } = useGetAdminRolesQuery(undefined, {
    skip: !isAdmin,
  });
  const { data: permsData } = useGetAdminPermissionsQuery(undefined, { skip: !isAdmin });
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { data: rolePermsData } = useGetRolePermissionsQuery(selectedRole, {
    skip: !selectedRole || !isAdmin,
  });
  const [updateRolePermissions] = useUpdateRolePermissionsMutation();
  const [selectedPermIds, setSelectedPermIds] = useState<Set<string>>(new Set());

  // Set initial selected role when roles load
  React.useEffect(() => {
    if (rolesData?.data && rolesData.data.length > 0 && !selectedRole) {
      setSelectedRole(rolesData.data[0].id);
    }
  }, [rolesData, selectedRole]);

  // Sync selected permissions when role changes
  React.useEffect(() => {
    if (rolePermsData?.data) {
      setSelectedPermIds(new Set(rolePermsData.data.map((p) => p.id)));
    }
  }, [rolePermsData]);

  // Datasets Management Query
  const { data: adminDatasetsData, refetch: refetchAdminDatasets } =
    useGetAdminDatasetsQuery(undefined, { skip: !isAdmin });
  const [addDatasetMember] = useAddDatasetMemberMutation();
  const [removeDatasetMember] = useRemoveDatasetMemberMutation();

  // Activity Logs
  const [logPage, setLogPage] = useState(1);
  const { data: logsData, refetch: refetchLogs } = useGetActivityLogsQuery(
    { page: logPage, pageSize: 20 },
    { skip: !isAdmin },
  );

  // Performance Logs
  const { data: perfLogsData, refetch: refetchPerf } = useGetPerformanceLogsQuery(
    { page: 1, pageSize: 20 },
    { skip: !isAdmin },
  );

  if (meLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">Access Denied</h2>
            <p className="mt-2 text-xs text-slate-600">
              The Administrator Console is restricted to accounts with the Administrator role.
            </p>
            <Link
              href="/datasets"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const metrics = overviewData?.data?.metrics ?? {
    totalUsers: 0,
    activeUsers: 0,
    totalDatasets: 6,
    totalRecords: 280000,
    totalQueries: 0,
    avgLatencyMs: 0,
    cacheHitRate: 92,
    totalExports: 0,
    activeExports: 0,
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName) return;
    try {
      await createUser({
        email: newUserEmail.trim(),
        name: newUserName.trim(),
        password: newUserPassword || undefined,
        roleId: newUserRole || undefined,
      }).unwrap();
      setIsCreateUserOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      refetchUsers();
      refetchOverview();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    if (userId === meData?.user?.id) {
      const adminRole = rolesData?.data?.find((r) => r.name === 'Administrator');
      if (adminRole && newRoleId !== adminRole.id) {
        alert('Security safeguard: You cannot remove your own Administrator role.');
        return;
      }
    }
    try {
      await updateUser({ userId, roleId: newRoleId }).unwrap();
      refetchUsers();
      refetchOverview();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === meData?.user?.id && currentStatus) {
      alert('Security safeguard: You cannot deactivate your own Administrator account.');
      return;
    }
    try {
      await updateUser({ userId, emailVerified: !currentStatus }).unwrap();
      refetchUsers();
      refetchOverview();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update account status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === meData?.user?.id) {
      alert('Security safeguard: You cannot delete your own Administrator account.');
      return;
    }
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await deleteUser(userId).unwrap();
      refetchUsers();
      refetchOverview();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleTogglePermission = (permId: string) => {
    setSelectedPermIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await updateRolePermissions({
        roleId: selectedRole,
        permissionIds: Array.from(selectedPermIds),
      }).unwrap();
      alert('Role permissions saved successfully and cache invalidated!');
      refetchRoles();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save permissions');
    }
  };

  const handleAddMember = async (datasetId: string, userId: string, accessLevel: 'viewer' | 'editor' | 'manager') => {
    try {
      await addDatasetMember({ datasetId, userId, accessLevel }).unwrap();
      refetchAdminDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update dataset access');
    }
  };

  const handleRemoveMember = async (datasetId: string, userId: string) => {
    try {
      await removeDatasetMember({ datasetId, userId }).unwrap();
      refetchAdminDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to remove member');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNavbar />

      {/* Top Banner */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                <Shield className="h-4 w-4" />
                <span>Enterprise Administration</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Administrator Console
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage platform users, roles, dataset permissions, system performance, and audit trails.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Cluster Healthy
              </span>
              <button
                onClick={() => {
                  refetchOverview();
                  refetchUsers();
                  refetchRoles();
                  refetchAdminDatasets();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex gap-1 border-b border-slate-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Platform Overview', icon: Activity },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'roles', label: 'Roles & Permissions', icon: Lock },
              { id: 'datasets', label: 'Dataset Access Control', icon: Database },
              { id: 'logs', label: 'System Activity Logs', icon: FileText },
              { id: 'performance', label: 'Query Performance', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 w-full">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Total Platform Users</span>
                  <Users className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.totalUsers}</div>
                <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                  {metrics.activeUsers} Active Accounts
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Live Indexed Records</span>
                  <Database className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {metrics.totalRecords.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Across 6 Enterprise Datasets</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Query Cache Hit Rate</span>
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.cacheHitRate}%</div>
                <div className="mt-1 text-[11px] text-slate-500">Redis Distributed Cache</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Average Query Latency</span>
                  <Clock className="h-4 w-4 text-purple-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.avgLatencyMs} ms</div>
                <div className="mt-1 text-[11px] text-emerald-600 font-medium">PostgreSQL GIN Indexed</div>
              </div>
            </div>

            {/* Datasets Breakdown & Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Datasets Usage */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Dataset Distribution</h3>
                  <Link href="/datasets" className="text-xs font-medium text-indigo-600 hover:underline">
                    View Catalog
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {overviewData?.data?.datasets.map((d) => (
                    <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{d.name}</div>
                        <div className="text-[11px] text-slate-400">{d.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold text-slate-900">
                          {d.recordCount.toLocaleString()} records
                        </div>
                        <div className="text-[11px] text-slate-500">{d.fieldCount} fields</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">System Activity Stream</h3>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    View All Logs
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {(overviewData?.data?.recentActivity ?? []).length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No system activity recorded yet.
                    </div>
                  ) : (
                    overviewData?.data?.recentActivity.map((log) => (
                      <div key={log.id} className="py-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{log.action}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{log.description}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">By {log.userName || log.userEmail || 'System'}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
              <button
                onClick={() => setIsCreateUserOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create User</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Assigned Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Dataset Access</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {(usersData?.data ?? []).map((u) => {
                    const isSelf = u.id === meData?.user?.id;
                    const isUserActive = u.emailVerified !== false;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 font-bold text-indigo-700 text-[11px]">
                              {u.name[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="rounded bg-indigo-50 text-indigo-700 px-1.5 py-0.2 text-[9px] font-bold border border-indigo-200">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.roleId ?? ''}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                          >
                            {(rolesData?.data ?? []).map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, isUserActive)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold border transition ${
                              isUserActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                            title={isUserActive ? 'Click to deactivate account' : 'Click to activate account'}
                          >
                            {isUserActive ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 text-amber-600" />
                                <span>Deactivated</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setMembershipUser(u)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition"
                          >
                            <Database className="h-3 w-3 text-indigo-500" />
                            <span>Dataset Access</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isSelf ? (
                            <span className="text-[10px] text-slate-400 font-medium italic">Active Admin</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Delete user account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Create User Modal */}
            {isCreateUserOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Create Platform Account</h3>
                    <button
                      onClick={() => setIsCreateUserOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Alice Johnson"
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="alice@datascope.local"
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Initial Password (Optional)</label>
                      <input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Default: DataScope2026!"
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        If omitted, will default to DataScope2026!
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Assign Platform Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                      >
                        <option value="">Default (Viewer)</option>
                        {(rolesData?.data ?? []).map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} - {r.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsCreateUserOpen(false)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white shadow-2xs hover:bg-indigo-700"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* User Dataset Access Modal */}
            {membershipUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Dataset Access: {membershipUser.name}</h3>
                      <p className="text-xs text-slate-500">{membershipUser.email} • Role: {membershipUser.roleName || 'Viewer'}</p>
                    </div>
                    <button
                      onClick={() => setMembershipUser(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {(adminDatasetsData?.data ?? []).map((dataset) => {
                      const memberRecord = dataset.members.find((m) => m.userId === membershipUser.id);
                      const isMember = !!memberRecord;

                      return (
                        <div
                          key={dataset.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                        >
                          <div>
                            <div className="font-semibold text-xs text-slate-900">{dataset.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {dataset.category} • {dataset.recordCount.toLocaleString()} records
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isMember ? (
                              <>
                                <select
                                  value={memberRecord.accessLevel}
                                  onChange={(e) =>
                                    handleAddMember(
                                      dataset.id,
                                      membershipUser.id,
                                      e.target.value as 'viewer' | 'editor' | 'manager',
                                    )
                                  }
                                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                                >
                                  <option value="viewer">Viewer (Read-only)</option>
                                  <option value="editor">Editor (Query & Saved Views)</option>
                                  <option value="manager">Manager (Manage & Export)</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(dataset.id, membershipUser.id)}
                                  className="rounded px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                                >
                                  Revoke
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddMember(dataset.id, membershipUser.id, 'viewer')}
                                className="rounded px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition"
                              >
                                Grant Access
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setMembershipUser(null)}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ROLES & PERMISSIONS */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Role Selector Sidebar */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Configured Platform Roles
                </h3>
                <div className="space-y-2">
                  {(rolesData?.data ?? []).map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`w-full text-left rounded-lg p-3 transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-2xs'
                            : 'hover:bg-slate-50 border border-transparent text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs flex items-center justify-between">
                          <span>{r.name}</span>
                          {r.isSystem && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">
                              System
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{r.description}</div>
                        <div className="text-[10px] text-slate-400 mt-2">
                          {r.userCount} assigned users • {r.permissionCount} permissions
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Permissions Matrix: {rolesData?.data?.find((r) => r.id === selectedRole)?.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Toggle functional entitlements across datasets, search, exports, and administration.
                      </p>
                    </div>
                    <button
                      onClick={handleSavePermissions}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {(permsData?.data ?? []).map((p) => {
                      const isChecked = selectedPermIds.has(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer text-xs transition-colors ${
                            isChecked
                              ? 'border-indigo-300 bg-indigo-50/40 text-slate-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(p.id)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="font-semibold text-slate-800">{p.name}</div>
                            <div className="text-[10px] text-slate-500">{p.description}</div>
                            <span className="inline-block mt-1 text-[9px] rounded bg-slate-100 px-1 text-slate-500 uppercase">
                              {p.category}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATASET ACCESS CONTROL */}
        {activeTab === 'datasets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {(adminDatasetsData?.data ?? []).map((dataset) => (
                <div
                  key={dataset.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{dataset.name}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {dataset.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {dataset.recordCount.toLocaleString()} records • {dataset.fieldCount} fields • {dataset.members.length} assigned members
                      </p>
                    </div>

                    <Link
                      href={`/explorer?datasetId=${dataset.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Open in Explorer →
                    </Link>
                  </div>

                  {/* Members list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Assigned Members & Access Levels:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {dataset.members.map((m) => (
                        <div
                          key={m.userId}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{m.userName}</div>
                            <div className="text-[11px] text-slate-500">{m.userEmail}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={m.accessLevel}
                              onChange={(e) =>
                                handleAddMember(
                                  dataset.id,
                                  m.userId,
                                  e.target.value as 'viewer' | 'editor' | 'manager',
                                )
                              }
                              className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-2xs"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="editor">Editor</option>
                              <option value="manager">Manager</option>
                            </select>
                            <button
                              onClick={() => handleRemoveMember(dataset.id, m.userId)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Revoke access"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full System Audit Log (Immutable)
              </h3>
              <button
                onClick={() => refetchLogs()}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Refresh
              </button>
            </div>
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
                {(logsData?.data ?? []).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 font-sans font-semibold text-slate-900">
                      {log.userName || log.userEmail || 'System'}
                    </td>
                    <td className="px-4 py-2.5 text-indigo-600 font-bold">{log.action}</td>
                    <td className="px-4 py-2.5 uppercase text-[10px] text-slate-500">
                      {log.activityType}
                    </td>
                    <td className="px-4 py-2.5 font-sans text-slate-700">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: QUERY PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Real-Time Query Latency & Execution Logs
              </h3>
              <button
                onClick={() => refetchPerf()}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Refresh
              </button>
            </div>
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Operation</th>
                  <th className="px-4 py-3">Dataset</th>
                  <th className="px-4 py-3">Latency</th>
                  <th className="px-4 py-3">Cache Hit</th>
                  <th className="px-4 py-3">Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
                {(perfLogsData?.data ?? []).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-500">
                      {new Date(p.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2.5 uppercase font-sans font-semibold text-indigo-600">
                      {p.operation}
                    </td>
                    <td className="px-4 py-2.5 font-sans text-slate-900">{p.datasetName ?? 'Global'}</td>
                    <td className="px-4 py-2.5 text-slate-800 font-bold">{p.executionTimeMs} ms</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                          p.cacheHit ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.cacheHit ? 'HIT' : 'MISS'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{p.recordsReturned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
