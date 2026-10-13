export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';

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
}

export interface Space {
  id: string;
  name: string;
  icon: string;
  color: string;
  taskCount: number;
}

export type ViewMode = 'dashboard' | 'list' | 'board' | 'calendar';
