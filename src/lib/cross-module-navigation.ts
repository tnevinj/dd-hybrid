// Cross-Module Navigation and Search Service
// Provides intelligent navigation and unified search across all modules

import {
  EntityType,
  EntityId,
  NavigationContext,
  NavigationBreadcrumb,
  DecisionContext,
  EntityRelationship,
  CrossModuleQuery,
  EntityReference
} from '@/types/shared-intelligence';

import { dataSyncService } from './data-sync-service';

export interface CrossModuleNavigationService {
  navigateToEntity(entityType: EntityType, entityId: EntityId, context?: DecisionContext): void;
  buildContextualBreadcrumbs(currentPath: string, entityContext?: EntityReference): NavigationBreadcrumb[];
  getRelatedEntities(entityType: EntityType, entityId: EntityId): Promise<EntityRelationship[]>;
  searchAcrossModules(query: UniversalSearchQuery): Promise<UniversalSearchResult>;
  getSmartSuggestions(currentContext: NavigationContext): Promise<NavigationSuggestion[]>;
  trackNavigation(from: string, to: string, context?: DecisionContext): void;
  getNavigationInsights(): Promise<NavigationInsights>;
}

export interface UniversalSearchQuery {
  query: string;
  modules?: string[];
  entityTypes?: EntityType[];
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  includeContent?: boolean;
  includeRelated?: boolean;
}

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startswith' | 'endswith' | 'gt' | 'lt' | 'between' | 'in';
  value: any;
  module?: string;
}

export interface UniversalSearchResult {
  totalResults: number;
  results: SearchResult[];
  facets: SearchFacet[];
  suggestions: SearchSuggestion[];
  relatedEntities: RelatedEntityGroup[];
  executionTime: number;
  quality: SearchQuality;
}

export interface SearchResult {
  id: string;
  entityType: EntityType;
  entityId: EntityId;
  module: string;
  title: string;
  description: string;
  relevanceScore: number; // 0-1
  matchType: 'EXACT' | 'PARTIAL' | 'FUZZY' | 'SEMANTIC';
  highlights: SearchHighlight[];
  metadata: SearchMetadata;
  relatedResults?: SearchResult[];
}

export interface SearchFacet {
  field: string;
  displayName: string;
  values: SearchFacetValue[];
}

export interface SearchFacetValue {
  value: string;
  count: number;
  selected: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'COMPLETION' | 'CORRECTION' | 'ALTERNATIVE';
  confidence: number; // 0-1
}

export interface RelatedEntityGroup {
  relationship: string;
  entities: EntityReference[];
}

export interface SearchHighlight {
  field: string;
  fragments: string[];
}

export interface SearchMetadata {
  module: string;
  entityType: EntityType;
  lastUpdated: Date;
  relevantFields: string[];
  confidence: number; // 0-1
  contextualInfo?: Record<string, any>;
}

export interface SearchQuality {
  confidence: number; // 0-1
  completeness: number; // 0-1
  freshness: number; // 0-1
  accuracy: number; // 0-1
  warnings?: string[];
}

