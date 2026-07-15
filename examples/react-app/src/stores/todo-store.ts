import { create } from 'zustand'
import {
  type DeleteTodoResponse,
  type Todo,
  type TodoErrorResponse,
  type TodoFilter,
  type TodoListResponse,
  type TodoResponse,
} from 'example-shared'

const API_BASE_URL_STORAGE_KEY = 'example-react-app:todo-api-base-url'

interface TodoStore {
  actionError: string | undefined
  apiBaseUrl: string
  error: string | undefined
  filter: TodoFilter
  isCreating: boolean
  isLoading: boolean
  pendingTodoId: number | undefined
  todos: Todo[]
  clearActionError: () => void
  createTodo: (title: string) => Promise<Todo | undefined>
  deleteTodo: (todo: Todo) => Promise<void>
  loadTodos: () => Promise<void>
  setApiBaseUrl: (apiBaseUrl: string) => void
  setFilter: (filter: TodoFilter) => void
  toggleTodo: (todo: Todo, completed: boolean) => Promise<void>
  updateTodo: (todo: Todo, title: string) => Promise<Todo | undefined>
}

const getInitialApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(API_BASE_URL_STORAGE_KEY) ?? ''
}

const normalizeApiBaseUrl = (apiBaseUrl: string): string => {
  return apiBaseUrl.trim().replace(/\/+$/, '')
}

const getApiUrl = (apiBaseUrl: string, path: string): string => {
  return `${apiBaseUrl}${path}`
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error ? error.message : fallback
}

const requestJson = async <T>(apiBaseUrl: string, path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(getApiUrl(apiBaseUrl, path), {
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as TodoErrorResponse | null
    throw new Error(error?.error ?? `Request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  actionError: undefined,
  apiBaseUrl: getInitialApiBaseUrl(),
  error: undefined,
  filter: 'all',
  isCreating: false,
  isLoading: true,
  pendingTodoId: undefined,
  todos: [],

  clearActionError: () => {
    set({ actionError: undefined })
  },

  createTodo: async (title) => {
    const nextTitle = title.trim()

    if (!nextTitle) {
      return undefined
    }

    set({ actionError: undefined, isCreating: true })

    try {
      const data = await requestJson<TodoResponse>(get().apiBaseUrl, '/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title: nextTitle }),
      })

      set((state) => ({
        todos: [data.todo, ...state.todos],
      }))

      return data.todo
    } catch (error) {
      set({ actionError: getErrorMessage(error, 'Failed to create todo.') })
      return undefined
    } finally {
      set({ isCreating: false })
    }
  },

  deleteTodo: async (todo) => {
    set({ actionError: undefined, pendingTodoId: todo.id })

    try {
      await requestJson<DeleteTodoResponse>(get().apiBaseUrl, `/api/todos/${todo.id}`, {
        method: 'DELETE',
      })

      set((state) => ({
        todos: state.todos.filter((currentTodo) => currentTodo.id !== todo.id),
      }))
    } catch (error) {
      set({ actionError: getErrorMessage(error, 'Failed to delete todo.') })
    } finally {
      set({ pendingTodoId: undefined })
    }
  },

  loadTodos: async () => {
    set({ error: undefined, isLoading: true })

    try {
      const data = await requestJson<TodoListResponse>(get().apiBaseUrl, '/api/todos')
      set({ todos: data.todos })
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load todos.') })
    } finally {
      set({ isLoading: false })
    }
  },

  setApiBaseUrl: (apiBaseUrl) => {
    const normalizedApiBaseUrl = normalizeApiBaseUrl(apiBaseUrl)

    if (typeof window !== 'undefined') {
      if (normalizedApiBaseUrl) {
        window.localStorage.setItem(API_BASE_URL_STORAGE_KEY, normalizedApiBaseUrl)
      } else {
        window.localStorage.removeItem(API_BASE_URL_STORAGE_KEY)
      }
    }

    set({ apiBaseUrl: normalizedApiBaseUrl })
  },

  setFilter: (filter) => {
    set({ filter })
  },

  toggleTodo: async (todo, completed) => {
    set({ actionError: undefined, pendingTodoId: todo.id })

    try {
      const data = await requestJson<TodoResponse>(get().apiBaseUrl, `/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      })

      set((state) => ({
        todos: state.todos.map((currentTodo) => (currentTodo.id === todo.id ? data.todo : currentTodo)),
      }))
    } catch (error) {
      set({ actionError: getErrorMessage(error, 'Failed to update todo.') })
    } finally {
      set({ pendingTodoId: undefined })
    }
  },

  updateTodo: async (todo, title) => {
    const nextTitle = title.trim()

    if (!nextTitle) {
      return undefined
    }

    set({ actionError: undefined, pendingTodoId: todo.id })

    try {
      const data = await requestJson<TodoResponse>(get().apiBaseUrl, `/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: nextTitle }),
      })

      set((state) => ({
        todos: state.todos.map((currentTodo) => (currentTodo.id === todo.id ? data.todo : currentTodo)),
      }))

      return data.todo
    } catch (error) {
      set({ actionError: getErrorMessage(error, 'Failed to update todo.') })
      return undefined
    } finally {
      set({ pendingTodoId: undefined })
    }
  },
}))
