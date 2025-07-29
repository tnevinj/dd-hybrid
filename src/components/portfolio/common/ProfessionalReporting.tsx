'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReportConfig {
  type: 'quarterly' | 'annual' | 'custom';
  format: 'pdf' | 'excel' | 'powerpoint';
  sections: string[];
  includeMetrics: string[];
  customDateRange?: {
    start: string;
    end: string;
  };
}

export function ProfessionalReporting() {
  const { state, analytics, professionalMetrics } = useUnifiedPortfolio();
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'quarterly',
    format: 'pdf',
    sections: ['executive-summary', 'performance', 'risk-analysis', 'attribution'],
    includeMetrics: ['twr', 'sharpe', 'var', 'attribution']
  });
  const [generating, setGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: '1',
      name: 'Quarterly Performance Report',
      schedule: 'quarterly',
      nextRun: '2024-04-01',
      recipients: ['investors@example.com'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Monthly Risk Dashboard',
      schedule: 'monthly',
      nextRun: '2024-02-01',
      recipients: ['risk@example.com'],
      status: 'active'
    }
  ]);

  if (!state.currentPortfolio || !analytics || !professionalMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading reporting data...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const generateReport = async () => {
    setGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call an API to generate the report
      const reportData = {
        portfolioName: state.currentPortfolio.name,
        reportDate: new Date().toISOString(),
        config: reportConfig,
        metrics: {
          totalValue: analytics.totalPortfolioValue,
          twr: professionalMetrics.timeWeightedReturn,
          sharpe: professionalMetrics.sharpeRatio,
          var95: professionalMetrics.valueAtRisk95,
          maxDrawdown: professionalMetrics.maxDrawdown
        }
      };

      // Create download link (mock)
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${state.currentPortfolio.name}_Report_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        {/* Generate Report Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={reportConfig.type}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      type: e.target.value as ReportConfig['type']
                    }))}
                  >
                    <option value="quarterly">Quarterly Report</option>
                    <option value="annual">Annual Report</option>
                    <option value="custom">Custom Period</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Format
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={reportConfig.format}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      format: e.target.value as ReportConfig['format']
                    }))}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Workbook</option>
                    <option value="powerpoint">PowerPoint Presentation</option>
                  </select>
                </div>

                {reportConfig.type === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          customDateRange: {
                            ...prev.customDateRange!,
                            start: e.target.value
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          customDateRange: {
                            ...prev.customDateRange!,
                            end: e.target.value
                          }
                        }))}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Include Sections
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'executive-summary', label: 'Executive Summary' },
                      { id: 'performance', label: 'Performance Analysis' },
                      { id: 'risk-analysis', label: 'Risk Analysis' },
                      { id: 'attribution', label: 'Attribution Analysis' },
                      { id: 'esg', label: 'ESG Metrics' },
                      { id: 'market-outlook', label: 'Market Outlook' }
                    ].map(section => (
                      <label key={section.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={reportConfig.sections.includes(section.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportConfig(prev => ({
                                ...prev,
                                sections: [...prev.sections, section.id]
                              }));
                            } else {
                              setReportConfig(prev => ({
                                ...prev,
                                sections: prev.sections.filter(s => s !== section.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{section.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {state.currentPortfolio.name} - {reportConfig.type.charAt(0).toUpperCase() + reportConfig.type.slice(1)} Report
                    </h3>
                    <p className="text-sm text-gray-600">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                    <div className="mt-4 text-left text-sm space-y-1">
                      <p><strong>Portfolio Value:</strong> {formatCurrency(analytics.totalPortfolioValue)}</p>
                      <p><strong>Time-Weighted Return:</strong> {formatPercentage(professionalMetrics.timeWeightedReturn)}</p>
                      <p><strong>Sharpe Ratio:</strong> {professionalMetrics.sharpeRatio.toFixed(3)}</p>
                      <p><strong>VaR (95%):</strong> {formatCurrency(professionalMetrics.valueAtRisk95)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Included Sections:</h4>
                  <div className="flex flex-wrap gap-2">
                    {reportConfig.sections.map(section => (
                      <Badge key={section} variant="outline">
                        {section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateReport}
                  disabled={generating || reportConfig.sections.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Report...
                    </>
                  ) : (
                    `Generate ${reportConfig.format.toUpperCase()} Report`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Report Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Executive Dashboard',
                description: 'High-level overview for senior management',
                sections: ['Executive Summary', 'Key Metrics', 'Risk Overview'],
                format: 'PDF',
                pages: '3-5 pages'
              },
              {
                name: 'Detailed Performance Report',
                description: 'Comprehensive performance analysis',
                sections: ['Performance', 'Attribution', 'Risk Analysis', 'Benchmark Comparison'],
                format: 'PDF',
                pages: '15-20 pages'
              },
              {
                name: 'Risk Management Report',
                description: 'Focus on risk metrics and scenarios',
                sections: ['Risk Metrics', 'VaR Analysis', 'Stress Testing', 'Correlation Analysis'],
                format: 'PDF',
                pages: '8-12 pages'
              },
              {
                name: 'ESG Impact Report',
                description: 'Environmental, Social, and Governance metrics',
                sections: ['ESG Scores', 'Impact Metrics', 'Sustainability Goals'],
                format: 'PDF',
                pages: '6-8 pages'
              },
              {
                name: 'Investor Presentation',
                description: 'PowerPoint presentation for investor meetings',
                sections: ['Portfolio Overview', 'Performance Highlights', 'Market Outlook'],
                format: 'PowerPoint',
                pages: '20-30 slides'
              },
              {
                name: 'Data Export',
                description: 'Raw data export for analysis',
                sections: ['Asset Data', 'Performance Data', 'Risk Data'],
                format: 'Excel',
                pages: 'Multiple sheets'
              }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Format:</span>
                      <Badge variant="outline">{template.format}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Length:</span>
                      <span className="text-gray-700">{template.pages}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sections:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.map(section => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // Set this template as the current config
                      alert(`Template "${template.name}" selected. Configure and generate from the Generate Report tab.`);
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scheduled Reports</h3>
            <Button>
              Add Scheduled Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scheduledReports.map(report => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <Badge className={report.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Schedule:</span>
                      <p className="font-medium capitalize">{report.schedule}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Next Run:</span>
                      <p className="font-medium">{new Date(report.nextRun).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 text-sm">Recipients:</span>
                    <div className="mt-1 space-y-1">
                      {report.recipients.map(recipient => (
                        <Badge key={recipient} variant="outline" className="mr-2">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Run Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setScheduledReports(prev => 
                            prev.map(r => 
                              r.id === report.id 
                                ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
                                : r
                            )
                          );
                        }}
                      >
                        {report.status === 'active' ? 'Pause' : 'Resume'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Quarterly Performance Report Q4 2023', date: '2024-01-15', status: 'delivered', recipients: 3 },
                  { name: 'Monthly Risk Dashboard - December', date: '2024-01-01', status: 'delivered', recipients: 2 },
                  { name: 'Quarterly Performance Report Q3 2023', date: '2023-10-15', status: 'delivered', recipients: 3 },
                  { name: 'Annual Report 2023', date: '2023-12-31', status: 'delivered', recipients: 5 }
                ].map((history, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{history.name}</p>
                      <p className="text-xs text-gray-500">{new Date(history.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {history.recipients} recipients
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {history.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}