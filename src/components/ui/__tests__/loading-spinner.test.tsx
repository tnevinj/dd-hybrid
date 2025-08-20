import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingState, InlineLoader } from '../loading-spinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(
      <LoadingSpinner 
        title="Custom Loading" 
        description="Please wait while we process your request" 
      />
    )
    expect(screen.getByText('Custom Loading')).toBeInTheDocument()
    expect(screen.getByText('Please wait while we process your request')).toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />)
    expect(container.querySelector('.h-6')).toBeInTheDocument()

    rerender(<LoadingSpinner size="lg" />)
    expect(container.querySelector('.h-16')).toBeInTheDocument()
  })
})

describe('LoadingState', () => {
  it('shows loading spinner when isLoading is true', () => {
    render(
      <LoadingState isLoading={true}>
        <div>Content</div>
      </LoadingState>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows children when isLoading is false', () => {
    render(
      <LoadingState isLoading={false}>
        <div>Content</div>
      </LoadingState>
    )
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('InlineLoader', () => {
  it('renders inline loading indicator', () => {
    render(<InlineLoader />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})