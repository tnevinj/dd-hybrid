'use client';

import React, { ReactNode, useEffect } from 'react';
import { ZIndex, getZIndexStyle } from '@/styles/z-index';

interface AutonomousLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * AutonomousLayout Component
 * 
 * Provides a full-screen layout wrapper specifically designed for autonomous mode components.
 * This wrapper ensures proper isolation from parent layout conflicts and provides
 * consistent styling and behavior across all autonomous components.
 */
export function AutonomousLayout({ children, className = '' }: AutonomousLayoutProps) {
  useEffect(() => {
    // Add autonomous mode class to body for global styling overrides
    document.body.classList.add('autonomous-mode');
    
    // Initialize CSS custom properties
    document.documentElement.style.setProperty('--autonomous-header-height', '64px');
    
    return () => {
      document.body.classList.remove('autonomous-mode');
    };
  }, []);

  return (
    <div 
      className={`autonomous-container ${className}`}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: ZIndex.BASE,
        backgroundColor: '#f3f4f6', // bg-gray-100 equivalent
      }}
    >
      {children}
    </div>
  );
}

export default AutonomousLayout;