export interface NavigationSuggestion {
  id: string;
  type: 'RELATED_ENTITY' | 'NEXT_STEP' | 'SIMILAR_ITEM' | 'RECOMMENDED_ACTION';
  title: string;
  description: string;
  target: NavigationTarget;
  relevance: number; // 0-1
  reasoning: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface NavigationTarget {
  module: string;
  entityType: EntityType;
  entityId?: EntityId;
  url: string;
  action?: string;
}

export interface NavigationInsights {
  popularPaths: NavigationPath[];
  efficientRoutes: EfficientRoute[];
  userBehaviorPatterns: UserBehaviorPattern[];
  contentGaps: ContentGap[];
  optimizationOpportunities: NavigationOptimization[];
}

export interface NavigationPath {
  path: string[];
  frequency: number;
  averageTime: number; // seconds
  successRate: number; // 0-1
  commonContext: DecisionContext[];
}

export interface EfficientRoute {
  from: string;
  to: string;
  recommendedPath: string[];
  timeSaving: number; // seconds
  alternativePaths: string[][];
}

export interface UserBehaviorPattern {
  pattern: string;
  frequency: number;
  users: number;
  timeOfDay: string;
  commonTasks: string[];
  efficiency: number; // 0-1
}

export interface ContentGap {
  area: string;
  description: string;
  frequency: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedContent: string[];
}

export interface NavigationOptimization {
  area: string;
  currentState: string;
  recommendedState: string;
  expectedImprovement: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Module-specific search interfaces
export interface ModuleSearchCapability {
  module: string;
  supportedEntityTypes: EntityType[];
  searchableFields: SearchableField[];
  capabilities: SearchCapability[];
  indexingFrequency: string;
  lastIndexed: Date;
}

export interface SearchableField {
  field: string;
  displayName: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'CATEGORY';
  searchable: boolean;
  filterable: boolean;
  facetable: boolean;
  weight: number; // relevance weight 0-1
}

export interface SearchCapability {
  capability: 'FUZZY_SEARCH' | 'SEMANTIC_SEARCH' | 'FACETED_SEARCH' | 'AUTO_COMPLETE' | 'SPELL_CHECK';
  enabled: boolean;
  configuration?: Record<string, any>;
}

// Smart routing and context-aware navigation
export interface SmartRouter {
  getOptimalPath(from: NavigationContext, to: NavigationTarget, preferences?: NavigationPreferences): NavigationRoute;
  predictNextDestination(currentContext: NavigationContext, userProfile?: UserProfile): NavigationPrediction[];
  getContextualActions(entityType: EntityType, entityId: EntityId): ContextualAction[];
  resolveAmbiguousNavigation(query: string, context: NavigationContext): NavigationResolution[];
}

export interface NavigationPreferences {
  preferredModules: string[];
  skipIntermediateSteps: boolean;
  includeRelatedEntities: boolean;
  maxPathLength: number;
  timeConstraints?: TimeConstraint;
}

export interface UserProfile {
  userId: string;
  role: string;
  permissions: string[];
  frequentModules: string[];
  recentActivity: NavigationActivity[];
  preferences: NavigationPreferences;
}

export interface NavigationRoute {
  steps: NavigationStep[];
  estimatedTime: number; // seconds
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  alternatives: NavigationRoute[];
  contextualInfo: RouteContext[];
}

export interface NavigationStep {
  module: string;
  action: string;
  description: string;
  url: string;
  estimatedTime: number; // seconds
  required: boolean;
  contextData?: Record<string, any>;
}

export interface NavigationPrediction {
  destination: NavigationTarget;
  probability: number; // 0-1
  reasoning: string;
  contextFactors: string[];
  timing: 'IMMEDIATE' | 'SOON' | 'LATER';
}

export interface ContextualAction {
  id: string;
  title: string;
  description: string;
  action: string;
  target: NavigationTarget;
  relevance: number; // 0-1
  category: 'PRIMARY' | 'SECONDARY' | 'SUGGESTED';
  permissions?: string[];
}

export interface NavigationResolution {
  interpretation: string;
  targets: NavigationTarget[];
  confidence: number; // 0-1
  disambiguationQuestions?: string[];
}

export interface TimeConstraint {
  maxTime: number; // seconds
  urgent: boolean;
  deadline?: Date;
}

export interface NavigationActivity {
  timestamp: Date;
  module: string;
  entityType: EntityType;
  entityId?: EntityId;
  action: string;
  duration: number; // seconds
  successful: boolean;
}

export interface RouteContext {
  context: string;
  value: any;
  relevance: number; // 0-1
}

class CrossModuleNavigation implements CrossModuleNavigationService {
  private navigationHistory: NavigationActivity[] = [];
  private searchIndices: Map<string, ModuleSearchCapability> = new Map();
  private relationshipCache: Map<string, EntityRelationship[]> = new Map();
  private smartRouter: SmartRouter;

