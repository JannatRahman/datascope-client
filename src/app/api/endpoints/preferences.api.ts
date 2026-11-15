import { baseApi } from '../base-api';

export interface UserPreferences {
  theme: string;
  tableDensity: string;
  defaultPageSize: number;
  sidebarCollapsed: boolean;
  dashboardLayout: Record<string, unknown>;
  additionalPreferences: Record<string, unknown>;
}

export const preferencesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreferences: builder.query<{ success: boolean; data: UserPreferences }, void>({
      query: () => '/api/v1/preferences',
    }),

    updatePreferences: builder.mutation<
      { success: boolean; data: UserPreferences },
      Partial<UserPreferences>
    >({
      query: (body) => ({
        url: '/api/v1/preferences',
        method: 'PUT',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} = preferencesApi;
