'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle, Target } from 'lucide-react';

// Sample performance data
const performanceData = [
  { quarter: 'Q1 2023', value: 8.5, benchmark: 6.2 },
  { quarter: 'Q2 2023', value: 9.2, benchmark: 6.5 },
  { quarter: 'Q3 2023', value: 10.3, benchmark: 6.8 },
  { quarter: 'Q4 2023', value: 11.5, benchmark: 7.0 },
  { quarter: 'Q1 2024', value: 12.8, benchmark: 7.5 },
  { quarter: 'Q2 2024', value: 14.2, benchmark: 8.0 },
  { quarter: 'Q3 2024', value: 15.6, benchmark: 8.3 },
  { quarter: 'Q4 2024', value: 17.1, benchmark: 8.8 },
  { quarter: 'Q1 2025', value: 17.4, benchmark: 9.0 },
];

// Sample allocation data
const allocationData = [
  { name: 'LP Stakes', value: 46.1, color: '#3182CE' },
  { name: 'Direct Secondary', value: 32.0, color: '#38A169' },
  { name: 'GP-Led Restructuring', value: 12.0, color: '#DD6B20' },
  { name: 'Special Situations', value: 9.9, color: '#805AD5' },
];

// Sample sector data
const sectorData = [
  { name: 'Financial Services', value: 24.0, targetValue: 25.0, color: '#3182CE' },
  { name: 'Industrial', value: 20.0, targetValue: 20.0, color: '#38A169' },
  { name: 'Technology', value: 16.0, targetValue: 15.0, color: '#805AD5' },
  { name: 'Consumer', value: 14.0, targetValue: 15.0, color: '#DD6B20' },
  { name: 'Healthcare', value: 12.0, targetValue: 10.0, color: '#E53E3E' },
  { name: 'Resources', value: 8.0, targetValue: 10.0, color: '#D69E2E' },
  { name: 'Infrastructure', value: 6.0, targetValue: 5.0, color: '#718096' },
];

// Sample risk indicators
const riskData = [
  { name: 'Concentration', value: 8.0, limit: 10.0, status: 'Within Limit' },
  { name: 'Sector', value: 24.0, limit: 30.0, status: 'Within Limit' },
  { name: 'Vintage', value: 71.7, limit: 75.0, status: 'Within Limit' },
  { name: 'Liquidity', value: 15.2, limit: 25.0, status: 'Within Limit' },
  { name: 'Valuation', value: 23.5, limit: 30.0, status: 'Within Limit' },
  { name: 'Currency', value: 8.5, limit: 10.0, status: 'Within Limit' },
];

// Pipeline data
const pipelineData = [
  { name: 'Initial Screening', value: 550.0 },
  { name: 'Due Diligence', value: 325.0 },
  { name: 'Advanced Negotiations', value: 200.0 },
];

const topInvestments = [
  {
    name: 'Financial Services Fund III',
    type: 'LP Stake',
    sector: 'Financial Services',
    cost: 225.0,
    currentValue: 310.5,
    moic: 1.38,
    irr: 20.5,
    portfolioPercent: 8.0,
  },
  {
    name: 'Technology Growth Partners',
    type: 'LP Stake',
    sector: 'Technology',
    cost: 200.0,
    currentValue: 264.0,
    moic: 1.32,
    irr: 18.2,
    portfolioPercent: 6.8,
  },
  {
    name: 'Industrial Manufacturing Co.',
    type: 'Direct',
    sector: 'Industrial',
    cost: 180.0,
    currentValue: 230.4,
    moic: 1.28,
    irr: 16.5,
    portfolioPercent: 5.9,
  },
  {
    name: 'Consumer Retail Holdings',
    type: 'Direct',
    sector: 'Consumer',
    cost: 170.0,
    currentValue: 204.0,
    moic: 1.20,
    irr: 14.8,
    portfolioPercent: 5.3,
  },
  {
    name: 'Healthcare Platform',
    type: 'GP-Led',
    sector: 'Healthcare',
    cost: 165.0,
    currentValue: 211.2,
    moic: 1.28,
    irr: 17.8,
    portfolioPercent: 5.5,
  },
];

interface DashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous';
  data?: {
    aum?: number;
    irr?: number;
    moic?: number;
    dryPowder?: number;
  };
}

