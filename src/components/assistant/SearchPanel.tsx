'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Brain, Zap } from 'lucide-react';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  results: any[];
  isSearching: boolean;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * SearchPanel Component - Enhanced for DD-Hybrid
 * 
 * AI-powered search panel with hybrid navigation support
 */
const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  onClose,
  query,
  results,
  isSearching,
  mode = 'traditional'
}) => {
  const getModeIcon = () => {
    switch (mode) {
      case 'autonomous':
        return <Zap className="h-4 w-4 text-purple-600" />;
      case 'assisted':
        return <Brain className="h-4 w-4 text-blue-600" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getModeIcon()}
            Knowledge Search
            {mode !== 'traditional' && (
              <Badge variant="outline" className="text-xs capitalize">
                {mode} AI
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Search knowledge base... ${mode !== 'traditional' ? '(AI-Enhanced)' : ''}`}
              value={query}
              className="flex-1"
            />
            <Button disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="text-center text-gray-500 py-8">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Search functionality will be implemented here</p>
            {mode !== 'traditional' && (
              <p className="text-sm mt-2">AI-powered semantic search with contextual understanding</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPanel;