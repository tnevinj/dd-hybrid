export { WorkspaceService } from './workspace-service';
export { WorkProductService } from './work-product-service';
export { TemplateService } from './template-service';
export { PortfolioService, PortfolioAssetService } from './portfolio-service';
export { DealOpportunityService, DealScreeningTemplateService, DealScoreService } from './deal-screening-service';

export type { 
  Workspace, 
  CreateWorkspaceData 
} from './workspace-service';

export type { 
  DatabaseWorkProduct, 
  CreateWorkProductData 
} from './work-product-service';

export type { 
  DatabaseTemplate, 
  CreateTemplateData 
} from './template-service';

export type { 
  Portfolio, 
  PortfolioAsset,
  CreatePortfolioData,
  CreateAssetData 
} from './portfolio-service';

export type { 
  DealOpportunity, 
  DealScreeningTemplate,
  DealScore,
  CreateOpportunityData,
  CreateTemplateData 
} from './deal-screening-service';