'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  MoreHorizontal,
  Filter,
  Maximize2,
  ZoomIn,
  Download,
  RefreshCw,
  Info
} from 'lucide-react'

interface RiskHeatMapProps {
  risks: any[]
}

export function RiskHeatMap({ risks }: RiskHeatMapProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [view, setView] = React.useState<'grid' | 'matrix'>('matrix')
  const [selectedCell, setSelectedCell] = React.useState<{impact: number, probability: number} | null>(null)
  const [animateHeatMap, setAnimateHeatMap] = React.useState(false)

  // Create heat map matrix data
  const probabilityLevels = ['low', 'medium', 'high']
  const impactLevels = ['low', 'medium', 'high']
  
  const getMatrixPosition = (risk: any) => {
    const probIndex = probabilityLevels.indexOf(risk.probability)
    const impactIndex = impactLevels.indexOf(risk.impact)
    return { probability: probIndex, impact: impactIndex }
  }

  // Group risks by probability and impact
  const matrixData = React.useMemo(() => {
    const matrix: any[][][] = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []))
    
    risks.forEach(risk => {
      const pos = getMatrixPosition(risk)
      if (pos.probability >= 0 && pos.impact >= 0) {
        matrix[pos.impact][pos.probability].push(risk)
      }
    })
    
    return matrix
  }, [risks])

  const getRiskColor = (riskCount: number, maxCount: number) => {
    if (riskCount === 0) return 'bg-gray-50 border-gray-200'
    const intensity = riskCount / Math.max(maxCount, 1)
    
    if (intensity >= 0.8) return 'bg-red-500 text-white border-red-600'
    if (intensity >= 0.6) return 'bg-red-400 text-white border-red-500'
    if (intensity >= 0.4) return 'bg-orange-400 text-white border-orange-500'
    if (intensity >= 0.2) return 'bg-yellow-400 text-black border-yellow-500'
    return 'bg-green-200 text-black border-green-300'
  }

  const maxRisksInCell = Math.max(...matrixData.flat().map(cell => cell.length))

  const categories = ['all', ...Array.from(new Set(risks.map(r => r.category)))]

  const filteredRisks = selectedCategory === 'all' 
    ? risks 
    : risks.filter(r => r.category === selectedCategory)

  const renderMatrixView = () => (
    <div className="space-y-4">
      {/* Matrix Grid */}
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
          Impact Level
        </div>
        
        <div className="ml-4">
          {/* Impact levels (Y-axis) */}
          <div className="flex">
            <div className="w-16 flex flex-col justify-between h-64 py-2">
              {['High', 'Medium', 'Low'].map(level => (
                <div key={level} className="text-xs text-gray-600 text-right pr-2">
                  {level}
                </div>
              ))}
            </div>
            
            {/* Matrix cells */}
            <div className="grid grid-cols-3 gap-1 flex-1 max-w-96">
              {matrixData.map((row, impactIndex) => 
                row.map((cell, probIndex) => {
                  const riskCount = cell.length
                  const cellRisks = selectedCategory === 'all' ? cell : cell.filter((r: any) => r.category === selectedCategory)
                  const displayCount = cellRisks.length
                  
                  return (
                    <div
                      key={`${impactIndex}-${probIndex}`}
                      className={`
                        aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all hover:scale-105 relative
                        ${getRiskColor(displayCount, maxRisksInCell)}
                        ${displayCount > 0 ? 'hover:shadow-lg' : ''}
                        ${selectedCell?.impact === impactIndex && selectedCell?.probability === probIndex ? 'ring-2 ring-blue-500' : ''}
                        ${animateHeatMap ? 'animate-pulse' : ''}
                      `}
                      title={`${displayCount} risk${displayCount !== 1 ? 's' : ''}`}
                      onClick={() => setSelectedCell(displayCount > 0 ? {impact: impactIndex, probability: probIndex} : null)}
                    >
                      <div className="h-full flex flex-col justify-center items-center">
                        <div className="text-lg font-bold">{displayCount}</div>
                        {displayCount > 0 && (
                          <div className="text-xs opacity-75">
                            risk{displayCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex mt-2">
            <div className="w-16" />
            <div className="grid grid-cols-3 gap-1 flex-1 max-w-96">
              {['Low', 'Medium', 'High'].map(level => (
                <div key={level} className="text-xs text-center text-gray-600">
                  {level}
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis label */}
          <div className="text-center mt-2">
            <div className="text-sm font-medium text-gray-600">Probability Level</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
          <span>Low (1-2 risks)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
          <span>Medium (3-4 risks)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 border border-orange-500 rounded"></div>
          <span>High (5-6 risks)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
          <span>Critical (7+ risks)</span>
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            Selected Cell: {impactLevels[2 - selectedCell.impact]} Impact × {probabilityLevels[selectedCell.probability]} Probability
          </h4>
          <div className="space-y-2">
            {matrixData[selectedCell.impact][selectedCell.probability]
              .filter((r: any) => selectedCategory === 'all' || r.category === selectedCategory)
              .map((risk: any) => (
                <div key={risk.id} className="bg-white rounded p-2 text-sm">
                  <div className="font-medium">{risk.title}</div>
                  <div className="text-gray-600">Score: {risk.riskScore}/10 | Category: {risk.category}</div>
                </div>
              ))
            }
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => setSelectedCell(null)}
          >
            Close Details
          </Button>
        </div>
      )}
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredRisks.map((risk) => (
        <div key={risk.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm">{risk.title}</h4>
            <div className="flex flex-col space-y-1">
              <Badge variant="outline" className={`text-xs ${
                risk.level === 'high' ? 'border-red-300 text-red-700' :
                risk.level === 'medium' ? 'border-orange-300 text-orange-700' :
                'border-green-300 text-green-700'
              }`}>
                {risk.level}
              </Badge>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 mb-3 line-clamp-2">
            {risk.description}
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div>P: {risk.probability}</div>
              <div>I: {risk.impact}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{risk.riskScore}/10</div>
              <div className="text-gray-500">{risk.category}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-red-700">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Risk Heat Map
          </CardTitle>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border rounded px-2 py-1"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnimateHeatMap(!animateHeatMap)}
              title="Animate heat map"
            >
              <RefreshCw className={`w-4 h-4 ${animateHeatMap ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView(view === 'matrix' ? 'grid' : 'matrix')}
            >
              {view === 'matrix' ? <Eye className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Export heat map"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'matrix' ? renderMatrixView() : renderGridView()}
      </CardContent>
    </Card>
  )
}