import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
  Info,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Radar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { DealOpportunity } from '@/types/deal-screening';
import { useAnthropic } from '@/hooks/use-anthropic';
import { useToast } from '@/hooks/use-toast';

// Risk assessment types
interface RiskFactor {
  id: string;
  name: string;
  category: RiskCategory;
  description: string;
  weight: number;
  score?: number;
  mitigationStrategy?: string;
  impact?: 'low' | 'medium' | 'high';
  aiGenerated?: boolean;
  confidence?: number;
}

type RiskCategory = 
  | 'market' 
  | 'financial' 
  | 'operational' 
  | 'legal' 
  | 'esg' 
  | 'geopolitical' 
  | 'custom';

interface RiskAssessmentData {
  id: string;
  opportunityId: string;
  opportunityName: string;
  createdAt: string;
  updatedAt: string;
  factors: RiskFactor[];
  overallScore: number;
  status: 'draft' | 'completed' | 'approved';
  notes: string;
  aiInsights?: string[];
}

// Predefined risk categories
const riskCategories: { id: RiskCategory; name: string; color: string }[] = [
  { id: 'market', name: 'Market Risk', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'financial', name: 'Financial Risk', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'operational', name: 'Operational Risk', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'legal', name: 'Legal & Regulatory Risk', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'esg', name: 'ESG Risk', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'geopolitical', name: 'Geopolitical Risk', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'custom', name: 'Custom Risk', color: 'bg-gray-100 text-gray-800 border-gray-200' },
];

// Predefined risk factors
const predefinedRiskFactors: RiskFactor[] = [
  {
    id: '1',
    name: 'Liquidity Risk',
    category: 'market',
    description: 'Risk of inability to exit the investment at a reasonable price',
    weight: 0.15,
  },
  {
    id: '2',
    name: 'Valuation Risk',
    category: 'financial',
    description: 'Risk of overvaluation or aggressive valuation assumptions',
    weight: 0.15,
  },
  {
    id: '3',
    name: 'FX Risk',
    category: 'financial',
    description: 'Risk from exchange rate fluctuations',
    weight: 0.1,
  },
  {
    id: '4',
    name: 'Management Risk',
    category: 'operational',
    description: 'Risk related to management capability and experience',
    weight: 0.1,
  },
  {
    id: '5',
    name: 'Regulatory Risk',
    category: 'legal',
    description: 'Risk of changes in regulations affecting the investment',
    weight: 0.1,
  },
  {
    id: '6',
    name: 'Climate Risk',
    category: 'esg',
    description: 'Risk related to climate change and carbon regulations',
    weight: 0.05,
  },
  {
    id: '7',
    name: 'Political Risk',
    category: 'geopolitical',
    description: 'Risk of political instability in target markets',
    weight: 0.1,
  },
  {
    id: '8',
    name: 'Technology Risk',
    category: 'operational',
    description: 'Risk of technological obsolescence or disruption',
    weight: 0.1,
  },
  {
    id: '9',
    name: 'Concentration Risk',
    category: 'market',
    description: 'Risk from high concentration in portfolio',
    weight: 0.05,
  },
  {
    id: '10',
    name: 'Covenant Risk',
    category: 'legal',
    description: 'Risk of covenant breaches on existing debt',
    weight: 0.1,
  },
];

interface ComprehensiveRiskAssessmentProps {
  opportunities: DealOpportunity[];
  onSaveAssessment?: (assessment: RiskAssessmentData) => void;
  onGenerateAIInsights?: (opportunityId: string) => Promise<string[]>;
}

