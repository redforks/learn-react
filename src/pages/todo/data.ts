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
}): Promise<TodoItem[]> {
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case Intent.Create: {
      const text = formData.get('text')
      if (typeof text !== 'string') return fetchTodos()
      const trimmed = text.trim()
      if (!trimmed) return fetchTodos()
      await createTodo(trimmed)
      return fetchTodos()
    }
    case Intent.Delete: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return fetchTodos()
      await deleteTodo(id)
      return fetchTodos()
    }
    case Intent.Toggle: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return fetchTodos()
      await toggleTodo(id)
      return fetchTodos()
    }
    case Intent.Update: {
      const id = Number(formData.get('id'))
      const text = formData.get('text')
      if (Number.isNaN(id) || typeof text !== 'string') return fetchTodos()
      const trimmed = text.trim()
      if (!trimmed) return fetchTodos()
      await updateTodo(id, trimmed)
      return fetchTodos()
    }
    default:
      return fetchTodos()
  }
}
