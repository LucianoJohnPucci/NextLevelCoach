
import { supabase } from "@/integrations/supabase/client";

class TaskApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No valid authentication token');
    }
    
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders();
    const baseUrl = 'https://jkxpicilmypvdcqifmfv.supabase.co/functions/v1';
    
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Analyze tasks endpoint
  async analyzeTasks(analysisType: 'priority' | 'workload' | 'timeline' = 'priority', tasks?: any[]) {
    return this.makeRequest('tasks-analyze', {
      method: 'POST',
      body: JSON.stringify({
        analysisType,
        tasks
      }),
    });
  }

  // Retrieve tasks endpoint
  async retrieveTasks(options: {
    limit?: number;
    offset?: number;
    priority?: 'low' | 'medium' | 'high';
    importance?: 'low' | 'medium' | 'high';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = queryParams.toString() 
      ? `tasks-retrieve?${queryParams.toString()}`
      : 'tasks-retrieve';

    return this.makeRequest(endpoint, {
      method: 'GET',
    });
  }

  // Update/Create/Delete tasks endpoint
  async updateTask(taskId: string, updates: any) {
    return this.makeRequest('tasks-update', {
      method: 'POST',
      body: JSON.stringify({
        taskId,
        operation: 'update',
        updates
      }),
    });
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high';
    importance?: 'low' | 'medium' | 'high';
  }) {
    return this.makeRequest('tasks-update', {
      method: 'POST',
      body: JSON.stringify({
        taskId: null,
        operation: 'create',
        updates: taskData
      }),
    });
  }

  async deleteTask(taskId: string) {
    return this.makeRequest('tasks-update', {
      method: 'POST',
      body: JSON.stringify({
        taskId,
        operation: 'delete'
      }),
    });
  }
}

export const taskApiService = new TaskApiService();
