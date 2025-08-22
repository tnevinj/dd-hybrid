# DD-Hybrid Design System Guide

## Overview

This guide documents the comprehensive design system created to ensure consistency across all traditional and assisted modes in the DD-Hybrid application. The standardization addresses the inconsistencies found in the original implementation and provides a cohesive user experience.

## Key Components

### 1. Design System Constants (`src/lib/design-system.ts`)

Central constants file containing:
- **Color System**: Consistent colors for traditional (gray) and assisted (purple/blue) themes
- **Status System**: Standardized status vocabularies across all modules
- **AI Visual Language**: Consistent AI icons, badges, and indicators
- **Component Styles**: Reusable styling patterns
- **Typography**: Standardized text hierarchies
- **Utility Functions**: Helper functions for formatting and theming

```typescript
import { getStatusColor, formatCurrency, COMPONENTS } from '@/lib/design-system';

// Get consistent status colors
const statusClass = getStatusColor('UNDER_REVIEW', 'assisted');

// Format currency consistently
const formattedAmount = formatCurrency(25000000); // "$25.0M"

// Use consistent component styles
<Card className={COMPONENTS.card.assisted.base} />
```

### 2. Standardized KPI Cards (`src/components/shared/StandardizedKPICard.tsx`)

Consistent KPI card implementations:

#### Base KPI Card
```typescript
<StandardizedKPICard
  title="Total Proposals"
  value={15}
  mode="traditional"
  icon={FileText}
  trend="up"
  trendValue="+12%"
  trendLabel="this quarter"
/>
```

#### Specialized KPI Cards
```typescript
// Efficiency metrics
<EfficiencyKPICard
  title="Process Efficiency"
  value={85}
  mode="assisted"
  timeSaved="6.3h saved"
/>

// Performance metrics
<PerformanceKPICard
  title="Success Rate"
  value={94}
  benchmark="+8% vs benchmark"
  valueType="percentage"
/>

// AI-specific metrics
<AIScoreKPICard
  title="AI Confidence"
  score={87}
  confidence={94}
  insight="Model accuracy improved 12%"
/>
```

### 3. AI Recommendation Panels (`src/components/shared/StandardizedAIPanel.tsx`)

Unified AI insights and recommendations:

```typescript
<StandardizedAIPanel
  recommendations={aiRecommendations}
  metrics={{
    timeSaved: 6.3,
    accuracy: 94,
    tasksAutomated: 15
  }}
  title="AI Investment Insights"
  moduleContext="Investment Committee"
  onExecuteAction={handleAIAction}
  onDismissRecommendation={handleDismiss}
/>
```

#### Quick AI Components
```typescript
// Quick insights
<QuickAIInsights
  insights={[
    "High-value opportunities identified",
    "Risk assessment complete",
    "Optimal timing suggested"
  ]}
/>

// Processing status
<AIProcessingStatus
  status="processing"
  progress={78}
  itemsProcessed={156}
  totalItems={200}
/>
```

### 4. Search and Filter Controls (`src/components/shared/StandardizedSearchFilter.tsx`)

Unified search and filtering:

```typescript
<StandardizedSearchFilter
  mode="assisted"
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  filters={filters}
  onFiltersChange={setFilters}
  filterConfigs={filterConfigs}
  sortOptions={sortOptions}
  aiSuggestions={['High IRR', 'Technology deals']}
  smartFilterEnabled={true}
/>
```

#### Quick Search Bar
```typescript
<QuickSearchBar
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  mode="assisted"
  aiSuggestions={aiSuggestions}
/>
```

### 5. Standardized States (`src/components/shared/StandardizedStates.tsx`)

Consistent loading, empty, and error states:

#### Loading States
```typescript
// General loading
<StandardizedLoading
  mode="assisted"
  message="AI is analyzing data..."
  submessage="This may take a few moments"
  showProgress={true}
  progress={65}
/>

// AI-specific loading
<AIAnalysisLoading
  analysisType="investment data"
  itemsProcessed={45}
  totalItems={120}
/>
```

#### Empty States
```typescript
// No results
<NoResultsEmpty
  mode="assisted"
  searchTerm="TechCorp"
  onClearFilters={() => clearFilters()}
/>

// No data
<NoDataEmpty
  mode="traditional"
  dataType="proposals"
  onCreateNew={() => createProposal()}
/>
```

#### Error States
```typescript
// Network error
<NetworkError
  mode="assisted"
  onRetry={() => retryRequest()}
/>

// Permission error
<PermissionError
  mode="traditional"
  resource="investment data"
  onSupport={() => contactSupport()}
/>
```

### 6. Mock Data Generator (`src/lib/mock-data-generator.ts`)

Consistent, realistic mock data:

```typescript
import { generateModuleData } from '@/lib/mock-data-generator';

// Generate complete module data
const moduleData = generateModuleData('investment_committee');
const { proposals, recommendations, metrics } = moduleData;

// Generate specific data types
const proposals = generateICProposals(10);
const portfolioCompanies = generatePortfolioCompanies(15);
const aiRecommendations = generateAIRecommendations('Investment Committee', 3);
```

## Implementation Examples

### Traditional Mode Component

```typescript
import React, { useState } from 'react';
import {
  StandardizedKPICard,
  StandardizedSearchFilter,
  StandardizedLoading,
  NoDataEmpty
} from '@/components/shared';
import { getStatusColor, TYPOGRAPHY, COMPONENTS } from '@/lib/design-system';
import { generateModuleData } from '@/lib/mock-data-generator';

export const TraditionalComponent = () => {
  const moduleData = generateModuleData('investment_committee');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className={TYPOGRAPHY.headings.h1}>Investment Committee</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StandardizedKPICard
          title="Total Proposals"
          value={moduleData.metrics.totalProposals}
          mode="traditional"
          icon={FileText}
          trend="up"
        />
      </div>

      {/* Search & Filter */}
      <StandardizedSearchFilter
        mode="traditional"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Content */}
      <Card className={COMPONENTS.card.traditional.base}>
        {moduleData.proposals.length === 0 ? (
          <NoDataEmpty
            mode="traditional"
            dataType="proposals"
            onCreateNew={() => console.log('Create proposal')}
          />
        ) : (
          // Render proposals
        )}
      </Card>
    </div>
  );
};
```

