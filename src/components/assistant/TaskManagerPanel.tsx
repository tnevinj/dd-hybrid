'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListTodo, Brain, Zap, CheckSquare, Clock, AlertCircle } from 'lucide-react';

interface TaskManagerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: any[];
  isCreating: boolean;
  activeTask?: any;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * TaskManagerPanel Component - Enhanced for DD-Hybrid
 * 
 * AI-powered task management panel with hybrid navigation support
 */
const TaskManagerPanel: React.FC<TaskManagerPanelProps> = ({
  isOpen,
  onClose,
  tasks,
  isCreating,
  activeTask,
  mode = 'traditional'
}) => {
  const getModeIcon = () => {
    switch (mode) {
      case 'autonomous':
        return <Zap className="h-4 w-4 text-purple-600" />;
      case 'assisted':
        return <Brain className="h-4 w-4 text-blue-600" />;
      default:
        return <ListTodo className="h-4 w-4" />;
    }
  };

  // Sample tasks for demonstration
  const sampleTasks = [
    {
      id: '1',
      title: 'Review Q1 Portfolio Performance',
      description: 'Analyze portfolio performance metrics and prepare board presentation',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2025-02-15',
      aiGenerated: mode !== 'traditional'
    },
    {
      id: '2',
      title: 'Update Due Diligence Checklist',
      description: 'Incorporate new ESG requirements into standard DD process',
      status: 'pending',
      priority: 'medium',
      dueDate: '2025-02-20',
      aiGenerated: mode === 'autonomous'
    },
    {
      id: '3',
      title: 'Prepare Investment Committee Materials',
      description: 'Compile deal analysis and recommendations for upcoming IC meeting',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-01-30',
      aiGenerated: false
    }
  ];

  const displayTasks = tasks.length > 0 ? tasks : sampleTasks;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <ListTodo className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getModeIcon()}
            Task Manager
            {mode !== 'traditional' && (
              <Badge variant="outline" className="text-xs capitalize">
                AI-Powered
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Task creation button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Tasks</h3>
            <Button disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Task'}
            </Button>
          </div>

          {/* Tasks list */}
          <div className="space-y-3">
            {displayTasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{task.title}</h4>
                        {task.aiGenerated && mode !== 'traditional' && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            {getModeIcon()}
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Due: {task.dueDate}</span>
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {task.status === 'completed' ? 'View' : 'Edit'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* AI enhancement info */}
          {mode !== 'traditional' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getModeIcon()}
                <span className="text-sm font-medium">AI Task Intelligence</span>
              </div>
              <p className="text-xs text-gray-600">
                {mode === 'autonomous' 
                  ? 'Tasks are automatically created and prioritized based on your workflow and deadlines.'
                  : 'Thando suggests task priorities and deadlines based on your context and calendar.'
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskManagerPanel;