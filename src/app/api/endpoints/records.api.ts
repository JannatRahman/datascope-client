import { baseApi } from '../base-api';

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'between'
  | 'is_null'
  | 'is_not_null';

export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value?: unknown;
}

export interface RecordQueryParams {
  datasetId: string;
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: FilterRule[];
  filterLogic?: 'AND' | 'OR';
}

export interface RecordItem {
  id: string;
  datasetId: string;
  recordData: Record<string, unknown>;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRecordsResponse {
  success: boolean;
  data: RecordItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface RecordHistoryItem {
  id: string;
  recordId: string;
  datasetId: string;
  changedBy: string | null;
  changedByName: string | null;
  changeType: 'created' | 'updated' | 'deleted';
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  changeDescription: string | null;
  changedAt: string;
}

export interface RecordRelationshipItem {
  id: string;
  relationshipType: string;
  description: string | null;
  direction: 'outgoing' | 'incoming';
  relatedDatasetId: string;
  relatedDatasetName: string;
  relatedDatasetCategory: string | null;
  relatedRecordId: string;
  relatedRecordData: Record<string, unknown>;
  createdAt: string;
}

export const recordsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query<PaginatedRecordsResponse, RecordQueryParams>({
      query: ({
        datasetId,
        page = 1,
        pageSize = 25,
        q,
        sortBy,
        sortOrder,
        filters,
        filterLogic,
      }) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('pageSize', String(pageSize));
        if (q && q.trim()) params.append('q', q.trim());
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);
        if (filters && filters.length > 0) {
          params.append('filters', JSON.stringify(filters));
        }
        if (filterLogic) params.append('filterLogic', filterLogic);

        return `/api/v1/datasets/${datasetId}/records?${params.toString()}`;
      },
      providesTags: (_result, _error, { datasetId }) => [
        { type: 'Records', id: datasetId },
      ],
    }),
    getRecordById: builder.query<
      { success: boolean; data: RecordItem },
      { datasetId: string; recordId: string }
    >({
      query: ({ datasetId, recordId }) =>
        `/api/v1/datasets/${datasetId}/records/${recordId}`,
      providesTags: (_result, _error, { recordId }) => [
        { type: 'Records', id: recordId },
      ],
    }),
    getRecordHistory: builder.query<
      { success: boolean; data: RecordHistoryItem[] },
      { datasetId: string; recordId: string }
    >({
      query: ({ datasetId, recordId }) =>
        `/api/v1/datasets/${datasetId}/records/${recordId}/history`,
      providesTags: (_result, _error, { recordId }) => [
        { type: 'Records', id: `${recordId}-history` },
      ],
    }),
    getRecordRelationships: builder.query<
      { success: boolean; data: RecordRelationshipItem[] },
      { datasetId: string; recordId: string }
    >({
      query: ({ datasetId, recordId }) =>
        `/api/v1/datasets/${datasetId}/records/${recordId}/relationships`,
      providesTags: (_result, _error, { recordId }) => [
        { type: 'Relationships', id: recordId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetRecordsQuery,
  useGetRecordByIdQuery,
  useGetRecordHistoryQuery,
  useGetRecordRelationshipsQuery,
} = recordsApi;
