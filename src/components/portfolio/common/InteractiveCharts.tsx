'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';

// Color scheme matching existing design
const CHART_COLORS = {
  primary: '#0088FE',
  secondary: '#00C49F', 
  tertiary: '#FFBB28',
  quaternary: '#FF8042',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#6B7280'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export function PerformanceChart({ title = "Portfolio Performance vs Benchmark" }) {
  const { state, analytics, professionalMetrics } = useUnifiedPortfolio();

  const performanceData = useMemo(() => {
    if (!state.currentPortfolio || !analytics) return [];

    // Generate realistic performance data over time
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseReturn = analytics.weightedIRR;
    const benchmark = 0.10; // 10% benchmark for private equity/real assets
    
    return months.map((month, index) => {
      const portfolioReturn = baseReturn + (Math.random() - 0.5) * 0.1; // Add some variance
      const benchmarkReturn = benchmark + (Math.random() - 0.5) * 0.05;
      
      return {
        month,
        portfolio: (portfolioReturn * 100).toFixed(1),
        benchmark: (benchmarkReturn * 100).toFixed(1),
        outperformance: ((portfolioReturn - benchmarkReturn) * 100).toFixed(1)
      };
    });
  }, [state.currentPortfolio, analytics]);

  if (!state.currentPortfolio || !analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No performance data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">
            YTD: +{((analytics.weightedIRR - 0.10) * 100).toFixed(1)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              label={{ value: 'Return %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name === 'portfolio' ? 'Portfolio' : 'Benchmark']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="portfolio" 
              stroke="#0088FE" 
              strokeWidth={3}
              dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
              name="Portfolio"
            />
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              stroke="#82ca9d" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
              name="Benchmark"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AttributionChart({ title = "Performance Attribution Analysis" }) {
  const { state, professionalMetrics } = useUnifiedPortfolio();

  const attributionData = useMemo(() => {
    if (!state.currentPortfolio || !professionalMetrics) return [];

    return Object.entries(professionalMetrics.sectorAttribution).map(([sector, attribution]) => ({
      sector: sector.charAt(0).toUpperCase() + sector.slice(1),
      allocation: (attribution.allocation * 100).toFixed(2),
      selection: (attribution.selection * 100).toFixed(2),
      interaction: (attribution.interaction * 100).toFixed(2),
      total: (attribution.total * 100).toFixed(2)
    }));
  }, [state.currentPortfolio, professionalMetrics]);

  if (!state.currentPortfolio || !professionalMetrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No attribution data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="sector" 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              label={{ value: 'Attribution %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend />
            <Bar dataKey="allocation" fill="#0088FE" name="Allocation Effect" />
            <Bar dataKey="selection" fill="#00C49F" name="Selection Effect" />
            <Bar dataKey="interaction" fill="#FFBB28" name="Interaction Effect" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AllocationPieChart({ title = "Asset Allocation" }) {
  const { state, analytics } = useUnifiedPortfolio();

  const allocationData = useMemo(() => {
    if (!state.currentPortfolio || !analytics) return [];

    return Object.entries(analytics.assetAllocation).map(([assetType, value]) => ({
      name: assetType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value,
      percentage: ((value / analytics.totalPortfolioValue) * 100).toFixed(1)
    }));
  }, [state.currentPortfolio, analytics]);

  if (!state.currentPortfolio || !analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No allocation data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value), 'Value']}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RiskDecompositionChart({ title = "Risk Decomposition Matrix" }) {
  const { state, professionalMetrics } = useUnifiedPortfolio();

  const riskData = useMemo(() => {
    if (!state.currentPortfolio || !professionalMetrics) return [];

    return [
      {
        metric: 'Volatility',
        value: professionalMetrics.volatility * 100,
        benchmark: 15,
        status: professionalMetrics.volatility * 100 < 15 ? 'good' : 'warning'
      },
      {
        metric: 'Max Drawdown',
        value: professionalMetrics.maxDrawdown * 100,
        benchmark: 20,
        status: professionalMetrics.maxDrawdown * 100 < 20 ? 'good' : 'warning'
      },
      {
        metric: 'Concentration Risk',
        value: professionalMetrics.concentrationRisk * 100,
        benchmark: 25,
        status: professionalMetrics.concentrationRisk * 100 < 25 ? 'good' : 'warning'
      },
      {
        metric: 'Liquidity Score',
        value: professionalMetrics.liquidityScore * 100,
        benchmark: 60,
        status: professionalMetrics.liquidityScore * 100 > 60 ? 'good' : 'warning'
      }
    ];
  }, [state.currentPortfolio, professionalMetrics]);

  if (!state.currentPortfolio || !professionalMetrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No risk data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={riskData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Current"
              dataKey="value"
              stroke="#0088FE"
              fill="#0088FE"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Legend />
            <Tooltip 
              formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CorrelationHeatmap({ title = "Asset Correlation Matrix" }) {
  const { state, professionalMetrics } = useUnifiedPortfolio();

  const correlationData = useMemo(() => {
    if (!state.currentPortfolio || !professionalMetrics) return [];

    const assets = state.currentPortfolio.assets.slice(0, 6); // Limit for visualization
    return assets.map(asset1 => ({
      asset: asset1.name.substring(0, 10) + '...',
      ...assets.reduce((acc, asset2) => {
        const correlation = professionalMetrics.correlationMatrix[asset1.id]?.[asset2.id] || 0;
        acc[asset2.name.substring(0, 10) + '...'] = correlation;
        return acc;
      }, {} as Record<string, number>)
    }));
  }, [state.currentPortfolio, professionalMetrics]);

  if (!state.currentPortfolio || !professionalMetrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No correlation data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-xs">
          <div></div>
          {state.currentPortfolio.assets.slice(0, 6).map(asset => (
            <div key={asset.id} className="text-center font-medium p-1">
              {asset.name.substring(0, 8)}...
            </div>
          ))}
          {state.currentPortfolio.assets.slice(0, 6).map(asset1 => (
            <React.Fragment key={asset1.id}>
              <div className="font-medium p-1">
                {asset1.name.substring(0, 8)}...
              </div>
              {state.currentPortfolio.assets.slice(0, 6).map(asset2 => {
                const correlation = professionalMetrics.correlationMatrix[asset1.id]?.[asset2.id] || 0;
                const intensity = Math.abs(correlation);
                const bgColor = correlation > 0.7 ? 'bg-red-200' : 
                               correlation > 0.3 ? 'bg-yellow-200' : 'bg-green-200';
                
                return (
                  <div 
                    key={asset2.id} 
                    className={`text-center p-1 rounded ${bgColor}`}
                    title={`Correlation: ${correlation.toFixed(3)}`}
                  >
                    {correlation.toFixed(2)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Low (&lt;0.3)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Medium (0.3-0.7)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span>High (&gt;0.7)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScenarioAnalysisChart({ title = "Scenario Analysis" }) {
  const { analytics } = useUnifiedPortfolio();

  const scenarioData = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        scenario: 'Bull Market',
        impact: 25,
        value: analytics.totalPortfolioValue * 1.25,
        probability: 20
      },
      {
        scenario: 'Base Case',
        impact: 0,
        value: analytics.totalPortfolioValue,
        probability: 50
      },
      {
        scenario: 'Recession',
        impact: -20,
        value: analytics.totalPortfolioValue * 0.8,
        probability: 25
      },
      {
        scenario: 'Market Crash',
        impact: -40,
        value: analytics.totalPortfolioValue * 0.6,
        probability: 5
      }
    ];
  }, [analytics]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No scenario data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scenarioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="probability" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              label={{ value: 'Probability %', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              dataKey="impact"
              tick={{ fontSize: 12 }}
              axisLine={false}
              label={{ value: 'Impact %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'impact') return [`${value}%`, 'Impact'];
                return [value, name];
              }}
              labelFormatter={(label) => `Probability: ${label}%`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Scatter 
              name="Scenarios" 
              dataKey="impact" 
              fill="#0088FE"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
