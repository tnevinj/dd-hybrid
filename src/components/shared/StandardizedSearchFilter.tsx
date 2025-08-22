import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  SlidersHorizontal,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { COMPONENTS, STATUS } from '@/lib/design-system';

// =============================================================================
// TYPES
// =============================================================================

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

interface SortOption {
  key: string;
  label: string;
  direction?: 'asc' | 'desc';
}

interface StandardizedSearchFilterProps {
  // Mode
  mode?: 'traditional' | 'assisted';
  
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;
  
  // Filters
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  filterConfigs: FilterConfig[];
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  sortOptions?: SortOption[];
  
  // AI Features (for assisted mode)
  aiSuggestions?: string[];
  smartFilterEnabled?: boolean;
  onSmartFilter?: () => void;
  
  // Results
  totalResults?: number;
  filteredResults?: number;
  
  // UI State
  showAdvancedFilters?: boolean;
  collapsible?: boolean;
  
  // Actions
  onClearAll?: () => void;
  onSaveFilter?: (name: string) => void;
  savedFilters?: Array<{ name: string; filters: Record<string, any> }>;
  
  className?: string;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const FilterDropdown: React.FC<{
  config: FilterConfig;
  value: any;
  onChange: (value: any) => void;
  mode?: 'traditional' | 'assisted';
}> = ({ config, value, onChange, mode = 'traditional' }) => {
  const isAssisted = mode === 'assisted';
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {config.label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
          isAssisted 
            ? 'border-purple-300 focus:ring-purple-500' 
            : 'border-gray-300 focus:ring-gray-500'
        }`}
      >
        <option value="">{config.placeholder || `All ${config.label}`}</option>
        {config.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} {option.count ? `(${option.count})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

const SortControls: React.FC<{
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sortOptions?: SortOption[];
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  mode?: 'traditional' | 'assisted';
}> = ({ sortBy, sortOrder, sortOptions = [], onSortChange, mode = 'traditional' }) => {
  const isAssisted = mode === 'assisted';
  
  if (!sortOptions.length || !onSortChange) return null;
  
  const handleSort = (key: string) => {
    if (sortBy === key) {
      // Toggle order if same field
      onSortChange(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to asc
      onSortChange(key, 'asc');
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {sortOptions.map((option) => (
        <Button
          key={option.key}
          variant={sortBy === option.key ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort(option.key)}
          className={`flex items-center space-x-2 ${
            sortBy === option.key 
              ? isAssisted ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'
              : isAssisted ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>{option.label}</span>
          {sortBy === option.key && (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </Button>
      ))}
    </div>
  );
};

const AISearchSuggestions: React.FC<{
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}> = ({ suggestions, onSelectSuggestion }) => {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded">
      <div className="flex items-center space-x-2 mb-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-800">AI Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectSuggestion(suggestion)}
            className="text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const StandardizedSearchFilter: React.FC<StandardizedSearchFilterProps> = ({
  mode = 'traditional',
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFiltersChange,
  filterConfigs,
  sortBy,
  sortOrder,
  onSortChange,
  sortOptions = [],
  aiSuggestions = [],
  smartFilterEnabled = false,
  onSmartFilter,
  totalResults,
  filteredResults,
  showAdvancedFilters = false,
  collapsible = true,
  onClearAll,
  onSaveFilter,
  savedFilters = [],
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible || showAdvancedFilters);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  const isAssisted = mode === 'assisted';
  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');
  const cardClasses = isAssisted ? COMPONENTS.card.assisted.base : COMPONENTS.card.traditional.base;
  
  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, searchTerm, onSearchChange]);
  
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  
  const handleClearAll = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onFiltersChange({});
    onClearAll?.();
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setLocalSearchTerm(suggestion);
    onSearchChange(suggestion);
  };

  return (
    <Card className={`${cardClasses} ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className={`text-xl ${isAssisted ? 'text-purple-900' : 'text-gray-900'}`}>
            {isAssisted ? 'Smart Search & Filters' : 'Search & Filters'}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Results Counter */}
            {filteredResults !== undefined && totalResults !== undefined && (
              <Badge variant="outline" className={isAssisted ? 'text-purple-700 border-purple-300' : 'text-gray-600 border-gray-300'}>
                {filteredResults} of {totalResults} shown
              </Badge>
            )}
            
            {/* Clear All Button */}
            {(hasActiveFilters || searchTerm) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll}
                className={isAssisted ? 'text-purple-600 border-purple-300' : 'text-gray-600 border-gray-300'}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            
            {/* Collapse Toggle */}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={isAssisted ? 'text-purple-600' : 'text-gray-600'}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(!collapsible || isExpanded) && (
        <CardContent>
          {/* Main Search Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className={`pl-10 ${
                    isAssisted 
                      ? 'border-purple-300 focus:border-purple-500' 
                      : 'border-gray-300 focus:border-gray-500'
                  }`}
                />
              </div>
            </div>
            
            {/* Smart Filter Button (Assisted Mode) */}
            {isAssisted && smartFilterEnabled && (
              <Button 
                variant="outline" 
                onClick={onSmartFilter}
                className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Brain className="h-4 w-4" />
                <span>Smart Filter</span>
              </Button>
            )}
            
            {/* Traditional Filter Toggle */}
            {!isAssisted && (
              <Button 
                variant="outline" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 border-gray-300 text-gray-700"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </Button>
            )}
          </div>
          
          {/* AI Search Suggestions */}
          {isAssisted && aiSuggestions.length > 0 && (
            <AISearchSuggestions 
              suggestions={aiSuggestions}
              onSelectSuggestion={handleSelectSuggestion}
            />
          )}
          
          {/* Advanced Filters */}
          {isExpanded && filterConfigs.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border mt-4 ${
              isAssisted ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
            }`}>
              {filterConfigs.map((config) => (
                <FilterDropdown
                  key={config.key}
                  config={config}
                  value={filters[config.key]}
                  onChange={(value) => handleFilterChange(config.key, value)}
                  mode={mode}
                />
              ))}
            </div>
          )}
          
          {/* Sort Controls */}
          {sortOptions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${isAssisted ? 'text-purple-900' : 'text-gray-900'}`}>
                  Sort & Organize
                </h4>
                {isAssisted && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Optimized
                  </Badge>
                )}
              </div>
              <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                sortOptions={sortOptions}
                onSortChange={onSortChange}
                mode={mode}
              />
            </div>
          )}
          
          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className={`font-semibold mb-3 ${isAssisted ? 'text-purple-900' : 'text-gray-900'}`}>
                Saved Filters
              </h4>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((savedFilter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onFiltersChange(savedFilter.filters)}
                    className={isAssisted ? 'border-purple-300 text-purple-700' : 'border-gray-300 text-gray-700'}
                  >
                    {savedFilter.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// =============================================================================
// SPECIALIZED COMPONENTS
// =============================================================================

export const QuickSearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  mode?: 'traditional' | 'assisted';
  aiSuggestions?: string[];
  className?: string;
}> = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...", 
  mode = 'traditional',
  aiSuggestions = [],
  className = ""
}) => {
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const isAssisted = mode === 'assisted';
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localTerm !== searchTerm) {
        onSearchChange(localTerm);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localTerm, searchTerm, onSearchChange]);
  
  const handleSelectSuggestion = (suggestion: string) => {
    setLocalTerm(suggestion);
    onSearchChange(suggestion);
  };
  
  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={localTerm}
          onChange={(e) => setLocalTerm(e.target.value)}
          className={`pl-10 ${
            isAssisted 
              ? 'border-purple-300 focus:border-purple-500' 
              : 'border-gray-300 focus:border-gray-500'
          }`}
        />
        {isAssisted && localTerm && (
          <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
        )}
      </div>
      
      {isAssisted && aiSuggestions.length > 0 && (
        <AISearchSuggestions 
          suggestions={aiSuggestions}
          onSelectSuggestion={handleSelectSuggestion}
        />
      )}
    </div>
  );
};

export default StandardizedSearchFilter;