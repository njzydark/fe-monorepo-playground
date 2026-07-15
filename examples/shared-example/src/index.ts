export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TodoListResponse {
  todos: Todo[]
}

export interface TodoResponse {
  todo: Todo
}

export interface DeleteTodoResponse {
  ok: true
  todo: Todo
}

export interface TodoErrorResponse {
  error: string
}

export type TodoFilter = 'all' | 'active' | 'completed'

export const todoFilters: Array<{ label: string; value: TodoFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]
