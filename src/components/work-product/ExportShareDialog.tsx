'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkProduct, ExportFormat, SharePermission } from '@/types/work-product';
import { 
  Download,
  Share2,
  Copy,
  Eye,
  Edit,
  Shield,
  Clock,
  Users,
  Link2,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface ExportShareDialogProps {
  workProduct: WorkProduct;
  onClose: () => void;
  onExport?: (format: ExportFormat, options: any) => void;
  onCreateShareLink?: (permission: SharePermission, settings: any) => void;
}

export function ExportShareDialog({ workProduct, onClose, onExport, onCreateShareLink }: ExportShareDialogProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'share'>('export');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('PDF');
  const [sharePermission, setSharePermission] = useState<SharePermission>('VIEW');
  const [shareSettings, setShareSettings] = useState({
    expiresIn: '7', // days
    passwordProtected: false,
    watermark: true,
    allowDownload: true,
    trackAccess: true
  });
  const [exportOptions, setExportOptions] = useState({
    includeComments: false,
    includeSensitiveData: false,
    watermark: true,
    selectedSections: [] as string[]
  });

  const exportFormats = [
    { format: 'PDF' as ExportFormat, label: 'PDF Document', description: 'Professional format, preserves layout', icon: '📄' },
    { format: 'DOCX' as ExportFormat, label: 'Word Document', description: 'Editable format for further collaboration', icon: '📝' },
    { format: 'HTML' as ExportFormat, label: 'Web Document', description: 'Interactive format with navigation', icon: '🌐' },
    { format: 'MARKDOWN' as ExportFormat, label: 'Markdown', description: 'Plain text format for developers', icon: '📋' },
    { format: 'JSON' as ExportFormat, label: 'JSON Data', description: 'Structured data for integration', icon: '⚙️' }
  ];

  const sharePermissions = [
    { 
      permission: 'VIEW' as SharePermission, 
      label: 'View Only', 
      description: 'Recipients can only read the document',
      icon: Eye
    },
    { 
      permission: 'COMMENT' as SharePermission, 
      label: 'Comment', 
      description: 'Recipients can add comments and suggestions',
      icon: Users
    },
    { 
      permission: 'EDIT' as SharePermission, 
      label: 'Edit', 
      description: 'Recipients can modify the document content',
      icon: Edit
    },
    { 
      permission: 'ADMIN' as SharePermission, 
      label: 'Admin', 
      description: 'Full access including sharing and settings',
      icon: Shield
    }
  ];

  const handleExport = () => {
    onExport?.(exportFormat, exportOptions);
  };

  const handleCreateShareLink = () => {
    onCreateShareLink?.(sharePermission, shareSettings);
  };

  const renderExportTab = () => (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
        <div className="grid grid-cols-1 gap-3">
          {exportFormats.map(({ format, label, description, icon }) => (
            <label
              key={format}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                exportFormat === format
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="exportFormat"
                value={format}
                checked={exportFormat === format}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                className="sr-only"
              />
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <div className="text-sm text-gray-600">{description}</div>
                </div>
              </div>
              {exportFormat === format && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={exportOptions.includeComments}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeComments: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Include Comments</span>
              <p className="text-xs text-gray-600">Export with all comments and discussions</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={exportOptions.includeSensitiveData}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeSensitiveData: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Include Sensitive Data</span>
              <p className="text-xs text-gray-600">Include confidential financial details</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={exportOptions.watermark}
              onChange={(e) => setExportOptions(prev => ({ ...prev, watermark: e.target.checked }))}
              className="rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Add Watermark</span>
              <p className="text-xs text-gray-600">Brand document with your firm's watermark</p>
            </div>
          </label>
        </div>
      </div>

      {/* Section Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections to Export</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={exportOptions.selectedSections.length === 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setExportOptions(prev => ({ ...prev, selectedSections: [] }));
                }
              }}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-900">All Sections</span>
          </label>

          {workProduct.sections.map((section) => (
            <label key={section.id} className="flex items-center gap-3 ml-6">
              <input
                type="checkbox"
                checked={exportOptions.selectedSections.includes(section.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setExportOptions(prev => ({ 
                      ...prev, 
                      selectedSections: [...prev.selectedSections, section.id] 
                    }));
                  } else {
                    setExportOptions(prev => ({ 
                      ...prev, 
                      selectedSections: prev.selectedSections.filter(id => id !== section.id) 
                    }));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{section.title}</span>
              {section.required && (
                <Badge variant="outline" className="text-xs">Required</Badge>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Export Preview */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Export Preview</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Format: {exportFormat}</div>
              <div>Sections: {exportOptions.selectedSections.length === 0 ? 'All' : exportOptions.selectedSections.length}</div>
              <div>Comments: {exportOptions.includeComments ? 'Included' : 'Excluded'}</div>
              <div>Estimated size: ~{Math.ceil(workProduct.wordCount / 250)} pages</div>
            </div>
          </div>
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
      </Card>

      <Button onClick={handleExport} className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Export Document
      </Button>
    </div>
  );

  const renderShareTab = () => (
    <div className="space-y-6">
      {/* Permission Level */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Level</h3>
        <div className="grid grid-cols-1 gap-3">
          {sharePermissions.map(({ permission, label, description, icon: Icon }) => (
            <label
              key={permission}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                sharePermission === permission
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="sharePermission"
                value={permission}
                checked={sharePermission === permission}
                onChange={(e) => setSharePermission(e.target.value as SharePermission)}
                className="sr-only"
              />
              <div className="flex items-center gap-3 flex-1">
                <Icon className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{label}</div>
                  <div className="text-sm text-gray-600">{description}</div>
                </div>
              </div>
              {sharePermission === permission && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Share Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Expires In
            </label>
            <select
              value={shareSettings.expiresIn}
              onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1">1 day</option>
              <option value="7">1 week</option>
              <option value="30">1 month</option>
              <option value="90">3 months</option>
              <option value="never">Never expires</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={shareSettings.passwordProtected}
                onChange={(e) => setShareSettings(prev => ({ ...prev, passwordProtected: e.target.checked }))}
                className="rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Password Protection</span>
                <p className="text-xs text-gray-600">Require password to access document</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={shareSettings.watermark}
                onChange={(e) => setShareSettings(prev => ({ ...prev, watermark: e.target.checked }))}
                className="rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Add Watermark</span>
                <p className="text-xs text-gray-600">Display watermark on shared document</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={shareSettings.allowDownload}
                onChange={(e) => setShareSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                className="rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Allow Download</span>
                <p className="text-xs text-gray-600">Recipients can download the document</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={shareSettings.trackAccess}
                onChange={(e) => setShareSettings(prev => ({ ...prev, trackAccess: e.target.checked }))}
                className="rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Track Access</span>
                <p className="text-xs text-gray-600">Monitor who views the document</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Share Preview */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Share Preview</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Access: {sharePermissions.find(p => p.permission === sharePermission)?.label}</div>
              <div>Expires: {shareSettings.expiresIn === 'never' ? 'Never' : `${shareSettings.expiresIn} days`}</div>
              <div>Security: {shareSettings.passwordProtected ? 'Password protected' : 'Public link'}</div>
              <div>Downloads: {shareSettings.allowDownload ? 'Allowed' : 'Blocked'}</div>
            </div>
          </div>
          <Link2 className="w-8 h-8 text-gray-400" />
        </div>
      </Card>

      <Button onClick={handleCreateShareLink} className="w-full">
        <Share2 className="w-4 h-4 mr-2" />
        Create Share Link
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <Card className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Export & Share</h2>
                <p className="text-gray-600 mt-1">{workProduct.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Tabs */}
            <div className="flex mt-4 border-b">
              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'export'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'share'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                Share
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'export' ? renderExportTab() : renderShareTab()}
          </div>
        </Card>
      </div>
    </div>
  );
}