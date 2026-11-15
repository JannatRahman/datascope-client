import { baseApi } from '../base-api';

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDatasets: number;
  totalRecords: number;
  totalQueries: number;
  avgLatencyMs: number;
  cacheHitRate: number;
  totalExports: number;
  activeExports: number;
}

export interface AdminOverviewData {
  metrics: AdminMetrics;
  datasets: {
    id: string;
    name: string;
    category: string;
    status: string;
    recordCount: number;
    fieldCount: number;
  }[];
  recentActivity: {
    id: string;
    activityType: string;
    action: string;
    description: string;
    createdAt: string;
    userName: string | null;
    userEmail: string | null;
  }[];
  health: {
    database: string;
    redis: string;
    server: string;
    uptimeSeconds: number;
  };
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  roleId: string | null;
  roleName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  userCount: number;
  permissionCount: number;
}

export interface PlatformPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface DatasetWithMembers {
  id: string;
  name: string;
  description: string | null;
  category: string;
  dataSource: string | null;
  status: string;
  recordCount: number;
  fieldCount: number;
  members: {
    datasetId: string;
    userId: string;
    accessLevel: 'viewer' | 'editor' | 'manager';
    userName: string;
    userEmail: string;
    roleName: string | null;
  }[];
}

export interface ActivityLogItem {
  id: string;
  activityType: string;
  action: string;
  description: string;
  resourceType: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
}

export interface PerformanceLogItem {
  id: string;
  operation: string;
  endpoint: string;
  executionTimeMs: number;
  recordsReturned: number;
  cacheHit: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  datasetName: string | null;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<{ success: boolean; data: AdminOverviewData }, void>({
      query: () => '/api/v1/admin/overview',
      providesTags: ['Datasets', 'Auth'],
    }),

    getAdminUsers: builder.query<
      { success: boolean; data: PlatformUser[]; meta: { total: number; totalPages: number } },
      { q?: string; page?: number; pageSize?: number }
    >({
      query: ({ q, page = 1, pageSize = 25 }) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        params.append('page', String(page));
        params.append('pageSize', String(pageSize));
        return `/api/v1/admin/users?${params.toString()}`;
      },
      providesTags: ['Auth'],
    }),

    createUser: builder.mutation<
      { success: boolean; data: PlatformUser },
      { email: string; name: string; password?: string; roleId?: string }
    >({
      query: (body) => ({
        url: '/api/v1/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    updateUser: builder.mutation<
      { success: boolean; data: PlatformUser },
      { userId: string; name?: string; roleId?: string; emailVerified?: boolean }
    >({
      query: ({ userId, ...body }) => ({
        url: `/api/v1/admin/users/${userId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth', 'Datasets'],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/api/v1/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth', 'Datasets'],
    }),

    getAdminRoles: builder.query<{ success: boolean; data: PlatformRole[] }, void>({
      query: () => '/api/v1/admin/roles',
      providesTags: ['Auth'],
    }),

    getAdminPermissions: builder.query<{ success: boolean; data: PlatformPermission[] }, void>({
      query: () => '/api/v1/admin/permissions',
    }),

    getRolePermissions: builder.query<{ success: boolean; data: PlatformPermission[] }, string>({
      query: (roleId) => `/api/v1/admin/roles/${roleId}/permissions`,
    }),

    updateRolePermissions: builder.mutation<
      { success: boolean; count: number },
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: `/api/v1/admin/roles/${roleId}/permissions`,
        method: 'PUT',
        body: { permissionIds },
      }),
      invalidatesTags: ['Auth', 'Datasets'],
    }),

    getAdminDatasets: builder.query<{ success: boolean; data: DatasetWithMembers[] }, void>({
      query: () => '/api/v1/admin/datasets',
      providesTags: ['Datasets'],
    }),

    addDatasetMember: builder.mutation<
      { success: boolean },
      { datasetId: string; userId: string; accessLevel: 'viewer' | 'editor' | 'manager' }
    >({
      query: ({ datasetId, ...body }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/members`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Datasets'],
    }),

    removeDatasetMember: builder.mutation<
      { success: boolean },
      { datasetId: string; userId: string }
    >({
      query: ({ datasetId, userId }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Datasets'],
    }),

    getActivityLogs: builder.query<
      { success: boolean; data: ActivityLogItem[]; meta: { total: number; totalPages: number } },
      { page?: number; pageSize?: number; type?: string }
    >({
      query: ({ page = 1, pageSize = 20, type }) => {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        if (type && type !== 'all') params.append('type', type);
        return `/api/v1/admin/activity-logs?${params.toString()}`;
      },
    }),

    getPerformanceLogs: builder.query<
      { success: boolean; data: PerformanceLogItem[]; meta: { total: number; totalPages: number } },
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 20 }) => `/api/v1/admin/performance?page=${page}&pageSize=${pageSize}`,
    }),
  }),
  overrideExisting: true,
});

export const {
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
} = adminApi;
