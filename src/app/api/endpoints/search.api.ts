import { baseApi } from '../base-api';

export interface SearchHistoryItem {
  id: string;
  userId: string;
  datasetId?: string | null;
  datasetName?: string | null;
  searchQuery: string;
  filters?: Record<string, unknown> | unknown[];
  sortConfig?: Record<string, unknown> | unknown[];
  resultCount: number;
  executionTimeMs?: number | null;
  searchedAt: string;
}

export interface RecordSearchPayload {
  datasetId?: string;
  searchQuery: string;
  filters?: Record<string, unknown> | unknown[];
  sortConfig?: Record<string, unknown> | unknown[];
  resultCount?: number;
  executionTimeMs?: number;
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchHistory: builder.query<{ success: boolean; data: SearchHistoryItem[] }, string | void>({
      query: (datasetId) => (datasetId ? `/api/v1/search-history?datasetId=${datasetId}` : '/api/v1/search-history'),
      providesTags: ['Records'],
    }),
    recordSearch: builder.mutation<{ success: boolean; data: SearchHistoryItem }, RecordSearchPayload>({
      query: (body) => ({
        url: '/api/v1/search-history',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Records'],
    }),
    deleteSearchEntry: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/search-history/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Records'],
    }),
    clearSearchHistory: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/api/v1/search-history',
        method: 'DELETE',
      }),
      invalidatesTags: ['Records'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSearchHistoryQuery,
  useRecordSearchMutation,
  useDeleteSearchEntryMutation,
  useClearSearchHistoryMutation,
} = searchApi;
