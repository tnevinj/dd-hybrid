# Architecture Refactoring Guide

## Overview

This document outlines the major architectural improvements implemented to address the critical issues identified in the comprehensive module analysis.

## Issues Addressed

### 1. ✅ Standardized Module Implementation Pattern
**Problem**: Inconsistent mode implementation patterns across modules
**Solution**: Created `BaseModuleComponent` and standardized interfaces

### 2. ✅ Consolidated AI State Management  
**Problem**: Duplicated AI state interfaces across all modules
**Solution**: Created `useModuleAI` hook and shared types in `/types/shared/`

### 3. ✅ Split Navigation Store
**Problem**: Massive 722-line store handling too many concerns
**Solution**: Split into domain-specific stores:
- `navigation-store-refactored.ts` - Core navigation (89 lines)
- `ai-store.ts` - AI recommendations and insights (180 lines) 
- `autonomous-store.ts` - Project and chat management (280 lines)
- `preferences-store.ts` - User settings (67 lines)

### 4. ✅ Shared Type System
**Problem**: Type duplication and inconsistent interfaces
**Solution**: Created `/types/shared/` with standardized types

## New Architecture Components

### Shared Types (`/types/shared/`)
```typescript
// Module AI types with extensions
export type ModuleAIState<T extends keyof ModuleAIStateExtensions>
export interface BaseModuleProps
export interface TraditionalModeProps, AssistedModeProps, AutonomousModeProps

// Module configuration
export type ModuleContext 
export const MODULE_CONFIGS: Record<ModuleContext, ModuleConfig>
```

### Reusable AI Hook (`/hooks/useModuleAI.ts`)
```typescript
export function useModuleAI<T extends keyof ModuleAIStateExtensions>({
  moduleId,
  currentMode,
  customMetrics,
  generateRecommendations = true
}: UseModuleAIOptions<T>): UseModuleAIReturn<T>
```

### Standardized Module Pattern (`/components/shared/BaseModuleComponent.tsx`)
```typescript
export function createModuleComponent<T extends keyof ModuleAIStateExtensions>(
  components: ModeModeComponents<T>
) 
```

### Separated Stores (`/stores/`)
- **Navigation Store**: Mode switching, current module, navigation items
- **AI Store**: Recommendations, insights, tracking, AI panel state  
- **Autonomous Store**: Projects, chat sessions, autonomous UI state
- **Preferences Store**: User settings and preferences

## Migration Guide

### For Existing Modules

1. **Update imports**:
```typescript
// Old
import { useNavigationStore } from '@/stores/navigation-store'

// New - Use composed store for backward compatibility
import { useComposedNavigationStore } from '@/stores'
// OR use specific stores
import { useAIStore } from '@/stores/ai-store'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
```

2. **Refactor module components**:
```typescript
// Old pattern
export const HybridMyModule: React.FC = () => {
  const [aiState, setAIState] = useState<MyModuleAIState>({...}) // Duplicated
  // 300+ lines of mixed concerns...
}

// New pattern
const MyModule = createModuleComponent<'my-module'>({
  Traditional: MyModuleTraditional,
  Assisted: MyModuleAssisted,  
  Autonomous: MyModuleAutonomous
})

export const HybridMyModule: React.FC = () => (
  <MyModule
    moduleId="my-module"
    title="My Module"
    customMetrics={myMetrics}
  />
)
```

3. **Update mode components**:
```typescript
// Old
export const MyModuleAssisted: React.FC<{ metrics: any }> = ({ metrics }) => {

// New - Use standard interfaces
export const MyModuleAssisted: React.FC<AssistedModeProps> = ({ 
  metrics, 
  isLoading,
  aiRecommendations,
  onExecuteAIAction,
  onDismissRecommendation,
  onSwitchMode
}) => {
```

### For New Modules

1. **Create module using standard pattern**:
```bash
# 1. Define module context in /types/shared/module-base.ts
# 2. Create traditional/assisted/autonomous components using standard interfaces
# 3. Compose using createModuleComponent()
```

2. **Standard file structure**:
```
components/my-module/
├── MyModuleTraditional.tsx    (uses TraditionalModeProps)
├── MyModuleAssisted.tsx       (uses AssistedModeProps)  
├── MyModuleAutonomous.tsx     (uses AutonomousModeProps)
└── HybridMyModule.tsx         (uses createModuleComponent)
```

## Reference Implementation

See `components/advanced-analytics/HybridAdvancedAnalyticsRefactored.tsx` for a complete example of the new pattern.

**Before**: 300+ lines with duplicated AI state management
**After**: 30 lines using shared components and hooks

## Benefits Achieved

### Code Reduction
- **Advanced Analytics module**: 300+ lines → 30 lines (-90%)
- **Navigation store**: 722 lines → 616 total lines across 4 focused stores (-15% with better separation)
- **Type definitions**: Eliminated ~200 lines of duplicated type definitions

### Maintainability  
- ✅ Standardized module creation process
- ✅ Consistent AI integration patterns
- ✅ Separated concerns in state management
- ✅ Type safety with shared interfaces

### Developer Experience
- ✅ Clear module development templates  
- ✅ Reusable AI functionality
- ✅ Better IDE support with shared types
- ✅ Easier testing with focused stores

## Next Steps

### Immediate
1. **Update remaining modules** to use new pattern (Portfolio, Due Diligence, Deal Screening)
2. **Add comprehensive tests** for shared components and hooks
3. **Create module generator tool** for consistent new module creation

### Medium-term  
1. **Performance optimization** with code splitting per module
2. **Enhanced AI recommendation engine** using centralized patterns
3. **Documentation generation** from standardized interfaces

### Long-term
1. **Module marketplace** for plugin architecture
2. **Advanced cross-module intelligence** using standardized data flow
3. **Automated migration tools** for future architecture changes

## Backward Compatibility

The `useComposedNavigationStore` hook in `/stores/index.ts` provides full backward compatibility with the original navigation store interface. Existing components will continue to work without changes during the transition period.