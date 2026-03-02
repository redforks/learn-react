export const STORAGE_KEY = 'todos'

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

function loadFromStorage(): TodoItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(todos: TodoItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function loader(): TodoItem[] {
  return loadFromStorage()
}

export async function action({
  request,
}: {
  request: Request
}): Promise<TodoItem[]> {
  const formData = await request.formData()
  const intent = formData.get('intent')
  const currentTodos = loadFromStorage()

  switch (intent) {
    case Intent.Create: {
      const text = formData.get('text')
      if (typeof text !== 'string') return currentTodos
      const trimmed = text.trim()
      if (!trimmed) return currentTodos
      const newTodos = [
        ...currentTodos,
        { id: Date.now(), text: trimmed, completed: false },
      ]
      saveToStorage(newTodos)
      return newTodos
    }
    case Intent.Delete: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return currentTodos
      const newTodos = currentTodos.filter((t) => t.id !== id)
      saveToStorage(newTodos)
      return newTodos
    }
    case Intent.Toggle: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return currentTodos
      const newTodos = currentTodos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      )
      saveToStorage(newTodos)
      return newTodos
    }
    case Intent.Update: {
      const id = Number(formData.get('id'))
      const text = formData.get('text')
      if (Number.isNaN(id) || typeof text !== 'string') return currentTodos
      const trimmed = text.trim()
      if (!trimmed) return currentTodos
      const newTodos = currentTodos.map((t) =>
        t.id === id ? { ...t, text: trimmed } : t,
      )
      saveToStorage(newTodos)
      return newTodos
    }
    default:
      return currentTodos
  }
}

export function countRemaining(todos: TodoItem[]): number {
  return todos.filter((t) => !t.completed).length
}
