import Database from 'better-sqlite3';
import path from 'path';

// Create database connection - same as in database.ts
const dbPath = path.join(process.cwd(), 'dd-hybrid.db');
const db = new Database(dbPath);

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  asset_types: string[];
  total_value: number; // in cents
  total_invested: number; // in cents
  total_realized: number; // in cents
  unrealized_value: number; // in cents
  irr: number;
  moic: number;
  total_return: number;
  allocation_targets: Record<string, number>;
  risk_profile: 'low' | 'medium' | 'high';
  manager_id: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioAsset {
  id: string;
  portfolio_id: string;
  name: string;
  asset_type: 'traditional' | 'real_estate' | 'infrastructure';
  description?: string;
  acquisition_date: string;
  acquisition_value: number; // in cents
  current_value: number; // in cents
  location_country?: string;
  location_region?: string;
  location_city?: string;
  irr: number;
  moic: number;
  total_return: number;
  environmental_score?: number;
  social_score?: number;
  governance_score?: number;
  overall_esg_score?: number;
  jobs_created?: number;
  carbon_footprint?: number;
  sustainability_certifications?: string[];
  status: 'active' | 'divested' | 'pending';
  risk_rating: 'low' | 'medium' | 'high';
  sector?: string;
  tags?: string[];
  specific_metrics?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreatePortfolioData {
  name: string;
  description?: string;
  asset_types: string[];
  allocation_targets?: Record<string, number>;
  risk_profile?: 'low' | 'medium' | 'high';
  manager_id: string;
}

export interface CreateAssetData {
  portfolio_id: string;
  name: string;
  asset_type: 'traditional' | 'real_estate' | 'infrastructure';
  description?: string;
  acquisition_date: string;
  acquisition_value: number;
  current_value: number;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  sector?: string;
  tags?: string[];
  risk_rating?: 'low' | 'medium' | 'high';
  specific_metrics?: Record<string, any>;
}

export class PortfolioService {
  static getAll(): Portfolio[] {
    const stmt = db.prepare('SELECT * FROM portfolios ORDER BY created_at DESC');
    const portfolios = stmt.all() as Portfolio[];
    
    return portfolios.map(portfolio => ({
      ...portfolio,
      asset_types: JSON.parse(portfolio.asset_types as any),
      allocation_targets: JSON.parse(portfolio.allocation_targets as any)
    }));
  }

  static getById(id: string): Portfolio | null {
    const stmt = db.prepare('SELECT * FROM portfolios WHERE id = ?');
    const portfolio = stmt.get(id) as Portfolio | undefined;
    
    if (!portfolio) return null;
    
    return {
      ...portfolio,
      asset_types: JSON.parse(portfolio.asset_types as any),
      allocation_targets: JSON.parse(portfolio.allocation_targets as any)
    };
  }

  static getByManagerId(managerId: string): Portfolio[] {
    const stmt = db.prepare('SELECT * FROM portfolios WHERE manager_id = ? ORDER BY created_at DESC');
    const portfolios = stmt.all(managerId) as Portfolio[];
    
    return portfolios.map(portfolio => ({
      ...portfolio,
      asset_types: JSON.parse(portfolio.asset_types as any),
      allocation_targets: JSON.parse(portfolio.allocation_targets as any)
    }));
  }

  static create(data: CreatePortfolioData): Portfolio {
    const id = `portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO portfolios (
        id, name, description, asset_types, allocation_targets, 
        risk_profile, manager_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      data.description || null,
      JSON.stringify(data.asset_types),
      JSON.stringify(data.allocation_targets || {}),
      data.risk_profile || 'medium',
      data.manager_id,
      now,
      now
    );
    
    return this.getById(id)!;
  }

  static update(id: string, updates: Partial<Portfolio>): Portfolio | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'asset_types' || key === 'allocation_targets') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = ?');
    values.push(now, id);
    
    const stmt = db.prepare(`UPDATE portfolios SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM portfolios WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static recalculateMetrics(portfolioId: string): Portfolio | null {
    const portfolio = this.getById(portfolioId);
    if (!portfolio) return null;
    
    const assets = PortfolioAssetService.getByPortfolioId(portfolioId);
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.current_value, 0);
    const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisition_value, 0);
    const unrealizedValue = totalValue - totalInvested;
    
    // Calculate weighted averages for performance metrics
    const weightedIRR = assets.reduce((sum, asset) => sum + (asset.irr * asset.current_value), 0) / (totalValue || 1);
    const weightedMOIC = assets.reduce((sum, asset) => sum + (asset.moic * asset.current_value), 0) / (totalValue || 1);
    const totalReturn = totalInvested > 0 ? (totalValue - totalInvested) / totalInvested : 0;
    
    return this.update(portfolioId, {
      total_value: totalValue,
      total_invested: totalInvested,
      unrealized_value: unrealizedValue,
      irr: weightedIRR,
      moic: weightedMOIC,
      total_return: totalReturn
    });
  }
}

