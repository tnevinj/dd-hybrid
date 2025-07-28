'use client';

import { useState, useEffect } from 'react';
import { 
  DealStructuringProject, 
  DealStructuringMetrics, 
  DealStructuringActivity, 
  DealStructuringDeadline 
} from '@/types/deal-structuring';

interface UseDealStructuringReturn {
  metrics: DealStructuringMetrics | null;
  deals: DealStructuringProject[];
  activities: DealStructuringActivity[];
  deadlines: DealStructuringDeadline[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDealStructuring(): UseDealStructuringReturn {
  const [metrics, setMetrics] = useState<DealStructuringMetrics | null>(null);
  const [deals, setDeals] = useState<DealStructuringProject[]>([]);
  const [activities, setActivities] = useState<DealStructuringActivity[]>([]);
  const [deadlines, setDeadlines] = useState<DealStructuringDeadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch dashboard data from API
      const response = await fetch('/api/deal-structuring/dashboard?includeDetails=true', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch deal structuring data');
      }

      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        
        // Convert date strings to Date objects
        const processedDeals = (data.deals || []).map((deal: any) => ({
          ...deal,
          lastUpdated: new Date(deal.lastUpdated)
        }));
        
        const processedActivities = (data.activities || []).map((activity: any) => ({
          ...activity,
          date: new Date(activity.date)
        }));
        
        const processedDeadlines = (data.deadlines || []).map((deadline: any) => ({
          ...deadline,
          dueDate: new Date(deadline.dueDate)
        }));
        
        setDeals(processedDeals);
        setActivities(processedActivities);
        setDeadlines(processedDeadlines);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error fetching deal structuring data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      
      // Use mock data for development
      setMetrics({
        activeDeals: 3,
        totalValue: 450000000,
        averageProgress: 67,
        upcomingDeadlines: 5,
        completedThisMonth: 2,
        pendingApprovals: 1
      });

      setDeals([
        {
          id: '1',
          name: 'TechCorp Secondary',
          type: 'SINGLE_ASSET_CONTINUATION',
          stage: 'STRUCTURING',
          targetValue: 150000000,
          currentValuation: 145000000,
          progress: 75,
          team: [
            { id: '1', name: 'Sarah Chen', role: 'Lead Analyst' },
            { id: '2', name: 'Michael Park', role: 'Vice President' }
          ],
          lastUpdated: new Date(),
          keyMetrics: {
            irr: 18.5,
            multiple: 2.3,
            paybackPeriod: 4.2,
            leverage: 3.5,
            equityContribution: 45000000
          },
          riskLevel: 'medium',
          nextMilestone: 'Financial Model Review',
          aiRecommendations: [
            {
              id: 'rec-1',
              type: 'suggestion',
              priority: 'high',
              title: 'Similar Deal Pattern Detected',
              description: 'This deal resembles CloudCo from Q2 2023. Consider using that DD template.',
              actions: [
                { label: 'Use Template', action: 'APPLY_TEMPLATE', params: { templateId: 'cloudco-2023' } }
              ],
              confidence: 0.87
            }
          ]
        },
        {
          id: '2', 
          name: 'GreenEnergy Fund II',
          type: 'MULTI_ASSET_CONTINUATION',
          stage: 'DUE_DILIGENCE',
          targetValue: 200000000,
          progress: 45,
          team: [
            { id: '3', name: 'Emma Rodriguez', role: 'Director' },
            { id: '4', name: 'David Kim', role: 'Associate' }
          ],
          lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
          keyMetrics: {
            irr: 22.1,
            multiple: 2.8,
            paybackPeriod: 3.8,
            leverage: 2.9,
            equityContribution: 70000000
          },
          riskLevel: 'low',
          nextMilestone: 'Management Presentation'
        },
        {
          id: '3',
          name: 'HealthTech Acquisition',
          type: 'LBO_STRUCTURE',
          stage: 'INVESTMENT_COMMITTEE',
          targetValue: 100000000,
          progress: 90,
          team: [
            { id: '5', name: 'Jennifer Lee', role: 'Managing Director' },
            { id: '6', name: 'Alex Johnson', role: 'Principal' }
          ],
          lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
          keyMetrics: {
            irr: 25.3,
            multiple: 3.1,
            paybackPeriod: 3.2,
            leverage: 4.2,
            equityContribution: 25000000
          },
          riskLevel: 'high',
          nextMilestone: 'IC Vote'
        }
      ]);

      setActivities([
        {
          id: 'act-1',
          title: 'DCF Model Updated',
          deal: 'TechCorp Secondary',
          type: 'financial',
          status: 'completed',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          user: 'David Kim'
        },
        {
          id: 'act-2',
          title: 'Legal Structure Review',
          deal: 'GreenEnergy Fund II',
          type: 'legal',
          status: 'in_progress',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          user: 'Jennifer Lee'
        }
      ]);

      setDeadlines([
        {
          id: 'dead-1',
          title: 'Financial Model Completion',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          deal: 'TechCorp Secondary',
          priority: 'high'
        },
        {
          id: 'dead-2',
          title: 'Management Presentation',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          deal: 'GreenEnergy Fund II',
          priority: 'medium'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    metrics,
    deals,
    activities,
    deadlines,
    isLoading,
    error,
    refetch: fetchData
  };
}