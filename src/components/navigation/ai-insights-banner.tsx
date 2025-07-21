'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  X, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Sparkles 
} from 'lucide-react'

export function AIInsightsBanner() {
  const { 
    recommendations, 
    currentMode,
    executeRecommendation,
    dismissRecommendation,
    getHighPriorityRecommendations 
  } = useNavigationStore()

  const [isVisible, setIsVisible] = React.useState(true)
  
  if (!isVisible || currentMode.mode === 'traditional') {
    return null
  }

  const highPriorityRecs = getHighPriorityRecommendations()
  const topRecommendations = recommendations.slice(0, 3)
  
  if (recommendations.length === 0) {
    return null
  }

  const handleDismissBanner = () => {
    setIsVisible(false)
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="w-4 h-4" />
      case 'automation':
        return <Sparkles className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'insight':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                AI Assistant
              </span>
              <Badge variant="ai" className="text-xs">
                {recommendations.length} recommendations
              </Badge>
            </div>
            
            {/* Quick insights */}
            <div className="flex items-center space-x-3">
              {topRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center space-x-2 px-3 py-1 bg-white rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="text-blue-600">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <span className="text-xs text-gray-700 max-w-40 truncate">
                    {rec.title}
                  </span>
                  <Badge 
                    variant={getPriorityVariant(rec.priority)} 
                    className="text-xs"
                  >
                    {rec.priority}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-blue-600 hover:text-blue-800"
                    onClick={() => executeRecommendation(rec.id)}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismissBanner}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* High priority alert */}
        {highPriorityRecs.length > 0 && (
          <div className="mt-2 flex items-center space-x-2 px-3 py-2 bg-red-50 rounded-lg border border-red-100">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">
              {highPriorityRecs.length} urgent recommendation{highPriorityRecs.length !== 1 ? 's' : ''} need{highPriorityRecs.length === 1 ? 's' : ''} attention
            </span>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto h-6 text-xs border-red-200 text-red-700 hover:bg-red-100"
            >
              Review Now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}