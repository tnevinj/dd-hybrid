import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { ExitMetricsResponse } from '@/types/exits';

// GET /api/exits/metrics - Get comprehensive exit management metrics
export async function GET(request: NextRequest) {
  try {
    // Pipeline Metrics
    const pipelineMetrics = db.prepare(`
      SELECT 
        COUNT(*) as total_opportunities,
        SUM(CASE WHEN target_exit_value IS NOT NULL THEN target_exit_value ELSE 0 END) as total_pipeline_value,
        AVG(ai_exit_score) as average_ai_score,
        SUM(json_array_length(ai_insights)) as total_insights,
        COUNT(CASE WHEN market_conditions = 'excellent' THEN 1 END) as optimal_timing_count
      FROM exit_opportunities
    `).get() as any;

    // Metrics by stage
    const stageMetrics = db.prepare(`
      SELECT preparation_stage, COUNT(*) as count
      FROM exit_opportunities
      GROUP BY preparation_stage
    `).all() as any[];

    // Metrics by strategy
    const strategyMetrics = db.prepare(`
      SELECT exit_strategy, COUNT(*) as count
      FROM exit_opportunities
      GROUP BY exit_strategy
    `).all() as any[];

    // Metrics by market conditions
    const marketConditionsMetrics = db.prepare(`
      SELECT market_conditions, COUNT(*) as count
      FROM exit_opportunities
      GROUP BY market_conditions
    `).all() as any[];

    // Process Metrics
    const processMetrics = db.prepare(`
      SELECT 
        COUNT(*) as total_processes,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_processes,
        COUNT(CASE WHEN status != 'completed' AND target_completion_date < date('now') THEN 1 END) as overdue_processes,
        AVG(CASE WHEN actual_completion_date IS NOT NULL AND start_date IS NOT NULL 
            THEN julianday(actual_completion_date) - julianday(start_date) 
            END) as average_completion_days,
        COUNT(CASE WHEN automation_level != 'manual' THEN 1 END) * 1.0 / COUNT(*) as automation_rate,
        AVG(quality_score) as average_quality_score
      FROM exit_processes
    `).get() as any;

    // Task Metrics
    const taskMetrics = db.prepare(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN status != 'completed' AND due_date < date('now') THEN 1 END) as overdue_tasks,
        COUNT(CASE WHEN automation_eligible = 1 THEN 1 END) as automation_eligible_tasks
      FROM exit_tasks
    `).get() as any;

    // Task metrics by priority
    const taskPriorityMetrics = db.prepare(`
      SELECT priority, COUNT(*) as count
      FROM exit_tasks
      GROUP BY priority
    `).all() as any[];

    // Task metrics by status
    const taskStatusMetrics = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM exit_tasks
      GROUP BY status
    `).all() as any[];

    // Task metrics by category
    const taskCategoryMetrics = db.prepare(`
      SELECT task_category, COUNT(*) as count
      FROM exit_tasks
      GROUP BY task_category
    `).all() as any[];

    // Market Intelligence Metrics
    const marketMetrics = db.prepare(`
      SELECT 
        COUNT(CASE WHEN market_conditions IN ('excellent', 'good') THEN 1 END) as favorable_conditions,
        AVG(market_timing_score) as average_timing_score,
        COUNT(*) as total_market_intelligence
      FROM exit_market_intelligence
    `).get() as any;

    // Build response object
    const response: ExitMetricsResponse = {
      pipeline_metrics: {
        total_opportunities: pipelineMetrics.total_opportunities || 0,
        total_pipeline_value: pipelineMetrics.total_pipeline_value || 0,
        average_ai_score: pipelineMetrics.average_ai_score || 0,
        active_insights: pipelineMetrics.total_insights || 0,
        optimal_timing_count: pipelineMetrics.optimal_timing_count || 0,
        by_stage: stageMetrics.reduce((acc: any, item) => {
          acc[item.preparation_stage] = item.count;
          return acc;
        }, {}),
        by_strategy: strategyMetrics.reduce((acc: any, item) => {
          acc[item.exit_strategy] = item.count;
          return acc;
        }, {}),
        by_market_conditions: marketConditionsMetrics.reduce((acc: any, item) => {
          acc[item.market_conditions] = item.count;
          return acc;
        }, {})
      },
      process_metrics: {
        total_processes: processMetrics.total_processes || 0,
        completed_processes: processMetrics.completed_processes || 0,
        overdue_processes: processMetrics.overdue_processes || 0,
        average_completion_time: processMetrics.average_completion_days || 0,
        automation_rate: processMetrics.automation_rate || 0,
        quality_score: processMetrics.average_quality_score || 0
      },
      task_metrics: {
        total_tasks: taskMetrics.total_tasks || 0,
        completed_tasks: taskMetrics.completed_tasks || 0,
        overdue_tasks: taskMetrics.overdue_tasks || 0,
        by_priority: taskPriorityMetrics.reduce((acc: any, item) => {
          acc[item.priority] = item.count;
          return acc;
        }, {}),
        by_status: taskStatusMetrics.reduce((acc: any, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        by_category: taskCategoryMetrics.reduce((acc: any, item) => {
          acc[item.task_category] = item.count;
          return acc;
        }, {}),
        automation_eligible: taskMetrics.automation_eligible_tasks || 0
      },
      market_metrics: {
        favorable_conditions: marketMetrics.favorable_conditions || 0,
        average_timing_score: marketMetrics.average_timing_score || 0,
        total_market_intelligence: marketMetrics.total_market_intelligence || 0
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching exit metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exit metrics' },
      { status: 500 }
    );
  }
}