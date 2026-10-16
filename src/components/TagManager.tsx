import { useState } from 'react';
import { useApp } from '../store';
import { useTheme } from '../theme';
import { Tag } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, X, Check, Palette, CheckCircle2 } from 'lucide-react';

const presetColors = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
  '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
  '#6B7280',
];

export default function TagManager() {
  const { tags, tasks, spaces, addTag, updateTag, deleteTag } = useApp();
  const { theme } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [selectedTagDetail, setSelectedTagDetail] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(presetColors[0]);

  const getTagTasks = (tagName: string) => {
    return tasks.filter(t => t.tags.includes(tagName));
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag: Tag = {
      id: uuidv4(),
      name: newTagName.trim().toLowerCase(),
      color: newTagColor,
      createdAt: new Date().toISOString(),
    };
    
    addTag(newTag);
    setNewTagName('');
    setNewTagColor(presetColors[0]);
    setShowCreateModal(false);
  };

  const handleUpdateTag = () => {
    if (!editingTag) return;
    updateTag(editingTag.id, { color: newTagColor });
    setEditingTag(null);
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta etiqueta?')) {
      deleteTag(id);
    }
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagColor(tag.color);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Etiquetas</h1>
        <p className="text-gray-600">Crea, edita y organiza las etiquetas para clasificar tus tareas</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
          style={{ background: theme.gradient }}
        >
          <Plus size={18} />
          Nueva Etiqueta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map(tag => (
          <div
            key={tag.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: tag.color }}
                >
                  #
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 capitalize">{tag.name}</h3>
                  <p className="text-xs text-gray-500">
                    Creada: {new Date(tag.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedTagDetail(tag)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Ver tareas"
                >
                  <CheckCircle2 size={16} />
                </button>
                <button
                  onClick={() => openEditModal(tag)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar color"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-xs text-gray-500 font-mono">{tag.color}</span>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12">
          <Palette size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No hay etiquetas creadas aún</p>
          <p className="text-sm text-gray-400 mt-2">Crea tu primera etiqueta para comenzar</p>
        </div>
      )}

      {/* Create Tag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Crear Nueva Etiqueta</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la etiqueta
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Ej: urgente, diseño, backend..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: newTagColor }}
                  >
                    #
                  </div>
                  <span className="text-sm text-gray-600 capitalize">
                    {newTagName || 'nombre-etiqueta'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: theme.gradient }}
                  >
                    <Check size={16} />
                    Crear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Editar Color de Etiqueta</h2>
              <button
                onClick={() => setEditingTag(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: newTagColor }}
                >
                  #
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">{editingTag.name}</h3>
                  <p className="text-xs text-gray-500">Cambiando color de la etiqueta</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingTag(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateTag}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all"
                  style={{ background: theme.gradient }}
                >
                  <Check size={16} />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Tasks Modal */}
      {selectedTagDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: selectedTagDetail.color }}
                >
                  #
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 capitalize">{selectedTagDetail.name}</h2>
                  <p className="text-sm text-gray-500">Tareas con esta etiqueta</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTagDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {getTagTasks(selectedTagDetail.name).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay tareas con esta etiqueta</p>
                </div>
              ) : (
                getTagTasks(selectedTagDetail.name).map(task => {
                  const taskSpace = spaces.find(s => s.id === task.spaceId);
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: selectedTagDetail.color }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded ${
                            task.status === 'done' ? 'bg-green-100 text-green-700' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            task.status === 'review' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status === 'done' ? 'Completada' :
                             task.status === 'in-progress' ? 'En progreso' :
                             task.status === 'review' ? 'En revisión' :
                             'Pendiente'}
                          </span>
                          <span>👤 {task.assignee}</span>
                          {taskSpace && (
                            <span className="flex items-center gap-1">
                              {taskSpace.icon} {taskSpace.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
