import {
  createTodo,
  deleteTodo,
  fetchTodos,
  toggleTodo,
  updateTodo,
} from './api'
import { countRemaining, Intent, type TodoItem } from './types'

export { Intent, type TodoItem, countRemaining }

export async function loader(): Promise<TodoItem[]> {
  return fetchTodos()
}

export async function action({
  request,
}: {
  request: Request
}): Promise<TodoItem | void> {
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