  constructor() {
    this.initializeSearchIndices();
    this.smartRouter = new SmartRouterImpl();
  }

  private initializeSearchIndices() {
    // Initialize search capabilities for each module
    const modules = [
      'PortfolioManagement',
      'InvestmentCommittee', 
      'FundOperations',
      'LPGPRelationship',
      'LegalManagement',
      'MarketIntelligence',
      'WorkflowAutomation',
      'KnowledgeManagement',
      'AdminManagement',
      'AdvancedAnalytics'
    ];

    modules.forEach(module => {
      this.searchIndices.set(module, this.createModuleSearchCapability(module));
    });
  }

  private createModuleSearchCapability(module: string): ModuleSearchCapability {
    // Define search capabilities per module
    const baseCapability: ModuleSearchCapability = {
      module,
      supportedEntityTypes: this.getModuleEntityTypes(module),
      searchableFields: this.getModuleSearchableFields(module),
      capabilities: [
        { capability: 'FUZZY_SEARCH', enabled: true },
        { capability: 'SEMANTIC_SEARCH', enabled: true },
        { capability: 'FACETED_SEARCH', enabled: true },
        { capability: 'AUTO_COMPLETE', enabled: true },
        { capability: 'SPELL_CHECK', enabled: true }
      ],
      indexingFrequency: 'REAL_TIME',
      lastIndexed: new Date()
    };

    return baseCapability;
  }

  private getModuleEntityTypes(module: string): EntityType[] {
    const moduleEntityMap: Record<string, EntityType[]> = {
      'PortfolioManagement': ['PORTFOLIO_COMPANY', 'INVESTMENT'],
      'InvestmentCommittee': ['DEAL', 'INVESTMENT'],
      'FundOperations': ['FUND'],
      'LPGPRelationship': ['LP_ORGANIZATION', 'CONTACT'],
      'LegalManagement': ['DOCUMENT'],
      'MarketIntelligence': ['PORTFOLIO_COMPANY'],
      'WorkflowAutomation': ['FUND', 'DEAL', 'DOCUMENT'],
      'KnowledgeManagement': ['DOCUMENT'],
      'AdminManagement': ['USER'],
      'AdvancedAnalytics': ['FUND', 'PORTFOLIO_COMPANY', 'INVESTMENT']
    };

    return moduleEntityMap[module] || [];
  }

  private getModuleSearchableFields(module: string): SearchableField[] {
    // Return module-specific searchable fields
    const commonFields: SearchableField[] = [
      { field: 'name', displayName: 'Name', type: 'TEXT', searchable: true, filterable: true, facetable: false, weight: 1.0 },
      { field: 'description', displayName: 'Description', type: 'TEXT', searchable: true, filterable: false, facetable: false, weight: 0.8 },
      { field: 'createdAt', displayName: 'Created Date', type: 'DATE', searchable: false, filterable: true, facetable: true, weight: 0.3 },
      { field: 'status', displayName: 'Status', type: 'CATEGORY', searchable: false, filterable: true, facetable: true, weight: 0.5 }
    ];

    // Add module-specific fields based on module type
    const moduleSpecificFields: Record<string, SearchableField[]> = {
      'PortfolioManagement': [
        { field: 'sector', displayName: 'Sector', type: 'CATEGORY', searchable: true, filterable: true, facetable: true, weight: 0.9 },
        { field: 'valuation', displayName: 'Valuation', type: 'NUMBER', searchable: false, filterable: true, facetable: false, weight: 0.7 }
      ],
      'FundOperations': [
        { field: 'fundType', displayName: 'Fund Type', type: 'CATEGORY', searchable: true, filterable: true, facetable: true, weight: 0.8 },
        { field: 'vintage', displayName: 'Vintage', type: 'NUMBER', searchable: false, filterable: true, facetable: true, weight: 0.6 }
      ]
    };

    return [...commonFields, ...(moduleSpecificFields[module] || [])];
  }

