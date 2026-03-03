import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { countRemaining, loader, type TodoItem } from './data'
import { resetTodos, server } from './mocks'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetTodos()
})

afterAll(() => server.close())

describe('loader', () => {
  it('returns todos from API', async () => {
    const todos: TodoItem[] = [{ id: 1, text: 'Test todo', completed: false }]
    resetTodos(todos)

    const result = await loader()
    expect(result).toEqual(todos)
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
