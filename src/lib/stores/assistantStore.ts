import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Message, 
  Suggestion, 
  AssistantContext,
  AvatarExpression,
  MessageSender,
  UserPreferences,
  MessageContentType,
  NavigationMode,
  Recommendation,
  Task
} from '../types/assistant/assistantTypes';

interface SearchState {
  isSearching: boolean;
  query: string;
  filters: Record<string, any>;
  results: any[];
  isSearchOpen: boolean;
}

interface RecommendationState {
  recommendations: Recommendation[];
  isLoading: boolean;
  lastUpdated?: string;
  strategy?: string;
}

interface TaskState {
  tasks: Task[];
  isCreating: boolean;
  activeTask?: Task;
}

interface AssistantState {
  // Core state
  isOpen: boolean;
  messages: Message[];
  suggestions: Suggestion[];
  context: AssistantContext;
  isTyping: boolean;
  avatarExpression: AvatarExpression;
  userPreferences: UserPreferences;
  
  // Feature states
  search: SearchState;
  recommendations: RecommendationState;
  tasks: TaskState;
  
  // Conversation state
  conversationId?: string;
  isExpanded: boolean;
  unreadCount: number;
  
  // Hybrid navigation state
  navigationMode: NavigationMode;
  
  // Actions
  toggleAssistant: () => void;
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (message: Message) => void;
  updateContext: (context: Partial<AssistantContext>) => void;
  setIsTyping: (isTyping: boolean) => void;
  setAvatarExpression: (expression: AvatarExpression) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  clearMessages: () => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Record<string, any>) => void;
  setSearchResults: (results: any[]) => void;
  toggleSearch: () => void;
  
  // Recommendation actions
  setRecommendations: (recommendations: Recommendation[]) => void;
  setRecommendationLoading: (isLoading: boolean) => void;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  setActiveTask: (task: Task) => void;
  
  // Hybrid navigation actions
  setNavigationMode: (mode: NavigationMode) => void;
  
  // Utility actions
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  setExpanded: (expanded: boolean) => void;
}

const getInitialMessage = (mode: NavigationMode): Message => ({
  id: 'welcome-msg',
  content: mode === 'traditional' 
    ? "Hello! I'm Thando, your investment assistant. How can I help you today?"
    : mode === 'assisted'
    ? "Hello! I'm Thando, your AI-enhanced investment assistant. I can provide intelligent analysis and suggestions. How can I help you today?"
    : "Hello! I'm Thando, your autonomous AI investment assistant. I'll proactively provide insights and recommendations based on your portfolio and market conditions. How can I help you today?",
  sender: MessageSender.ASSISTANT,
  timestamp: new Date().toISOString(),
  contentType: MessageContentType.TEXT,
  aiGenerated: mode !== 'traditional',
  navigationMode: mode
});

const getInitialSuggestions = (mode: NavigationMode): Suggestion[] => {
  const baseSuggestions = [
    {
      id: 'suggestion-1',
      text: 'Show me portfolio performance',
      category: 'portfolio',
      action: 'show_portfolio_performance'
    },
    {
      id: 'suggestion-2', 
      text: 'Analyze risk metrics',
      category: 'risk',
      action: 'analyze_risk_metrics'
    }
  ];

  if (mode === 'traditional') {
    return baseSuggestions.concat([
      {
        id: 'suggestion-3',
        text: 'Find investment opportunities',
        category: 'opportunities',
        action: 'find_opportunities'
      },
      {
        id: 'suggestion-4',
        text: 'Compare asset allocations',
        category: 'analysis',
        action: 'compare_allocations'
      }
    ]);
  }

  const aiSuggestions = [
    {
      id: 'suggestion-3',
      text: 'Generate AI investment insights',
      category: 'ai-insights',
      action: 'generate_ai_insights',
      aiGenerated: true,
      navigationMode: mode
    },
    {
      id: 'suggestion-4',
      text: 'Optimize portfolio allocation',
      category: 'ai-optimization',
      action: 'optimize_allocation',
      aiGenerated: true,
      navigationMode: mode
    }
  ];

  if (mode === 'autonomous') {
    aiSuggestions.push({
      id: 'suggestion-5',
      text: 'Set up proactive monitoring',
      category: 'ai-monitoring',
      action: 'setup_monitoring',
      aiGenerated: true,
      navigationMode: mode
    });
  }

  return baseSuggestions.concat(aiSuggestions);
};

