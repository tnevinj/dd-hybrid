import { logger } from '../logger'

// Mock console methods
const mockConsole = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Replace console methods with mocks
beforeEach(() => {
  jest.clearAllMocks()
  global.console = mockConsole as any
})

describe('Logger', () => {
  describe('basic logging methods', () => {
    it('logs debug messages', () => {
      logger.debug('Debug message')
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] Debug message'),
        undefined
      )
    })

    it('logs info messages', () => {
      logger.info('Info message')
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Info message'),
        undefined
      )
    })

    it('logs warnings', () => {
      logger.warn('Warning message')
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Warning message'),
        undefined,
        undefined
      )
    })

    it('logs errors', () => {
      const error = new Error('Test error')
      logger.error('Error message', undefined, error)
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Error message'),
        undefined,
        error
      )
    })
  })

  describe('context logging', () => {
    it('includes module and component in log format', () => {
      logger.info('Test message', {
        module: 'test-module',
        component: 'TestComponent'
      })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[test-module/TestComponent] Test message'),
        expect.objectContaining({
          module: 'test-module',
          component: 'TestComponent'
        })
      )
    })

    it('includes metadata in context', () => {
      logger.info('API call completed', {
        module: 'api',
        action: 'http_request',
        metadata: { method: 'GET', status: 200 }
      })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[api] API call completed'),
        expect.objectContaining({
          module: 'api',
          action: 'http_request',
          metadata: { method: 'GET', status: 200 }
        })
      )
    })
  })

  describe('convenience methods', () => {
    it('logs API calls with apiCall method', () => {
      logger.apiCall('GET', '/api/test', 200, 150)
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[api] API GET /api/test'),
        expect.objectContaining({
          module: 'api',
          action: 'http_request',
          metadata: {
            method: 'GET',
            url: '/api/test',
            status: 200,
            duration: 150
          }
        })
      )
    })

    it('logs component mounts with componentMount method', () => {
      logger.componentMount('TestComponent', { prop1: 'value1' })
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('[ui/TestComponent] Component mounted: TestComponent'),
        expect.objectContaining({
          module: 'ui',
          component: 'TestComponent',
          action: 'mount',
          metadata: { prop1: 'value1' }
        })
      )
    })

    it('logs user actions with userAction method', () => {
      logger.userAction('button_click', { buttonId: 'submit' }, 'user123')
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[user] User action: button_click'),
        expect.objectContaining({
          module: 'user',
          action: 'button_click',
          userId: 'user123',
          metadata: { buttonId: 'submit' }
        })
      )
    })

    it('logs state changes with stateChange method', () => {
      logger.stateChange('navigationStore', 'set_mode', { mode: 'assisted' })
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('[store/navigationStore] State change in navigationStore: set_mode'),
        expect.objectContaining({
          module: 'store',
          component: 'navigationStore',
          action: 'state_change',
          metadata: { mode: 'assisted' }
        })
      )
    })

    it('logs error boundary catches with errorBoundary method', () => {
      const error = new Error('Component crashed')
      const errorInfo = { componentStack: 'at Component...' }
      
      logger.errorBoundary(error, errorInfo, 'Component stack trace')
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[error_boundary] Error Boundary caught error'),
        expect.objectContaining({
          module: 'error_boundary',
          action: 'catch_error',
          metadata: {
            componentStack: 'Component stack trace',
            errorInfo
          }
        }),
        error
      )
    })

    it('logs performance measurements with performance method', () => {
      logger.performance('component_render', 25.5, { component: 'TestComponent' })
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('[performance] Performance: component_render took 25.5ms'),
        expect.objectContaining({
          module: 'performance',
          action: 'measurement',
          metadata: {
            name: 'component_render',
            duration: 25.5,
            component: 'TestComponent'
          }
        })
      )
    })
  })

  describe('log buffer management', () => {
    it('stores logs in memory buffer', () => {
      // Clear any existing logs first
      logger.clearLogs()
      
      logger.info('Test log 1')
      logger.error('Test log 2')
      
      const recentLogs = logger.getRecentLogs()
      expect(recentLogs).toHaveLength(2)
      expect(recentLogs[0].message).toBe('Test log 1')
      expect(recentLogs[1].message).toBe('Test log 2')
    })

    it('clears log buffer', () => {
      logger.info('Test log')
      expect(logger.getRecentLogs()).toHaveLength(1)
      
      logger.clearLogs()
      expect(logger.getRecentLogs()).toHaveLength(0)
    })
  })
})