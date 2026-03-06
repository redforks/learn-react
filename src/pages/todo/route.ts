import { createRoute } from '@tanstack/react-router'
import { layoutRoute } from '../../routes'
import { Todo } from './components'
import { loader } from './data'

export const todoRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'todo',
  component: Todo,
  loader: () => loader(),
})
