'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import {
  Portfolio,
  PortfolioState,
  PortfolioAction,
  UnifiedAsset,
  AssetType,
  PortfolioConfig,
  PortfolioAnalytics
} from '@/types/portfolio';
import { ProfessionalPortfolioAnalytics, ProfessionalMetrics } from '@/lib/portfolio-analytics';
import { portfolioCache } from '@/lib/portfolio-cache';

interface UnifiedPortfolioContextType {
  state: PortfolioState;
  dispatch: React.Dispatch<PortfolioAction>;
  config: PortfolioConfig;
  analytics: PortfolioAnalytics | null;
  professionalMetrics: ProfessionalMetrics | null;
  
  // Core Actions
  loadPortfolios: () => Promise<void>;
  selectPortfolio: (portfolioId: string) => Promise<void>;
  createAsset: (assetData: any) => Promise<void>;
  updateAsset: (assetId: string, updates: Partial<UnifiedAsset>) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  
  // Filter & Search
  setFilters: (filters: Partial<PortfolioState['filters']>) => void;
  clearFilters: () => void;
  setSearch: (search: string) => void;
  
  // Selection
  selectAssets: (assetIds: string[]) => void;
  toggleAssetSelection: (assetId: string) => void;
  clearSelection: () => void;
  
  // Analytics
  calculateAnalytics: () => Promise<PortfolioAnalytics>;
  getAssetsByType: (assetType: AssetType) => UnifiedAsset[];
  getFilteredAssets: () => UnifiedAsset[];
}

const UnifiedPortfolioContext = createContext<UnifiedPortfolioContextType | undefined>(undefined);

const initialState: PortfolioState = {
  portfolios: [],
  currentPortfolio: undefined,
  selectedAssets: [],
  filters: {
    assetType: undefined,
    status: undefined,
    riskRating: undefined,
    sector: undefined,
    location: undefined,
    search: undefined,
  },
  sortBy: undefined,
  sortDirection: 'asc',
  loading: true, // Start with loading true to prevent flash
  error: undefined,
};

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: undefined };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
      
    case 'CLEAR_ERROR':
      return { ...state, error: undefined };
      
    case 'SET_PORTFOLIOS':
      return { 
        ...state, 
        portfolios: action.payload, 
        loading: false,
        error: undefined 
      };
      
    case 'SET_CURRENT_PORTFOLIO':
      return { 
        ...state, 
        currentPortfolio: action.payload,
        selectedAssets: [], // Clear selection when switching portfolios
        loading: false,
        error: undefined
      };
      
    case 'ADD_ASSET':
      if (!state.currentPortfolio) return state;
      
      const updatedPortfolioAdd = {
        ...state.currentPortfolio,
        assets: [...state.currentPortfolio.assets, action.payload],
        updatedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        currentPortfolio: updatedPortfolioAdd,
        portfolios: state.portfolios.map(p => 
          p.id === updatedPortfolioAdd.id ? updatedPortfolioAdd : p
        )
      };
      
    case 'UPDATE_ASSET':
      if (!state.currentPortfolio) return state;
      
      const updatedPortfolioUpdate = {
        ...state.currentPortfolio,
        assets: state.currentPortfolio.assets.map(asset =>
          asset.id === action.payload.id ? { ...asset, ...action.payload.updates } : asset
        ),
        updatedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        currentPortfolio: updatedPortfolioUpdate,
        portfolios: state.portfolios.map(p => 
          p.id === updatedPortfolioUpdate.id ? updatedPortfolioUpdate : p
        )
      };
      
    case 'REMOVE_ASSET':
      if (!state.currentPortfolio) return state;
      
      const updatedPortfolioRemove = {
        ...state.currentPortfolio,
        assets: state.currentPortfolio.assets.filter(asset => asset.id !== action.payload),
        updatedAt: new Date().toISOString()
      };
      
      return {
        ...state,
        currentPortfolio: updatedPortfolioRemove,
        portfolios: state.portfolios.map(p => 
          p.id === updatedPortfolioRemove.id ? updatedPortfolioRemove : p
        ),
        selectedAssets: state.selectedAssets.filter(id => id !== action.payload)
      };
      
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
      
    case 'SET_SELECTED_ASSETS':
      return { ...state, selectedAssets: action.payload };
      
    case 'SET_SORT':
      return { 
        ...state, 
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection 
      };
      
    default:
      return state;
  }
}

interface UnifiedPortfolioProviderProps {
  children: ReactNode;
  config: PortfolioConfig;
  initialPortfolioId?: string;
}

