import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorDisplay, ErrorState, ErrorMessage } from '../error-display'

describe('ErrorDisplay', () => {
  it('renders with default error message', () => {
    render(<ErrorDisplay />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
  })

  it('renders with custom title and message', () => {
    render(
      <ErrorDisplay 
        title="Custom Error" 
        message="Something specific went wrong" 
      />
    )
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Something specific went wrong')).toBeInTheDocument()
  })

  it('renders with error object', () => {
    const error = new Error('Network failure')
    render(<ErrorDisplay error={error} />)
    expect(screen.getByText('Network failure')).toBeInTheDocument()
  })

  it('calls onRetry when Try Again button is clicked', () => {
    const onRetry = jest.fn()
    render(<ErrorDisplay onRetry={onRetry} />)
    
    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)
    
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('calls onGoHome when Go Home button is clicked', () => {
    const onGoHome = jest.fn()
    render(<ErrorDisplay onGoHome={onGoHome} />)
    
    const homeButton = screen.getByText('Go Home')
    fireEvent.click(homeButton)
    
    expect(onGoHome).toHaveBeenCalledTimes(1)
  })

  it('renders inline variant correctly', () => {
    render(<ErrorDisplay variant="inline" />)
    // Should not render the large error display
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
  })
})

describe('ErrorState', () => {
  it('shows error display when error exists', () => {
    const error = new Error('Test error')
    render(
      <ErrorState error={error}>
        <div>Content</div>
      </ErrorState>
    )
    expect(screen.getByText('Test error')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows children when no error', () => {
    render(
      <ErrorState error={null}>
        <div>Content</div>
      </ErrorState>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClear and onRetry when retry is clicked', () => {
    const onClear = jest.fn()
    const onRetry = jest.fn()
    const error = new Error('Test error')
    
    render(
      <ErrorState error={error} onClear={onClear} onRetry={onRetry}>
        <div>Content</div>
      </ErrorState>
    )
    
    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)
    
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})

describe('ErrorMessage', () => {
  it('renders error message with icon', () => {
    render(<ErrorMessage>Something went wrong</ErrorMessage>)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})