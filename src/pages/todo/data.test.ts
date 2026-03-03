import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { action, countRemaining, Intent, loader, type TodoItem } from './data'
import { resetTodos, server } from './mocks'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetTodos()
})

afterAll(() => server.close())

function createFormData(data: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value)
  }
  return formData
}

function createRequest(formData: FormData): Request {
  return new Request('http://localhost', {
    method: 'POST',
    body: formData,
  })
}

describe('loader', () => {
  it('returns todos from API', async () => {
    const todos: TodoItem[] = [{ id: 1, text: 'Test todo', completed: false }]
    resetTodos(todos)

    const result = await loader()
    expect(result).toEqual(todos)
  })
})

describe('action', () => {
  it('handles Create intent', async () => {
    const formData = createFormData({ intent: Intent.Create, text: 'New todo' })
    const result = await action({ request: createRequest(formData) })

    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('New todo')
  })

  it('handles Delete intent', async () => {
    resetTodos([
      { id: 1, text: 'Keep', completed: false },
      { id: 2, text: 'Delete', completed: false },
    ])
    const formData = createFormData({ intent: Intent.Delete, id: '2' })
    const result = await action({ request: createRequest(formData) })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('handles Toggle intent', async () => {
    resetTodos([{ id: 1, text: 'Test', completed: false }])
    const formData = createFormData({ intent: Intent.Toggle, id: '1' })
    const result = await action({ request: createRequest(formData) })

    expect(result[0].completed).toBe(true)
  })

  it('handles Update intent', async () => {
    resetTodos([{ id: 1, text: 'Old', completed: false }])
    const formData = createFormData({
      intent: Intent.Update,
      id: '1',
      text: 'New',
    })
    const result = await action({ request: createRequest(formData) })

    expect(result[0].text).toBe('New')
  })

  it('returns current todos for unknown intent', async () => {
    resetTodos([{ id: 1, text: 'Test', completed: false }])
    const formData = createFormData({ intent: 'unknown' })
    const result = await action({ request: createRequest(formData) })

    expect(result).toEqual([{ id: 1, text: 'Test', completed: false }])
  })
})

describe('countRemaining', () => {
  it('returns 0 for empty array', () => {
    expect(countRemaining([])).toBe(0)
  })

  it('counts uncompleted todos', () => {
    const todos: TodoItem[] = [
      { id: 1, text: 'One', completed: false },
      { id: 2, text: 'Two', completed: true },
      { id: 3, text: 'Three', completed: false },
    ]
    expect(countRemaining(todos)).toBe(2)
  })

  it('returns 0 when all todos are completed', () => {
    const todos: TodoItem[] = [
      { id: 1, text: 'One', completed: true },
      { id: 2, text: 'Two', completed: true },
    ]
    expect(countRemaining(todos)).toBe(0)
  })
})
