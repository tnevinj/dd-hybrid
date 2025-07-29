import { UnifiedAsset, PortfolioAnalytics } from '@/types/portfolio';
import { ProfessionalMetrics, ProfessionalPortfolioAnalytics } from './portfolio-analytics';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
}

interface PortfolioCacheData {
  analytics: PortfolioAnalytics;
  professionalMetrics: ProfessionalMetrics;
  filteredAssets: UnifiedAsset[];
}

export class PortfolioCache {
  private static instance: PortfolioCache;
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes TTL
  private readonly MAX_ENTRIES = 100;

  private constructor() {
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  static getInstance(): PortfolioCache {
    if (!PortfolioCache.instance) {
      PortfolioCache.instance = new PortfolioCache();
    }
    return PortfolioCache.instance;
  }

  // Generate cache key based on portfolio data
  private generateKey(prefix: string, data: any): string {
    const hash = this.hashData(data);
    return `${prefix}_${hash}`;
  }

  // Simple hash function for cache keys
  private hashData(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Check if cache entry is valid
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < this.TTL;
  }

  // Get cached analytics
  getCachedAnalytics(portfolioId: string, assets: UnifiedAsset[]): PortfolioAnalytics | null {
    const key = this.generateKey(`analytics_${portfolioId}`, assets);
    const entry = this.cache.get(key);
    
    if (entry && this.isValid(entry)) {
      console.log('📈 Cache HIT: Analytics for portfolio', portfolioId);
      return entry.data;
    }
    
    console.log('📈 Cache MISS: Analytics for portfolio', portfolioId);
    return null;
  }

  // Cache analytics
  setCachedAnalytics(portfolioId: string, assets: UnifiedAsset[], analytics: PortfolioAnalytics): void {
    const key = this.generateKey(`analytics_${portfolioId}`, assets);
    const hash = this.hashData(assets);
    
    this.cache.set(key, {
      data: analytics,
      timestamp: Date.now(),
      hash
    });
    
    this.enforceMaxEntries();
  }

  // Get cached professional metrics
  getCachedProfessionalMetrics(portfolioId: string, assets: UnifiedAsset[]): ProfessionalMetrics | null {
    const key = this.generateKey(`professional_${portfolioId}`, assets);
    const entry = this.cache.get(key);
    
    if (entry && this.isValid(entry)) {
      console.log('🎯 Cache HIT: Professional metrics for portfolio', portfolioId);
      return entry.data;
    }
    
    console.log('🎯 Cache MISS: Professional metrics for portfolio', portfolioId);
    return null;
  }

  // Cache professional metrics
  setCachedProfessionalMetrics(portfolioId: string, assets: UnifiedAsset[], metrics: ProfessionalMetrics): void {
    const key = this.generateKey(`professional_${portfolioId}`, assets);
    const hash = this.hashData(assets);
    
    this.cache.set(key, {
      data: metrics,
      timestamp: Date.now(),
      hash
    });
    
    this.enforceMaxEntries();
  }

  // Get cached filtered assets
  getCachedFilteredAssets(portfolioId: string, assets: UnifiedAsset[], filters: any): UnifiedAsset[] | null {
    const key = this.generateKey(`filtered_${portfolioId}`, { assets, filters });
    const entry = this.cache.get(key);
    
    if (entry && this.isValid(entry)) {
      console.log('🔍 Cache HIT: Filtered assets for portfolio', portfolioId);
      return entry.data;
    }
    
    console.log('🔍 Cache MISS: Filtered assets for portfolio', portfolioId);
    return null;
  }

  // Cache filtered assets
  setCachedFilteredAssets(portfolioId: string, assets: UnifiedAsset[], filters: any, filteredAssets: UnifiedAsset[]): void {
    const key = this.generateKey(`filtered_${portfolioId}`, { assets, filters });
    const hash = this.hashData({ assets, filters });
    
    this.cache.set(key, {
      data: filteredAssets,
      timestamp: Date.now(),
      hash
    });
    
    this.enforceMaxEntries();
  }

  // Invalidate cache for specific portfolio
  invalidatePortfolio(portfolioId: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key] of this.cache) {
      if (key.includes(portfolioId)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🗑️ Invalidated ${keysToDelete.length} cache entries for portfolio ${portfolioId}`);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
    console.log('🗑️ Cleared all cache entries');
  }

  // Get cache statistics
  getStats(): { size: number; hitRate: number; memoryUsage: string } {
    const size = this.cache.size;
    
    // Estimate memory usage
    let memoryBytes = 0;
    for (const [key, entry] of this.cache) {
      memoryBytes += key.length * 2; // UTF-16 characters
      memoryBytes += JSON.stringify(entry).length * 2;
    }
    
    const memoryMB = (memoryBytes / (1024 * 1024)).toFixed(2);
    
    return {
      size,
      hitRate: 0, // Would need to track hits/misses for real hit rate
      memoryUsage: `${memoryMB} MB`
    };
  }

  // Cleanup expired entries
  private cleanup(): void {
    let deletedCount = 0;
    
    for (const [key, entry] of this.cache) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} expired cache entries`);
    }
  }

  // Enforce maximum cache size
  private enforceMaxEntries(): void {
    if (this.cache.size <= this.MAX_ENTRIES) return;
    
    // Remove oldest entries
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toDelete = entries.slice(0, this.cache.size - this.MAX_ENTRIES);
    toDelete.forEach(([key]) => this.cache.delete(key));
    
    console.log(`🗑️ Removed ${toDelete.length} old cache entries to enforce size limit`);
  }
}

// Export singleton instance
export const portfolioCache = PortfolioCache.getInstance();