  async navigateToEntity(entityType: EntityType, entityId: EntityId, context?: DecisionContext): Promise<void> {
    // Track navigation
    const activity: NavigationActivity = {
      timestamp: new Date(),
      module: this.getEntityModule(entityType),
      entityType,
      entityId,
      action: 'NAVIGATE',
      duration: 0,
      successful: true
    };

    this.navigationHistory.push(activity);

    // Get optimal route
    const currentContext: NavigationContext = {
      currentModule: this.getCurrentModule(),
      entityContext: { type: entityType, id: entityId, name: '' },
      decisionContext: context,
      breadcrumbs: []
    };

    const target: NavigationTarget = {
      module: this.getEntityModule(entityType),
      entityType,
      entityId,
      url: this.buildEntityUrl(entityType, entityId)
    };

    const route = this.smartRouter.getOptimalPath(currentContext, target);
    
    // Execute navigation
    await this.executeNavigation(route);
  }

  buildContextualBreadcrumbs(currentPath: string, entityContext?: EntityReference): NavigationBreadcrumb[] {
    const breadcrumbs: NavigationBreadcrumb[] = [];
    const pathSegments = currentPath.split('/').filter(Boolean);

    // Build breadcrumbs from path
    let cumulativePath = '';
    pathSegments.forEach((segment, index) => {
      cumulativePath += `/${segment}`;
      
      breadcrumbs.push({
        module: this.getModuleFromPath(segment),
        label: this.formatBreadcrumbLabel(segment),
        url: cumulativePath,
        entityType: index === pathSegments.length - 1 ? entityContext?.type : undefined,
        entityId: index === pathSegments.length - 1 ? entityContext?.id : undefined
      });
    });

    return breadcrumbs;
  }

  async getRelatedEntities(entityType: EntityType, entityId: EntityId): Promise<EntityRelationship[]> {
    const cacheKey = `${entityType}:${entityId}`;
    
    // Check cache first
    if (this.relationshipCache.has(cacheKey)) {
      return this.relationshipCache.get(cacheKey)!;
    }

    // Get relationships from data sync service
    const relationships = await dataSyncService.getRelatedEntities(entityType, entityId);
    
    // Cache results
    this.relationshipCache.set(cacheKey, relationships);
    
    return relationships;
  }

  async searchAcrossModules(query: UniversalSearchQuery): Promise<UniversalSearchResult> {
    const startTime = performance.now();
    const results: SearchResult[] = [];
    const facets: SearchFacet[] = [];
    const suggestions: SearchSuggestion[] = [];

    // Determine which modules to search
    const targetModules = query.modules || Array.from(this.searchIndices.keys());

    // Execute searches across modules
    const searchPromises = targetModules.map(module => 
      this.searchModule(module, query)
    );

    const moduleResults = await Promise.allSettled(searchPromises);
    
    // Aggregate results
    moduleResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(...result.value.results);
        facets.push(...result.value.facets);
        suggestions.push(...result.value.suggestions);
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply global limit
    const limitedResults = query.limit ? results.slice(0, query.limit) : results;

    // Get related entities if requested
    const relatedEntities: RelatedEntityGroup[] = [];
    if (query.includeRelated && limitedResults.length > 0) {
      // Group related entities
      const relationships = await Promise.all(
        limitedResults.slice(0, 5).map(result =>
          this.getRelatedEntities(result.entityType, result.entityId)
        )
      );

      // Process relationships into groups
      relatedEntities.push(...this.groupRelatedEntities(relationships.flat()));
    }

    const executionTime = performance.now() - startTime;

    // Calculate quality metrics
    const quality: SearchQuality = {
      confidence: this.calculateSearchConfidence(limitedResults),
      completeness: this.calculateSearchCompleteness(limitedResults, query),
      freshness: this.calculateSearchFreshness(limitedResults),
      accuracy: this.calculateSearchAccuracy(limitedResults, query)
    };

    return {
      totalResults: results.length,
      results: limitedResults,
      facets: this.mergeFacets(facets),
      suggestions: this.deduplicateSuggestions(suggestions),
      relatedEntities,
      executionTime,
      quality
    };
  }

