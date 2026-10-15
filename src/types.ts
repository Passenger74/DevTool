export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';
export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  boardId?: string;
  teamId?: string;
  syncedToCalendar?: boolean;
  calendarEventId?: string;
  verified?: boolean;
  fileLinks?: FileLink[];
}

export interface FileLink {
  id: string;
  name: string;
  url: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Space {
  id: string;
  name: string;
  icon: string;
  color: string;
  taskCount: number;
  parentId?: string | null;
  teamId?: string;
}

export type ViewMode = 'dashboard' | 'list' | 'board' | 'calendar' | 'teams' | 'boards' | 'settings' | 'tags' | 'spaces';

// ========== NUEVOS TIPOS ==========

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  provider: 'google' | 'email' | 'credentials';
  googleId?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type ThemeName = 'classic' | 'ocean' | 'forest' | 'sunset' | 'mono' | 'lavender';

export interface Theme {
  name: ThemeName;
  label: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  gradient: string;
  emoji: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinedAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  teamId: string | null;
  ownerId: string;
  columns: BoardColumn[];
  isArchived: boolean;
  isPublic: boolean;
  sharedWith: string[]; // team ids
  createdAt: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  color: string;
  order: number;
  limit?: number; // WIP limit
}

export interface GoogleCalendarEvent {
  id: string;
  taskId: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  synced: boolean;
}

export interface GoogleCalendarConnection {
  connected: boolean;
  email?: string;
  calendarId?: string;
  lastSync?: string;
  events: GoogleCalendarEvent[];
}
