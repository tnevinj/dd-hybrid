'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentRole } from '@/stores/role-store'
import { ROLE_DEFINITIONS } from '@/types/roles'
import type { UserRole } from '@/types/roles'
import { 
  Crown, 
  Briefcase, 
  Users, 
  BarChart, 
  Building, 
  PieChart, 
  Scale, 
  Shield, 
  Settings,
  Eye,
  Lock,
  CheckCircle
} from 'lucide-react'

const roleIcons = {
  senior_partner: Crown,
  investment_director: Briefcase,
  principal: Briefcase,
  associate: Users,
  analyst: BarChart,
  fund_operations: Building,
  portfolio_operations: PieChart,
  legal_compliance: Scale,
  ir_lp_relations: Users,
  general_partner: Shield,
  limited_partner: Users,
  portfolio_company: Building,
  admin: Settings
}

const roleColors = {
  senior_partner: 'text-purple-600 bg-purple-50 border-purple-200',
  investment_director: 'text-blue-600 bg-blue-50 border-blue-200',
  principal: 'text-blue-600 bg-blue-50 border-blue-200',
  associate: 'text-green-600 bg-green-50 border-green-200',
  analyst: 'text-green-600 bg-green-50 border-green-200',
  fund_operations: 'text-orange-600 bg-orange-50 border-orange-200',
  portfolio_operations: 'text-orange-600 bg-orange-50 border-orange-200',
  legal_compliance: 'text-red-600 bg-red-50 border-red-200',
  ir_lp_relations: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  general_partner: 'text-gray-600 bg-gray-50 border-gray-200',
  limited_partner: 'text-gray-600 bg-gray-50 border-gray-200',
  portfolio_company: 'text-gray-600 bg-gray-50 border-gray-200',
  admin: 'text-slate-600 bg-slate-50 border-slate-200'
}

export default function RoleDemoPage() {
  const { currentRole, roleDefinition, navigationItems, hasPermission, canAccessModule } = useCurrentRole()
  const RoleIcon = roleIcons[currentRole]

  const allRoles = Object.keys(ROLE_DEFINITIONS) as UserRole[]
  const roleGroups = {
    'Investment Team': ['senior_partner', 'investment_director', 'principal', 'associate', 'analyst'] as UserRole[],
    'Operations Team': ['fund_operations', 'portfolio_operations', 'legal_compliance', 'ir_lp_relations'] as UserRole[],
    'External Users': ['general_partner', 'limited_partner', 'portfolio_company'] as UserRole[],
    'System': ['admin'] as UserRole[]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Role-Based Access Control</h1>
          <p className="text-gray-600">
            Switch between different user roles using the role switcher in the sidebar to see how the navigation changes based on permissions
          </p>
        </div>

        {/* Current Role Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${roleColors[currentRole]}`}>
                <RoleIcon className="w-5 h-5" />
              </div>
              <span>Current Role: {roleDefinition.name}</span>
            </CardTitle>
            <CardDescription>
              {roleDefinition.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role Info */}
              <div>
                <h3 className="font-semibold mb-3">Role Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <Badge variant={roleDefinition.category === 'internal' ? 'default' : 'secondary'}>
                      {roleDefinition.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Dashboard Layout:</span>
                    <span className="font-medium">{roleDefinition.dashboardLayout}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Modules:</span>
                    <span className="font-medium">{navigationItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Permissions:</span>
                    <span className="font-medium">{roleDefinition.permissions.length}</span>
                  </div>
                </div>
              </div>

              {/* Available Modules */}
              <div>
                <h3 className="font-semibold mb-3">Available Modules</h3>
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="font-semibold mb-3">Permissions</h3>
                <div className="space-y-1">
                  {roleDefinition.permissions.slice(0, 8).map((permission) => (
                    <div key={permission} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                      <span className="capitalize">{permission.replace('_', ' ')}</span>
                    </div>
                  ))}
                  {roleDefinition.permissions.length > 8 && (
                    <div className="text-xs text-gray-500">
                      +{roleDefinition.permissions.length - 8} more permissions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Roles Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(roleGroups).map(([groupName, roles]) => (
            <Card key={groupName}>
              <CardHeader>
                <CardTitle>{groupName}</CardTitle>
                <CardDescription>
                  {groupName === 'Investment Team' && 'Core investment professionals responsible for deal sourcing, analysis, and execution'}
                  {groupName === 'Operations Team' && 'Support functions including fund operations, legal, and LP relations'}
                  {groupName === 'External Users' && 'External stakeholders with limited access to specific functions'}
                  {groupName === 'System' && 'System administrators with full platform access'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.map((role) => {
                    const definition = ROLE_DEFINITIONS[role]
                    const Icon = roleIcons[role]
                    const isCurrentRole = role === currentRole
                    
                    return (
                      <div 
                        key={role} 
                        className={`p-3 border rounded-lg ${
                          isCurrentRole ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded ${roleColors[role]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-sm">{definition.name}</h4>
                              {isCurrentRole && (
                                <Badge variant="default" className="text-xs">Current</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{definition.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{definition.defaultModules.length} modules</span>
                              <span>{definition.permissions.length} permissions</span>
                              <span>{definition.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Role-Based Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h4 className="font-medium">Dynamic Navigation</h4>
                  <p className="text-sm text-gray-600">Navigation items automatically adjust based on user role and permissions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h4 className="font-medium">Permission-Based Access</h4>
                  <p className="text-sm text-gray-600">Users only see modules and features they have permission to access</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h4 className="font-medium">Role-Specific Workflows</h4>
                  <p className="text-sm text-gray-600">Each role has tailored workflows optimized for their responsibilities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                <div>
                  <h4 className="font-medium">Secure Access Control</h4>
                  <p className="text-sm text-gray-600">Granular permissions ensure data security and appropriate access levels</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
