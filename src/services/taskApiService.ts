
import { supabase } from "@/integrations/supabase/client";

interface ApiError extends Error {
  status?: number;
  details?: any;
}

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
    try {
      const headers = await this.getAuthHeaders();
      const baseUrl = 'https://jkxpicilmypvdcqifmfv.supabase.co/functions/v1';
      
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle rate limiting
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({ error: 'Rate limit exceeded' }));
        throw new ApiError(`Rate limited: ${errorData.error || 'Too many requests'}`);
      }

      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
        throw new ApiError(`Authentication failed: ${errorData.error || 'Invalid token'}`);
      }

      // Handle authorization errors
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: 'Forbidden' }));
        throw new ApiError(`Access denied: ${errorData.error || 'Insufficient permissions'}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const error = new ApiError(errorData.error || `HTTP ${response.status}`);
        error.status = response.status;
        error.details = errorData;
        throw error;
      }

      return response.json();
    } catch (error) {
      // Log client-side errors for debugging (without sensitive data)
      console.error('API Request Error:', {
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // Analyze tasks endpoint with input validation
  async analyzeTasks(analysisType: 'priority' | 'workload' | 'timeline' = 'priority', tasks?: any[]) {
    // Validate analysis type
    const validTypes = ['priority', 'workload', 'timeline'];
    if (!validTypes.includes(analysisType)) {
      throw new Error('Invalid analysis type. Must be: priority, workload, or timeline');
    }

    // Validate tasks array if provided
    if (tasks !== undefined && !Array.isArray(tasks)) {
      throw new Error('Tasks must be an array');
    }

    return this.makeRequest('tasks-analyze', {
      method: 'POST',
      body: JSON.stringify({
        analysisType,
        tasks
      }),
    });
  }

  // Retrieve tasks endpoint with input validation
  async retrieveTasks(options: {
    limit?: number;
    offset?: number;
    priority?: 'low' | 'medium' | 'high';
    importance?: 'low' | 'medium' | 'high';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    // Validate inputs
    if (options.limit !== undefined && (options.limit < 1 || options.limit > 100)) {
      throw new Error('Limit must be between 1 and 100');
    }

    if (options.offset !== undefined && options.offset < 0) {
      throw new Error('Offset must be non-negative');
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (options.priority && !validPriorities.includes(options.priority)) {
      throw new Error('Invalid priority value');
    }

    if (options.importance && !validPriorities.includes(options.importance)) {
      throw new Error('Invalid importance value');
    }

    const allowedSortFields = ['created_at', 'updated_at', 'title', 'due_date', 'priority', 'importance'];
    if (options.sortBy && !allowedSortFields.includes(options.sortBy)) {
      throw new Error('Invalid sort field');
    }

    if (options.sortOrder && !['asc', 'desc'].includes(options.sortOrder)) {
      throw new Error('Sort order must be asc or desc');
    }

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

  // Update task endpoint with input validation
  async updateTask(taskId: string, updates: any) {
    if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
      throw new Error('Valid task ID is required');
    }

    if (!updates || typeof updates !== 'object') {
      throw new Error('Updates object is required');
    }

    // Validate update fields
    const allowedFields = ['title', 'description', 'due_date', 'priority', 'importance'];
    const invalidFields = Object.keys(updates).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
      throw new Error(`Invalid update fields: ${invalidFields.join(', ')}`);
    }

    return this.makeRequest('tasks-update', {
      method: 'POST',
      body: JSON.stringify({
        taskId: taskId.trim(),
        operation: 'update',
        updates
      }),
    });
  }

  // Create task endpoint with input validation
  async createTask(taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high';
    importance?: 'low' | 'medium' | 'high';
  }) {
    if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim().length === 0) {
      throw new Error('Task title is required and must be a non-empty string');
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (taskData.priority && !validPriorities.includes(taskData.priority)) {
      throw new Error('Invalid priority value');
    }

    if (taskData.importance && !validPriorities.includes(taskData.importance)) {
      throw new Error('Invalid importance value');
    }

    if (taskData.due_date && typeof taskData.due_date === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(taskData.due_date)) {
        throw new Error('Due date must be in YYYY-MM-DD format');
      }
    }

    return this.makeRequest('tasks-update', {
      method: 'POST',
      body: JSON.stringify({
        taskId: null,
        operation: 'create',
        updates: {
          ...taskData,
          title: taskData.title.trim()
        }
      }),
    });
  }

  // Delete task endpoint with input validation
  async deleteTask(taskId: string) {
    if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
      throw new Error('Valid task ID is required');
    }

    return this.makeRequest('tasks-update', {
      method: 'POST',
      body: JSON.stringify({
        taskId: taskId.trim(),
        operation: 'delete'
      }),
    });
  }
}

// Create a custom error class for API errors
class ApiError extends Error {
  status?: number;
  details?: any;

  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const taskApiService = new TaskApiService();