  private async searchModule(module: string, query: UniversalSearchQuery): Promise<{
    results: SearchResult[];
    facets: SearchFacet[];
    suggestions: SearchSuggestion[];
  }> {
    const moduleCapability = this.searchIndices.get(module);
    if (!moduleCapability) {
      return { results: [], facets: [], suggestions: [] };
    }

    // Build module-specific query
    const moduleQuery: CrossModuleQuery = {
      id: `search_${Date.now()}_${Math.random()}`,
      requestingModule: 'CrossModuleNavigation',
      targetModules: [module],
      entityType: query.entityTypes?.[0] || 'PORTFOLIO_COMPANY', // Default fallback
      query: {
        filters: this.buildFilters(query.filters, module),
        sort: query.sortBy,
        limit: query.limit
      }
    };

    // Execute search through data sync service
    const moduleData = await dataSyncService.queryData(moduleQuery);

    // Convert to search results
    const results: SearchResult[] = moduleData.data.map((item, index) => ({
      id: `${module}_${item.id}`,
      entityType: this.inferEntityType(item, module),
      entityId: item.id,
      module,
      title: item.name || item.title || 'Untitled',
      description: item.description || item.summary || '',
      relevanceScore: this.calculateRelevance(item, query.query, moduleCapability),
      matchType: this.determineMatchType(item, query.query),
      highlights: this.extractHighlights(item, query.query),
      metadata: {
        module,
        entityType: this.inferEntityType(item, module),
        lastUpdated: new Date(item.updatedAt || Date.now()),
        relevantFields: this.getRelevantFields(item, query.query),
        confidence: 0.8
      }
    }));

    // Generate facets
    const facets = this.generateModuleFacets(moduleData.data, moduleCapability);

    // Generate suggestions
    const suggestions = this.generateSearchSuggestions(query.query, results);

    return { results, facets, suggestions };
  }

  async getSmartSuggestions(currentContext: NavigationContext): Promise<NavigationSuggestion[]> {
    const suggestions: NavigationSuggestion[] = [];

    // Get related entities
    if (currentContext.entityContext) {
      const related = await this.getRelatedEntities(
        currentContext.entityContext.type,
        currentContext.entityContext.id
      );

      related.forEach(relationship => {
        suggestions.push({
          id: `related_${relationship.toEntity.id}`,
          type: 'RELATED_ENTITY',
          title: `View related ${relationship.toEntity.type}`,
          description: `Navigate to ${relationship.relationshipType} entity`,
          target: {
            module: this.getEntityModule(relationship.toEntity.type),
            entityType: relationship.toEntity.type,
            entityId: relationship.toEntity.id,
            url: this.buildEntityUrl(relationship.toEntity.type, relationship.toEntity.id)
          },
          relevance: relationship.strength,
          reasoning: `Related through ${relationship.relationshipType}`,
          category: 'Related Content',
          priority: 'MEDIUM'
        });
      });
    }

    // Get next step suggestions based on current context
    if (currentContext.decisionContext) {
      const nextSteps = await this.getDecisionNextSteps(currentContext.decisionContext);
      suggestions.push(...nextSteps);
    }

    // Get popular destinations based on user behavior
    const popularDestinations = await this.getPopularDestinations(currentContext);
    suggestions.push(...popularDestinations);

    // Sort by relevance and priority
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (priorityOrder[b.priority] * b.relevance) - (priorityOrder[a.priority] * a.relevance);
      })
      .slice(0, 10); // Limit to top 10 suggestions
  }

  trackNavigation(from: string, to: string, context?: DecisionContext): void {
    const activity: NavigationActivity = {
      timestamp: new Date(),
      module: this.getModuleFromPath(to),
      entityType: this.getEntityTypeFromPath(to),
      action: 'NAVIGATE',
      duration: 0, // Would be calculated when navigation completes
      successful: true
    };

    this.navigationHistory.push(activity);

    // Trim history to last 1000 items
    if (this.navigationHistory.length > 1000) {
      this.navigationHistory = this.navigationHistory.slice(-1000);
    }
  }

