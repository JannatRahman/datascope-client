import { baseApi } from '../base-api';

export interface DatasetDistributionItem {
  id: string;
  name: string;
  category: string;
  recordCount: number;
  fieldCount: number;
  percentage: number;
}

export interface StatusCountItem {
  status: string;
  count: number;
}

export interface QueryPerformanceMetrics {
  totalQueries: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
}

export interface SearchActivityItem {
  searchesByDataset: Array<{ datasetName: string; searchesCount: number }>;
  topQueries: Array<{ query: string; count: number; avgLatencyMs: number }>;
}

export interface AnalyticsOverview {
  datasetDistribution: DatasetDistributionItem[];
  statusDistributions: {
    salesPaymentStatuses: StatusCountItem[];
    shipmentStatuses: StatusCountItem[];
    employeeStatuses: StatusCountItem[];
  };
  searchActivity: SearchActivityItem;
  queryPerformance: QueryPerformanceMetrics;
  activityDistribution: Array<{ type: string; count: number }>;
  timestamp: string;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query<{ success: boolean; data: AnalyticsOverview }, void>({
      query: () => '/api/v1/analytics/overview',
    }),
    getDatasetAnalytics: builder.query<{ success: boolean; data: DatasetDistributionItem[] }, void>({
      query: () => '/api/v1/analytics/datasets',
    }),
    getPerformanceAnalytics: builder.query<{ success: boolean; data: QueryPerformanceMetrics }, void>({
      query: () => '/api/v1/analytics/performance',
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetDatasetAnalyticsQuery,
  useGetPerformanceAnalyticsQuery,
} = analyticsApi;
