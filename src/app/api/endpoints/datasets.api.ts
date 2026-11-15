import { baseApi } from '../base-api';

export interface DatasetItem {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  dataSource: string | null;
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  fieldCount: number;
  accessLevel: 'viewer' | 'editor' | 'manager';
}

export interface DatasetFieldItem {
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

export const datasetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDatasets: builder.query<{ success: boolean; data: DatasetItem[] }, void>({
      query: () => '/api/v1/datasets',
      providesTags: ['Datasets'],
    }),
    getDatasetById: builder.query<{ success: boolean; data: DatasetItem }, string>({
      query: (datasetId) => `/api/v1/datasets/${datasetId}`,
      providesTags: (_result, _error, id) => [{ type: 'Datasets', id }],
    }),
    getDatasetFields: builder.query<{ success: boolean; data: DatasetFieldItem[] }, string>({
      query: (datasetId) => `/api/v1/datasets/${datasetId}/fields`,
      providesTags: (_result, _error, id) => [{ type: 'Fields', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDatasetsQuery,
  useGetDatasetByIdQuery,
  useGetDatasetFieldsQuery,
} = datasetsApi;