  async getNavigationInsights(): Promise<NavigationInsights> {
    // Analyze navigation history to extract insights
    const popularPaths = this.analyzePopularPaths();
    const efficientRoutes = this.analyzeEfficientRoutes();
    const userBehaviorPatterns = this.analyzeUserBehavior();
    const contentGaps = this.identifyContentGaps();
    const optimizationOpportunities = this.identifyOptimizationOpportunities();

    return {
      popularPaths,
      efficientRoutes,
      userBehaviorPatterns,
      contentGaps,
      optimizationOpportunities
    };
  }

  // Helper methods
  private getCurrentModule(): string {
    // In a real implementation, this would get the current module from router/context
    return 'PortfolioManagement';
  }

  private getEntityModule(entityType: EntityType): string {
    const entityModuleMap: Record<EntityType, string> = {
      'FUND': 'FundOperations',
      'PORTFOLIO_COMPANY': 'PortfolioManagement',
      'INVESTMENT': 'PortfolioManagement',
      'LP_ORGANIZATION': 'LPGPRelationship',
      'DEAL': 'InvestmentCommittee',
      'DOCUMENT': 'LegalManagement',
      'CONTACT': 'LPGPRelationship',
      'USER': 'AdminManagement'
    };

    return entityModuleMap[entityType] || 'PortfolioManagement';
  }

  private buildEntityUrl(entityType: EntityType, entityId: EntityId): string {
    const module = this.getEntityModule(entityType);
    return `/${module.toLowerCase()}/${entityType.toLowerCase()}/${entityId}`;
  }

  private async executeNavigation(route: NavigationRoute): Promise<void> {
    // In a real implementation, this would execute the navigation steps
    console.log('Executing navigation route:', route);
  }

  private getModuleFromPath(path: string): string {
    return path.split('/')[1] || 'PortfolioManagement';
  }

