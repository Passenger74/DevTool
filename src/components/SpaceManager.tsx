import { useState } from 'react';
import { useApp } from '../store';
import { useTheme } from '../theme';
import { Space } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, X, Check, ChevronRight, ChevronDown, Folder, CheckCircle2 } from 'lucide-react';

const spaceIcons = ['📁', '📂', '🗂️', '📊', '📈', '📉', '💼', '🏢', '🎯', '🚀', '⭐', '🔥'];
const spaceColors = [
  '#0D9488', '#F97316', '#8B5CF6', '#06B6D4', '#EC4899',
  '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#6366F1',
];

export default function SpaceManager() {
  const { spaces, tasks, teams, addSpace, updateSpace, deleteSpace, verifyTask } = useApp();
  const { theme } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());
  const [selectedSpaceDetail, setSelectedSpaceDetail] = useState<Space | null>(null);

  // Form states
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceIcon, setNewSpaceIcon] = useState(spaceIcons[0]);
  const [newSpaceColor, setNewSpaceColor] = useState(spaceColors[0]);
  const [newSpaceParent, setNewSpaceParent] = useState<string | null>(null);
  const [newSpaceTeam, setNewSpaceTeam] = useState<string | undefined>(undefined);

  const rootSpaces = spaces.filter(s => !s.parentId);
  const getSubSpaces = (parentId: string) => spaces.filter(s => s.parentId === parentId);

  const toggleExpand = (spaceId: string) => {
    const newExpanded = new Set(expandedSpaces);
    if (newExpanded.has(spaceId)) {
      newExpanded.delete(spaceId);
    } else {
      newExpanded.add(spaceId);
    }
    setExpandedSpaces(newExpanded);
  };

  const getSpaceTasks = (spaceId: string) => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space?.teamId) return [];
    return tasks.filter(t => t.teamId === space.teamId);
  };

  const getCompletedTasks = (spaceId: string) => {
    return getSpaceTasks(spaceId).filter(t => t.status === 'done');
  };

  const handleCreateSpace = () => {
    if (!newSpaceName.trim()) return;

    const newSpace: Space = {
      id: uuidv4(),
      name: newSpaceName.trim(),
      icon: newSpaceIcon,
      color: newSpaceColor,
      taskCount: 0,
      parentId: newSpaceParent,
      teamId: newSpaceTeam,
    };

    addSpace(newSpace);
    resetForm();
    setShowCreateModal(false);
  };

  const handleUpdateSpace = () => {
    if (!editingSpace) return;
    updateSpace(editingSpace.id, {
      name: newSpaceName.trim(),
      icon: newSpaceIcon,
      color: newSpaceColor,
      teamId: newSpaceTeam,
    });
    resetForm();
    setEditingSpace(null);
  };

  const handleDeleteSpace = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este espacio? Los subespacios también serán eliminados.')) {
      // Eliminar subespacios recursivamente
      const deleteRecursive = (spaceId: string) => {
        const subSpaces = getSubSpaces(spaceId);
        subSpaces.forEach(sub => deleteRecursive(sub.id));
        deleteSpace(spaceId);
      };
      deleteRecursive(id);
    }
  };

  const resetForm = () => {
    setNewSpaceName('');
    setNewSpaceIcon(spaceIcons[0]);
    setNewSpaceColor(spaceColors[0]);
    setNewSpaceParent(null);
    setNewSpaceTeam(undefined);
  };

  const openCreateModal = (parentId?: string) => {
    resetForm();
    if (parentId) {
      setNewSpaceParent(parentId);
      const parent = spaces.find(s => s.id === parentId);
      if (parent?.teamId) {
        setNewSpaceTeam(parent.teamId);
      }
    }
    setShowCreateModal(true);
  };

  const openEditModal = (space: Space) => {
    setEditingSpace(space);
    setNewSpaceName(space.name);
    setNewSpaceIcon(space.icon);
    setNewSpaceColor(space.color);
    setNewSpaceTeam(space.teamId);
  };

  const renderSpaceCard = (space: Space, level: number = 0) => {
    const subSpaces = getSubSpaces(space.id);
    const hasChildren = subSpaces.length > 0;
    const isExpanded = expandedSpaces.has(space.id);
    const spaceTasks = getSpaceTasks(space.id);
    const completedTasks = getCompletedTasks(space.id);

    return (
      <div key={space.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow mb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(space.id)}
                  className="mt-1 text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
              {!hasChildren && <div className="w-[18px]" />}
              
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${space.color}20` }}
              >
                {space.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{space.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>{spaceTasks.length} tareas</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-green-500" />
                    {completedTasks.length} completadas
                  </span>
                  {space.teamId && (
                    <span>
                      Equipo: {teams.find(t => t.id === space.teamId)?.name || 'Sin equipo'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setSelectedSpaceDetail(space)}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Ver tareas"
              >
                <CheckCircle2 size={16} />
              </button>
              {level === 0 && (
                <button
                  onClick={() => openCreateModal(space.id)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Crear subespacio"
                >
                  <Folder size={16} />
                </button>
              )}
              <button
                onClick={() => openEditModal(space)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDeleteSpace(space.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-6">
            {subSpaces.map(subSpace => renderSpaceCard(subSpace, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Espacios</h1>
        <p className="text-gray-600">Organiza tus proyectos en espacios jerárquicos con subniveles</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
          style={{ background: theme.gradient }}
        >
          <Plus size={18} />
          Nuevo Espacio
        </button>
      </div>

      <div className="space-y-2">
        {rootSpaces.map(space => renderSpaceCard(space, 0))}
      </div>

      {rootSpaces.length === 0 && (
        <div className="text-center py-12">
          <Folder size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No hay espacios creados aún</p>
          <p className="text-sm text-gray-400 mt-2">Crea tu primer espacio para comenzar a organizar tus proyectos</p>
        </div>
      )}

      {/* Create/Edit Space Modal */}
      {(showCreateModal || editingSpace) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingSpace ? 'Editar Espacio' : 'Crear Nuevo Espacio'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSpace(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del espacio
                </label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Ej: Marketing, Desarrollo, Diseño..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {spaceIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewSpaceIcon(icon)}
                      className={`w-12 h-12 rounded-lg text-2xl transition-all ${
                        newSpaceIcon === icon
                          ? 'ring-2 ring-offset-2 ring-gray-800 scale-110 bg-gray-100'
                          : 'hover:scale-105 hover:bg-gray-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {spaceColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewSpaceColor(color)}
                      className={`w-12 h-12 rounded-lg transition-all ${
                        newSpaceColor === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {!editingSpace && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espacio padre (opcional)
                  </label>
                  <select
                    value={newSpaceParent || ''}
                    onChange={(e) => setNewSpaceParent(e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Espacio raíz</option>
                    {spaces.map(space => (
                      <option key={space.id} value={space.id}>
                        {space.icon} {space.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipo asignado (opcional)
                </label>
                <select
                  value={newSpaceTeam || ''}
                  onChange={(e) => setNewSpaceTeam(e.target.value || undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin equipo</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.icon} {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingSpace(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingSpace ? handleUpdateSpace : handleCreateSpace}
                  disabled={!newSpaceName.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: theme.gradient }}
                >
                  <Check size={16} />
                  {editingSpace ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Space Detail Modal - Show tasks */}
      {selectedSpaceDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${selectedSpaceDetail.color}20` }}
                >
                  {selectedSpaceDetail.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedSpaceDetail.name}</h2>
                  <p className="text-sm text-gray-500">Tareas del espacio</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpaceDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {getSpaceTasks(selectedSpaceDetail.id).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay tareas en este espacio</p>
                </div>
              ) : (
                getSpaceTasks(selectedSpaceDetail.id).map(task => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <button
                      onClick={() => verifyTask(task.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.verified
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.verified && <Check size={12} />}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.verified ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          task.status === 'done' ? 'bg-green-100 text-green-700' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status === 'done' ? 'Completada' :
                           task.status === 'in-progress' ? 'En progreso' :
                           'Pendiente'}
                        </span>
                        {task.fileLinks && task.fileLinks.length > 0 && (
                          <span className="flex items-center gap-1">
                            📎 {task.fileLinks.length} archivos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
