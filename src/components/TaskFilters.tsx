import React from 'react';
import { Filter, List, Clock, AlertCircle, Check } from 'lucide-react';
import { Task } from '../services/api';

interface TaskFiltersProps {
  statusFilter: Task['status'] | 'all';
  priorityFilter: Task['priority'] | 'all';
  onStatusFilterChange: (status: Task['status'] | 'all') => void;
  onPriorityFilterChange: (priority: Task['priority'] | 'all') => void;
  taskCounts: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
  isDarkMode: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  taskCounts,
  isDarkMode
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: List, count: taskCounts.total },
    { value: 'pending', label: 'Pending', icon: Clock, count: taskCounts.pending },
    { value: 'in_progress', label: 'In Progress', icon: AlertCircle, count: taskCounts.in_progress },
    { value: 'completed', label: 'Completed', icon: Check, count: taskCounts.completed }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 transition-colors ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
        <h2 className={`text-lg font-semibold transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Filter Tasks
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value as Task['status'] | 'all')}
                  className={`flex items-center gap-2 p-3 rounded-md text-sm transition-colors border-2 ${
                    statusFilter === option.value
                      ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs transition-colors ${
                    isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Priority
          </label>
          <div className="space-y-2">
            {priorityOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onPriorityFilterChange(option.value as Task['priority'] | 'all')}
                className={`w-full flex items-center gap-2 p-3 rounded-md text-sm transition-colors border-2 ${
                  priorityFilter === option.value
                    ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  option.value === 'high' ? 'bg-red-500' :
                  option.value === 'medium' ? 'bg-yellow-500' :
                  option.value === 'low' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};