export class PortfolioAssetService {
  static getAll(): PortfolioAsset[] {
    const stmt = db.prepare('SELECT * FROM portfolio_assets ORDER BY created_at DESC');
    const assets = stmt.all() as PortfolioAsset[];
    
    return assets.map(asset => ({
      ...asset,
      tags: asset.tags ? JSON.parse(asset.tags as any) : [],
      sustainability_certifications: asset.sustainability_certifications ? 
        JSON.parse(asset.sustainability_certifications as any) : [],
      specific_metrics: asset.specific_metrics ? JSON.parse(asset.specific_metrics as any) : {}
    }));
  }

  static getById(id: string): PortfolioAsset | null {
    const stmt = db.prepare('SELECT * FROM portfolio_assets WHERE id = ?');
    const asset = stmt.get(id) as PortfolioAsset | undefined;
    
    if (!asset) return null;
    
    return {
      ...asset,
      tags: asset.tags ? JSON.parse(asset.tags as any) : [],
      sustainability_certifications: asset.sustainability_certifications ? 
        JSON.parse(asset.sustainability_certifications as any) : [],
      specific_metrics: asset.specific_metrics ? JSON.parse(asset.specific_metrics as any) : {}
    };
  }

  static getByPortfolioId(portfolioId: string): PortfolioAsset[] {
    const stmt = db.prepare('SELECT * FROM portfolio_assets WHERE portfolio_id = ? ORDER BY created_at DESC');
    const assets = stmt.all(portfolioId) as PortfolioAsset[];
    
    return assets.map(asset => ({
      ...asset,
      tags: asset.tags ? JSON.parse(asset.tags as any) : [],
      sustainability_certifications: asset.sustainability_certifications ? 
        JSON.parse(asset.sustainability_certifications as any) : [],
      specific_metrics: asset.specific_metrics ? JSON.parse(asset.specific_metrics as any) : {}
    }));
  }

  static create(data: CreateAssetData): PortfolioAsset {
    const id = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    // Calculate basic performance metrics
    const moic = data.current_value / data.acquisition_value;
    const totalReturn = (data.current_value - data.acquisition_value) / data.acquisition_value;
    
    const stmt = db.prepare(`
      INSERT INTO portfolio_assets (
        id, portfolio_id, name, asset_type, description, acquisition_date,
        acquisition_value, current_value, location_country, location_region,
        location_city, moic, total_return, risk_rating, sector, tags,
        specific_metrics, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.portfolio_id,
      data.name,
      data.asset_type,
      data.description || null,
      data.acquisition_date,
      data.acquisition_value,
      data.current_value,
      data.location_country || null,
      data.location_region || null,
      data.location_city || null,
      moic,
      totalReturn,
      data.risk_rating || 'medium',
      data.sector || null,
      JSON.stringify(data.tags || []),
      JSON.stringify(data.specific_metrics || {}),
      now,
      now
    );
    
    // Recalculate portfolio metrics
    PortfolioService.recalculateMetrics(data.portfolio_id);
    
    return this.getById(id)!;
  }

  static update(id: string, updates: Partial<PortfolioAsset>): PortfolioAsset | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'tags' || key === 'sustainability_certifications' || key === 'specific_metrics') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = ?');
    values.push(now, id);
    
    const stmt = db.prepare(`UPDATE portfolio_assets SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    // Recalculate portfolio metrics if value changed
    if (updates.current_value !== undefined || updates.acquisition_value !== undefined) {
      PortfolioService.recalculateMetrics(existing.portfolio_id);
    }
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const asset = this.getById(id);
    if (!asset) return false;
    
    const stmt = db.prepare('DELETE FROM portfolio_assets WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes > 0) {
      // Recalculate portfolio metrics
      PortfolioService.recalculateMetrics(asset.portfolio_id);
      return true;
    }
    
    return false;
  }
}