# SecondaryEdge Hybrid Navigation Model: Developer Implementation Guide

## Executive Summary for Developers

We're building a **hybrid navigation system** that combines traditional menu-driven navigation with progressive AI intelligence. Users can operate in three modes: Traditional (full navigation), Assisted (AI-enhanced), and Autonomous (AI-first). The system should feel familiar to conservative users while providing powerful AI capabilities for those ready to adopt them.

**Core Principle**: Start with working navigation, layer in AI features, let users control their experience.

---

## 1. System Architecture

### Core Components Required

```typescript
// types/navigation.ts
export interface UserNavigationMode {
  mode: 'traditional' | 'assisted' | 'autonomous';
  aiPermissions: {
    suggestions: boolean;
    autoComplete: boolean;
    proactiveActions: boolean;
    autonomousExecution: boolean;
  };
  preferredDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface AIAssistanceContext {
  userId: string;
  currentModule: string;
  userMode: UserNavigationMode;
  historicalPatterns: UserPattern[];
  activeDeals: Deal[];
  upcomingDeadlines: Deadline[];
  teamContext: TeamActivity[];
}

export interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'insight' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions: RecommendedAction[];
  confidence: number; // 0-1
  reasoning?: string; // For transparency
}
```

### Database Schema Changes

```sql
-- Add to existing user preferences table
ALTER TABLE user_preferences ADD COLUMN navigation_mode VARCHAR(20) DEFAULT 'traditional';
ALTER TABLE user_preferences ADD COLUMN ai_adoption_level INTEGER DEFAULT 0;
ALTER TABLE user_preferences ADD COLUMN ai_permissions JSONB DEFAULT '{"suggestions": true, "autoComplete": false, "proactiveActions": false, "autonomousExecution": false}';

-- New table for AI interaction tracking
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interaction_type VARCHAR(50),
  recommendation_id UUID,
  user_action VARCHAR(50), -- 'accepted', 'rejected', 'modified', 'ignored'
  time_saved_seconds INTEGER,
  module VARCHAR(50),
  context JSONB
);

-- Track user patterns for AI learning
CREATE TABLE user_patterns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  pattern_type VARCHAR(50),
  pattern_data JSONB,
  frequency INTEGER,
  last_observed TIMESTAMP WITH TIME ZONE,
  confidence_score DECIMAL(3,2)
);
```

---

## 2. Implementation Phases

### Phase 1: Traditional Navigation with AI Readiness (Weeks 1-4)

```typescript
// components/Navigation/HybridNavigation.tsx
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

export const HybridNavigation: React.FC = () => {
  const { user, preferences } = useUser();
  const { recommendations, loading } = useAIRecommendations(user.id);
  
  const [showAIPanel, setShowAIPanel] = useState(
    preferences.navigationMode !== 'traditional'
  );

  return (
    <div className="flex h-screen">
      {/* Traditional Navigation - Always Present */}
      <TraditionalSidebar 
        user={user}
        enhanced={preferences.navigationMode === 'assisted'}
      />
      
      {/* AI Panel - Conditional */}
      {showAIPanel && (
        <AIAssistancePanel
          recommendations={recommendations}
          mode={preferences.navigationMode}
          onClose={() => setShowAIPanel(false)}
        />
      )}
      
      {/* Main Content */}
      <MainContent>
        {preferences.navigationMode !== 'traditional' && (
          <AIInsightsBanner recommendations={recommendations.slice(0, 3)} />
        )}
        <RouterOutlet />
      </MainContent>
    </div>
  );
};
```

### Phase 2: Assisted Intelligence Integration (Weeks 5-8)

