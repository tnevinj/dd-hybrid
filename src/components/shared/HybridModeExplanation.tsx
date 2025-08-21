'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Info, User, Brain, Bot } from 'lucide-react'
import { HybridMode } from './HybridModeSwitcher'

export interface HybridModeExplanationProps {
  currentMode: HybridMode
  moduleContext?: 'due-diligence' | 'portfolio' | 'dashboard' | 'workspace' | 'deal-screening' | 'deal-structuring' | 'fund-operations' | 'investment-committee' | 'legal-management' | 'market-intelligence' | 'advanced-analytics' | 'lp-portal' | 'gp-portal'
  className?: string
  showIcon?: boolean
  showModeName?: boolean
  showStatistics?: boolean
  statistics?: {
    efficiency?: number
    automation?: number
    accuracy?: number
    timeSaved?: string
  }
}

const getModeExplanation = (mode: HybridMode, moduleContext: string = 'dashboard') => {
  const explanations = {
    'due-diligence': {
      traditional: 'You have complete manual control over due diligence tasks, document review, and risk assessment. All operations require your direct input and approval.',
      assisted: 'AI provides intelligent recommendations, automates document analysis, and suggests optimizations while you maintain control over final decisions and strategic direction.',
      autonomous: 'AI handles routine due diligence tasks automatically, processes documents, and manages workflows. You\'ll be asked to approve major decisions and strategic changes.'
    },
    portfolio: {
      traditional: 'You have complete control over portfolio allocation, rebalancing decisions, and investment strategies. All operations are performed manually without AI assistance.',
      assisted: 'AI provides portfolio optimization recommendations, rebalancing alerts, and risk insights while you maintain control over investment decisions and asset allocation.',
      autonomous: 'AI autonomously manages portfolio optimization, handles rebalancing, and executes investment strategies. You\'ll approve major allocation changes and strategic shifts.'
    },
    dashboard: {
      traditional: 'You have complete control over data analysis, report generation, and operational insights. All dashboard operations are performed manually without AI assistance.',
      assisted: 'AI provides intelligent insights, automated alerts, and predictive analytics while you maintain control over strategic decisions and operational priorities.',
      autonomous: 'AI continuously monitors operations, generates insights automatically, and optimizes workflows. You\'ll be notified of critical decisions and strategic recommendations.'
    },
    workspace: {
      traditional: 'You have complete manual control over workspace creation, management, and team coordination. All operations require your direct input and approval.',
      assisted: 'AI provides intelligent recommendations, workflow optimizations, and automated insights while you maintain control over final decisions and strategic direction.',
      autonomous: 'AI handles workspace operations automatically, managing workflows, coordinating teams, and optimizing processes. You\'ll be asked to approve major decisions and strategic changes.'
    },
    'deal-screening': {
      traditional: 'You manually review all deal opportunities, perform initial screening, and manage the deal pipeline without AI assistance.',
      assisted: 'AI provides deal scoring, pattern recognition, and screening recommendations while you control final approval decisions and deal prioritization.',
      autonomous: 'AI automatically screens deals, scores opportunities, and manages the pipeline. You\'ll approve high-value deals and strategic direction changes.'
    },
    'deal-structuring': {
      traditional: 'You manually structure deal terms, valuation models, and financial arrangements without AI assistance.',
      assisted: 'AI provides valuation suggestions, term optimization, and structuring recommendations while you maintain control over final deal terms.',
      autonomous: 'AI automatically optimizes deal structures, suggests terms, and models scenarios. You\'ll approve major terms and strategic decisions.'
    },
    'fund-operations': {
      traditional: 'You manually manage fund operations, capital calls, and regulatory compliance without AI assistance.',
      assisted: 'AI automates routine operations, provides compliance alerts, and suggests optimizations while you control strategic decisions.',
      autonomous: 'AI manages fund operations automatically, handles capital calls, and ensures compliance. You\'ll approve major operational changes.'
    },
    'investment-committee': {
      traditional: 'You manually manage committee meetings, proposal reviews, and decision tracking without AI assistance.',
      assisted: 'AI provides meeting optimization, proposal analysis, and decision support while you maintain control over committee processes.',
      autonomous: 'AI manages committee workflows, schedules meetings, and tracks decisions. You\'ll approve major policy changes and strategic directions.'
    },
    'legal-management': {
      traditional: 'You manually handle legal documents, compliance tracking, and contract management without AI assistance.',
      assisted: 'AI provides document analysis, compliance alerts, and legal insights while you control final legal decisions and strategy.',
      autonomous: 'AI manages legal workflows, tracks compliance, and handles routine legal tasks. You\'ll approve major legal decisions and policy changes.'
    },
    'market-intelligence': {
      traditional: 'You manually research markets, analyze trends, and generate insights without AI assistance.',
      assisted: 'AI provides market analysis, trend predictions, and intelligence reports while you control strategic market decisions.',
      autonomous: 'AI continuously monitors markets, generates insights, and alerts you to opportunities. You\'ll approve major strategic market decisions.'
    },
    'advanced-analytics': {
      traditional: 'You manually build models, run analysis, and generate insights without AI assistance.',
      assisted: 'AI provides predictive models, automated analysis, and data insights while you control analytical decisions and interpretations.',
      autonomous: 'AI continuously runs models, generates predictions, and optimizes analytics. You\'ll approve major analytical strategies and model deployments.'
    },
    'lp-portal': {
      traditional: 'You manually manage LP communications, reporting, and relationship activities without AI assistance.',
      assisted: 'AI provides LP insights, automated reporting, and relationship recommendations while you control LP strategy and communications.',
      autonomous: 'AI manages LP relationships, generates reports, and optimizes communications. You\'ll approve major LP decisions and strategy changes.'
    },
    'gp-portal': {
      traditional: 'You manually manage GP relationships, deal submissions, and partnership activities without AI assistance.',
      assisted: 'AI provides GP insights, deal analysis, and relationship optimization while you control GP strategy and partnership decisions.',
      autonomous: 'AI manages GP relationships, processes submissions, and optimizes partnerships. You\'ll approve major GP decisions and strategic changes.'
    }
  }
  
  return explanations[moduleContext as keyof typeof explanations]?.[mode] || explanations.dashboard[mode]
}

