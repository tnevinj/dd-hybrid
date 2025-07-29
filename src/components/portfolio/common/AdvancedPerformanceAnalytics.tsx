'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { PrivateEquityAnalytics, PrivateEquityMetrics } from '@/lib/private-equity-analytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function PrivateEquityMetricsCard() {
  const { state } = useUnifiedPortfolio();

  const peMetrics = useMemo(() => {
    if (!state.currentPortfolio) return null;
    const peAnalytics = new PrivateEquityAnalytics(state.currentPortfolio.assets);
    return peAnalytics.generatePrivateEquityMetrics();
  }, [state.currentPortfolio]);

  if (!peMetrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">No private equity data available</p>
        </CardContent>
      </Card>
    );
  }

  const formatDecimal = (value: number) => value.toFixed(2);
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">TVPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            peMetrics.tvpi > 2.0 ? 'text-green-600' :
            peMetrics.tvpi > 1.5 ? 'text-blue-600' :
            peMetrics.tvpi > 1.0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {formatDecimal(peMetrics.tvpi)}x
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total Value to Paid-in
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">DPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            peMetrics.dpi > 1.0 ? 'text-green-600' :
            peMetrics.dpi > 0.5 ? 'text-blue-600' : 'text-yellow-600'
          }`}>
            {formatDecimal(peMetrics.dpi)}x
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Distributions to Paid-in
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">PME</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            peMetrics.pme > 1.2 ? 'text-green-600' :
            peMetrics.pme > 1.0 ? 'text-blue-600' :
            peMetrics.pme > 0.9 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {formatDecimal(peMetrics.pme)}x
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Public Market Equivalent
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Net IRR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            peMetrics.netIRR > 0.20 ? 'text-green-600' :
            peMetrics.netIRR > 0.15 ? 'text-blue-600' :
            peMetrics.netIRR > 0.10 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {formatPercentage(peMetrics.netIRR)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Net Internal Rate of Return
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function VintageAnalysisChart() {
  const { state } = useUnifiedPortfolio();

  const vintageData = useMemo(() => {
    if (!state.currentPortfolio) return [];
    const peAnalytics = new PrivateEquityAnalytics(state.currentPortfolio.assets);
    const vintageAnalysis = peAnalytics.calculateVintageAnalysis();
    
    return Object.values(vintageAnalysis).map(vintage => ({
      year: vintage.year,
      tvpi: vintage.tvpi,
      dpi: vintage.dpi,
      irr: vintage.irr * 100, // Convert to percentage
      investments: vintage.investmentCount,
      maturity: vintage.maturity
    }));
  }, [state.currentPortfolio]);

  if (vintageData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No vintage data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vintage Year Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vintageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'irr') return [`${value.toFixed(1)}%`, 'IRR'];
                if (name === 'tvpi' || name === 'dpi') return [`${value.toFixed(2)}x`, name.toUpperCase()];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="tvpi" fill="#0088FE" name="TVPI" />
            <Bar dataKey="dpi" fill="#00C49F" name="DPI" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function JCurveChart() {
  const { state } = useUnifiedPortfolio();

  const jCurveData = useMemo(() => {
    if (!state.currentPortfolio) return [];
    const peAnalytics = new PrivateEquityAnalytics(state.currentPortfolio.assets);
    return peAnalytics.calculateJCurveAnalysis();
  }, [state.currentPortfolio]);

  if (jCurveData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No J-curve data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>J-Curve Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={jCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="quarter" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Multiple', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'multiple') return [`${value.toFixed(2)}x`, 'Multiple'];
                return [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), name];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="multiple" 
              stroke="#0088FE" 
              strokeWidth={3}
              dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
              name="Fund Multiple"
            />
            <Line 
              type="monotone" 
              dataKey="netValue" 
              stroke="#00C49F" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Net Cash Flow"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StageAnalysisChart() {
  const { state } = useUnifiedPortfolio();

  const stageData = useMemo(() => {
    if (!state.currentPortfolio) return [];
    const peAnalytics = new PrivateEquityAnalytics(state.currentPortfolio.assets);
    const stageAnalysis = peAnalytics.calculateStageAnalysis();
    
    return Object.values(stageAnalysis).map(stage => ({
      stage: stage.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      investments: stage.investmentCount,
      totalInvested: stage.totalInvested,
      currentValue: stage.currentValue,
      successRate: stage.successRate * 100,
      avgMultiple: stage.avgMultiple,
      avgHoldingPeriod: stage.avgHoldingPeriod
    }));
  }, [state.currentPortfolio]);

  if (stageData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No stage data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Stage Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stageData.map((stage, index) => (
            <div key={stage.stage} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                <Badge variant="outline">
                  {stage.investments} investments
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Avg Multiple:</span>
                  <div className={`font-semibold ${
                    stage.avgMultiple > 2.0 ? 'text-green-600' :
                    stage.avgMultiple > 1.5 ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {stage.avgMultiple.toFixed(2)}x
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Success Rate:</span>
                  <div className={`font-semibold ${
                    stage.successRate > 70 ? 'text-green-600' :
                    stage.successRate > 50 ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {stage.successRate.toFixed(0)}%
                  </div>
                  <Progress value={stage.successRate} className="h-1 mt-1" />
                </div>
                <div>
                  <span className="text-gray-600">Avg Holding:</span>
                  <div className="font-semibold text-gray-600">
                    {stage.avgHoldingPeriod.toFixed(1)} years
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Current Value:</span>
                  <div className="font-semibold text-gray-900">
                    ${(stage.currentValue / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SectorPerformanceChart() {
  const { state } = useUnifiedPortfolio();

  const sectorData = useMemo(() => {
    if (!state.currentPortfolio) return [];
    const peAnalytics = new PrivateEquityAnalytics(state.currentPortfolio.assets);
    const sectorPerformance = peAnalytics.calculateSectorPerformance();
    
    return Object.values(sectorPerformance).map(sector => ({
      sector: sector.sector,
      tvpi: sector.tvpi,
      irr: sector.irr * 100,
      investments: sector.investmentCount,
      invested: sector.totalInvested,
      topQuartile: sector.topQuartile
    }));
  }, [state.currentPortfolio]);

  if (sectorData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No sector data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sector Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sectorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'irr') return [`${value.toFixed(1)}%`, 'IRR'];
                if (name === 'tvpi') return [`${value.toFixed(2)}x`, 'TVPI'];
                return [value, name];
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="tvpi" 
              stackId="1" 
              stroke="#0088FE" 
              fill="#0088FE" 
              name="TVPI"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="irr" 
              stackId="2" 
              stroke="#00C49F" 
              fill="#00C49F" 
              name="IRR %"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}