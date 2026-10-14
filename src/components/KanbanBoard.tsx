import { DragEvent } from 'react';
import { useApp } from '../store';
import { Task, Status } from '../types';
import { Plus, GripVertical } from 'lucide-react';
import { formatShortDate, getInitials } from '../utils';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

const columns: { id: Status; title: string; color: string; dotColor: string }[] = [
  { id: 'todo', title: 'Por hacer', color: 'border-gray-300', dotColor: 'bg-gray-400' },
  { id: 'in-progress', title: 'En progreso', color: 'border-teal-400', dotColor: 'bg-teal-500' },
  { id: 'review', title: 'En revisión', color: 'border-purple-400', dotColor: 'bg-purple-500' },
  { id: 'done', title: 'Completadas', color: 'border-green-400', dotColor: 'bg-green-500' },
];

const priorityColors: Record<string, string> = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-300',
};

export default function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const { tasks, moveTask } = useApp();

  const getTasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

  const handleDragStart = (e: DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="bg-gray-50 rounded-xl p-3 min-h-[400px]"
              onDrop={e => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`}></span>
                  <h3 className="text-sm font-semibold text-gray-700">{column.title}</h3>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                  <Plus size={14} className="text-gray-400" />
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={e => handleDragStart(e, task.id)}
                    onClick={() => onEditTask(task)}
                    className={`bg-white rounded-lg p-3 border border-gray-100 border-l-4 ${priorityColors[task.priority]} cursor-grab active:cursor-grabbing hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate">{task.title}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            {task.priority === 'urgent' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-medium">
                                Urgente
                              </span>
                            )}
                            {task.tags.slice(0, 1).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white text-[9px] font-bold" title={task.assignee}>
                            {getInitials(task.assignee)}
                          </div>
                        </div>

                        {task.dueDate && (
                          <p className="text-[10px] text-gray-400 mt-2">
                            📅 {formatShortDate(task.dueDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
