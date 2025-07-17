import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Task } from '../services/api';

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: Task['priority']) => Promise<void>;
  isDarkMode: boolean;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isDarkMode, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(title.trim(), description.trim(), priority);
        setTitle('');
        setDescription('');
        setPriority('medium');
        setIsExpanded(false);
      } catch (error) {
        console.error('Error creating task:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700',
    high: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700'
  };

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 transition-colors ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Add New Task
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isLoading || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          {isExpanded ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={`block text-sm font-medium mb-1 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className={`block text-sm font-medium mb-1 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter task description..."
              required
            />
          </div>

          <div>
            <label htmlFor="priority" className={`block text-sm font-medium mb-1 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
            <div className={`px-3 py-1 rounded-full text-sm border ${priorityColors[priority]}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </div>
          </div>
        </form>
      )}
    </div>
  );
};