  private formatBreadcrumbLabel(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private buildFilters(filters?: SearchFilter[], module?: string): Record<string, any> {
    if (!filters) return {};
    
    const moduleFilters: Record<string, any> = {};
    filters.forEach(filter => {
      if (!filter.module || filter.module === module) {
        moduleFilters[filter.field] = filter.value;
      }
    });
    
    return moduleFilters;
  }

  private inferEntityType(item: any, module: string): EntityType {
    // Simple heuristic to infer entity type from module
    const moduleEntityMap: Record<string, EntityType> = {
      'PortfolioManagement': 'PORTFOLIO_COMPANY',
      'FundOperations': 'FUND',
      'LPGPRelationship': 'LP_ORGANIZATION',
      'LegalManagement': 'DOCUMENT',
      'InvestmentCommittee': 'DEAL'
    };

    return moduleEntityMap[module] || 'PORTFOLIO_COMPANY';
  }

  private calculateRelevance(item: any, query: string, capability: ModuleSearchCapability): number {
    // Simplified relevance calculation
    let relevance = 0;
    const queryLower = query.toLowerCase();

    capability.searchableFields.forEach(field => {
      const fieldValue = item[field.field];
      if (fieldValue && typeof fieldValue === 'string') {
        const fieldLower = fieldValue.toLowerCase();
        if (fieldLower.includes(queryLower)) {
          relevance += field.weight;
        }
      }
    });

    return Math.min(relevance, 1.0);
  }

  private determineMatchType(item: any, query: string): 'EXACT' | 'PARTIAL' | 'FUZZY' | 'SEMANTIC' {
    const itemName = (item.name || '').toLowerCase();
    const queryLower = query.toLowerCase();

    if (itemName === queryLower) return 'EXACT';
    if (itemName.includes(queryLower)) return 'PARTIAL';
    if (this.fuzzyMatch(itemName, queryLower)) return 'FUZZY';
    return 'SEMANTIC';
  }

  private fuzzyMatch(text: string, pattern: string): boolean {
    // Simple fuzzy matching implementation
    const threshold = 0.8;
    const similarity = this.calculateSimilarity(text, pattern);
    return similarity >= threshold;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
    const matrix = Array.from({ length: str1.length + 1 }, () => 
      Array.from({ length: str2.length + 1 }, () => 0)
    );

    for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 1 : (maxLen - matrix[str1.length][str2.length]) / maxLen;
  }

  private extractHighlights(item: any, query: string): SearchHighlight[] {
    const highlights: SearchHighlight[] = [];
    const queryLower = query.toLowerCase();

    ['name', 'description'].forEach(field => {
      const fieldValue = item[field];
      if (fieldValue && typeof fieldValue === 'string') {
        const index = fieldValue.toLowerCase().indexOf(queryLower);
        if (index !== -1) {
          const start = Math.max(0, index - 20);
          const end = Math.min(fieldValue.length, index + queryLower.length + 20);
          const fragment = fieldValue.substring(start, end);
          highlights.push({
            field,
            fragments: [fragment]
          });
        }
      }
    });

    return highlights;
  }

  private getRelevantFields(item: any, query: string): string[] {
    const relevantFields: string[] = [];
    const queryLower = query.toLowerCase();

    Object.keys(item).forEach(field => {
      const value = item[field];
      if (value && typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
        relevantFields.push(field);
      }
    });

    return relevantFields;
  }

  private generateModuleFacets(data: any[], capability: ModuleSearchCapability): SearchFacet[] {
    const facets: SearchFacet[] = [];

    capability.searchableFields
      .filter(field => field.facetable)
      .forEach(field => {
        const values = new Map<string, number>();
        data.forEach(item => {
          const value = item[field.field];
          if (value) {
            const stringValue = String(value);
            values.set(stringValue, (values.get(stringValue) || 0) + 1);
          }
        });

        if (values.size > 0) {
          facets.push({
            field: field.field,
            displayName: field.displayName,
            values: Array.from(values.entries()).map(([value, count]) => ({
              value,
              count,
              selected: false
            }))
          });
        }
      });

    return facets;
  }

  private generateSearchSuggestions(query: string, results: SearchResult[]): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];

    // Generate completion suggestions
    if (query.length > 2) {
      const completions = this.generateCompletions(query, results);
      suggestions.push(...completions);
    }

