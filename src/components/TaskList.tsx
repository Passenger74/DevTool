import { useState, ReactNode } from 'react';
import { useApp } from '../store';
import { useTheme } from '../theme';
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
  CheckSquare,
  Square,
  X,
  ListChecks,
} from 'lucide-react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export default function TaskList({ onEditTask }: TaskListProps) {
  const { 
    tasks, updateTask, deleteTask,
    selectedTasks, toggleTaskSelection, selectAllTasks, 
    clearTaskSelection, deleteSelectedTasks, updateSelectedTasksStatus 
  } = useApp();
  const { theme } = useTheme();
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<'delete' | 'status' | null>(null);

  // Extraer todas las etiquetas únicas de las tareas
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags))).sort();

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => task.tags.includes(tag))) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  const allFilteredSelected = filteredTasks.length > 0 && 
    filteredTasks.every(t => selectedTasks.includes(t.id));

  const handleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      filteredTasks.forEach(t => {
        if (selectedTasks.includes(t.id)) toggleTaskSelection(t.id);
      });
    } else {
      filteredTasks.forEach(t => {
        if (!selectedTasks.includes(t.id)) toggleTaskSelection(t.id);
      });
    }
  };

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

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return;
    if (confirm(`¿Eliminar ${selectedTasks.length} tarea(s) seleccionada(s)?`)) {
      deleteSelectedTasks();
      setBulkAction(null);
    }
  };

  const handleBulkStatusChange = (status: Status) => {
    updateSelectedTasksStatus(status);
    setBulkAction(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
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

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Etiquetas:</span>
            {selectedTags.length > 0 && (
              <button
                onClick={clearTagFilters}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={12} />
                Limpiar
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    isSelected
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={isSelected ? { backgroundColor: theme.primary } : {}}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedTasks.length > 0 && (
        <div 
          className="flex flex-wrap items-center gap-3 p-3 rounded-xl mb-4 border"
          style={{ 
            backgroundColor: theme.primaryLight,
            borderColor: theme.primary + '40',
          }}
        >
          <div className="flex items-center gap-2">
            <ListChecks size={18} style={{ color: theme.primary }} />
            <span className="text-sm font-medium" style={{ color: theme.primary }}>
              {selectedTasks.length} tarea(s) seleccionada(s)
            </span>
          </div>
          
          <div className="flex-1"></div>

          {/* Bulk status change */}
          <div className="relative">
            <button
              onClick={() => setBulkAction(bulkAction === 'status' ? null : 'status')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <CheckSquare size={14} />
              Cambiar estado
            </button>
            {bulkAction === 'status' && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-40">
                {(Object.keys(statusConfig) as Status[]).map(status => (
                  <button
                    key={status}
                    onClick={() => handleBulkStatusChange(status)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className={`w-2 h-2 rounded-full ${statusConfig[status].color.split(' ')[0]}`}></span>
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bulk delete */}
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <Trash2 size={14} />
            Eliminar
          </button>

          {/* Clear selection */}
          <button
            onClick={clearTaskSelection}
            className="p-1.5 rounded-lg hover:bg-white/50 text-gray-500"
            title="Limpiar selección"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Select All Button */}
      {filteredTasks.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handleSelectAllFiltered}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {allFilteredSelected ? (
              <CheckSquare size={18} style={{ color: theme.primary }} />
            ) : (
              <Square size={18} className="text-gray-400" />
            )}
            {allFilteredSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.map(task => {
          const isSelected = selectedTasks.includes(task.id);
          return (
            <div
              key={task.id}
              className={`group bg-white rounded-xl border p-4 hover:shadow-md transition-all ${
                isSelected ? 'border-2' : 'border-gray-100 hover:border-gray-200'
              }`}
              style={isSelected ? { 
                borderColor: theme.primary,
                backgroundColor: theme.primaryLight + '40',
              } : {}}
            >
              <div className="flex items-start gap-3">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleTaskSelection(task.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {isSelected ? (
                    <CheckSquare size={20} style={{ color: theme.primary }} />
                  ) : (
                    <Square size={20} className="text-gray-300 hover:text-gray-400" />
                  )}
                </button>

                {/* Complete Checkbox */}
                <button
                  onClick={() => toggleComplete(task)}
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
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
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
                      {task.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[task.status].color}`}>
                      {statusConfig[task.status].label}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
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
          );
        })}
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
