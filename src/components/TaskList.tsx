import { useState, ReactNode } from 'react';
import { useApp } from '../store';
import { Task, Priority, Status } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Filter,
  Trash2,
  Edit3,
} from 'lucide-react';
import { formatShortDate, getInitials, priorityLabels } from '../utils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export default function TaskList({ onEditTask }: TaskListProps) {
  const { tasks, updateTask, deleteTask } = useApp();
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const priorityConfig: Record<Priority, { color: string; icon: ReactNode }> = {
    urgent: { color: 'text-red-500 bg-red-50', icon: <AlertTriangle size={14} /> },
    high: { color: 'text-orange-500 bg-orange-50', icon: <AlertTriangle size={14} /> },
    medium: { color: 'text-yellow-600 bg-yellow-50', icon: <Clock size={14} /> },
    low: { color: 'text-gray-500 bg-gray-100', icon: <Circle size={14} /> },
  };

  const statusConfig: Record<Status, { label: string; color: string }> = {
    'todo': { label: 'Por hacer', color: 'bg-gray-200 text-gray-700' },
    'in-progress': { label: 'En progreso', color: 'bg-teal-100 text-teal-700' },
    'review': { label: 'En revisión', color: 'bg-purple-100 text-purple-700' },
    'done': { label: 'Completada', color: 'bg-green-100 text-green-700' },
  };

  const toggleComplete = (task: Task) => {
    updateTask(task.id, {
      status: task.status === 'done' ? 'todo' : 'done',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as Status | 'all')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
          >
            <option value="all">Todos los estados</option>
            <option value="todo">Por hacer</option>
            <option value="in-progress">En progreso</option>
            <option value="review">En revisión</option>
            <option value="done">Completadas</option>
          </select>
        </div>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as Priority | 'all')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
        >
          <option value="all">Todas las prioridades</option>
          <option value="urgent">Urgente</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
        <span className="text-sm text-gray-400 ml-auto">
          {filteredTasks.length} tareas
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleComplete(task)}
                aria-label={task.status === 'done' ? 'Marcar como pendiente' : 'Marcar como completada'}
                className="mt-0.5 flex-shrink-0"
              >
                {task.status === 'done' ? (
                  <CheckCircle2 size={20} className="text-teal-500" />
                ) : (
                  <Circle size={20} className="text-gray-300 hover:text-teal-400 transition-colors" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 truncate">{task.description}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === task.id ? null : task.id)}
                      aria-label="Opciones de la tarea"
                      aria-expanded={openMenu === task.id}
                      className="p-1 rounded sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-gray-100 transition-all"
                    >
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                    {openMenu === task.id && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-36">
                        <button
                          onClick={() => { onEditTask(task); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <Edit3 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => { deleteTask(task.id); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${priorityConfig[task.priority].color}`}>
                    {priorityConfig[task.priority].icon}
                    {priorityLabels[task.priority]}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[task.status].color}`}>
                    {statusConfig[task.status].label}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {formatShortDate(task.dueDate)}
                    </span>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                      {getInitials(task.assignee)}
                    </div>
                    <span className="text-xs text-gray-400 hidden sm:inline">{task.assignee.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm">No se encontraron tareas con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}