```typescript
// services/AIAssistanceService.ts
export class AIAssistanceService {
  async getRecommendations(context: AIAssistanceContext): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];
    
    // 1. Analyze current context
    const moduleAnalysis = await this.analyzeModuleContext(context);
    
    // 2. Check historical patterns
    const patterns = await this.getUserPatterns(context.userId);
    
    // 3. Generate recommendations based on mode
    switch (context.userMode.mode) {
      case 'traditional':
        // Only show non-intrusive hints
        recommendations.push(...this.getSubtleHints(moduleAnalysis));
        break;
        
      case 'assisted':
        // Show proactive suggestions and automation options
        recommendations.push(...this.getAssistedRecommendations(moduleAnalysis, patterns));
        break;
        
      case 'autonomous':
        // Full automation with approval workflows
        recommendations.push(...this.getAutonomousActions(moduleAnalysis, patterns));
        break;
    }
    
    // 4. Rank by priority and confidence
    return this.rankRecommendations(recommendations, context);
  }
  
  private async getAssistedRecommendations(
    analysis: ModuleAnalysis,
    patterns: UserPattern[]
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];
    
    // Example: Due Diligence Module
    if (analysis.module === 'due-diligence') {
      // Check if similar deals exist
      const similarDeals = await this.findSimilarDeals(analysis.currentDeal);
      
      if (similarDeals.length > 0) {
        recommendations.push({
          id: generateId(),
          type: 'suggestion',
          priority: 'high',
          title: 'Similar Deal Pattern Detected',
          description: `This deal resembles ${similarDeals[0].name} from ${similarDeals[0].date}. Would you like to use that DD checklist as a starting point?`,
          actions: [
            {
              label: 'Use Template',
              action: 'APPLY_DD_TEMPLATE',
              params: { templateId: similarDeals[0].templateId }
            },
            {
              label: 'View Comparison',
              action: 'VIEW_DEAL_COMPARISON',
              params: { dealIds: similarDeals.map(d => d.id) }
            }
          ],
          confidence: 0.85
        });
      }
      
      // Check for routine tasks that can be automated
      const automatableTasks = await this.identifyAutomatableTasks(analysis);
      
      if (automatableTasks.length > 0) {
        recommendations.push({
          id: generateId(),
          type: 'automation',
          priority: 'medium',
          title: `${automatableTasks.length} Tasks Can Be Automated`,
          description: 'AI can handle document categorization, initial risk scoring, and checklist generation.',
          actions: [
            {
              label: 'Automate Selected',
              action: 'AUTOMATE_TASKS',
              params: { taskIds: automatableTasks.map(t => t.id) }
            },
            {
              label: 'Review Tasks',
              action: 'REVIEW_AUTOMATABLE_TASKS'
            }
          ],
          confidence: 0.92
        });
      }
    }
    
    return recommendations;
  }
}
```

---

## 3. Due Diligence Module - Detailed Implementation Example

### Current State Analysis
The Due Diligence module currently has:
- Project Management with multi-phase support
- Team Collaboration tools
- Finding Management
- Risk Register
- Document Management
- AI-Powered Document Analysis

### Hybrid Implementation Plan

#### A. Traditional Mode - Current Features Enhanced

```typescript
// pages/DueDiligence/TraditionalView.tsx
export const DueDiligenceTraditional: React.FC = () => {
  const { currentDeal } = useDealContext();
  
  return (
    <div className="dd-container">
      {/* Existing Navigation Structure */}
      <DDSidebar>
        <MenuItem icon="checklist" label="DD Checklist" />
        <MenuItem icon="team" label="Team Tasks" />
        <MenuItem icon="findings" label="Findings" />
        <MenuItem icon="risk" label="Risk Register" />
        <MenuItem icon="docs" label="Documents" />
      </DDSidebar>
      
      {/* Main Content Area - Unchanged */}
      <DDMainContent>
        <DDChecklist deal={currentDeal} />
      </DDMainContent>
      
      {/* NEW: Subtle AI Hints (Dismissible) */}
      <AIHintToast
        message="💡 Tip: 3 tasks here are similar to your CloudCo deal"
        action="View"
        onDismiss={() => trackDismissal('dd-hint')}
      />
    </div>
  );
};
```

#### B. Assisted Mode - AI Integration

