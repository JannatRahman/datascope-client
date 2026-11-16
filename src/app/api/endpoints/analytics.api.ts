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
  searchActivity: SearchActivityItem & { frequentFilters?: Array<{ key: string; value: string; count: number }> };
  queryPerformance: QueryPerformanceMetrics;
  activityDistribution: Array<{ type: string; count: number }>;
  growthTrends?: Array<{ month: string; users: number; datasets: number; records: number }>;
  timestamp: string;
}

export interface GrowthTrendItem {
  month: string;
  users: number;
  datasets: number;
  records: number;
}

export interface FrequentFilterItem {
  key: string;
  value: string;
  count: number;
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
    getGrowthTrends: builder.query<{ success: boolean; data: GrowthTrendItem[] }, void>({
      query: () => '/api/v1/analytics/growth',
    }),
    getFrequentFilters: builder.query<{ success: boolean; data: FrequentFilterItem[] }, void>({
      query: () => '/api/v1/analytics/filters',
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetDatasetAnalyticsQuery,
  useGetPerformanceAnalyticsQuery,
  useGetGrowthTrendsQuery,
  useGetFrequentFiltersQuery,
} = analyticsApi;
