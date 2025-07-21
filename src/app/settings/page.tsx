'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModeSwitcher } from '@/components/navigation/mode-switcher'
import { useNavigationStore } from '@/stores/navigation-store'
import { Settings, User, Bell, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  const { currentMode, preferences, updatePreferences } = useNavigationStore()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your preferences and navigation mode
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {currentMode.mode} Mode
        </Badge>
      </div>

      {/* Navigation Mode Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Navigation Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ModeSwitcher />
        </CardContent>
      </Card>

      {/* AI Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            AI Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Suggestions</p>
                  <p className="text-sm text-gray-500">Show AI recommendations</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={preferences.aiPermissions.suggestions ? 'success' : 'outline'}>
                    {preferences.aiPermissions.suggestions ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Complete</p>
                  <p className="text-sm text-gray-500">AI completes routine tasks</p>
                </div>
                <Badge variant={preferences.aiPermissions.autoComplete ? 'success' : 'outline'}>
                  {preferences.aiPermissions.autoComplete ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Proactive Actions</p>
                  <p className="text-sm text-gray-500">AI suggests next steps</p>
                </div>
                <Badge variant={preferences.aiPermissions.proactiveActions ? 'success' : 'outline'}>
                  {preferences.aiPermissions.proactiveActions ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autonomous Execution</p>
                  <p className="text-sm text-gray-500">AI executes approved tasks</p>
                </div>
                <Badge variant={preferences.aiPermissions.autonomousExecution ? 'ai' : 'outline'}>
                  {preferences.aiPermissions.autonomousExecution ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Analysis</p>
                  <p className="text-sm text-gray-500">AI analyzes documents</p>
                </div>
                <Badge variant={preferences.aiPermissions.dataAnalysis ? 'success' : 'outline'}>
                  {preferences.aiPermissions.dataAnalysis ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Report Generation</p>
                  <p className="text-sm text-gray-500">AI creates reports</p>
                </div>
                <Badge variant={preferences.aiPermissions.reportGeneration ? 'success' : 'outline'}>
                  {preferences.aiPermissions.reportGeneration ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Meeting Scheduling</p>
                  <p className="text-sm text-gray-500">AI manages calendar</p>
                </div>
                <Badge variant={preferences.aiPermissions.meetingScheduling ? 'success' : 'outline'}>
                  {preferences.aiPermissions.meetingScheduling ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Document Processing</p>
                  <p className="text-sm text-gray-500">AI processes uploads</p>
                </div>
                <Badge variant={preferences.aiPermissions.documentProcessing ? 'success' : 'outline'}>
                  {preferences.aiPermissions.documentProcessing ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Interface Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">UI Density</p>
              <p className="text-sm text-gray-500">Control spacing and size</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {preferences.uiDensity}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show AI Hints</p>
              <p className="text-sm text-gray-500">Display helpful tooltips</p>
            </div>
            <Badge variant={preferences.showAIHints ? 'success' : 'outline'}>
              {preferences.showAIHints ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Save</p>
              <p className="text-sm text-gray-500">Automatically save changes</p>
            </div>
            <Badge variant={preferences.autoSaveEnabled ? 'success' : 'outline'}>
              {preferences.autoSaveEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Badge variant={preferences.notificationSettings.emailNotifications ? 'success' : 'outline'}>
                {preferences.notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Browser notifications</p>
              </div>
              <Badge variant={preferences.notificationSettings.pushNotifications ? 'success' : 'outline'}>
                {preferences.notificationSettings.pushNotifications ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Recommendations</p>
                <p className="text-sm text-gray-500">Notify about AI insights</p>
              </div>
              <Badge variant={preferences.notificationSettings.aiRecommendations ? 'ai' : 'outline'}>
                {preferences.notificationSettings.aiRecommendations ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deadline Reminders</p>
                <p className="text-sm text-gray-500">Alerts for due dates</p>
              </div>
              <Badge variant={preferences.notificationSettings.deadlineReminders ? 'warning' : 'outline'}>
                {preferences.notificationSettings.deadlineReminders ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Adoption Level */}
      <Card>
        <CardHeader>
          <CardTitle>AI Adoption Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Level</span>
              <Badge variant="ai">{preferences.aiAdoptionLevel}/10</Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${preferences.aiAdoptionLevel * 10}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-500">
              {preferences.aiAdoptionLevel < 3 && "Getting started with AI assistance"}
              {preferences.aiAdoptionLevel >= 3 && preferences.aiAdoptionLevel < 7 && "Comfortable with AI features"}
              {preferences.aiAdoptionLevel >= 7 && "Advanced AI user"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}