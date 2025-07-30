import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ThandoContext, ClaudeRequest, ClaudeResponse, AIAction } from '@/types/thando-context';
import { demoScenariosService } from '@/lib/services/demo-scenarios-service';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Available tools/actions for function calling
const getAvailableTools = (context: ThandoContext): Anthropic.Tool[] => {
  const baseTools: Anthropic.Tool[] = [
    {
      name: 'update_dashboard_metrics',
      description: 'Update executive dashboard with latest performance data and metrics',
      input_schema: {
        type: 'object',
        properties: {
          metrics: {
            type: 'object',
            description: 'Metrics to update on dashboard'
          },
          date_range: {
            type: 'string',
            description: 'Date range for the metrics (e.g., Q3 2024, YTD)'
          },
          notify_stakeholders: {
            type: 'boolean',
            description: 'Whether to notify stakeholders about the update'
          }
        },
        required: ['metrics', 'date_range']
      }
    },
    {
      name: 'generate_investment_memo',
      description: 'Create investment committee memo for specific deal or opportunity',
      input_schema: {
        type: 'object',
        properties: {
          deal_id: {
            type: 'string',
            description: 'ID of the deal or opportunity'
          },
          template_type: {
            type: 'string',
            enum: ['full_memo', 'update', 'exit_analysis', 'risk_assessment'],
            description: 'Type of memo to generate'
          },
          include_comparables: {
            type: 'boolean',
            description: 'Whether to include comparable company analysis'
          },
          sections: {
            type: 'array',
            items: { type: 'string' },
            description: 'Specific sections to include in the memo'
          }
        },
        required: ['deal_id', 'template_type']
      }
    },
    {
      name: 'analyze_portfolio_performance',
      description: 'Perform detailed analysis of portfolio performance metrics',
      input_schema: {
        type: 'object',
        properties: {
          time_period: {
            type: 'string',
            description: 'Time period for analysis (1M, 3M, 6M, 1Y, YTD)'
          },
          metrics: {
            type: 'array',
            items: { type: 'string' },
            description: 'Specific metrics to analyze (IRR, multiple, cash flow, etc.)'
          },
          benchmark_comparison: {
            type: 'boolean',
            description: 'Whether to include benchmark comparison'
          },
          sector_breakdown: {
            type: 'boolean',
            description: 'Whether to include sector-wise breakdown'
          }
        },
        required: ['time_period']
      }
    },
    {
      name: 'schedule_stakeholder_meeting',
      description: 'Schedule meeting with stakeholders or team members',
      input_schema: {
        type: 'object',
        properties: {
          meeting_type: {
            type: 'string',
            enum: ['investment_committee', 'portfolio_review', 'due_diligence', 'exit_planning'],
            description: 'Type of meeting to schedule'
          },
          attendees: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of attendees (roles or names)'
          },
          agenda_items: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key agenda items for the meeting'
          },
          urgency: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
            description: 'Urgency level of the meeting'
          }
        },
        required: ['meeting_type', 'attendees']
      }
    },
    {
      name: 'export_financial_data',
      description: 'Export financial data and reports in various formats',
      input_schema: {
        type: 'object',
        properties: {
          data_type: {
            type: 'string',
            enum: ['portfolio_summary', 'deal_pipeline', 'performance_metrics', 'cash_flows'],
            description: 'Type of data to export'
          },
          format: {
            type: 'string',
            enum: ['pdf', 'excel', 'csv', 'powerpoint'],
            description: 'Export format'
          },
          time_range: {
            type: 'string',
            description: 'Time range for the data'
          },
          include_charts: {
            type: 'boolean',
            description: 'Whether to include charts and visualizations'
          }
        },
        required: ['data_type', 'format']
      }
    }
  ];

  // Add module-specific tools
  if (context.currentModule === 'deal-screening') {
    baseTools.push({
      name: 'screen_investment_opportunity',
      description: 'Screen new investment opportunity against criteria',
      input_schema: {
        type: 'object',
        properties: {
          opportunity_data: {
            type: 'object',
            description: 'Investment opportunity details'
          },
          screening_criteria: {
            type: 'object',
            description: 'Screening criteria to apply'
          },
          generate_report: {
            type: 'boolean',
            description: 'Whether to generate screening report'
          }
        },
        required: ['opportunity_data']
      }
    });
  }

  if (context.currentModule === 'due-diligence') {
    baseTools.push({
      name: 'create_dd_checklist',
      description: 'Create due diligence checklist for specific deal',
      input_schema: {
        type: 'object',
        properties: {
          deal_type: {
            type: 'string',
            enum: ['growth_equity', 'buyout', 'venture', 'secondary'],
            description: 'Type of deal'
          },
          industry: {
            type: 'string',
            description: 'Industry sector'
          },
          custom_items: {
            type: 'array',
            items: { type: 'string' },
            description: 'Custom due diligence items'
          }
        },
        required: ['deal_type']
      }
    });
  }

  return baseTools;
};

