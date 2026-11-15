import { baseApi } from '../base-api';

export interface AuthMeResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    roleName: string;
    roleId?: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthMeResponse, void>({
      query: () => '/api/v1/auth/me',
      providesTags: ['Auth'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetMeQuery } = authApi;