export function UnifiedPortfolioProvider({ 
  children, 
  config,
  initialPortfolioId 
}: UnifiedPortfolioProviderProps) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);
  const [analytics, setAnalytics] = React.useState<PortfolioAnalytics | null>(null);
  const [professionalMetrics, setProfessionalMetrics] = React.useState<ProfessionalMetrics | null>(null);

  // Helper function to convert unified investment to portfolio asset
  const convertInvestmentToAsset = useCallback((investment: any): UnifiedAsset => {
    const baseAsset = {
      id: investment.id,
      name: investment.name,
      assetType: investment.assetType as AssetType,
      description: investment.description,
      acquisitionDate: investment.acquisitionDate,
      acquisitionValue: investment.acquisitionValue || 0,
      currentValue: investment.currentValue || 0,
      location: investment.location || {
        country: '',
        region: '',
        city: ''
      },
      performance: {
        irr: investment.performance?.irr || 0,
        moic: investment.performance?.moic || 0,
        totalReturn: investment.performance?.totalReturn || 0
      },
      esgMetrics: investment.esgMetrics || {
        environmentalScore: 0,
        socialScore: 0,
        governanceScore: 0,
        overallScore: 0,
        sustainabilityCertifications: []
      },
      status: investment.status as any || 'active',
      riskRating: investment.riskRating as any || 'medium',
      sector: investment.sector,
      tags: investment.tags || [],
      lastUpdated: investment.lastUpdated,
    };

    // Add asset type specific properties
    if (investment.assetType === 'traditional') {
      return {
        ...baseAsset,
        assetType: 'traditional',
        specificMetrics: investment.specificMetrics || {
          companyStage: 'seed',
          fundingRounds: 1,
          employeeCount: 10,
          revenue: 0,
          ebitda: 0,
          debtToEquity: 0,
          boardSeats: 0,
          ownershipPercentage: 0
        },
        companyInfo: investment.companyInfo || {
          foundedYear: new Date().getFullYear(),
          businessModel: '',
          keyProducts: [],
          competitiveAdvantages: []
        }
      } as UnifiedAsset;
    } else if (investment.assetType === 'real_estate') {
      return {
        ...baseAsset,
        assetType: 'real_estate',
        specificMetrics: investment.specificMetrics || {
          propertyType: 'office',
          totalSqFt: 0,
          occupancyRate: 0,
          avgLeaseLength: 0,
          capRate: 0,
          noiYield: 0,
          vacancyRate: 0,
          avgRentPsf: 0
        },
        propertyDetails: investment.propertyDetails || {
          yearBuilt: new Date().getFullYear(),
          amenities: [],
          zoning: '',
          propertyTaxes: 0
        },
        leaseInfo: investment.leaseInfo || {
          majorTenants: []
        }
      } as UnifiedAsset;
    } else {
      return {
        ...baseAsset,
        assetType: 'infrastructure',
        specificMetrics: investment.specificMetrics || {
          assetCategory: 'energy',
          capacityUtilization: 0,
          operationalEfficiency: 0,
          maintenanceScore: 0,
          regulatoryCompliance: 0,
          contractedRevenue: 0,
          availabilityRate: 0,
          averageLifespan: 0
        },
        operationalData: investment.operationalData || {
          commissionDate: new Date().toISOString().split('T')[0],
          designLife: 0,
          currentAge: 0
        },
        contractualInfo: investment.contractualInfo || {
          contractType: 'availability',
          contractorName: '',
          contractExpiry: new Date().toISOString().split('T')[0],
          renewalOptions: 0
        }
      } as UnifiedAsset;
    }
  }, []);

  const loadPortfolios = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Use unified investments API to get all internal investments (portfolio assets)
      const response = await fetch('/api/investments?investmentType=internal', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to load investments');
      }
      
      const investments = await response.json();
      
      // Group investments by portfolio to create portfolio objects
      const portfolioMap = new Map<string, Portfolio>();
      
      investments.forEach((investment: any) => {
        if (investment.portfolioId) {
          if (!portfolioMap.has(investment.portfolioId)) {
            portfolioMap.set(investment.portfolioId, {
              id: investment.portfolioId,
              name: `Portfolio ${investment.portfolioId}`,
              description: `Portfolio containing investment assets`,
              assetTypes: [],
              assets: [],
              totalValue: 0,
              totalInvested: 0,
              totalRealized: 0,
              unrealizedValue: 0,
              performanceMetrics: {
                irr: 0,
                moic: 0,
                totalReturn: 0
              },
              riskProfile: 'medium' as const,
              managerId: 'default',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          
          const portfolio = portfolioMap.get(investment.portfolioId)!;
          const asset = convertInvestmentToAsset(investment);
          
          portfolio.assets.push(asset);
          portfolio.totalValue += asset.currentValue;
          portfolio.totalInvested += asset.acquisitionValue;
          portfolio.unrealizedValue = portfolio.totalValue - portfolio.totalInvested;
          
          // Update asset types
          if (!portfolio.assetTypes.includes(asset.assetType)) {
            portfolio.assetTypes.push(asset.assetType);
          }
        }
      });
      
      const portfolios = Array.from(portfolioMap.values());
      dispatch({ type: 'SET_PORTFOLIOS', payload: portfolios });
      
      // Set the first portfolio as current if available
      if (portfolios.length > 0) {
        dispatch({ type: 'SET_CURRENT_PORTFOLIO', payload: portfolios[0] });
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [convertInvestmentToAsset]);

  const selectPortfolio = useCallback(async (portfolioId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to load portfolio');
      }
      
      const portfolio = await response.json();
      dispatch({ type: 'SET_CURRENT_PORTFOLIO', payload: portfolio });
    } catch (error) {
      console.error('Error loading portfolio:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  const createAsset = useCallback(async (assetData: any): Promise<void> => {
    if (!state.currentPortfolio) {
      throw new Error('No portfolio selected');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch(`/api/portfolio/${state.currentPortfolio.id}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(assetData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create asset');
      }
      
      const newAsset = await response.json();
      dispatch({ type: 'ADD_ASSET', payload: newAsset });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentPortfolio]);

  const updateAsset = useCallback(async (assetId: string, updates: Partial<UnifiedAsset>): Promise<void> => {
    if (!state.currentPortfolio) {
      throw new Error('No portfolio selected');
    }

    try {
      const response = await fetch(`/api/portfolio/${state.currentPortfolio.id}/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update asset');
      }
      
      dispatch({ type: 'UPDATE_ASSET', payload: { id: assetId, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [state.currentPortfolio]);

  const deleteAsset = useCallback(async (assetId: string): Promise<void> => {
    if (!state.currentPortfolio) {
      throw new Error('No portfolio selected');
    }

    try {
      const response = await fetch(`/api/portfolio/${state.currentPortfolio.id}/assets/${assetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      
      dispatch({ type: 'REMOVE_ASSET', payload: assetId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [state.currentPortfolio]);

  const setFilters = useCallback((filters: Partial<PortfolioState['filters']>): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearFilters = useCallback((): void => {
    dispatch({ type: 'SET_FILTERS', payload: initialState.filters });
  }, []);

  const setSearch = useCallback((search: string): void => {
    dispatch({ type: 'SET_FILTERS', payload: { search } });
  }, []);

  const selectAssets = useCallback((assetIds: string[]): void => {
    dispatch({ type: 'SET_SELECTED_ASSETS', payload: assetIds });
  }, []);

  const toggleAssetSelection = useCallback((assetId: string): void => {
    const newSelection = state.selectedAssets.includes(assetId)
      ? state.selectedAssets.filter(id => id !== assetId)
      : [...state.selectedAssets, assetId];
    
    dispatch({ type: 'SET_SELECTED_ASSETS', payload: newSelection });
  }, [state.selectedAssets]);

  const clearSelection = useCallback((): void => {
    dispatch({ type: 'SET_SELECTED_ASSETS', payload: [] });
  }, []);

  const calculateAnalytics = useCallback(async (): Promise<PortfolioAnalytics> => {
    if (!state.currentPortfolio) {
      throw new Error('No portfolio selected');
    }

    const { assets } = state.currentPortfolio;
    
    // Calculate basic metrics
    const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
    const totalRealized = 0; // This would come from realized exits
    const unrealizedGains = totalPortfolioValue - totalInvested;

    // Calculate weighted performance metrics
    const weightedIRR = assets.reduce((sum, asset) => sum + (asset.performance.irr * asset.currentValue), 0) / totalPortfolioValue;
    const weightedMOIC = assets.reduce((sum, asset) => sum + (asset.performance.moic * asset.currentValue), 0) / totalPortfolioValue;

    // Calculate allocations
    const assetAllocation = assets.reduce((acc, asset) => {
      acc[asset.assetType] = (acc[asset.assetType] || 0) + asset.currentValue;
      return acc;
    }, {} as Record<AssetType, number>);

    const sectorAllocation = assets.reduce((acc, asset) => {
      if (asset.sector) {
        acc[asset.sector] = (acc[asset.sector] || 0) + asset.currentValue;
      }
      return acc;
    }, {} as Record<string, number>);

    const geographicAllocation = assets.reduce((acc, asset) => {
      const country = asset.location.country;
      acc[country] = (acc[country] || 0) + asset.currentValue;
      return acc;
    }, {} as Record<string, number>);

    const riskDistribution = assets.reduce((acc, asset) => {
      acc[asset.riskRating] = (acc[asset.riskRating] || 0) + asset.currentValue;
      return acc;
    }, {} as Record<string, number>);

    // Calculate ESG score
    const esgScore = assets.reduce((sum, asset) => sum + asset.esgMetrics.overallScore, 0) / assets.length;

    const analyticsData: PortfolioAnalytics = {
      totalPortfolioValue,
      totalInvested,
      totalRealized,
      unrealizedGains,
      weightedIRR,
      weightedMOIC,
      assetAllocation,
      sectorAllocation,
      geographicAllocation,
      riskDistribution,
      performanceTrend: [], // This would be populated from historical data
      esgScore,
      benchmarkComparison: {
        portfolio: weightedIRR,
        benchmark: 0.12, // This would come from actual benchmark data
        outperformance: weightedIRR - 0.12,
      },
    };

    return analyticsData;
  }, [state.currentPortfolio]);

  const getAssetsByType = useCallback((assetType: AssetType): UnifiedAsset[] => {
    if (!state.currentPortfolio) return [];
    return state.currentPortfolio.assets.filter(asset => asset.assetType === assetType);
  }, [state.currentPortfolio]);

  // Helper function to get nested object values for sorting
  const getNestedValue = useCallback((obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }, []);

  const getFilteredAssets = useCallback((): UnifiedAsset[] => {
    if (!state.currentPortfolio) return [];
    
    let filtered = [...state.currentPortfolio.assets];
    
    // Apply filters
    if (state.filters.assetType?.length) {
      filtered = filtered.filter(asset => state.filters.assetType!.includes(asset.assetType));
    }
    
    if (state.filters.status?.length) {
      filtered = filtered.filter(asset => state.filters.status!.includes(asset.status));
    }
    
    if (state.filters.riskRating?.length) {
      filtered = filtered.filter(asset => state.filters.riskRating!.includes(asset.riskRating));
    }
    
    if (state.filters.sector?.length) {
      filtered = filtered.filter(asset => asset.sector && state.filters.sector!.includes(asset.sector));
    }
    
    if (state.filters.location?.length) {
      filtered = filtered.filter(asset => state.filters.location!.includes(asset.location.country));
    }
    
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.description?.toLowerCase().includes(searchTerm) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    if (state.sortBy) {
      filtered.sort((a, b) => {
        const aValue = getNestedValue(a, state.sortBy!);
        const bValue = getNestedValue(b, state.sortBy!);
        
        if (state.sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    return filtered;
  }, [state.currentPortfolio, state.filters, state.sortBy, state.sortDirection, getNestedValue]);

  // Load portfolios on mount
  useEffect(() => {
    loadPortfolios();
  }, []); // Only run once on mount

  // Load initial portfolio if specified
  useEffect(() => {
    if (initialPortfolioId && state.portfolios.length > 0 && !state.currentPortfolio) {
      selectPortfolio(initialPortfolioId);
    }
  }, [initialPortfolioId, state.portfolios.length, state.currentPortfolio?.id, selectPortfolio]);

  // Automatically select first portfolio if none selected and portfolios are loaded
  useEffect(() => {
    if (!state.currentPortfolio && state.portfolios.length > 0 && !state.loading) {
      selectPortfolio(state.portfolios[0].id);
    }
  }, [state.currentPortfolio?.id, state.portfolios.length, state.loading, selectPortfolio]);

  // Calculate analytics when portfolio changes with caching
  useEffect(() => {
    if (state.currentPortfolio && state.currentPortfolio.assets.length > 0) {
      const portfolioId = state.currentPortfolio.id;
      const assets = state.currentPortfolio.assets;

      // Try to get cached analytics first
      const cachedAnalytics = portfolioCache?.getCachedAnalytics?.(portfolioId, assets);
      const cachedProfessionalMetrics = portfolioCache?.getCachedProfessionalMetrics?.(portfolioId, assets);

      if (cachedAnalytics && cachedProfessionalMetrics) {
        setAnalytics(cachedAnalytics);
        setProfessionalMetrics(cachedProfessionalMetrics);
        return;
      }

      // Calculate analytics in a requestIdleCallback for better performance
      const calculateAnalyticsAsync = () => {
        // Basic analytics
        const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
        const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
        const totalRealized = 0;
        const unrealizedGains = totalPortfolioValue - totalInvested;

        // Calculate weighted performance metrics
        const weightedIRR = totalPortfolioValue > 0 
          ? assets.reduce((sum, asset) => sum + (asset.performance.irr * asset.currentValue), 0) / totalPortfolioValue
          : 0;
        const weightedMOIC = totalPortfolioValue > 0
          ? assets.reduce((sum, asset) => sum + (asset.performance.moic * asset.currentValue), 0) / totalPortfolioValue
          : 0;

        // Calculate allocations
        const assetAllocation = assets.reduce((acc, asset) => {
          acc[asset.assetType] = (acc[asset.assetType] || 0) + asset.currentValue;
          return acc;
        }, {} as Record<AssetType, number>);

        const sectorAllocation = assets.reduce((acc, asset) => {
          if (asset.sector) {
            acc[asset.sector] = (acc[asset.sector] || 0) + asset.currentValue;
          }
          return acc;
        }, {} as Record<string, number>);

        const geographicAllocation = assets.reduce((acc, asset) => {
          const country = asset.location.country;
          acc[country] = (acc[country] || 0) + asset.currentValue;
          return acc;
        }, {} as Record<string, number>);

        const riskDistribution = assets.reduce((acc, asset) => {
          acc[asset.riskRating] = (acc[asset.riskRating] || 0) + asset.currentValue;
          return acc;
        }, {} as Record<string, number>);

        // Calculate ESG score
        const esgScore = assets.length > 0 
          ? assets.reduce((sum, asset) => sum + asset.esgMetrics.overallScore, 0) / assets.length
          : 0;

        const analyticsData: PortfolioAnalytics = {
          totalPortfolioValue,
          totalInvested,
          totalRealized,
          unrealizedGains,
          weightedIRR,
          weightedMOIC,
          assetAllocation,
          sectorAllocation,
          geographicAllocation,
          riskDistribution,
          performanceTrend: [],
          esgScore,
          benchmarkComparison: {
            portfolio: weightedIRR,
            benchmark: 0.12,
            outperformance: weightedIRR - 0.12,
          },
        };

        // Professional analytics
        const professionalAnalytics = new ProfessionalPortfolioAnalytics(assets);
        const professionalMetricsData = professionalAnalytics.generateProfessionalMetrics();

        // Cache the results
        portfolioCache.setCachedAnalytics(portfolioId, assets, analyticsData);
        portfolioCache.setCachedProfessionalMetrics(portfolioId, assets, professionalMetricsData);

        // Update state
        setAnalytics(analyticsData);
        setProfessionalMetrics(professionalMetricsData);
      };

      // Use requestIdleCallback for better performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(calculateAnalyticsAsync);
      } else {
        // Fallback for environments without requestIdleCallback
        setTimeout(calculateAnalyticsAsync, 0);
      }
    } else {
      setAnalytics(null);
      setProfessionalMetrics(null);
    }
  }, [state.currentPortfolio?.id, state.currentPortfolio?.assets]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    config,
    analytics,
    professionalMetrics,
    loadPortfolios,
    selectPortfolio,
    createAsset,
    updateAsset,
    deleteAsset,
    setFilters,
    clearFilters,
    setSearch,
    selectAssets,
    toggleAssetSelection,
    clearSelection,
    calculateAnalytics,
    getAssetsByType,
    getFilteredAssets,
  }), [
    state,
    config,
    analytics,
    professionalMetrics,
    loadPortfolios,
    selectPortfolio,
    createAsset,
    updateAsset,
    deleteAsset,
    setFilters,
    clearFilters,
    setSearch,
    selectAssets,
    toggleAssetSelection,
    clearSelection,
    calculateAnalytics,
    getAssetsByType,
    getFilteredAssets,
  ]);

  return (
    <UnifiedPortfolioContext.Provider value={contextValue}>
      {children}
    </UnifiedPortfolioContext.Provider>
  );
}

export function useUnifiedPortfolio(): UnifiedPortfolioContextType {
  const context = useContext(UnifiedPortfolioContext);
  if (context === undefined) {
    throw new Error('useUnifiedPortfolio must be used within a UnifiedPortfolioProvider');
  }
  return context;
}