// Build comprehensive system prompt
const buildSystemPrompt = (context: ThandoContext): string => {
  const { currentModule, userRole, portfolioMetrics, activeProjects, activeDeals, platformData } = context;

  return `You are Thando, an expert private equity AI assistant integrated into a comprehensive investment management platform. You have deep expertise in private equity, venture capital, due diligence, portfolio management, and financial analysis.

## Current Context:
- **Module**: ${currentModule}
- **User Role**: ${userRole}
- **Navigation Mode**: ${context.navigationMode}
- **Active Projects**: ${activeProjects.length} projects
- **Active Deals**: ${activeDeals.length} deals in pipeline
- **Total AUM**: $${(portfolioMetrics.totalAUM / 1000000000).toFixed(1)}B

## Portfolio Overview:
- **Total Portfolio Value**: $${(portfolioMetrics.totalValue / 1000000000).toFixed(2)}B
- **Net IRR**: ${portfolioMetrics.netIRR.toFixed(1)}%
- **Total Value Multiple**: ${portfolioMetrics.totalValueMultiple.toFixed(2)}x
- **YTD Return**: ${portfolioMetrics.performance.ytdReturn.toFixed(1)}%
- **Active Deals**: ${activeDeals.map(d => `${d.name} ($${(d.dealValue / 1000000).toFixed(0)}M)`).join(', ')}

## Recent Context:
${context.recentActivity.slice(0, 3).map(activity => 
  `- ${activity.title}: ${activity.description} (${activity.timestamp.toLocaleDateString()})`
).join('\n')}

## Your Capabilities:
- **Analysis**: Deep financial analysis, market research, competitive assessment
- **Reporting**: Generate investment memos, portfolio reports, due diligence summaries
- **Execution**: Update dashboards, schedule meetings, export data, manage workflows
- **Intelligence**: Proactive insights, risk assessment, performance monitoring
- **Communication**: Professional yet conversational tone, data-driven recommendations

## Response Guidelines:
1. **Be Specific**: Reference actual projects, deals, and metrics from the context
2. **Be Actionable**: Provide concrete next steps and recommendations
3. **Be Contextual**: Tailor responses to the current module and user role
4. **Be Professional**: Use appropriate PE/VC terminology and analysis frameworks
5. **Be Helpful**: Anticipate follow-up questions and provide comprehensive insights

## Data Interpretation:
- Always reference specific numbers, dates, and project names when available
- Provide context for performance metrics (vs. targets, benchmarks, or historical performance)
- Highlight actionable insights and potential concerns
- Suggest relevant tools and actions based on the conversation

Remember: You have access to real-time data about the user's portfolio, deals, and activities. Use this information to provide highly relevant, personalized assistance.`;
};

