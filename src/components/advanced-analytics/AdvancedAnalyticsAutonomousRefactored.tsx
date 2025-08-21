import React from 'react';
import { AdvancedAnalyticsAutonomous } from './AdvancedAnalyticsAutonomous';
import type { AutonomousModeProps } from '@/types/shared';

/**
 * Wrapper for the existing autonomous component to conform to new interface
 * The existing autonomous implementation is complex and working well,
 * so we wrap it rather than fully rewrite
 */
export const AdvancedAnalyticsAutonomousRefactored: React.FC<AutonomousModeProps> = ({ 
  onSwitchMode 
}) => {
  return <AdvancedAnalyticsAutonomous onSwitchMode={onSwitchMode} />;
};

export default AdvancedAnalyticsAutonomousRefactored;