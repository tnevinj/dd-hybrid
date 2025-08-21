/**
 * Data Layer Integration Framework
 * 
 * This module provides a unified data access layer that abstracts away the differences
 * between mock data, API data, SQLite data, and cached data across all modules.
 * It ensures consistent data handling patterns and provides intelligent caching,
 * synchronization, and error handling.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Base interfaces for data entities
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

// Data source types
export type DataSource = 'mock' | 'api' | 'sqlite' | 'cache';

// Data operation types
export type DataOperation = 'read' | 'write' | 'update' | 'delete' | 'sync';

// Data layer configuration
export interface DataLayerConfig {
  preferredSource: DataSource;
  fallbackSources: DataSource[];
  cacheEnabled: boolean;
  cacheTTL: number; // Time to live in milliseconds
  syncEnabled: boolean;
  syncInterval: number; // Sync interval in milliseconds
  retryAttempts: number;
  retryDelay: number;
  offlineMode: boolean;
}

// Data request interface
export interface DataRequest<T = any> {
  module: string;
  entity: string;
  operation: DataOperation;
  params?: Record<string, any>;
  filters?: Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  cache?: {
    enabled: boolean;
    ttl?: number;
    key?: string;
  };
  mock?: boolean; // Force mock data for development/testing
}

// Data response interface
export interface DataResponse<T = any> {
  success: boolean;
  data: T;
  source: DataSource;
  cached: boolean;
  timestamp: Date;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    executionTime: number;
    cacheHit: boolean;
    syncStatus?: 'synced' | 'pending' | 'failed';
  };
}

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: Date;
  ttl: number;
  key: string;
  source: DataSource;
}

// Data provider interface
export interface DataProvider {
  name: DataSource;
  isAvailable: () => Promise<boolean>;
  read: <T>(request: DataRequest) => Promise<DataResponse<T>>;
  write?: <T>(request: DataRequest) => Promise<DataResponse<T>>;
  update?: <T>(request: DataRequest) => Promise<DataResponse<T>>;
  delete?: (request: DataRequest) => Promise<DataResponse<boolean>>;
  sync?: (request: DataRequest) => Promise<DataResponse<any>>;
}

// Mock data provider
class MockDataProvider implements DataProvider {
  name: DataSource = 'mock';
  private mockData: Record<string, any> = {};

  async isAvailable(): Promise<boolean> {
    return true; // Mock data is always available
  }

  async read<T>(request: DataRequest): Promise<DataResponse<T>> {
    const key = `${request.module}.${request.entity}`;
    const data = this.mockData[key] || this.generateMockData(request);
    
    return {
      success: true,
      data,
      source: 'mock',
      cached: false,
      timestamp: new Date(),
      metadata: {
        requestId: `mock_${Date.now()}`,
        executionTime: 10,
        cacheHit: false
      }
    };
  }

  private generateMockData(request: DataRequest): any {
    // Generate appropriate mock data based on module and entity
    const { module, entity } = request;
    
    switch (`${module}.${entity}`) {
      case 'fund-operations.funds':
        return [
          {
            id: '1',
            name: 'Growth Fund IV',
            vintage: 2023,
            targetSize: 500000000,
            commitments: 450000000,
            called: 280000000,
            deployed: 220000000,
            nav: 315000000,
            status: 'Investing',
            fundType: 'Growth Equity',
            netIRR: 15.8,
            dpi: 0.28,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Tech Fund III',
            vintage: 2022,
            targetSize: 350000000,
            commitments: 350000000,
            called: 250000000,
            deployed: 200000000,
            nav: 285000000,
            status: 'Harvesting',
            fundType: 'Technology',
            netIRR: 22.1,
            dpi: 0.45,
            createdAt: '2022-01-01T00:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ];

      case 'portfolio.assets':
        return [
          {
            id: 'asset-1',
            name: 'TechCorp',
            sector: 'Technology',
            assetType: 'Growth Equity',
            acquisitionDate: '2023-06-15T00:00:00Z',
            acquisitionValue: 50000000,
            currentValue: 75000000,
            status: 'active',
            riskRating: 'medium',
            performance: { irr: 0.18, moic: 1.5, totalReturn: 25000000 },
            createdAt: '2023-06-15T00:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ];

      case 'deal-screening.deals':
        return [
          {
            id: 'deal-1',
            name: 'FinTech Startup Alpha',
            sector: 'Financial Services',
            stage: 'Series B',
            dealValue: 25000000,
            status: 'active',
            priority: 'high',
            riskLevel: 'medium',
            keyMetrics: { revenue: 5000000, growth: 0.45, ebitda: 1000000 },
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ];

      case 'due-diligence.assessments':
        return [
          {
            id: 'dd-1',
            companyName: 'TechCorp Due Diligence',
            status: 'in_progress',
            progress: 65,
            riskScore: 75,
            findings: [],
            createdAt: '2024-03-10T00:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ];

      default:
        return [];
    }
  }

  async write<T>(request: DataRequest): Promise<DataResponse<T>> {
    const key = `${request.module}.${request.entity}`;
    this.mockData[key] = request.params?.data;
    
    return {
      success: true,
      data: request.params?.data,
      source: 'mock',
      cached: false,
      timestamp: new Date(),
      metadata: {
        requestId: `mock_write_${Date.now()}`,
        executionTime: 15,
        cacheHit: false
      }
    };
  }
}

// API data provider
class APIDataProvider implements DataProvider {
  name: DataSource = 'api';
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async read<T>(request: DataRequest): Promise<DataResponse<T>> {
    try {
      const url = this.buildUrl(request);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      return {
        success: response.ok,
        data: data.data,
        source: 'api',
        cached: false,
        timestamp: new Date(),
        pagination: data.pagination,
        error: response.ok ? undefined : {
          code: data.error?.code || 'API_ERROR',
          message: data.error?.message || 'API request failed'
        },
        metadata: {
          requestId: data.requestId || `api_${Date.now()}`,
          executionTime: 0, // Would be measured in real implementation
          cacheHit: false
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        source: 'api',
        cached: false,
        timestamp: new Date(),
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred'
        },
        metadata: {
          requestId: `api_error_${Date.now()}`,
          executionTime: 0,
          cacheHit: false
        }
      };
    }
  }

  private buildUrl(request: DataRequest): string {
    let url = `${this.baseUrl}/${request.module}`;
    
    if (request.entity !== 'overview') {
      url += `/${request.entity}`;
    }
    
    if (request.params?.id) {
      url += `/${request.params.id}`;
    }

    const queryParams = new URLSearchParams();
    
    if (request.filters) {
      Object.entries(request.filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }
    
    if (request.pagination) {
      queryParams.append('page', String(request.pagination.page));
      queryParams.append('limit', String(request.pagination.limit));
      if (request.pagination.sortBy) {
        queryParams.append('sortBy', request.pagination.sortBy);
        queryParams.append('sortOrder', request.pagination.sortOrder || 'asc');
      }
    }

    return queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
  }

  async write<T>(request: DataRequest): Promise<DataResponse<T>> {
    try {
      const url = this.buildUrl(request);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.params),
      });

      const data = await response.json();

      return {
        success: response.ok,
        data: data.data,
        source: 'api',
        cached: false,
        timestamp: new Date(),
        error: response.ok ? undefined : {
          code: data.error?.code || 'API_ERROR',
          message: data.error?.message || 'API write failed'
        },
        metadata: {
          requestId: data.requestId || `api_write_${Date.now()}`,
          executionTime: 0,
          cacheHit: false
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        source: 'api',
        cached: false,
        timestamp: new Date(),
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred'
        },
        metadata: {
          requestId: `api_write_error_${Date.now()}`,
          executionTime: 0,
          cacheHit: false
        }
      };
    }
  }
}

// Data Layer Manager State
interface DataLayerState {
  config: DataLayerConfig;
  providers: DataProvider[];
  cache: Map<string, CacheEntry>;
  requestHistory: Array<{
    request: DataRequest;
    response: DataResponse;
    timestamp: Date;
  }>;
  syncQueue: DataRequest[];
  isOnline: boolean;
  lastSyncTime: Date | null;
}

interface DataLayerActions {
  // Configuration
  updateConfig: (config: Partial<DataLayerConfig>) => void;
  
  // Data operations
  read: <T = any>(request: DataRequest) => Promise<DataResponse<T>>;
  write: <T = any>(request: DataRequest) => Promise<DataResponse<T>>;
  update: <T = any>(request: DataRequest) => Promise<DataResponse<T>>;
  delete: (request: DataRequest) => Promise<DataResponse<boolean>>;
  
  // Cache management
  clearCache: (pattern?: string) => void;
  getCacheStats: () => {
    totalEntries: number;
    totalSize: number;
    hitRate: number;
  };
  
  // Sync management
  sync: (module?: string) => Promise<void>;
  addToSyncQueue: (request: DataRequest) => void;
  processSyncQueue: () => Promise<void>;
  
  // Utility
  setOnlineStatus: (isOnline: boolean) => void;
  getRequestHistory: (module?: string) => DataResponse[];
  clearRequestHistory: () => void;
}

type DataLayerStore = DataLayerState & DataLayerActions;

// Default configuration
const defaultConfig: DataLayerConfig = {
  preferredSource: 'api',
  fallbackSources: ['mock'],
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  syncEnabled: false,
  syncInterval: 30 * 1000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000,
  offlineMode: false
};

// Utility function to generate cache keys
const generateCacheKey = (request: DataRequest): string => {
  const { module, entity, params, filters, pagination } = request;
  const key = `${module}.${entity}`;
  
  if (params || filters || pagination) {
    const hash = btoa(JSON.stringify({ params, filters, pagination })).slice(0, 8);
    return `${key}.${hash}`;
  }
  
  return key;
};

// Main Data Layer Store
export const useDataLayerStore = create<DataLayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      config: defaultConfig,
      providers: [
        new MockDataProvider(),
        new APIDataProvider()
      ],
      cache: new Map(),
      requestHistory: [],
      syncQueue: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      lastSyncTime: null,

      // Configuration
      updateConfig: (config) => {
        set(state => ({
          config: { ...state.config, ...config }
        }));
      },

      // Data operations
      read: async <T>(request: DataRequest): Promise<DataResponse<T>> => {
        const state = get();
        const cacheKey = generateCacheKey(request);
        
        // Check cache first if enabled
        if (state.config.cacheEnabled && !request.mock) {
          const cached = state.cache.get(cacheKey);
          if (cached && Date.now() - cached.timestamp.getTime() < cached.ttl) {
            const response: DataResponse<T> = {
              success: true,
              data: cached.data,
              source: cached.source,
              cached: true,
              timestamp: cached.timestamp,
              metadata: {
                requestId: `cache_${Date.now()}`,
                executionTime: 0,
                cacheHit: true
              }
            };
            
            // Add to history
            set(state => ({
              requestHistory: [...state.requestHistory, {
                request,
                response,
                timestamp: new Date()
              }].slice(-100) // Keep only last 100 requests
            }));
            
            return response;
          }
        }

        // Determine data sources to try
        const sourcesToTry = request.mock 
          ? ['mock' as DataSource]
          : [state.config.preferredSource, ...state.config.fallbackSources];

        let lastError: any = null;

        // Try each data source
        for (const sourceType of sourcesToTry) {
          const provider = state.providers.find(p => p.name === sourceType);
          if (!provider) continue;

          try {
            const isAvailable = await provider.isAvailable();
            if (!isAvailable && sourceType !== 'mock') continue;

            const response = await provider.read<T>(request);
            
            // Cache successful responses
            if (response.success && state.config.cacheEnabled && !request.mock) {
              const cacheEntry: CacheEntry<T> = {
                data: response.data,
                timestamp: response.timestamp,
                ttl: request.cache?.ttl || state.config.cacheTTL,
                key: cacheKey,
                source: sourceType
              };
              
              set(state => {
                const newCache = new Map(state.cache);
                newCache.set(cacheKey, cacheEntry);
                return { cache: newCache };
              });
            }
            
            // Add to history
            set(state => ({
              requestHistory: [...state.requestHistory, {
                request,
                response,
                timestamp: new Date()
              }].slice(-100)
            }));
            
            return response;
          } catch (error) {
            lastError = error;
            console.warn(`Data source ${sourceType} failed:`, error);
            continue;
          }
        }

        // All sources failed
        const errorResponse: DataResponse<T> = {
          success: false,
          data: null as T,
          source: 'api',
          cached: false,
          timestamp: new Date(),
          error: {
            code: 'ALL_SOURCES_FAILED',
            message: 'All data sources failed to respond',
            details: lastError
          },
          metadata: {
            requestId: `error_${Date.now()}`,
            executionTime: 0,
            cacheHit: false
          }
        };

        set(state => ({
          requestHistory: [...state.requestHistory, {
            request,
            response: errorResponse,
            timestamp: new Date()
          }].slice(-100)
        }));

        return errorResponse;
      },

      write: async <T>(request: DataRequest): Promise<DataResponse<T>> => {
        const state = get();
        
        // For write operations, try to use the preferred source first
        const provider = state.providers.find(p => p.name === state.config.preferredSource);
        if (!provider?.write) {
          return {
            success: false,
            data: null as T,
            source: state.config.preferredSource,
            cached: false,
            timestamp: new Date(),
            error: {
              code: 'WRITE_NOT_SUPPORTED',
              message: `Write operations not supported for ${state.config.preferredSource}`
            },
            metadata: {
              requestId: `write_error_${Date.now()}`,
              executionTime: 0,
              cacheHit: false
            }
          };
        }

        try {
          const response = await provider.write<T>(request);
          
          // Invalidate related cache entries
          if (response.success) {
            set(state => {
              const newCache = new Map(state.cache);
              const pattern = `${request.module}.${request.entity}`;
              
              for (const [key] of newCache.entries()) {
                if (key.startsWith(pattern)) {
                  newCache.delete(key);
                }
              }
              
              return { cache: newCache };
            });
          }
          
          return response;
        } catch (error) {
          return {
            success: false,
            data: null as T,
            source: state.config.preferredSource,
            cached: false,
            timestamp: new Date(),
            error: {
              code: 'WRITE_ERROR',
              message: error instanceof Error ? error.message : 'Write operation failed'
            },
            metadata: {
              requestId: `write_error_${Date.now()}`,
              executionTime: 0,
              cacheHit: false
            }
          };
        }
      },

      update: async <T>(request: DataRequest): Promise<DataResponse<T>> => {
        // Similar to write but for updates
        return get().write<T>({ ...request, operation: 'update' });
      },

      delete: async (request: DataRequest): Promise<DataResponse<boolean>> => {
        return get().write<boolean>({ ...request, operation: 'delete' });
      },

      // Cache management
      clearCache: (pattern?: string) => {
        set(state => {
          const newCache = new Map(state.cache);
          
          if (pattern) {
            for (const [key] of newCache.entries()) {
              if (key.includes(pattern)) {
                newCache.delete(key);
              }
            }
          } else {
            newCache.clear();
          }
          
          return { cache: newCache };
        });
      },

      getCacheStats: () => {
        const state = get();
        const totalEntries = state.cache.size;
        const totalHits = state.requestHistory.filter(h => h.response.metadata?.cacheHit).length;
        const totalRequests = state.requestHistory.length;
        
        return {
          totalEntries,
          totalSize: totalEntries * 1024, // Rough estimate
          hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0
        };
      },

      // Sync management
      sync: async (module?: string) => {
        console.log(`Syncing ${module || 'all modules'}...`);
        // Implementation would go here
      },

      addToSyncQueue: (request: DataRequest) => {
        set(state => ({
          syncQueue: [...state.syncQueue, request]
        }));
      },

      processSyncQueue: async () => {
        const state = get();
        console.log(`Processing ${state.syncQueue.length} sync requests...`);
        // Implementation would go here
        set({ syncQueue: [] });
      },

      // Utility
      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline });
      },

      getRequestHistory: (module?: string) => {
        const state = get();
        const history = state.requestHistory;
        
        if (module) {
          return history
            .filter(h => h.request.module === module)
            .map(h => h.response);
        }
        
        return history.map(h => h.response);
      },

      clearRequestHistory: () => {
        set({ requestHistory: [] });
      }
    }),
    {
      name: 'data-layer-store',
      partialize: (state) => ({
        config: state.config,
        lastSyncTime: state.lastSyncTime,
        // Don't persist cache, providers, or request history
      })
    }
  )
);

// Convenience hook for module-specific data operations
export const useModuleData = (moduleName: string) => {
  const store = useDataLayerStore();
  
  return {
    read: <T = any>(entity: string, params?: any, filters?: any) => 
      store.read<T>({
        module: moduleName,
        entity,
        operation: 'read',
        params,
        filters
      }),
    
    write: <T = any>(entity: string, data: T) => 
      store.write<T>({
        module: moduleName,
        entity,
        operation: 'write',
        params: { data }
      }),
    
    update: <T = any>(entity: string, id: string, data: Partial<T>) => 
      store.update<T>({
        module: moduleName,
        entity,
        operation: 'update',
        params: { id, data }
      }),
    
    delete: (entity: string, id: string) => 
      store.delete({
        module: moduleName,
        entity,
        operation: 'delete',
        params: { id }
      }),
    
    clearCache: () => store.clearCache(moduleName),
    getHistory: () => store.getRequestHistory(moduleName)
  };
};

export default useDataLayerStore;