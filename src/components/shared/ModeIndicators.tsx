'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { User, Brain, Bot } from 'lucide-react'

export type NavigationMode = 'traditional' | 'assisted' | 'autonomous'

interface ModeIndicatorProps {
  mode: NavigationMode
  className?: string
}

export function ModeIndicator({ mode, className = '' }: ModeIndicatorProps) {
  const modeConfig = {
    traditional: {
      label: 'Traditional Mode',
      icon: User,
      className: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    assisted: {
      label: 'Assisted Mode', 
      icon: Brain,
      className: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    autonomous: {
      label: 'Autonomous Mode',
      icon: Bot,
      className: 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const config = modeConfig[mode]
  const Icon = config.icon

  return (
    <Badge className={`${config.className} flex items-center space-x-1 ${className}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  )
}

interface ModuleHeaderProps {
  title: string
  description: string
  mode: NavigationMode
  actions?: React.ReactNode
  className?: string
}

export function ModuleHeader({ 
  title, 
  description, 
  mode, 
  actions,
  className = '' 
}: ModuleHeaderProps) {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <ModeIndicator mode={mode} />
        </div>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  )
}

interface ProcessNoticeProps {
  mode: NavigationMode
  title: string
  description: string
  className?: string
}

export function ProcessNotice({ 
  mode, 
  title, 
  description, 
  className = '' 
}: ProcessNoticeProps) {
  const modeConfig = {
    traditional: {
      icon: User,
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600'
    },
    assisted: {
      icon: Brain,
      bgColor: 'bg-gradient-to-r from-purple-100 to-blue-100',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600'
    },
    autonomous: {
      icon: Bot,
      bgColor: 'bg-gradient-to-r from-blue-100 to-indigo-100',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600'
    }
  }

  const config = modeConfig[mode]
  const Icon = config.icon

  return (
    <div className={`mt-6 p-4 ${config.bgColor} border ${config.borderColor} rounded-lg ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  mode: NavigationMode
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  mode,
  className = '' 
}: MetricCardProps) {
  const modeConfig = {
    traditional: {
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600',
      valueColor: 'text-gray-900',
      subtitleColor: 'text-gray-500'
    },
    assisted: {
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      valueColor: 'text-gray-900',
      subtitleColor: 'text-purple-600'
    },
    autonomous: {
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900',
      subtitleColor: 'text-blue-600'
    }
  }

  const config = modeConfig[mode]

  return (
    <div className={`border ${config.borderColor} rounded-lg p-6 bg-white ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
      <p className={`text-3xl font-bold ${config.valueColor}`}>{value}</p>
      <div className={`flex items-center ${config.subtitleColor} text-sm mt-1`}>
        <span>{subtitle}</span>
      </div>
    </div>
  )
}

// Standard descriptions for each mode
export const MODE_DESCRIPTIONS = {
  traditional: {
    workspace: 'Complete manual control over workspace creation and management',
    dealScreening: 'Full manual control over deal evaluation and screening',
    dueDiligence: 'Complete manual control over due diligence processes',
    portfolio: 'Manual portfolio monitoring and analysis',
    default: 'Complete manual control over all processes'
  },
  assisted: {
    workspace: 'AI-enhanced workspace management with intelligent recommendations',
    dealScreening: 'AI-enhanced deal screening with intelligent insights and automation',
    dueDiligence: 'AI-assisted due diligence with smart recommendations and analysis',
    portfolio: 'AI-enhanced portfolio management with predictive insights',
    default: 'AI-enhanced processes with intelligent recommendations'
  },
  autonomous: {
    workspace: 'AI autonomously manages workspaces with your approval for key decisions',
    dealScreening: 'AI autonomously screens deals with human oversight for critical decisions',
    dueDiligence: 'AI autonomously conducts due diligence with expert validation',
    portfolio: 'AI autonomously manages portfolio with strategic human oversight',
    default: 'AI autonomously manages processes with human oversight'
  }
} as const

export type ModuleType = keyof typeof MODE_DESCRIPTIONS.traditional
