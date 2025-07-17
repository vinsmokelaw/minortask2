import React, { useState } from 'react';
import { Edit2, Trash2, Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Task } from '../services/api';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isDarkMode: boolean;
  isLoading?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, isDarkMode, isLoading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (editTitle.trim() && editDescription.trim() && !isUpdating) {
      setIsUpdating(true);
      try {
        await onUpdate(task.id, {
          title: editTitle.trim(),
          description: editDescription.trim()
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating task:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (newStatus !== task.status && !isUpdating) {
      setIsUpdating(true);
      try {
        await onUpdate(task.id, { status: newStatus });
      } catch (error) {
        console.error('Error updating task status:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting task:', error);
        setIsDeleting(false);
      }
    }
  };

  const statusConfig = {
    pending: { 
      color: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800', 
      icon: Clock, 
      label: 'Pending' 
    },
    in_progress: { 
      color: isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800', 
      icon: AlertCircle, 
      label: 'In Progress' 
    },
    completed: { 
      color: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800', 
      icon: Check, 
      label: 'Completed' 
    }
  };

  const priorityConfig = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500'
  };

  const StatusIcon = statusConfig[task.status].icon;
  const isTaskLoading = isLoading || isUpdating || isDeleting;

  return (
    <div className={`rounded-lg shadow-md p-6 border-l-4 ${priorityConfig[task.priority]} hover:shadow-lg transition-all ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } ${isTaskLoading ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusIcon size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[task.status].color}`}>
            {statusConfig[task.status].label}
          </span>
          <span className={`text-sm capitalize transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {task.priority} Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isTaskLoading}
            className={`p-1 transition-colors disabled:opacity-50 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isTaskLoading}
            className={`p-1 transition-colors disabled:opacity-50 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-red-400' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isUpdating}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            disabled={isUpdating}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim() || !editDescription.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating && <Loader2 size={16} className="animate-spin" />}
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isUpdating}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className={`text-lg font-semibold mb-2 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {task.title}
          </h3>
          <p className={`mb-4 transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {task.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={isTaskLoading}
                className={`px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 ${
                  task.status === 'pending' 
                    ? isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800'
                    : isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusChange('in_progress')}
                disabled={isTaskLoading}
                className={`px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 ${
                  task.status === 'in_progress' 
                    ? isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800'
                    : isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/50' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={isTaskLoading}
                className={`px-3 py-1 rounded-md text-sm transition-colors disabled:opacity-50 ${
                  task.status === 'completed' 
                    ? isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-200 text-green-800'
                    : isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-800/50' : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                Completed
              </button>
            </div>
            
            <div className={`text-sm transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {new Date(task.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 transition-colors ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Delete Task
            </h3>
            <p className={`mb-6 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};