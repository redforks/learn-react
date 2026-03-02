import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  action,
  countRemaining,
  Intent,
  loader,
  STORAGE_KEY,
  type TodoItem,
} from './data'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

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
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('returns empty array when no todos in storage', () => {
    const result = loader()
    expect(result).toEqual([])
  })

  it('returns todos from storage', () => {
    const todos: TodoItem[] = [{ id: 1, text: 'Test todo', completed: false }]
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(todos))

    const result = loader()
    expect(result).toEqual(todos)
  })

  it('returns empty array on invalid JSON', () => {
    localStorageMock.setItem(STORAGE_KEY, 'invalid json')

    const result = loader()
    expect(result).toEqual([])
  })
})

describe('action', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe(Intent.Create, () => {
    it('creates a new todo', async () => {
      const formData = createFormData({
        intent: Intent.Create,
        text: 'New todo',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result).toHaveLength(1)
      expect(result[0].text).toBe('New todo')
      expect(result[0].completed).toBe(false)
      expect(typeof result[0].id).toBe('number')
    })

    it('trims whitespace from text', async () => {
      const formData = createFormData({
        intent: Intent.Create,
        text: '  Trimmed todo  ',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result[0].text).toBe('Trimmed todo')
    })

    it('returns current todos if text is empty', async () => {
      const formData = createFormData({
        intent: Intent.Create,
        text: '   ',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result).toEqual([])
    })

    it('returns current todos if text is not a string', async () => {
      const formData = new FormData()
      formData.append('intent', Intent.Create)
      formData.append('text', new Blob(['test']) as unknown as string)

      const result = await action({ request: createRequest(formData) })
      expect(result).toEqual([])
    })
  })

  describe(Intent.Delete, () => {
    it('deletes a todo by id', async () => {
      const existing: TodoItem[] = [
        { id: 1, text: 'Keep me', completed: false },
        { id: 2, text: 'Delete me', completed: true },
      ]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Delete,
        id: '2',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })

    it('returns current todos if id is NaN', async () => {
      const existing: TodoItem[] = [{ id: 1, text: 'Test', completed: false }]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Delete,
        id: 'invalid',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result).toEqual(existing)
    })
  })

  describe(Intent.Toggle, () => {
    it('toggles todo completed status', async () => {
      const existing: TodoItem[] = [
        { id: 1, text: 'Toggle me', completed: false },
      ]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Toggle,
        id: '1',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result[0].completed).toBe(true)
    })

    it('toggles from completed to uncompleted', async () => {
      const existing: TodoItem[] = [
        { id: 1, text: 'Toggle me', completed: true },
      ]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Toggle,
        id: '1',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result[0].completed).toBe(false)
    })

    it('returns current todos if id is NaN', async () => {
      const existing: TodoItem[] = [{ id: 1, text: 'Test', completed: false }]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Toggle,
        id: 'invalid',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result).toEqual(existing)
    })
  })

  describe(Intent.Update, () => {
    it('updates todo text', async () => {
      const existing: TodoItem[] = [
        { id: 1, text: 'Old text', completed: false },
      ]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Update,
        id: '1',
        text: 'New text',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result[0].text).toBe('New text')
      expect(result[0].completed).toBe(false)
    })

    it('trims whitespace from text', async () => {
      const existing: TodoItem[] = [
        { id: 1, text: 'Old text', completed: false },
      ]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Update,
        id: '1',
        text: '  Trimmed  ',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result[0].text).toBe('Trimmed')
    })

    it('returns current todos if text is empty', async () => {
      const existing: TodoItem[] = [
        { id: 1, text: 'Old text', completed: false },
      ]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Update,
        id: '1',
        text: '   ',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result[0].text).toBe('Old text')
    })

    it('returns current todos if id is NaN', async () => {
      const existing: TodoItem[] = [{ id: 1, text: 'Test', completed: false }]
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

      const formData = createFormData({
        intent: Intent.Update,
        id: 'invalid',
        text: 'New text',
      })
      const result = await action({ request: createRequest(formData) })

      expect(result).toEqual(existing)
    })
  })

  it('returns current todos for unknown intent', async () => {
    const existing: TodoItem[] = [{ id: 1, text: 'Test', completed: false }]
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(existing))

    const formData = createFormData({
      intent: 'unknown',
    })
    const result = await action({ request: createRequest(formData) })

    expect(result).toEqual(existing)
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
