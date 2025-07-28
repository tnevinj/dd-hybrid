/**
 * Assistant Types for DD-Hybrid
 * 
 * Enhanced TypeScript interfaces for the AI assistant
 * with hybrid navigation mode support.
 */

/**
 * Message sender type
 */
export enum MessageSender {
  USER = 'user',
  ASSISTANT = 'assistant',
}

/**
 * Assistant avatar expression - Enhanced for DD-Hybrid
 */
export enum AvatarExpression {
  NEUTRAL = 'neutral',
  DEFAULT = 'default',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  HAPPY = 'happy',
  EXPLAINING = 'explaining',
  APOLOGETIC = 'apologetic',
  EXCITED = 'excited',
  CONCERNED = 'concerned'
}

/**
 * Message content type enum
 */
export enum MessageContentType {
  TEXT = 'text',
  CHART = 'chart',
  TABLE = 'table',
  IMAGE = 'image',
  FILE = 'file',
  DOCUMENT = 'document',
  SPREADSHEET = 'spreadsheet',
  PDF = 'pdf',
  MULTI_MODAL = 'multi_modal'
}

/**
 * Navigation modes for hybrid system
 */
export type NavigationMode = 'traditional' | 'assisted' | 'autonomous';

/**
 * Avatar expression type - Enhanced for DD-Hybrid
 */
export type AvatarExpressionType = 'default' | 'thinking' | 'speaking' | 'listening' | 'neutral' | 'apologetic';

/**
 * Chart data interface
 */
export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
  }>;
}

/**
 * Table data interface
 */
export interface TableData {
  headers: string[];
  rows: Array<string[]>;
}

/**
 * File data interface
 */
export interface FileData {
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  fileId?: string;
  fileContent?: string | ArrayBuffer;
  thumbnailUrl?: string;
  extractedText?: string;
  metadata?: Record<string, any>;
}

/**
 * Image data interface
 */
export interface ImageData {
  imageUrl?: string;
  imageId?: string;
  alt?: string;
  width?: number;
  height?: number;
  base64Data?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Multi-modal content segment
 */
export interface ContentSegment {
  type: 'text' | 'image' | 'file';
  text?: string;
  imageData?: ImageData;
  fileData?: FileData;
}

/**
 * Message interface - Enhanced for DD-Hybrid
 */
export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  contentType: MessageContentType;
  chartData?: ChartData;
  tableData?: TableData;
  fileData?: FileData;
  imageData?: ImageData;
  segments?: ContentSegment[];
  confidence?: number;
  aiGenerated?: boolean;
  navigationMode?: NavigationMode;
  metadata?: Record<string, any>;
}

/**
 * Suggestion interface
 */
export interface Suggestion {
  id: string;
  text: string;
  category?: string;
  action?: string;
  priority?: number;
  aiGenerated?: boolean;
  navigationMode?: NavigationMode;
  metadata?: Record<string, any>;
}

/**
 * User preferences interface - Enhanced for DD-Hybrid
 */
export interface UserPreferences {
  preferredChartType: 'bar' | 'line' | 'pie';
  favoriteMetrics: string[];
  dataFormat: 'table' | 'chart' | 'summary';
  theme: 'light' | 'dark' | 'auto';
  notificationFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  responseDetailLevel: 'concise' | 'detailed';
  navigationMode?: NavigationMode;
  aiCapabilities?: {
    proactiveInsights: boolean;
    automaticAnalysis: boolean;
    smartSuggestions: boolean;
    contextualRecommendations: boolean;
    realTimeAlerts: boolean;
  };
  lastUpdated: string;
}

/**
 * Assistant context interface - Enhanced for DD-Hybrid
 */
export interface AssistantContext {
  page: string;
  visibleElements?: string[];
  userPreferences?: UserPreferences;
  navigationMode?: NavigationMode;
  platformData?: {
    currentPortfolio?: {
      id: string;
      name: string;
      metrics: Record<string, any>;
      allocation: Record<string, any>;
      performance: Record<string, any>;
    };
    dealId?: string;
    workspaceId?: string;
    userId?: string;
    userRole?: string;
    organizationId?: string;
  };
  aiContext?: {
    conversationHistory?: Message[];
    userIntent?: string;
    contextualEntities?: string[];
    activeAnalysis?: string[];
  };
}

/**
 * AI Capabilities interface
 */
export interface AICapabilities {
  proactiveInsights: boolean;
  automaticAnalysis: boolean;
  smartSuggestions: boolean;
  contextualRecommendations: boolean;
  realTimeAlerts: boolean;
}

/**
 * Recommendation interface
 */
export interface Recommendation {
  id: string;
  type: 'opportunity' | 'warning' | 'insight' | 'action';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  priority: number;
  category?: string;
  actionable: boolean;
  aiGenerated: boolean;
  navigationMode?: NavigationMode;
  metadata?: Record<string, any>;
}

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  aiGenerated: boolean;
  navigationMode?: NavigationMode;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Export type alias for backward compatibility
 */
export type AvatarExpression = AvatarExpressionType;