// Knowledge Management Type Definitions

export type NavigationMode = 'traditional' | 'assisted' | 'autonomous';

// Article Types
export type ArticleCategory = 
  | 'INVESTMENT_STRATEGY' 
  | 'MARKET_ANALYSIS' 
  | 'PORTFOLIO_MANAGEMENT' 
  | 'DUE_DILIGENCE' 
  | 'REGULATORY' 
  | 'OPERATIONAL' 
  | 'TECHNOLOGY';

export type ArticleType = 
  | 'ARTICLE' 
  | 'CASE_STUDY' 
  | 'BEST_PRACTICE' 
  | 'LESSON_LEARNED' 
  | 'RESEARCH' 
  | 'TEMPLATE' 
  | 'PLAYBOOK';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type Importance = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'PEER_REVIEWED' 
  | 'EXPERT_VERIFIED' 
  | 'OUTDATED';

export type ArticleStatus = 
  | 'DRAFT' 
  | 'REVIEW' 
  | 'PUBLISHED' 
  | 'ARCHIVED' 
  | 'DEPRECATED';

export type Visibility = 'PUBLIC' | 'INTERNAL' | 'TEAM' | 'PRIVATE' | 'CONFIDENTIAL';

export type AccessLevel = 
  | 'ALL' 
  | 'GP_ONLY' 
  | 'IC_ONLY' 
  | 'SENIOR_ONLY' 
  | 'RESTRICTED';

// Comment Types
export type CommentType = 
  | 'COMMENT' 
  | 'QUESTION' 
  | 'SUGGESTION' 
  | 'CORRECTION' 
  | 'CLARIFICATION';

export type CommentStatus = 'ACTIVE' | 'HIDDEN' | 'RESOLVED' | 'FLAGGED';

// Pattern Types
export type PatternType = 
  | 'CONTENT_PATTERN' 
  | 'USAGE_PATTERN' 
  | 'TREND_PATTERN' 
  | 'CORRELATION_PATTERN';

export type PatternStrength = 'WEAK' | 'MEDIUM' | 'STRONG' | 'VERY_STRONG';

export type PatternDetector = 'SYSTEM' | 'USER' | 'ANALYST';

// Analytics Types
export type AnalyticsEventType = 
  | 'VIEW' 
  | 'DOWNLOAD' 
  | 'SHARE' 
  | 'LIKE' 
  | 'COMMENT' 
  | 'SEARCH_RESULT' 
  | 'BOOKMARK';

// Learning Path Types
export type PathType = 
  | 'ONBOARDING' 
  | 'SKILL_DEVELOPMENT' 
  | 'CERTIFICATION' 
  | 'ROLE_SPECIFIC' 
  | 'CUSTOM';

export type TargetRole = 'ANALYST' | 'ASSOCIATE' | 'VP' | 'DIRECTOR' | 'PARTNER';

export type PathStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type EnrollmentStatus = 
  | 'ENROLLED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'PAUSED' 
  | 'DROPPED';

// Recommendation Types
export type RecommendationType = 
  | 'COLLABORATIVE' 
  | 'CONTENT_BASED' 
  | 'HYBRID' 
  | 'TRENDING' 
  | 'EXPERT_CURATED';

// Interfaces
export interface Source {
  id: string;
  name: string;
  url?: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'RESEARCH' | 'NEWS' | 'DOCUMENT';
  credibility: number; // 0-1 scale
  lastVerified?: Date;
}

export interface Reference {
  id: string;
  title: string;
  authors?: string[];
  publication?: string;
  publishDate?: Date;
  url?: string;
  doi?: string;
  type: 'ACADEMIC' | 'NEWS' | 'REPORT' | 'BOOK' | 'WEBSITE' | 'INTERNAL';
}

export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  weight: number; // Relevance weight 0-1
  confidence: number; // Classification confidence 0-1
}

export interface ExpertiseArea {
  domain: string;
  level: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsExperience?: number;
  certifications?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear?: number;
  fieldOfStudy?: string;
}

export interface Publication {
  title: string;
  journal?: string;
  publishDate: Date;
  coAuthors?: string[];
  url?: string;
  citations?: number;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description?: string;
  articleIds: string[];
  estimatedHours?: number;
  order: number;
  isRequired: boolean;
  prerequisites?: string[];
}

export interface PatternInsight {
  id: string;
  insight: string;
  confidence: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: string[];
  actionable: boolean;
}

export interface PatternRecommendation {
  id: string;
  recommendation: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedValue: string;
  timeline?: string;
}