    return suggestions;
  }

  private generateCompletions(query: string, results: SearchResult[]): SearchSuggestion[] {
    const completions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Extract potential completions from result titles
    results.forEach(result => {
      if (result.title.toLowerCase().startsWith(queryLower) && result.title.length > query.length) {
        completions.push({
          text: result.title,
          type: 'COMPLETION',
          confidence: result.relevanceScore
        });
      }
    });

    return completions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private groupRelatedEntities(relationships: EntityRelationship[]): RelatedEntityGroup[] {
    const groups = new Map<string, EntityReference[]>();

    relationships.forEach(rel => {
      if (!groups.has(rel.relationshipType)) {
        groups.set(rel.relationshipType, []);
      }
      groups.get(rel.relationshipType)!.push({
        type: rel.toEntity.type,
        id: rel.toEntity.id,
        name: rel.toEntity.id, // Would be resolved to actual name
        relevance: 'HIGH'
      });
    });

    return Array.from(groups.entries()).map(([relationship, entities]) => ({
      relationship,
      entities
    }));
  }

  private mergeFacets(facets: SearchFacet[]): SearchFacet[] {
    const mergedFacets = new Map<string, SearchFacet>();

    facets.forEach(facet => {
      if (!mergedFacets.has(facet.field)) {
        mergedFacets.set(facet.field, { ...facet, values: [] });
      }
      
      const merged = mergedFacets.get(facet.field)!;
      facet.values.forEach(value => {
        const existing = merged.values.find(v => v.value === value.value);
        if (existing) {
          existing.count += value.count;
        } else {
          merged.values.push(value);
        }
      });
    });

    return Array.from(mergedFacets.values());
  }

  private deduplicateSuggestions(suggestions: SearchSuggestion[]): SearchSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter(suggestion => {
      if (seen.has(suggestion.text)) {
        return false;
      }
      seen.add(suggestion.text);
      return true;
    });
  }

  private calculateSearchConfidence(results: SearchResult[]): number {
    if (results.length === 0) return 0;
    return results.reduce((sum, result) => sum + result.relevanceScore, 0) / results.length;
  }

  private calculateSearchCompleteness(results: SearchResult[], query: UniversalSearchQuery): number {
    // Simplified completeness calculation
    return Math.min(results.length / (query.limit || 50), 1.0);
  }

  private calculateSearchFreshness(results: SearchResult[]): number {
    if (results.length === 0) return 0;
    
    const now = Date.now();
    const avgAge = results.reduce((sum, result) => {
      const age = now - result.metadata.lastUpdated.getTime();
      return sum + age;
    }, 0) / results.length;

    // Convert to freshness score (higher is better)
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    return Math.max(0, 1 - (avgAge / maxAge));
  }

  private calculateSearchAccuracy(results: SearchResult[], query: UniversalSearchQuery): number {
    // Simplified accuracy based on relevance scores
    return this.calculateSearchConfidence(results);
  }

  private getEntityTypeFromPath(path: string): EntityType {
    const segments = path.split('/');
    // Simplified entity type extraction
    if (segments.includes('portfolio')) return 'PORTFOLIO_COMPANY';
    if (segments.includes('fund')) return 'FUND';
    if (segments.includes('lp')) return 'LP_ORGANIZATION';
    return 'PORTFOLIO_COMPANY';
  }

  private async getDecisionNextSteps(context: DecisionContext): Promise<NavigationSuggestion[]> {
    // Mock implementation - would analyze decision context to suggest next steps
    return [];
  }

  private async getPopularDestinations(context: NavigationContext): Promise<NavigationSuggestion[]> {
    // Mock implementation - would analyze user behavior to suggest popular destinations
    return [];
  }

  // Analytics methods
  private analyzePopularPaths(): NavigationPath[] {
    // Analyze navigation history to find popular paths
    return [];
  }

  private analyzeEfficientRoutes(): EfficientRoute[] {
    // Analyze navigation patterns to identify efficient routes
    return [];
  }

  private analyzeUserBehavior(): UserBehaviorPattern[] {
    // Analyze user behavior patterns from navigation history
    return [];
  }

  private identifyContentGaps(): ContentGap[] {
    // Identify areas where users frequently search but don't find results
    return [];
  }

  private identifyOptimizationOpportunities(): NavigationOptimization[] {
    // Identify opportunities to optimize navigation flows
    return [];
  }
}

// Smart Router Implementation
class SmartRouterImpl implements SmartRouter {
  getOptimalPath(from: NavigationContext, to: NavigationTarget, preferences?: NavigationPreferences): NavigationRoute {
    // Simplified route calculation
    const steps: NavigationStep[] = [{
      module: to.module,
      action: 'navigate',
      description: `Navigate to ${to.entityType}`,
      url: to.url,
      estimatedTime: 2,
      required: true
    }];

    return {
      steps,
      estimatedTime: 2,
      complexity: 'SIMPLE',
      alternatives: [],
      contextualInfo: []
    };
  }

  predictNextDestination(currentContext: NavigationContext, userProfile?: UserProfile): NavigationPrediction[] {
    // Mock predictions based on context
    return [];
  }

  getContextualActions(entityType: EntityType, entityId: EntityId): ContextualAction[] {
    // Mock contextual actions
    return [];
  }

  resolveAmbiguousNavigation(query: string, context: NavigationContext): NavigationResolution[] {
    // Mock resolution of ambiguous navigation queries
    return [];
  }
}

// Export singleton instance
export const crossModuleNavigation = new CrossModuleNavigation();

// Export types for use by components
export type {
  UniversalSearchQuery,
  UniversalSearchResult,
  NavigationSuggestion,
  NavigationInsights,
  SearchResult
};