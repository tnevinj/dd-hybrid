'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZIndex, getZIndexStyle } from '@/styles/z-index';
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Bell,
  Search,
  Globe,
  Shield,
  BarChart3,
  Briefcase,
  UserCheck,
  PieChart,
  Calculator,
  Gavel,
  Target,
  CheckSquare,
  Brain
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  children?: NavigationItem[];
  badge?: string;
  aiEnhanced?: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    aiEnhanced: true
  },
  {
    name: 'Deal Screening',
    href: '/deal-screening',
    icon: Target,
    aiEnhanced: true,
    children: [
      { name: 'Pipeline', href: '/deal-screening', icon: TrendingUp },
      { name: 'Opportunities', href: '/deal-screening/opportunities', icon: Search },
      { name: 'Templates', href: '/deal-screening/templates', icon: FileText },
    ]
  },
  {
    name: 'Deal Structuring',
    href: '/deal-structuring',
    icon: Calculator,
    aiEnhanced: true,
    children: [
      { name: 'Active Deals', href: '/deal-structuring', icon: Building2 },
      { name: 'Financial Models', href: '/deal-structuring/financial', icon: BarChart3 },
      { name: 'Valuation Tools', href: '/deal-structuring/valuation', icon: PieChart },
    ]
  },
  {
    name: 'Due Diligence',
    href: '/due-diligence',
    icon: CheckSquare,
    aiEnhanced: true,
    children: [
      { name: 'Projects', href: '/due-diligence', icon: Briefcase },
      { name: 'Risk Analysis', href: '/due-diligence/risk', icon: Shield },
      { name: 'Document Review', href: '/due-diligence/documents', icon: FileText },
    ]
  },
  {
    name: 'Workspaces',
    href: '/workspaces',
    icon: Users,
    children: [
      { name: 'My Workspaces', href: '/workspaces', icon: Home },
      { name: 'Collaboration', href: '/workspaces/collaboration', icon: Users },
      { name: 'Work Products', href: '/workspaces/work-products', icon: FileText },
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { name: 'Profile', href: '/settings/profile', icon: UserCheck },
      { name: 'AI Preferences', href: '/settings/ai', icon: Brain },
      { name: 'Notifications', href: '/settings/notifications', icon: Bell },
    ]
  }
];

export function MainLayout({ children, user }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  
  const navigationMode = user.navigationMode || 'traditional';

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemExpanded = (itemName: string) => expandedItems.includes(itemName);
  
  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href) && href !== '/';
  };

  const shouldShowItem = (item: NavigationItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // AI enhancements for assisted and autonomous modes
  const getAIBadge = (item: NavigationItem) => {
    if (!item.aiEnhanced || navigationMode === 'traditional') return null;
    
    return (
      <Badge variant="secondary" className="ml-2 text-xs">
        AI
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 lg:hidden" style={getZIndexStyle(ZIndex.OVERLAY)}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={getZIndexStyle(ZIndex.STICKY)}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                SecondaryEdge
                {navigationMode !== 'traditional' && (
                  <Brain className="h-5 w-5 text-blue-500" />
                )}
              </h1>
            </div>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation mode indicator */}
        {navigationMode !== 'traditional' && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 capitalize">
                {navigationMode} Mode
              </span>
            </div>
          </div>
        )}

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            if (!shouldShowItem(item)) return null;

            const isActive = isActiveRoute(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = isItemExpanded(item.name);

            return (
              <div key={item.name}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    )} />
                    <span className="flex-1">{item.name}</span>
                    {getAIBadge(item)}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )} />
                    </button>
                  )}
                </div>

                {/* Subnav */}
                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          isActiveRoute(child.href)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <child.icon className={cn(
                          "mr-3 h-4 w-4 flex-shrink-0",
                          isActiveRoute(child.href) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                        )} />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              SecondaryEdge
              {navigationMode !== 'traditional' && (
                <Brain className="h-4 w-4 text-blue-500" />
              )}
            </h1>
            <div></div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}