// Main Entity Interfaces
export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: ArticleCategory;
  subcategory?: string;
  articleType: ArticleType;
  readingTime?: number;
  difficulty: Difficulty;
  language: string;
  tags: string[];
  keywords?: string[];
  topics?: Topic[];
  importance: Importance;
  confidence: number;
  verificationStatus: VerificationStatus;
  parentId?: string;
  relatedArticles?: string[];
  prerequisites?: string[];
  sources?: Source[];
  references?: Reference[];
  attachments?: Attachment[];
  status: ArticleStatus;
  publishedAt?: Date;
  lastReviewedAt?: Date;
  nextReviewDue?: Date;
  archivedAt?: Date;
  viewCount: number;
  likeCount: number;
  downloadCount: number;
  shareCount: number;
  visibility: Visibility;
  accessLevel: AccessLevel;
  authorId: string;
  contributorIds?: string[];
  reviewerId?: string;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  ratingCount?: number;
  comments?: KnowledgeComment[];
  ratings?: KnowledgeRating[];
  analytics?: KnowledgeAnalytics[];
  patterns?: KnowledgePattern[];
}

export interface KnowledgeComment {
  id: string;
  articleId: string;
  parentId?: string;
  content: string;
  commentType: CommentType;
  status: CommentStatus;
  isInternal: boolean;
  likeCount: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: KnowledgeComment[];
  parent?: KnowledgeComment;
}

