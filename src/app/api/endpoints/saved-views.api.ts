import { baseApi } from '../base-api';

export interface SavedViewItem {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  datasetId: string;
  searchQuery: string;
  filters: unknown;
  sortConfig: unknown;
  visibleColumns: string[];
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  datasetName: string;
  creatorName: string;
}

export const savedViewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedViews: builder.query<{ success: boolean; data: SavedViewItem[] }, string | void>({
      query: (datasetId) => {
        const url = datasetId
          ? `/api/v1/saved-views?datasetId=${datasetId}`
          : '/api/v1/saved-views';
        return url;
      },
      providesTags: ['Records'],
    }),

    createSavedView: builder.mutation<
      { success: boolean; data: SavedViewItem },
      {
        name: string;
        description?: string;
        datasetId: string;
        searchQuery?: string;
        filters?: unknown;
        sortConfig?: unknown;
        visibleColumns?: string[];
        isShared?: boolean;
      }
    >({
      query: (body) => ({
        url: '/api/v1/saved-views',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Records'],
    }),

    updateSavedView: builder.mutation<
      { success: boolean; data: SavedViewItem },
      { id: string; body: Partial<SavedViewItem> }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/saved-views/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Records'],
    }),

    deleteSavedView: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/saved-views/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Records'],
    }),

    shareSavedView: builder.mutation<{ success: boolean; message: string }, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/api/v1/saved-views/${id}/shares`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Records'],
    }),

    getViewShares: builder.query<{ success: boolean; data: Array<{ userId: string; userName: string; userEmail: string; sharedAt: string }> }, string>({
      query: (id) => `/api/v1/saved-views/${id}/shares`,
      providesTags: ['Records'],
    }),

    removeViewShare: builder.mutation<{ success: boolean; message: string }, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/api/v1/saved-views/${id}/shares/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Records'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSavedViewsQuery,
  useCreateSavedViewMutation,
  useUpdateSavedViewMutation,
  useDeleteSavedViewMutation,
  useShareSavedViewMutation,
  useGetViewSharesQuery,
  useRemoveViewShareMutation,
} = savedViewsApi;
