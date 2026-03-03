import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { resetTodos, server } from '../pages/todo/mocks/node'

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  resetTodos()
})

afterAll(() => server.close())

export { resetTodos }
