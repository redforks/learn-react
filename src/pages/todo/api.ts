import type { TodoItem } from './types'

const API_BASE = '/api/todos'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

export async function fetchTodos(): Promise<TodoItem[]> {
  const response = await fetch(API_BASE)
  return handleResponse<TodoItem[]>(response)
}

export async function createTodo(text: string): Promise<TodoItem> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  })
  return handleResponse<TodoItem>(response)
}

export async function updateTodo(id: number, text: string): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  })
  return handleResponse<TodoItem>(response)
}

export async function toggleTodo(id: number): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/${id}/toggle`, {
    method: 'PATCH',
  })
  return handleResponse<TodoItem>(response)
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  await handleResponse<{ success: boolean }>(response)
}
