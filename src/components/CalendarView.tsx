import { useState } from 'react';
import { useApp } from '../store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
  const { tasks } = useApp();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const priorityDot: Record<string, string> = {
    urgent: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-gray-400',
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-28"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDay(day);
    const isToday =
      day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    days.push(
      <div
        key={day}
        className={`h-24 sm:h-28 border border-gray-100 rounded-lg p-1.5 hover:bg-gray-50 transition-colors ${
          isToday ? 'bg-teal-50 border-teal-200' : 'bg-white'
        }`}
      >
        <span className={`text-xs font-medium ${isToday ? 'text-teal-600' : 'text-gray-500'}`}>
          {day}
        </span>
        <div className="mt-1 space-y-0.5 overflow-hidden">
          {dayTasks.slice(0, 2).map(task => (
            <div
              key={task.id}
              className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate bg-gray-100"
              title={task.title}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`}></span>
              <span className="truncate text-gray-700">{task.title}</span>
            </div>
          ))}
          {dayTasks.length > 2 && (
            <span className="text-[10px] text-gray-400 px-1">+{dayTasks.length - 2} más</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            aria-label="Mes anterior"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            aria-label="Mes siguiente"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(name => (
          <div key={name} className="text-center text-xs font-semibold text-gray-400 py-2">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 flex-wrap">
        <span className="text-xs text-gray-400">Prioridad:</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-xs text-gray-500">Urgente</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span className="text-xs text-gray-500">Alta</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span className="text-xs text-gray-500">Media</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          <span className="text-xs text-gray-500">Baja</span>
        </div>
      </div>
    </div>
  );
}
