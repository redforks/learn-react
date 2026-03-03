import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import type { TodoItem } from './data'

let todos: TodoItem[] = []

export function resetTodos(initialTodos: TodoItem[] = []) {
  todos = [...initialTodos]
}

export const handlers = [
  http.get('/api/todos', () => {
    return HttpResponse.json(todos)
  }),

  http.post('/api/todos', async ({ request }) => {
    const body = (await request.json()) as { text: string }
    const newTodo: TodoItem = {
      id: Date.now(),
      text: body.text.trim(),
      completed: false,
    }
    todos.push(newTodo)
    return HttpResponse.json(newTodo)
  }),

  http.put('/api/todos/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as { text: string }

    const index = todos.findIndex((t) => t.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    todos[index] = { ...todos[index], text: body.text.trim() }
    return HttpResponse.json(todos[index])
  }),

  http.patch('/api/todos/:id/toggle', ({ params }) => {
    const id = Number(params.id)
    const index = todos.findIndex((t) => t.id === id)

    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    todos[index] = { ...todos[index], completed: !todos[index].completed }
    return HttpResponse.json(todos[index])
  }),

  http.delete('/api/todos/:id', ({ params }) => {
    const id = Number(params.id)
    todos = todos.filter((t) => t.id !== id)
    return HttpResponse.json({ success: true })
  }),
]

export const server = setupServer(...handlers)
