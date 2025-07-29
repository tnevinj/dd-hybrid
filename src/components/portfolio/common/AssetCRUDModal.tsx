'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UnifiedAsset, AssetType } from '@/types/portfolio';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';

interface AssetCRUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: UnifiedAsset;
  mode: 'create' | 'edit' | 'view';
}

interface AssetFormData {
  name: string;
  assetType: AssetType;
  description: string;
  acquisitionValue: number;
  currentValue: number;
  sector: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  riskRating: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'under_review' | 'exited' | 'disposed';
  tags: string[];
}

export function AssetCRUDModal({ isOpen, onClose, asset, mode }: AssetCRUDModalProps) {
  const { createAsset, updateAsset, deleteAsset } = useUnifiedPortfolio();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<AssetFormData>({
    name: asset?.name || '',
    assetType: asset?.assetType || 'traditional',
    description: asset?.description || '',
    acquisitionValue: asset?.acquisitionValue || 0,
    currentValue: asset?.currentValue || 0,
    sector: asset?.sector || '',
    location: {
      country: asset?.location.country || '',
      city: asset?.location.city || '',
      region: asset?.location.region || '',
    },
    riskRating: asset?.riskRating || 'medium',
    status: asset?.status || 'active',
    tags: asset?.tags || [],
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof AssetFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assetData = {
        ...formData,
        acquisitionDate: asset?.acquisitionDate || new Date().toISOString().split('T')[0],
        performance: asset?.performance || {
          irr: Math.random() * 0.3,
          moic: 1 + Math.random() * 2,
          totalReturn: Math.random() * 0.35
        },
        esgMetrics: asset?.esgMetrics || {
          environmentalScore: 6 + Math.random() * 4,
          socialScore: 6 + Math.random() * 4,
          governanceScore: 7 + Math.random() * 3,
          overallScore: 6.5 + Math.random() * 3.5,
          jobsCreated: Math.floor(Math.random() * 200),
          sustainabilityCertifications: []
        },
        specificMetrics: asset?.specificMetrics || generateSpecificMetrics(formData.assetType)
      };

      if (mode === 'create') {
        await createAsset(assetData);
      } else if (mode === 'edit' && asset) {
        await updateAsset(asset.id, assetData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Failed to save asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!asset || mode !== 'edit') return;
    
    if (window.confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      setLoading(true);
      try {
        await deleteAsset(asset.id);
        onClose();
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Failed to delete asset. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const generateSpecificMetrics = (assetType: AssetType) => {
    switch (assetType) {
      case 'traditional':
        return {
          companyStage: 'series_b',
          fundingRounds: Math.floor(Math.random() * 5) + 1,
          employeeCount: Math.floor(Math.random() * 500) + 10,
          revenue: Math.floor(Math.random() * 50000000) + 1000000,
          ebitda: Math.floor(Math.random() * 10000000) + 100000,
          debtToEquity: Math.random() * 0.5,
          boardSeats: Math.floor(Math.random() * 3) + 1,
          ownershipPercentage: Math.random() * 30 + 5,
        };
      case 'real_estate':
        return {
          propertyType: 'office',
          totalSqFt: Math.floor(Math.random() * 200000) + 10000,
          occupancyRate: Math.random() * 30 + 70,
          avgLeaseLength: Math.random() * 8 + 2,
          capRate: Math.random() * 5 + 3,
          noiYield: Math.random() * 6 + 4,
          vacancyRate: Math.random() * 20 + 5,
          avgRentPsf: Math.random() * 30 + 20,
        };
      case 'infrastructure':
        return {
          assetCategory: 'energy',
          capacityUtilization: Math.random() * 30 + 70,
          operationalEfficiency: Math.random() * 20 + 80,
          maintenanceScore: Math.random() * 30 + 70,
          regulatoryCompliance: Math.random() * 10 + 90,
          contractedRevenue: Math.floor(Math.random() * 20000000) + 1000000,
          availabilityRate: Math.random() * 10 + 90,
          throughputCapacity: Math.floor(Math.random() * 500000) + 50000,
          averageLifespan: Math.floor(Math.random() * 20) + 15,
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Add New Asset' : 
               mode === 'edit' ? 'Edit Asset' : 'Asset Details'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter asset name"
                  required
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Type *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.assetType}
                  onChange={(e) => handleInputChange('assetType', e.target.value)}
                  required
                  disabled={mode === 'view'}
                >
                  <option value="traditional">Traditional</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter asset description"
                disabled={mode === 'view'}
              />
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acquisition Value ($) *
                </label>
                <Input
                  type="number"
                  value={formData.acquisitionValue}
                  onChange={(e) => handleInputChange('acquisitionValue', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  required
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Value ($) *
                </label>
                <Input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  required
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <Input
                  value={formData.location.country}
                  onChange={(e) => handleInputChange('location.country', e.target.value)}
                  placeholder="Country"
                  required
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  placeholder="City"
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <Input
                  value={formData.location.region}
                  onChange={(e) => handleInputChange('location.region', e.target.value)}
                  placeholder="Region"
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            {/* Sector and Risk */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <Input
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  placeholder="e.g., Technology"
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Rating *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.riskRating}
                  onChange={(e) => handleInputChange('riskRating', e.target.value)}
                  required
                  disabled={mode === 'view'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                  disabled={mode === 'view'}
                >
                  <option value="active">Active</option>
                  <option value="under_review">Under Review</option>
                  <option value="exited">Exited</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    {mode !== 'view' && (
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {mode !== 'view' && (
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <div>
                {mode === 'edit' && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Delete Asset
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  {mode === 'view' ? 'Close' : 'Cancel'}
                </Button>
                {mode !== 'view' && (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : mode === 'create' ? 'Create Asset' : 'Update Asset'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}