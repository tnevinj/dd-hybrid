// Standardized API response types for content generation

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  validationErrors?: ValidationError[];
}

// Content Generation Specific Types
export interface ContentGenerationResponse {
  content: string;
  quality: number;
  wordCount: number;
  generatedAt: string;
  sectionId: string;
  metadata?: {
    generationTime?: number;
    tokensUsed?: number;
    model?: string;
    temperature?: number;
  };
}

export interface BulkContentGenerationResponse {
  workProduct: {
    id: string;
    title: string;
    type: string;
    sections: Array<{
      id: string;
      title: string;
      content: string;
      quality: number;
      wordCount: number;
      type: string;
    }>;
    metadata: any;
    wordCount: number;
    readingTime: number;
  };
  generationMetrics: {
    totalSections: number;
    successfulSections: number;
    failedSections: number;
    averageQuality: number;
    totalGenerationTime: number;
    qualityScore: number;
  };
  suggestions?: Array<{
    type: string;
    message: string;
    confidence: number;
  }>;
}

// Helper functions for standardized responses
export const createSuccessResponse = <T>(
  data: T, 
  message?: string, 
  requestId?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
  requestId
});

export const createErrorResponse = (
  error: string | ApiError, 
  requestId?: string
): ApiResponse => ({
  success: false,
  error: typeof error === 'string' ? error : error.message,
  timestamp: new Date().toISOString(),
  requestId
});

export const createValidationErrorResponse = (
  validationErrors: ValidationError[], 
  requestId?: string
): ApiResponse => ({
  success: false,
  error: 'Validation failed',
  data: { validationErrors },
  timestamp: new Date().toISOString(),
  requestId
});

// Response validators
export const isSuccessResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } => {
  return response.success === true && response.data !== undefined;
};

export const isErrorResponse = (response: ApiResponse): response is ApiResponse & { success: false; error: string } => {
  return response.success === false && response.error !== undefined;
};

// Content generation specific helpers
export const validateContentGenerationResponse = (
  response: any
): response is ApiResponse<ContentGenerationResponse> => {
  return (
    isSuccessResponse(response) &&
    typeof response.data.content === 'string' &&
    typeof response.data.quality === 'number' &&
    typeof response.data.wordCount === 'number' &&
    typeof response.data.sectionId === 'string'
  );
};

export const validateBulkGenerationResponse = (
  response: any
): response is ApiResponse<BulkContentGenerationResponse> => {
  return (
    isSuccessResponse(response) &&
    response.data.workProduct &&
    response.data.generationMetrics &&
    Array.isArray(response.data.workProduct.sections)
  );
};

// Error codes for content generation
export enum ContentGenerationErrorCodes {
  INVALID_SECTION_ID = 'INVALID_SECTION_ID',
  MISSING_PROJECT_CONTEXT = 'MISSING_PROJECT_CONTEXT',
  GENERATION_FAILED = 'GENERATION_FAILED',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  INSUFFICIENT_CONTEXT = 'INSUFFICIENT_CONTEXT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CONTENT_TOO_LONG = 'CONTENT_TOO_LONG',
  QUALITY_THRESHOLD_NOT_MET = 'QUALITY_THRESHOLD_NOT_MET'
}