export const ComprehensiveRiskAssessment: React.FC<ComprehensiveRiskAssessmentProps> = ({
  opportunities = [],
  onSaveAssessment,
  onGenerateAIInsights,
}) => {
  const { toast } = useToast();
  const { generateInsights } = useAnthropic();
  
  // Local state
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'form' | 'results'>('form');
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessmentData[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<RiskAssessmentData | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<RiskCategory[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Initializing
  useEffect(() => {
    if (opportunities.length > 0 && !selectedOpportunityId) {
      setSelectedOpportunityId(opportunities[0].id);
    }
  }, [opportunities, selectedOpportunityId]);
  
  // Load assessment when changing opportunity
  useEffect(() => {
    if (selectedOpportunityId) {
      const existingAssessment = riskAssessments.find(a => a.opportunityId === selectedOpportunityId);
      
      if (existingAssessment) {
        setActiveAssessment(existingAssessment);
        setRiskFactors(existingAssessment.factors);
        setNotes(existingAssessment.notes);
        setViewMode('results');
      } else {
        const opp = opportunities.find(o => o.id === selectedOpportunityId);
        if (opp) {
          setActiveAssessment(null);
          setRiskFactors(predefinedRiskFactors.map(factor => ({ ...factor })));
          setNotes('');
          setViewMode('form');
        }
      }
    }
  }, [selectedOpportunityId, riskAssessments, opportunities]);
  
  // Helper to get risk level description
  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score <= 30) return { level: 'Low Risk', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score <= 60) return { level: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { level: 'High Risk', color: 'bg-red-100 text-red-800 border-red-200' };
  };
  
  // Handle opportunity change
  const handleOpportunityChange = (value: string) => {
    setSelectedOpportunityId(value);
  };
  
  // Toggle view mode
  const handleToggleViewMode = () => {
    setViewMode(viewMode === 'form' ? 'results' : 'form');
  };
  
  // Toggle category expansion
  const handleToggleCategory = (category: RiskCategory) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Update risk factor score
  const handleScoreChange = (id: string, value: number[]) => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === id ? { ...factor, score: value[0] } : factor
      )
    );
  };
  
  // Update risk factor mitigation strategy
  const handleMitigationChange = (id: string, value: string) => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === id ? { ...factor, mitigationStrategy: value } : factor
      )
    );
  };
  
  // Update risk factor impact
  const handleImpactChange = (id: string, value: 'low' | 'medium' | 'high') => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === id ? { ...factor, impact: value } : factor
      )
    );
  };
  
  // Add new risk factor
  const handleAddRiskFactor = () => {
    const newFactor: RiskFactor = {
      id: `custom-${Date.now()}`,
      name: 'New Risk Factor',
      category: 'custom',
      description: 'Description of the new risk factor',
      weight: 0.1,
      score: 50,
      mitigationStrategy: '',
      impact: 'medium',
    };
    
    setRiskFactors([...riskFactors, newFactor]);
  };
  
  // Delete risk factor
  const handleDeleteRiskFactor = (id: string) => {
    setRiskFactors(prev => prev.filter(factor => factor.id !== id));
  };
  
  // Generate AI insights for risk assessment
  const handleGenerateAIInsights = async () => {
    if (!selectedOpportunityId) return;
    
    setIsGeneratingAI(true);
    try {
      let insights: string[];
      
      if (onGenerateAIInsights) {
        insights = await onGenerateAIInsights(selectedOpportunityId);
      } else {
        // Fallback to built-in Anthropic integration
        const opportunity = opportunities.find(o => o.id === selectedOpportunityId);
        if (!opportunity) return;
        
        const prompt = `Analyze the investment opportunity "${opportunity.name}" in the ${opportunity.sector} sector. 
        Provide 3-5 key risk insights considering market conditions, financial metrics, operational factors, 
        and regulatory environment. Focus on actionable insights and potential mitigation strategies.`;
        
        insights = await generateInsights(prompt);
      }
      
      setNotes(prev => prev + '\n\nAI Insights:\n' + insights.join('\n• '));
      toast({
        title: 'AI Insights Generated',
        description: 'Risk assessment enhanced with AI-powered insights',
      });
    } catch (error) {
      toast({
        title: 'AI Generation Failed',
        description: 'Failed to generate AI insights for risk assessment',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  // Save risk assessment
  const handleSaveAssessment = async () => {
    setIsLoading(true);
    
    const opportunity = opportunities.find(o => o.id === selectedOpportunityId);
    if (!opportunity) {
      setIsLoading(false);
      return;
    }
    
    // Calculate overall score
    const totalWeight = riskFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const normalizedFactors = riskFactors.map(factor => ({
      ...factor,
      weight: factor.weight / totalWeight,
    }));
    
    const weightedScores = normalizedFactors
      .filter(factor => factor.score !== undefined)
      .map(factor => factor.weight * (factor.score as number));
    
    const overallScore = Math.round(
      weightedScores.reduce((sum, score) => sum + score, 0) / 
      normalizedFactors.filter(factor => factor.score !== undefined).length * 
      normalizedFactors.length
    );
    
    const newAssessment: RiskAssessmentData = {
      id: activeAssessment?.id || `assessment-${Date.now()}`,
      opportunityId: selectedOpportunityId,
      opportunityName: opportunity.name,
      createdAt: activeAssessment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      factors: normalizedFactors,
      overallScore,
      status: activeAssessment?.status || 'draft',
      notes,
    };
    
    setRiskAssessments(prev => {
      const existingIndex = prev.findIndex(a => a.id === newAssessment.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAssessment;
        return updated;
      }
      return [...prev, newAssessment];
    });
    
    setActiveAssessment(newAssessment);
    setViewMode('results');
    
    if (onSaveAssessment) {
      onSaveAssessment(newAssessment);
    }
    
    toast({
      title: 'Assessment Saved',
      description: 'Risk assessment has been successfully saved',
    });
    
    setIsLoading(false);
  };
  
  // Mark as complete
  const handleMarkComplete = () => {
    if (!activeAssessment) return;
    
    setRiskAssessments(prev => 
      prev.map(assessment => 
        assessment.id === activeAssessment.id 
          ? { ...assessment, status: 'completed' } 
          : assessment
      )
    );
    
    setActiveAssessment(prev => 
      prev ? { ...prev, status: 'completed' } : null
    );
    
    toast({
      title: 'Assessment Completed',
      description: 'Risk assessment marked as complete',
    });
  };
  
  // Get factors by category
  const getFactorsByCategory = (category: RiskCategory): RiskFactor[] => {
    return riskFactors.filter(factor => factor.category === category);
  };
  
  // Prepare category breakdown data
  const prepareCategoryBreakdown = () => {
    return riskCategories.map(category => {
      const factors = getFactorsByCategory(category.id);
      if (factors.length === 0) return null;
      
      const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
      const avgScore = factors
        .filter(f => f.score !== undefined)
        .reduce((sum, factor) => sum + (factor.score || 0), 0) / 
        factors.filter(f => f.score !== undefined).length || 0;
      
      return {
        category: category.name,
        weight: totalWeight * 100,
        score: avgScore,
        color: category.color,
        count: factors.length,
      };
    }).filter(Boolean);
  };
  
  // Render risk factor form
  const renderRiskFactorForm = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Risk Assessment Form</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleGenerateAIInsights}
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? 'Generating...' : 'AI Insights'}
              </Button>
              <Button
                onClick={handleSaveAssessment}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Assessment'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="assessment-notes">Assessment Notes</Label>
            <Textarea
              id="assessment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add overall notes about this risk assessment"
              className="min-h-[100px]"
            />
          </div>
          
          {riskCategories.map(category => {
            const factors = getFactorsByCategory(category.id);
            if (factors.length === 0) return null;
            
            const isExpanded = expandedCategories.includes(category.id);
            const categoryInfo = riskCategories.find(c => c.id === category.id);
            
            return (
              <Card key={category.id} className="mb-4 overflow-hidden">
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${categoryInfo?.color} border-l-4`}
                  onClick={() => handleToggleCategory(category.id)}
                >
                  <h4 className="font-semibold">
                    {categoryInfo?.name} ({factors.length})
                  </h4>
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
                
                {isExpanded && (
                  <CardContent className="space-y-4">
                    {factors.map(factor => (
                      <div key={factor.id} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium">{factor.name}</h5>
                            <p className="text-sm text-gray-600">{factor.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRiskFactor(factor.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Risk Score: {factor.score || 0}</Label>
                            <Slider
                              value