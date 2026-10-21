import { useState } from 'react';
import { useApp } from '../store';
import { useTheme } from '../theme';
import { WorkHistoryEntry } from '../types';
import { Download, Filter, Calendar, Users, Folder, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WorkHistoryExport() {
  const { workHistory, spaces } = useApp();
  const { theme } = useTheme();
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Obtener asignados únicos
  const assignees = Array.from(new Set(workHistory.map(entry => entry.assignee)));

  // Filtrar historial
  const filteredHistory = workHistory.filter(entry => {
    if (selectedSpace !== 'all' && entry.spaceId !== selectedSpace) return false;
    if (selectedAssignee !== 'all' && entry.assignee !== selectedAssignee) return false;
    if (dateFrom && new Date(entry.completedAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(entry.completedAt) > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  });

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredHistory.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = ['Miembro', 'Espacio', 'Trabajo', 'Fecha', 'Hora', 'Etiquetas'];
    const rows = filteredHistory.map(entry => [
      entry.assignee,
      entry.spaceName,
      entry.taskTitle,
      format(new Date(entry.completedAt), 'dd/MM/yyyy', { locale: es }),
      format(new Date(entry.completedAt), 'HH:mm', { locale: es }),
      entry.tags.join(', '),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historial_trabajos_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedSpace('all');
    setSelectedAssignee('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Historial de Trabajos</h1>
        <p className="text-gray-600">Exporta el historial de trabajos completados por los equipos</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} style={{ color: theme.primary }} />
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por espacio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Folder size={14} className="inline mr-1" />
              Espacio
            </label>
            <select
              value={selectedSpace}
              onChange={(e) => setSelectedSpace(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
            >
              <option value="all">Todos los espacios</option>
              {spaces.map(space => (
                <option key={space.id} value={space.id}>
                  {space.icon} {space.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por asignado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={14} className="inline mr-1" />
              Miembro
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
            >
              <option value="all">Todos los miembros</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={14} className="inline mr-1" />
              Fecha desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
            />
          </div>

          {/* Filtro por fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={14} className="inline mr-1" />
              Fecha hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': theme.primaryLight } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
            Limpiar filtros
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: theme.gradient }}
          >
            <Download size={16} />
            Exportar CSV ({filteredHistory.length} registros)
          </button>
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miembro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espacio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trabajo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiquetas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay registros en el historial. Completa algunas tareas para ver el historial aquí.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ background: theme.gradient }}
                        >
                          {entry.assignee.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{entry.assignee}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.spaceName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{entry.taskTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(entry.completedAt), 'dd/MM/yyyy', { locale: es })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(entry.completedAt), 'HH:mm', { locale: es })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
