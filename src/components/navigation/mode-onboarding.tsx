'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { UserNavigationMode } from '@/types/navigation'
import { 
  Brain, 
  User, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  TrendingUp,
  Star,
  Trophy,
  Target
} from 'lucide-react'

interface ModeOnboardingProps {
  currentStep: number
  onComplete: () => void
  onStepChange: (step: number) => void
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  mode: UserNavigationMode['mode']
  benefits: string[]
  challenge?: string
  completionCriteria: string
  estimatedTime: string
}

export function ModeOnboarding({ currentStep, onComplete, onStepChange }: ModeOnboardingProps) {
  const { currentMode, setMode } = useNavigationStoreRefactored()
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([])
  const [currentProgress, setCurrentProgress] = React.useState(0)

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'traditional',
      title: 'Start with Traditional',
      description: 'Get familiar with the platform using standard navigation',
      icon: <User className="w-5 h-5" />,
      mode: 'traditional',
      benefits: [
        'Full control over every action',
        'No surprises or automation',
        'Learn the platform at your pace',
        'Build confidence with basic features'
      ],
      completionCriteria: 'Complete 3 tasks using traditional navigation',
      estimatedTime: '5-10 minutes'
    },
    {
      id: 'first-assistance',
      title: 'Try AI Suggestions',
      description: 'Experience helpful AI suggestions while maintaining control',
      icon: <Sparkles className="w-4 h-4" />,
      mode: 'assisted',
      benefits: [
        'Get smart recommendations',
        'Save time on routine tasks',
        'Learn efficient workflows',
        'Keep full oversight and control'
      ],
      challenge: 'Use 2 AI suggestions while completing your work',
      completionCriteria: 'Accept and use 2 AI recommendations',
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'assisted-mastery',
      title: 'Master AI Assistance',
      description: 'Become proficient with AI-powered workflows',
      icon: <Brain className="w-5 h-5" />,
      mode: 'assisted',
      benefits: [
        'Automate repetitive tasks',
        'Get proactive insights',
        'Accelerate complex workflows',
        'Maintain strategic oversight'
      ],
      challenge: 'Let AI help with 5 different types of tasks',
      completionCriteria: 'Successfully use AI assistance for 5 task types',
      estimatedTime: '20-30 minutes'
    },
    {
      id: 'autonomous-trial',
      title: 'Try Autonomous Mode',
      description: 'Experience conversational AI that takes initiative',
      icon: <Bot className="w-5 h-5" />,
      mode: 'autonomous',
      benefits: [
        'Natural conversation interface',
        'AI handles complex sequences',
        'Maximum productivity gains',
        'Focus on high-level decisions'
      ],
      challenge: 'Complete one complex task using only conversation',
      completionCriteria: 'Successfully complete a multi-step task via AI conversation',
      estimatedTime: '15-20 minutes'
    }
  ]

  const currentStepData = onboardingSteps[currentStep]
  const totalSteps = onboardingSteps.length
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  React.useEffect(() => {
    // Update progress based on completed steps
    const progress = (completedSteps.length / totalSteps) * 100
    setCurrentProgress(progress)
  }, [completedSteps, totalSteps])

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId])
    }
    
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleModeSwitch = (mode: UserNavigationMode['mode']) => {
    const modeConfig = {
      traditional: {
        suggestions: false,
        autoComplete: false,
        proactiveActions: false,
        autonomousExecution: false,
      },
      assisted: {
        suggestions: true,
        autoComplete: true,
        proactiveActions: false,
        autonomousExecution: false,
      },
      autonomous: {
        suggestions: true,
        autoComplete: true,
        proactiveActions: true,
        autonomousExecution: true,
      }
    }

    setMode({
      mode,
      aiPermissions: modeConfig[mode],
      preferredDensity: 'comfortable'
    })
  }

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>AI Navigation Onboarding</span>
            </div>
            <Badge variant="info" className="text-xs">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Learn to use our hybrid navigation system at your own pace. 
            Progress from traditional navigation to AI-powered assistance.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(currentProgress)}% Complete</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Progress Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isStepCompleted(step.id) 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : index === currentStep 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isStepCompleted(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    isStepCompleted(step.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-3">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="text-center w-24">
                <div className={`text-xs font-medium ${
                  index === currentStep ? 'text-blue-600' : 
                  isStepCompleted(step.id) ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Details */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {currentStepData.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentStepData.title}</h3>
              <p className="text-sm text-gray-500 font-normal">
                {currentStepData.description}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Challenge */}
          {currentStepData.challenge && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Challenge
              </h4>
              <p className="text-sm text-yellow-700">{currentStepData.challenge}</p>
            </div>
          )}

          {/* Benefits */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">What You'll Learn</h4>
            <div className="grid grid-cols-2 gap-3">
              {currentStepData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Criteria */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              To Complete This Step
            </h4>
            <p className="text-sm text-blue-700 mb-2">{currentStepData.completionCriteria}</p>
            <div className="flex items-center text-xs text-blue-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>Estimated time: {currentStepData.estimatedTime}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handleModeSwitch(currentStepData.mode)}
                disabled={currentMode.mode === currentStepData.mode}
              >
                {currentMode.mode === currentStepData.mode ? (
                  'Current Mode Active'
                ) : (
                  `Switch to ${currentStepData.mode === 'traditional' ? 'Traditional' : 
                               currentStepData.mode === 'assisted' ? 'Assisted' : 'Autonomous'}`
                )}
              </Button>
              
              {currentMode.mode === currentStepData.mode && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => onStepChange(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              
              <Button
                onClick={() => handleStepComplete(currentStepData.id)}
                className="flex items-center space-x-2"
              >
                <span>
                  {currentStep === totalSteps - 1 ? 'Complete Onboarding' : 'Mark Complete & Continue'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-800 mb-1">
                Remember: You're Always in Control
              </h4>
              <p className="text-xs text-green-700">
                You can switch between modes anytime, pause AI assistance, or revert any automated actions. 
                The AI learns from your preferences and adapts to your working style.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      {completedSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Your Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Completed Steps</h4>
                <div className="space-y-1">
                  {completedSteps.map(stepId => {
                    const step = onboardingSteps.find(s => s.id === stepId)
                    return step ? (
                      <div key={stepId} className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>{step.title}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Gained</h4>
                <div className="text-sm text-gray-600">
                  {completedSteps.length === 1 && "Basic platform navigation"}
                  {completedSteps.length === 2 && "AI suggestion usage"}
                  {completedSteps.length === 3 && "Advanced AI assistance"}
                  {completedSteps.length >= 4 && "Full AI navigation mastery"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}