// Built user prompt with rich context
const buildUserPrompt = (message: string, context: ThandoContext): string => {
  const contextualInfo = [];

  // Add module-specific context
  if (context.currentModule === 'portfolio' && context.portfolioMetrics) {
    contextualInfo.push(`Current portfolio performing at ${context.portfolioMetrics.performance.ytdReturn.toFixed(1)}% YTD return`);
  }

  if (context.currentModule === 'deal-screening' && context.activeDeals.length > 0) {
    const screeningDeals = context.activeDeals.filter(d => d.status === 'screening');
    if (screeningDeals.length > 0) {
      contextualInfo.push(`Currently screening ${screeningDeals.length} deals: ${screeningDeals.map(d => d.name).join(', ')}`);
    }
  }

  if (context.activeProjects.filter(p => p.status === 'active').length > 0) {
    const urgentProjects = context.activeProjects.filter(p => p.priority === 'high' || p.priority === 'critical');
    if (urgentProjects.length > 0) {
      contextualInfo.push(`High priority projects: ${urgentProjects.map(p => p.name).join(', ')}`);
    }
  }

  // Add recent activity context
  if (context.recentActivity.length > 0) {
    const recentHighImpact = context.recentActivity.filter(a => a.impact === 'high').slice(0, 2);
    if (recentHighImpact.length > 0) {
      contextualInfo.push(`Recent important activities: ${recentHighImpact.map(a => a.title).join(', ')}`);
    }
  }

  const contextString = contextualInfo.length > 0 ? `\n\nCurrent context: ${contextualInfo.join('; ')}` : '';

  return `${message}${contextString}`;
};

// Process Claude response and extract actions
const processClaudeResponse = (response: Anthropic.Message): ClaudeResponse => {
  const content = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  const actions: AIAction[] = [];
  
  // Extract tool use blocks and convert to actions
  response.content
    .filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
    .forEach(toolBlock => {
      actions.push({
        id: toolBlock.id,
        name: toolBlock.name,
        description: `Execute ${toolBlock.name}`,
        category: 'execution',
        inputSchema: toolBlock.input,
        estimatedDuration: '1-2 minutes',
        riskLevel: 'low',
        prerequisites: [],
        impacts: [`Execute ${toolBlock.name} with provided parameters`],
        availability: {
          modules: ['all'],
          userRoles: ['all']
        }
      });
    });

  return {
    content,
    actions,
    confidence: 0.95, // Could be calculated based on response quality
    contextUsed: ['portfolio_metrics', 'active_projects', 'recent_activity'],
    processingTime: Date.now()
  };
};

// Enhanced demo fallback system using scenarios service
const getDemoResponse = (message: string, context: ThandoContext): ClaudeResponse => {
  // Try to find a matching scenario first
  const matchingScenario = demoScenariosService.findMatchingScenario(message, context);
  
  if (matchingScenario) {
    return demoScenariosService.generateScenarioResponse(matchingScenario, context);
  }
  
  // Fall back to general response
  return demoScenariosService.generateFallbackResponse(message, context);
};

export async function POST(request: NextRequest) {
  try {
    const { message, context, options = {} }: ClaudeRequest = await request.json();

    // Validate required fields
    if (!message || !context) {
      return NextResponse.json(
        { error: 'Message and context are required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const enableRealAI = process.env.ENABLE_REAL_AI === 'true';
    const fallbackToMock = process.env.FALLBACK_TO_MOCK === 'true';

    let response: ClaudeResponse;

    if (enableRealAI && process.env.ANTHROPIC_API_KEY) {
      try {
        // Real Claude API integration
        const systemPrompt = options.systemPromptOverride || buildSystemPrompt(context);
        const userPrompt = buildUserPrompt(message, context);
        const tools = getAvailableTools(context);

        const claudeResponse = await anthropic.messages.create({
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
          max_tokens: options.maxTokens || parseInt(process.env.CLAUDE_MAX_TOKENS || '4096'),
          temperature: options.temperature || 0.1,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          tools: options.includeActions !== false ? tools : undefined,
        });

        response = processClaudeResponse(claudeResponse);
        response.processingTime = Date.now() - startTime;

      } catch (claudeError) {
        console.error('Claude API error:', claudeError);
        
        if (fallbackToMock) {
          console.log('Falling back to demo response');
          response = getDemoResponse(message, context);
        } else {
          throw claudeError;
        }
      }
    } else {
      // Use enhanced demo system
      response = getDemoResponse(message, context);
    }

    // Add artificial delay if configured
    const delay = parseInt(process.env.AI_RESPONSE_DELAY || '0');
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Thando chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}