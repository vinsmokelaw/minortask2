const API_BASE = 'http://localhost:3001/api';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth methods
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async signup(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async verifyToken(): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async createTask(title: string, description: string, priority: Task['priority'] = 'medium'): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title, description, priority })
    });
    
    return this.handleResponse(response);
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    
    return this.handleResponse(response);
  }

  async deleteTask(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE}/health`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();