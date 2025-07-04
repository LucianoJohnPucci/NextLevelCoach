
import { taskApiService } from "./taskApiService";

export interface ChatCommand {
  type: 'retrieve' | 'update' | 'analyze' | 'create' | 'delete';
  intent: string;
  parameters: any;
}

export class ChatCommandService {
  private static parseCommand(message: string): ChatCommand | null {
    const lowerMessage = message.toLowerCase();
    
    // Show/retrieve commands
    if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('get')) {
      if (lowerMessage.includes('high priority')) {
        return {
          type: 'retrieve',
          intent: 'show_high_priority_tasks',
          parameters: { priority: 'high' }
        };
      }
      if (lowerMessage.includes('medium priority')) {
        return {
          type: 'retrieve',
          intent: 'show_medium_priority_tasks',
          parameters: { priority: 'medium' }
        };
      }
      if (lowerMessage.includes('low priority')) {
        return {
          type: 'retrieve',
          intent: 'show_low_priority_tasks',
          parameters: { priority: 'low' }
        };
      }
      if (lowerMessage.includes('due this week') || lowerMessage.includes('due week')) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return {
          type: 'retrieve',
          intent: 'show_tasks_due_this_week',
          parameters: { due_before: nextWeek.toISOString().split('T')[0] }
        };
      }
      if (lowerMessage.includes('task')) {
        return {
          type: 'retrieve',
          intent: 'show_all_tasks',
          parameters: {}
        };
      }
    }
    
    // Update commands
    if (lowerMessage.includes('update')) {
      const taskMatch = lowerMessage.match(/task\s+(\w+)/);
      const taskId = taskMatch ? taskMatch[1] : null;
      
      if (lowerMessage.includes('high priority') || lowerMessage.includes('high importance')) {
        return {
          type: 'update',
          intent: 'update_task_priority',
          parameters: { taskId, priority: 'high', importance: 'high' }
        };
      }
      if (lowerMessage.includes('medium priority') || lowerMessage.includes('medium importance')) {
        return {
          type: 'update',
          intent: 'update_task_priority',
          parameters: { taskId, priority: 'medium', importance: 'medium' }
        };
      }
      if (lowerMessage.includes('low priority') || lowerMessage.includes('low importance')) {
        return {
          type: 'update',
          intent: 'update_task_priority',
          parameters: { taskId, priority: 'low', importance: 'low' }
        };
      }
    }
    
    // Analysis commands
    if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
      if (lowerMessage.includes('completion') || lowerMessage.includes('pattern')) {
        return {
          type: 'analyze',
          intent: 'analyze_completion_patterns',
          parameters: { analysisType: 'workload' }
        };
      }
      if (lowerMessage.includes('priority')) {
        return {
          type: 'analyze',
          intent: 'analyze_priority_distribution',
          parameters: { analysisType: 'priority' }
        };
      }
      if (lowerMessage.includes('timeline') || lowerMessage.includes('due')) {
        return {
          type: 'analyze',
          intent: 'analyze_timeline',
          parameters: { analysisType: 'timeline' }
        };
      }
      return {
        type: 'analyze',
        intent: 'general_analysis',
        parameters: { analysisType: 'priority' }
      };
    }
    
    // Create commands
    if (lowerMessage.includes('create') || lowerMessage.includes('add')) {
      const titleMatch = lowerMessage.match(/(?:create|add)\s+(?:task\s+)?["']?([^"']+)["']?/);
      const title = titleMatch ? titleMatch[1].trim() : 'New Task';
      
      return {
        type: 'create',
        intent: 'create_task',
        parameters: {
          title,
          priority: lowerMessage.includes('high') ? 'high' : 
                   lowerMessage.includes('low') ? 'low' : 'medium',
          importance: lowerMessage.includes('important') ? 'high' : 'medium'
        }
      };
    }
    
    return null;
  }

  static async executeCommand(message: string): Promise<string> {
    const command = this.parseCommand(message);
    
    if (!command) {
      return "I didn't understand that command. Try asking me to:\n• Show your high priority tasks\n• Update a task's priority\n• Analyze your task patterns\n• Create a new task";
    }

    try {
      switch (command.type) {
        case 'retrieve':
          return await this.handleRetrieveCommand(command);
        case 'update':
          return await this.handleUpdateCommand(command);
        case 'analyze':
          return await this.handleAnalyzeCommand(command);
        case 'create':
          return await this.handleCreateCommand(command);
        default:
          return "Command type not supported yet.";
      }
    } catch (error) {
      console.error('Error executing command:', error);
      return "Sorry, I encountered an error while processing your request. Please try again.";
    }
  }

  private static async handleRetrieveCommand(command: ChatCommand): Promise<string> {
    const result = await taskApiService.retrieveTasks(command.parameters);
    
    if (!result.success || !result.tasks || result.tasks.length === 0) {
      return "No tasks found matching your criteria.";
    }

    const tasks = result.tasks;
    let response = `Found ${tasks.length} task(s):\n\n`;
    
    tasks.forEach((task: any, index: number) => {
      response += `${index + 1}. **${task.title}**\n`;
      response += `   Priority: ${task.priority || 'medium'} | Importance: ${task.importance || 'medium'}\n`;
      if (task.due_date) {
        response += `   Due: ${new Date(task.due_date).toLocaleDateString()}\n`;
      }
      if (task.description) {
        response += `   Description: ${task.description}\n`;
      }
      response += '\n';
    });

    return response;
  }

  private static async handleUpdateCommand(command: ChatCommand): Promise<string> {
    const { taskId, ...updates } = command.parameters;
    
    if (!taskId) {
      return "Please specify which task to update. For example: 'Update task ABC123 to high priority'";
    }

    const result = await taskApiService.updateTask(taskId, updates);
    
    if (result.success) {
      return `Task updated successfully! Set priority to ${updates.priority} and importance to ${updates.importance}.`;
    } else {
      return "Failed to update task. Please check the task ID and try again.";
    }
  }

  private static async handleAnalyzeCommand(command: ChatCommand): Promise<string> {
    const result = await taskApiService.analyzeTasks(command.parameters.analysisType);
    
    if (!result.success) {
      return "Failed to analyze tasks. Please try again.";
    }

    const analysis = result.analysis;
    let response = "📊 **Task Analysis:**\n\n";

    if (command.parameters.analysisType === 'priority') {
      response += `**Priority Distribution:**\n`;
      response += `• High: ${analysis.priorityDistribution?.high || 0} tasks\n`;
      response += `• Medium: ${analysis.priorityDistribution?.medium || 0} tasks\n`;
      response += `• Low: ${analysis.priorityDistribution?.low || 0} tasks\n\n`;
      
      response += `**Importance Distribution:**\n`;
      response += `• High: ${analysis.importanceDistribution?.high || 0} tasks\n`;
      response += `• Medium: ${analysis.importanceDistribution?.medium || 0} tasks\n`;
      response += `• Low: ${analysis.importanceDistribution?.low || 0} tasks\n\n`;
      
      if (analysis.urgentImportantTasks?.length > 0) {
        response += `⚠️ **Urgent & Important Tasks:** ${analysis.urgentImportantTasks.length}\n\n`;
      }
      
      if (analysis.recommendations?.length > 0) {
        response += `**Recommendations:**\n`;
        analysis.recommendations.forEach((rec: string) => {
          response += `• ${rec}\n`;
        });
      }
    } else if (command.parameters.analysisType === 'workload') {
      response += `**Workload Analysis:**\n`;
      response += `• Total tasks: ${analysis.totalTasks}\n`;
      response += `• Tasks with due dates: ${analysis.tasksWithDueDates}\n`;
      response += `• Overdue tasks: ${analysis.overdueTasks}\n`;
      response += `• Workload status: ${analysis.workloadStatus}\n`;
    } else if (command.parameters.analysisType === 'timeline') {
      response += `**Timeline Analysis:**\n`;
      response += `• Due today: ${analysis.dueToday} tasks\n`;
      response += `• Due this week: ${analysis.dueThisWeek} tasks\n`;
      response += `• Due this month: ${analysis.dueThisMonth} tasks\n`;
    }

    return response;
  }

  private static async handleCreateCommand(command: ChatCommand): Promise<string> {
    const result = await taskApiService.createTask(command.parameters);
    
    if (result.success) {
      return `✅ Task created successfully!\n**Title:** ${command.parameters.title}\n**Priority:** ${command.parameters.priority}\n**Importance:** ${command.parameters.importance}`;
    } else {
      return "Failed to create task. Please try again.";
    }
  }
}
