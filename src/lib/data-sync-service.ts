// Real-time Data Synchronization Service
// Handles cross-module data updates, quality monitoring, and intelligent routing

import { 
  DataQualityIndicator, 
  DataFreshness, 
  EntityType, 
  EntityId, 
  EntityRelationship,
  UnifiedMetric,
  IntelligentInsight,
  Alert
} from '@/types/shared-intelligence';

export interface DataSyncEvent {
  id: string;
  entityType: EntityType;
  entityId: EntityId;
  eventType: 'CREATE' | 'UPDATE' | 'DELETE' | 'VALIDATION_CHANGE';
  sourceModule: string;
  data: any;
  timestamp: Date;
  userId?: string;
  affectedFields?: string[];
  previousData?: any;
}

export interface SyncSubscription {
  id: string;
  subscriberModule: string;
  entityTypes: EntityType[];
  eventTypes: string[];
  filter?: (event: DataSyncEvent) => boolean;
  callback: (event: DataSyncEvent) => Promise<void>;
}

export interface CrossModuleQuery {
  id: string;
  requestingModule: string;
  targetModules: string[];
  entityType: EntityType;
  entityId?: EntityId;
  query: {
    fields?: string[];
    filters?: Record<string, any>;
    sort?: string;
    limit?: number;
  };
  metadata?: Record<string, any>;
}

class DataSyncService {
  private subscribers: Map<string, SyncSubscription[]> = new Map();
  private dataCache: Map<string, any> = new Map();
  private qualityIndicators: Map<string, DataQualityIndicator> = new Map();
  private relationships: Map<string, EntityRelationship[]> = new Map();
  private metrics: Map<string, UnifiedMetric> = new Map();
  private syncHistory: DataSyncEvent[] = [];
  private alerts: Alert[] = [];

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // Initialize background processes
    this.startQualityMonitoring();
    this.startRelationshipDiscovery();
    this.startMetricsAggregation();
    
    console.log('Data Sync Service initialized');
  }

  // Subscription Management
  subscribe(subscription: SyncSubscription): string {
    subscription.entityTypes.forEach(entityType => {
      const key = this.getSubscriptionKey(entityType);
      if (!this.subscribers.has(key)) {
        this.subscribers.set(key, []);
      }
      this.subscribers.get(key)!.push(subscription);
    });

    console.log(`Module ${subscription.subscriberModule} subscribed to ${subscription.entityTypes.join(', ')}`);
    return subscription.id;
  }

  unsubscribe(subscriptionId: string) {
    this.subscribers.forEach((subs, key) => {
      this.subscribers.set(key, subs.filter(s => s.id !== subscriptionId));
    });
  }

  // Data Synchronization
  async publishEvent(event: DataSyncEvent): Promise<void> {
    // Add to history
    this.syncHistory.push(event);
    
    // Keep history manageable (last 10,000 events)
    if (this.syncHistory.length > 10000) {
      this.syncHistory = this.syncHistory.slice(-10000);
    }

    // Update cache
    const cacheKey = this.getCacheKey(event.entityType, event.entityId);
    if (event.eventType === 'DELETE') {
      this.dataCache.delete(cacheKey);
      this.qualityIndicators.delete(cacheKey);
    } else {
      this.dataCache.set(cacheKey, event.data);
      
      // Update data quality indicator
      await this.updateDataQuality(cacheKey, event);
    }

    // Notify subscribers
    await this.notifySubscribers(event);

    // Update relationships
    await this.updateRelationships(event);

    // Check for alerts
    await this.checkForAlerts(event);
  }

  private async notifySubscribers(event: DataSyncEvent): Promise<void> {
    const subscriptionKey = this.getSubscriptionKey(event.entityType);
    const subscribers = this.subscribers.get(subscriptionKey) || [];

    const notifications = subscribers
      .filter(sub => sub.eventTypes.includes(event.eventType))
      .filter(sub => !sub.filter || sub.filter(event))
      .map(sub => this.safeNotify(sub, event));

    await Promise.allSettled(notifications);
  }

  private async safeNotify(subscription: SyncSubscription, event: DataSyncEvent): Promise<void> {
    try {
      await subscription.callback(event);
    } catch (error) {
      console.error(`Error notifying subscriber ${subscription.subscriberModule}:`, error);
      
      // Create alert for failed notification
      this.createAlert({
        type: 'ERROR',
        message: `Failed to notify ${subscription.subscriberModule} of ${event.eventType} event`,
        source: 'DataSyncService',
        metadata: {
          subscriptionId: subscription.id,
          eventId: event.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  // Data Quality Management
  async getDataQuality(entityType: EntityType, entityId: EntityId): Promise<DataQualityIndicator | null> {
    const cacheKey = this.getCacheKey(entityType, entityId);
    return this.qualityIndicators.get(cacheKey) || null;
  }

  private async updateDataQuality(cacheKey: string, event: DataSyncEvent): Promise<void> {
    const existingQuality = this.qualityIndicators.get(cacheKey);
    
    const newQuality: DataQualityIndicator = {
      lastUpdated: event.timestamp,
      source: event.sourceModule,
      freshness: this.calculateFreshness(event.timestamp),
      accuracy: this.calculateAccuracy(event.data, existingQuality),
      completeness: this.calculateCompleteness(event.data),
      consistency: this.calculateConsistency(event.data, cacheKey),
      validationStatus: 'PENDING',
      warnings: [],
      errors: []
    };

    // Validate data
    const validation = await this.validateData(event.data, event.entityType);
    newQuality.validationStatus = validation.status;
    newQuality.warnings = validation.warnings;
    newQuality.errors = validation.errors;

    this.qualityIndicators.set(cacheKey, newQuality);

    // Alert on quality issues
    if (newQuality.validationStatus === 'ERROR' || newQuality.accuracy < 0.8) {
      this.createAlert({
        type: 'WARNING',
        message: `Data quality issues detected for ${event.entityType}:${event.entityId}`,
        source: 'DataQualityMonitor',
        metadata: {
          entityType: event.entityType,
          entityId: event.entityId,
          quality: newQuality
        }
      });
    }
  }

  private calculateFreshness(lastUpdated: Date): DataFreshness {
    const ageMinutes = (Date.now() - lastUpdated.getTime()) / (1000 * 60);
    
    if (ageMinutes < 5) return DataFreshness.REAL_TIME;
    if (ageMinutes < 60) return DataFreshness.MINUTES;
    if (ageMinutes < 1440) return DataFreshness.HOURS; // 24 hours
    if (ageMinutes < 10080) return DataFreshness.DAYS; // 7 days
    return DataFreshness.STALE;
  }

  private calculateAccuracy(data: any, existingQuality?: DataQualityIndicator): number {
    // Simple heuristic - could be enhanced with ML models
    let accuracy = 1.0;
    
    // Penalize for missing required fields
    const requiredFields = this.getRequiredFields(data);
    const missingFields = requiredFields.filter(field => !data[field] || data[field] === '');
    accuracy -= (missingFields.length / requiredFields.length) * 0.3;
    
    // Consider historical accuracy if available
    if (existingQuality) {
      accuracy = (accuracy + existingQuality.accuracy) / 2;
    }
    
    return Math.max(0, Math.min(1, accuracy));
  }

  private calculateCompleteness(data: any): number {
    const allFields = Object.keys(data);
    const filledFields = allFields.filter(key => 
      data[key] !== null && 
      data[key] !== undefined && 
      data[key] !== ''
    );
    
    return allFields.length > 0 ? filledFields.length / allFields.length : 0;
  }

  private calculateConsistency(data: any, cacheKey: string): number {
    // Compare with cached data for consistency
    const cached = this.dataCache.get(cacheKey);
    if (!cached) return 1.0;
    
    const commonFields = Object.keys(data).filter(key => key in cached);
    if (commonFields.length === 0) return 1.0;
    
    const consistentFields = commonFields.filter(key => {
      // Allow for reasonable numeric variations
      if (typeof data[key] === 'number' && typeof cached[key] === 'number') {
        return Math.abs(data[key] - cached[key]) / Math.max(Math.abs(data[key]), Math.abs(cached[key]), 1) < 0.1;
      }
      return data[key] === cached[key];
    });
    
    return consistentFields.length / commonFields.length;
  }

  private async validateData(data: any, entityType: EntityType): Promise<{
    status: 'PENDING' | 'VALIDATED' | 'ERROR' | 'STALE';
    warnings: string[];
    errors: string[];
  }> {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Basic validation rules
    if (!data.id) {
      errors.push('Missing required field: id');
    }
    
    if (!data.updatedAt) {
      warnings.push('Missing updatedAt timestamp');
    } else {
      const age = Date.now() - new Date(data.updatedAt).getTime();
      if (age > 7 * 24 * 60 * 60 * 1000) { // 7 days
        warnings.push('Data is older than 7 days');
      }
    }
    
    // Entity-specific validation
    switch (entityType) {
      case 'FUND':
        if (!data.name) errors.push('Fund name is required');
        if (data.targetSize && data.targetSize <= 0) errors.push('Target size must be positive');
        break;
      case 'PORTFOLIO_COMPANY':
        if (!data.name) errors.push('Company name is required');
        if (!data.sector) warnings.push('Company sector not specified');
        break;
      case 'LP_ORGANIZATION':
        if (!data.name) errors.push('Organization name is required');
        if (!data.organizationType) errors.push('Organization type is required');
        break;
    }
    
    const status = errors.length > 0 ? 'ERROR' : 'VALIDATED';
    return { status, warnings, errors };
  }

  // Cross-Module Querying
  async queryData(query: CrossModuleQuery): Promise<{
    data: any[];
    metadata: {
      totalCount: number;
      sources: string[];
      quality: DataQualityIndicator;
    };
  }> {
    const results: any[] = [];
    const sources: string[] = [];
    
    // For now, query local cache - in production would query actual data sources
    const cacheEntries = Array.from(this.dataCache.entries());
    
    for (const [cacheKey, data] of cacheEntries) {
      const [entityType, entityId] = this.parseCacheKey(cacheKey);
      
      if (entityType === query.entityType) {
        // Apply filters
        if (query.query.filters && !this.matchesFilters(data, query.query.filters)) {
          continue;
        }
        
        // Apply field selection
        let resultData = data;
        if (query.query.fields && query.query.fields.length > 0) {
          resultData = this.selectFields(data, query.query.fields);
        }
        
        results.push(resultData);
        
        // Track data source
        const quality = this.qualityIndicators.get(cacheKey);
        if (quality && !sources.includes(quality.source)) {
          sources.push(quality.source);
        }
      }
    }
    
    // Apply sorting and limiting
    if (query.query.sort) {
      results.sort((a, b) => this.compareForSort(a, b, query.query.sort!));
    }
    
    const totalCount = results.length;
    const limitedResults = query.query.limit ? results.slice(0, query.query.limit) : results;
    
    // Calculate aggregate quality
    const qualities = limitedResults
      .map(item => this.qualityIndicators.get(this.getCacheKey(query.entityType, item.id)))
      .filter(Boolean) as DataQualityIndicator[];
    
    const aggregateQuality: DataQualityIndicator = {
      lastUpdated: new Date(),
      source: 'Aggregated',
      freshness: this.getWorstFreshness(qualities),
      accuracy: this.calculateAverageQuality(qualities, 'accuracy'),
      completeness: this.calculateAverageQuality(qualities, 'completeness'),
      consistency: this.calculateAverageQuality(qualities, 'consistency'),
      validationStatus: this.getWorstValidationStatus(qualities),
      warnings: this.aggregateWarnings(qualities),
      errors: this.aggregateErrors(qualities)
    };
    
    return {
      data: limitedResults,
      metadata: {
        totalCount,
        sources,
        quality: aggregateQuality
      }
    };
  }

  // Relationship Management
  async updateRelationships(event: DataSyncEvent): Promise<void> {
    const relationships = await this.discoverRelationships(event);
    const key = this.getCacheKey(event.entityType, event.entityId);
    this.relationships.set(key, relationships);
  }

  private async discoverRelationships(event: DataSyncEvent): Promise<EntityRelationship[]> {
    const relationships: EntityRelationship[] = [];
    
    // Extract relationships from data
    const data = event.data;
    
    // Common relationship patterns
    if (data.fundId) {
      relationships.push(this.createRelationship(
        event.entityType, event.entityId,
        'FUND', data.fundId,
        'BELONGS_TO', 0.9
      ));
    }
    
    if (data.portfolioCompanyId) {
      relationships.push(this.createRelationship(
        event.entityType, event.entityId,
        'PORTFOLIO_COMPANY', data.portfolioCompanyId,
        'RELATES_TO', 0.8
      ));
    }
    
    if (data.lpOrganizationId) {
      relationships.push(this.createRelationship(
        event.entityType, event.entityId,
        'LP_ORGANIZATION', data.lpOrganizationId,
        'ASSOCIATED_WITH', 0.8
      ));
    }
    
    // Industry/sector relationships
    if (data.sector && event.entityType === 'PORTFOLIO_COMPANY') {
      // Find other companies in same sector
      const sectorCompanies = await this.findEntitiesByAttribute('PORTFOLIO_COMPANY', 'sector', data.sector);
      sectorCompanies.forEach(company => {
        if (company.id !== event.entityId) {
          relationships.push(this.createRelationship(
            event.entityType, event.entityId,
            'PORTFOLIO_COMPANY', company.id,
            'SAME_SECTOR', 0.6
          ));
        }
      });
    }
    
    return relationships;
  }

  private createRelationship(
    fromType: EntityType, fromId: EntityId,
    toType: EntityType, toId: EntityId,
    relationshipType: string, strength: number
  ): EntityRelationship {
    return {
      fromEntity: { type: fromType, id: fromId },
      toEntity: { type: toType, id: toId },
      relationshipType,
      strength,
      direction: 'FORWARD',
      createdAt: new Date()
    };
  }

  async getRelatedEntities(entityType: EntityType, entityId: EntityId): Promise<EntityRelationship[]> {
    const key = this.getCacheKey(entityType, entityId);
    return this.relationships.get(key) || [];
  }

  // Metrics and Insights
  private startMetricsAggregation(): void {
    setInterval(() => {
      this.aggregateMetrics();
    }, 60000); // Run every minute
  }

  private async aggregateMetrics(): Promise<void> {
    // Aggregate metrics from various sources
    // This is a simplified version - would integrate with actual metric sources
    
    const systemMetrics: UnifiedMetric[] = [
      {
        id: 'data_sync_events',
        name: 'Data Sync Events',
        category: 'OPERATIONAL',
        value: this.syncHistory.length,
        unit: 'events',
        trend: 'STABLE',
        dataQuality: this.createDefaultDataQuality(),
        reportingPeriod: 'current',
        frequency: 'REAL_TIME',
        lastCalculated: new Date()
      },
      {
        id: 'active_subscriptions',
        name: 'Active Subscriptions',
        category: 'OPERATIONAL',
        value: Array.from(this.subscribers.values()).flat().length,
        unit: 'subscriptions',
        trend: 'STABLE',
        dataQuality: this.createDefaultDataQuality(),
        reportingPeriod: 'current',
        frequency: 'REAL_TIME',
        lastCalculated: new Date()
      }
    ];
    
    systemMetrics.forEach(metric => {
      this.metrics.set(metric.id, metric);
    });
  }

  // Alert Management
  private async checkForAlerts(event: DataSyncEvent): Promise<void> {
    // Check for alert conditions
    const quality = this.qualityIndicators.get(this.getCacheKey(event.entityType, event.entityId));
    
    if (quality) {
      if (quality.errors.length > 0) {
        this.createAlert({
          type: 'ERROR',
          message: `Data validation errors for ${event.entityType}:${event.entityId}`,
          source: event.sourceModule,
          metadata: {
            entityType: event.entityType,
            entityId: event.entityId,
            errors: quality.errors
          }
        });
      }
      
      if (quality.accuracy < 0.7) {
        this.createAlert({
          type: 'WARNING',
          message: `Low data accuracy for ${event.entityType}:${event.entityId}`,
          source: event.sourceModule,
          metadata: {
            entityType: event.entityType,
            entityId: event.entityId,
            accuracy: quality.accuracy
          }
        });
      }
    }
  }

  private createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): void {
    const newAlert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...alert
    };
    
    this.alerts.push(newAlert);
    
    // Keep alerts manageable
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
    
    console.log(`Alert created: ${newAlert.type} - ${newAlert.message}`);
  }

  getAlerts(type?: string): Alert[] {
    return type 
      ? this.alerts.filter(alert => alert.type === type)
      : this.alerts;
  }

  // Background Services
  private startQualityMonitoring(): void {
    setInterval(() => {
      this.performQualityCheck();
    }, 300000); // Run every 5 minutes
  }

  private startRelationshipDiscovery(): void {
    setInterval(() => {
      this.performRelationshipDiscovery();
    }, 600000); // Run every 10 minutes
  }

  private async performQualityCheck(): Promise<void> {
    console.log('Performing data quality check...');
    
    for (const [cacheKey, data] of this.dataCache.entries()) {
      const quality = this.qualityIndicators.get(cacheKey);
      if (quality) {
        // Update freshness
        quality.freshness = this.calculateFreshness(quality.lastUpdated);
        
        // Mark as stale if too old
        if (quality.freshness === DataFreshness.STALE) {
          quality.validationStatus = 'STALE';
        }
      }
    }
  }

  private async performRelationshipDiscovery(): Promise<void> {
    console.log('Performing relationship discovery...');
    
    // This would contain more sophisticated relationship discovery logic
    // For now, it's a placeholder
  }

  // Utility methods
  private getSubscriptionKey(entityType: EntityType): string {
    return `sub_${entityType}`;
  }

  private getCacheKey(entityType: EntityType, entityId: EntityId): string {
    return `${entityType}:${entityId}`;
  }

  private parseCacheKey(cacheKey: string): [EntityType, EntityId] {
    const [entityType, entityId] = cacheKey.split(':');
    return [entityType as EntityType, entityId];
  }

  private getRequiredFields(data: any): string[] {
    // This would be configurable based on entity type
    return ['id', 'name', 'updatedAt'];
  }

  private matchesFilters(data: any, filters: Record<string, any>): boolean {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.includes(data[key]);
      }
      return data[key] === value;
    });
  }

  private selectFields(data: any, fields: string[]): any {
    const result: any = {};
    fields.forEach(field => {
      if (field in data) {
        result[field] = data[field];
      }
    });
    return result;
  }

  private compareForSort(a: any, b: any, sortField: string): number {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  }

  private async findEntitiesByAttribute(entityType: EntityType, attribute: string, value: any): Promise<any[]> {
    const results: any[] = [];
    
    for (const [cacheKey, data] of this.dataCache.entries()) {
      const [cachedEntityType] = this.parseCacheKey(cacheKey);
      if (cachedEntityType === entityType && data[attribute] === value) {
        results.push(data);
      }
    }
    
    return results;
  }

  private getWorstFreshness(qualities: DataQualityIndicator[]): DataFreshness {
    const freshnessOrder = [
      DataFreshness.REAL_TIME,
      DataFreshness.MINUTES,
      DataFreshness.HOURS,
      DataFreshness.DAYS,
      DataFreshness.STALE
    ];
    
    let worstIndex = 0;
    qualities.forEach(quality => {
      const index = freshnessOrder.indexOf(quality.freshness);
      if (index > worstIndex) {
        worstIndex = index;
      }
    });
    
    return freshnessOrder[worstIndex];
  }

  private calculateAverageQuality(qualities: DataQualityIndicator[], field: keyof DataQualityIndicator): number {
    if (qualities.length === 0) return 0;
    
    const sum = qualities.reduce((acc, quality) => {
      const value = quality[field];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
    
    return sum / qualities.length;
  }

  private getWorstValidationStatus(qualities: DataQualityIndicator[]): 'PENDING' | 'VALIDATED' | 'ERROR' | 'STALE' {
    const statusOrder = ['VALIDATED', 'PENDING', 'STALE', 'ERROR'];
    
    let worstIndex = 0;
    qualities.forEach(quality => {
      const index = statusOrder.indexOf(quality.validationStatus);
      if (index > worstIndex) {
        worstIndex = index;
      }
    });
    
    return statusOrder[worstIndex] as any;
  }

  private aggregateWarnings(qualities: DataQualityIndicator[]): string[] {
    const allWarnings = qualities.flatMap(q => q.warnings || []);
    return Array.from(new Set(allWarnings));
  }

  private aggregateErrors(qualities: DataQualityIndicator[]): string[] {
    const allErrors = qualities.flatMap(q => q.errors || []);
    return Array.from(new Set(allErrors));
  }

  private createDefaultDataQuality(): DataQualityIndicator {
    return {
      lastUpdated: new Date(),
      source: 'System',
      freshness: DataFreshness.REAL_TIME,
      accuracy: 1.0,
      completeness: 1.0,
      consistency: 1.0,
      validationStatus: 'VALIDATED',
      warnings: [],
      errors: []
    };
  }
}

// Export singleton instance
export const dataSyncService = new DataSyncService();

// Export types for use by other modules
export type { DataSyncEvent, SyncSubscription, CrossModuleQuery };