```typescript
// pages/DueDiligence/AssistedView.tsx
export const DueDiligenceAssisted: React.FC = () => {
  const { currentDeal } = useDealContext();
  const { recommendations, executeAction } = useAIAssistance();
  
  return (
    <div className="dd-container-assisted">
      {/* AI Insights Panel - Prominent but Dismissible */}
      <AIInsightsPanel className="mb-4">
        <h3>AI Assistant Insights</h3>
        
        {/* Pattern Recognition */}
        <InsightCard
          icon="🔍"
          title="Similar Deal Detected"
          description={`This B2B SaaS deal is 87% similar to CloudCo (closed successfully).`}
          actions={[
            { label: "Apply CloudCo Template", onClick: () => applyTemplate('cloudco') },
            { label: "See Differences", onClick: () => showComparison() }
          ]}
        />
        
        {/* Automation Opportunities */}
        <InsightCard
          icon="⚡"
          title="Automation Available"
          description="I can complete 12 routine tasks based on the uploaded documents."
          actions={[
            { label: "Review & Automate", onClick: () => showAutomationReview() },
            { label: "Do Manually", onClick: () => dismissAutomation() }
          ]}
        />
        
        {/* Predictive Insights */}
        <InsightCard
          icon="📊"
          title="Risk Prediction"
          description="Based on initial data, customer concentration appears high (top 3 = 45%)."
          actions={[
            { label: "Deep Dive", onClick: () => navigateToRiskAnalysis() },
            { label: "Add to Findings", onClick: () => addFinding('risk', 'Customer concentration') }
          ]}
        />
      </AIInsightsPanel>
      
      {/* Traditional Features Still Available */}
      <div className="flex gap-6">
        <DDSidebar enhanced={true} />
        
        <DDMainContent>
          {/* Checklist with AI Enhancements */}
          <DDChecklistEnhanced 
            deal={currentDeal}
            aiSuggestions={recommendations.filter(r => r.type === 'checklist')}
            onAcceptSuggestion={(suggestion) => executeAction(suggestion.action)}
          />
        </DDMainContent>
        
        {/* Context-Aware Actions */}
        <QuickActionsPanel>
          <h4>Suggested Next Steps</h4>
          <ActionButton icon="📄" onClick={() => generateDDReport()}>
            Generate DD Summary (AI Draft)
          </ActionButton>
          <ActionButton icon="📅" onClick={() => scheduleExpertCalls()}>
            Schedule Expert Calls
          </ActionButton>
          <ActionButton icon="📊" onClick={() => runScenarioAnalysis()}>
            Run Scenario Analysis
          </ActionButton>
        </QuickActionsPanel>
      </div>
    </div>
  );
};
```

#### C. Autonomous Mode - AI-First Workflow

