export interface Task {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface TodoList {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface AppData {
  lists: TodoList[];
}
