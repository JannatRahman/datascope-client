import { baseApi } from '../base-api';

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'export_completed' | 'export_failed' | 'saved_view_shared' | 'dataset_access_granted' | 'dataset_access_changed' | 'system';
  title: string;
  message: string;
  resourceType?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<{ success: boolean; data: NotificationItem[] }, { limit?: number } | void>({
      query: (params) => (params?.limit ? `/api/v1/notifications?limit=${params.limit}` : '/api/v1/notifications'),
      providesTags: ['Auth'],
    }),
    getUnreadCount: builder.query<{ success: boolean; data: { unreadCount: number } }, void>({
      query: () => '/api/v1/notifications/unread-count',
      providesTags: ['Auth'],
    }),
    markNotificationAsRead: builder.mutation<{ success: boolean; data: NotificationItem }, string>({
      query: (id) => ({
        url: `/api/v1/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Auth'],
    }),
    markAllNotificationsAsRead: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/api/v1/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
