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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

export async function fetchTodos(): Promise<TodoItem[]> {
  const response = await fetch(API_BASE)
  return handleResponse<TodoItem[]>(response)
}

export async function createTodo(text: string): Promise<TodoItem> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  })
  return handleResponse<TodoItem>(response)
}

export async function updateTodo(id: number, text: string): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  })
  return handleResponse<TodoItem>(response)
}

export async function toggleTodo(id: number): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/${id}/toggle`, {
    method: 'PATCH',
  })
  return handleResponse<TodoItem>(response)
}

export async function deleteTodo(id: number): Promise<undefined> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  await handleResponse<{ success: boolean }>(response)
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
