'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  ChevronDown
} from 'lucide-react'
import type { UserRole } from '@/types/roles'
import { ROLE_DEFINITIONS } from '@/types/roles'

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
  senior_partner: 'text-blue-600 bg-blue-50 border-blue-200',
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

interface RoleSwitcherProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
  collapsed?: boolean
}

export function RoleSwitcher({ currentRole, onRoleChange, collapsed = false }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  
  const currentRoleDefinition = ROLE_DEFINITIONS[currentRole]
  const CurrentRoleIcon = roleIcons[currentRole]

  const roleGroups = {
    'Investment Team': ['senior_partner', 'investment_director', 'principal', 'associate', 'analyst'] as UserRole[],
    'Operations Team': ['fund_operations', 'portfolio_operations', 'legal_compliance', 'ir_lp_relations'] as UserRole[],
    'External Users': ['general_partner', 'limited_partner', 'portfolio_company'] as UserRole[],
    'System': ['admin'] as UserRole[]
  }

  // Calculate dropdown position
  const updateDropdownPosition = React.useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    
    let top = rect.bottom + 8 // 8px gap
    let left = rect.left
    let width = collapsed ? 280 : Math.max(rect.width, 280)

    // Adjust for collapsed mode - position to the right
    if (collapsed) {
      left = rect.right + 8
      top = rect.top
    }

    // Ensure dropdown doesn't go off-screen horizontally
    if (left + width > viewportWidth) {
      left = viewportWidth - width - 16
    }
    if (left < 16) {
      left = 16
      width = Math.min(width, viewportWidth - 32)
    }

    // Ensure dropdown doesn't go off-screen vertically
    const dropdownHeight = 400 // Approximate max height
    if (top + dropdownHeight > viewportHeight) {
      if (collapsed) {
        // For collapsed mode, try positioning above
        top = Math.max(16, rect.bottom - dropdownHeight)
      } else {
        // For normal mode, position above trigger
        top = rect.top - dropdownHeight - 8
        if (top < 16) {
          top = 16
        }
      }
    }

    setDropdownPosition({ top, left, width })
  }, [collapsed])

  // Handle opening/closing
  const handleToggle = React.useCallback(() => {
    if (!isOpen) {
      updateDropdownPosition()
    }
    setIsOpen(!isOpen)
  }, [isOpen, updateDropdownPosition])

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('resize', updateDropdownPosition)
      window.addEventListener('scroll', updateDropdownPosition, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  }, [isOpen, updateDropdownPosition])

  // Dropdown content
  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3 text-gray-900">Switch Role</h3>
        {Object.entries(roleGroups).map(([groupName, roles]) => (
          <div key={groupName} className="mb-4 last:mb-0">
            <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              {groupName}
            </h4>
            <div className="space-y-1">
              {roles.map((role) => {
                const roleDefinition = ROLE_DEFINITIONS[role]
                const RoleIcon = roleIcons[role]
                const isActive = role === currentRole
                
                return (
                  <button
                    key={role}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                      }
                    `}
                    onClick={() => {
                      onRoleChange(role)
                      setIsOpen(false)
                    }}
                  >
                    <div className={`p-1.5 rounded ${roleColors[role]}`}>
                      <RoleIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {roleDefinition.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {roleDefinition.description}
                      </div>
                    </div>
                    {isActive && (
                      <Badge variant="default" className="text-xs flex-shrink-0">
                        Current
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (collapsed) {
    return (
      <>
        <div ref={triggerRef}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full p-2 relative"
            onClick={handleToggle}
            title={`Current role: ${currentRoleDefinition.name}`}
          >
            <CurrentRoleIcon className="w-4 h-4" />
            {isOpen && (
              <div className="absolute inset-0 bg-gray-100 rounded opacity-50" />
            )}
          </Button>
        </div>
        {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
      </>
    )
  }

  return (
    <>
      <div ref={triggerRef}>
        <div 
          className={`
            flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all
            ${roleColors[currentRole]}
            ${isOpen ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
          `}
          onClick={handleToggle}
        >
          <CurrentRoleIcon className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentRoleDefinition.name}</p>
            <p className="text-xs opacity-75 truncate">
              {currentRoleDefinition.category === 'internal' ? 'Internal User' : 'External User'}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  )
}
