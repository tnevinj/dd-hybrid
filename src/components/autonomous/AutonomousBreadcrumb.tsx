'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface AutonomousBreadcrumbProps {
  currentModule?: string;
  projectName?: string;
  customItems?: BreadcrumbItem[];
  className?: string;
}

const MODULE_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  dashboard: { label: 'Dashboard', icon: Brain },
  workspaces: { label: 'Workspaces', icon: Brain },
  'due-diligence': { label: 'Due Diligence', icon: Brain },
  portfolio: { label: 'Portfolio', icon: Brain },
  'deal-screening': { label: 'Deal Screening', icon: Brain },
  'deal-structuring': { label: 'Deal Structuring', icon: Brain },
};

export function AutonomousBreadcrumb({ 
  currentModule, 
  projectName, 
  customItems, 
  className 
}: AutonomousBreadcrumbProps) {
  const pathname = usePathname();

  // Auto-detect module from pathname if not provided
  const detectedModule = currentModule || Object.keys(MODULE_LABELS).find(module =>
    pathname.includes(`/${module}`)
  ) || 'dashboard';

  const moduleInfo = MODULE_LABELS[detectedModule];

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = customItems || [
    {
      label: 'Autonomous',
      icon: Brain,
    },
    {
      label: moduleInfo?.label || 'Module',
      icon: moduleInfo?.icon,
    },
  ];

  // Add project name if provided
  if (projectName) {
    breadcrumbItems.push({
      label: projectName,
      isActive: true,
    });
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm", className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isActive = item.isActive || isLast;

        return (
          <React.Fragment key={index}>
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-md transition-colors",
              isActive 
                ? "text-purple-700 bg-purple-50 font-medium" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}>
              {item.icon && (
                <item.icon className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-purple-600" : "text-gray-500"
                )} />
              )}
              <span className="truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            </div>
            
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default AutonomousBreadcrumb;