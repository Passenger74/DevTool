import { useState } from 'react';
import { useApp } from '../store';
import { useAuth } from '../auth';
import { Board, BoardColumn, Team } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  Plus,
  LayoutGrid,
  Archive,
  Trash2,
  Edit3,
  X,
  Users,
  Eye,
  EyeOff,
  MoreHorizontal,
  Settings,
  Palette,
} from 'lucide-react';

const boardIcons = ['🚀', '📋', '🎯', '💡', '🔥', '⭐', '📊', '💼', '🛠️', '📝', '🎨', '💻'];
const columnColors = ['#9CA3AF', '#14B8A6', '#F97316', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

export default function BoardsManager() {
  const { boards, teams, tasks, addBoard, updateBoard, deleteBoard, addBoardColumn, updateBoardColumn, deleteBoardColumn, selectedBoard, setSelectedBoard } = useApp();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active');

  const filteredBoards = boards.filter(b => {
    if (filter === 'archived') return b.isArchived;
    if (filter === 'active') return !b.isArchived;
    return true;
  });

  const currentBoard = boards.find(b => b.id === selectedBoard);

  const handleCreateBoard = (data: { name: string; description: string; icon: string; teamId: string | null; isPublic: boolean }) => {
    if (!user) return;
    const newBoard: Board = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      teamId: data.teamId,
      ownerId: user.id,
      columns: [
        { id: uuidv4(), name: 'Por hacer', color: '#9CA3AF', order: 0 },
        { id: uuidv4(), name: 'En progreso', color: '#14B8A6', order: 1 },
        { id: uuidv4(), name: 'Completado', color: '#10B981', order: 2 },
      ],
      isArchived: false,
      isPublic: data.isPublic,
      sharedWith: data.teamId ? [data.teamId] : [],
      createdAt: new Date().toISOString(),
    };
    addBoard(newBoard);
    setShowCreateModal(false);
  };

  const handleAddColumn = (name: string, color: string) => {
    if (!currentBoard) return;
    const newColumn: BoardColumn = {
      id: uuidv4(),
      name,
      color,
      order: currentBoard.columns.length,
    };
    addBoardColumn(currentBoard.id, newColumn);
    setShowColumnModal(false);
  };

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return 'Personal';
    return teams.find(t => t.id === teamId)?.name || 'Sin equipo';
  };

  const getBoardTaskCount = (boardId: string) => tasks.filter(t => t.boardId === boardId).length;

  // Vista detalle del tablero
  if (currentBoard) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedBoard(null)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentBoard.icon}</span>
                <h2 className="text-xl font-bold text-gray-800">{currentBoard.name}</h2>
                {currentBoard.isPublic ? (
                  <Eye size={14} className="text-teal-500" />
                ) : (
                  <EyeOff size={14} className="text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-500">{currentBoard.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowColumnModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Columna</span>
            </button>
            <button
              onClick={() => setEditingBoard(currentBoard)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Settings size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={14} />
            <span>{getTeamName(currentBoard.teamId)}</span>
          </div>
          <div className="text-sm text-gray-400">•</div>
          <div className="text-sm text-gray-600">
            {currentBoard.columns.length} columnas
          </div>
          <div className="text-sm text-gray-400">•</div>
          <div className="text-sm text-gray-600">
            {getBoardTaskCount(currentBoard.id)} tareas
          </div>
          {currentBoard.sharedWith.length > 0 && (
            <>
              <div className="text-sm text-gray-400">•</div>
              <div className="flex items-center gap-1">
                {currentBoard.sharedWith.slice(0, 3).map(teamId => {
                  const team = teams.find(t => t.id === teamId);
                  return team ? (
                    <span key={teamId} className="text-sm">{team.icon}</span>
                  ) : null;
                })}
              </div>
            </>
          )}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentBoard.columns.sort((a, b) => a.order - b.order).map(column => (
            <div
              key={column.id}
              className="bg-gray-50 rounded-xl p-3 min-h-[300px]"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }}></span>
                  <h3 className="text-sm font-semibold text-gray-700">{column.name}</h3>
                </div>
                <div className="relative group">
                  <button className="p-1 rounded hover:bg-gray-200">
                    <MoreHorizontal size={14} className="text-gray-400" />
                  </button>
                  <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-32 hidden group-hover:block">
                    <button
                      onClick={() => {
                        const newName = prompt('Nuevo nombre:', column.name);
                        if (newName) updateBoardColumn(currentBoard.id, column.id, { name: newName });
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <Edit3 size={12} /> Renombrar
                    </button>
                    <button
                      onClick={() => {
                        const newColor = prompt('Color (hex):', column.color);
                        if (newColor) updateBoardColumn(currentBoard.id, column.id, { color: newColor });
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <Palette size={12} /> Color
                    </button>
                    <button
                      onClick={() => deleteBoardColumn(currentBoard.id, column.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center py-8">
                Arrastra tareas aquí
              </p>
            </div>
          ))}

          {/* Add column card */}
          <button
            onClick={() => setShowColumnModal(true)}
            className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 min-h-[100px] border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">Agregar columna</span>
          </button>
        </div>

        {/* Column Modal */}
        {showColumnModal && (
          <ColumnModal
            onClose={() => setShowColumnModal(false)}
            onAdd={handleAddColumn}
          />
        )}

        {/* Edit Board Modal */}
        {editingBoard && (
          <EditBoardModal
            board={editingBoard}
            teams={teams}
            onClose={() => setEditingBoard(null)}
            onSave={(updates) => {
              updateBoard(editingBoard.id, updates);
              setEditingBoard(null);
            }}
            onArchive={() => {
              updateBoard(editingBoard.id, { isArchived: !editingBoard.isArchived });
              setEditingBoard(null);
            }}
            onDelete={() => {
              deleteBoard(editingBoard.id);
              setEditingBoard(null);
              setSelectedBoard(null);
            }}
          />
        )}
      </div>
    );
  }

  // Vista lista de tableros
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Tableros</h2>
          <p className="text-sm text-gray-500">Organiza tus proyectos en tableros personalizados</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={16} />
          Crear Tablero
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['active', 'archived', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-teal-100 text-teal-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'active' ? 'Activos' : f === 'archived' ? 'Archivados' : 'Todos'}
          </button>
        ))}
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBoards.map(board => (
          <div
            key={board.id}
            onClick={() => setSelectedBoard(board.id)}
            className={`bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer ${
              board.isArchived ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{board.icon}</span>
                {board.isArchived && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Archive size={10} /> Archivado
                  </span>
                )}
              </div>
              {board.isPublic ? (
                <Eye size={16} className="text-teal-500" />
              ) : (
                <EyeOff size={16} className="text-gray-300" />
              )}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{board.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{board.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {getTeamName(board.teamId)}
              </span>
              <span>{board.columns.length} cols · {getBoardTaskCount(board.id)} tareas</span>
            </div>
          </div>
        ))}
      </div>

      {filteredBoards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <LayoutGrid size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay tableros {filter === 'archived' ? 'archivados' : 'activos'}</p>
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateModal && (
        <CreateBoardModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </div>
  );
}

// ========== Create Board Modal ==========
function CreateBoardModal({ teams, onClose, onCreate }: {
  teams: Team[];
  onClose: () => void;
  onCreate: (data: { name: string; description: string; icon: string; teamId: string | null; isPublic: boolean }) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(boardIcons[0]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, description, icon, teamId, isPublic });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Crear Tablero</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Sprint Actual"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="¿Cuál es el propósito de este tablero?"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
            <div className="flex flex-wrap gap-2">
              {boardIcons.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === i ? 'bg-teal-100 ring-2 ring-teal-500' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
            <select
              value={teamId || ''}
              onChange={e => setTeamId(e.target.value || null)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            >
              <option value="">Personal (sin equipo)</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Tablero público</p>
              <p className="text-xs text-gray-500">Visible para todos los miembros</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isPublic ? 'bg-teal-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-5' : ''}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow-sm">
              Crear Tablero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========== Column Modal ==========
function ColumnModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(columnColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, color);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Nueva Columna</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: En revisión"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {columnColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow-sm">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========== Edit Board Modal ==========
function EditBoardModal({ board, teams, onClose, onSave, onArchive, onDelete }: {
  board: Board;
  teams: Team[];
  onClose: () => void;
  onSave: (updates: Partial<Board>) => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description);
  const [icon, setIcon] = useState(board.icon);
  const [teamId, setTeamId] = useState(board.teamId);
  const [isPublic, setIsPublic] = useState(board.isPublic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, icon, teamId, isPublic });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Editar Tablero</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
            <div className="flex flex-wrap gap-2">
              {boardIcons.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === i ? 'bg-teal-100 ring-2 ring-teal-500' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
            <select
              value={teamId || ''}
              onChange={e => setTeamId(e.target.value || null)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            >
              <option value="">Personal</option>
              {teams.map((t: Team) => (
                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Público</p>
              <p className="text-xs text-gray-500">Visible para todos</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isPublic ? 'bg-teal-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-5' : ''}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onArchive}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Archive size={14} />
              {board.isArchived ? 'Restaurar' : 'Archivar'}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
              <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow-sm">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