const getModeIcon = (mode: HybridMode) => {
  switch (mode) {
    case 'traditional': return User
    case 'assisted': return Brain
    case 'autonomous': return Bot
    default: return User
  }
}

const getModeLabel = (mode: HybridMode) => {
  switch (mode) {
    case 'traditional': return 'I\'ll Drive'
    case 'assisted': return 'Help me Drive'
    case 'autonomous': return 'You Drive'
    default: return 'I\'ll Drive'
  }
}

const getModeEmoji = (mode: HybridMode) => {
  switch (mode) {
    case 'traditional': return '🎯'
    case 'assisted': return '🤝'
    case 'autonomous': return '🚀'
    default: return '🎯'
  }
}

const getStatisticsDisplay = (mode: HybridMode, statistics?: HybridModeExplanationProps['statistics']) => {
  if (!statistics) {
    // Provide default statistics based on mode
    switch (mode) {
      case 'traditional':
        return [
          'Manual control: 100%',
          'AI assistance: 0%',
          'Full user oversight'
        ]
      case 'assisted':
        return [
          `Efficiency gain: ${statistics?.efficiency || 25}%`,
          `AI automation: ${statistics?.automation || 40}%`,
          `Accuracy improvement: ${statistics?.accuracy || 15}%`
        ]
      case 'autonomous':
        return [
          `Efficiency gain: ${statistics?.efficiency || 45}%`,
          `AI automation: ${statistics?.automation || 85}%`,
          `Time saved: ${statistics?.timeSaved || '2-4 hours/day'}`
        ]
      default:
        return []
    }
  }
  
  return [
    statistics.efficiency ? `Efficiency gain: ${statistics.efficiency}%` : null,
    statistics.automation ? `AI automation: ${statistics.automation}%` : null,
    statistics.accuracy ? `Accuracy improvement: ${statistics.accuracy}%` : null,
    statistics.timeSaved ? `Time saved: ${statistics.timeSaved}` : null
  ].filter(Boolean)
}

export function HybridModeExplanation({
  currentMode,
  moduleContext = 'dashboard',
  className = '',
  showIcon = true,
  showModeName = true,
  showStatistics = true,
  statistics
}: HybridModeExplanationProps) {
  const ModeIcon = getModeIcon(currentMode)
  const explanation = getModeExplanation(currentMode, moduleContext)
  const modeLabel = getModeLabel(currentMode)
  const modeEmoji = getModeEmoji(currentMode)
  const stats = getStatisticsDisplay(currentMode, statistics)

  return (
    <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {showIcon && (
            <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            {showModeName && (
              <h4 className="font-semibold text-yellow-900 mb-1 flex items-center space-x-2">
                <span>Current Mode: {modeLabel}</span>
                <span>{modeEmoji}</span>
                {showIcon && <ModeIcon className="h-4 w-4 text-yellow-600" />}
              </h4>
            )}
            
            <p className="text-sm text-yellow-800 mb-2">
              {explanation}
            </p>
            
            {showStatistics && stats.length > 0 && (
              <div className="flex items-center flex-wrap gap-4 text-xs text-yellow-700">
                {stats.map((stat, index) => (
                  <span key={index}>• {stat}</span>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-yellow-700">
              <span>• Switch modes anytime using the button above</span>
              <span>• Each mode offers different levels of AI assistance</span>
              <span>• Your data and preferences are preserved across modes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HybridModeExplanation