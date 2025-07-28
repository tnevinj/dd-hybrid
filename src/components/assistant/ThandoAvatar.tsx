'use client';

import React from 'react';

interface ThandoAvatarProps {
  expression: 'default' | 'thinking' | 'speaking' | 'listening' | 'neutral' | 'apologetic';
  size?: number;
  pulseAnimation?: boolean;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * ThandoAvatar Component - Enhanced for DD-Hybrid
 * 
 * Displays the Thando avatar with different expressions
 * and mode-specific styling for hybrid navigation.
 */
const ThandoAvatar: React.FC<ThandoAvatarProps> = ({ 
  expression, 
  size = 40,
  pulseAnimation = false,
  mode = 'traditional'
}) => {
  // Get the avatar content based on the expression
  const getAvatarContent = () => {
    switch (expression) {
      case 'thinking':
        return '🤔';
      case 'speaking':
        return '💬';
      case 'listening':
        return '👂';
      case 'neutral':
        return '🤖';
      case 'apologetic':
        return '😅';
      case 'default':
      default:
        return mode === 'autonomous' ? '🚀' : mode === 'assisted' ? '🧠' : '🤖';
    }
  };
  
  // Get the avatar background color based on the expression and mode
  const getAvatarColor = () => {
    if (mode === 'autonomous') {
      switch (expression) {
        case 'thinking':
          return 'bg-purple-600';
        case 'speaking':
          return 'bg-indigo-600';
        case 'listening':
          return 'bg-violet-600';
        default:
          return 'bg-gradient-to-br from-purple-500 to-indigo-600';
      }
    } else if (mode === 'assisted') {
      switch (expression) {
        case 'thinking':
          return 'bg-blue-600';
        case 'speaking':
          return 'bg-cyan-600';
        case 'listening':
          return 'bg-teal-600';
        default:
          return 'bg-gradient-to-br from-blue-500 to-cyan-600';
      }
    } else {
      // Traditional mode
      switch (expression) {
        case 'thinking':
          return 'bg-gray-500';
        case 'speaking':
          return 'bg-blue-500';
        case 'listening':
          return 'bg-green-500';
        case 'apologetic':
          return 'bg-orange-500';
        default:
          return 'bg-gray-600';
      }
    }
  };
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center rounded-full text-white font-bold transition-all duration-300
        ${getAvatarColor()}
        ${pulseAnimation ? 'animate-pulse' : ''}
        ${mode !== 'traditional' ? 'shadow-lg' : ''}
      `}
      style={{ 
        width: size, 
        height: size, 
        fontSize: size * 0.4 
      }}
    >
      {getAvatarContent()}
    </div>
  );
};

export default ThandoAvatar;