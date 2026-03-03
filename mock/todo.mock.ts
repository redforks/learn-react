import { defineMock, defineMockData } from 'vite-plugin-mock-dev-server'
import type { TodoItem } from '../src/pages/todo/types'

// Use defineMockData for shared state across mock handlers
const todos = defineMockData<TodoItem[]>('todos', [])

export default defineMock([
  {
    url: '/api/todos',
    method: 'GET',
    body: () => todos.value,
  },
  {
    url: '/api/todos',
    method: 'POST',
    body: (request) => {
      const { text } = request.body as { text: string }
      const newTodo: TodoItem = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
      }
      todos.value.push(newTodo)
      return newTodo
    },
  },
  {
    url: '/api/todos/:id',
    method: 'PUT',
    body: (request) => {
      const id = Number(request.params.id)
      const { text } = request.body as { text: string }
      const index = todos.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.value[index] = { ...todos.value[index], text: text.trim() }
        return todos.value[index]
      }
      return { error: 'Not found' }
    },
  },
  {
    url: '/api/todos/:id/toggle',
    method: 'PATCH',
    body: (request) => {
      const id = Number(request.params.id)
      const index = todos.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.value[index] = {
          ...todos.value[index],
          completed: !todos.value[index].completed,
        }
        return todos.value[index]
      }
      return { error: 'Not found' }
    },
  },
  {
    url: '/api/todos/:id',
    method: 'DELETE',
    body: (request) => {
      const id = Number(request.params.id)
      todos.value = todos.value.filter((t) => t.id !== id)
      return { success: true }
    },
  },
])
