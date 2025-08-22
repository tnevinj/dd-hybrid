# Component Review Checklist

This checklist ensures all components maintain consistency with the standardized design system across traditional and assisted modes.

## Design System Compliance

### Color Consistency
- [ ] Traditional mode uses `DESIGN_SYSTEM.colors.traditional.*` colors
- [ ] Assisted mode uses `DESIGN_SYSTEM.colors.ai.*` colors  
- [ ] Status colors use `DESIGN_SYSTEM.colors.status.*` with proper mappings
- [ ] Priority colors use `DESIGN_SYSTEM.colors.priority.*` with proper mappings
- [ ] Hover states and transitions follow design system patterns

### Typography & Icons
- [ ] Icon usage follows design system vocabulary (Brain, Sparkles, Zap for AI features)
- [ ] Traditional mode uses User icon, assisted mode uses Brain icon for mode indicators
- [ ] Font weights and sizes are consistent with design system
- [ ] Icon sizes are standardized (typically w-3 h-3, w-4 h-4, w-5 h-5)

### Layout & Spacing
- [ ] Card layouts follow standardized patterns with consistent padding
- [ ] Grid systems use responsive breakpoints (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- [ ] Spacing follows design system scale (space-x-2, space-y-4, etc.)
- [ ] Border radius and shadows are consistent

## Component Standards

### KPI Cards
- [ ] Uses `StandardizedKPICard` component for metrics display
- [ ] Includes trend indicators (up/down/stable) with appropriate icons
- [ ] AI mode includes confidence levels and insights
- [ ] Period indicators are consistent (vs last quarter, YTD, etc.)

### AI Features (Assisted Mode Only)
- [ ] Uses `StandardizedAIPanel` for recommendations
- [ ] AI scores are displayed consistently (X.X/10 format)
- [ ] Confidence levels shown as percentages (XX% confident)
- [ ] AI insights follow established patterns with proper icons
- [ ] Time savings are displayed in standard format

### Search & Filtering
- [ ] Uses `StandardizedSearchFilter` component
- [ ] Filter categories are consistent across modules
- [ ] AI mode includes smart suggestions
- [ ] Search placeholders follow naming conventions

### Loading & Error States
- [ ] Uses `StandardizedLoading`, `StandardizedEmpty`, `StandardizedError` components
- [ ] Loading messages are contextual and mode-appropriate
- [ ] Empty states provide clear next actions
- [ ] Error states offer specific guidance

### Badges & Status Indicators
- [ ] Status badges use consistent color mapping
- [ ] Priority badges follow standard high/medium/low coloring
- [ ] AI-specific badges (AI Review, AI Approved, etc.) use proper styling
- [ ] Badge text follows standard capitalization

## Data & Content

### Mock Data Consistency
- [ ] Uses `generateModuleData()` for consistent mock data
- [ ] Business relationships between data points are realistic
- [ ] Metrics and KPIs are believable and cross-reference correctly
- [ ] AI scores and confidence levels are reasonable (typically 85-95%)

### Terminology Standards
- [ ] Uses established vocabulary across modules
- [ ] AI terminology is consistent (insights, recommendations, predictions)
- [ ] Business terms match industry standards
- [ ] Button labels and actions follow established patterns

## Interaction Patterns

### Navigation
- [ ] Mode indicators are prominently displayed
- [ ] Tab navigation follows consistent patterns
- [ ] Breadcrumbs and back navigation are contextual
- [ ] Action buttons are logically grouped and prioritized

### Button Patterns
- [ ] Primary actions use appropriate styling for mode
- [ ] Secondary actions are consistently styled
- [ ] Icon-only buttons use standard sizes and hover states
- [ ] Button groups follow established spacing

### Form Elements
- [ ] Input fields follow design system styling
- [ ] Form validation uses standard error patterns
- [ ] Placeholder text is helpful and consistent
- [ ] Required field indicators are standardized

## Responsive Design

### Breakpoints
- [ ] Mobile-first responsive design principles
- [ ] Grid layouts adapt properly at md: and lg: breakpoints
- [ ] Content remains readable and functional at all sizes
- [ ] Navigation adapts appropriately for smaller screens

### Content Priority
- [ ] Most important content is visible on mobile
- [ ] Secondary information is appropriately hidden/collapsed
- [ ] Interaction targets meet minimum size requirements
- [ ] Text remains legible at all screen sizes

## Accessibility

### Screen Reader Support
- [ ] All interactive elements have proper labels
- [ ] Images include alt text where appropriate
- [ ] Form elements have associated labels
- [ ] ARIA attributes are used correctly

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order follows logical flow
- [ ] Keyboard shortcuts don't conflict
- [ ] Focus indicators are visible and appropriate

### Color Contrast
- [ ] Text meets WCAG AA contrast requirements
- [ ] Interactive elements have sufficient contrast
- [ ] Color is not the only means of conveying information
- [ ] Focus states are clearly visible

## Performance

### Bundle Size
- [ ] Only necessary imports are included
- [ ] Heavy components are code-split appropriately
- [ ] Images are optimized and appropriately sized
- [ ] External dependencies are justified

### Rendering
- [ ] Components render efficiently without unnecessary re-renders
- [ ] Loading states prevent layout shift
- [ ] Large lists use virtualization where appropriate
- [ ] Images are lazy-loaded when possible

## Testing Considerations

### Unit Tests
- [ ] Key component functionality is tested
- [ ] Props variations are covered
- [ ] Error states are tested
- [ ] Accessibility is verified

### Integration Tests
- [ ] Component works correctly within module context
- [ ] Mode switching functions properly
- [ ] Data flow is verified
- [ ] Navigation flows are tested

### Manual Testing
- [ ] Component has been tested in both traditional and assisted modes
- [ ] Responsive behavior verified across devices
- [ ] Interaction flows are smooth and intuitive
- [ ] Performance is acceptable under load

## Documentation

### Code Comments
- [ ] Complex logic is documented
- [ ] Props interfaces are well-defined
- [ ] Component purpose is clear from naming and structure
- [ ] TODO items are tracked and prioritized

### Usage Examples
- [ ] Component usage is documented in shared index
- [ ] Props are properly typed and exported
- [ ] Integration examples are available
- [ ] Migration guides exist for existing components

## Checklist Usage

1. **Pre-Review**: Developer completes checklist before submitting component
2. **Peer Review**: Reviewer validates checklist items during code review
3. **Testing Phase**: QA validates consistency across modules
4. **Maintenance**: Checklist updated as design system evolves

## Quick Reference

### Common Patterns
- Traditional mode: Gray-based theming, manual control emphasis
- Assisted mode: Purple/blue theming, AI enhancement indicators
- KPI cards: Consistent layout with trend indicators
- AI panels: Standardized recommendation format
- Search filters: Unified interface with smart suggestions

### Key Components
- `StandardizedKPICard` - All metric displays
- `StandardizedAIPanel` - All AI recommendations
- `StandardizedSearchFilter` - All search/filter interfaces
- `StandardizedLoading/Empty/Error` - All state management

### Design System Utilities
- `DESIGN_SYSTEM` - All color and styling constants
- `generateModuleData()` - Consistent mock data
- `getStatusColor()`, `getPriorityColor()` - Color utilities