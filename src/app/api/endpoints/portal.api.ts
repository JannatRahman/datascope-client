import { baseApi } from '../base-api';

export interface AnalystOverviewData {
  summary: {
    accessibleDatasetsCount: number;
    totalAccessibleRecords: number;
    totalQueriesExecuted: number;
    avgQueryLatencyMs: number;
    savedViewsCount: number;
  };
  datasets: {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    recordCount: number;
    fieldCount: number;
    accessLevel: string;
  }[];
  recentSearches: {
    id: string;
    searchQuery: string;
    filters: Record<string, unknown>;
    resultCount: number;
    executionTimeMs: number;
    searchedAt: string;
    datasetName: string | null;
  }[];
  savedViews: {
    id: string;
    name: string;
    description: string | null;
    isShared: boolean;
    createdAt: string;
    datasetName: string;
    datasetId: string;
  }[];
}

export interface ViewerOverviewData {
  summary: {
    assignedDatasetsCount: number;
    totalAccessibleRecords: number;
    sharedViewsCount: number;
  };
  datasets: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    recordCount: number;
    fieldCount: number;
    accessLevel: string;
  }[];
  sharedViews: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    datasetName: string;
    datasetId: string;
    ownerName: string;
  }[];
  recentlyAccessedDatasets?: {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    recordCount?: number;
    fieldCount?: number;
    lastAccessedAt: string;
  }[];
  recentActivity?: {
    id: string;
    activityType: string;
    description?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    createdAt: string;
  }[];
}

export const portalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalystOverview: builder.query<{ success: boolean; data: AnalystOverviewData }, void>({
      query: () => '/api/v1/analyst/overview',
      providesTags: ['Datasets'],
    }),

    getViewerOverview: builder.query<{ success: boolean; data: ViewerOverviewData }, void>({
      query: () => '/api/v1/viewer/overview',
      providesTags: ['Datasets'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAnalystOverviewQuery,
  useGetViewerOverviewQuery,
} = portalApi;
