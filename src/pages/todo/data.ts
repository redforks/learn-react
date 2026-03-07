import ky from 'ky'
import { z } from 'zod'

export type TodoItem = {
  id: number
  text: string
  completed: boolean
}

export function countRemaining(todos: TodoItem[]): number {
  return todos.filter((t) => !t.completed).length
}

const createSchema = z.object({
  text: z.string().trim().min(1),
})

const deleteSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const toggleSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  text: z.string().trim().min(1),
})

const api = ky.create({ prefixUrl: '/api/todos' })

export async function loader(): Promise<TodoItem[]> {
  return api.get('').json<TodoItem[]>()
}

export async function createAction(formData: FormData) {
  const result = createSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return
  return api.post('', { json: { text: result.data.text } }).json<TodoItem>()
}

export async function deleteAction(formData: FormData) {
  const result = deleteSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return
  return api.delete(`${result.data.id}`).json<{ success: boolean }>()
}

export async function toggleAction(formData: FormData) {
  const result = toggleSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return
  return api.patch(`${result.data.id}/toggle`).json<TodoItem>()
}

export async function updateAction(formData: FormData) {
  const result = updateSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return
  return api
    .put(`${result.data.id}`, { json: { text: result.data.text } })
    .json<TodoItem>()
}
