import { setupServer } from 'msw/node'
import { handlers, resetTodos } from './handlers'

export const server = setupServer(...handlers)
export { resetTodos }
