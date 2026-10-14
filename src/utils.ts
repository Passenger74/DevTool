import { Priority } from './types';

export const priorityLabels: Record<Priority, string> = {
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

// Parse "YYYY-MM-DD" as a local date; `new Date('YYYY-MM-DD')` is UTC and shifts a day back in negative-offset timezones.
export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatShortDate(value: string): string {
  return parseLocalDate(value).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
