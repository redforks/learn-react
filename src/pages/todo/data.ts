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

type CreateInput = z.infer<typeof createSchema>
type DeleteInput = z.infer<typeof deleteSchema>
type ToggleInput = z.infer<typeof toggleSchema>
type UpdateInput = z.infer<typeof updateSchema>

const api = ky.create({ prefixUrl: '/api/todos' })

export async function loader(): Promise<TodoItem[]> {
  return api.get('').json<TodoItem[]>()
}

async function handleCreate(input: CreateInput): Promise<TodoItem> {
  return api.post('', { json: { text: input.text } }).json<TodoItem>()
}

async function handleDelete(input: DeleteInput): Promise<undefined> {
  await api.delete(`${input.id}`).json<{ success: boolean }>()
  return undefined
}

async function handleToggle(input: ToggleInput): Promise<TodoItem> {
  return api.patch(`${input.id}/toggle`).json<TodoItem>()
}

async function handleUpdate(input: UpdateInput): Promise<TodoItem> {
  return api.put(`${input.id}`, { json: { text: input.text } }).json<TodoItem>()
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
      const result = createSchema.safeParse(formData)
      if (!result.success) return
      return handleCreate(result.data)
    }
    case Intent.Delete: {
      const result = deleteSchema.safeParse(formData)
      if (!result.success) return
      return handleDelete(result.data)
    }
    case Intent.Toggle: {
      const result = toggleSchema.safeParse(formData)
      if (!result.success) return
      return handleToggle(result.data)
    }
    case Intent.Update: {
      const result = updateSchema.safeParse(formData)
      if (!result.success) return
      return handleUpdate(result.data)
    }
    default:
      return
  }
}