export interface KnowledgeRating {
  id: string;
  articleId: string;
  userId: string;
  rating: number;
  review?: string;
  accuracy?: number;
  usefulness?: number;
  clarity?: number;
  completeness?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeAnalytics {
  id: string;
  articleId: string;
  userId?: string;
  eventType: AnalyticsEventType;
  eventData?: any;
  sessionId?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timeSpent?: number;
  scrollDepth?: number;
  timestamp: Date;
}

export interface KnowledgePattern {
  id: string;
  name: string;
  description?: string;
  patternType: PatternType;
  pattern: any;
  confidence: number;
  strength: PatternStrength;
  articleIds?: string[];
  categories?: string[];
  timeframe?: string;
  detectedAt: Date;
  detectedBy: PatternDetector;
  algorithm?: string;
  isValidated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  insights?: PatternInsight[];
  recommendations?: PatternRecommendation[];
  businessValue?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeSearch {
  id: string;
  query: string;
  userId?: string;
  sessionId?: string;
  filters?: any;
  sortBy?: string;
  category?: string;
  resultCount: number;
  clickedResults?: string[];
  selectedResult?: string;
  responseTime?: number;
  relevanceScore?: number;
  refinedQuery?: string;
  abandoned: boolean;
  timestamp: Date;
}

export interface ExpertProfile {
  id: string;
  userId: string;
  expertiseAreas: ExpertiseArea[];
  specializations?: string[];
  industries?: string[];
  yearsExperience?: number;
  education?: Education[];
  certifications?: string[];
  publications?: Publication[];
  articlesAuthored: number;
  articlesReviewed: number;
  commentsPosted: number;
  peerRating?: number;
  isAvailable: boolean;
  availableHours?: any;
  responseTime?: string;
  preferredContact?: string;
  timezone?: string;
  bio?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  pathType: PathType;
  targetRole?: TargetRole;
  difficulty: Difficulty;
  modules: ModuleDefinition[];
  prerequisites?: string[];
  estimatedHours?: number;
  completionRate?: number;
  averageRating?: number;
  enrollmentCount: number;
  status: PathStatus;
  tags?: string[];
  category?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  enrollments?: LearningEnrollment[];
}

export interface LearningEnrollment {
  id: string;
  pathId: string;
  userId: string;
  currentModule: number;
  completedModules: string[];
  progress: number;
  enrolledAt: Date;
  startedAt?: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  timeSpent: number;
  rating?: number;
  feedback?: string;
  status: EnrollmentStatus;
  path?: LearningPath;
}

export interface KnowledgeRecommendation {
  id: string;
  userId: string;
  articleId: string;
  recommendationType: RecommendationType;
  algorithm?: string;
  confidence: number;
  trigger?: string;
  context?: any;
  presented: boolean;
  presentedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  rating?: number;
  reason?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  article?: KnowledgeArticle;
}

// Dashboard and UI Types
export interface KnowledgeStats {
  totalArticles: number;
  publishedArticles: number;
  expertProfiles: number;
  learningPaths: number;
  activeEnrollments: number;
  totalViews: number;
  searchQueries: number;
  patterns: number;
}

export interface PopularArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  viewCount: number;
  averageRating: number;
  readingTime?: number;
  publishedAt?: Date;
  trend: 'RISING' | 'STABLE' | 'DECLINING';
}

export interface RecentActivity {
  id: string;
  type: 'ARTICLE_PUBLISHED' | 'COMMENT_ADDED' | 'PATTERN_DETECTED' | 'PATH_COMPLETED';
  description: string;
  userName?: string;
  timestamp: Date;
  articleId?: string;
  articleTitle?: string;
}

export interface CategoryMetrics {
  category: ArticleCategory;
  articleCount: number;
  viewCount: number;
  averageRating: number;
  expertCount: number;
  trending: boolean;
}

export interface SearchTrend {
  query: string;
  searchCount: number;
  successRate: number; // Percentage of searches that led to article clicks
  trend: 'UP' | 'DOWN' | 'STABLE';
  relatedCategories: ArticleCategory[];
}

export interface ExpertSummary {
  id: string;
  userId: string;
  name: string;
  primaryExpertise: string;
  articlesAuthored: number;
  averageRating: number;
  responseTime?: string;
  isAvailable: boolean;
  profilePicture?: string;
}

export interface LearningProgress {
  pathId: string;
  pathTitle: string;
  enrolledUsers: number;
  completedUsers: number;
  averageCompletionTime: number; // in hours
  averageRating: number;
  dropoutRate: number; // percentage
}

// Hybrid Mode Specific Types
export interface HybridModeContent {
  traditional: {
    showAllArticles: boolean;
    enableManualCuration: boolean;
    showDetailedMetrics: boolean;
    advancedSearch: boolean;
  };
  assisted: {
    showRecommendations: boolean;
    highlightTrending: boolean;
    smartSearch: boolean;
    autoTagging: boolean;
    relatedContent: boolean;
  };
  autonomous: {
    autoRecommendations: boolean;
    patternDetection: boolean;
    contentCuration: boolean;
    intelligentRouting: boolean;
    adaptiveLearning: boolean;
    predictiveAnalytics: boolean;
  };
}

// API Response Types
export interface KnowledgeManagementResponse {
  stats: KnowledgeStats;
  articles: KnowledgeArticle[];
  popularArticles: PopularArticle[];
  recentActivity: RecentActivity[];
  categoryMetrics: CategoryMetrics[];
  searchTrends: SearchTrend[];
  experts: ExpertSummary[];
  learningPaths: LearningPath[];
  learningProgress: LearningProgress[];
  patterns: KnowledgePattern[];
  recommendations: KnowledgeRecommendation[];
}

// Filter and Search Types
export interface ArticleFilter {
  categories?: ArticleCategory[];
  articleTypes?: ArticleType[];
  difficulty?: Difficulty[];
  status?: ArticleStatus[];
  importance?: Importance[];
  verificationStatus?: VerificationStatus[];
  dateRange?: {
    start: Date;
    end: Date;
    field: 'createdAt' | 'updatedAt' | 'publishedAt';
  };
  authorIds?: string[];
  tags?: string[];
  minRating?: number;
  hasAttachments?: boolean;
}

export interface ExpertFilter {
  expertiseAreas?: string[];
  industries?: string[];
  yearsExperience?: {
    min?: number;
    max?: number;
  };
  availability?: boolean;
  minRating?: number;
  responseTime?: string[];
}

export interface LearningPathFilter {
  pathTypes?: PathType[];
  targetRoles?: TargetRole[];
  difficulty?: Difficulty[];
  status?: PathStatus[];
  estimatedHours?: {
    min?: number;
    max?: number;
  };
  categories?: string[];
}

export interface SearchOptions {
  query?: string;
  articleFilters?: ArticleFilter;
  expertFilters?: ExpertFilter;
  pathFilters?: LearningPathFilter;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  includeContent?: boolean;
  includeAnalytics?: boolean;
}

// Component Props
export interface KnowledgeManagementDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export interface ArticleListProps {
  articles: KnowledgeArticle[];
  onArticleSelect: (article: KnowledgeArticle) => void;
  navigationMode: NavigationMode;
  filters?: ArticleFilter;
}

export interface ExpertDirectoryProps {
  experts: ExpertSummary[];
  onExpertSelect: (expert: ExpertSummary) => void;
  navigationMode: NavigationMode;
  filters?: ExpertFilter;
}

export interface LearningPathsProps {
  paths: LearningPath[];
  progress: LearningProgress[];
  onPathSelect: (path: LearningPath) => void;
  navigationMode: NavigationMode;
}

export interface PatternAnalysisProps {
  patterns: KnowledgePattern[];
  onPatternSelect: (pattern: KnowledgePattern) => void;
  navigationMode: NavigationMode;
}

export interface RecommendationEngineProps {
  recommendations: KnowledgeRecommendation[];
  onRecommendationAction: (id: string, action: 'accept' | 'reject' | 'bookmark') => void;
  navigationMode: NavigationMode;
}