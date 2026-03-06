import ky from 'ky'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export type TodoItem = {
  id: number
  text: string
  completed: boolean
}

export function countRemaining(todos: TodoItem[]): number {
  return todos.filter((t) => !t.completed).length
}

const createSchema = zfd.formData({
  text: zfd.text(z.string().trim().min(1)),
})

const deleteSchema = zfd.formData({
  id: zfd.numeric(z.number().int().positive()),
})

const toggleSchema = zfd.formData({
  id: zfd.numeric(z.number().int().positive()),
})

const updateSchema = zfd.formData({
  id: zfd.numeric(z.number().int().positive()),
  text: zfd.text(z.string().trim().min(1)),
})

const api = ky.create({ prefixUrl: '/api/todos' })

export async function loader(): Promise<TodoItem[]> {
  return api.get('').json<TodoItem[]>()
}

export async function createAction(formData: FormData) {
  const result = createSchema.safeParse(formData)
  if (!result.success) return
  return api.post('', { json: { text: result.data.text } }).json<TodoItem>()
}

export async function deleteAction(formData: FormData) {
  const result = deleteSchema.safeParse(formData)
  if (!result.success) return
  return api.delete(`${result.data.id}`).json<{ success: boolean }>()
}

export async function toggleAction(formData: FormData) {
  const result = toggleSchema.safeParse(formData)
  if (!result.success) return
  return api.patch(`${result.data.id}/toggle`).json<TodoItem>()
}

export async function updateAction(formData: FormData) {
  const result = updateSchema.safeParse(formData)
  if (!result.success) return
  return api
    .put(`${result.data.id}`, { json: { text: result.data.text } })
    .json<TodoItem>()
}