// AI Insights component for assisted/autonomous modes
const AIInsightsPanel = ({ mode }: { mode: string }) => {
  if (mode === 'traditional') return null;

  const insights = [
    {
      type: 'opportunity',
      title: 'Deal Flow Optimization',
      description: 'Thando identified 3 high-potential opportunities in Healthcare sector matching your criteria',
      action: 'Review Opportunities',
      confidence: 0.87
    },
    {
      type: 'warning',
      title: 'Concentration Risk Alert',
      description: 'Financial Services allocation approaching target maximum (24% vs 25% limit)',
      action: 'Adjust Portfolio',
      confidence: 0.92
    },
    {
      type: 'insight',
      title: 'Performance Pattern',
      description: 'Current vintage concentration optimal for risk-return profile based on historical analysis',
      action: 'View Analysis',
      confidence: 0.76
    }
  ];

  return (
    <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Thando Insights</h3>
        <Badge variant="secondary" className="text-blue-700">
          {mode === 'autonomous' ? 'Autonomous' : 'Assisted'} Mode
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              {insight.type === 'opportunity' && <Target className="h-4 w-4 text-green-600" />}
              {insight.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
              {insight.type === 'insight' && <TrendingUp className="h-4 w-4 text-blue-600" />}
              <h4 className="font-medium text-sm">{insight.title}</h4>
            </div>
            <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" className="text-xs">
                {insight.action}
              </Button>
              <span className="text-xs text-gray-500">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export function SecondaryEdgeDashboard({ mode = 'traditional', data }: DashboardProps) {
  const defaultData = {
    aum: 3880,
    irr: 17.4,
    moic: 1.38,
    dryPowder: 1240,
  };

  const dashboardData = { ...defaultData, ...data };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* AI Insights Panel - Only in assisted/autonomous modes */}
      <AIInsightsPanel mode={mode} />

      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-500 font-medium">Assets Under Management</p>
          <p className="text-3xl font-bold text-gray-900">${dashboardData.aum.toFixed(0)}M</p>
          <p className="text-sm text-green-600 font-medium">+6.2% QoQ</p>
          {mode !== 'traditional' && (
            <p className="text-xs text-blue-600 mt-1">Thando: On track for targets</p>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 font-medium">IRR (Since Inception)</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.irr}%</p>
          <p className="text-sm text-green-600 font-medium">+0.3% QoQ</p>
          {mode !== 'traditional' && (
            <p className="text-xs text-blue-600 mt-1">Thando: Above benchmark</p>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 font-medium">MOIC (Current)</p>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.moic}x</p>
          <p className="text-sm text-green-600 font-medium">+0.03x QoQ</p>
          {mode !== 'traditional' && (
            <p className="text-xs text-blue-600 mt-1">Thando: Strong performance</p>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 font-medium">Dry Powder</p>
          <p className="text-3xl font-bold text-gray-900">${dashboardData.dryPowder}M</p>
          <p className="text-sm text-red-500 font-medium">-$225.4M QoQ</p>
          {mode !== 'traditional' && (
            <p className="text-xs text-blue-600 mt-1">Thando: Optimal deployment</p>
          )}
        </Card>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Performance vs. Benchmark</h2>
            {mode !== 'traditional' && (
              <Badge variant="outline" className="text-blue-600">
                AI Enhanced
              </Badge>
            )}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'IRR']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="SecondaryEdge IRR" 
                  stroke="#3182CE" 
                  strokeWidth={3} 
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  name="PE Benchmark" 
                  stroke="#E53E3E" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Allocation Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Portfolio Allocation by Strategy</h2>
            {mode !== 'traditional' && (
              <Badge variant="outline" className="text-blue-600">
                AI Optimized
              </Badge>
            )}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Allocation */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sector Allocation vs. Target</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 120,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                <Legend />
                <Bar dataKey="value" name="Current Allocation" fill="#3182CE" />
                <Bar dataKey="targetValue" name="Target Allocation" fill="#A0AEC0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Pipeline Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction Pipeline ($ Million)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}M`} />
                <Tooltip formatter={(value) => [`$${value}M`, 'Estimated Value']} />
                <Bar dataKey="value" fill="#38A169">
                  {pipelineData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#A0AEC0' : index === 1 ? '#3182CE' : '#38A169'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Risk Indicators */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Risk Indicators</h2>
          {mode !== 'traditional' && (
            <Badge variant="outline" className="text-green-600">
              AI Monitored
            </Badge>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Risk Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Current Value</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Risk Limit</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Utilization</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riskData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name} Risk</td>
                  <td className="px-4 py-3 text-gray-700">{item.value}%</td>
                  <td className="px-4 py-3 text-gray-700">{item.limit}%</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.value / item.limit > 0.8 ? 'bg-red-500' : 
                          item.value / item.limit > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${(item.value / item.limit) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Top Investments */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top 5 Investments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Investment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Sector</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Cost ($ Million)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Current Value ($ Million)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">MOIC</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">IRR</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">% of Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topInvestments.map((investment, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{investment.name}</td>
                  <td className="px-4 py-3 text-gray-700">{investment.type}</td>
                  <td className="px-4 py-3 text-gray-700">{investment.sector}</td>
                  <td className="px-4 py-3 text-gray-700">{investment.cost.toFixed(1)}</td>
                  <td className="px-4 py-3 text-gray-700">{investment.currentValue.toFixed(1)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{investment.moic}x</td>
                  <td className="px-4 py-3 font-medium text-green-600">{investment.irr}%</td>
                  <td className="px-4 py-3 text-gray-700">{investment.portfolioPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Footer */}
      <Card className="bg-gray-50 p-4 text-center">
        <p className="text-xs text-gray-500">
          Edge Platform | Advanced Portfolio Management
          {mode !== 'traditional' && ' & AI Intelligence'} | Data as of {new Date().toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Confidential: For Investment Committee Use Only
        </p>
      </Card>
    </div>
  );
}