import ky from 'ky'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

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

const createSchema = zfd.formData({
  intent: zfd.text(z.literal(Intent.Create)),
  text: zfd.text(z.string().trim().min(1)),
})

const deleteSchema = zfd.formData({
  intent: zfd.text(z.literal(Intent.Delete)),
  id: zfd.numeric(z.number().int().positive()),
})

const toggleSchema = zfd.formData({
  intent: zfd.text(z.literal(Intent.Toggle)),
  id: zfd.numeric(z.number().int().positive()),
})

const updateSchema = zfd.formData({
  intent: zfd.text(z.literal(Intent.Update)),
  id: zfd.numeric(z.number().int().positive()),
  text: zfd.text(z.string().trim().min(1)),
})

const api = ky.create({ prefixUrl: '/api/todos' })

export async function loader(): Promise<TodoItem[]> {
  return api.get('').json<TodoItem[]>()
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case Intent.Create: {
      const result = createSchema.safeParse(formData)
      if (!result.success) return
      return api.post('', { json: { text: result.data.text } }).json<TodoItem>()
    }
    case Intent.Delete: {
      const result = deleteSchema.safeParse(formData)
      if (!result.success) return
      return api.delete(`${result.data.id}`).json<{ success: boolean }>()
    }
    case Intent.Toggle: {
      const result = toggleSchema.safeParse(formData)
      if (!result.success) return
      return api.patch(`${result.data.id}/toggle`).json<TodoItem>()
    }
    case Intent.Update: {
      const result = updateSchema.safeParse(formData)
      if (!result.success) return
      return api
        .put(`${result.data.id}`, { json: { text: result.data.text } })
        .json<TodoItem>()
    }
    default:
      return
  }
}
