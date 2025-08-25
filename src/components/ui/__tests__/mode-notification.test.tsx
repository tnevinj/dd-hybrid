import { render, screen } from '@testing-library/react'
import { ModeNotification } from '../mode-notification'

describe('ModeNotification', () => {
  it('renders assisted mode notification', () => {
    render(
      <ModeNotification
        mode="assisted"
        title="Assisted Mode Active"
        description="AI is helping with suggestions"
      />
    )
    
    expect(screen.getByText('Assisted Mode Active')).toBeInTheDocument()
    expect(screen.getByText('AI is helping with suggestions')).toBeInTheDocument()
  })

  it('renders autonomous mode notification', () => {
    render(
      <ModeNotification
        mode="autonomous"
        title="Autonomous Mode Active"
        description="AI is handling tasks automatically"
      />
    )
    
    expect(screen.getByText('Autonomous Mode Active')).toBeInTheDocument()
    expect(screen.getByText('AI is handling tasks automatically')).toBeInTheDocument()
  })

  it('applies correct styling for different modes', () => {
    const { container, rerender } = render(
      <ModeNotification
        mode="assisted"
        title="Test"
        description="Test description"
      />
    )
    
    // Should have blue styling for assisted mode
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument()
    expect(container.querySelector('.border-blue-200')).toBeInTheDocument()
    
    rerender(
      <ModeNotification
        mode="autonomous"
        title="Test"
        description="Test description"
      />
    )
    
    // Should have green styling for autonomous mode
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument()
    expect(container.querySelector('.border-green-200')).toBeInTheDocument()
  })

  it('has correct positioning classes', () => {
    const { container } = render(
      <ModeNotification
        mode="assisted"
        title="Test"
        description="Test description"
      />
    )
    
    // Should be fixed positioned at bottom right
    expect(container.querySelector('.fixed')).toBeInTheDocument()
    expect(container.querySelector('.bottom-5')).toBeInTheDocument()
    expect(container.querySelector('.right-5')).toBeInTheDocument()
    expect(container.querySelector('.z-50')).toBeInTheDocument()
  })
})