import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../routes'
import { Todo } from './components'
import { loader } from './data'

export const todoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todo',
  component: Todo,
  loader: () => loader(),
})
