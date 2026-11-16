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
  growth: GrowthTrendPoint[];
  searchActivity: {
    totalSearches: number;
    searchesLast7Days: number;
    avgLatencyMs: number;
    topFilters: Array<{ key: string; value: string; count: number }>;
  };
  health: {
    database: string;
    redis: string;
    server: string;
    uptimeSeconds: number;
  };
}

export interface GrowthTrendPoint {
  month: string;
  users: number;
  datasets: number;
  records: number;
}

export interface DatasetField {
  id: string;
  datasetId: string;
  fieldKey: string;
  fieldLabel: string;
  dataType: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url';
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  isSortable: boolean;
  position: number;
  fieldConfig: Record<string, unknown>;
}

export interface DatasetFieldInput {
  fieldKey: string;
  fieldLabel: string;
  dataType?: DatasetField['dataType'];
  isRequired?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  isSortable?: boolean;
  position?: number;
  fieldConfig?: Record<string, unknown>;
}

export interface DatasetInput {
  name: string;
  description?: string;
  category?: string;
  dataSource?: string;
  status?: 'active' | 'archived';
  fields?: DatasetFieldInput[];
}

export interface UserActivityItem {
  id: string;
  activityType: string;
  action: string;
  description: string;
  resourceType: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface UserActivityResponse {
  user: PlatformUser;
  summary: {
    totalActions: number;
    lastActiveAt: string | null;
    activeSessions: number;
    totalSearches: number;
    totalExports: number;
    totalSavedViews: number;
  };
  data: UserActivityItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface SharedViewItem {
  id: string;
  name: string;
  description: string | null;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  datasetName: string;
  ownerName: string;
  ownerEmail: string;
  shareCount: number;
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;
  defaultPageSize: number;
  maxPageSize: number;
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
  searchMinLength: number;
  searchMaxResults: number;
  allowUserRegistration: boolean;
  maintenanceMode: boolean;
  sessionTimeoutMinutes: number;
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
      { q?: string; page?: number; pageSize?: number; roleId?: string; status?: string }
    >({
      query: ({ q, page = 1, pageSize = 25, roleId, status }) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (roleId) params.append('roleId', roleId);
        if (status) params.append('status', status);
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

    getUserActivity: builder.query<
      { success: boolean } & UserActivityResponse,
      { userId: string; page?: number; pageSize?: number }
    >({
      query: ({ userId, page = 1, pageSize = 20 }) =>
        `/api/v1/admin/users/${userId}/activity?page=${page}&pageSize=${pageSize}`,
    }),

    resetUserAccess: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/api/v1/admin/users/${userId}/reset-access`,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
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

    createDataset: builder.mutation<{ success: boolean; data: DatasetWithMembers }, DatasetInput>({
      query: (body) => ({
        url: '/api/v1/admin/datasets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Datasets'],
    }),

    updateDataset: builder.mutation<
      { success: boolean; data: DatasetWithMembers },
      { datasetId: string; name?: string; description?: string; category?: string; dataSource?: string; status?: 'active' | 'archived' }
    >({
      query: ({ datasetId, ...body }) => ({
        url: `/api/v1/admin/datasets/${datasetId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Datasets'],
    }),

    deleteDataset: builder.mutation<{ success: boolean; message: string }, string>({
      query: (datasetId) => ({
        url: `/api/v1/admin/datasets/${datasetId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Datasets'],
    }),

    getAdminDatasetFields: builder.query<{ success: boolean; data: DatasetField[] }, string>({
      query: (datasetId) => `/api/v1/admin/datasets/${datasetId}/fields`,
      providesTags: ['Fields'],
    }),

    createDatasetField: builder.mutation<
      { success: boolean; data: DatasetField },
      { datasetId: string } & DatasetFieldInput
    >({
      query: ({ datasetId, ...body }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/fields`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Datasets', 'Fields'],
    }),

    updateDatasetField: builder.mutation<
      { success: boolean; data: DatasetField },
      { datasetId: string; fieldId: string } & DatasetFieldInput
    >({
      query: ({ datasetId, fieldId, ...body }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/fields/${fieldId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Datasets', 'Fields'],
    }),

    deleteDatasetField: builder.mutation<
      { success: boolean },
      { datasetId: string; fieldId: string }
    >({
      query: ({ datasetId, fieldId }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/fields/${fieldId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Datasets', 'Fields'],
    }),

    generateDatasetRecords: builder.mutation<
      { success: boolean; generated: number },
      { datasetId: string; count?: number; clearExisting?: boolean }
    >({
      query: ({ datasetId, ...body }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/generate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Datasets', 'Records'],
    }),

    importDatasetRecords: builder.mutation<
      { success: boolean; imported: number },
      { datasetId: string; records: Record<string, unknown>[]; clearExisting?: boolean }
    >({
      query: ({ datasetId, ...body }) => ({
        url: `/api/v1/admin/datasets/${datasetId}/import`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Datasets', 'Records'],
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

    getSharedViews: builder.query<{ success: boolean; data: SharedViewItem[] }, void>({
      query: () => '/api/v1/admin/shared-views',
      providesTags: ['SavedViews'],
    }),

    updateSharedView: builder.mutation<
      { success: boolean; data: { id: string; name: string; isShared: boolean } },
      { viewId: string; isShared: boolean }
    >({
      query: ({ viewId, isShared }) => ({
        url: `/api/v1/admin/shared-views/${viewId}`,
        method: 'PATCH',
        body: { isShared },
      }),
      invalidatesTags: ['SavedViews'],
    }),

    deleteSharedView: builder.mutation<{ success: boolean }, string>({
      query: (viewId) => ({
        url: `/api/v1/admin/shared-views/${viewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedViews'],
    }),

    getSystemSettings: builder.query<{ success: boolean; data: SystemSettings }, void>({
      query: () => '/api/v1/admin/settings',
      providesTags: ['Preferences'],
    }),

    updateSystemSettings: builder.mutation<
      { success: boolean; data: SystemSettings },
      Partial<SystemSettings>
    >({
      query: (body) => ({
        url: '/api/v1/admin/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Preferences'],
    }),

    resetSystemSettings: builder.mutation<{ success: boolean; data: SystemSettings }, void>({
      query: () => ({
        url: '/api/v1/admin/settings/reset',
        method: 'POST',
      }),
      invalidatesTags: ['Preferences'],
    }),

    clearSystemCache: builder.mutation<{ success: boolean; data: { success: boolean } }, void>({
      query: () => ({
        url: '/api/v1/admin/settings/cache/clear',
        method: 'POST',
      }),
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
  useGetUserActivityQuery,
  useResetUserAccessMutation,
  useGetAdminRolesQuery,
  useGetAdminPermissionsQuery,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useGetAdminDatasetsQuery,
  useCreateDatasetMutation,
  useUpdateDatasetMutation,
  useDeleteDatasetMutation,
  useGetAdminDatasetFieldsQuery,
  useCreateDatasetFieldMutation,
  useUpdateDatasetFieldMutation,
  useDeleteDatasetFieldMutation,
  useGenerateDatasetRecordsMutation,
  useImportDatasetRecordsMutation,
  useAddDatasetMemberMutation,
  useRemoveDatasetMemberMutation,
  useGetSharedViewsQuery,
  useUpdateSharedViewMutation,
  useDeleteSharedViewMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useResetSystemSettingsMutation,
  useClearSystemCacheMutation,
  useGetActivityLogsQuery,
  useGetPerformanceLogsQuery,
} = adminApi;
