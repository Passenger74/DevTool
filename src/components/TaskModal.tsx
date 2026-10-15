import { useState, useEffect, FormEvent } from 'react';
import { useApp } from '../store';
import { Task, Priority, Status, FileLink } from '../types';
import { X, Save, Trash2, Check, Paperclip, Plus, ExternalLink, Tag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, onDelete, task }: TaskModalProps) {
  const { tags, verifyTask, addFileLink, removeFileLink } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [fileLinks, setFileLinks] = useState<FileLink[]>([]);
  
  // File link form
  const [showFileLinkForm, setShowFileLinkForm] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssignee(task.assignee);
      setDueDate(task.dueDate);
      setSelectedTags(task.tags || []);
      setIsVerified(task.verified || false);
      setFileLinks(task.fileLinks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setAssignee('');
      setDueDate('');
      setSelectedTags([]);
      setIsVerified(false);
      setFileLinks([]);
    }
    setShowFileLinkForm(false);
    setNewLinkName('');
    setNewLinkUrl('');
  }, [task, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: task?.id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee || 'Sin asignar',
      dueDate,
      tags: selectedTags,
      createdAt: task?.createdAt || new Date().toISOString().split('T')[0],
      verified: isVerified,
      fileLinks,
    };
    onSave(newTask);
    onClose();
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#6B7280';
  };

  const handleAddFileLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;
    
    const newLink: FileLink = {
      id: uuidv4(),
      name: newLinkName.trim(),
      url: newLinkUrl.trim(),
    };
    
    setFileLinks(prev => [...prev, newLink]);
    setNewLinkName('');
    setNewLinkUrl('');
    setShowFileLinkForm(false);
  };

  const handleRemoveFileLink = (linkId: string) => {
    setFileLinks(prev => prev.filter(l => l.id !== linkId));
  };

  const handleVerifyToggle = () => {
    setIsVerified(!isVerified);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">
              {task ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
            {task && (
              <button
                onClick={handleVerifyToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isVerified
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Check size={14} />
                {isVerified ? 'Verificado' : 'Verificar'}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nombre de la tarea"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe la tarea..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              >
                <option value="todo">Por hacer</option>
                <option value="in-progress">En progreso</option>
                <option value="review">En revisión</option>
                <option value="done">Completada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              >
                <option value="urgent">🔴 Urgente</option>
                <option value="high">🟠 Alta</option>
                <option value="medium">🟡 Media</option>
                <option value="low">🟢 Baja</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              >
                <option value="">Seleccionar...</option>
                <option value="María García">María García</option>
                <option value="Carlos López">Carlos López</option>
                <option value="Ana Martínez">Ana Martínez</option>
                <option value="Pedro Sánchez">Pedro Sánchez</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              />
            </div>
          </div>

          {/* Tags with colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={14} />
              Etiquetas
            </label>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                        isSelected
                          ? 'text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      style={isSelected 
                        ? { backgroundColor: tag.color, borderColor: tag.color }
                        : { borderColor: tag.color + '40' }
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 p-3 border border-gray-200 rounded-lg bg-gray-50">
                No hay etiquetas disponibles. Crea etiquetas en la sección "Etiquetas".
              </p>
            )}
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Seleccionadas:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map(tagName => (
                    <span
                      key={tagName}
                      className="text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getTagColor(tagName) }}
                    >
                      {tagName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* File Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Paperclip size={14} />
              Enlaces a archivos
            </label>
            
            {/* Existing file links */}
            {fileLinks.length > 0 && (
              <div className="space-y-2 mb-3">
                {fileLinks.map(link => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Paperclip size={14} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{link.name}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveFileLink(link.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add file link form */}
            {showFileLinkForm ? (
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                <input
                  type="text"
                  value={newLinkName}
                  onChange={e => setNewLinkName(e.target.value)}
                  placeholder="Nombre del archivo"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com/archivo"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddFileLink}
                    disabled={!newLinkName.trim() || !newLinkUrl.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 text-white text-xs font-medium rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check size={12} />
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFileLinkForm(false);
                      setNewLinkName('');
                      setNewLinkUrl('');
                    }}
                    className="px-3 py-1.5 text-gray-600 text-xs hover:bg-gray-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowFileLinkForm(true)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors w-full"
              >
                <Plus size={14} />
                Agregar enlace a archivo
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {task && onDelete ? (
              <button
                type="button"
                onClick={() => { onDelete(task.id); onClose(); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            ) : <div />}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
              >
                <Save size={16} />
                {task ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