export const useAssistantStore = create<AssistantState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isOpen: false,
        navigationMode: 'traditional',
        messages: [getInitialMessage('traditional')],
        suggestions: getInitialSuggestions('traditional'),
        context: {
          page: 'dashboard',
          navigationMode: 'traditional',
          userPreferences: {
            preferredChartType: 'bar',
            favoriteMetrics: ['IRR', 'MOIC', 'PME'],
            dataFormat: 'table',
            theme: 'light',
            notificationFrequency: 'daily',
            responseDetailLevel: 'concise',
            navigationMode: 'traditional',
            lastUpdated: new Date().toISOString()
          }
        },
        isTyping: false,
        avatarExpression: 'neutral',
        userPreferences: {
          preferredChartType: 'bar',
          favoriteMetrics: ['IRR', 'MOIC', 'PME'],
          dataFormat: 'table',
          theme: 'light',
          notificationFrequency: 'daily',
          responseDetailLevel: 'concise',
          navigationMode: 'traditional',
          lastUpdated: new Date().toISOString()
        },
        
        // Feature states
        search: {
          isSearching: false,
          query: '',
          filters: {},
          results: [],
          isSearchOpen: false
        },
        recommendations: {
          recommendations: [],
          isLoading: false
        },
        tasks: {
          tasks: [],
          isCreating: false
        },
        
        // Conversation state
        isExpanded: false,
        unreadCount: 0,
        
        // Actions
        toggleAssistant: () => {
          const { isOpen } = get();
          set({ isOpen: !isOpen });
          if (!isOpen) {
            set({ unreadCount: 0 });
          }
        },
        
        setIsOpen: (isOpen: boolean) => {
          set({ isOpen });
          if (isOpen) {
            set({ unreadCount: 0 });
          }
        },
        
        addMessage: (message: Message) => {
          const { messages, isOpen } = get();
          set({ 
            messages: [...messages, message],
            unreadCount: isOpen ? 0 : get().unreadCount + (message.sender === MessageSender.ASSISTANT ? 1 : 0)
          });
        },
        
        updateContext: (context: Partial<AssistantContext>) => {
          set(state => ({
            context: { ...state.context, ...context }
          }));
        },
        
        setIsTyping: (isTyping: boolean) => {
          set({ isTyping });
        },
        
        setAvatarExpression: (expression: AvatarExpression) => {
          set({ avatarExpression: expression });
        },
        
        updateUserPreferences: (preferences: Partial<UserPreferences>) => {
          set(state => ({
            userPreferences: { 
              ...state.userPreferences, 
              ...preferences,
              lastUpdated: new Date().toISOString()
            }
          }));
        },
        
        setSuggestions: (suggestions: Suggestion[]) => {
          set({ suggestions });
        },
        
        clearMessages: () => {
          const { navigationMode } = get();
          set({ 
            messages: [getInitialMessage(navigationMode)]
          });
        },
        
        // Search actions
        setSearchQuery: (query: string) => {
          set(state => ({
            search: { ...state.search, query }
          }));
        },
        
        setSearchFilters: (filters: Record<string, any>) => {
          set(state => ({
            search: { ...state.search, filters }
          }));
        },
        
        setSearchResults: (results: any[]) => {
          set(state => ({
            search: { ...state.search, results, isSearching: false }
          }));
        },
        
        toggleSearch: () => {
          set(state => ({
            search: { ...state.search, isSearchOpen: !state.search.isSearchOpen }
          }));
        },
        
        // Recommendation actions
        setRecommendations: (recommendations: Recommendation[]) => {
          set(state => ({
            recommendations: { 
              ...state.recommendations, 
              recommendations,
              lastUpdated: new Date().toISOString()
            }
          }));
        },
        
        setRecommendationLoading: (isLoading: boolean) => {
          set(state => ({
            recommendations: { ...state.recommendations, isLoading }
          }));
        },
        
        // Task actions
        addTask: (task: Task) => {
          set(state => ({
            tasks: { ...state.tasks, tasks: [...state.tasks.tasks, task] }
          }));
        },
        
        updateTask: (taskId: string, updates: Partial<Task>) => {
          set(state => ({
            tasks: {
              ...state.tasks,
              tasks: state.tasks.tasks.map(task => 
                task.id === taskId ? { ...task, ...updates } : task
              )
            }
          }));
        },
        
        removeTask: (taskId: string) => {
          set(state => ({
            tasks: {
              ...state.tasks,
              tasks: state.tasks.tasks.filter(task => task.id !== taskId)
            }
          }));
        },
        
        setActiveTask: (task: Task) => {
          set(state => ({
            tasks: { ...state.tasks, activeTask: task }
          }));
        },
        
        // Hybrid navigation actions
        setNavigationMode: (mode: NavigationMode) => {
          const newMessages = [getInitialMessage(mode)];
          const newSuggestions = getInitialSuggestions(mode);
          
          set(state => ({
            navigationMode: mode,
            messages: newMessages,
            suggestions: newSuggestions,
            userPreferences: {
              ...state.userPreferences,
              navigationMode: mode
            },
            context: {
              ...state.context,
              navigationMode: mode
            }
          }));
        },
        
        // Utility actions
        incrementUnreadCount: () => {
          set(state => ({ unreadCount: state.unreadCount + 1 }));
        },
        
        resetUnreadCount: () => {
          set({ unreadCount: 0 });
        },
        
        setExpanded: (expanded: boolean) => {
          set({ isExpanded: expanded });
        }
      }),
      {
        name: 'dd-hybrid-assistant-store',
        partialize: (state) => ({
          userPreferences: state.userPreferences,
          navigationMode: state.navigationMode,
          context: state.context
        })
      }
    ),
    {
      name: 'dd-hybrid-assistant'
    }
  )
);