import { baseApi } from '../base-api';
import { FilterRule } from './records.api';

export type { FilterRule };

export interface CreateExportDto {
  format?: 'csv' | 'json';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any[];
  filterLogic?: 'AND' | 'OR';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  selectedFields?: string[];
}

export interface ExportJobItem {
  id: string;
  userId: string;
  userName?: string;
  datasetId: string;
  datasetName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  format: 'csv' | 'json';
  exportConfig: Record<string, unknown>;
  filePath?: string | null;
  fileName?: string | null;
  totalRecords?: number | null;
  processedRecords?: number;
  errorMessage?: string | null;
  requestedAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export const exportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExportJob: builder.mutation<
      { success: boolean; message: string; data: ExportJobItem },
      { datasetId: string; body: CreateExportDto }
    >({
      query: ({ datasetId, body }) => ({
        url: `/api/v1/datasets/${datasetId}/export`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exports'],
    }),
    getExportJobs: builder.query<{ success: boolean; data: ExportJobItem[] }, void>({
      query: () => '/api/v1/exports',
      providesTags: ['Exports'],
    }),
    getExportJob: builder.query<{ success: boolean; data: ExportJobItem }, string>({
      query: (jobId) => `/api/v1/exports/${jobId}`,
    }),
    cancelExportJob: builder.mutation<{ success: boolean; message: string }, string>({
      query: (jobId) => ({
        url: `/api/v1/exports/${jobId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Exports'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateExportJobMutation,
  useGetExportJobsQuery,
  useGetExportJobQuery,
  useCancelExportJobMutation,
} = exportsApi;