```typescript
// pages/DueDiligence/AutonomousView.tsx
export const DueDiligenceAutonomous: React.FC = () => {
  const { currentDeal } = useDealContext();
  const { aiState, approveAction, modifyAction } = useAutonomousAI();
  
  return (
    <div className="dd-autonomous">
      {/* Conversational Interface */}
      <AIConversationPanel>
        <AIMessage
          avatar="🤖"
          message={`I've analyzed the ${currentDeal.name} deal. Here's what I've found and what needs your attention:`}
        />
        
        {/* Completed Actions */}
        <ActionSummary
          title="✅ Completed Automatically"
          items={[
            "Categorized 47 documents",
            "Extracted key terms from agreements",
            "Identified 12 potential risks",
            "Compared to 8 similar deals",
            "Generated initial scoring"
          ]}
          expandable={true}
        />
        
        {/* Pending Decisions */}
        <DecisionRequest
          title="🤔 Need Your Decision"
          items={[
            {
              question: "Customer concentration is 45%. Should I flag this as a key risk?",
              options: [
                { label: "Yes, flag it", action: () => flagRisk('concentration') },
                { label: "No, it's acceptable", action: () => dismissRisk('concentration') },
                { label: "Need more info", action: () => requestAnalysis('concentration') }
              ]
            },
            {
              question: "The tech stack uses legacy systems. Schedule a technical DD call?",
              options: [
                { label: "Schedule it", action: () => scheduleCall('technical') },
                { label: "Not needed", action: () => skipCall('technical') },
                { label: "Ask CTO first", action: () => emailCTO() }
              ]
            }
          ]}
        />
        
        {/* Next Actions */}
        <AIMessage
          avatar="🤖"
          message="Based on my analysis, I recommend focusing on financial model validation next. Should I prepare the model with the extracted data?"
          actions={[
            { label: "Yes, prepare it", primary: true },
            { label: "Show me the data first" },
            { label: "I'll do it manually" }
          ]}
        />
      </AIConversationPanel>
      
      {/* Escape Hatch */}
      <FloatingButton
        icon="🔧"
        label="Switch to Traditional View"
        onClick={() => switchMode('traditional')}
        position="bottom-right"
      />
    </div>
  );
};
```

---

## 4. AI Learning & Improvement System

### Track Everything for Continuous Improvement

```typescript
// hooks/useAITracking.ts
export const useAITracking = () => {
  const trackInteraction = async (interaction: {
    recommendationId: string;
    action: 'accepted' | 'rejected' | 'modified' | 'ignored';
    context: any;
    timeSaved?: number;
  }) => {
    // Record to database
    await api.post('/ai/interactions', {
      ...interaction,
      timestamp: new Date(),
      userId: getCurrentUserId(),
      module: getCurrentModule()
    });
    
    // Update pattern recognition
    if (interaction.action === 'accepted') {
      await api.post('/ai/patterns/reinforce', {
        patternType: interaction.context.patternType,
        context: interaction.context
      });
    }
  };
  
  const trackTimesSaved = async (taskType: string, automatedTime: number, manualTime: number) => {
    const saved = manualTime - automatedTime;
    await api.post('/ai/metrics/time-saved', {
      taskType,
      saved,
      percentage: (saved / manualTime) * 100
    });
  };
  
  return { trackInteraction, trackTimesSaved };
};
```

---

## 5. Implementation Checklist for Developers

### Week 1-2: Foundation
- [ ] Add navigation mode to user preferences schema
- [ ] Create AI recommendations service skeleton
- [ ] Build mode switcher UI component
- [ ] Add AI hints to traditional navigation (dismissible)
- [ ] Set up AI interaction tracking tables

### Week 3-4: Due Diligence Module (Pilot)
- [ ] Implement pattern recognition for similar deals
- [ ] Build automation identification system
- [ ] Create AI insights panel component
- [ ] Add "Automate This" buttons to routine tasks
- [ ] Implement approval workflow for AI actions

### Week 5-6: Assisted Mode
- [ ] Build recommendation ranking algorithm
- [ ] Create quick actions panel
- [ ] Implement AI draft generation for reports
- [ ] Add comparative analysis features
- [ ] Build confidence scoring system

### Week 7-8: Autonomous Mode (Beta)
- [ ] Create conversational UI components
- [ ] Build natural language processing integration
- [ ] Implement decision request system
- [ ] Add comprehensive audit logging
- [ ] Create rollback mechanisms

### Week 9-10: Intelligence & Learning
- [ ] Implement pattern learning from user actions
- [ ] Build recommendation improvement system
- [ ] Create A/B testing framework
- [ ] Add performance metrics dashboard
- [ ] Build user feedback collection

### Week 11-12: Polish & Rollout
- [ ] Comprehensive testing across modes
- [ ] Performance optimization
- [ ] User onboarding flows
- [ ] Documentation and training materials
- [ ] Gradual rollout plan

---

## 6. Critical Implementation Notes

### Security & Compliance
```typescript
// Every AI action must be:
interface AIAction {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  previousState: any;
  newState: any;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  reversible: boolean;
  reversed?: boolean;
  complianceFlags: string[];
}
```

### Performance Considerations
1. AI recommendations should load asynchronously
2. Cache patterns and recommendations aggressively
3. Use WebSocket for real-time AI updates
4. Implement progressive loading for AI features

### User Experience Principles
1. Every AI action must be reversible
2. Users can always see what AI did and why
3. Traditional navigation is never more than one click away
4. AI should explain its reasoning when asked
5. Respect user preferences absolutely

---

## 7. Sample API Endpoints

```typescript
// AI Recommendation API
POST   /api/ai/recommendations
GET    /api/ai/recommendations/:userId
PUT    /api/ai/recommendations/:id/feedback

// Pattern Learning API  
POST   /api/ai/patterns/learn
GET    /api/ai/patterns/user/:userId
DELETE /api/ai/patterns/:id

// Automation API
POST   /api/ai/automate/task
GET    /api/ai/automate/history
POST   /api/ai/automate/rollback/:actionId

// User Preferences API
GET    /api/users/:id/ai-preferences
PUT    /api/users/:id/ai-preferences
POST   /api/users/:id/switch-mode
```

---

## 8. Testing Strategy

### Unit Tests
- Test each AI recommendation type
- Test mode switching logic
- Test rollback mechanisms
- Test permission systems

### Integration Tests
- Test full workflows in each mode
- Test AI learning from user actions
- Test performance under load
- Test compliance logging

### User Acceptance Tests
- A/B test traditional vs. assisted
- Measure time saved
- Track error rates
- Monitor user satisfaction

---

## Next Steps

1. **Set up development environment** with AI tracking tables
2. **Build mode switcher** as first deliverable
3. **Implement Due Diligence** as pilot module
4. **Deploy to beta users** in Traditional mode only
5. **Gradually enable** Assisted features
6. **Measure everything** for continuous improvement

This implementation maintains the full power of SecondaryEdge while providing a clear path from traditional navigation to AI-first workflows. Users control their journey, and we can measure adoption and value at every step.