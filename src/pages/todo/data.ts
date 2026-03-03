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

const api = ky.create({ prefixUrl: '/api/todos' })

export async function loader(): Promise<TodoItem[]> {
  return api.get('').json<TodoItem[]>()
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
      return api.post('', { json: { text: trimmed } }).json<TodoItem>()
    }
    case Intent.Delete: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return
      await api.delete(`${id}`).json<{ success: boolean }>()
      return undefined
    }
    case Intent.Toggle: {
      const id = Number(formData.get('id'))
      if (Number.isNaN(id)) return
      return api.patch(`${id}/toggle`).json<TodoItem>()
    }
    case Intent.Update: {
      const id = Number(formData.get('id'))
      const text = formData.get('text')
      if (Number.isNaN(id) || typeof text !== 'string') return
      const trimmed = text.trim()
      if (!trimmed) return
      return api.put(`${id}`, { json: { text: trimmed } }).json<TodoItem>()
    }
    default:
      return
  }
}
