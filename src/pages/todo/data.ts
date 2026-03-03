import ky from 'ky'

export enum Intent {
  Create = 'create',
  Delete = 'delete',
  Toggle = 'toggle',
  Update = 'update',
}

export type TodoItem = {
  id: number
  text: string
  completed: boolean
}

export function countRemaining(todos: TodoItem[]): number {
  return todos.filter((t) => !t.completed).length
}

const API_BASE = '/api/todos'

const api = ky.create({ prefixUrl: API_BASE })

export async function fetchTodos(): Promise<TodoItem[]> {
  return api.get('').json<TodoItem[]>()
}

export async function createTodo(text: string): Promise<TodoItem> {
  return api.post('', { json: { text: text.trim() } }).json<TodoItem>()
}

export async function updateTodo(id: number, text: string): Promise<TodoItem> {
  return api.put(`${id}`, { json: { text: text.trim() } }).json<TodoItem>()
}

export async function toggleTodo(id: number): Promise<TodoItem> {
  return api.patch(`${id}/toggle`).json<TodoItem>()
}

export async function deleteTodo(id: number): Promise<undefined> {
  await api.delete(`${id}`).json<{ success: boolean }>()
  return undefined
}

export async function loader(): Promise<TodoItem[]> {
  return fetchTodos()
}

export async function action({
  request,
}: {
  request: Request
}): Promise<TodoItem | undefined> {
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case Intent.Create: {
      const text = formData.get('text')
      if (typeof text !== 'string') return
      const trimmed = text.trim()
      if (!trimmed) return
      return createTodo(trimmed)
    }
    case Intent.Delete: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return
      return deleteTodo(id)
    }
    case Intent.Toggle: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return
      return toggleTodo(id)
    }
    case Intent.Update: {
      const id = Number(formData.get('id'))
      const text = formData.get('text')
      if (Number.isNaN(id) || typeof text !== 'string') return
      const trimmed = text.trim()
      if (!trimmed) return
      return updateTodo(id, trimmed)
    }
    default:
      return
  }
}
