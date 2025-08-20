'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZIndex, getZIndexStyle } from '@/styles/z-index';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  PieChart, 
  Target, 
  Building2,
  ChevronDown,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface NavigationModule {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  badge?: string;
  color: string;
}

interface AutonomousNavMenuProps {
  currentModule?: string;
  onNavigate?: (moduleId: string) => void;
  className?: string;
}

const NAVIGATION_MODULES: NavigationModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    href: '/dashboard?mode=autonomous',
    description: 'Overview and insights across all operations',
    color: 'text-green-600',
  },
  {
    id: 'workspaces',
    name: 'Workspaces',
    icon: FolderOpen,
    href: '/workspaces?mode=autonomous',
    description: 'Collaborative workspace management',
    color: 'text-purple-600',
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    icon: FileText,
    href: '/due-diligence?mode=autonomous',
    description: 'Comprehensive company analysis',
    color: 'text-blue-600',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: PieChart,
    href: '/portfolio?mode=autonomous',
    description: 'Portfolio management and analytics',
    color: 'text-orange-600',
  },
  {
    id: 'deal-screening',
    name: 'Deal Screening',
    icon: Target,
    href: '/deal-screening?mode=autonomous',
    description: 'Opportunity screening and evaluation',
    color: 'text-cyan-600',
  },
  {
    id: 'deal-structuring',
    name: 'Deal Structuring',
    icon: Building2,
    href: '/deal-structuring?mode=autonomous',
    description: 'Financial modeling and deal structuring',
    color: 'text-indigo-600',
  },
];

export function AutonomousNavMenu({ currentModule, onNavigate, className }: AutonomousNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Detect current module from pathname if not provided
  const detectedModule = currentModule || NAVIGATION_MODULES.find(module => 
    pathname.startsWith(module.href.split('?')[0])
  )?.id || 'dashboard';

  const currentModuleData = NAVIGATION_MODULES.find(m => m.id === detectedModule);

  const handleModuleSelect = (module: NavigationModule) => {
    setIsOpen(false);
    
    if (onNavigate) {
      onNavigate(module.id);
    } else {
      // Default navigation behavior
      router.push(module.href);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Current Module Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentModuleData && (
          <>
            <currentModuleData.icon className={cn("w-4 h-4", currentModuleData.color)} />
            <span className="font-medium text-gray-900 hidden sm:inline">
              {currentModuleData.name}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-500 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )} />
          </>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop - Only for mobile, less intrusive */}
          <div 
            className="fixed inset-0 bg-transparent" 
            style={getZIndexStyle(ZIndex.DROPDOWN - 1)}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div 
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
            style={getZIndexStyle(ZIndex.DROPDOWN)}
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-2">
                Navigate to Module
              </div>
              
              {NAVIGATION_MODULES.map((module) => {
                const isCurrentModule = module.id === detectedModule;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleSelect(module)}
                    disabled={isCurrentModule}
                    className={cn(
                      "w-full text-left p-3 rounded-md transition-colors duration-150",
                      "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500",
                      isCurrentModule ? "bg-purple-50 cursor-default" : "cursor-pointer"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <module.icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", module.color)} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "font-medium truncate",
                            isCurrentModule ? "text-purple-900" : "text-gray-900"
                          )}>
                            {module.name}
                          </span>
                          
                          {isCurrentModule ? (
                            <Badge variant="outline" className="ml-2 text-xs bg-purple-100 text-purple-700 border-purple-200">
                              Current
                            </Badge>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className={cn(
                          "text-sm mt-1 leading-relaxed",
                          isCurrentModule ? "text-purple-700" : "text-gray-600"
                        )}>
                          {module.description}
                        </p>
                        
                        {module.badge && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {module.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {/* Quick Actions */}
              <div className="border-t border-gray-100 mt-3 pt-3">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Actions
                </div>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/settings?mode=autonomous');
                  }}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Autonomous Settings</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AutonomousNavMenu;