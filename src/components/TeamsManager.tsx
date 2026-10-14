import { useState, ReactNode, FormEvent } from 'react';
import { useApp } from '../store';
import { useAuth } from '../auth';
import { Team, TeamMember, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  Plus,
  Users,
  Crown,
  Shield,
  User,
  Eye,
  MoreHorizontal,
  X,
  UserPlus,
  Trash2,
  Edit3,
  Search,
} from 'lucide-react';

interface CreateTeamData {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface TeamDetailModalProps {
  team: Team;
  onClose: () => void;
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onChangeRole: (id: string, role: UserRole) => void;
  onDelete: () => void;
}

interface AddMemberModalProps {
  team: Team;
  onClose: () => void;
  onAdd: (email: string, role: UserRole) => void;
}

const teamIcons = ['💼', '🚀', '🎯', '💡', '🔥', '⭐', '🎨', '💻', '📊', '🌟'];
const teamColors = ['#0D9488', '#F97316', '#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

const roleConfig: Record<UserRole, { label: string; icon: ReactNode; color: string }> = {
  owner: { label: 'Propietario', icon: <Crown size={14} />, color: 'text-yellow-600 bg-yellow-50' },
  admin: { label: 'Admin', icon: <Shield size={14} />, color: 'text-teal-600 bg-teal-50' },
  member: { label: 'Miembro', icon: <User size={14} />, color: 'text-gray-600 bg-gray-100' },
  guest: { label: 'Invitado', icon: <Eye size={14} />, color: 'text-purple-600 bg-purple-50' },
};

export default function TeamsManager() {
  const { teams, addTeam, updateTeam, deleteTeam } = useApp();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = (data: CreateTeamData) => {
    if (!user) return;
    const newTeam: Team = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      ownerId: user.id,
      members: [{
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: 'owner',
        joinedAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
    };
    addTeam(newTeam);
    setShowCreateModal(false);
  };

  const handleAddMember = (email: string, role: UserRole) => {
    if (!selectedTeam || !email) return;
    const newMember: TeamMember = {
      userId: uuidv4(),
      name: email.split('@')[0],
      email,
      avatar: email.substring(0, 2).toUpperCase(),
      role,
      joinedAt: new Date().toISOString(),
    };
    updateTeam(selectedTeam.id, {
      members: [...selectedTeam.members, newMember],
    });
    setSelectedTeam({ ...selectedTeam, members: [...selectedTeam.members, newMember] });
    setShowMemberModal(false);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return;
    const updated = selectedTeam.members.filter(m => m.userId !== memberId);
    updateTeam(selectedTeam.id, { members: updated });
    setSelectedTeam({ ...selectedTeam, members: updated });
  };

  const handleChangeRole = (memberId: string, newRole: UserRole) => {
    if (!selectedTeam) return;
    const updated = selectedTeam.members.map(m =>
      m.userId === memberId ? { ...m, role: newRole } : m
    );
    updateTeam(selectedTeam.id, { members: updated });
    setSelectedTeam({ ...selectedTeam, members: updated });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Equipos</h2>
          <p className="text-sm text-gray-500">Gestiona tus equipos y colaboradores</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={16} />
          Crear Equipo
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 mb-6 max-w-md">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar equipos..."
          className="ml-2 bg-transparent text-sm outline-none w-full placeholder-gray-400"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map(team => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${team.color}20` }}
              >
                {team.icon}
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {team.members.length} miembros
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{team.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{team.description}</p>
            
            {/* Member avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {team.members.slice(0, 4).map((member, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white"
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
                {team.members.length > 4 && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-bold border-2 border-white">
                    +{team.members.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No se encontraron equipos</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-teal-600 text-sm font-medium hover:underline"
          >
            Crear tu primer equipo
          </button>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTeam}
        />
      )}

      {/* Team Detail Modal */}
      {selectedTeam && (
        <TeamDetailModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onAddMember={() => setShowMemberModal(true)}
          onRemoveMember={handleRemoveMember}
          onChangeRole={handleChangeRole}
          onDelete={() => {
            deleteTeam(selectedTeam.id);
            setSelectedTeam(null);
          }}
        />
      )}

      {/* Add Member Modal */}
      {showMemberModal && selectedTeam && (
        <AddMemberModal
          team={selectedTeam}
          onClose={() => setShowMemberModal(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
}

// ========== Create Team Modal ==========
function CreateTeamModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: CreateTeamData) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(teamIcons[0]);
  const [color, setColor] = useState(teamColors[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, description, icon, color });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Crear Equipo</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del equipo *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Equipo de Marketing"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="¿En qué trabaja este equipo?"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
            <div className="flex flex-wrap gap-2">
              {teamIcons.map(i => (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {teamColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow-sm"
            >
              Crear Equipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========== Team Detail Modal ==========
function TeamDetailModal({ team, onClose, onAddMember, onRemoveMember, onChangeRole, onDelete }: TeamDetailModalProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${team.color}20` }}
            >
              {team.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{team.name}</h2>
              <p className="text-xs text-gray-500">{team.members.length} miembros</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddMember}
              className="flex items-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Invitar</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-40">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    <Edit3 size={14} /> Editar
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {team.description && (
            <p className="text-sm text-gray-600 mb-4">{team.description}</p>
          )}

          <h3 className="text-sm font-semibold text-gray-700 mb-3">Miembros del equipo</h3>
          <div className="space-y-2">
            {team.members.map(member => (
              <div
                key={member.userId}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                  <p className="text-xs text-gray-400 truncate">{member.email}</p>
                </div>
                <select
                  value={member.role}
                  onChange={e => onChangeRole(member.userId, e.target.value as UserRole)}
                  disabled={member.role === 'owner'}
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${roleConfig[member.role].color} ${
                    member.role === 'owner' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <option value="owner">Propietario</option>
                  <option value="admin">Admin</option>
                  <option value="member">Miembro</option>
                  <option value="guest">Invitado</option>
                </select>
                {member.role !== 'owner' && (
                  <button
                    onClick={() => onRemoveMember(member.userId)}
                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Add Member Modal ==========
function AddMemberModal({ team, onClose, onAdd }: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onAdd(email, role);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Invitar miembro</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
            >
              <option value="admin">Admin - Puede gestionar el equipo</option>
              <option value="member">Miembro - Puede ver y editar</option>
              <option value="guest">Invitado - Solo puede ver</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-lg shadow-sm"
            >
              Enviar invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