### Assisted Mode Component

```typescript
import React, { useState } from 'react';
import {
  StandardizedKPICard,
  StandardizedAIPanel,
  StandardizedSearchFilter,
  AIAnalysisLoading,
  AIScoreKPICard
} from '@/components/shared';
import { TYPOGRAPHY, COMPONENTS } from '@/lib/design-system';
import { generateModuleData } from '@/lib/mock-data-generator';

export const AssistedComponent = () => {
  const moduleData = generateModuleData('investment_committee');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className={TYPOGRAPHY.headings.h1}>Investment Committee</h1>
      
      {/* AI Panel */}
      <StandardizedAIPanel
        recommendations={moduleData.recommendations}
        metrics={moduleData.metrics}
        moduleContext="Investment Committee"
      />

      {/* AI-Enhanced KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <AIScoreKPICard
          title="AI Committee Score"
          score={87}
          confidence={94}
        />
        <StandardizedKPICard
          title="Success Prediction"
          value={94}
          mode="assisted"
          isAIEnhanced={true}
        />
      </div>

      {/* AI-Enhanced Search */}
      <StandardizedSearchFilter
        mode="assisted"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        aiSuggestions={['High IRR', 'Tech sector']}
        smartFilterEnabled={true}
      />
    </div>
  );
};
```

## Best Practices

### 1. Always Use Design System Constants
- Import colors, typography, and components from design-system.ts
- Use getStatusColor(), formatCurrency(), and other utility functions
- Maintain consistent theming with COMPONENTS constants

### 2. Consistent Mode Theming
- Traditional mode: Gray-based, manual control emphasis
- Assisted mode: Purple/blue accents, AI enhancement indicators
- Use mode prop consistently across all standardized components

### 3. Mock Data Standards
- Use generateModuleData() for complete module datasets
- Maintain realistic relationships between data points
- Use consistent business terminology across modules

### 4. AI Visual Language
- Brain icon for primary AI features
- Sparkles for AI enhancements
- Zap for automation/efficiency
- Target for accuracy/confidence
- Consistent badge styling with purple/blue accents

### 5. Status and Priority Systems
- Use standardized status vocabularies from STATUS constants
- Apply consistent color coding with getStatusColor()
- Maintain hierarchy: Critical > High > Medium > Low

## Migration Guide

### Updating Existing Components

1. **Replace custom KPI cards**:
   ```typescript
   // Before
   <Card className="border-gray-200">
     <CardContent>
       <p className="text-sm text-gray-600">Total Items</p>
       <p className="text-3xl font-bold">{count}</p>
     </CardContent>
   </Card>

   // After
   <StandardizedKPICard
     title="Total Items"
     value={count}
     mode="traditional"
     icon={FileText}
   />
   ```

2. **Replace custom search controls**:
   ```typescript
   // Before
   <Input placeholder="Search..." />
   <select>...</select>

   // After
   <StandardizedSearchFilter
     mode="traditional"
     searchTerm={searchTerm}
     onSearchChange={setSearchTerm}
     filterConfigs={filterConfigs}
   />
   ```

3. **Replace loading states**:
   ```typescript
   // Before
   <div className="animate-spin...">Loading...</div>

   // After
   <StandardizedLoading
     mode="traditional"
     message="Loading data..."
   />
   ```

4. **Update status handling**:
   ```typescript
   // Before
   const statusColor = status === 'approved' ? 'text-green-600' : 'text-red-600';

   // After
   import { getStatusColor } from '@/lib/design-system';
   const statusClass = getStatusColor(status, mode);
   ```

### Component Checklist

When updating components, ensure:
- [ ] Uses StandardizedKPICard for metrics
- [ ] Uses StandardizedSearchFilter for search/filtering
- [ ] Uses StandardizedLoading/Empty/Error states
- [ ] Imports colors/styles from design-system.ts
- [ ] Uses consistent mock data from mock-data-generator
- [ ] Applies proper mode theming (traditional/assisted)
- [ ] Uses standardized AI visual language
- [ ] Follows consistent typography patterns

## File Structure

```
src/
├── lib/
│   ├── design-system.ts          # Core design system constants
│   └── mock-data-generator.ts    # Consistent mock data
├── components/
│   └── shared/
│       ├── StandardizedKPICard.tsx
│       ├── StandardizedAIPanel.tsx
│       ├── StandardizedSearchFilter.tsx
│       ├── StandardizedStates.tsx
│       └── index.ts              # Exports all standardized components
└── [module]/
    ├── [Module]Traditional.tsx   # Uses traditional theming
    └── [Module]Assisted.tsx      # Uses assisted theming
```

## Conclusion

This design system ensures consistency across all DD-Hybrid modules while maintaining the distinct character of traditional and assisted modes. By using these standardized components and following the established patterns, developers can create cohesive user experiences that feel unified while highlighting the AI enhancement capabilities of the assisted mode.

The system is designed to be:
- **Consistent**: Same patterns across all modules
- **Flexible**: Customizable for specific module needs  
- **Maintainable**: Centralized constants and reusable components
- **Scalable**: Easy to extend with new components and patterns

For questions or contributions to the design system, please refer to the component documentation and examples provided.